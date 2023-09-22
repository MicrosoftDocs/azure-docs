---
title: Tutorial - Prepare a Vanilla JavaScript single-page app (SPA) for authentication in a customer tenant 
description: Learn how to prepare a Vanilla JavaScript single-page app (SPA) for authentication and authorization with your Microsoft Entra ID for customers tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.custom: devx-track-js
ms.topic: tutorial
ms.date: 08/17/2023
#Customer intent: As a developer, I want to learn how to configure Vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Microsoft Entra ID for customers tenant.
---

# Tutorial: Prepare a Vanilla JavaScript single-page app for authentication in a customer tenant

In the [previous article](tutorial-single-page-app-vanillajs-prepare-tenant.md), you registered an application and configured user flows in your Microsoft Entra ID for customers tenant. This article shows you how to create a Vanilla JavaScript (JS) single-page app (SPA) and configure it to sign in and sign out users with your customer tenant.

In this tutorial;

> [!div class="checklist"]
> * Create a Vanilla JavaScript project in Visual Studio Code
> * Install required packages
> * Add code to *server.js* to create a server

## Prerequisites

* Completion of the prerequisites and steps in [Prepare your customer tenant to authenticate a Vanilla JavaScript single-page app](tutorial-single-page-app-vanillajs-prepare-tenant.md).
* Although any integrated development environment (IDE) that supports Vanilla JS applications can be used, **Visual Studio Code** is recommended for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
* [Node.js](https://nodejs.org/en/download/).

## Create a new Vanilla JS project and install dependencies

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following command to create a new Vanilla JS project:

    ```powershell
    npm init -y
    ```
1. Create additional folders and files to achieve the following project structure:

    ```
        └── public
            └── authConfig.js
            └── authPopup.js
            └── authRedirect.js
            └── claimUtils.js
            └── index.html
            └── signout.html
            └── styles.css
            └── ui.js    
        └── server.js
    ```
    
## Install app dependencies

1. In the **Terminal**, run the following command to install the required dependencies for the project:

    ```powershell
    npm install express morgan @azure/msal-browser
    ```

## Edit the *server.js* file

**Express** is a web application framework for **Node.js**. It's used to create a server that hosts the application. **Morgan** is the middleware that logs HTTP requests to the console. The server file is used to host these dependencies and contains the routes for the application. Authentication and authorization are handled by the [Microsoft Authentication Library for JavaScript (MSAL.js)](/javascript/api/overview/).

1. Add the following code snippet to the *server.js* file:

    ```javascript
    const express = require('express');
    const morgan = require('morgan');
    const path = require('path');
    
    const DEFAULT_PORT = process.env.PORT || 3000;
    
    // initialize express.
    const app = express();
    
    // Configure morgan module to log all requests.
    app.use(morgan('dev'));
    
    // serve public assets.
    app.use(express.static('public'));
    
    // serve msal-browser module
    app.use(express.static(path.join(__dirname, "node_modules/@azure/msal-browser/lib")));
    
    // set up a route for signout.html
    app.get('/signout', (req, res) => {
        res.sendFile(path.join(__dirname + '/public/signout.html'));
    });
    
    // set up a route for redirect.html
    app.get('/redirect', (req, res) => {
        res.sendFile(path.join(__dirname + '/public/redirect.html'));
    });
    
    // set up a route for index.html
    app.get('/', (req, res) => {
        res.sendFile(path.join(__dirname + '/index.html'));
    });
    
    app.listen(DEFAULT_PORT, () => {
        console.log(`Sample app listening on port ${DEFAULT_PORT}!`);
    });

    ```

In this code, the **app** variable is initialized with the **express** module and **express** is used to serve the public assets. **MSAL-browser** is served as a static asset and is used to initiate the authentication flow.

## Next steps

> [!div class="nextstepaction"]
> [Configure SPA for authentication](tutorial-single-page-app-vanillajs-configure-authentication.md)
