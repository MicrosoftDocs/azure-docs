---
title: Register an application in Azure Active Directory B2C | Microsoft Docs 
description: Learn how to register your application with Azure Active Directory B2C.
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 11/01/2018
ms.author: davidmu
ms.component: B2C
---

# Register an application in Azure Active Directory B2C

To build an [application](active-directory-b2c-apps.md) that accepts consumer sign-up and sign-in, you first need to register the application with an Azure AD B2C tenant. This article helps you register an application in an Azure Active Directory (Azure AD) B2C tenant in a few minutes. When you're finished, your application is registered for use in the Azure AD B2C tenant.

## Prerequisites

Get your own tenant by using the steps in [Create an Azure Active Directory B2C tenant](tutorial-create-tenant.md).

Choose next steps based on your application type:

- [Register a web application](#register-a-web-application)
- [Register a web API](#register-a-web-api)
- [Register a mobile or native application](#register-a-mobile-or-native-application)

## Register a web application

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Applications**, and then select **Add**.
4. Enter a name for the application. For example *testapp1*.
5. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
6. For **Reply URL**, enter endpoint where Azure AD B2C should return any tokens that your app requests. For example, you can set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.
7. Click **Create**.

### Create a client secret

If your application calls a web API secured by Azure AD B2C, you need to create an application secret.

1. Select **Keys** and then click **Generate key**. 
2. Select **Save** to view the key. Make note of the **App key** value. You use the value as the application secret in your application's code.
3. Select **API Access**, click **Add**, and select your web API and scopes (permissions).

## Register a web API

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Applications**, and then select **Add**.
4. Enter a name for the application. For example *testapp2*.
5. For **Include web app/ web API** and **Allow implicit flow**, select **Yes**.
6. For **Reply URL**, enter endpoint where Azure AD B2C should return any tokens that your app requests. For example, you can set it to listen locally at `https://localhost:44316`. If you don't yet know the port number, you can enter a placeholder value and change it later.
7. For **App ID URI**, enter the identifier used for your web API. The full identifier URI including the domain is generated for you. For example, `https://contosotenant.onmicrosoft.com/api`.
8. Click **Create**.
9. Select **Published scopes** to add more scopes as necessary. By default, the `user_impersonation` scope is defined. The `user_impersonation` scope gives other applications the ability to access this API on behalf of the signed-in user. If you wish, the `user_impersonation` scope can be removed.

## Register a mobile or native application

1. Make sure you're using the directory that contains your Azure AD B2C tenant by clicking the **Directory and subscription filter** in the top menu and choosing the directory that contains your tenant.
2. Choose **All services** in the top-left corner of the Azure portal, and then search for and select **Azure AD B2C**.
3. Select **Applications**, and then select **Add**.
4. Enter a name for the application. For example *testapp3*.
5. For **Include web app/ web API**, select **No**.
6. For **Include native client**, select **Yes**.
7. For **Redirect URI**, enter a [redirect URI with a custom scheme](active-directory-b2c-apps.md). Make sure you choose a good redirect URI and do not include special characters such as underscores.
8. Click **Create**.

### Create a client secret

If your application calls a web API secured by Azure AD B2C, you need to create an application secret.

1. Select **Keys** and then click **Generate key**. 
2. Select **Save** to view the key. Make note of the **App key** value. You use the value as the application secret in your application's code.
3. Select **API Access**, click **Add**, and select your web API and scopes (permissions).

## Next steps

Now that you have an application registered with Azure AD B2C, you can complete one of [the quickstart tutorials](active-directory-b2c-overview.md) to get up and running.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app with sign-up, sign-in, and password reset](active-directory-b2c-devquickstarts-web-dotnet-susi.md)
