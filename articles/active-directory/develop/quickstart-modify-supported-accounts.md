---
title: Modify the accounts supported by an application registered with the Microsoft identity platform | Azure
description: Configure an application registered with the Microsoft identity platform to change who, or what accounts, can access the application.
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
ms.date: 05/08/2019
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: aragra, lenalepa, sureshja
#Customer intent: As an application developer, I need to know how to modify the accounts supported by my application.
ms.collection: M365-identity-device-management
---

# Quickstart: Modify the accounts supported by an application

When registering an application in the Microsoft identity platform, you may want your application to be accessed only by users in your organization. Alternatively, you may also want your application to be accessible by users in external organizations, or by users in external organizations as well as users that are not necessarily part of an organization (personal accounts).

In this quickstart, you'll learn how to modify your application's configuration to change who, or what accounts, can access the application.

## Prerequisites

To get started, make sure you complete these prerequisites:

* Learn about the supported [permissions and consent](v2-permissions-and-consent.md), which is important to understand when building applications that need to be used by other users or applications.
* Have a tenant that has applications registered to it.
  * If you don't have apps registered, [learn how to register applications with the Microsoft identity platform](quickstart-register-app.md).

## Sign in to the Azure portal and select the app

Before you can configure the app, follow these steps:

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account or a personal Microsoft account.
1. If your account gives you access to more than one tenant, select your account in the top right corner, and set your portal session to the desired Azure AD tenant.
1. In the left-hand navigation pane, select the **Azure Active Directory** service and then select **App registrations**.
1. Find and select the application you want to configure. Once you've selected the app, you'll see the application's **Overview** or main registration page.
1. Follow the steps to [change the application registration to support different accounts](#change-the-application-registration-to-support-different-accounts).
1. If you have a single-page application, [enable OAuth 2.0 implicit grant](#enable-oauth-20-implicit-grant-for-single-page-applications).

## Change the application registration to support different accounts

If you are writing an application that you want to make available to your customers or partners outside of your organization, you need to update the application definition in the Azure portal.

> [!IMPORTANT]
> Azure AD requires the Application ID URI of multi-tenant applications to be globally unique. The App ID URI is one of the ways an application is identified in protocol messages. For a single-tenant application, it is sufficient for the App ID URI to be unique within that tenant. For a multi-tenant application, it must be globally unique so Azure AD can find the application across all tenants. Global uniqueness is enforced by requiring the App ID URI to have a host name that matches a verified domain of the Azure AD tenant. For example, if the name of your tenant is contoso.onmicrosoft.com, then a valid App ID URI would be https://contoso.onmicrosoft.com/myapp. If your tenant has a verified domain of contoso.com, then a valid App ID URI would also be https://contoso.com/myapp. If the App ID URI doesn’t follow this pattern, setting an application as multi-tenant fails.

### To change who can access your application

1. From the app's **Overview** page, select the **Authentication** section and change the value selected under **Supported account types**.
    * Select **Accounts in this directory only** if you are building a line-of-business (LOB) application. This option is not available if the application is not registered in a directory.
    * Select **Accounts in any organizational directory** if you would like to target all business and educational customers.
    * Select  **Accounts in any organizational directory and personal Microsoft accounts** to target the widest set of customers.
1. Select **Save**.

## Enable OAuth 2.0 implicit grant for single-page applications

Single-page applications (SPAs) are typically structured with a JavaScript-heavy front end that runs in the browser, which calls the application’s web API back-end to perform its business logic. For SPAs hosted in Azure AD, you use OAuth 2.0 Implicit Grant to authenticate the user with Azure AD and obtain a token that you can use to secure calls from the application's JavaScript client to its back-end web API.

After the user has granted consent, this same authentication protocol can be used to obtain tokens to secure calls between the client and other web API resources configured for the application. To learn more about the implicit authorization grant, and help you decide whether it's right for your application scenario, learn about the OAuth 2.0 implicit grant flow in Azure AD [v1.0](v1-oauth2-implicit-grant-flow.md) and [v2.0](v2-oauth2-implicit-grant-flow.md).

By default, OAuth 2.0 implicit grant is disabled for applications. You can enable OAuth 2.0 implicit grant for your application by following the steps outlined below.

### To enable OAuth 2.0 implicit grant

1. From the app's **Overview** page, select the **Authentication** section.
1. Under **Advanced settings**, locate the **Implicit grant** section.
1. Select **ID tokens**, **Access tokens**, or both.
1. Select **Save**.

## Next steps

Learn about these other related app management quickstarts for apps:

* [Register an application with the Microsoft identity platform](quickstart-register-app.md)
* [Configure a client application to access web APIs](quickstart-configure-app-access-web-apis.md)
* [Configure an application to expose web APIs](quickstart-configure-app-expose-web-apis.md)
* [Remove an application registered with the Microsoft identity platform](quickstart-remove-app.md)

To learn more about the two Azure AD objects that represent a registered application and the relationship between them, see [Application objects and service principal objects](app-objects-and-service-principals.md).

To learn more about the branding guidelines you should use when developing applications with Azure Active Directory, see [Branding guidelines for applications](howto-add-branding-in-azure-ad-apps.md).
