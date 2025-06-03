import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, updateUserRole } from "@/store/admin/users-slice";

function AdminUsersView() {
  const dispatch = useDispatch();
  const { users, loading, error, totalPages, currentPage } = useSelector(
    (state) => state.adminUsers
  );
  const [editingUserId, setEditingUserId] = useState(null);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage }));
  }, [dispatch, currentPage]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      dispatch(fetchUsers({ page }));
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, newRole })).unwrap();
      setEditingUserId(null);
    } catch (err) {
      console.error("Lỗi khi cập nhật vai trò:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!users || !Array.isArray(users)) {
    return <div>Không có dữ liệu người dùng</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user._id} className="border p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <h3 className="font-bold text-lg">{user.userName || "Chưa có tên"}</h3>
            <p className="text-gray-600">{user.email}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-gray-500">Role: </p>
              {editingUserId === user._id ? (
                <select
                  defaultValue={user.role}
                  onChange={(e) => handleRoleChange(user._id, e.target.value)}
                  className="border rounded px-2 py-1 text-sm"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              ) : (
                <>
                  <span>{user.role || "Người dùng"}</span>
                  <button
                    onClick={() => setEditingUserId(user._id)}
                    className="ml-2 text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Chỉnh sửa
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 gap-4">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`px-4 py-2 border rounded ${
            currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white text-blue-500"
          }`}
        >
          Prev
        </button>
        <span className="text-sm">
          Page {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 border rounded ${
            currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-white text-blue-500"
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default AdminUsersView;