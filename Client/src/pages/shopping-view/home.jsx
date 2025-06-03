import { Button } from "@/components/ui/button";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useNavigate } from "react-router-dom";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { useToast } from "@/hooks/use-toast";
import ProductDetailsDialog from "@/components/shopping-view/product-details";
import { getFeatureImages } from "@/store/common-slice";
import {
  Smartphone,
  Laptop,
  Tablet,
  WatchIcon,
  Headphones,
} from "lucide-react";
import {
  SiApple,
  SiSamsung,
  SiXiaomi,
  SiDell,
  SiHuawei,
  SiAsus,
} from "react-icons/si";
import deliveryIcon from '../../assets/icons/delivery.png';
import supportIcon from "@/assets/icons/support.png";
import returnIcon from "@/assets/icons/return.png";

const categoriesWithIcon = [
  { id: "smartphones", label: "Smartphones", icon: Smartphone },
  { id: "laptop", label: "Laptop", icon: Laptop },
  { id: "tablets", label: "Tablets", icon: Tablet },
  { id: "smartwatch", label: "Smartwatch", icon: WatchIcon },
  { id: "headphones", label: "Headphones", icon: Headphones },
];

const brandsWithIcon = [
  { id: "apple", label: "Apple", icon: SiApple },
  { id: "samsung", label: "Samsung", icon: SiSamsung },
  { id: "xiaomi", label: "Xiaomi", icon: SiXiaomi },
  { id: "dell", label: "Dell", icon: SiDell },
  { id: "huawei", label: "Huawei", icon: SiHuawei },
  { id: "asus", label: "Asus", icon: SiAsus },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList, productDetails } = useSelector((state) => state.shopProducts);
  const { featureImageList } = useSelector((state) => state.commonFeature);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleNavigateToListingPage = (getCurrentItem, section) => {
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shop/listing`);
  };

  const handleGetProductDetails = (getCurrentProductId) => {
    dispatch(fetchProductDetails(getCurrentProductId));
  };

  const handleAddtoCart = (getCurrentProductId) => {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
        });
      }
    });
  };

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [featureImageList]);

  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: "price-lowtohigh",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  return (
    <div className="flex flex-col min-h-screen pt-16">
      <div className="relative w-full h-[600px] overflow-hidden mt-8 rounded-lg">
        {featureImageList && featureImageList.map((slide, index) => (
          <img
            key={index}
            src={slide?.image}
            alt={`slide-${index}`}
            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${index === currentSlide ? "opacity-100" : "opacity-0"}`}
          />
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide - 1 + featureImageList.length) % featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length)
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => {
              const Icon = categoryItem.icon;
              return (
                <Card
                  key={categoryItem.id}
                  onClick={() => handleNavigateToListingPage(categoryItem, "category")}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon className="w-12 h-12 flex items-center justify-center" />
                    <span className="font-bold">{categoryItem.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => {
              const Icon = brandItem.icon;
              return (
                <Card
                  key={brandItem.id}
                  onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                >
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <Icon className="w-16 h-16 mb-4 text-primary" />
                    <span className="font-bold">{brandItem.label}</span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Our Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.slice(0, 12).map((productItem) => (
              <ShoppingProductTile
                key={productItem._id}
                handleGetProductDetails={handleGetProductDetails}
                product={productItem}
                handleAddtoCart={handleAddtoCart}
              />
            ))}
          </div>
          <div className="flex justify-center mt-10">
            <Button
              className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded"
              onClick={() => navigate("/shop/listing")}
            >
              See All Products
            </Button>
          </div>
        </div>
      </section>
      <section className="py-12 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-200 p-4">
                  <img src={deliveryIcon} alt="Giao hàng" className="w-12 h-12" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">GIAO HÀNG TIẾT KIỆM</h3>
              <p>Miễn phí cho các đơn hàng trên 5 triệu</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-200 p-4">
                  <img src={supportIcon} alt="Hỗ trợ" className="w-12 h-12 rounded-full" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">HỖ TRỢ KHÁCH HÀNG 24/7</h3>
              <p>Đội ngũ hỗ trợ khách hàng nhiệt tình 24/7</p>
            </div>
            <div>
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-gray-200 p-4">
                  <img src={returnIcon} alt="Đổi trả" className="w-12 h-12 rounded-full" />
                </div>
              </div>
              <h3 className="font-bold text-xl mb-2">CHÍNH SÁCH ĐỔI TRẢ</h3>
              <p>Chúng tôi sẽ trả tiền trong 30 ngày đầu</p>
            </div>
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
