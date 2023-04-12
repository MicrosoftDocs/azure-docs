---
title: What's deprecated in Azure Active Directory?
description: Learn about features being deprecated in Azure Active Directory
author: janicericketts
manager: martinco
ms.service: active-directory
ms.subservice: fundamentals
ms.workload: identity
ms.topic: conceptual
ms.date: 01/27/2023
ms.author: jricketts
ms.reviewer: ramical
ms.custom: it-pro

---

# What's deprecated in Azure Active Directory?

The lifecycle of functionality, features, and services are governed by policy, support timelines, data, also leadership and engineering team decisions. Lifecycle information allows customers to predictably plan long-term deployment aspects, transition from outdated to new technology, and help improve business outcomes. Use the definitions below to understand the following table with change information about Azure Active Directory (Azure AD) features, services, and functionality. 

Get notified about when to revisit this page for updates by copying and pasting this URL: `https://learn.microsoft.com/api/search/rss?search=%22What's+deprecated+in+Azure+Active+Directory%22&locale=en-us` into your ![RSS feed reader icon](./media/whats-new/feed-icon-16x16.png) feed reader.

## Upcoming changes

Use the following table to learn about changes including deprecations, retirements, breaking changes and rebranding. Also find key dates and recommendations.

   > [!NOTE]
   > Dates and times are United States Pacific Standard Time, and are subject to change. 

|Functionality, feature, or service|Change|Change date |
|---|---|---:|
|Microsoft Authenticator app [Number matching](../authentication/how-to-mfa-number-match.md)|Feature change|May 8, 2023|
|Azure AD DS [virtual network deployments](../../active-directory-domain-services/migrate-from-classic-vnet.md)|Retirement|Mar 1, 2023|
|[License management API, PowerShell](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/migrate-your-apps-to-access-the-license-managements-apis-from/ba-p/2464366)|Retirement|*Mar 31, 2023|
|[Azure AD Authentication Library (ADAL)](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454)|Retirement|Jun 30, 2023|
|[Azure AD Graph API](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454)|Deprecation|Jun 30, 2023|
|[Azure AD PowerShell and MSOnline PowerShell](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454)|Deprecation|Jun 30, 2023|
|[Azure AD MFA Server](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-september-2022-train/ba-p/2967454)|Retirement|Sep 30, 2024|

\* The legacy license management API and PowerShell cmdlets will not work for **new tenants** created after Nov 1, 2022.


   > [!IMPORTANT]
   > Later versions of functionality, features, and services might not meet current security requirements. Microsoft may be unable to provide security updates for older products. 

See the following two sections for definitions of categories, change state, etc.

## Deprecation, retirement, breaking change, feature change, and rebranding

Use the definitions in this section help clarify the state, availability, and support of features, services, and functionality. 

|Category|Definition|Communication schedule|
|---|---|---|
|Deprecation|The state of a feature, functionality, or service no longer in active development. A deprecated feature might be retired and removed from future releases.|2 times per year: March and September|
|Retirement|Signals retirement in a specified period. Customers can’t adopt the service or feature, and engineering investments are reduced. Later, the feature reaches end-of-life and is unavailable to any customer.|2 times per year: March and September|
|Breaking change|A change that might break the customer or partner experience if action isn’t taken, or a change made, for continued operation.|4 times per year: March, June, September, and December|
|Feature change|Change to an IDNA feature that requires no customer action, but is noticeable to them. Typically, these changes are in the user interface/user experperience (UI/UX).|4 times per year: March, June, September, and December|
|Rebranding|A new name, term, symbol, design, concept or combination thereof for an established brand to develop a differentiated experience.|As scheduled or announced|

### Terminology

* **End-of-life** - engineering investments have ended, and the feature is unavailable to any customer

## Next steps
[What's new in Azure Active Directory?](../../active-directory/fundamentals/whats-new.md)

## Resources
* [Microsoft Entra Change Announcement blog](https://techcommunity.microsoft.com/t5/microsoft-entra-azure-ad-blog/microsoft-entra-change-announcements-november-2022-train/ba-p/2967452)
* Devices: [End-of-life management and recycling](https://www.microsoft.com/legal/compliance/recycling)
