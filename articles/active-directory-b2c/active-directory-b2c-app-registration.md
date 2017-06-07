---
title: 'Azure Active Directory B2C: Application registration | Microsoft Docs'
description: How to register your application with Azure Active Directory B2C
services: active-directory-b2c
documentationcenter: ''
author: parakhj
manager: krassk
editor: parakhj

ms.assetid: 20e92275-b25d-45dd-9090-181a60c99f69
ms.service: active-directory-b2c
ms.workload: identity
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 3/13/2017
ms.author: parakhj


---
# Azure Active Directory B2C: Register your application

This Quickstart helps you register an application in a Microsoft Azure Active Directory (Azure AD) B2C tenant in a few minutes. When you're finished, your application is registered for use in the Azure B2C tenant.

> [!IMPORTANT]
> Applications created from the Azure AD B2C blade in the Azure portal must be managed from the same management tool. If you edit the B2C applications using PowerShell or another portal, they become unsupported and may not work with Azure AD B2C.
> 
> 

## Prerequisite

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

[!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Navigate to the B2C features blade

If you have the B2C features blade [pinned to your Startboard](active-directory-b2c-get-started.md#navigate-to-the-b2c-features-blade-on-the-azure-portal), the blade is available after you sign in to the [Azure portal](https://portal.azure.com/) as the B2C tenant's Global Administrator.

You can also access the blade by entering `Azure AD B2C` in **Search resources** at the top of the portal. In the results list, select **Azure AD B2C** to access the B2C features blade.

> [!IMPORTANT]
> You need to be a Global Administrator of the B2C tenant to be able to access the B2C features blade. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure portal.
> 
> 

## Register a web application
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C app".
4. Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, enter `https://localhost:44316/`.
5. Click **Create** to register your application.
6. Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code. 
7. If your web application calls a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

## Register a web api
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C api".
4. Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, enter `https://localhost:44316/`.
5. Enter an **App ID URI**. The App ID URI is the identifier used for your web API. For example, enter 'notes'. The full identifier URI is generated for you. 
6. Click **Create** to register your application.
7. Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.
8. Click **Published scopes**. The published scopes are where you define the permissions (scopes) that can be granted to other applications.
9. Add more scopes as necessary. By default, the "user_impersonation" scope is defined. The user_impersonation scope gives other applications the ability to access this api on behalf of the signed-in user. If you wish, the user_impersonation scope can be removed.
10. Click **Save**.

## Register a mobile/native application
1. On the B2C features blade on the Azure portal, click **Applications**.
2. Click **+Add** at the top of the blade.
3. Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C app".
4. Toggle the **Include native client** switch to **Yes**.
5. Enter a **Redirect URI** with a custom scheme. For example, com.onmicrosoft.contoso.appname://redirect/path. Make sure you choose a [good redirect URI](#choosing-a-redirect-uri) and do not include special characters such as underscores.
6. Click **Save** to register your application.
7. Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.
8. If your native application is calling a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

### Choosing a redirect URI

There are two important considerations when choosing a redirect URI for mobile/native applications:

* **Unique**: The scheme of the redirect URI should be unique for every application. In our example (com.onmicrosoft.contoso.appname://redirect/path), we use com.onmicrosoft.contoso.appname as the scheme. We recommend following this pattern. If two applications share the same scheme, the user sees a "choose app" dialog. If the user makes an incorrect choice, the login fails.
* **Complete**: Redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain (for example, //contoso/ works and //contoso fails).

Ensure there are no special characters like underscores in the redirect uri.

## Build an application
Now that you have an application registered with Azure AD B2C, you can complete one of [our quick-start tutorials](active-directory-b2c-overview.md#get-started) to get up and running.

