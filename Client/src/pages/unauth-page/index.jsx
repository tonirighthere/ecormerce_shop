import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

function UnauthPage() {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-red-500 to-orange-700 text-white">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center"
      >
        <Card className="bg-white text-gray-800 shadow-2xl">
          <CardHeader className="text-center">
            <motion.div
              initial={{ y: -30 }}
              animate={{ y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lock className="w-16 h-16 text-yellow-600 mx-auto" />
            </motion.div>
            <CardTitle className="text-6xl font-extrabold text-gray-900 mt-4">
              Access Denied
            </CardTitle>
            <CardDescription className="text-gray-500">
              You don't have permission to view this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 px-6 pb-6">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-600"
            >
              Sorry, but you do not have access to this page. Please check your
              permissions or contact support if needed.
            </motion.p>
            <div className="space-x-4">
              <Button
                onClick={() => navigate("/")}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                Go Back Home
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-indigo-600 text-indigo-600 hover:bg-indigo-600 hover:text-white"
              >
                <a href="mailto:dineshwonks@gmail.com">Contact Support</a>
              </Button>
            </div>
          </CardContent>
        </Card>
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="mt-6"
        >
        
        </motion.div>
      </motion.div>
    </div>
  );
}

export default UnauthPage;
