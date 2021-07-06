---
title: Configure authentication in a sample spa application using Azure Active Directory B2C
description:  Using Azure Active Directory B2C to sign in and sign up users in an SPA application.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/05/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in a sample Single Page application using Azure Active Directory B2C

This article uses a sample JavaScript Single Page application to illustrate how to add Azure Active Directory B2C (Azure AD B2C) authentication to your SPA apps.

## Overview

OpenID Connect (OIDC) is an authentication protocol built on OAuth 2.0 that you can use to securely sign a user in to an application. This Single Page Application sample uses [MSAL.js](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser) and the OIDC PKCE flow. MSAL.js is a Microsoft provided library that simplifies adding authentication and authorization support to SPA apps.

### Sign in flow
The sign-in flow involves following steps:

1. The user navigates to the web app and selects **Sign-in**. 
1. The app initiates an authentication request, and redirects the user to Azure AD B2C.
1. The user [signs-up or signs-in](add-sign-up-and-sign-in-policy.md), [resets the password](add-password-reset-policy.md), or signs-in with a [social account](add-identity-provider.md).
1. Upon successful sign-in, Azure AD B2C returns an ID token to the app.
1. The Single Page Application validates the ID token, reads the claims, and in turn allows the user to call protected resources/API's.

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, you must register two applications in the Azure AD B2C directory.  

- The **web application** registration enables your app to sign in with Azure AD B2C. During app registration, you specify the *Redirect URI*. The redirect URI is the endpoint to which the user is redirected to after they authenticate with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your app.

- The  **web API** registration enables your app to call a secure web API. The registration includes the web API *scopes*. The scopes provide a way to manage permissions to protected resources such as your web API. You grant the web application permissions to the web API's scopes. When an access token is requested, your app specifies the desired permissions in the scope parameter of the request.  

The following diagrams describe the app registrations and the application architecture.

![Web app with web API call registrations and tokens](./media/configure-authentication-sample-spa-app/spa-app-with-api-architecture.png) 

### Call to a web API

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-app-integration-call-api.md)]

### Sign out flow

[!INCLUDE [active-directory-b2c-app-integration-sign-out-flow](../../includes/active-directory-b2c-app-integration-sign-out-flow.md)]

## Prerequisites

A computer that's running:

* [Visual Studio Code](https://code.visualstudio.com/), or another code editor.
* [Node.js runtime](https://nodejs.org/en/download/)

## Step 1: Configure your user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)]

## Step 2: Register your SPA and API

In this step, you create the SPA app and the web API application registrations, and specify the scopes of your web API.

### 2.1 Register the web API application

[!INCLUDE [active-directory-b2c-app-integration-register-api](../../includes/active-directory-b2c-app-integration-register-api.md)]

### 2.2 Configure scopes

[!INCLUDE [active-directory-b2c-app-integration-api-scopes](../../includes/active-directory-b2c-app-integration-api-scopes.md)]

### 2.3 Register the SPA app

Follow these steps to create the SPA app registration:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *MyApp*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Single-page application (SPA)**, and then enter `http://localhost:6420` in the URL text box.
1. Under **Permissions**, select the **Grant admin consent to openid and offline access permissions** check box.
1. Select **Register**.

Next, enable the implicit grant flow:

1. Under Manage, select Authentication.
1. Select Try out the new experience (if shown).
1. Under Implicit grant, select the ID tokens check box.
1. Select Save.

Record the **Application (client) ID** for use in a later step when you configure the web application.
    ![Get your application ID](./media/configure-authentication-sample-web-app/get-azure-ad-b2c-app-id.png)  

### 2.5 Grant permissions

[!INCLUDE [active-directory-b2c-app-integration-grant-permissions](../../includes/active-directory-b2c-app-integration-grant-permissions.md)]

## Step 3: Get the SPA sample code

This sample demonstrates how a single-page application can use Azure AD B2C for user sign-up and sign-in. Then the app acquires an access token and calls a protected web API. Download the sample below:

  [Download a zip file](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/archive/main.zip) or clone the sample from GitHub:

  ```
  git clone https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa.git
  ```

### 3.1 Update the SPA sample

Now that you've obtained the SPA app sample, update the code with your Azure AD B2C and web API values. In the sample folder, under the `App` folder, open the following JavaScript files, and update with the corresponding value:  


|File  |Key  |Value  |
|---------|---------|---------|
|authConfig.js|clientId| The SPA application ID from [step 2.3](#23-register-the-spa-app).|
|policies.js| names| The user flows, or custom policy you created in [step 1](#step-1-configure-your-user-flow).|
|policies.js|authorities|Your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`. Then, replace with the user flows, or custom policy you created in [step 1](#step-1-configure-your-user-flow). For example, `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`|
|policies.js|authorityDomain|Your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`.|
|apiConfig.js|b2cScopes|The web API scopes you created in [step 2.2](#22-configure-scopes). For example, `b2cScopes: ["https://<your-tenant-name>.onmicrosoft.com/tasks-api/tasks.read"]`.|
|apiConfig.js|webApi|The URL of the web API, `http://localhost:5000/tasks`.|

Your resulting code should look similar to following sample:

*authConfig.js*:

```javascript
const msalConfig = {
  auth: {
    clientId: "<your-MyApp-application-ID>"
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    knownAuthorities: [b2cPolicies.authorityDomain],
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: true
  }
};

const loginRequest = {
  scopes: ["openid", "profile"],
};

const tokenRequest = {
  scopes: apiConfig.b2cScopes
};
```

*policies.js*:

```javascript
const b2cPolicies = {
    names: {
        signUpSignIn: "b2c_1_susi",
        forgotPassword: "b2c_1_reset",
        editProfile: "b2c_1_edit_profile"
    },
    authorities: {
        signUpSignIn: {
            authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_reset",
        },
        editProfile: {
            authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_edit_profile"
        }
    },
    authorityDomain: "your-tenant-name.b2clogin.com"
}
```

*apiConfig.js*:

```javascript
const apiConfig = {
  b2cScopes: ["https://your-tenant-name.onmicrosoft.com/tasks-api/tasks.read"],
  webApi: "http://localhost:5000/tasks"
};
```

## Step 4: Get the web API sample code

Now that the web API is registered and you've defined its scopes, configure the web API code to work with your Azure AD B2C tenant. Download the sample below:

[Download a \*.zip archive](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi/archive/master.zip) or clone the sample web API project from GitHub. You can also browse directly to the [Azure-Samples/active-directory-b2c-javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) project on GitHub.

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

### 4.1 Update the web API

1. Open the *config.json* file in your code editor.
1. Modify the variable values with the application registration you created earlier. Also update the `policyName` with the user flow you created as part of the prerequisites. For example, *b2c_1_susi*.
    
    ```json
    "credentials": {
        "tenantName": "<your-tenant-name>",
        "clientID": "<your-webapi-application-ID>"
    },
    "policies": {
        "policyName": "b2c_1_susi"
    },
    "resource": {
        "scope": ["tasks.read"] 
    },
    ```

### 4.2 Enable CORS

To allow your single-page application to call the Node.js web API, you need to enable [CORS](https://expressjs.com/en/resources/middleware/cors.html) in the web API. In a production application, you should be careful about which domain is making the request. In this example, allow requests from any domain.

To enable CORS, use the following middleware. In the Node.js web API code sample you downloaded, it's already been added to the *index.js* file.

```javascript
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
```

## Step 5: Run the SPA and web API

You're now ready to test the single-page application's scoped access to the API. Run both the Node.js web API and the sample JavaScript single-page application on your local machine. Then, sign in to the single-page application and select the **Call API** button to initiate a request to the protected API.

### Run the Node.js web API

1. Open a console window and change to the directory containing the Node.js web API sample. For example:

    ```console
    cd active-directory-b2c-javascript-nodejs-webapi
    ```

1. Run the following commands:

    ```console
    npm install && npm update
    node index.js
    ```

    The console window displays the port number where the application is hosted.

    ```console
    Listening on port 5000...
    ```

### Run the single-page app

1. Open another console window and change to the directory containing the JavaScript SPA sample. For example:

    ```console
    cd ms-identity-b2c-javascript-spa
    ```

1. Run the following commands:

    ```console
    npm install && npm update
    npm start
    ```

    The console window displays the port number of where the application is hosted.

    ```console
    Listening on port 6420...
    ```

1. Navigate to `http://localhost:6420` in your browser to view the application.

    ![Single-page application sample app shown in browser](./media/configure-authentication-sample-spa-app/sample-app-sign-in.png)

1. Sign in using the email address and password you used in the [previous tutorial](tutorial-single-page-app.md). Upon successful login, you should see the `User 'Your Username' logged-in` message.
1. Select the **Call API** button. The SPA sends the access token in a request to the protected web API,  which returns the display name of the logged-in user:

    ![Single-page application in browser showing username JSON result returned by API](./media/configure-authentication-sample-spa-app/sample-app-result.png)

## Deploy your application 

In a production application, the app registration redirect URI is typically a publicly accessible endpoint where your app is running, like `https://contoso.com/signin-oidc`. 

You can add and modify redirect URIs in your registered applications at any time. The following restrictions apply to redirect URIs:

* The reply URL must begin with the scheme `https`.
* The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. 

## Next steps

* Learn more [about the code sample](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa)
* [Enable authentication in your own SPA application](enable-authentication-spa-app.md)
* Configure [authentication options in your SPA application](enable-authentication-spa-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)