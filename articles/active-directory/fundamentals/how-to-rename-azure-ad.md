---
title: How to rename Azure Active Directory (Azure AD)
description: Learn about best practices and tips on how customers and organizations can update their documentation or content to use the Microsoft Entra ID product name and icon.
services: active-directory
author: CelesteDG
manager: CelesteDG
ms.service: active-directory
ms.subservice: fundamentals
ms.custom: docutune-disable
ms.topic: how-to
ms.date: 09/15/2023
ms.author: celested
ms.reviewer: nicholepet

# Customer intent: As a content creator, employee of an organization with internal documentation for IT or identity security admins, developer of Azure AD-enabled apps, ISV, or Microsoft partner, I want to learn how to correctly update our documentation or content to use the new name for Azure AD.
---
# How to: Rename Azure AD

Azure Active Directory (Azure AD) is being renamed to Microsoft Entra ID to better communicate the multicloud, multiplatform functionality of the product and unify the naming of the Microsoft Entra product family.

This article provides best practices and support for customers and organizations who wish to update their documentation or content with the new product name and icon.

## Prerequisites

Before changing instances of Azure AD in your documentation or content, familiarize yourself with the guidance in [New name for Azure AD](new-name.md) to:

- Understand the product name and why we made the change
- Download the new product icon
- Get a list of names that aren't changing
- Get answers to the more frequently asked questions and more

## Assess and scope renaming updates for your content

Audit your experiences to find references to Azure AD and its icons.

**Scan your content** to identify references to Azure AD and its synonyms. Compile a detailed list of all instances.

- Search for the following terms: 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', and 'AAD'
- Search for graphics with the Azure AD icon (![Azure AD product icon](./media/new-name/azure-ad-icon-1.png)  ![Alternative Azure AD product icon](./media/new-name/azure-ad-icon-2.png)) to replace with the Microsoft Entra ID icon (![Microsoft Entra ID product icon](./media/new-name/microsoft-entra-id-icon.png))

You can download the Microsoft Entra ID icon here: [Microsoft Entra architecture icons](../architecture/architecture-icons.md)

**Identify exceptions in your list**:

- Don't make breaking changes.
- Review the [What names aren't changing?](new-name.md#what-names-arent-changing) section in the naming guidance and note which Azure AD terminology isn't changing.
- Don’t change instances of 'Active Directory.' Only 'Azure Active Directory' is being renamed, not 'Active Directory,'which is the shortened name of a different product, Windows Server Active Directory.

**Evaluate and prioritize based on future usage**. Consider which content needs to be updated based on whether it's user-facing or has broad visibility within your organization, audience, or customer base. You may decide that some code or content doesn't need to be updated if it has limited exposure to your end-users.

Decide whether existing dated content such as videos or blogs are worth updating for future viewers. It's okay to not rename old content. To help end-users, you may want to add a disclaimer such as "Azure AD is now Microsoft Entra ID."

## Update the naming in your content

Update your organization's content and experiences using the relevant tools.

### How to use "find and replace" for text-based content

1. Almost all editing tools offer "search and replace" or "find and replace" functionality, either natively or using plug-ins. Use your preferred app.
1. Use "find and replace" to find the strings 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', and 'AAD'.
1. Don't replace all instances with Microsoft Entra ID.
1. Review whether each instance refers to the product or a feature of the product.

   - Azure AD as the product name alone should be replaced by Microsoft Entra ID.
   - Azure AD features or functionality become Microsoft Entra features or functionality. For example, Azure AD Conditional Access becomes Microsoft Entra Conditional Access.

### Automate bulk editing using custom code

Use the following criteria to determine what change(s) you need to make to instances of 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD'.

1. If the text string is found in the naming dictionary of previous terms, change it to the new term.
1. If a punctuation mark follows 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD', replace with 'Microsoft Entra ID' because that's the product name.
1. If 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD' is followed by "for, Premium, Plan, P1, or P2", replace with 'Microsoft Entra ID' because it refers to a SKU name or Service Plan.
1. If an article (a, an, the) or possessive (your, your organization’s) precedes ('Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD'), then replace with 'Microsoft Entra' because it's a feature name. For example:
   1. 'an Azure AD tenant' becomes 'a Microsoft Entra tenant'
   1. 'your organization's Azure AD tenant' becomes 'your Microsoft Entra tenant'

1. If 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD' is followed by an adjective or noun not listed above, then replace with 'Microsoft Entra' because it's a feature name. For example,'Azure AD Conditional Access' becomes 'Microsoft Entra Conditional Access,' while 'Azure AD tenant' becomes 'Microsoft Entra tenant.'
1. Otherwise, replace 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', and 'AAD' with 'Microsoft Entra ID'

See the section [Glossary of updated terminology](new-name.md#glossary-of-updated-terminology) to further refine your custom logic.

### Update graphics and icons

1. Replace the Azure AD icon with the Microsoft Entra ID icon.
1. Replace titles or text containing 'Azure Active Directory (Azure AD)', 'Azure Active Directory', 'Azure AD', or 'AAD' with 'Microsoft Entra ID.'

## Communicate the change to your customers

To help your customers with the transition, it's helpful to add a note: "Azure Active Directory is now Microsoft Entra ID" or follow the new name with "formerly Azure Active Directory" for the first year.

## Next steps

- [Stay up-to-date with what's new in Azure AD/Microsoft Entra ID](whats-new.md)
- [Get started using Microsoft Entra ID at the Microsoft Entra admin center](https://entra.microsoft.com/)
- [Learn more about Microsoft Entra with content from Microsoft Learn](/entra)
