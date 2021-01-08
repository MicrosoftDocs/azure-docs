---
title: "Tutorial: Enable authentication in a single-page app"
titleSuffix: Azure AD B2C
description: In this tutorial, learn how to use Azure Active Directory B2C to provide user login for a JavaScript-based single-page application (SPA).
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 04/04/2020
ms.custom: mvc, seo-javascript-september2019, devx-track-js
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Enable authentication in a single-page application with Azure AD B2C

This tutorial shows you how to use Azure Active Directory B2C (Azure AD B2C) to sign up and sign in users in a single-page application (SPA) using either:
* [OAuth 2.0 authorization code flow](./authorization-code-flow.md) (using [MSAL.js 2.x](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-browser))
* [OAuth 2.0 implicit grant flow](./implicit-flow-single-page-application.md) (using [MSAL.js 1.x](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-core))

In this tutorial, the first in a two-part series:

> [!div class="checklist"]
> * Add a reply URL to an application registered in your Azure AD B2C tenant
> * Download a code sample from GitHub
> * Modify the sample application's code to work with your tenant
> * Sign up using your sign-up/sign-in user flow

The [next tutorial](tutorial-single-page-app-webapi.md) in the series enables the web API portion of the code sample.

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

You need the following Azure AD B2C resources in place before continuing with the steps in this tutorial:

* [Azure AD B2C tenant](tutorial-create-tenant.md)
* [Application registered](tutorial-register-spa.md) in your tenant
* [User flows created](tutorial-create-user-flows.md) in your tenant

Additionally, you need the following in your local development environment:

* [Visual Studio Code](https://code.visualstudio.com/) or another code editor
* [Node.js](https://nodejs.org/en/download/)

## Update the application

In the [second tutorial](./tutorial-register-spa.md) that you completed as part of the prerequisites, you registered a single-page application in Azure AD B2C. To enable communication with the code sample in this tutorial, add a reply URL (also called a redirect URI) to the application registration.

To update an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](./app-registrations-training-guide.md).

#### [App registrations (auth code flow)](#tab/app-reg-auth/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, select the **Owned applications** tab, and then select the *spaapp1* application.
1. Under **Single-page Application**, select the **Add URI** link, then enter `http://localhost:6420`.
1. Select **Save**.
1. Select **Overview**.
1. Record the **Application (client) ID** for use in a later step when you update the code in the single-page web application.

#### [App registrations (implicit flow)](#tab/app-reg-implicit/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, select the **Owned applications** tab, and then select the *spaapp1* application.
1. Under **Single-page Application**, select the **Add URI** link, then enter `http://localhost:6420`.
1. Under **Implicit Grant**, select the checkboxes for **Access Tokens** and **ID Tokens** if not already selected and then select **Save**.
1. Select **Overview**.
1. Record the **Application (client) ID** for use in a later step when you update the code in the single-page web application.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Select **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select the *spaapp1* application.
1. Under **Reply URL**, add `http://localhost:6420`.
1. Select **Save**.
1. On the properties page, record the **Application ID**. You use the app ID in a later step when you update the code in the single-page web application.

* * *

## Get the sample code

In this tutorial, you configure a code sample that you download from GitHub to work with your B2C tenant. The sample demonstrates how a single-page application can use Azure AD B2C for user sign-up and sign-in, and to call a protected web API (you enable the web API in the next tutorial in the series).

* MSAL.js 2.x authorization code flow sample:

    [Download a zip file](https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa/archive/main.zip) or clone the sample from GitHub:

    ```
    git clone https://github.com/Azure-Samples/ms-identity-b2c-javascript-spa.git
    ```
* MSAL.js 1.x implicit flow sample:

    [Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/archive/master.zip) or clone the sample from GitHub:

    ```
    git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
    ```

## Update the sample

Now that you've obtained the sample, update the code with your Azure AD B2C tenant name and the application ID you recorded in an earlier step.

#### [Auth code flow sample](#tab/config-auth/)

1. Open the *authConfig.js* file inside the *App* folder.
1. In the `msalConfig` object, find the assignment for `clientId` and replace it with the **Application (client) ID** you recorded in an earlier step.
1. Open the `policies.js` file.
1. Find the entries under `names` and replace their assignment with the name of the user-flows you created in an earlier step, for example `B2C_1_signupsignin1`.
1. Find the entries under `authorities` and replace them as appropriate with the names of the user-flows you created in an earlier step, for example `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`.
1. Find the assignment for `authorityDomain` and replace it with `<your-tenant-name>.b2clogin.com`.
1. Open the `apiConfig.js` file.
1. Find the assignment for `b2cScopes` and replace the URL with the scope URL you created for the Web API, for example `b2cScopes: ["https://<your-tenant-name>.onmicrosoft.com/helloapi/demo.read"]`.
1. Find the assignment for `webApi` and replace the current URL with the URL where you deployed your Web API in Step 4, for example `webApi: http://localhost:5000/hello`.

#### [Implicit flow sample](#tab/config-implicit/)

1. Open the *authConfig.js* file inside the *JavaScriptSPA* folder.
1. In the `msalConfig` object, find the assignment for `clientId` and replace it with the **Application (client) ID** you recorded in an earlier step.
1. Open the `policies.js` file.
1. Find the entries under `names` and replace their assignment with the name of the user-flows you created in an earlier step, for example `B2C_1_signupsignin1`.
1. Find the entries under `authorities` and replace them as appropriate with the names of the user-flows you created in an earlier step, for example `https://<your-tenant-name>.b2clogin.com/<your-tenant-name>.onmicrosoft.com/<your-sign-in-sign-up-policy>`.
1. Open the `apiConfig.js` file.
1. Find the assignment for `b2cScopes` and replace the URL with the scope URL you created for the Web API, for example `b2cScopes: ["https://<your-tenant-name>.onmicrosoft.com/helloapi/demo.read"]`.
1. Find the assignment for `webApi` and replace the current URL with the URL where you deployed your Web API in Step 4, for example `webApi: http://localhost:5000/hello`.

* * *

Your resulting code should look similar to following:

#### [Auth code flow sample](#tab/review-auth/)

*authConfig.js*:

```javascript
const msalConfig = {
  auth: {
    clientId: "e760cab2-b9a1-4c0d-86fb-ff7084abd902",
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
  scopes: apiConfig.b2cScopes // i.e. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
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
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_reset",
        },
        editProfile: {
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_edit_profile"
        }
    },
    authorityDomain: "fabrikamb2c.b2clogin.com"
}
```

*apiConfig.js*:

```javascript
const apiConfig = {
  b2cScopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"],
  webApi: "https://fabrikamb2chello.azurewebsites.net/hello"
};
```

#### [Implicit flow sample](#tab/review-implicit/)

*authConfig.js*:

```javascript
const msalConfig = {
  auth: {
    clientId: "e760cab2-b9a1-4c0d-86fb-ff7084abd902",
    authority: b2cPolicies.authorities.signUpSignIn.authority,
    validateAuthority: false
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
  scopes: apiConfig.b2cScopes // i.e. ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"]
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
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_susi",
        },
        forgotPassword: {
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_reset",
        },
        editProfile: {
            authority: "https://fabrikamb2c.b2clogin.com/fabrikamb2c.onmicrosoft.com/b2c_1_edit_profile"
        }
    },
}
```

*apiConfig.js*:

```javascript
const apiConfig = {
  b2cScopes: ["https://fabrikamb2c.onmicrosoft.com/helloapi/demo.read"],
  webApi: "https://fabrikamb2chello.azurewebsites.net/hello"
};
```

* * *


## Run the sample

1. Open a console window and navigate to the directory containing the sample. 

    - For MSAL.js 2.x authorization code flow sample:

        ```console
        cd ms-identity-b2c-javascript-spa
        ```
    - For MSAL.js 1.x implicit flow sample: 

        ```console
        cd active-directory-b2c-javascript-msal-singlepageapp
        ```

1. Run the following commands:

    ```console
    npm install && npm update
    npm start
    ```

    The console window displays the port number of the locally running Node.js server:

    ```console
    Listening on port 6420...
    ```
1. Browse to `http://localhost:6420` to view the web application running on your local machine.

    :::image type="content" source="media/tutorial-single-page-app/web-app-spa-01-not-logged-in.png" alt-text="Web browser showing single-page application running locally":::

### Sign up using an email address

This sample application supports sign up, sign in, and password reset. In this tutorial, you sign up using an email address.

1. Select **Sign In** to initiate the *B2C_1_signupsignin1* user flow you specified in an earlier step.
1. Azure AD B2C presents a sign-in page that includes a sign up link. Since you don't yet have an account, select the **Sign up now** link.
1. The sign up workflow presents a page to collect and verify the user's identity using an email address. The sign up workflow also collects the user's password and the requested attributes defined in the user flow.

    Use a valid email address and validate using the verification code. Set a password. Enter values for the requested attributes.

    :::image type="content" source="media/tutorial-single-page-app/user-flow-sign-up-workflow-01.png" alt-text="Sign up page displayed by Azure AD B2C user flow":::

1. Select **Create** to create a local account in the Azure AD B2C directory.

When you select **Create**, the application shows the name of the signed in user.

:::image type="content" source="media/tutorial-single-page-app/web-app-spa-02-logged-in.png" alt-text="Web browser showing single-page application with logged in user":::

If you'd like to test sign-in, select the **Sign Out** button, then select **Sign In** and sign in with the email address and password you entered when you signed up.

### What about calling the API?

If you select the **Call API** button after signing in, you're presented with the sign-up/sign-in user flow page instead of the results of the API call. This is expected because you haven't yet configured the API portion of the application to communicate with a web API application registered in *your* Azure AD B2C tenant.

At this point, the application is still trying to communicate with the API registered in the demo tenant (fabrikamb2c.onmicrosoft.com), and because you're not authenticated with that tenant, the sign-up/sign-in page is displayed.

Move on to the next tutorial in the series in to enable the protected API (see the [Next steps](#next-steps) section).

## Next steps

In this tutorial, you configured a single-page application to work with a user flow in your Azure AD B2C tenant to provide sign up and sign in capability. You completed these steps:

> [!div class="checklist"]
> * Added a reply URL to an application registered in your Azure AD B2C tenant
> * Downloaded a code sample from GitHub
> * Modified the sample application's code to work with your tenant
> * Signed up using your sign-up/sign-in user flow

Now move on to the next tutorial in the series to grant access to a protected web API from the SPA:

> [!div class="nextstepaction"]
> [Tutorial: Protect and grant access to web API from a single-page application >](tutorial-single-page-app-webapi.md)