---
title: Application registration in Azure Active Directory B2C | Microsoft Docs 
description: How to register your application with Azure Active Directory B2C
services: active-directory-b2c
author: davidmu1
manager: mtillman

ms.service: active-directory
ms.workload: identity
ms.topic: conceptual
ms.date: 6/13/2017
ms.author: davidmu
ms.component: B2C
---

# Azure Active Directory B2C: Register your application

This Quickstart helps you register an application in a Microsoft Azure Active Directory (Azure AD) B2C tenant in a few minutes. When you're finished, your application is registered for use in the Azure AD B2C tenant.

## Prerequisites

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

Applications created in the Azure portal must be managed from the same location. If you edit the Azure AD B2C applications using PowerShell or another portal, they become unsupported and do not work with Azure AD B2C. See details in the [faulted apps](#faulted-apps) section. 

This article uses examples that will help you get started with our samples. You can learn more about these samples in the subsequent articles.

## Navigate to B2C settings

Log in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant. 

[!INCLUDE [active-directory-b2c-switch-b2c-tenant](../../includes/active-directory-b2c-switch-b2c-tenant.md)]

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](../../includes/active-directory-b2c-portal-navigate-b2c-service.md)]

## Choose next steps based on your application type

* [Register a web application](#register-a-web-app)
* [Register a web API](#register-a-web-api)
* [Register a mobile or native application](#register-a-mobile-or-native-app)
 
### Register a web app

[!INCLUDE [active-directory-b2c-register-web-app](../../includes/active-directory-b2c-register-web-app.md)]

### Create a web app client secret

If your web application calls a web API secured by Azure AD B2C, perform these steps:
   1. Create an application secret by going to the **Keys** blade and clicking the **Generate Key** button. Make note of the **App key** value. You use the value as the application secret in your application's code.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

[Jump to **next steps**](#next-steps)

### Register a web API

[!INCLUDE [active-directory-b2c-register-web-api](../../includes/active-directory-b2c-register-web-api.md)]

Click **Published scopes** to add more scopes as necessary. By default, the "user_impersonation" scope is defined. The user_impersonation scope gives other applications the ability to access this api on behalf of the signed-in user. If you wish, the user_impersonation scope can be removed.

[Jump to **next steps**](#next-steps)

### Register a mobile or native app

[!INCLUDE [active-directory-b2c-register-mobile-native-app](../../includes/active-directory-b2c-register-mobile-native-app.md)]

[Jump to **next steps**](#next-steps)

## Limitations

### Choosing a web app or api reply URL

Currently, apps that are registered with Azure AD B2C are restricted to a limited set of reply URL values. The reply URL for web apps and services must begin with the scheme `https`, and all reply URL values must share a single DNS domain. For example, you cannot register a web app that has one of these reply URLs:

`https://login-east.contoso.com`

`https://login-west.contoso.com`

The registration system compares the whole DNS name of the existing reply URL to the DNS name of the reply URL that you are adding. The request to add the DNS name fails if either of the following conditions is true:

* The whole DNS name of the new reply URL does not match the DNS name of the existing reply URL.
* The whole DNS name of the new reply URL is not a subdomain of the existing reply URL.

For example, if the app has this reply URL:

`https://login.contoso.com`

You can add to it, like this:

`https://login.contoso.com/new`

In this case, the DNS name matches exactly. Or, you can do this:

`https://new.login.contoso.com`

In this case, you're referring to a DNS subdomain of login.contoso.com. If you want to have an app that has login-east.contoso.com and login-west.contoso.com as reply URLs, you must add those reply URLs in this order:

`https://contoso.com`

`https://login-east.contoso.com`

`https://login-west.contoso.com`

You can add the latter two because they are subdomains of the first reply URL, contoso.com.

### Choosing a native app redirect URI

There are two important considerations when choosing a redirect URI for mobile/native applications:

* **Unique**: The scheme of the redirect URI should be unique for every application. In the example (com.onmicrosoft.contoso.appname://redirect/path), com.onmicrosoft.contoso.appname is the scheme. We recommend following this pattern. If two applications share the same scheme, the user sees a "choose app" dialog. If the user makes an incorrect choice, the login fails.
* **Complete**: Redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain (for example, //contoso/ works and //contoso fails).

Ensure there are no special characters like underscores in the redirect uri.

### Faulted apps

B2C applications should NOT be edited:

* On other application management portals such as the [Application Registration Portal](https://apps.dev.microsoft.com/).
* Using Graph API or PowerShell

If you edit the Azure AD B2C application as described and try to edit it again in Azure AD B2C features on the Azure portal, it becomes a faulted app, and your application is no longer usable with Azure AD B2C. You need to delete the application and create it again.

To delete the app, go to the [Application Registration Portal](https://apps.dev.microsoft.com/) and delete the application there. In order for the application to be visible, you need to be the owner of the application (and not just an admin of the tenant).

## Next steps

Now that you have an application registered with Azure AD B2C, you can complete one of [the quickstart tutorials](active-directory-b2c-overview.md) to get up and running.

> [!div class="nextstepaction"]
> [Create an ASP.NET web app with sign-up, sign-in, and password reset](active-directory-b2c-devquickstarts-web-dotnet-susi.md)
