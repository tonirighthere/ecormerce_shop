import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

function PaymentSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-green-500 to-teal-600 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <Card className="bg-white text-gray-800 shadow-xl rounded-lg">
          <CardHeader className="text-center p-6">
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto" />
            </motion.div>
            <CardTitle className="text-4xl font-extrabold mt-4 text-gray-900">
              Payment Successful!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 text-center space-y-4">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600 text-lg"
            >
              Your payment was successfully processed. You can now view your orders or continue shopping.
            </motion.p>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/shop/account")}
                className="bg-teal-600 hover:bg-teal-700 text-white"
              >
                View Orders
              </Button>
              <Button
                onClick={() => navigate("/shop/home")}
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-600 hover:text-white"
              >
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6 text-center"
        >
        
        </motion.div>
      </motion.div>
    </div>
  );
}

export default PaymentSuccessPage;
