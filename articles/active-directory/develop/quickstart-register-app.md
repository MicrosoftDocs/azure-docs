---
title: Register an app with the Microsoft identity platform - Microsoft identity platform
description: Learn how to add and register an application with the Microsoft identity platform.
services: active-directory
documentationcenter: ''
author: rwike77
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: quickstart
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/09/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: aragra, lenalepa, sureshja
#Customer intent: As an enterprise developer and software-as-a-service provider, I want to know how to add and register my application with the Microsoft identity platform.
ms.collection: M365-identity-device-management
---

# Quickstart: Register an application with the Microsoft identity platform

Enterprise developers and software-as-a-service (SaaS) providers can develop commercial cloud services or line-of-business applications that can be integrated with Microsoft identity platform to provide secure sign-in and authorization for their services.

This quickstart shows you how to add and register an application using the **App registrations** experience in the Azure portal so that your app can be integrated with the Microsoft identity platform. To learn more about the new features and improvements in the new app registrations experience, see [this blog post](https://developer.microsoft.com/graph/blogs/new-app-registration/).

## Register a new application using the Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the Azure AD tenant that you want.
1. In the left-hand navigation pane, select the **Azure Active Directory** service, and then select **App registrations > New registration**.
1. When the **Register an application** page appears, enter your application's registration information:

   - **Name** - Enter a meaningful application name that will be displayed to users of the app.
   - **Supported account types** - Select which accounts you would like your application to support.

       | Supported account types | Description |
       |-------------------------|-------------|
       | **Accounts in this organizational directory only** | Select this option if you're building a line-of-business (LOB) application. This option is not available if you're not registering the application in a directory.<br><br>This option maps to Azure AD only single-tenant.<br><br>This is the default option unless you're registering the app outside of a directory. In cases where the app is registered outside of a directory, the default is Azure AD multi-tenant and personal Microsoft accounts. |
       | **Accounts in any organizational directory** | Select this option if you would like to target all business and educational customers.<br><br>This option maps to an Azure AD only multi-tenant.<br><br>If you registered the app as Azure AD only single-tenant, you can update it to be Azure AD multi-tenant and back to single-tenant through the **Authentication** blade. |
       | **Accounts in any organizational directory and personal Microsoft accounts** | Select this option to target the widest set of customers.<br><br>This option maps to Azure AD multi-tenant and personal Microsoft accounts.<br><br>If you registered the app as Azure AD multi-tenant and personal Microsoft accounts, you cannot change this in the UI. Instead, you must use the application manifest editor to change the supported account types. |

   - **Redirect URI (optional)** - Select the type of app you're building, **Web** or **Public client (mobile & desktop)**, and then enter the redirect URI (or reply URL) for your application.
       - For web applications, provide the base URL of your app. For example, `http://localhost:31544` might be the URL for a web app running on your local machine. Users would use this URL to sign in to a web client application.
       - For public client applications, provide the URI used by Azure AD to return token responses. Enter a value specific to your application, such as `myapp://auth`.

     To see specific examples for web applications or native applications, check out our [quickstarts](https://docs.microsoft.com/azure/active-directory/develop).

1. When finished, select **Register**.

    [![Shows the screen to register a new application in the Azure portal](./media/quickstart-add-azure-ad-app-preview/new-app-registration-expanded.png)](./media/quickstart-add-azure-ad-app-preview/new-app-registration-expanded.png#lightbox)

Azure AD assigns a unique application (client) ID to your app, and you're taken to your application's **Overview** page. To add additional capabilities to your application, you can select other configuration options including branding, certificates and secrets, API permissions, and more.

[![Example of a newly registered app's overview page](./media/quickstart-add-azure-ad-app-preview/new-app-overview-page-expanded.png)](./media/quickstart-add-azure-ad-app-preview/new-app-overview-page-expanded.png#lightbox)

## Next steps

- Learn about the [permissions and consent](v2-permissions-and-consent.md).
- To enable additional configuration features in your application registration, such as credentials and permissions, and enable sign-in for users from other tenants, see these quickstarts:
    - [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md)
    - [Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md)
    - [Modify the accounts supported by an application](quickstart-modify-supported-accounts.md)
- Choose a [quickstart](https://docs.microsoft.com/azure/active-directory/develop) to quickly build an app and add functionality like getting tokens, refreshing tokens, signing in a user, displaying some user info, and more.
- Learn more about the two Azure AD objects that represent a registered application and the relationship between them, see [Application objects and service principal objects](app-objects-and-service-principals.md).
- Learn more about the branding guidelines you should use when developing apps, see [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).
