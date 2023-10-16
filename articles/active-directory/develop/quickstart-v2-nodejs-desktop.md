---
title: "Quickstart: Call Microsoft Graph from a Node.js desktop app"
description: In this quickstart, you learn how a Node.js Electron desktop application can sign-in users and get an access token to call an API protected by a Microsoft identity platform endpoint
services: active-directory
author: cilwerner
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: conceptual
ms.date: 01/14/2022
ROBOTS: NOINDEX
ms.author: cwerner
ms.custom: mode-api, devx-track-js
#Customer intent: As an application developer, I want to learn how my Node.js Electron desktop application can get an access token and call an API that's protected by a Microsoft identity platform endpoint.
---

# Quickstart: Acquire an access token and call the Microsoft Graph API from an Electron desktop app

> [!div renderon="docs"]
> Welcome! This probably isn't the page you were expecting. While we work on a fix, this link should take you to the right article:
>
> > [Quickstart: Sign in users and call Microsoft Graph from a Node.js desktop app](quickstart-desktop-app-nodejs-electron-sign-in.md)
> 
> We apologize for the inconvenience and appreciate your patience while we work to get this resolved.

> [!div renderon="portal" class="sxs-lookup"]
> In this quickstart, you download and run a code sample that demonstrates how an Electron desktop application can sign in users and acquire access tokens to call the Microsoft Graph API.
> 
> This quickstart uses the [Microsoft Authentication Library for Node.js (MSAL Node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) with the [authorization code flow with PKCE](v2-oauth2-auth-code-flow.md).
> 
> ## Prerequisites
> 
> * [Node.js](https://nodejs.org/en/download/)
> * [Visual Studio Code](https://code.visualstudio.com/download) or another code editor
> 
> #### Step 1: Configure the application in Azure portal
> For the code sample for this quickstart to work, you need to add a reply URL as **msal://redirect**.
> > [!div class="nextstepaction"]
> > [Make this change for me]()
> 
> > [!div class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-windows-desktop/green-check.png) Your application is configured with these attributes.
> 
> #### Step 2: Download the Electron sample project
> 
> > [!div  class="nextstepaction"]
> > [Download the code sample](https://github.com/azure-samples/ms-identity-javascript-nodejs-desktop/archive/main.zip)
> 
> > [!div class="sxs-lookup"]
> > > [!NOTE]
> > > `Enter_the_Supported_Account_Info_Here`
> 
> #### Step 4: Run the application
> 
> You'll need to install the dependencies of this sample once:
> 
> ```console
> npm install
> ```
> 
> Then, run the application via command prompt or console:
> 
> ```console
> npm start
> ```
> 
> You should see application's UI with a **Sign in** button.
> 
> ## About the code
> 
> Below, some of the important aspects of the sample application are discussed.
> 
> ### MSAL Node
> 
> [MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. For more information on how to use MSAL Node with desktop apps, see [this article](scenario-desktop-overview.md).
> 
> You can install MSAL Node by running the following npm command.
> 
> ```console
> npm install @azure/msal-node --save
> ```
> 
> ### MSAL initialization
> 
> You can add the reference for MSAL Node by adding the following code:
> 
> ```javascript
> const { PublicClientApplication } = require('@azure/msal-node');
> ```
> 
> Then, initialize MSAL using the following code:
> 
> ```javascript
> const MSAL_CONFIG = {
>     auth: {
>         clientId: "Enter_the_Application_Id_Here",
>         authority: "https://login.microsoftonline.com/Enter_the_Tenant_Id_Here",
>     },
> };
> 
> const pca = new PublicClientApplication(MSAL_CONFIG);
> ```
> 
> > | Where: |Description |
> > |---------|---------|
> > | `clientId` | Is the **Application (client) ID** for the application registered in the Azure portal. You can find this value in the app's **Overview** page in the Azure portal. |
> > | `authority`    | The STS endpoint for user to authenticate. Usually `https://login.microsoftonline.com/{tenant}` for public cloud, where {tenant} is the name of your tenant or your tenant Id.|
> 
> ### Requesting tokens
> 
> You can use MSAL Node's acquireTokenInteractive public API to acquire tokens via an external user-agent such as the default system browser.
> 
> ```javascript
> const { shell } = require('electron');
>
> try {
>    const openBrowser = async (url) => {
>        await shell.openExternal(url);
>    };
>
>    const authResponse = await pca.acquireTokenInteractive({
>        scopes: ["User.Read"],
>        openBrowser,
>        successTemplate: '<h1>Successfully signed in!</h1> <p>You can close this window now.</p>',
>        failureTemplate: '<h1>Oops! Something went wrong</h1> <p>Check the console for more information.</p>',
>    });
>
>    return authResponse;
> } catch (error) {
>    throw error;
> }
> ```
>
> 
> ## Next steps
> 
> To learn more about Electron desktop app development with MSAL Node, see the tutorial:
> 
> > [!div class="nextstepaction"]
> > [Tutorial: Sign in users and call the Microsoft Graph API in an Electron desktop app](tutorial-v2-nodejs-desktop.md)
