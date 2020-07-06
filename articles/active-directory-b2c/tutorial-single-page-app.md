---
title: "Tutorial: Enable authentication in a single-page app"
titleSuffix: Azure AD B2C
description: In this tutorial, learn how to use Azure Active Directory B2C to provide user login for a JavaScript-based single-page application (SPA).
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 04/04/2020
ms.custom: mvc, seo-javascript-september2019
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Enable authentication in a single-page application with Azure AD B2C

This tutorial shows you how to use Azure Active Directory B2C (Azure AD B2C) to sign up and sign in users in a single-page application (SPA).

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
* [Application registered](tutorial-register-applications.md) in your tenant
* [User flows created](tutorial-create-user-flows.md) in your tenant

Additionally, you need the following in your local development environment:

* [Visual Studio Code](https://code.visualstudio.com/) or another code editor
* [Node.js](https://nodejs.org/en/download/)

## Update the application

In the second tutorial that you completed as part of the prerequisites, you registered a web application in Azure AD B2C. To enable communication with the code sample in this tutorial, add a reply URL (also called a redirect URI) to the application registration.

To update an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, select the **Owned applications** tab, and then select the *webapp1* application.
1. Under **Web**, select the **Add URI** link, enter `http://localhost:6420`.
1. Under **Implicit Grant**, select the checkboxes for **Access Tokens** and **ID Tokens** and then select **Save**.
1. Select **Overview**.
1. Record the **Application (client) ID** for use in a later step when you update the code in the single-page web application.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Make sure you're using the directory that contains your Azure AD B2C tenant by selecting the **Directory + subscription** filter in the top menu and choosing the directory that contains your tenant.
1. Select **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
1. Select **Applications (Legacy)**, and then select the *webapp1* application.
1. Under **Reply URL**, add `http://localhost:6420`.
1. Select **Save**.
1. On the properties page, record the **Application ID**. You use the app ID in a later step when you update the code in the single-page web application.

* * *

## Get the sample code

In this tutorial, you configure a code sample that you download from GitHub to work with your B2C tenant. The sample demonstrates how a single-page application can use Azure AD B2C for user sign-up and sign-in, and to call a protected web API (you enable the web API in the next tutorial in the series).

[Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/archive/master.zip) or clone the sample from GitHub.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
```

## Update the sample

Now that you've obtained the sample, update the code with your Azure AD B2C tenant name and the application ID you recorded in an earlier step.

1. Open the *authConfig.js* file inside the *JavaScriptSPA* folder.
1. In the `msalConfig` object, update:
    * `clientId` with value with the **Application (client) ID** you recorded in an earlier step
    * `authority` URI with your Azure AD B2C tenant name and the name of the sign-up/sign-in user flow you created as part of the prerequisites (for example, *B2C_1_signupsignin1*)

    ```javascript
    const msalConfig = {
        auth: {
          clientId: "00000000-0000-0000-0000-000000000000", // Replace this value with your Application (client) ID
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

## Run the sample

1. Open a console window and change to the directory containing the sample. For example:

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
