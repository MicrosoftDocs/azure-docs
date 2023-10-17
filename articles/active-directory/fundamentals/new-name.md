---
title: New name for Azure Active Directory
description: Learn how we're unifying the Microsoft Entra product family and how we're renaming Azure Active Directory (Azure AD) to Microsoft Entra ID.
services: active-directory
author: CelesteDG
manager: CelesteDG
ms.service: active-directory
ms.subservice: fundamentals
ms.custom: has-azure-ad-ps-ref
ms.topic: overview
ms.date: 09/27/2023
ms.author: celested
ms.reviewer: nicholepet

# Customer intent: As a new or existing customer, I want to learn more about the new name for Azure Active Directory (Azure AD) and understand the impact the name change may have on other products, new or existing license(s), what I need to do, and where I can learn more about Microsoft Entra products.
---

# New name for Azure Active Directory

Microsoft has renamed Azure Active Directory (Azure AD) to Microsoft Entra ID for the following reasons: (1) to communicate the multicloud, multiplatform functionality of the products, (2) to alleviate confusion with Windows Server Active Directory, and (3) to unify the [Microsoft Entra](/entra) product family.  

## No interruptions to usage or service

If you're currently using Azure AD today or are have previously deployed Azure AD in your organizations, you can continue to use the service without interruption. All existing deployments, configurations, and integrations continue to function as they do today without any action from you.

You can continue to use familiar Azure AD capabilities that you can access through the Azure portal, Microsoft 365 admin center, and the [Microsoft Entra admin center](https://entra.microsoft.com).

All features and capabilities are still available in the product. Licensing, terms, service-level agreements, product certifications, support and pricing remain the same.

To make the transition seamless, all existing login URLs, APIs, PowerShell cmdlets, and Microsoft Authentication Libraries (MSAL) stay the same, as do developer experiences and tooling.

Service plan display names changed on October 1, 2023. Microsoft Entra ID Free, Microsoft Entra ID P1, and Microsoft Entra ID P2 are the new names of standalone offers, and all capabilities included in the current Azure AD plans remain the same. Microsoft Entra ID – previously known as Azure AD – continues to be included in Microsoft 365 licensing plans, including Microsoft 365 E3 and Microsoft 365 E5. Details on pricing and what’s included are available on the [pricing and free trials page](https://aka.ms/PricingEntra).

:::image type="content" source="./media/new-name/azure-ad-new-name.png" alt-text="Diagram showing the new name for Azure AD and Azure AD External Identities." border="false" lightbox="./media/new-name/azure-ad-new-name-high-res.png":::

During 2023, you may see both the current Azure AD name and the new Microsoft Entra ID name in support area paths. For self-service support, look for the topic path of `Microsoft Entra` or `Azure Active Directory/Microsoft Entra ID`.

The product name and icons are changing, and features are now branded as Microsoft Entra instead of Azure AD. If you're updating the name to Microsoft Entra ID in your own content or experiences, see [How to: Rename Azure AD](how-to-rename-azure-ad.md).

## Naming changes and exceptions

### Product name

Microsoft Entra ID is the new name for Azure AD. The names Azure Active Directory, Azure AD, and AAD are replaced with Microsoft Entra ID.

- Microsoft Entra is the name for the product family of identity and network access solutions.
- Microsoft Entra ID is one of the products within that family.
- Acronym usage is not encouraged, but if you must replace AAD with an acronym due to space limitations, use ME-ID.

### Logo/icon

Azure AD product icons are replaced with the Microsoft Entra ID product icon.

| **Azure AD product icons** | **Microsoft Entra ID product icon** |
|:--------------------------:|:-----------------------------------:|
| ![Azure AD product icon](./media/new-name/azure-ad-icon-1.png)  ![Alternative Azure AD product icon](./media/new-name/azure-ad-icon-2.png) | ![Microsoft Entra ID product icon](./media/new-name/microsoft-entra-id-icon.png) |

You can download the Microsoft Entra ID icon here: [Microsoft Entra architecture icons](../architecture/architecture-icons.md)

### Feature names

Capabilities or services formerly known as "Azure Active Directory &lt;feature name&gt;" or "Azure AD &lt;feature name&gt;" are branded as Microsoft Entra product family features. This change is done across our portfolio to avoid naming length and complexity, and because many features work across all the products. For example:

- "Azure AD Conditional Access" is now "Microsoft Entra Conditional Access"
- "Azure AD single sign-on" is now "Microsoft Entra single sign-on"

For a detailed list, see the [Glossary of updated terminology](#glossary-of-updated-terminology).

### What names aren't changing?

The following table lists terminology that is not impacted by the Azure AD rename. Names aren't changing for Active Directory, developer tools, Azure AD B2C, nor deprecated or retired functionality, features, or services.

| **Correct terminology** | **Details** |
|-------------------------|-------------|
| Active Directory <br/><br/>&#8226; Windows Server Active Directory <br/>&#8226; Active Directory Federation Services (AD FS) <br/>&#8226; Active Directory Domain Services (AD DS) <br/>&#8226; Active Directory <br/>&#8226; Any Active Directory feature(s) | Windows Server Active Directory, commonly known as Active Directory, and related features and services associated with Active Directory aren't branded with Microsoft Entra. |
| Authentication library <br/><br/>&#8226; Azure AD Authentication Library (ADAL) <br/>&#8226; Microsoft Authentication Library (MSAL) |      Azure Active Directory Authentication Library (ADAL) is deprecated. While existing apps that use ADAL continue to work, Microsoft will no longer release security fixes on ADAL. Migrate applications to the Microsoft Authentication Library (MSAL) to avoid putting your app's security at risk. <br/><br/>[Microsoft Authentication Library (MSAL)](../develop/msal-overview.md) - Provides security tokens from the Microsoft identity platform to authenticate users and access secured web APIs to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API. |
| B2C <br/><br/>&#8226; Azure Active Directory B2C <br/>&#8226; Azure AD B2C | [Azure Active Directory B2C](/azure/active-directory-b2c) isn't being renamed. We're continuing to invest in security, availability, and reliability in Azure AD B2C and our next-generation solution for external identities, [Microsoft Entra External ID](/azure/active-directory/external-identities). |
|  Graph <br/><br/>&#8226; Azure Active Directory Graph <br/>&#8226; Azure AD Graph <br/>&#8226; Microsoft Graph | Azure Active Directory (Azure AD) Graph is deprecated. Going forward, further investment in Azure AD Graph won't be made, and Azure AD Graph APIs have no SLA or maintenance commitment beyond security-related fixes. Investments in new features and functionalities will only be made in Microsoft Graph.<br/><br/>[Microsoft Graph](/graph) - Grants programmatic access to organization, user, and application data stored in Microsoft Entra ID. |
| PowerShell <br/><br/>&#8226; Azure Active Directory PowerShell <br/>&#8226; Azure AD PowerShell <br/>&#8226; Microsoft Graph PowerShell | Azure AD PowerShell for Graph is planned for deprecation on March 30, 2024. For more info on the deprecation plans, see the deprecation update. We encourage you to migrate to Microsoft Graph PowerShell, which is the recommended module for interacting with Azure AD. <br/><br/>[Microsoft Graph PowerShell](/powershell/microsoftgraph/overview) - Acts as an API wrapper for the Microsoft Graph APIs and helps administer every Microsoft Entra ID feature that has an API in Microsoft Graph. |
| Accounts <br/><br/>&#8226; Microsoft account <br/>&#8226; Work or school account | For end user sign-ins and account experiences, follow guidance for work and school accounts in [Sign in with Microsoft branding guidelines](../develop/howto-add-branding-in-apps.md). |
| Microsoft identity platform | The Microsoft identity platform encompasses all our identity and access developer assets. It continues to provide the resources to help you build applications that your users and customers can sign in to using their Microsoft identities or social accounts. |
| <br/>&#8226; Azure AD Sync <br/>&#8226; DirSync | DirSync and Azure AD Sync aren't supported and no longer work. If you're still using DirSync or Azure AD Sync, you must upgrade to Microsoft Entra Connect to resume your sync process. For more info, see [Microsoft Entra Connect](/azure/active-directory/hybrid/connect/how-to-dirsync-upgrade-get-started). |

## Frequently asked questions

### When is the name change happening?

The name change will appear across Microsoft experiences starting August 15, 2023. Display names for SKUs and service plans will change on October 1, 2023. We expect most naming text string changes in Microsoft experiences and partner experiences to be completed by the end of 2023.  

### Why is the name being changed?

As part of our ongoing commitment to simplify secure access experiences for everyone, the renaming of Azure AD to Microsoft Entra ID is designed to make it easier to use and navigate the unified and expanded Microsoft Entra product family.

The Microsoft Entra ID name more accurately represents the multicloud and multiplatform functionality of the product, alleviates confusion with the on-premises identity solution (Active Directory), and creates a path to deliver a simpler way to protect every identity and secure every access point as we expand the Microsoft Entra identity and network access portfolio.

### What is Microsoft Entra?

The Microsoft Entra product family helps you protect all identities and secure network access everywhere. The expanded product family includes:

| Identity and access management | New identity categories | Network access |
|---------|---------|---------|
| [Microsoft Entra ID (previously known as Azure AD)](../index.yml) | [Microsoft Entra Verified ID](../verifiable-credentials/index.yml) | [Microsoft Entra Internet Access](https://aka.ms/GlobalSecureAccessDocs) |
| [Microsoft Entra ID Governance](../governance/index.yml) | [Microsoft Entra Permissions Management](../cloud-infrastructure-entitlement-management/index.yml) | [Microsoft Entra Private Access](https://aka.ms/GlobalSecureAccessDocs) |
| [Microsoft Entra External ID](../external-identities/index.yml) | [Microsoft Entra Workload ID](../workload-identities/index.yml) |  |

### Where can I manage Microsoft Entra ID?

You can manage Microsoft Entra ID and all other Microsoft Entra solutions in the [Microsoft Entra admin center](https://entra.microsoft.com) or the [Azure portal](https://portal.azure.com).

### What are the display names for service plans and SKUs?

Licensing, pricing, and functionality aren't changing. Display names were updated October 1, 2023 as follows.

| **Old display name for service plan** | **New display name for service plan** |
|---------|---------|
| Azure Active Directory Free | Microsoft Entra ID Free |
| Azure Active Directory Premium P1 | Microsoft Entra ID P1 |
| Azure Active Directory Premium P2 | Microsoft Entra ID P2 |
| Azure Active Directory for education | Microsoft Entra ID for education |
| **Old display name for product SKU** | **New display name for product SKU** |
| Azure Active Directory Premium P1 | Microsoft Entra ID P1 |
| Azure Active Directory Premium P1 for students | Microsoft Entra ID P1 for students |
| Azure Active Directory Premium P1 for faculty | Microsoft Entra ID P1 for faculty |
| Azure Active Directory Premium P1 for government | Microsoft Entra ID P1 for government |
| Azure Active Directory Premium P2 | Microsoft Entra ID P2 |
| Azure Active Directory Premium P2 for students | Microsoft Entra ID P2 for students |
| Azure Active Directory Premium P2 for faculty | Microsoft Entra ID P2 for faculty |
| Azure Active Directory Premium P2 for government | Microsoft Entra ID P2 for government |
| Azure Active Directory F2 | Microsoft Entra ID F2 |

### Is Azure AD going away?

No, only the name Azure AD is going away. Capabilities remain the same.

### Does Microsoft still support on-premises identity management?

We continue to support and enhance Windows Server Active Directory for on-premises identity and access management and the connection to Azure and other clouds, as many organizations continue to rely on this solution.

The name for Active Directory remains unchanged. Based on extensive feedback we've received about Microsoft Entra ID as the new name for Azure Active Directory, for many customers the rename helps to better differentiate between the on-premises (Active Directory) and multicloud identity (Microsoft Entra ID) solutions.

### What will happen to the Azure AD capabilities and features like App Gallery or Conditional Access?

All features and capabilities remain unchanged aside from the name. Customers can continue to use all features without any interruption.

The naming of features changes to Microsoft Entra. For example:

- Azure AD tenant -> Microsoft Entra tenant
- Azure AD account -> Microsoft Entra account

For more examples, see the glossary of feature name updates in [How to: Rename Azure AD](how-to-rename-azure-ad.md).

### Are licenses changing? Are there any changes to pricing?

No. Prices, terms and service level agreements (SLAs) remain the same. Pricing details are available at <https://www.microsoft.com/security/business/microsoft-entra-pricing>.

### Will Microsoft Entra ID be available as a free service with an Azure subscription?

Customers using Azure AD Free as part of their Azure, Microsoft 365, Dynamics 365, Teams, or Intune subscription continue to have access to the same capabilities. This is now called Microsoft Entra ID Free. Get the free version at <https://www.microsoft.com/security/business/microsoft-entra-pricing>.

### What's changing for Microsoft 365 or Azure AD for Office 365?

Microsoft Entra ID – previously known as Azure AD – continues to be available within Microsoft 365 enterprise and business premium offers. Office 365 was renamed Microsoft 365 in 2022. Unique capabilities in the Azure AD for Office 365 apps (such as company branding and self-service sign-in activity search) are now be available to all Microsoft customers in Microsoft Entra ID Free.

### What's changing for Microsoft 365 E3?

There are no changes to the identity features and functionality available in Microsoft 365 E3. Microsoft 365 E3 includes Microsoft Entra ID P1, previously known as Azure AD Premium P1.

### What's changing for Microsoft 365 E5?

In addition to the capabilities they already have, Microsoft 365 E5 customers also get access to new identity protection capabilities like token protection, Conditional Access based on GPS-based location and step-up authentication for the most sensitive actions. Microsoft 365 E5 includes Microsoft Entra P2, previously known as Azure AD Premium P2.

### What's changing for identity developer and devops experiences?

Identity developer and devops experiences aren't being renamed. To make the transition seamless, all existing login URLs, APIs, PowerShell cmdlets, and Microsoft Authentication Libraries (MSAL) stay the same, as do developer experiences and tooling.

Many technical components either have low visibility to customers (for example, sign-in URLs), or usually aren't branded, like APIs.

Microsoft identity platform encompasses all our identity and access developer assets. It continues to provide the resources to help you build applications that your users and customers can sign in to using their Microsoft identities or social accounts.

Naming is also not changing for:

- [Microsoft Authentication Library (MSAL)](/azure/active-directory/develop/msal-overview) – Acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API.
- [Microsoft Graph](/graph) – Get programmatic access to organizational, user, and application data stored in Microsoft Entra ID.
- [Microsoft Graph PowerShell](/powershell/microsoftgraph/overview) – Acts as an API wrapper for the Microsoft Graph APIs; helps administer every Microsoft Entra ID feature that has an API in Microsoft Graph.
- [Windows Server Active Directory](/troubleshoot/windows-server/identity/active-directory-overview), commonly known as “Active Directory”, and all related Windows Server identity services, associated with Active Directory.
- [Active Directory Federation Services (AD FS)](/windows-server/identity/active-directory-federation-services) nor [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/active-directory-domain-services) nor the product name “Active Directory” or any corresponding features.
- [Azure Active Directory B2C](/azure/active-directory-b2c) continues to be available as an Azure service. The name Azure AD B2C is not changing nor is our commitment to the service and our customers. The service level agreement for Azure AD B2C remains unchanged and we'll continue investments to ensure security, availability, and reliability in both Azure AD B2C as well as our next generation solution for external identities, Microsoft Entra External ID, which is now in public preview.
- Any deprecated or retired functionality, feature, or service of Azure Active Directory.

### Are PowerShell cmdlets being renamed?

No. Today, we offer two PowerShell modules for administering identity tasks: the Azure AD PowerShell module, which is planned for deprecation in March 2024, and the Microsoft Graph PowerShell module.

In the Azure AD PowerShell for Graph module, `AzureAD` is in the name of almost all the cmdlets. These won't change, and you can continue to use these same cmdlets now that the official product name is Microsoft Entra ID.

Microsoft Graph PowerShell cmdlets aren't branded with Azure AD. We encourage you to plan your migration from Azure AD PowerShell to Microsoft Graph PowerShell, which is the recommended module for interacting with Microsoft Entra ID in the future.

### How and when are customers being notified?

The name changes were publicly announced on July 11, 2023.

Banners, alerts, and message center posts notified users of the name change. The change was also displayed on the tenant overview page in the portals including Azure, Microsoft 365, and Microsoft Entra admin center, and Microsoft Learn.

### What if I use the Azure AD name in my content or app?

We'd like your help spreading the word about the name change and implementing it in your own experiences. If you're a content creator, author of internal documentation for IT or identity security admins, developer of Azure AD–enabled apps, independent software vendor, or Microsoft partner, we hope you use the naming guidance outlined in [How to: Rename Azure AD](how-to-rename-azure-ad.md) to make the name change in your content and product experiences by the end of 2023.

## Glossary of updated terminology

Features of the identity and network access products are attributed to Microsoft Entra—the product family, not the individual product name.

You're not required to use the Microsoft Entra attribution with features. Only use if needed to clarify whether you're talking about a concept versus the feature in a specific product, or when comparing a Microsoft Entra feature with a competing feature.

Only official product names are capitalized, plus Conditional Access and My * apps.

|  **Category**           | **Old terminology** | **Correct name as of July 2023** |
|-------------------------|---------------------|----------------------------------|
| **Microsoft Entra product family** | Microsoft Azure Active Directory<br/> Azure Active Directory<br/> Azure Active Directory (Azure AD)<br/> Azure AD<br/> AAD | Microsoft Entra ID<br/> (Second use: Microsoft Entra ID is preferred, ID is acceptable in product/UI experiences, ME-ID if abbreviation is necessary) |
|       | Azure Active Directory External Identities<br/> Azure AD External Identities | Microsoft Entra External ID<br/> (Second use: External ID) |
|       | Azure Active Directory Identity Governance<br/> Azure AD Identity Governance<br/> Microsoft Entra Identity Governance | Microsoft Entra ID Governance<br/> (Second use: ID Governance) |
|       | *New* | Microsoft Entra Internet Access<br/> (Second use: Internet Access) |
|       | Cloud Knox | Microsoft Entra Permissions Management<br/> (Second use: Permissions Management) |
|       | *New* | Microsoft Entra Private Access<br/> (Second use: Private Access) |
|       | Azure Active Directory Verifiable Credentials<br/> Azure AD Verifiable Credentials | Microsoft Entra Verified ID<br/> (Second use: Verified ID) |
|       | Azure Active Directory Workload Identities<br/> Azure AD Workload Identities | Microsoft Entra Workload ID<br/> (Second use: Workload ID) |
|       | Azure Active Directory Domain Services<br/> Azure AD Domain Services | Microsoft Entra Domain Services<br/> (Second use: Domain Services) |
| **Microsoft Entra ID SKUs** | Azure Active Directory Premium P1 | Microsoft Entra ID P1 |
|                         | Azure Active Directory Premium P1 for faculty | Microsoft Entra ID P1 for faculty |
|                         | Azure Active Directory Premium P1 for students | Microsoft Entra ID P1 for students |
|                         | Azure Active Directory Premium P1 for government | Microsoft Entra ID P1 for government |
|                         | Azure Active Directory Premium P2 | Microsoft Entra ID P2 |
|                         | Azure Active Directory Premium P2 for faculty | Microsoft Entra ID P2 for faculty |
|                         | Azure Active Directory Premium P2 for students | Microsoft Entra ID P2 for students |
|                         | Azure Active Directory Premium P2 for government | Microsoft Entra ID P2 for government |
|                         | Azure Active Directory Premium F2 | Microsoft Entra ID F2 |
| **Microsoft Entra ID service plans** | Azure Active Directory Free | Microsoft Entra ID Free |
|                                  | Azure Active Directory Premium P1 | Microsoft Entra ID P1 |
|                                  | Azure Active Directory Premium P2 | Microsoft Entra ID P2 |
|                                  | Azure Active Directory for education | Microsoft Entra ID for education |
| **Features and functionality** | Azure AD access token authentication<br/> Azure Active Directory access token authentication | Microsoft Entra access token authentication |
|            | Azure AD account<br/> Azure Active Directory account | Microsoft Entra account<br/><br/> This terminology is only used with IT admins and developers. End users authenticate with a work or school account. |
|            | Azure AD activity logs | Microsoft Entra activity logs |
|            | Azure AD admin<br/> Azure Active Directory admin | Microsoft Entra admin |
|            | Azure AD admin center<br/> Azure Active Directory admin center | Replace with Microsoft Entra admin center and update link to entra.microsoft.com |
|            | Azure AD application proxy<br/> Azure Active Directory application proxy | Microsoft Entra application proxy |
|            | Azure AD audit log | Microsoft Entra audit log |
|            | Azure AD authentication<br/> authenticate with an Azure AD identity<br/> authenticate with Azure AD<br/> authentication to Azure AD | Microsoft Entra authentication<br/> authenticate with a Microsoft Entra identity<br/> authenticate with Microsoft Entra<br/> authentication to Microsoft Entra<br/><br/> This terminology is only used with administrators. End users authenticate with a work or school account. |
|            | Azure AD B2B<br/> Azure Active Directory B2B | Microsoft Entra B2B |
|            | Azure AD built-in roles<br/> Azure Active Directory built-in roles | Microsoft Entra built-in roles |
|            | Azure AD Conditional Access<br/> Azure Active Directory Conditional Access | Microsoft Entra Conditional Access<br/> (Second use: Conditional Access) |
|            | Azure AD cloud-only identities<br/> Azure Active Directory cloud-only identities | Microsoft Entra cloud-only identities |
|            | Azure AD Connect<br/> Azure Active Directory Connect | Microsoft Entra Connect |
|            | Azure AD Connect Sync<br/> Azure Active Directory Connect Sync | Microsoft Entra Connect Sync |
|            | Azure AD connector<br/> Azure Active Directory connector | Microsoft Entra connector |
|            | Azure AD domain<br/> Azure Active Directory domain | Microsoft Entra domain |
|            | Azure AD Domain Services<br/> Azure Active Directory Domain Services | Microsoft Entra Domain Services |
|            | Azure AD enterprise application<br/> Azure Active Directory enterprise application | Microsoft Entra enterprise application |
|            | Azure AD federation services<br/> Azure Active Directory federation services | Active Directory Federation Services |
|            | Azure AD groups<br/> Azure Active Directory groups | Microsoft Entra groups |
|            | Azure AD hybrid identities<br/> Azure Active Directory hybrid identities | Microsoft Entra hybrid identities |
|            | Azure AD identities<br/> Azure Active Directory identities | Microsoft Entra identities |
|            | Azure AD identity protection<br/> Azure Active Directory identity protection | Microsoft Entra ID Protection |
|            | Azure AD integrated authentication<br/> Azure Active Directory integrated authentication | Microsoft Entra integrated authentication |
|            | Azure AD join<br/> Azure AD joined<br/> Azure Active Directory join<br/> Azure Active Directory joined | Microsoft Entra join<br/> Microsoft Entra joined  |
|            | Azure AD license<br/> Azure Active Directory license | Microsoft Entra ID license or license for Microsoft Entra ID |
|            | Azure AD login<br/> Azure Active Directory login | Microsoft Entra login |
|            | Azure AD managed identities<br/> Azure Active Directory managed identities | Microsoft Entra managed identities |
|            | Azure AD multifactor authentication (MFA)<br/> Azure Active Directory multifactor authentication (MFA) | Microsoft Entra multifactor authentication (MFA)<br/> (Second use: MFA) |
|            | Azure AD OAuth and OpenID Connect<br/> Azure Active Directory OAuth and OpenID Connect | Microsoft Entra ID OAuth and OpenID Connect |
|            | Azure AD object<br/> Azure Active Directory object | Microsoft Entra object |
|            | Azure Active Directory-only authentication<br/> Azure AD-only authentication | Microsoft Entra-only authentication |
|            | Azure AD pass-through authentication (PTA)<br/> Azure Active Directory pass-through authentication (PTA) | Microsoft Entra pass-through authentication  |
|            | Azure AD password authentication<br/> Azure Active Directory password authentication | Microsoft Entra password authentication |
|            | Azure AD password hash synchronization (PHS)<br/> Azure Active Directory password hash synchronization (PHS) | Microsoft Entra password hash synchronization |
|            | Azure AD password protection<br/> Azure Active Directory password protection | Microsoft Entra password protection |
|            | Azure AD Premium<br/> Azure Active Directory Premium | Microsoft Entra ID P1 or P2 |
|            | Azure AD principal ID<br/> Azure Active Directory principal ID | Microsoft Entra principal ID |
|            | Azure AD Privileged Identity Management (PIM)<br/> Azure Active Directory Privileged Identity Management (PIM) | Microsoft Entra Privileged Identity Management (PIM) |
|            | Azure AD registered<br/> Azure Active Directory registered | Microsoft Entra registered |
|            | Azure AD reporting and monitoring<br/> Azure Active Directory reporting and monitoring | Microsoft Entra reporting and monitoring |
|            | Azure AD role<br/> Azure Active Directory role | Microsoft Entra role |
|            | Azure AD schema<br/> Azure Active Directory schema | Microsoft Entra schema |
|            | Azure AD Seamless single sign-on (SSO)<br/> Azure Active Directory Seamless single sign-on (SSO) | Microsoft Entra seamless single sign-on (SSO)<br/> (Second use: SSO) |
|            | Azure AD self-service password reset (SSPR)<br/> Azure Active Directory self-service password reset (SSPR) | Microsoft Entra self-service password reset (SSPR) |
|            | Azure AD service principal<br/> Azure Active Directory service principal | Microsoft Entra service principal |
|            | Azure AD tenant<br/> Azure Active Directory tenant | Microsoft Entra tenant |
|            | Create a user in Azure AD<br/> Create a user in Azure Active Directory | Create a user in Microsoft Entra |
|            | Federated with Azure AD<br/> Federated with Azure Active Directory | Federated with Microsoft Entra |
|            | Hybrid Azure AD Join<br/> Hybrid Azure AD Joined | Microsoft Entra hybrid join<br/> Microsoft Entra hybrid joined |
|            | Managed identities in Azure AD for Azure SQL | Managed identities in Microsoft Entra for Azure SQL |
| **Acronym usage** | AAD | ME-ID<br/><br/> Note that this isn't an official abbreviation for the product but may be used in code or when absolute shortest form is required. |

## Revision history

| Date | Change description |
|------|--------------------|
| October 12, 2023 | <br/>&#8226;Updated statement about availability of license plans.  <br/>&#8226; Added three other terms in the glossary: "Azure AD connector", "Azure AD license", and "Azure AD Premium" |
| September 15, 2023 | Added a link to the new article, [How to: Rename Azure AD](how-to-rename-azure-ad.md), updated the description for Azure AD B2C, and added more info about why the name Azure AD is changing. |
| August 29, 2023 | <br/>&#8226; In the [glossary](#glossary-of-updated-terminology), corrected the entry for "Azure AD activity logs" to separate "Azure AD audit log", which is a distinct type of activity log. <br/>&#8226; Added Azure AD Sync and DirSync to the [What names aren't changing](#what-names-arent-changing) section. |
| August 18, 2023 | <br/>&#8226; Updated the article to include a new section [Glossary of updated terminology](#glossary-of-updated-terminology), which includes the old and new terminology.<br/>&#8226; Updated info and added link to usage of the Microsoft Entra ID icon, and updates to verbiage in some sections.  |
| July 11, 2023 | Published the original guidance as part of the [Microsoft Entra moment and related announcement](https://www.microsoft.com/security/blog/2023/07/11/microsoft-entra-expands-into-security-service-edge-and-azure-ad-becomes-microsoft-entra-id/?culture=en-us&country=us). |

## Next steps

- [How to: Rename Azure AD](how-to-rename-azure-ad.md)
- [Stay up-to-date with what's new in Microsoft Entra ID (formerly Azure AD)](./whats-new.md)
- [Get started using Microsoft Entra ID at the Microsoft Entra admin center](https://entra.microsoft.com/)
- [Learn more about the Microsoft Entra family with content from Microsoft Learn](/entra)

<!-- docutune:ignore "Azure Active Directory" "Azure AD" "AAD" "Entra ID" "Cloud Knox" "Identity Governance" -->
