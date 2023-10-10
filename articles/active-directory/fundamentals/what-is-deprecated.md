---
title: What's deprecated in Microsoft Entra ID?
description: Learn about features being deprecated in Microsoft Entra ID
author: janicericketts
manager: martinco
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: jricketts
ms.reviewer: merill
ms.custom: it-pro, has-azure-ad-ps-ref
---

# What's deprecated in Microsoft Entra ID?

The lifecycle of functionality, features, and services are governed by policy, support timelines, data, also leadership and engineering team decisions. Lifecycle information allows customers to predictably plan long-term deployment aspects, transition from outdated to new technology, and help improve business outcomes. Use the definitions below to understand the following table with change information about Microsoft Entra ID and Microsoft Entra features, services, and functionality. 

Get notified about when to revisit this page for updates by copying and pasting this URL: `https://learn.microsoft.com/api/search/rss?search=%22What's+deprecated+in+Azure+Active+Directory%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

## Upcoming changes

Use the following table to learn about changes including deprecations, retirements, breaking changes and rebranding. Also find key dates and recommendations.

   > [!NOTE]
   > Dates and times are United States Pacific Standard Time, and are subject to change. 

|Functionality, feature, or service|Change|Change date |
|---|---|---:|
|[System-preferred authentication methods](../authentication/concept-system-preferred-multifactor-authentication.md)|Feature change|Sometime after GA|
|[Azure AD Graph API](https://aka.ms/aadgraphupdate)|Start of phased retirement|Jul 2023|
|[Terms of Use experience](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Feature change|Jul 2023|
|[Azure AD PowerShell and MSOnline PowerShell](https://aka.ms/aadgraphupdate)|Deprecation|Mar 30, 2024|
|[Microsoft Entra MFA Server](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Retirement|Sep 30, 2024|
|[Legacy MFA & SSPR policy](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Retirement|Sep 30, 2025|
|['Require approved client app' Conditional Access Grant](https://aka.ms/RetireApprovedClientApp)|Retirement|Mar 31, 2026|


## Past changes

|Functionality, feature, or service|Change|Change date |
|---|---|---:|
|[Azure AD Authentication Library (ADAL)](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Retirement|Jun 30, 2023|
|[My Apps improvements](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Feature change|Jun 30, 2023|
|[Microsoft Authenticator Lite for Outlook mobile](../../active-directory/authentication/how-to-mfa-authenticator-lite.md)|Feature change|Jun 9, 2023|
|[My Groups experience](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Feature change|May 2023|
|[My Apps browser extension](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-march-2023-train/ba-p/2967448)|Feature change|May 2023|
|Microsoft Authenticator app [Number matching](../authentication/how-to-mfa-number-match.md)|Feature change|May 8, 2023|
|[Microsoft Entra Domain Services virtual network deployments](../../active-directory-domain-services/overview.md)|Retirement|Mar 1, 2023|
|[License management API, PowerShell](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/migrate-your-apps-to-access-the-license-managements-apis-from/ba-p/2464366)|Retirement|*Mar 31, 2023|

\* The legacy license management API and PowerShell cmdlets won't work for **new tenants** created after Nov 1, 2022.


   > [!IMPORTANT]
   > Later versions of functionality, features, and services might not meet current security requirements. Microsoft may be unable to provide security updates for older products. 

See the following two sections for definitions of categories, change state, etc.

## Deprecation, retirement, breaking change, feature change, and rebranding

Use the definitions in this section help clarify the state, availability, and support of features, services, and functionality. 

|Category|Definition|Communication schedule|
|---|---|---|
|Retirement|Signals retirement of a feature, capability, or product in a specified period. Customers can't adopt the service or feature, and engineering investments are reduced. Later, the feature reaches end-of-life and is unavailable to any customer.|Two times per year: March and September|
|Breaking change|A change that might break the customer or partner experience if action isn't taken, or a change made, for continued operation.|Four times per year: March, June, September, and December|
|Feature change|Change to an existing Identity feature that requires no customer action, but is noticeable to them. Typically, these changes are in the user interface/user experperience (UI/UX).|Four times per year: March, June, September, and December|

### Terminology

* **End-of-life** - engineering investments have ended, and the feature is unavailable to any customer

## Next steps
[What's new in Microsoft Entra ID?](../../active-directory/fundamentals/whats-new.md)

## Resources
* [Microsoft Entra ID Change Announcement blog](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-november-2022-train/ba-p/2967452)
* Devices: [End-of-life management and recycling](https://www.microsoft.com/legal/compliance/recycling)
