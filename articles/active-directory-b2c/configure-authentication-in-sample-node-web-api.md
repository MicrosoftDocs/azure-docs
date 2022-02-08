---
title: Configure authentication in a sample Node.js web API by using Azure AD B2C
description: Follow the steps in this article to learn how to configure authentication in a sample Node.js web API by using Azure AD B2C
titleSuffix: Azure AD B2C
services: active-directory-b2c
author: kengaderdus
manager: CelesteDG

ms.service: active-directory
ms.workload: identity
ms.topic: how-to
ms.date: 02/08/2022
ms.author: kengaderdus
ms.subservice: B2C
---

# Configure authentication in a sample Node.js web API by using Azure AD B2C

In this article, you'll learn how to configure a sample Node.js web application to call a sample Node.js web API. The web API need to be protected by Azure AD B2C itself. In this setup, a web app, such as *App ID: 1* calls a web API, such as *App ID: 2*. Users authenticate into the web app to acquire an access token, which is then used to call a protected web API.

## Overview

Token-based authentication ensures that requests to a web API are accompanied by a valid access token.

The web app accomplishes the following events:

- It authenticates users with Azure AD B2C.

- It acquires an access token with the required permissions (scopes) for the web API endpoint.

- It passes the access token as a bearer token in the authentication header of the HTTP request. It uses the format:

```http
Authorization: Bearer <token>
```

The accomplishes following events are  by the web API:

- It reads the bearer token from the authorization header in the HTTP request.

- It validates the token.

- It validates the permissions (scopes) in the token.

- It responds to the HTTP request. If the token isn't valid, the web API endpoint responds with `401 Unauthorized` HTTP error.

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, you must register two applications in the Azure AD B2C directory.  

- The **web application** registration enables your app to sign in with Azure AD B2C. During the registration, you specify the *redirect URI*. The redirect URI is the endpoint to which users are redirected by Azure AD B2C after their authentication with Azure AD B2C is completed. The app registration process generates an *application ID*, also known as the *client ID*, which uniquely identifies your app. You'll also generate a *client secret* for your app. Your app uses the client secret to exchange an authorization code for an access token. 

- The **web API** registration enables your app to call a secure web API. The registration includes the web API *scopes*. The scopes provide a way to manage permissions to protected resources, such as your web API. You grant the web application permissions to the web API scopes. When an access token is requested, your app specifies the desired permissions in the scope parameter of the request.

The application registrations and the application architecture are described in the following diagram:

![Diagram of the application registrations and the application architecture for an app with web API.](./media/enable-authentication-web-api/app-with-api-architecture.png) 

## Prerequisites

- [Node.js](https://nodejs.org).

- [Visual Studio Code](https://code.visualstudio.com/download) or another code editor.


## Step 1: Configure your user flow

When users try to sign in to your app, the app starts an authentication request to the authorization endpoint via a [user flow](user-flow-overview.md). The user flow defines and controls the user experience. After users complete the user flow, Azure AD B2C generates a token and then redirects users back to your application.

Complete the steps in [Tutorial: Create user flows and custom policies in Azure Active Directory B2C](tutorial-create-user-flows.md?pivots=b2c-user-flow) to create a **Sign in and sign up**  user flow. Use the following settings:
- For **Name** of your user flow, use something like `susi_node_app`.
- For **User attributes and token claims**, make sure you select **Surname** for both **Collect attribute** and **Return claim**.

## Step 2: Register your web app and API

In this step, you create the web and the web API application registrations, and you specify the scopes of your web API.

### Step 2.1: Register the web API application

[!INCLUDE [active-directory-b2c-app-integration-register-api](../../includes/active-directory-b2c-app-integration-register-api.md)]


### Step 2.2: Configure scopes

[!INCLUDE [active-directory-b2c-app-integration-api-scopes](../../includes/active-directory-b2c-app-integration-api-scopes.md)]


### Step 2.3: Register the web app

To create the SPA registration, do the following:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directories + subscriptions** icon in the portal toolbar.
1. On the **Portal settings | Directories + subscriptions** page, find your Azure AD B2C directory in the **Directory name** list, and then select **Switch**.
1. Search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application (for example, *App ID: 1*).
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Web**, and then enter `http://localhost:3000/redirect` in the URL text box
1. Under **Permissions**, select the **Grant admin consent to openid and offline access permissions** checkbox.
1. Select **Register**.

### Step 2.4: Create a client secret

1. In the **Azure AD B2C - App registrations** page, select the application you created, for example *App ID: 1*.
1. In the left menu, under **Manage**, select **Certificates & secrets**.
1. Select **New client secret**.
1. Enter a description for the client secret in the **Description** box. For example, *clientsecret1*.
1. Under **Expires**, select a duration for which the secret is valid, and then select **Add**.
1. Record the secret's **Value** for use in your client application code. This secret value is never displayed again after you leave this page. You use this value as the application secret in your application's code.


### Step 2.5: Grant permissions

[!INCLUDE [active-directory-b2c-app-integration-grant-permissions](../../includes/active-directory-b2c-app-integration-grant-permissions.md)]

## Step 3: Get the web app sample code

This sample demonstrates how a web application can use Azure AD B2C for user sign-up and sign-in. Then the app acquires an access token and calls a protected web API. 

To get the web app sample code, you can do either of the following: 

* [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp/archive/main.zip). You'll extract the zip file to get the sample web app. 

* Clone the sample from GitHub by running the following command:

    ```bash
    git clone https://github.com/Azure-Samples/active-directory-b2c-msal-node-sign-in-sign-out-webapp.git
    ```

### Step 3.1: Install app dependencies

1. Open a console window, and change to the directory that contains the Node.js sample app. For example:
    
    ```bash
        cd active-directory-b2c-msal-node-sign-in-sign-out-webapp/call-protected-api
    ```
1. Run the following commands to install app dependencies:

    ```bash
        npm install && npm update
    ```

### Step 3.2: Configure the sample web app




## Step 4: Get the web API sample code



