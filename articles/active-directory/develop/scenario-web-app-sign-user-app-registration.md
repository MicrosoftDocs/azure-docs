---
title: Register a web app that signs in users - Microsoft identity platform | Azure
description: Learn how to register a web app that signs in users
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
ms.date: 10/30/2019
ms.author: jmprieur
ms.custom: aaddev
#Customer intent: As an application developer, I want to know how to write a web app that signs in users by using the Microsoft identity platform for developers.
---

# Web app that signs in users: App registration

This article explains the app registration specifics for a web app that signs in users.

To register your application, you can use:

- The [web app quickstarts](#register-an-app-by-using-the-quickstarts). In addition to being a great first experience with creating an application, quickstarts in the Azure portal contain a button named **Make this change for me**. You can use this button to set the properties you need, even for an existing app. You'll need to adapt the values of these properties to your own case. In particular, the web API URL for your app is probably going to be different from the proposed default, which will also affect the sign-out URI.
- The Azure portal to [register your application manually](#register-an-app-by-using-the-azure-portal).
- PowerShell and command-line tools.

## Register an app by using the quickstarts

You can use these links to bootstrap the creation of your web application:

- [ASP.NET Core](https://aka.ms/aspnetcore2-1-aad-quickstart-v2)
- [ASP.NET](https://ms.portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/applicationsListBlade/quickStartType/AspNetWebAppQuickstartPage/sourceType/docs)

## Register an app by using the Azure portal

> [!NOTE]
> The portal to use is different depending on whether your application runs in the Microsoft Azure public cloud or in a national or sovereign cloud. For more information, see [National clouds](./authentication-national-cloud.md#app-registration-endpoints).


1. Sign in to the [Azure portal](https://portal.azure.com) by using either a work or school account, or a personal Microsoft account. Alternatively, sign in to the Azure portal of choice for the national cloud.
1. If your account gives you access to more than one tenant, select your account in the upper-right corner. Then, set your portal session to the desired Azure Active Directory (Azure AD) tenant.
1. In the left pane, select the **Azure Active Directory** service, and then select **App registrations** > **New registration**.

# [ASP.NET Core](#tab/aspnetcore)

1. When the **Register an application** page appears, enter your application's registration information:
   1. Choose the supported account types for your application. (See [Supported account types](./v2-supported-account-types.md).)
   1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app. For example, enter **AspNetCore-WebApp**.
   1. For **Redirect URI**, add the type of application and the URI destination that will accept returned token responses after successful authentication. For example, enter **https://localhost:44321**. Then, select **Register**.
1. Select the **Authentication** menu, and then add the following information:
   1. For **Reply URL**, add **https://localhost:44321/signin-oidc** of type **Web**.
   1. In the **Advanced settings** section, set **Logout URL** to **https://localhost:44321/signout-oidc**.
   1. Under **Implicit grant**, select **ID tokens**.
   1. Select **Save**.

# [ASP.NET](#tab/aspnet)

1. When the **Register an application page** appears, enter your application's registration information:
   1. Choose the supported account types for your application. (See [Supported account types](./v2-supported-account-types.md).)
   1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app. For example, enter **MailApp-openidconnect-v2**.
   1. In the **Redirect URI (optional)** section, select **Web** in the combo box and enter the following redirect URI: **https://localhost:44326/**.
1. Select **Register** to create the application.
1. Select the **Authentication** menu.
1. In the **Advanced settings** | **Implicit grant** section, select **ID tokens**. This sample requires the [implicit grant flow](v2-oauth2-implicit-grant-flow.md) to be enabled to sign in the user.
1. Select **Save**.

# [Java](#tab/java)

1. When the **Register an application page** appears, enter a display name for the application. For example, enter **java-webapp**.
1. Select **Accounts in any organizational directory
and personal Microsoft Accounts (e.g. Skype, Xbox, Outlook.com)**,
   and then select **Web app / API** for **Application Type**.
1. Select **Register** to register the application.
1. On the left menu, select **Authentication**. Under **Redirect URIs**, select **Web**.

1. Enter two redirect URIs: one for the sign-in page, and one for the graph page. For both, use the same host and port number, followed by **/msal4jsample/secure/aad** for the sign-in page and **msal4jsample/graph/me** for the user information page.

   By default, the sample uses:

   - **http://localhost:8080/msal4jsample/secure/aad**
   - **http://localhost:8080/msal4jsample/graph/me**

  Then, select **Save**.

1. Select **Certificates & secrets** from the menu.
1. In the **Client secrets** section, select **New client secret**, and then:

   1. Enter a key description.
   1. Select the key duration **In 1 year**.
   1. Select **Add**.
   1. When the key value appears, copy it for later. This value will not be displayed again or be retrievable by any other means.

# [Python](#tab/python)

1. When the **Register an application page** appears, enter your application's registration information:
   1. In the **Name** section, enter a meaningful application name that will be displayed to users of the app. For example, enter **python-webapp**.
   1. Change **Supported account types** to **Accounts in any organizational directory and personal Microsoft accounts (e.g. Skype, Xbox, Outlook.com)**.
   1. In the **Redirect URI (optional)** section, select **Web** in the combo  box and enter the following redirect URI: **http://localhost:5000/getAToken**.
1. Select **Register** to create the application.
1. On the app's **Overview** page, find the **Application (client) ID** value and record it for later. You'll need it to configure the Visual Studio configuration file for this project.
1. On the left menu, select **Certificates & secrets**.
1. In the **Client Secrets** section, select **New client secret**, and then:

   1. Enter a key description.
   1. Select a key duration of **In 1 year**.
   1. Select **Add**.
   1. When the key value appears, copy it. You'll need it later.
---

## Register an app by using PowerShell

> [!NOTE]
> Currently, Azure AD PowerShell creates applications with only the following supported account types:
>
> - MyOrg (accounts in this organizational directory only)
> - AnyOrg (accounts in any organizational directory)
>
> You can create an application that signs in users with their personal Microsoft accounts (for example, Skype, Xbox, or Outlook.com). First, create a multitenant application. Supported account types are accounts in any organizational directory. Then, change the `signInAudience` property in the application manifest from the Azure portal. For more information, see [step 1.3](https://github.com/Azure-Samples/active-directory-aspnetcore-webapp-openidconnect-v2/tree/master/1-WebApp-OIDC/1-3-AnyOrgOrPersonal#step-1-register-the-sample-with-your-azure-ad-tenant) in the ASP.NET Core tutorial. You can generalize this step to web apps in any language.

## Next steps

> [!div class="nextstepaction"]
> [App's code configuration](scenario-web-app-sign-user-app-configuration.md)
