---
title: Prepare a React single-page app (SPA) for authentication
description: Learn how to prepare a React single-page app (SPA) for authentication with your Azure Active Directory (AD) for customers tenant.
services: active-directory
author: garrodonnell
manager: celestedg
ms.service: active-directory
ms.subservice: ciam
ms.topic: how-to
ms.date: 05/23/2023
ms.author: godonnell

#Customer intent: As a dev, devops, or IT admin, I want to learn how to enable authentication in my own React single-page app
---
# Prepare a React single-page app (SPA) for authentication
After registration is complete, you can create a React project using an integrated development environment (IDE). This tutorial demonstrates how to create a React single-page app using npm and create files needed for authentication and authorization.

In this article, you learn how to:

> [!div class="checklist"]
> * Create a new React project
> * Configure the settings for the application
> * Install identity and bootstrap packages
> * Add authentication code to the application

## Prerequisites
* Completion of the prerequisites and steps in [Prepare your customer tenant for building a React single-page app (SPA)](./how-to-single-page-application-react-prepare-tenant.md))
* Although any IDE that supports React applications can be used, Visual Studio Code is used for this guide. This can be downloaded from the [Downloads](https://visualstudio.microsoft.com/downloads/) page.
* [Node.js](https://nodejs.org/en/download/)

## Create a new React project
Use the following tabs to create a React project within Visual Studio Code.

1. Open Visual Studio Code, select **File** > **Open Folder...**. Navigate to and select the location in which to create your project.
1. Open a new terminal by selecting **Terminal** > **New Terminal**.
1. Run the following commands to create a new React project with the name *reactspalocal*, change to the new directory and start the React project. A web browser will open with the address `http://localhost:3000/` by default. The browser remains open and re-renders for every saved change.

    ```powershell
    npx create-react-app reactspalocal
    cd reactspalocal
    npm start
    ```

## Install identity and bootstrap packages
Identity related **npm** packages must be installed in the project to enable user  authentication. For project styling, **Bootstrap** will be used.

1. In the **Terminal** bar, select the **+** icon to create a new terminal. A separate terminal window will open with the previous node terminal continuing to run in the background.
1. Ensure that the correct directory is selected (*reactspalocal*) then enter the following into the terminal to install the relevant `msal` and `bootstrap` packages.

    ```powershell
    npm install @azure/msal-browser @azure/msal-react
    npm install react-bootstrap bootstrap
    ```

## Creating the authentication configuration file
1. In the *src* folder, create a new file called *authConfig.js*.
1. Open *authConfig.js* and add the following code snippet:

   ```javascript
       /*
     * Copyright (c) Microsoft Corporation. All rights reserved.
     * Licensed under the MIT License.
     */

    import { LogLevel } from '@azure/msal-browser';

    /**
     * Configuration object to be passed to MSAL instance on creation. 
     * For a full list of MSAL.js configuration parameters, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/configuration.md 
     */

    export const msalConfig = {
        auth: {
            clientId: 'Enter_the_Application_Id_Here', // This is the ONLY mandatory field that you need to supply.
            authority: 'https://Enter_the_Tenant_Name_Here.ciamlogin.com/', // Replace "Enter_the_Tenant_Name_Here" with your tenant name
            redirectUri: '/', // Points to window.location.origin. You must register this URI on Azure Portal/App Registration.
            postLogoutRedirectUri: '/', // Indicates the page to navigate after logout.
            navigateToLoginRequestUrl: false, // If "true", will navigate back to the original request location before processing the auth code response.
        },
        cache: {
            cacheLocation: 'sessionStorage', // Configures cache location. "sessionStorage" is more secure, but "localStorage" gives you SSO between tabs.
            storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
        },
        system: {
            loggerOptions: {
                loggerCallback: (level, message, containsPii) => {
                    if (containsPii) {
                        return;
                    }
                    switch (level) {
                        case LogLevel.Error:
                            console.error(message);
                            return;
                        case LogLevel.Info:
                            console.info(message);
                            return;
                        case LogLevel.Verbose:
                            console.debug(message);
                            return;
                        case LogLevel.Warning:
                            console.warn(message);
                            return;
                        default:
                            return;
                    }
                },
            },
        },
    };

    /**
     * Scopes you add here will be prompted for user consent during sign-in.
     * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
     * For more information about OIDC scopes, visit: 
     * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
     */
    export const loginRequest = {
        scopes: [],
        extraQueryParameters: {
            dc: "ESTS-PUB-EUS-AZ1-FD000-TEST1"
        }
    };
    ```

1. Replace the following values with the values from the Azure portal.
    - Replace `Enter_the_Application_Id_Here` with the **Application (client) ID** value that was recorded earlier from the overview page of the registered application.
    - The *Tenant ID* is the identifier of the tenant where the application is registered. Replace the `_Enter_the_Tenant_Info_Here` with the **Directory (tenant) ID** value that was recorded earlier from the overview page of the registered application.


## Modify index.js to include the authentication provider
All parts of the app that require authentication must be wrapped in the [`MsalProvider`](/javascript/api/@azure/msal-react/#@azure-msal-react-msalprovider) component. You instantiate a [PublicClientApplication](/javascript/api/@azure/msal-browser/publicclientapplication) then pass it to `MsalProvider`.

1. In the *src* folder, open *index.js* and replace the contents of the file with the following code snippet to use the `msal` packages and bootstrap styling:

    :::code language="javascript" source="~/ms-identity-docs-code-javascript/react-spa/src/index.js" :::


## Next steps

> [!div class="nextstepaction"]
> [Add sign-in and sign-out functionality to your app.](./how-to-single-page-application-react-sign-in-out.md)
