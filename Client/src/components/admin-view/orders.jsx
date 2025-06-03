import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Dialog } from "../ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import AdminOrderDetailsView from "./order-details";
import { useDispatch, useSelector } from "react-redux";
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from "@/store/admin/order-slice";
import { Badge } from "../ui/badge";
import { useSearchParams } from "react-router-dom";
import { numberFormat } from "@/utils/numberFormat";

const ORDER_STATUS_OPTIONS = [
  { value: "all", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "inProcess", label: "In Process" },
  { value: "inShipping", label: "In Shipping" },
  { value: "delivered", label: "Delivered" },
  { value: "rejected", label: "Rejected" },
];

function AdminOrdersView() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialPage = parseInt(searchParams.get("page")) || 1;
  const [page, setPage] = useState(initialPage);

  const { orderList, orderDetails, totalPages } = useSelector((state) => state.adminOrder);

  const initialStatus = searchParams.get("status") || "all";
  const [statusFilter, setStatusFilter] = useState(initialStatus);

  useEffect(() => {
    const params = { page };
    if (statusFilter !== "all") {
      params.status = statusFilter;
    }
     dispatch(getAllOrdersForAdmin({ 
      page,
      status: statusFilter 
    }));
  }, [dispatch, page, statusFilter]);


  function handleFetchOrderDetails(getId) {
    dispatch(getOrderDetailsForAdmin(getId));
  }

  console.log(orderDetails, "orderList");

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);

  return (
    <Card className="bg-transparent shadow-none">
      {/* <CardContent className="p-4"> */}
        <div className="mb-4 flex items-center gap-4">
        <label className="font-medium">Filter by Status:</label>
        <select
          className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-black"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1); // Reset về trang 1 khi filter thay đổi
            setSearchParams({ page: 1, status: e.target.value });
          }}
        >
          {ORDER_STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
        <Table className="border rounded-xl overflow-hidden shadow bg-white">
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-bold text-lg text-left px-6 py-4 text-gray-600">Order ID</TableHead>
              <TableHead className="font-bold text-lg text-left px-6 py-4 text-gray-600">Order Date</TableHead>
              <TableHead className="font-bold text-lg text-left px-6 py-4 text-gray-600">Order Status</TableHead>
              <TableHead className="font-bold text-lg text-left px-6 py-4 text-gray-600">Order Price</TableHead>
              <TableHead className="font-bold text-lg text-left px-6 py-4 text-gray-600">
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem, idx) => (
                  <TableRow
                    key={orderItem?._id}
                    className={`${
                      idx !== orderList.length - 1 ? "border-b" : ""
                    } ${idx % 2 === 1 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <TableCell className="px-6 py-4 text-blue-600 font-semibold align-middle">
                      #{orderItem?._id?.slice(-6).toUpperCase()}
                    </TableCell>
                    <TableCell className="px-6 py-4 align-middle">{orderItem?.orderDate.split("T")[0]}</TableCell>
                    <TableCell className="px-6 py-4 align-middle">
                      <span
                        className="inline-block bg-black text-white font-semibold rounded-md px-5 py-2 shadow text-base text-center"
                        style={{ minWidth: 110 }}
                      >
                        {orderItem?.orderStatus === "inShipping"
                          ? "InShipping"
                          : orderItem?.orderStatus?.charAt(0).toUpperCase() +
                            orderItem?.orderStatus?.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 font-bold text-green-700 align-middle">
                      {numberFormat(orderItem?.totalAmount)}đ
                    </TableCell>
                    <TableCell className="px-6 py-4 align-middle">
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          className="bg-black text-white hover:bg-gray-800 font-semibold px-8 py-2 rounded-md text-base shadow"
                          onClick={() => handleFetchOrderDetails(orderItem?._id)}
                        >
                          View Details
                        </Button>
                        <AdminOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-gray-400">
                    No orders found.
                  </TableCell>
                </TableRow>
              )}
          </TableBody>
        </Table>
      {/* </CardContent> */}
      <div className="flex justify-center items-center gap-4 mt-6">
        <Button disabled={page <= 1} onClick={() => {
          const newPage = page - 1;
          setPage(newPage);
          setSearchParams({ page: newPage, status: statusFilter });
        }}>
          Prev
        </Button>
        <span>Page {page} / {totalPages}</span>
        <Button disabled={page >= totalPages} onClick={() => {
          const newPage = page + 1;
          setPage(newPage);
          setSearchParams({ page: newPage, status: statusFilter });
        }}>
          Next
        </Button> 
      </div>

    </Card>
  );
}

export default AdminOrdersView;