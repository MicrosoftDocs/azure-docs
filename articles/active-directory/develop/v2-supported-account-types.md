---
title: Supported accounts in apps (Audience) - Microsoft identity platform
description: Conceptual documentation about audiences and supported account types in applications
services: active-directory
documentationcenter: dev-center-name
author: jmprieur
manager: CelesteDG
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: overview
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 05/07/2019
ms.author: jmprieur
ms.reviewer: saeeda
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Supported account types

This article explains what accounts types (sometimes named audiences) are supported in applications

<!-- This section can be in an include for many of the scenarios (SPA, Web App signing-in users, protecting a Web API, Desktop (depending on the flows), Mobile -->

## Supported accounts types in Microsoft Identity platform applications

In the Microsoft Azure public Cloud, most types of apps can sign in users with any audience:

- If you're writing a Line of Business (LOB) application, you can sign in users in your own organization. Such an application is sometimes named **single tenant**.
- If you're an ISV, you can write an application which signs-in users:

  - In any organization. Such an application is named a **multi-tenant** web application. You'll sometimes read that it signs-in users with their work or school accounts.
  - With their work or school or personal Microsoft account.
  - With only personal Microsoft account.
    > [!NOTE]
    > Currently the Microsoft identity platform supports personal Microsoft accounts only by registering an app for **work or school or Microsoft personal accounts**, and then, restrict sign-in in the code for the application by specifying an Azure AD authority, when building the application, such as `https://login.onmicrosoftonline.com/consumers`.

- If you're writing a business to consumers application, you can also sign in users with their social identities, using Azure AD B2C.

## Certain authentication flows don't support all the account types

Some account types can't be used with certain authentication flows. For instance, in desktop, UWP applications, or daemon applications:

- Daemon applications can only be used with Azure Active Directory organizations. It doesn't make sense to attempt to use daemon applications to manipulate Microsoft personal accounts (the admin consent will never be granted).  
- You can only use the Integrated Windows Authentication flow with work or school accounts (in your organization or any organization). Indeed, Integrated Windows Authentication works with domain accounts, and requires the machines to be domain joined or Azure AD joined. This flow doesn't make sense for personal Microsoft Accounts.
- The [Resource Owner Password Grant](./v2-oauth-ropc.md) (Username/Password), can't be used with personal Microsoft accounts. Indeed, personal Microsoft accounts require that the user consents to accessing personal resources at each sign-in session. That's why, this behavior isn't compatible with non-interactive flows.
- Device code flow doesn't yet work with personal Microsoft accounts.

## Supported account types in national clouds

 Apps can also sign in users in [national clouds](authentication-national-cloud.md). However, Microsoft personal accounts aren't supported in these clouds (by definition of these clouds). That's why the supported account types are reduced, for these clouds, to your organization (single tenant) or any organizations (multi-tenant applications).

## Next steps

- Learn more about [Tenancy in Azure Active Directory](./single-and-multi-tenant-apps.md)
- Learn more about [National Clouds](./authentication-national-cloud.md)