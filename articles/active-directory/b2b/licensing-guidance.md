---
title: Azure Active Directory B2B collaboration licensing guidance | Microsoft Docs
description: Azure Active Directory B2B collaboration does not require paid Azure AD licenses, but you can also get paid features for B2B guest users

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 10/04/2018

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: mal

---

# Azure Active Directory B2B collaboration licensing guidance

With Azure Active Directory (Azure AD) business-to-business (B2B) collaboration, you can invite External Users (or "guest users") to use your paid Azure AD services. For each paid Azure AD license that you assign to a user, you can invite up to five guest users under the External User Allowance.

A guest user is someone who isn't a member of your organization or any of your organization’s Affiliates. Guest users are defined by their relationship to your organization, not by the credentials they use to sign in. In fact, a guest user can sign in with either an external identity or with credentials owned by your organization.

The following are *not* guest users:
- Your employees, onsite contractors, or onsite agents
- Employees, onsite contractors, or onsite agents of your Affiliates

B2B guest user licensing is automatically calculated and reported based on the 1:5 ratio. Currently, it’s not possible to assign B2B guest user licenses directly to guest users.

There are some situations where a guest user isn't reported using the 1:5 External User Allowance. If a guest user already has a paid Azure AD license in the user’s own organization, the user doesn't consume one of your B2B guest user licenses. Additionally, guest users can use free Azure AD features with no additional licensing requirements. Guest users have access to free Azure AD features even if you don’t have any paid Azure AD licenses. 

## Examples: Calculating guest user licenses
Once you determine how many guest users need to access your paid Azure AD services, make sure you have enough Azure AD paid licenses to cover guest users in the required 1:5 ratio. Here are some examples:

- You want to invite 100 guest users to your Azure AD apps or services, and you want to assign access management and provisioning to all guest users. You also want to require MFA and conditional access for 50 of those guest users. To cover this combination, you'll need 10 Azure AD Basic licenses and 10 Azure AD Premium P1 licenses. If you plan to use Identity Protection features with your guest users, you'll need Azure AD Premium P2 licenses in the same 1:5 ratio to cover the guest users.
- You want to invite 60 guest users who all require MFA, so you must have at least 12 Azure AD Premium P1 licenses. You have 10 employees with Azure AD Premium P1 licenses, which would allow up to 50 guest users under the 1:5 licensing ratio. You’ll need to purchase two additional Premium P1 licenses to cover 10 additional guest users.

## Using the B2B collaboration API to invite users from your Affiliates

By definition, a B2B guest user is an External User you invite to use your paid Azure AD apps and services. An employee, onsite contractor, or onsite agent of your company or one of your Affiliates won't qualify for B2B collaboration, even if B2B features are used. Here are some examples: 
- You want to use external credentials (for example, a social identity) to invite a user who is an employee of your organization. This scenario doesn't comply with the licensing requirements and isn't permitted. External credentials don't make an employee an External User.  
- You want to use B2B APIs to invite a user from one of your organization’s Affiliates. Although this scenario uses B2B APIs to invite the user, it isn't considered B2B collaboration. It doesn't comply with the licensing requirements because a user from your Affiliate isn't an External User. 

In both of these scenarios, the better solution is to use the B2B API to invite the users as members (invitedUserType = Member) and assign them each an Azure AD license. 

## Next steps

See the following resources on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
