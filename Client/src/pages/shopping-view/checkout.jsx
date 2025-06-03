import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/cart-items-content";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { useToast } from "@/hooks/use-toast";
import { numberFormat } from "@/utils/numberFormat";
import { useNavigate } from "react-router-dom"; // Thêm import này để sử dụng điều hướng

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");
  const dispatch = useDispatch();
  const { toast } = useToast();
  const navigate = useNavigate(); // Thêm hook useNavigate để điều hướng

  const totalCartAmountInVND =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce((sum, currentItem) => {
          const price = Number(currentItem?.price) || 0;
          const discountPercentage = Number(currentItem?.salePrice) || 0;
          const finalPricePerUnit = price * (1 - discountPercentage / 100);
          const quantity = Number(currentItem?.quantity) || 1;
          const itemTotal = finalPricePerUnit * quantity;
          return sum + itemTotal;
        }, 0)
      : 0;

  const EXCHANGE_RATE = 25000;
  const estimatedTotalInUSD = Number((totalCartAmountInVND / EXCHANGE_RATE).toFixed(2));

  function handleInitiatePayment() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast({
        title: "Cart is empty. Please add products to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (!currentSelectedAddress) {
      toast({
        title: "Please select an address to proceed.",
        variant: "destructive",
      });
      return;
    }
    if (!user?.id) {
      toast({
        title: "User information not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }
    if (!cartItems?._id) {
      toast({
        title: "Cart not found. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const orderData = {
      userId: user.id,
      cartId: cartItems._id,
      cartItems: cartItems.items.map((singleCartItem) => {
        const priceInVND = Number(singleCartItem?.price) || 0;
        const discountPercentage = Number(singleCartItem?.salePrice) || 0;
        const finalPriceInVND = priceInVND * (1 - discountPercentage / 100);
        return {
          productId: singleCartItem?.productId || "",
          title: singleCartItem?.title || "",
          image: singleCartItem?.image || "",
          price: Number(finalPriceInVND.toFixed(2)),
          quantity: Math.floor(Number(singleCartItem?.quantity)) || 1,
        };
      }),
      addressInfo: {
        addressId: currentSelectedAddress?._id || "",
        address: currentSelectedAddress?.address || "",
        city: currentSelectedAddress?.city || "",
        pincode: currentSelectedAddress?.pincode || "",
        phone: currentSelectedAddress?.phone || "",
        notes: currentSelectedAddress?.notes || "",
      },
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      totalAmount: Number(totalCartAmountInVND.toFixed(2)),
      orderDate: new Date().toISOString(),
      orderUpdateDate: new Date().toISOString(),
      paymentId: "",
      payerId: "",
    };

    console.log("Order Data sent to server:", orderData);
    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData))
      .then((data) => {
        if (data?.payload?.success) {
          if (paymentMethod === "cod") {
            toast({
              title: "Order created successfully!",
              description: "You will pay upon delivery.",
            });
            // Chuyển hướng đến trang Payment Success
            navigate("/shop/payment-success");
          } else if (data?.payload?.approvalURL) {
            console.log("Redirecting to PayPal:", data.payload.approvalURL);
            window.location.href = data.payload.approvalURL;
          }
        } else {
          toast({
            title: "Error creating order",
            variant: "destructive",
            description:
              data?.payload?.message ||
              data?.payload?.error?.[0]?.issue ||
              "Unknown error",
          });
        }
      })
      .catch((error) => {
        toast({
          title: "Error creating order",
          variant: "destructive",
          description: error.message || "An unexpected error occurred",
        });
      })
      .finally(() => {
        setIsPaymentStart(false);
      });
  }

  if (approvalURL && typeof approvalURL === "string" && approvalURL.startsWith("https://") && paymentMethod === "paypal") {
    console.log("Redirecting to PayPal:", approvalURL);
    window.location.href = approvalURL;
  } else if (approvalURL && paymentMethod === "paypal") {
    console.error("Invalid approvalURL:", approvalURL);
    toast({
      title: "Error: Invalid payment URL",
      variant: "destructive",
    });
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0 ? (
            cartItems.items.map((item) => (
              <UserCartItemsContent key={item.productId} cartItem={item} />
            ))
          ) : (
            <div>Cart is empty</div>
          )}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total (VND)</span>
              <span className="font-bold">{numberFormat(totalCartAmountInVND)}đ</span>
            </div>
            {paymentMethod === "paypal" && (
              <div className="flex justify-between">
                <span className="font-bold">Estimated (USD - PayPal Payment)</span>
                <span className="font-bold">{estimatedTotalInUSD} USD</span>
              </div>
            )}
            {paymentMethod === "paypal" && (
              <p className="text-sm text-gray-500">
                Payment will be made in USD with an exchange rate of 1 USD = {EXCHANGE_RATE} VND.
              </p>
            )}
            <div className="mt-4">
              <label className="font-bold">Payment Method</label>
              <div className="flex gap-4 mt-2">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="paypal"
                    checked={paymentMethod === "paypal"}
                    onChange={() => setPaymentMethod("paypal")}
                  />
                  PayPal
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                  />
                  Cash on Delivery
                </label>
              </div>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button
              onClick={handleInitiatePayment}
              className="w-full"
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Processing..."
                : paymentMethod === "cod"
                ? "Place Order (Cash on Delivery)"
                : "Pay with PayPal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;