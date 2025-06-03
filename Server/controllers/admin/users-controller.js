const User = require("../../models/user");
console.log("User model:", User);
const getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Lấy page và limit từ query params
    const skip = (page - 1) * limit;

    const users = await User.find({ role: "user" }) // Lọc chỉ những user có role là "user"
      .select("-password")
      .skip(skip)
      .limit(Number(limit));

    const totalUsers = await User.countDocuments({ role: "user" }); // Tổng số user

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Lỗi khi lấy thông tin người dùng" });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: "Vai trò không hợp lệ" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Lỗi khi cập nhật vai trò:", error);
    res.status(500).json({ message: "Lỗi khi cập nhật vai trò người dùng" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUserRole
};