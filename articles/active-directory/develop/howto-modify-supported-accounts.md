---
title: "How to: Change the account types supported by an application"
description: In this how-to, you configure an application registered with the Microsoft identity platform to change who, or what accounts, can access the application.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 02/17/2023
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: aragra, sureshja
# Customer intent: As an application developer, I need to know how to modify which account types can sign in to or access my application or API.
---

# Modify the accounts supported by an application

When you registered your application with the Microsoft identity platform, you specified who--which account types--can access it. For example, you might've specified accounts only in your organization, which is a *single-tenant* app. Or, you might've specified accounts in any organization (including yours), which is a *multi-tenant* app.

In the following sections, you learn how to modify your app's registration in the Azure portal to change who, or what types of accounts, can access the application.

## Prerequisites

* An [application registered in your Azure AD tenant](quickstart-register-app.md)

## Change the application registration to support different accounts

[!INCLUDE [portal updates](~/articles/active-directory/includes/portal-update.md)]

To specify a different setting for the account types supported by an existing app registration:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directories + subscriptions** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to switch to the tenant in which the app is registered.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, select your application, and then select **Manifest** to use the manifest editor.
1. Download the manifest JSON file locally.
1. Now, specify who can use the application, sometimes referred to as the *sign-in audience*.  Find the *signInAudience* property in the manifest JSON file and set it to one of the following property values:

    | Property value | Supported account types | Description |
    |----------------|-------------------------|-------------|
    | **AzureADMyOrg** | Accounts in this organizational directory only (Microsoft only - Single tenant) |All user and guest accounts in your directory can use your application or API. Use this option if your target audience is internal to your organization. |
    | **AzureADMultipleOrgs** | Accounts in any organizational directory (Any Azure AD directory - Multitenant) | All users with a work or school account from Microsoft can use your application or API. This includes schools and businesses that use Office 365. Use this option if your target audience is business or educational customers and to enable multitenancy. |
    | **AzureADandPersonalMicrosoftAccount** | Accounts in any organizational directory (Any Azure AD directory - Multitenant) and personal Microsoft accounts (e.g. Skype, Xbox) | All users with a work or school, or personal Microsoft account can use your application or API. It includes schools and businesses that use Office 365 as well as personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities and to enable multitenancy.|
    | **PersonalMicrosoftAccount** | Personal Microsoft accounts only | Personal accounts that are used to sign in to services like Xbox and Skype. Use this option to target the widest set of Microsoft identities.|
1. Save your changes to the JSON file locally, then select **Upload** in the manifest editor to upload the updated manifest JSON file.

### Why changing to multi-tenant can fail

Switching an app registration from single- to multi-tenant can sometimes fail due to Application ID URI (App ID URI) name collisions. An example App ID URI is `https://contoso.onmicrosoft.com/myapp`.

The App ID URI is one of the ways an application is identified in protocol messages. For a single-tenant application, the App ID URI need only be unique within that tenant. For a multi-tenant application, it must be globally unique so Azure AD can find the app across all tenants. Global uniqueness is enforced by requiring that the App ID URI's host name matches one of the Azure AD tenant's [verified publisher domains](howto-configure-publisher-domain.md).

For example, if the name of your tenant is *contoso.onmicrosoft.com*, then `https://contoso.onmicrosoft.com/myapp` is a valid App ID URI. If your tenant has a verified domain of *contoso.com*, then a valid App ID URI would also be `https://contoso.com/myapp`. If the App ID URI doesn't follow the second pattern, `https://contoso.com/myapp`, converting the app registration to multi-tenant fails.

For more information about configuring a verified publisher domain, see [Configure a verified domain](howto-configure-publisher-domain.md).

## Next steps

Learn more about the requirements for [converting an app from single- to multi-tenant](howto-convert-app-to-be-multi-tenant.md).
