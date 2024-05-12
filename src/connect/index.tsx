import React from "react";
import { createRoot } from "react-dom/client";
import '../assets/tailwind.css'
import Connect from "./connect";
import {BrowserRouter as Router } from "react-router-dom";

function init() {
    const appContainer = document.createElement('div')
    document.body.appendChild(appContainer)
    if (!appContainer) {
        throw new Error("Can not find AppContainer");
    }
    const root = createRoot(appContainer)
    console.log(appContainer)
    root.render(<Router><Connect /></Router>);
}

init();