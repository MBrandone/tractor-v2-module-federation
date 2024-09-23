import {createBrowserRouter} from "react-router-dom";
import HomePage from "explore/HomePage";
import CategoryPage from "explore/CategoryPage";
import ProductPage from "decide/ProductPage";
import CartPage from "checkout/CartPage";
import Checkout from "checkout/Checkout";
import Thanks from "checkout/Thanks";
import StoresPage from "explore/StoresPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <HomePage/>,
    },
    {
        path: "/machines",
        element: <CategoryPage/>,
    },
    {
        path: "/machines/*",
        element: <ProductPage/>,
    },
    {
        path: "/checkout/cart",
        element: <CartPage/>
    },
    {
        path: "/checkout/checkout",
        element: <Checkout/>
    },
    {
        path: "/checkout/thanks",
        element: <Thanks/>
    },
    {
        path: "/stores",
        element: <StoresPage/>,
    }
])


