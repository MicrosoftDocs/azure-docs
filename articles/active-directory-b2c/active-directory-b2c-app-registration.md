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
> Applications created from the Azure AD B2C blade in the Azure portal must be managed from the same management tool. If you edit the B2C applications using PowerShell or another tool, they become unsupported and may not work with Azure AD B2C.
> 
> 

## Prerequisites

To build an application that accepts consumer sign-up and sign-in, you first need to register the application with an Azure Active Directory B2C tenant. Get your own tenant by using the steps outlined in [Create an Azure AD B2C tenant](active-directory-b2c-get-started.md).

[!INCLUDE [active-directory-b2c-devquickstarts-v2-apps](../../includes/active-directory-b2c-devquickstarts-v2-apps.md)]

## Navigate to the B2C settings

Log in to the [Azure portal](https://portal.azure.com/) as the Global Administrator of the B2C tenant. 

[!INCLUDE [active-directory-b2c-find-service-settings](../../includes/active-directory-b2c-find-service-settings.md)]


> [!IMPORTANT]
> You need to be a Global Administrator of the B2C tenant to be able to access the B2C settings blade. A Global Administrator from any other tenant or a user from any tenant cannot access it.  You can switch to your B2C tenant by using the tenant switcher in the top right corner of the Azure portal.
> 
> 

Choose next steps based on the application type you are registering:

* [Register a web application](#register-a-web-application)
* [Register a web API](#register-a-web-api)
* [Register a mobile or native application](#register-a-mobile-or-native-application)
 
## Register a web application

In the B2C settings blade, click **Applications**.

![Applications button in the settings blade](./media/active-directory-b2c-app-registration/b2c-settings.png)

Click **+ Add** in the applications blade.

![+ Add button in the applications blade](./media/active-directory-b2c-app-registration/b2c-applications-add.png)

Enter a **Name** for the application that describes your application to consumers. For example, you could enter `Contoso B2C app`.

Toggle the **Web app / Web API** switch to **Yes**.

If your application needs to use [OpenID Connect sign-in](active-directory-b2c-reference-oidc.md), toggle the **Allow implicit flow** toggle to **Yes**.

The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, enter `https://contoso.com/b2capp`.

![Example settings in the new application blade](./media/active-directory-b2c-app-registration/b2c-new-app-settings.png)

Click **Create** to register your application. Your application is now registered and will be listed in the applications list for the B2C tenant.

In the applications blade, find and select your newly registered application. The application's property page will be displayed.

Make note of the  globally unique **Application Client ID** that you include in your application's code.

If your web application calls a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

[Jump to **Next steps**](#next-steps)

## Register a web API

On the B2C settings blade on the Azure portal, click **Applications**.

![Applications button in the settings blade](./media/active-directory-b2c-app-registration/b2c-settings.png)

Click **+ Add** at the top of the blade.

![+ Add button in the applications blade](./media/active-directory-b2c-app-registration/b2c-applications-add.png)

Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C api".

Toggle the **Include web app / web API** switch to **Yes**. The **Reply URLs** are endpoints where Azure AD B2C returns any tokens that your application requests. For example, if your web API is local and listening on port 44316, you could enter `https://localhost:44316/`.

Enter an **App ID URI**. The App ID URI is the identifier used for your web API. For example, enter 'notes'. The full identifier URI is generated for you.

Click **Create** to register your application. Your application is now registered and will be listed in the applications list for the B2C tenant.

Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.

Click **Published scopes**. The published scopes are where you define the permissions (scopes) that can be granted to other applications.

Add more scopes as necessary. By default, the "user_impersonation" scope is defined. The user_impersonation scope gives other applications the ability to access this api on behalf of the signed-in user. If you wish, the user_impersonation scope can be removed.

Click **Save**.

[Jump to **Next steps**](#next-steps)

## Register a mobile or native application

On the B2C settings blade on the Azure portal, click **Applications**.

![Applications button in the settings blade](./media/active-directory-b2c-app-registration/b2c-settings.png)

Click **+ Add** at the top of the blade.

![+ Add button in the applications blade](./media/active-directory-b2c-app-registration/b2c-applications-add.png)

Enter a **Name** for the application that describes your application to consumers. For example, you could enter "Contoso B2C app".

![+ Add button in the applications blade](./media/active-directory-b2c-app-registration/b2c-applications-add.png)

Toggle the **Include native client** switch to **Yes**.

Enter a **Redirect URI** with a custom scheme. For example, com.onmicrosoft.contoso.appname://redirect/path. Make sure you choose a [good redirect URI](#choosing-a-redirect-uri) and do not include special characters such as underscores.

Click **Save** to register your application.

Click the application that you created and copy down the globally unique **Application Client ID** that you use later in your code.

If your native application is calling a web API secured by Azure AD B2C, you want to:
   1. Create an **Application Secret** by going to the **Keys** blade and clicking the **Generate Key** button.
   2. Click **API Access**, click **Add**, and select your web API and scopes (permissions).

> [!NOTE]
> An **Application Secret** is an important security credential, and should be secured appropriately.
> 

[Jump to **Next steps**](#next-steps)

### Choosing a redirect URI

There are two important considerations when choosing a redirect URI for mobile/native applications:

* **Unique**: The scheme of the redirect URI should be unique for every application. In our example (com.onmicrosoft.contoso.appname://redirect/path), we use com.onmicrosoft.contoso.appname as the scheme. We recommend following this pattern. If two applications share the same scheme, the user sees a "choose app" dialog. If the user makes an incorrect choice, the login fails.
* **Complete**: Redirect URI must have a scheme and a path. The path must contain at least one forward slash after the domain (for example, //contoso/ works and //contoso fails).

Ensure there are no special characters like underscores in the redirect uri.

## Next steps

> [!div class="nextstepaction"]
> [Create an ASP.NET web app with sign-up, sign-in, and password reset](active-directory-b2c-devquickstarts-web-dotnet-susi.md)

