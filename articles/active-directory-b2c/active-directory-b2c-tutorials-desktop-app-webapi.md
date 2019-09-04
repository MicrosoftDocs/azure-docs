---
title: Tutorial - Grant access to a Node.js web API from a desktop application - Azure Active Directory B2C | Microsoft Docs
description: Tutorial on how to use Active Directory B2C to protect a Node.js web api and call it from a .NET desktop app.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.author: marsma
ms.date: 02/04/2019
ms.custom: mvc
ms.topic: tutorial
ms.service: active-directory
ms.subservice: B2C
---

# Tutorial: Grant access to a Node.js web API from a desktop app using Azure Active Directory B2C

This tutorial shows you how to call an Azure Active Directory (Azure AD) B2C protected Node.js web API resource from a Windows Presentation Foundation (WPF) desktop app.

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Update the sample to use the application

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

## Prerequisites

Complete the steps and prerequisites in [Tutorial: Enable desktop app authentication with accounts using Azure Active Directory B2C](active-directory-b2c-tutorials-desktop-app.md).

## Add a web API application

Web API resources need to be registered in your tenant before they can accept and respond to protected resource requests by client applications that present an access token. 

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In this tutorial, the sample runs locally and listens at `https://localhost:5000`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, some users could have both read and write access, whereas other users might have read-only permissions. In this tutorial, you define read permissions for the web API.

1. Select **Applications**, and then select *webapi1*.
2. Select **Published scopes**.
3. For **scope**, enter `Hello.Read`, and for description, enter `Read access to hello`.
4. For **scope**, enter `Hello.Write`, and for description, enter `Write access to hello`.
5. Click **Save**.

The published scopes can be used to grant a client app permission to the web API.

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. In the prerequisite tutorial, you created a web application in Azure AD B2C named *app1*. You use this application to call the web API.

1. Select **Applications**, and then select *nativeapp1*.
2. Select **API access**, and then select **Add**.
3. In the **Select API** dropdown, select *webapi1*.
4. In the **Select Scopes** dropdown, select the **Hello.Read** and **Hello.Write** scopes that you previously defined.
5. Click **OK**.

A user authenticates with Azure AD B2C to use the WPF desktop application. The desktop application obtains an authorization grant from Azure AD B2C to access the protected web API.

## Configure the sample

Now that the web API is registered and you have scopes defined, you configure the web API code to use your Azure AD B2C tenant. In this tutorial, you configure a sample Node.js web application you can download from GitHub. 

[Download a zip file](https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi/archive/master.zip) or clone the sample web app from GitHub.

```
git clone https://github.com/Azure-Samples/active-directory-b2c-javascript-nodejs-webapi.git
```
The Node.js web API sample uses the Passport.js library to enable Azure AD B2C to protect calls to the API. 

1. Open the `index.js` file.
2. Configure the sample with the Azure AD B2C tenant registration information. Change the following lines of code:

    ```nodejs
    var tenantID = "<your-tenant-name>.onmicrosoft.com";
    var clientID = "<application-ID>";
    var policyName = "B2C_1_signupsignin1";
    ```

## Run the sample

1. Launch a Node.js command prompt.
2. Change to the directory containing the Node.js sample. For example `cd c:\active-directory-b2c-javascript-nodejs-webapi`
3. Run the following commands:
    ```
    npm install && npm update
    ```
    ```
    node index.js
    ```

### Run the desktop application

1. Open the **active-directory-b2c-wpf** solution in Visual Studio.
2. Press **F5** to run the desktop app.
3. Sign in using the email address and password used in [Authenticate users with Azure Active Directory B2C in a desktop app tutorial](active-directory-b2c-tutorials-desktop-app.md).
4. Click the **Call API** button. 

The desktop application makes a request to the web API to and gets a response with the logged-in user's display name. You're protected desktop application is calling the protected web API in your Azure AD B2C tenant.

## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Add a web API application
> * Configure scopes for a web API
> * Grant permissions to the web API
> * Update the sample to use the application

> [!div class="nextstepaction"]
> [Tutorial: Add identity providers to your applications in Azure Active Directory B2C](tutorial-add-identity-providers.md)
