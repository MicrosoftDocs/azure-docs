---
title: Add a web application - Azure Active Directory B2C | Microsoft Docs
description: Learn how to add a web application to your Active Directory B2C tenant.
services: active-directory-b2c
author: mmacy
manager: celestedg

ms.author: marsma
ms.date: 04/16/2019
ms.custom: mvc
ms.topic: conceptual
ms.service: active-directory
ms.subservice: B2C
---

# Add a web API application to your Azure Active Directory B2C tenant

 Register Web API resources in your tenant so that they can accept and respond to requests by client applications that present an access token. This article shows you how to register application in Azure Active Directory (Azure AD) B2C.

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Make sure you're using the directory that contains your Azure AD B2C tenant. Select the **Directory and subscription filter** in the top menu and choose the directory that contains your tenant.
3. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
4. Select **Applications**, and then select **Add**.
5. Enter a name for the application. For example, *webapi1*.
6. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
7. For **Reply URL**, enter an endpoint where Azure AD B2C should return any tokens that your application requests. In your production application, you might set the reply URL to a value such as `https://localhost:44332`. For testing purposes, set the reply URL to `https://jwt.ms`.
8. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
9. Click **Create**.
10. On the properties page, record the application ID that you'll use when you configure the web application.

## Configure scopes

Scopes provide a way to govern access to protected resources. Scopes are used by the web API to implement scope-based access control. For example, users of the web API could have both read and write access, or users of the web API might have only read access. In this tutorial, you use scopes to define read and write permissions for the web API.

1. Select **Applications**, and then select *webapi1*.
2. Select **Published scopes**.
3. For **scope**, enter `Read`, and for description, enter `Read access to the application`.
4. For **scope**, enter `Write`, and for description, enter `Write access to the application`.
5. Click **Save**.

The published scopes can be used to grant a client application permission to the web API.

## Grant permissions

To call a protected web API from an application, you need to grant your application permissions to the API. For example, in [Tutorial: Register an application in Azure Active Directory B2C](tutorial-register-applications.md), a web application is created in Azure AD B2C named *webapp1*. You can use this application to call the web API.

1. Select **Applications**, and then select your web application.
2. Select **API access**, and then select **Add**.
3. In the **Select API** dropdown, select *webapi1*.
4. In the **Select Scopes** dropdown, select the **Read** and **Write** scopes that you previously defined.
5. Click **OK**.

Your application is registered to call the protected web API. A user authenticates with Azure AD B2C to use the application. The application obtains an authorization grant from Azure AD B2C to access the protected web API.
