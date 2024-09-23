import * as React from "react";
import { createRoot } from "react-dom/client";
import './index.css'
import ProductPage from "./ProductPage/ProductPage.jsx";

const app = document.body.appendChild(document.createElement("div"));
const root = createRoot(app);

root.render(
    <ProductPage id={'CL-08'}/>
);
