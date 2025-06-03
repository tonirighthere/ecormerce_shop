import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/shopping-view/pagination";


function SearchProducts() {
  const [inputValue, setInputValue] = useState(""); 
  const [keyword, setKeyword] = useState("");
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [hasSearched, setHasSearched] = useState(false); // New state
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const limit = 12;

  useEffect(() => {
    if (keyword && keyword.trim().length > 1) {
      setHasSearched(true);
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(getSearchResults(keyword));
    } else if (keyword === "") {
      setSearchParams(new URLSearchParams(`?keyword=`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);

  function handleInputKeyDown(e) {
    if (e.key === "Enter") {
      setKeyword(inputValue);
    }
  }

  function handleSearchClick() {
    setKeyword(inputValue);
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: "destructive",
          });

          return;
        }
      }
    }

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
  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  console.log(searchResults, "searchResults");

  const { pagination } = useSelector((state) => state.shopSearch);

  useEffect(() => {
    if (keyword && keyword.trim().length >= 3) {
      setHasSearched(true);
      setSearchParams(new URLSearchParams(`?keyword=${keyword}&page=${page}`));
      dispatch(getSearchResults({ keyword, page, limit }));
    } else if (keyword === "") {
      setSearchParams(new URLSearchParams(`?keyword=`));
      dispatch(resetSearchResults());
    }
  }, [keyword, page]);

  function handlePageChange(newPage) {
    setPage(newPage);
  }

  return (
    <div className="container mx-auto md:px-6 px-4 py-8 mt-16">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center gap-2">
          <Input
            value={inputValue}
            name="keyword"
            onChange={(event) => setInputValue(event.target.value)}
            onKeyDown={handleInputKeyDown}
            className="py-6"
            placeholder="Search Products..."
          />
          <Button 
            onClick={handleSearchClick}
            className="bg-red-500 text-white hover:bg-red-600"
          >Tìm kiếm</Button>
        </div>
      </div>
      {!hasSearched && (
        <p className="text-center text-lg text-muted-foreground m-20">
          Search for the Products you are Looking for!
        </p>
      )}
      {!searchResults.length && hasSearched ? (
        <div className="flex justify-center items-center h-40">
          {/* Add your loading animation here */}
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-primary"></div>
        </div>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddtoCart={handleAddtoCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchProducts;
