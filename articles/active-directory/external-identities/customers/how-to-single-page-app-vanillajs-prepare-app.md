---
title: Tutorial - Prepare a Vanilla JavaScript single-page app (SPA) for authentication in a customer tenant 
description: Learn how to prepare a Vanilla JavaScript single-page app (SPA) for authentication and authorization with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: OwenRichards1
manager: CelesteDG

ms.author: owenrichards
ms.service: active-directory
ms.subservice: ciam
ms.topic: tutorial
ms.date: 05/25/2023

#Customer intent: As a developer, I want to learn how to configure Vanilla JavaScript single-page app (SPA) to sign in and sign out users with my Azure AD for customers tenant.
---

# Tutorial: Prepare a Vanilla JavaScript single-page app (SPA) for authentication in a customer tenant

In the [previous article](./how-to-single-page-app-vanillajs-sign-in-prepare-tenant.md), you registered an application and configured user flows in your Azure Active Directory (AD) for customers tenant.

In this tutorial you'll;

> [!div class="checklist"]
> * Create a React project in Visual Studio Code
> * Install required packages
> * Configure the settings for the application
> * Add code to *server.js* and *app files to implement authentication

## Prerequisites

* Completion of the prerequisites and steps in [Prepare your customer tenant to authenticate a Vanilla JavaScript single-page app](how-to-single-page-app-vanillajs-sign-in-prepare-tenant.md).
* Although any integrated development environment (IDE) that supports Vanilla JS applications can be used, **Visual Studio Code** is recommended for this guide. It can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads) page.
* [Node.js](https://nodejs.org/en/download/).

## Create a new Vanilla JS project and install dependencies

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following command to create a new vanilla JS project

    ```powershell
    npm init -y
    ```
1. Create additional folders and files to achieve the following project structure:

    ```
        └── public
            └── authConfig.js
            └── authPopup.js
            └── authRedirect.js
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

In this code, the **app** variable is initialized with the **express** module and **express** is used to serve the public assets. **Msal-browser** is served as a static asset and is used to initiate the authentication flow.

## Edit the authentication configuration file

The application uses the [Implicit Grant Flow](../../develop/v2-oauth2-implicit-grant-flow.md) to authenticate users. The Implicit Grant Flow is a browser-based flow that doesn't require a back-end server. The flow redirects the user to the sign-in page, where the user signs in and consents to the permissions that are being requested by the application. The purpose of *authConfig.js* is to configure the authentication flow.

1. Open *public/authConfig.js* and add the following code snippet:

    ```javascript
    /**
     * Configuration object to be passed to MSAL instance on creation. 
     * For a full list of MSAL.js configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
     */
    const msalConfig = {
        auth: {
            clientId: 'Enter_the_Application_Id_Here', // This is the ONLY mandatory field that you need to supply.
            authority: 'https://Enter_the_Tenant_Subdomain_Here.ciamlogin.com/', // Replace "Enter_the_Tenant_Subdomain_Here" with your tenant subdomain
            redirectUri: '/', // You must register this URI on Azure Portal/App Registration. Defaults to window.location.href e.g. http://localhost:3000/
            navigateToLoginRequestUrl: true, // If "true", will navigate back to the original request location before processing the auth code response.
        },
        cache: {
            cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO.
            storeAuthStateInCookie: false, // set this to true if you have to support IE
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case msal.LogLevel.Error:
                            console.error(message);
                            return;
                        case msal.LogLevel.Info:
                            console.info(message);
                            return;
                        case msal.LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case msal.LogLevel.Warning:
                            console.warn(message);
                            return;
                    }
                },
            },
        },
    };
    
    /**
     * An optional silentRequest object can be used to achieve silent SSO
     * between applications by providing a "login_hint" property.
     */
    
    // const silentRequest = {
    //   scopes: ["openid", "profile"],
    //   loginHint: "example@domain.net"
    // };
    
    // exporting config object for jest
    if (typeof exports !== 'undefined') {
        module.exports = {
            msalConfig: msalConfig,
            loginRequest: loginRequest,
        };
    }
     ```

1. Replace the following values with the values from the Azure portal:
    - Find the `Enter_the_Application_Id_Here` value and replace it with the **application ID (clientId)** of the app you registered in the Microsoft Entra admin center.
    - In **Authority**, find `Enter_the_Tenant_Subdomain_Here` and replace it with the subdomain of your tenant. For example, if your tenant primary domain is *caseyjensen@onmicrosoft.com*, the value you should enter is *casyjensen*.
1. Save the file.

## Next steps

> [!div class="nextstepaction"]
> [Configure SPA for authentication](how-to-single-page-app-vanillajs-sign-in-configure-authentication-flows.md)