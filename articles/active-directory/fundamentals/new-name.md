---
title: New name for Azure Active Directory
description: Learn how we're unifying the Microsoft Entra product family and how we're renaming Azure Active Directory (Azure AD) to Microsoft Entra ID.
services: active-directory
author: CelesteDG
manager: CelesteDG
ms.service: active-directory
ms.subservice: fundamentals
ms.topic: overview
ms.date: 07/11/2023
ms.author: celested
ms.reviewer: nicholepet

# Customer intent: As a new or existing customer, I want to learn more about the new name for Azure Active Directory (Azure AD) and understand the impact the name change may have on other products, new or existing license(s), what I need to do, and where I can learn more about Microsoft Entra products.
---

# New name for Azure Active Directory

To unify the [Microsoft Entra](/entra) product family, reflect the progression to modern multicloud identity security, and simplify secure access experiences for all, we're renaming Azure Active Directory (Azure AD) to Microsoft Entra ID.  

## No action is required from you

If you're using Azure AD today or are currently deploying Azure AD in your organizations, you can continue to use the service without interruption. All existing deployments, configurations, and integrations will continue to function as they do today without any action from you.

You can continue to use familiar Azure AD capabilities that you can access through the Azure portal, Microsoft 365 admin center, and the [Microsoft Entra admin center](https://entra.microsoft.com).

## Only the name is changing

All features and capabilities are still available in the product. Licensing, terms, service-level agreements, product certifications, support and pricing remain the same.

Service plan display names will change on October 1, 2023. Microsoft Entra ID Free, Microsoft Entra ID P1, and Microsoft Entra ID P2 will be the new names of standalone offers, and all capabilities included in the current Azure AD plans remain the same. Microsoft Entra ID – currently known as Azure AD – will continue to be included in Microsoft 365 licensing plans, including Microsoft 365 E3 and Microsoft 365 E5. Details on pricing and what’s included are available on the [pricing and free trials page](https://aka.ms/PricingEntra).

:::image type="content" source="./media/new-name/azure-ad-new-name.png" alt-text="Diagram showing the new name for Azure AD and Azure AD External Identities." border="false" lightbox="./media/new-name/azure-ad-new-name-high-res.png":::

During 2023, you may see both the current Azure AD name and the new Microsoft Entra ID name in support area paths. For self-service support, look for the topic path of "Microsoft Entra" or "Azure Active Directory/Microsoft Entra ID."

## Identity developer and devops experiences aren't impacted by the rename

To make the transition seamless, all existing login URLs, APIs, PowerShell cmdlets, and Microsoft Authentication Libraries (MSAL) stay the same, as do developer experiences and tooling.

Microsoft identity platform encompasses all our identity and access developer assets. It will continue to provide the resources to help you build applications that your users and customers can sign in to using their Microsoft identities or social accounts.

Naming is also not changing for:

- [Microsoft Authentication Library (MSAL)](../develop/msal-overview.md) - Use to acquire security tokens from the Microsoft identity platform to authenticate users and access secured web APIs to provide secure access to Microsoft Graph, other Microsoft APIs, third-party web APIs, or your own web API.
- [Microsoft Graph](/graph) - Get programmatic access to organizations, user, and application data stored in Microsoft Entra ID.
- [Microsoft Graph PowerShell](/powershell/microsoftgraph/overview) - Acts as an API wrapper for the Microsoft Graph APIs and helps administer every Microsoft Entra ID feature that has an API in Microsoft Graph.
- [Windows Server Active Directory](/troubleshoot/windows-server/identity/active-directory-overview), commonly known as "Active Directory," and all related Windows Server identity services associated with Active Directory.
- [Active Directory Federation Services (AD FS)](/windows-server/identity/active-directory-federation-services) nor [Active Directory Domain Services (AD DS)](/windows-server/identity/ad-ds/active-directory-domain-services) nor the product name "Active Directory" or any corresponding features.
- [Azure Active Directory B2C](../../active-directory-b2c/index.yml) will continue to be available as an Azure service.
- [Any deprecated or retired functionality, feature, or service](what-is-deprecated.md) of Azure AD.

## Frequently asked questions

### When is the name change happening?

The name change will start appearing across Microsoft experiences after a 30-day notification period, which started July 11, 2023. Display names for SKUs and service plans will change on October 1, 2023. We expect most naming text string changes in Microsoft experiences to be completed by the end of 2023.  

### Why is the name being changed?

As part of our ongoing commitment to simplify secure access experiences for everyone, the renaming of Azure AD to Microsoft Entra ID is designed to make it easier to use and navigate the unified and expanded Microsoft Entra product family.

### What is Microsoft Entra?

Microsoft Entra helps you protect all identities and secure network access everywhere. The expanded product family includes:

| Identity and access management | New identity categories | Network access |
|---------|---------|---------|
| [Microsoft Entra ID (currently known as Azure AD)](../index.yml) | [Microsoft Entra Verified ID](../verifiable-credentials/index.yml) | [Microsoft Entra Internet Access](https://aka.ms/GlobalSecureAccessDocs) |
| [Microsoft Entra ID Governance](../governance/index.yml) | [Microsoft Entra Permissions Management](../cloud-infrastructure-entitlement-management/index.yml) | [Microsoft Entra Private Access](https://aka.ms/GlobalSecureAccessDocs) |
| [Microsoft Entra External ID](../external-identities/index.yml) | [Microsoft Entra Workload ID](../workload-identities/index.yml) |  |

### Where can I manage Microsoft Entra ID?

You can manage Microsoft Entra ID and all other Microsoft Entra solutions in the [Microsoft Entra admin center](https://entra.microsoft.com) or the [Azure portal](https://portal.azure.com).

### What are the display names for service plans and SKUs?

Licensing, pricing, and functionality aren't changing. Display names will be updated October 1, 2023 as follows.

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

### What will happen to the Azure AD capabilities and features like App Gallery or Conditional Access?

The naming of features changes to Microsoft Entra. For example:

- Azure AD tenant -> Microsoft Entra tenant
- Azure AD account -> Microsoft Entra account
- Azure AD joined -> Microsoft Entra joined
- Azure AD Conditional Access -> Microsoft Entra Conditional Access

All features and capabilities remain unchanged aside from the name. Customers can continue to use all features without any interruption.

### Are licenses changing? Are there any changes to pricing?

No. Prices, terms and service level agreements (SLAs) remain the same. Pricing details are available at <https://www.microsoft.com/security/business/microsoft-entra-pricing>.

### Will Microsoft Entra ID be available as a free service with an Azure subscription?

Customers currently using Azure AD Free as part of their Azure, Microsoft 365, Dynamics 365, Teams, or Intune subscription will continue to have access to the same capabilities. It will be called Microsoft Entra ID Free. Get the free version at <https://www.microsoft.com/security/business/microsoft-entra-pricing>.

### What's changing for Microsoft 365 or Azure AD for Office 365?

Microsoft Entra ID – currently known as Azure AD – will continue to be available within Microsoft 365 enterprise and business premium offers. Office 365 was renamed Microsoft 365 in 2022. Unique capabilities in the Azure AD for Office 365 apps (such as company branding and self-service sign-in activity search) will now be available to all Microsoft customers in Microsoft Entra ID Free.

### What's changing for Microsoft 365 E3?

There are no changes to the identity features and functionality available in Microsoft 365 E3. Microsoft 365 E3 includes Microsoft Entra ID P1, currently known as Azure AD Premium P1.

### What's changing for Microsoft 365 E5?

In addition to the capabilities they already have, Microsoft 365 E5 customers will also get access to new identity protection capabilities like token protection, Conditional Access based on GPS-based location and step-up authentication for the most sensitive actions. Microsoft 365 E5 includes Microsoft Entra P2, currently known as Azure AD Premium P2.

### How and when are customers being notified?

The name changes are publicly announced as of July 11, 2023.

Banners, alerts, and message center posts will notify users of the name change. These will be displayed on the tenant overview page, portals including Azure, Microsoft 365, and Microsoft Entra admin center, and Microsoft Learn.

### What if I use the Azure AD name in my content or app?

We'd like your help spreading the word about the name change and implementing it in your own experiences. If you're a content creator, author of internal documentation for IT or identity security admins, developer of Azure AD–enabled apps, independent software vendor, or Microsoft partner, we hope you use the naming guidance outlined in the following section ([Azure AD name changes and exceptions](#azure-ad-name-changes-and-exceptions)) to make the name change in your content and product experiences by the end of 2023.

## Azure AD name changes and exceptions

We encourage content creators, organizations with internal documentation for IT or identity security admins, developers of Azure AD-enabled apps, independent software vendors, or partners of Microsoft to stay current with the new naming guidance by updating copy by the end of 2023. We recommend changing the name in customer-facing experiences, prioritizing highly visible surfaces.

### Product name

Replace the product name "Azure Active Directory" or "Azure AD" or "AAD" with Microsoft Entra ID.

*Microsoft Entra* is the correct name for the family of identity and network access solutions, one of which is *Microsoft Entra ID.*

### Logo/icon

Azure AD is becoming Microsoft Entra ID, and the product icon is also being updated. Work with your Microsoft partner organization to obtain the new product icon.

### Feature names

Capabilities or services formerly known as "Azure Active Directory &lt;feature name&gt;" or "Azure AD &lt;feature name&gt;" will be branded as Microsoft Entra product family features. For example:

- "Azure AD Conditional Access" is becoming "Microsoft Entra Conditional Access"
- "Azure AD single sign-on" is becoming "Microsoft Entra single sign-on"
- "Azure AD tenant" is becoming "Microsoft Entra tenant"

### Exceptions to Azure AD name change

Products or features that are being deprecated aren't being renamed. These products or features include:

- Azure AD Authentication Library (ADAL), replaced by [Microsoft Authentication Library (MSAL)](../develop/msal-overview.md)
- Azure AD Graph, replaced by [Microsoft Graph](/graph)
- Azure Active Directory PowerShell for Graph (Azure AD PowerShell), replaced by [Microsoft Graph PowerShell](/powershell/microsoftgraph)

Names that don't have "Azure AD" also aren't changing. These products or features include Active Directory Federation Services (AD FS), Microsoft identity platform, and Windows Server Active Directory Domain Services (AD DS).

End users shouldn't be exposed to the Azure AD or Microsoft Entra ID name. For sign-ins and account user experiences, follow guidance for work and school accounts in [Sign in with Microsoft branding guidelines](../develop/howto-add-branding-in-apps.md).

## Next steps

- [Stay up-to-date with what's new in Azure AD/Microsoft Entra ID](whats-new.md)
- [Get started using Microsoft Entra ID at the Microsoft Entra admin center](https://entra.microsoft.com/)
- [Learn more about Microsoft Entra with content from Microsoft Learn](/entra)
