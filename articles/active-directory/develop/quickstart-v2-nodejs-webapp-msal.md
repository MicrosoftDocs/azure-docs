---
title: "Quickstart: Add authentication to a Node.js web app with MSAL Node | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how to implement authentication with a Node.js web app and the Microsoft Authentication Library (MSAL) for Node.js.
services: active-directory
author: mmacy
manager: celested

ms.service: active-directory
ms.subservice: develop
ms.topic: quickstart
ms.workload: identity
ms.date: 10/22/2020
ms.author: marsma
ms.custom: aaddev, scenarios:getting-started, languages:js, devx-track-js
# Customer intent: As an application developer, I want to know how to set up authentication in a web application built using Node.js and MSAL Node.
---

# Quickstart: Sign in users and get an access token in a Node web app using the auth code flow

In this quickstart, you download and run a code sample that demonstrates how a Node.js web app can sign in users by using the authorization code flow. The code sample also demonstrates how to get an access token to call Microsoft Graph API.

See [How the sample works](#how-the-sample-works) for an illustration.

This quickstart uses the Microsoft Authentication Library for Node.js (MSAL Node) with the authorization code flow.

## Prerequisites

* An Azure subscription. [Create an Azure subscription for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor

> [!div renderon="docs"]
> ## Register and download your quickstart application
>
> #### Step 1: Register your application
>
> 1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
> 1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: to select the tenant in which you want to register an application.
> 1. Under **Manage**, select **App registrations** > **New registration**.
> 1. Enter a **Name** for your application. Users of your app might see this name, and you can change it later.
> 1. Under **Supported account types**, select **Accounts in any organizational directory and personal Microsoft accounts**.
> 1. Set the **Redirect URI** value to `http://localhost:3000/redirect`.
> 1. Select **Register**.
> 1. On the app **Overview** page, note the **Application (client) ID** value for later use.
> 1. Under **Manage**, select **Certificates & secrets** > **New client secret**.  Leave the description blank and default expiration, and then select **Add**.
> 1. Note the value of **Client secret** for later use.

> [!div class="sxs-lookup" renderon="portal"]
> #### Step 1: Configure the application in Azure portal
> For the code sample for this quickstart to work, you need to create a client secret and add the following reply URL: `http://localhost:3000/redirect`.
> > [!div renderon="portal" id="makechanges" class="nextstepaction"]
> > [Make this change for me]()
>
> > [!div id="appconfigured" class="alert alert-info"]
> > ![Already configured](media/quickstart-v2-windows-desktop/green-check.png) Your application is configured with these attributes.

#### Step 2: Download the project

> [!div renderon="docs"]
> To run the project with a web server by using Node.js, [download the core project files](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip).

> [!div renderon="portal" class="sxs-lookup"]
> Run the project with a web server by using Node.js.

> [!div renderon="portal" class="sxs-lookup" id="autoupdate" class="nextstepaction"]
> [Download the code sample](https://github.com/Azure-Samples/ms-identity-node/archive/main.zip)

> [!div renderon="docs"]
> #### Step 3: Configure your Node app
>
> Extract the project, open the *ms-identity-node-main* folder, and then open the *index.js* file.
>
> Set the `clientID` value with the application (client) ID, and then set the `clientSecret` value with the client secret.
>
>```javascript
>const config = {
>    auth: {
>        clientId: "Enter_the_Application_Id_Here",
>        authority: "https://login.microsoftonline.com/common",
>        clientSecret: "Enter_the_Client_Secret_Here"
>    },
>    system: {
>        loggerOptions: {
>            loggerCallback(loglevel, message, containsPii) {
>                console.log(message);
>            },
>            piiLoggingEnabled: false,
>            logLevel: msal.LogLevel.Verbose,
>        }
>    }
>};
> ```

> [!div renderon="docs"]
>
> Modify the values in the `config` section:
>
> - `Enter_the_Application_Id_Here` is the application (client) ID for the application you registered.
>
>    To find the application (client) ID, go to the app registration's **Overview** page in the Azure portal.
> - `Enter_the_Client_Secret_Here` is the client secret for the application you registered.
>
>    To retrieve or generate a new client secret, under **Manage**, select **Certificates & secrets**.
>
> The default `authority` value represents the main (global) Azure cloud:
>
> ```javascript
> authority: "https://login.microsoftonline.com/common",
> ```
>
> [!div class="sxs-lookup" renderon="portal"]
> #### Step 3: Your app is configured and ready to run
>
> [!div renderon="docs"]
>
> #### Step 4: Run the project

Run the project by using Node.js.

1. To start the server, run the following commands from within the project directory:

    ```console
    npm install
    npm start
    ```

1. Go to `http://localhost:3000/`.

1. Select **Sign In** to start the sign-in process.

    The first time you sign in, you're prompted to provide your consent to allow the application to access your profile and sign you in. After you're signed in successfully, you will see a log message in the command line.

## More information

### How the sample works

The sample hosts a web server on localhost, port 3000. When a web browser accesses this site, the sample immediately redirects the user to a Microsoft authentication page. Because of this, the sample does not contain any HTML or display elements. Authentication success displays the message "OK".

### MSAL Node

The MSAL Node library signs in users and requests the tokens that are used to access an API that's protected by Microsoft identity platform. You can download the latest version by using the Node.js Package Manager (npm):

```console
npm install @azure/msal-node
```

## Next steps

> [!div class="nextstepaction"]
> [Adding Auth to an existing web app - GitHub code sample >](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/samples/msal-node-samples/auth-code)
