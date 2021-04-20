---
title: "How to: Change the account types supported by an application | Azure"
titleSuffix: Microsoft identity platform
description: In this how-to, you configure an application registered with the Microsoft identity platform to change who, or what accounts, can access the application.
services: active-directory
author: rwike77
manager: CelesteDG

ms.service: active-directory
ms.subservice: develop
ms.topic: how-to
ms.workload: identity
ms.date: 11/15/2020
ms.author: ryanwi
ms.custom: aaddev
ms.reviewer: marsma, aragra, lenalepa, sureshja
# Customer intent: As an application developer, I need to know how to modify which account types can sign in to or access my application or API.
---

# How to modify the accounts supported by an application

When you registered your application with the Microsoft identity platform, you specified who--which account types--can access it. For example, you might've specified accounts only in your organization, which is a *single-tenant* app. Or, you might've specified accounts in any organization (including yours), which is a *multi-tenant* app.

In the following sections, you learn how to modify your app's registration in the Azure portal to change who, or what types of accounts, can access the application.

## Prerequisites

* An [application registered in your Azure AD tenant](quickstart-register-app.md)

## Change the application registration to support different accounts

To specify a different setting for the account types supported by an existing app registration:

1. Sign in to the <a href="https://portal.azure.com/" target="_blank">Azure portal</a>.
1. If you have access to multiple tenants, use the **Directory + subscription** filter :::image type="icon" source="./media/common/portal-directory-subscription-filter.png" border="false"::: in the top menu to select the tenant in which you want to register an application.
1. Search for and select **Azure Active Directory**.
1. Under **Manage**, select **App registrations**, then select your application.
1. Now, specify who can use the application, sometimes referred to as the *sign-in audience*.

    | Supported account types | Description |
    |-------------------------|-------------|
    | **Accounts in this organizational directory only** | Select this option if you're building an application for use only by users (or guests) in *your* tenant.<br><br>Often called a *line-of-business* (LOB) application, this is a **single-tenant** application in the Microsoft identity platform. |
    | **Accounts in any organizational directory** | Select this option if you'd like users in *any* Azure AD tenant to be able to use your application. This option is appropriate if, for example, you're building a software-as-a-service (SaaS) application that you intend to provide to multiple organizations.<br><br>This is known as a **multi-tenant** application in the Microsoft identity platform. |
1. Select **Save**.

### Why changing to multi-tenant can fail

Switching an app registration from single- to multi-tenant can sometimes fail due to Application ID URI (App ID URI) name collisions. An example App ID URI is `https://contoso.onmicrosoft.com/myapp`.

The App ID URI is one of the ways an application is identified in protocol messages. For a single-tenant application, the App ID URI need only be unique within that tenant. For a multi-tenant application, it must be globally unique so Azure AD can find the app across all tenants. Global uniqueness is enforced by requiring that the App ID URI's host name matches one of the Azure AD tenant's [verified publisher domains](howto-configure-publisher-domain.md).

For example, if the name of your tenant is *contoso.onmicrosoft.com*, then `https://contoso.onmicrosoft.com/myapp` is a valid App ID URI. If your tenant has a verified domain of *contoso.com*, then a valid App ID URI would also be `https://contoso.com/myapp`. If the App ID URI doesn't follow the second pattern, `https://contoso.com/myapp`, converting the app registration to multi-tenant fails.

For more information about configuring a verified publisher domain, see [Configure a verified domain](howto-configure-publisher-domain.md).

## Next steps

Learn more about the requirements for [converting an app from single- to multi-tenant](howto-convert-app-to-be-multi-tenant.md).
