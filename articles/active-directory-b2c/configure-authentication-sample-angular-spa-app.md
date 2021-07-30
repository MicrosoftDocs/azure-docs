---
title: Configure authentication in a sample Angular spa application using Azure Active Directory B2C
description:  Using Azure Active Directory B2C to sign in and sign up users in an Angular SPA application.
services: active-directory-b2c
author: msmimart
manager: celestedg
ms.service: active-directory
ms.workload: identity
ms.topic: reference
ms.date: 07/29/2021
ms.author: mimart
ms.subservice: B2C
ms.custom: "b2c-support"
---

# Configure authentication in a sample Angular Single Page application using Azure Active Directory B2C

This article uses a sample Angular Single Page application (SPA) to illustrate how to add Azure Active Directory B2C (Azure AD B2C) authentication to your Angular apps.

## Overview

OpenID Connect (OIDC) is an authentication protocol built on OAuth 2.0 that you can use to securely sign a user in to an application. This Angular sample uses [MSAL Angular](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-angular) and the [MSAL Browser](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser). MSAL is a Microsoft provided library that simplifies adding authentication and authorization support to Angular SPA apps.

### Sign in flow

The sign-in flow involves following steps:

1. The user navigates to the app and selects **Sign-in**. 
1. The app initiates an authentication request, and redirects the user to Azure AD B2C.
1. The user [signs up or signs in](add-sign-up-and-sign-in-policy.md), [resets the password](add-password-reset-policy.md), or signs in with a [social account](add-identity-provider.md).
1. Upon successful sign-in, Azure AD B2C returns an authorization code to the app. The app takes the following actions:
  1. Exchanges the authorization code for an ID token, access token and refresh token.
  1. Reads the ID token claims.
  1. Stores the access token and refresh token in an in-memory cache for later use. The access token allows the user to call protected resources, such as a web API. The refresh token is used to acquire a new access token.

### App registration overview

To enable your app to sign in with Azure AD B2C and call a web API, you must register two applications in the Azure AD B2C directory.  

- The **Single page application** (Angular) registration enables your app to sign in with Azure AD B2C. During app registration, you specify the *Redirect URI*. The redirect URI is the endpoint to which the user is redirected after they authenticate with Azure AD B2C. The app registration process generates an *Application ID*, also known as the *client ID*, that uniquely identifies your app. For example, **App ID: 1**.

- The **web API** registration enables your app to call a protected web API. The registration exposes the web API permissions (scopes). The app registration process generates an *Application ID* that uniquely identifies your web API. For example, **App ID: 2**. Grant your app (App ID: 1) permissions to the web API scopes (App ID: 2).  

The following diagrams describe the app registrations and the application architecture.

![Diagram describes a SPA app with web API, registrations and tokens.](./media/configure-authentication-sample-angular-spa-app/spa-app-with-api-architecture.png) 

### Call to a web API

[!INCLUDE [active-directory-b2c-app-integration-call-api](../../includes/active-directory-b2c-app-integration-call-api.md)]

### Sign out flow

[!INCLUDE [active-directory-b2c-app-integration-sign-out-flow](../../includes/active-directory-b2c-app-integration-sign-out-flow.md)]

## Prerequisites

A computer that's running:

* [Visual Studio Code](https://code.visualstudio.com/), or another code editor
* [Node.js runtime](https://nodejs.org/en/download/) and [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
* [Angular LCI](https://angular.io/cli)

## Step 1: Configure your user flow

[!INCLUDE [active-directory-b2c-app-integration-add-user-flow](../../includes/active-directory-b2c-app-integration-add-user-flow.md)]

## Step 2: Register your Angular SPA and API

In this step, you create the Angular SPA app and the web API application registrations, and specify the scopes of your web API.

### 2.1 Register the web API application

[!INCLUDE [active-directory-b2c-app-integration-register-api](../../includes/active-directory-b2c-app-integration-register-api.md)]

### 2.2 Configure scopes

[!INCLUDE [active-directory-b2c-app-integration-api-scopes](../../includes/active-directory-b2c-app-integration-api-scopes.md)]

### 2.3 Register the Angular app

Follow these steps to create the Angular app registration:

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + Subscription** icon in the portal toolbar, and then select the directory that contains your Azure AD B2C tenant.
1. In the Azure portal, search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *MyApp*.
1. Under **Supported account types**, select **Accounts in any identity provider or organizational directory (for authenticating users with user flows)**. 
1. Under **Redirect URI**, select **Single-page application (SPA)**, and then enter `http://localhost:4200` in the URL text box.
1. Under **Permissions**, select the **Grant admin consent to openid and offline access permissions** check box.
1. Select **Register**.
1. Record the **Application (client) ID** for use in a later step when you configure the web application.
    ![Screenshot showing how to get the Angular application ID.](./media/configure-authentication-sample-angular-spa-app/get-azure-ad-b2c-app-id.png)  

### 2.5 Grant permissions

[!INCLUDE [active-directory-b2c-app-integration-grant-permissions](../../includes/active-directory-b2c-app-integration-grant-permissions.md)]

## Step 3: Get the Angular sample code

This sample demonstrates how an Angular single-page application can use Azure AD B2C for user sign-up and sign-in. Then the app acquires an access token and calls a protected web API. Download the sample below:

  [Download a zip file](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/archive/refs/heads/main.zip) or clone the sample from the [GitHub repo](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/):

  ```
  git clone https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial.git
  ```

### 3.1 Configure the Angular sample

Now that you've obtained the SPA app sample, update the code with your Azure AD B2C and web API values. In the sample folder, under the `src/app` folder, open the `auth-config.ts` file, and update with keys the corresponding values:  


|Section  |Key  |Value  |
|---------|---------|---------|
| b2cPolicies | names |The user flow or custom policy you created in [step 1](#step-1-configure-your-user-flow). |
| b2cPolicies | authorities | Replace `your-tenant-name` with your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`. Then, replace the policy name with the user flow or custom policy you created in [step 1](#step-1-configure-your-user-flow). For example, `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`. |
| b2cPolicies | authorityDomain|Your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso.onmicrosoft.com`. |
| Configuration | clientId | The Angular application ID from [step 2.3](#23-register-the-angular-app). |
| protectedResources| endpoint| The URL of the web API, `http://localhost:5000/api/todolist`. |
| protectedResources| scopes| The web API scopes you created in [step 2.2](#22-configure-scopes). For example, `b2cScopes: ["https://<your-tenant-namee>.onmicrosoft.com/tasks-api/tasks.read"]`. |

Your resulting *src/app/auth-config.ts* code should look similar to following sample:

```typescript
export const b2cPolicies = {
     names: {
         signUpSignIn: "b2c_1_susi_reset_v2",
         editProfile: "b2c_1_edit_profile_v2"
     },
     authorities: {
         signUpSignIn: {
             authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_susi_reset_v2",
         },
         editProfile: {
             authority: "https://your-tenant-name.b2clogin.com/your-tenant-name.onmicrosoft.com/b2c_1_edit_profile_v2"
         }
     },
     authorityDomain: "your-tenant-name.b2clogin.com"
 };
 
 
export const msalConfig: Configuration = {
     auth: {
         clientId: '<your-MyApp-application-ID>',
         authority: b2cPolicies.authorities.signUpSignIn.
         knownAuthorities: [b2cPolicies.authorityDomain],
         redirectUri: '/', 
     },
    // More configuration here
 }

export const protectedResources = {
  todoListApi: {
    endpoint: "http://localhost:5000/api/todolist",
    scopes: ["https://your-tenant-namee.onmicrosoft.com/api/tasks.read"],
  },
}
```

## Step 4: Get the web API sample code

Now that the web API is registered and you've defined its scopes, configure the web API code to work with your Azure AD B2C tenant. Download the sample below:

[Download a \*.zip archive](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi/archive/master.zip), or clone the sample web API project from GitHub. You can also browse directly to the [Azure-Samples/active-directory-b2c-javascript-nodejs-webapi](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi) project on GitHub.

```console
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```

### 4.1 Configure the web API

In the sample folder, open the *config.json* file. This file contains information about your Azure AD B2C identity provider. The web API app uses this information to validate the access token the web app passes as a bearer token. Update the following properties of the app settings:

|Section  |Key  |Value  |
|---------|---------|---------|
|credentials|tenantName| The first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). For example, `contoso`.|
|credentials|clientID| The web API application ID from step [2.1](#21-register-the-web-api-application). In the [diagram above](#app-registration-overview), it's the application with *App ID: 2*.|
|credentials| issuer| (Optional) The token issuer `iss` claim value. Azure AD B2C by default returns the token in the following format: `https://<your-tenant-name>.b2clogin.com/<your-tenant-ID>/v2.0/`. Replace the `<your-tenant-name>` with the first part of your Azure AD B2C [tenant name](tenant-management.md#get-your-tenant-name). Replace the `<your-tenant-ID>` with your [Azure AD B2C tenant ID](tenant-management.md#get-your-tenant-id). |
|policies|policyName|The user flow or custom policy you created in [step 1](#step-1-configure-your-user-flow). If your application uses multiple user flows or custom policies, specify only one. For example, the sign-up or sign-in user flow.|
| resource| scope | The scopes of your web API application registration from step [2.5])(#25-grant-permissions). |

Your final configuration file should look like the following JSON:

```json
{
    "credentials": {
        "tenantName": "<your-tenant-namee>",
        "clientID": "<your-webapi-application-ID>",
        "issuer": "https://<your-tenant-name>.b2clogin.com/<your-tenant-ID>/v2.0/"
    },
    "policies": {
        "policyName": "b2c_1_susi"
    },
    "resource": {
        "scope": ["tasks.read"] 
    },
    // More settings here
} 
```

## Step 5: Run the Angular SPA and web API

You're now ready to test the Angular's scoped access to the API. In this step, run both the web API and the sample Angular application on your local machine. Then, sign in to the Angular application, and select the **TodoList** button to start a request to the protected API.

### Run the web API

1. Open a console window and change to the directory containing the web API sample. For example:

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

### Run the Angular application

1. Open another console window and change to the directory containing the Angular sample. For example:

    ```console
    cd ms-identity-javascript-angular-tutorial-main/3-Authorization-II/2-call-api-b2c/SPA
    ```

1. Run the following commands:

    ```console
    npm install && npm update
    npm start
    ```

    The console window displays the port number of where the application is hosted.

    ```console
    Listening on port 4200...
    ```

1. Navigate to `http://localhost:4200` in your browser to view the application.
1. Select **Login**.

    ![Screenshot showing the Angular sample app with the login link.](./media/configure-authentication-sample-angular-spa-app/sample-app-sign-in.png)

1. Complete the sign-up or sign-in process.
1. Upon successful login, you should see your profile. From the menu, select **ToDoList**.

    ![Screenshot showing the Angular sample app with the user profile, and the call to the to do list.](./media/configure-authentication-sample-angular-spa-app/sample-app-result.png)

1. **Add** new items to the list, **delete**, or **edit** items.

    ![Screenshot showing the Angular sample app's call to the to do list.](./media/configure-authentication-sample-angular-spa-app/sample-app-calls-web-api.png)

## Deploy your application 

In a production application, the app registration redirect URI is typically a publicly accessible endpoint where your app is running, like `https://contoso.com`. 

You can add and modify redirect URIs in your registered applications at any time. The following restrictions apply to redirect URIs:

* The reply URL must begin with the scheme `https`.
* The reply URL is case-sensitive. Its case must match the case of the URL path of your running application. 

## Next steps

* Learn more [about the code sample](https://github.com/Azure-Samples/ms-identity-javascript-angular-tutorial/)
* [Enable authentication in your own Angular application](enable-authentication-angular-spa-app.md)
* Configure [authentication options in your Angular application](enable-authentication-angular-spa-app-options.md)
* [Enable authentication in your own web API](enable-authentication-web-api.md)
