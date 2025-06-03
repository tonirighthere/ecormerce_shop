import React, { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { numberFormat } from "@/utils/numberFormat";

function AdminProductTile({
  products = [],
  setFormData,
  setOpenCreateProductsDialog,
  setCurrentEditedId,
  handleDelete,
  handleView,
  page = 1,
  totalPages = 1,
  onPageChange,
}) {
  const [inputPage, setInputPage] = useState(page);

  useEffect(() => {
    setInputPage(page);
  }, [page]);

  const handleDeleteClick = (id) => {
    if (window.confirm("Do you want to delete this product?")) {
      handleDelete(id);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== page) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="w-full flex justify-center">
      <div className="w-full max-w-7xl">
        <table className="min-w-[1200px] w-full bg-white rounded-lg shadow">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">Product ID</th>
              <th className="px-4 py-2 text-left">Name</th>
              <th className="px-4 py-2 text-left w-[400px]">Description</th>
              <th className="px-4 py-2 text-left">Image</th>
              <th className="px-4 py-2 text-left">Price</th>
              <th className="px-4 py-2 text-left">Total stock</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500">
                  No products found.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 text-blue-600 font-semibold cursor-pointer">
                    #{product.code || product._id?.slice(0, 6).toUpperCase()}
                  </td>
                  <td className="px-4 py-2">{product.title}</td>
                  <td className="px-4 py-2 w-[400px]">
                    <span className="block">{product.description}</span>
                  </td>
                  <td className="px-4 py-2">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                  </td>
                  <td className="px-4 py-2 font-bold">
                    {product.salePrice > 0
                      ? `${numberFormat((product.price - (product.price * product.salePrice) / 100))}₫`
                      : product.price}
                  </td>
                  <td className="px-4 py-2 w-[100px]">{product.stock || product.totalStock}</td>
                  <td className="px-4 py-2 flex gap-2">
                    {handleView && (
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                        onClick={() => handleView(product)}
                      >
                        <span className="mr-1">View</span>
                        <span role="img" aria-label="view">👁️</span>
                      </Button>
                    )}
                    <Button
                      className="bg-green-400 hover:bg-green-500 text-black"
                      onClick={() => {
                        setOpenCreateProductsDialog(true);
                        setCurrentEditedId(product._id);
                        setFormData(product);
                      }}
                    >
                      <span className="mr-1">Edit</span>
                      <span role="img" aria-label="edit">✏️</span>
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      onClick={() => handleDeleteClick(product._id)}
                    >
                      <span className="mr-1">Delete</span>
                      <span role="img" aria-label="delete">🗑️</span>
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* Hiển thị phân trang chỉ khi có sản phẩm */}
        {products.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-4">
            <Button
              className="bg-gray-200 text-black"
              disabled={page <= 1}
              onClick={() => handlePageChange(page - 1)}
            >
              Prev
            </Button>
            <span>
              Page{" "}
              <input
                type="number"
                min={1}
                max={totalPages}
                value={inputPage}
                onChange={(e) => setInputPage(e.target.value)}
                onBlur={() => {
                  const num = Number(inputPage);
                  if (num >= 1 && num <= totalPages && num !== page) {
                    handlePageChange(num);
                  } else {
                    setInputPage(page);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const num = Number(inputPage);
                    if (num >= 1 && num <= totalPages && num !== page) {
                      handlePageChange(num);
                    }
                  }
                }}
                className="w-12 text-center border rounded mx-1"
              />{" "}
              of {totalPages}
            </span>
            <Button
              className="bg-gray-200 text-black"
              disabled={page >= totalPages}
              onClick={() => handlePageChange(page + 1)}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminProductTile;