---
title: B2B collaboration licensing guidance - Azure Active Directory | Microsoft Docs
description: Azure Active Directory B2B collaboration does not require paid Azure AD licenses, but you can also get paid features for B2B guest users

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 10/04/2018

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: mal

ms.collection: M365-identity-device-management
---

# Azure Active Directory B2B collaboration licensing guidance

With Azure Active Directory (Azure AD) business-to-business (B2B) collaboration, you can invite External Users (or "guest users") to use your paid Azure AD services. For each paid Azure AD license that you assign to a user, you can invite up to five guest users under the External User Allowance.

B2B guest user licensing is automatically calculated and reported based on the 1:5 ratio. Currently, it’s not possible to assign B2B guest user licenses directly to guest users.

Additionally, guest users can use free Azure AD features with no additional licensing requirements. Guest users have access to free Azure AD features even if you don’t have any paid Azure AD licenses. 

## Examples: Calculating guest user licenses
Once you determine how many guest users need to access your paid Azure AD services, make sure you have enough Azure AD paid licenses to cover guest users in the required 1:5 ratio. Here are some examples:

- You want to invite 100 guest users to your Azure AD apps or services, and you want to assign access management and provisioning to all guest users. You also want to require MFA and Conditional Access for 50 of those guest users. To cover this combination, you'll need 10 Azure AD Basic licenses and 10 Azure AD Premium P1 licenses. If you plan to use Identity Protection features with your guest users, you'll need Azure AD Premium P2 licenses in the same 1:5 ratio to cover the guest users.
- You want to invite 60 guest users who all require MFA, so you must have at least 12 Azure AD Premium P1 licenses. You have 10 employees with Azure AD Premium P1 licenses, which would allow up to 50 guest users under the 1:5 licensing ratio. You’ll need to purchase two additional Premium P1 licenses to cover 10 additional guest users.

## Next steps

See the following resources on Azure AD B2B collaboration:

* [Azure Active Directory pricing](https://azure.microsoft.com/pricing/details/active-directory/)
* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
