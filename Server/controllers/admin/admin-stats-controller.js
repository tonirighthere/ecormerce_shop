const Product = require("../../models/Product");
const Order = require("../../models/Order");
const User = require("../../models/User");

const getAdminStats = async (req, res) => {
  try {
    
    const totalProducts = await Product.countDocuments();
    console.log("Total Products:", totalProducts);

    const totalOrders = await Order.countDocuments();
    console.log("Total Orders:", totalOrders);

    const totalUsers = await User.countDocuments();
    console.log("Total Users:", totalUsers);

    const orders = await Order.find();
    console.log("Orders:", orders);

    const totalSales = orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0);
    console.log("Total Sales:", totalSales);

    const productSales = {};
    orders.forEach(order => {
      if (order.cartItems && Array.isArray(order.cartItems)) {
        order.cartItems.forEach(item => {
          if (item?.title && item?.quantity) {
            if (!productSales[item.title]) productSales[item.title] = 0;
            productSales[item.title] += item.quantity;
          }
        });
      }
    });
    console.log("Product Sales:", productSales);

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({ name, count }));
    console.log("Top Products:", topProducts);

    const monthlyStats = {};
    orders.forEach(order => {
      if (order.orderDate) {
        const date = new Date(order.orderDate);
        if (!isNaN(date.getTime())) {
          const month = date.getMonth();
          const year = date.getFullYear();
          const key = `${month + 1}-${year}`;
          if (!monthlyStats[key]) monthlyStats[key] = { purchase: 0, sales: 0 };
          monthlyStats[key].purchase += 1;
          monthlyStats[key].sales += order.totalAmount || 0;
        }
      }
    });
    console.log("Monthly Stats:", monthlyStats);

    const purchaseSalesData = Object.entries(monthlyStats).map(([name, value]) => ({
      name,
      purchase: value.purchase,
      sales: value.sales,
    }));
    console.log("Purchase Sales Data:", purchaseSalesData);
    

    res.json({
      totalProducts,
      totalOrders,
      totalUsers,
      totalSales,
      topProducts,
      purchaseSalesData,
    });
  } catch (error) {
    console.error("Error fetching admin stats:", error);
    res.status(500).json({ message: "Error fetching admin stats", error: error.message });
  }
};

module.exports = { getAdminStats };
