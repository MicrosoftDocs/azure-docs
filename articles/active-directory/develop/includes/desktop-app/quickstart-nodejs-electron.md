---
title: "Quickstart: Call Microsoft Graph from a Node.js desktop app | Azure"
titleSuffix: Microsoft identity platform
description: In this quickstart, you learn how a Node.js Electron desktop application can sign-in users and get an access token to call an API protected by a Microsoft identity platform endpoint
services: active-directory
author: mmacy
manager: CelesteDG
ms.service: active-directory
ms.subservice: develop
ms.topic: include
ms.date: 01/14/2022
ms.author: marsma
ms.custom: mode-api
#Customer intent: As an application developer, I want to learn how my Node.js Electron desktop application can get an access token and call an API that's protected by a Microsoft identity platform endpoint.
---

In this quickstart, you download and run a code sample that demonstrates how an Electron desktop application can sign in users and acquire access tokens to call the Microsoft Graph API.

This quickstart uses the [Microsoft Authentication Library for Node.js (MSAL Node)](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) with the [authorization code flow with PKCE](../../v2-oauth2-auth-code-flow.md).

## Prerequisites

* [Node.js](https://nodejs.org/en/download/)
* [Visual Studio Code](https://code.visualstudio.com/download) or another code editor


## Register and download the sample application

Follow the steps below to get started.

#### Step 1: Register the application
To register your application and add the app's registration information to your solution manually, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./../../media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which you want to register the application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations** > **New registration**.
1. Enter a **Name** for your application, for example `msal-node-desktop`. Users of your app might see this name, and you can change it later.
1. Select **Register** to create the application.
1. Under **Manage**, select **Authentication**.
1. Select **Add a platform** > **Mobile and desktop applications**.
1. In the **Redirect URIs** section, enter `msal://redirect`.
1. Select **Configure**.

#### Step 2: Download the Electron sample project


[Download the code sample](https://github.com/azure-samples/ms-identity-javascript-nodejs-desktop/archive/main.zip)

#### Step 3: Configure the Electron sample project

1. Extract the zip file to a local folder close to the root of the disk, for example, *C:/Azure-Samples*.
1. Edit *.env* and replace the values of the fields `TENANT_ID` and `CLIENT_ID` with the following snippet:

   ```
    # Credentials
        CLIENT_ID=Enter_the_Application_Id_Here
        TENANT_ID=Enter_the_Tenant_Id_Here
    # Configuration
        REDIRECT_URI=msal://redirect
    # Endpoints
        AAD_ENDPOINT_HOST=Enter_the_Cloud_Instance_Id_Here
        GRAPH_ENDPOINT_HOST=Enter_the_Graph_Endpoint_Here
    # RESOURCES
        GRAPH_ME_ENDPOINT=v1.0/me
        GRAPH_MAIL_ENDPOINT=v1.0/me/messages
    # SCOPES
        GRAPH_SCOPES=User.Read Mail.Read
   ```
   Where:
   - `Enter_the_Application_Id_Here` - is the **Application (client) ID** for the application you registered.
   - `Enter_the_Tenant_Id_Here` - replace this value with the **Tenant Id** or **Tenant name** (for example, contoso.microsoft.com)
   - `Enter_the_Cloud_Instance_Id_Here`: The Azure cloud instance in which your application is registered.
  - For the main (or *global*) Azure cloud, enter `https://login.microsoftonline.com/`.
  - `Enter_the_Graph_Endpoint_Here` is the instance of the Microsoft Graph API the application should communicate with.
    - For the **global** Microsoft Graph API endpoint, replace both instances of this string with `https://graph.microsoft.com/`.
    - For endpoints in **national** cloud deployments, see [National cloud deployments](/graph/deployments) in the Microsoft Graph documentation.

> [!TIP]
> To find the values of **Application (client) ID**, **Directory (tenant) ID**, go to the app's **Overview** page in the Azure portal.

#### Step 4: Run the application

You'll need to install the dependencies of this sample once:

```console
npm install
```

Then, run the application via command prompt or console:

```console
npm start
```

You should see application's UI with a **Sign in** button.

## More information

## How the sample works

When a user selects the **Sign In** button for the first time, get `getTokenInteractive` method of *AuthProvider.js* is called. This method redirects the user to sign-in with the *Microsoft identity platform endpoint* and validate the user's credentials, and then obtains an **authorization code**. This code is then exchanged for an access token using `acquireTokenByCode` public API of MSAL Node.

The ID token contains basic information about the user, like their display name. The access token has a limited lifetime and expires after 24 hours. If you plan to use these tokens for accessing protected resource, your back-end server *must* validate it to guarantee the token was issued to a valid user for your application.

### MSAL Node

[MSAL Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) is the library used to sign in users and request tokens used to access an API protected by Microsoft identity platform. For more information on how to use MSAL Node with desktop apps, see [this article](../../scenario-desktop-overview.md).

You can install MSAL Node by running the following npm command.

```console
npm install @azure/msal-node --save
```
## Next steps

To learn more about Electron desktop app development with MSAL Node, see the tutorial:

> [!div class="nextstepaction"]
> [Tutorial: Sign in users and call the Microsoft Graph API in an Electron desktop app](../../tutorial-v2-nodejs-desktop.md)
