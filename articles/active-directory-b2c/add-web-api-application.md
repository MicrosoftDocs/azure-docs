---
title: Add a web API application - Azure Active Directory B2C | Microsoft Docs
description: Learn how to add a web API application to your Active Directory B2C tenant.
services: active-directory-b2c
author: msmimart
manager: celestedg

ms.author: mimart
ms.date: 04/16/2019
ms.custom: mvc
ms.topic: conceptual
ms.service: active-directory
ms.subservice: B2C
---

# Add a web API application to your Azure Active Directory B2C tenant

 Register web API resources in your tenant so that they can accept and respond to requests by client applications that present an access token. This article shows you how to register a web API in Azure Active Directory B2C (Azure AD B2C).

To register an application in your Azure AD B2C tenant, you can use our new unified **App registrations** experience or our legacy  **Applications (Legacy)** experience. [Learn more about the new experience](https://aka.ms/b2cappregtraining).

#### [App registrations](#tab/app-reg-ga/)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Select the **Directory + subscription** filter in the top menu, and then select the directory that contains your Azure AD B2C tenant.
1. In the left menu, select **Azure AD B2C**. Or, select **All services** and search for and select **Azure AD B2C**.
1. Select **App registrations**, and then select **New registration**.
1. Enter a **Name** for the application. For example, *webapi1*.
1. Under **Redirect URI**, select **Web**, and then enter an endpoint where Azure AD B2C should return any tokens that your application requests. In a production application, you might set the redirect URI an endpoint like `https://localhost:5000`. During development or testing, you can set it to `https://jwt.ms`, a Microsoft-owned web application that displays the decoded contents of a token (the contents of the token never leave your browser). You can add and modify redirect URIs in your registered applications at any time.
1. Select **Register**.
1. Record the **Application (client) ID** for use in your web API's code.

If you have an application that implements the implicit grant flow, for example a JavaScript-based single-page application (SPA), you can enable the flow by following these steps:

1. Under **Manage**, select **Authentication**.
1. Under **Implicit grant**, select both the **Access tokens** and **ID tokens** check boxes.
1. Select **Save**.

#### [Applications (Legacy)](#tab/applications-legacy/)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory + subscription** filter in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications (Legacy)**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In your production application, you might set the reply URL to a value such as `https://localhost:44332`. For testing purposes, set the reply URL to `https://jwt.ms`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

* * *

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, users of the web API could have both read and write access, or users of the web API might have only read access. In this tutorial, you use scopes to define read and write permissions for the web API.

[!INCLUDE [active-directory-b2c-scopes](../../includes/active-directory-b2c-scopes.md)]

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. For example, in [Tutorial: Register an application in Azure Active Directory B2C](tutorial-register-applications.md), a web application named *webapp1* is registered in Azure AD B2C. You can use this application to call the web API.

[!INCLUDE [active-directory-b2c-permissions-api](../../includes/active-directory-b2c-permissions-api.md)]

Your application is registered to call the protected web API. A user authenticates with Azure AD B2C to use the application. The application obtains an authorization grant from Azure AD B2C to access the protected web API.
