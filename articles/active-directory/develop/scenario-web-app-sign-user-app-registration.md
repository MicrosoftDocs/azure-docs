---
title: Web app that signs in users (app registration) - Microsoft identity platform
description: Learn how to build a web app that signs in users (app registration)
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.custom: aaddev 
#Customer intent: As an application developer, I want to know how to write a web app that signs-in users using the Microsoft identity platform for developers.
ms.collection: M365-identity-device-management
---

# Web app that signs in users - app registration

This page explains the app registration specifics for a web app that signs-in users.

To register your application, you can use:

- The [web app quickstarts](#register-an-app-using-the-quickstarts) - In addition to being a great first experience with creating an application, quickstarts in the Azure portal contain a button named **Make this change for me**. You can use this button to set the properties you need, even for an existing app. You'll need to adapt the values of these properties to your own case. In particular, the web API URL for your app is probably going to be different from the proposed default, which will also impact the sign out URI.
- The Azure portal to [register your application manually](#register-an-app-using-azure-portal)
- PowerShell and command-line tools

## Register an app using the QuickStarts

If you navigate to this link, you can create bootstrap the creation of your web application:

- [ASP.NET Core](https://aka.ms/aspnetcore2-1-aad-quickstart-v2)
- [ASP.NET](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/AspNetWebAppQuickstartPage/sourceType/docs)

### Register an app using Azure portal

> [!NOTE]
> the portal to use is different depending on if your application runs in the Microsoft Azure public cloud or in a national or sovereign cloud. For more information, see [National Clouds](./authentication-national-cloud.md#app-registration-endpoints)

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account. Alternatively, sign in to the national cloud Azure portal of choice.
1. If your account gives you access to more than one tenant, select your account in the top-right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service, and then select **App registrations** > **New registration**.
1. When the **Register an application** page appears, enter your application's registration information:
   1. choose the supported account types for your application (See [Supported Account types](./v2-supported-account-types.md))
   1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app, for example `AspNetCore-WebApp`.
   1. In **Redirect URI**, add the type of application and the URI destination that will accept returned token responses after successfully authenticating. For example, `https://localhost:44321/`.  Select **Register**.
1. Select the **Authentication** menu, and then add the following information:
   1. In **Reply URL**, add `https://localhost:44321/signin-oidc`.
   1. In the **Advanced settings** section, set **Logout URL** to `https://localhost:44321/signout-oidc`.
   1. Under **Implicit grant**, check **ID tokens**.
   1. Select **Save**.

### Register an app using PowerShell

> [!NOTE]
> Currently Azure AD PowerShell only creates applications with the following supported account types:
>
> - MyOrg (Accounts in this organizational directory only)
> - AnyOrg (Accounts in any organizational directory).
>
> If you want to create an application that signs-in users with their personal Microsoft Accounts (e.g. Skype, XBox, Outlook.com), you can first create a multi-tenant application (Supported account types = Accounts in any organizational directory), and then change the `signInAudience` property in the application manifest from the Azure portal. This is explained in details in the step [1.3](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-3-AnyOrgOrPersonal#step-1-register-the-sample-with-your-azure-ad-tenant) of the ASP.NET Core tutorial (and can be generalized to web apps in any language).

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-app-sign-user-app-configuration.md)
