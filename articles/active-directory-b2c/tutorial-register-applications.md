---
title: Tutorial - Register an application to enable sign-up and sign-in using Azure Active Directory B2C | Microsoft Docs
description: Use the Azure portal to create an Azure AD B2C tenant and register an application with it.
services: active-directory-b2c
documentationcenter: ''
author: davidmu1
manager: mtillman
editor: patricka

ms.service: active-directory-b2c
ms.workload: identity
ms.topic: article
ms.date: 03/08/2018
ms.author: davidmu

---
# Tutorial: Register an application to enable sign-up and sign-in using Azure Active Directory B2C

This tutorial helps you create a Microsoft Azure Active Directory (Azure AD) B2C tenant and register an application with it in just a few minutes.

In this article, you learn how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription
> * Register your application

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Log in to Azure

Log in to the [Azure portal](https://portal.azure.com/).

## Create an Azure AD B2C tenant

B2C features can't be enabled in your existing tenants. You need to create an Azure AD B2C tenant.

[!INCLUDE [active-directory-b2c-create-tenant](../../includes/active-directory-b2c-create-tenant.md)]

Congratulations, you have created an Azure Active Directory B2C tenant. You are a Global Administrator of the tenant. You can add other Global Administrators as required. To switch to your new tenant, click the *manage your new tenant link*.

![Manage your new tenant link](./media/active-directory-b2c-get-started/manage-new-b2c-tenant-link.png)

> [!IMPORTANT]
> If you are planning to use a B2C tenant for a production app, read the article on [production-scale vs. preview B2C tenants](active-directory-b2c-reference-tenant-type.md). There are known issues when you delete an existing B2C tenant and re-create it with the same domain name. You need to create a B2C tenant with a different domain name.
>
>

## Link your tenant to your subscription

You need to link your Azure AD B2C tenant to your Azure subscription to enable all B2C functionality and pay for usage charges. To learn more, read [this article](active-directory-b2c-how-to-enable-billing.md). If you don't link your Azure AD B2C tenant to your Azure subscription, some functionality is blocked and, you see a warning message ("No Subscription linked to this B2C tenant or the Subscription needs your attention.") in the B2C settings. It is important that you take this step before you ship your apps into production.


[!INCLUDE [active-directory-b2c-find-service-settings](../../includes/active-directory-b2c-find-service-settings.md)]

You can also access the blade by entering `Azure AD B2C` in **Search resources** at the top of the portal. In the results list, select **Azure AD B2C** to access the B2C settings blade.

## Register your application

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

Applications created in the Azure portal must be managed from the same location. If you edit the Azure AD B2C applications using PowerShell or another portal, they become unsupported and do not work with Azure AD B2C. See details in the [faulted apps](#faulted-apps) section. 

This article uses examples that will help you get started with our samples. You can learn more about these samples in the subsequent articles.

### Navigate to B2C settings

Log in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant. 

[!INCLUDE [active-directory-b2c-switch-b2c-tenant](../../includes/active-directory-b2c-switch-b2c-tenant.md)]

[!INCLUDE [active-directory-b2c-portal-navigate-b2c-service](../../includes/active-directory-b2c-portal-navigate-b2c-service.md)]

### Choose next steps based on your application type

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

In this article, you learned how to:

> [!div class="checklist"]
> * Create an Azure AD B2C tenant
> * Link your tenant to your subscription
> * Register your application

> [!div class="nextstepaction"]
> [Enable a web application to authenticate with accounts](active-directory-b2c-app-registration.md)