import * as React from "react";
import { createRoot } from "react-dom/client";
import HomePage from "./HomePage/HomePage";
import './index.css'

const app = document.body.appendChild(document.createElement("div"));
const root = createRoot(app);

root.render(
    <HomePage/>
);
