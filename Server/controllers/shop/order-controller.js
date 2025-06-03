const paypal = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

// Fixed exchange rate (1 USD = 25,000 VND)
const EXCHANGE_RATE = 25000;

// Function to convert VND to USD
const convertVNDToUSD = (amountInVND) => {
  return Number((amountInVND / EXCHANGE_RATE).toFixed(2));
};

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
      cartId,
    } = req.body;

    // Validate input data
    if (!userId || !cartId || !cartItems || cartItems.length === 0 || !addressInfo || !totalAmount) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: userId, cartId, cartItems, addressInfo, totalAmount",
      });
    }

    // Verify totalAmount and cartItems (in VND)
    const calculatedTotalInVND = cartItems.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);

    if (Math.abs(calculatedTotalInVND - totalAmount) > 0.01) {
      return res.status(400).json({
        success: false,
        message: "Total amount does not match the product list (calculated in VND)",
      });
    }

    // Validate quantity and price format
    for (const item of cartItems) {
      if (!Number.isInteger(Number(item.quantity)) || Number(item.quantity) <= 0) {
        return res.status(400).json({
          success: false,
          message: `Quantity of product ${item.title} must be a positive integer`,
        });
      }
      if (Number(item.price) <= 0) {
        return res.status(400).json({
          success: false,
          message: `Price of product ${item.title} must be greater than 0 (in VND)`,
        });
      }
    }

    let approvalURL = null;
    let totalAmountInUSD = null;

    // Handle payment method
    if (paymentMethod === "paypal") {
      // Convert to USD for PayPal
      totalAmountInUSD_convertVNDToUSD(totalAmount);
      const cartItemsInUSD = cartItems.map((item) => ({
        ...item,
        price: convertVNDToUSD(item.price),
      }));

      const create_payment_json = {
        intent: "sale",
        payer: {
          payment_method: "paypal",
        },
        redirect_urls: {
          return_url: `${process.env.FRONTEND_URL}/shop/paypal-return`,
          cancel_url: `${process.env.FRONTEND_URL}/shop/paypal-cancel`,
        },
        transactions: [
          {
            item_list: {
              items: cartItemsInUSD.map((item) => ({
                name: item.title || "No title",
                sku: item.productId || "UNKNOWN",
                price: Number(item.price).toFixed(2).toString(),
                currency: "USD",
                quantity: Math.floor(Number(item.quantity)).toString(),
              })),
            },
            amount: {
              currency: "USD",
              total: Number(totalAmountInUSD).toFixed(2).toString(),
            },
            description: "Payment for order from store",
          },
        ],
      };

      // Retry logic for PayPal
      const maxRetries = 3;
      let retryCount = 0;

      const createPaypalPayment = () =>
        new Promise((resolve, reject) => {
          paypal.payment.create(create_payment_json, (error, paymentInfo) => {
            if (error) {
              reject(error);
            } else {
              resolve(paymentInfo);
            }
          });
        });

      let paymentInfo;
      while (retryCount < maxRetries) {
        try {
          paymentInfo = await createPaypalPayment();
          break;
        } catch (error) {
          retryCount++;
          if (retryCount === maxRetries) {
            console.error("PayPal error after retries:", {
              message: error.message,
              response: error.response,
              details: error.response?.details,
              debug_id: error.response?.debug_id,
            });
            return res.status(400).json({
              success: false,
              message: "Error creating PayPal payment after multiple attempts",
              error: error.response?.details || error.message,
            });
          }
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }

      approvalURL = paymentInfo.links.find(
        (link) => link.rel === "approval_url"
      ).href;
    } else if (paymentMethod === "cod") {
      // Cash on Delivery: No PayPal call, just create the order
      totalAmountInUSD = convertVNDToUSD(totalAmount); // Store USD amount for reference
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid payment method",
      });
    }

    // Create the order
    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems, // Store in VND
      addressInfo,
      orderStatus: paymentMethod === "cod" ? "confirmed" : orderStatus, // COD: confirmed immediately
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : paymentStatus, // COD: pending
      totalAmount, // Store in VND
      totalAmountInUSD, // Store USD amount for reference
      orderDate,
      orderUpdateDate,
      paymentId,
      payerId,
    });

    await newlyCreatedOrder.save();

    if (paymentMethod === "cod") {
      await Cart.findByIdAndDelete(cartId);
    }

    // Return response
    res.status(201).json({
      success: true,
      approvalURL, // null for COD
      orderId: newlyCreatedOrder._id,
    });
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({
      success: false,
      message: "Server error occurred",
    });
  }
};

const capturePayment = async (req, res) => {
  try {
    const { paymentId, payerId, orderId } = req.body;

    let order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order can not be found",
      });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.paymentId = paymentId;
    order.payerId = payerId;

    for (let item of order.cartItems) {
      let product = await Product.findById(item.productId);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Not enough stock for this product ${product.title}`,
        });
      }

      product.totalStock -= item.quantity;

      await product.save();
    }

    const getCartId = order.cartId;
    await Cart.findByIdAndDelete(getCartId);

    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed",
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found!",
      });
    }

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found!",
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      success: false,
      message: "Some error occurred!",
    });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};