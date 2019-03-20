---
title: Publisher domain | Microsoft Docs
description: Provides an index of available Azure Active Directory (V2 endpoint) code samples, organized by scenario.
services: active-directory
documentationcenter: dev-center-name
author: CelesteDG
manager: mtillman
editor: ''

ms.service: active-directory
ms.subservice: develop
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: identity
ms.date: 03/22/2019
ms.author: celested
ms.reviewer: lenalepa, sureshja
ms.custom: aaddev
ms.collection: M365-identity-device-management
---

# Publisher domain (Preview)

An application’s publisher domain is displayed to users on the [application’s consent prompt](application-consent-experience.md) to let users know where their information is being sent. Multi-tenant applications that are registered after May 21, 2019 that don't have a publisher domain show up as **Unverified**. Multi-tenant applications are applications that support accounts outside of a single organizational directory; for example, support all Azure AD accounts, or support all Azure AD accounts and personal Microsoft accounts.

## New applications

When you register a new app, the publisher domain of your app may be set to a default value. This depends on where the app is registered, particularly whether the app is registered in a tenant and whether the tenant has tenant verified domains.

If there are tenant verified domains, the app’s publisher domain will default to the primary verified domain of the tenant. If there are no tenant verified domains (which is the case when the application is not registered in a tenant), the app’s publisher domain will be set to null.

The following table summarizes the default behavior of the publisher domain value.  

| Tenant verified domains | Default value of publisher domain |
|-------------------------|----------------------------|
| null | null |
| *.onmicrosoft.com | *.onmicrosoft.com |
| - *.onmicrosoft.com<br/>- domain1.com<br/>- domain2.com (primary) | domain2.com |

If a multi-tenant application's publisher domain is not set, or if it's set to a domain that ends in .onmicrosoft.com, the app's consent prompt will inform users of this by showing **unverified** in place of the publisher domain.

## Grandfathered applications

If your app was registered before May 21, 2019, your application's consent prompt will not show **unverified** if you have not set a publisher domain. We recommend that you set the publisher domain value so that users can see this information on your app's consent prompt.

## Configure publisher domain using the Azure portal

To set your app's publisher domain, follow these steps.

1. Sign in to the [Azure portal](https://portal.azure.com) using either a work or school account, or a personal Microsoft account.

1. If your account is present in more than one Azure AD tenant:
   1. Select your profile from the menu on the top right corner of the page, and then **Switch directory**.
   1. Change your session to the Azure AD tenant where you want to create your application.

1. Navigate to [Azure Active Directory > App registrations](https://go.microsoft.com/fwlink/?linkid=2083908) to register your app.

1. Find and select the app you want to configure. Once you've selected the app, you'll see the app's **Overview** page.

1. From the app's **Overview** page, select the **Branding** section.

1. Find the **Publisher domain** field and select **Configure a domain** or **Update domain** if one has already been configured.

   - If your app is registered in a tenant, you'll see two tabs to select from: **Select a verified domain** and **Verify a new domain**.
   - If your app isn't registered in a tenant, you'll only see the option to verify a new domain for your application.

Locate the Publisher domain field. Select Configure a domain or Update domain if one has already been configured. If your application is registered in a tenant you’ll see 2 tabs to select from: ‘Select a verified domain’ and ‘Verify a new domain’. Otherwise, you will only see the option to verify a new domain for your application.


## See also
