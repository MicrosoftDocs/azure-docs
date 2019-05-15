---
title: Tutorial - Enable authentication in a single-page application  - Azure Active Directory B2C | Microsoft Docs
description: Tutorial on how to use Azure Active Directory B2C to provide user login for a single page application (JavaScript).
services: active-directory-b2c
author: davidmu1
manager: celestedg

ms.author: davidmu
ms.date: 02/04/2019
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Enable authentication in a single-page application using Azure Active Directory B2C

This tutorial shows you how to use Azure Active Directory (Azure AD) B2C to sign in and sign up users in a single-page application (SPA). Azure AD B2C enables your applications to authenticate to social accounts, enterprise accounts, and Azure Active Directory accounts using open standard protocols.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Update the application in Azure AD B2C
> * Configure the sample to use the application
> * Sign up using the user flow

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

* [Create user flows](tutorial-create-user-flows.md) to enable user experiences in your application. 
* Install [Visual Studio 2017](https://www.visualstudio.com/downloads/) with the **ASP.NET and web development** workload.
* Install the [.NET Core 2.0.0 SDK](https://www.microsoft.com/net/core) or later
* Install [Node.js](https://nodejs.org/en/download/)

## Update the application

In the tutorial that you completed as part of the prerequisites, you added a web application in Azure AD B2C. To enable communication with the sample in the tutorial, you need to add a redirect URI to the application in Azure AD B2C.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select the *webapp1* application.
5. Under **Reply URL**, add `http://localhost:6420`.
6. Select **Save**.
7. On the properties page, record the application ID that you'll use when you configure the web application.
8. Select **Keys**, select **Generate key**, and select **Save**. Record the key that you'll use when you configure the web application.

## Configure the sample

In this tutorial, you configure a sample that you can download from GitHub. The sample demonstrates how a single-page application can use Azure AD B2C for user sign-up, sign-in, and call a protected web API.

[Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp/archive/master.zip) or clone the sample from GitHub.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-msal-singlepageapp.git
```

To change the settings:

1. Open the `index.html` file in the sample.
2. Configure the sample with the application ID and key that you recorded earlier. Change the following lines of code by replacing the values with the names of your directory and APIs:

    ```javascript
    // The current application coordinates were pre-registered in a B2C directory.
    var applicationConfig = {
        clientID: '<Application ID>',
        authority: "https://contoso.b2clogin.com/tfp/contoso.onmicrosoft.com/B2C_1_signupsignin1",
        b2cScopes: ["https://contoso.onmicrosoft.com/demoapi/demo.read"],
        webApi: 'https://contosohello.azurewebsites.net/hello',
    };
    ```

    The name of the user flow used in this tutorial is **B2C_1_signupsignin1**. If you're using a different user flow name, use your user flow name in `authority` value.

## Run the sample

1. Launch a Node.js command prompt.
2. Change to the directory containing the Node.js sample. For example `cd c:\active-directory-b2c-javascript-msal-singlepageapp`
3. Run the following commands:

    ```
    npm install && npm update
    node server.js
    ```

    The console window displays the port number of where the app is hosted.
    
    ```
    Listening on port 6420...
    ```

4. Use a browser to navigate to the address `http://localhost:6420` to view the application.

The sample supports sign-up, sign-in, profile editing, and password reset. This tutorial highlights how a user signs up using an email address.

### Sign up using an email address

1. Click **Login** to sign up as a user of the application. This uses the **B2C_1_signupsignin1** user flow you defined in a previous step.
2. Azure AD B2C presents a sign-in page with a sign-up link. Since you don't have an account yet, click the **Sign up now** link. 
3. The sign-up workflow presents a page to collect and verify the user's identity using an email address. The sign-up workflow also collects the user's password and the requested attributes defined in the user flow.

    Use a valid email address and validate using the verification code. Set a password. Enter values for the requested attributes. 

    ![Sign-up workflow](media/active-directory-b2c-tutorials-desktop-app/sign-up-workflow.png)

4. Click **Create** to create a local account in the Azure AD B2C directory.

Now, the user can use an email address to sign in and use the SPA app.

> [!NOTE]
> After login, the app displays an "insufficient permissions" error. You receive this error because you are attempting to access a resource from the demo directory. Since your access token is only valid for your Azure AD directory, the API call is unauthorized. Continue with the next tutorial to create a protected web API for your directory.

## Next steps

In this article, you learned how to:

> [!div class="checklist"]
> * Update the application in Azure AD B2C
> * Configure the sample to use the application
> * Sign up using the user flow

> [!div class="nextstepaction"]
> [Tutorial: Grant access to an ASP.NET Core web API from a single-page app using Azure Active Directory B2C](active-directory-b2c-tutorials-spa-webapi.md)
