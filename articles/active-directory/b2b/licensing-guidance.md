---
title: Azure Active Directory B2B collaboration licensing guidance | Microsoft Docs
description: Azure Active Directory B2B collaboration does not require paid Azure AD licenses, but you can also get paid features for B2B guest users

services: active-directory
ms.service: active-directory
ms.component: B2B
ms.topic: conceptual
ms.date: 08/09/2017

ms.author: mimart
author: msmimart
manager: mtillman
ms.reviewer: sasubram

---

# Azure Active Directory B2B collaboration licensing guidance

You can use Azure AD B2B collaboration capabilities to invite guest users into your Azure AD tenant to allow them to access Azure AD services and other resources in your organization. If you want to provide access to paid Azure AD features, B2B collaboration guest users must be licensed with appropriate Azure AD licenses. 

Specifically:
* Azure AD Free capabilities are available for guest users without additional licensing.
* If you want to provide access to paid Azure AD features to B2B users, you must have enough licenses to support those B2B guest users.
* An inviting tenant with an Azure AD paid license has B2B collaboration use rights to an additional five B2B guest users invited to the tenant.
* The customer who owns the inviting tenant must be the one to determine how many B2B collaboration users need paid Azure AD capabilities. Depending on the paid Azure AD features you want for your guest users, you must have enough Azure AD paid licenses to cover B2B collaboration users in the same 5:1 ratio.

A B2B collaboration guest user is added as a user from a partner company, not an employee of your organization or an employee of a different business in your conglomerate. A B2B guest user can sign in with external credentials or credentials owned by your organization as described in this article. 

In other words, B2B licensing is set not by how the user authenticates but rather by the relationship of the user to your organization. If these users are not partners, they are treated differently in licensing terms. They are not considered to be a B2B collaboration user for licensing purposes even if their UserType is marked as “Guest.” They should be licensed normally, at one license per user. These users include:
* Your employees
* Staff signing in using external identities
* An employee of a different business in your conglomerate


## Licensing examples
- A customer wants to invite 100 B2B collaboration users to its Azure AD tenant. The customer assigns access management and provisioning for all users, but 50 users also require MFA and conditional access. This customer must purchase 10 Azure AD Basic licenses and 10 Azure AD Premium P1 licenses to cover these B2B users correctly. If the customer plans to use Identity Protection features with B2B users, they must have Azure AD Premium P2 licenses to cover the invited users in the same 5:1 ratio.
- A customer has 10 employees who are all currently licensed with Azure AD Premium P1. They now want to invite 60 B2B users who all require multi-factor authentication (MFA). Under the 5:1 licensing rule, the customer must have at least 12 Azure AD Premium P1 licenses to cover all 60 B2B collaboration users. Because they already have 10 Premium P1 licenses for their 10 employees, they have rights to invite 50 B2B users with Premium P1 features like MFA. In this example, then, they must purchase 2 additional Premium P1 licenses to cover the remaining 10 B2B collaboration users.

> [!NOTE]
> There is no way yet to assign licenses directly to the B2B users to enable these B2B collaboration user rights.

The customer who owns the inviting tenant must be the one to determine how many B2B collaboration users need paid Azure AD capabilities. Depending on which paid Azure AD features you want for your guest users, you must have enough Azure AD paid licenses to cover B2B collaboration users in the 5:1 ratio. 

## Additional licensing details
- There is no need to actually assign licenses to B2B user accounts. Based on the 5:1 ratio, licensing is automatically calculated and reported.
- If no paid Azure AD license exists in the tenant, every invited user gets the rights that the Azure AD Free edition offers.
- If a B2B collaboration user already has a paid Azure AD license from their organization, they do not consume one of the B2B collaboration licenses of the inviting tenant.

## Advanced discussion: What are the licensing considerations when we add users from a conglomerate organization as “members” using your APIs?
A B2B guest user is one that is invited from a partner organization to work with the host organization. Typically, any other case does not qualify as B2B even it uses B2B features. Let’s look at two cases in particular:

1. If a host invites an employee using a consumer address
  * This scenario is not compliant with our licensing policies and is not recommended.

2. If a host organization adds a user from another conglomerate organization
  1. In this case, the user is invited using B2B APIs, but this case is not traditionally B2B. Ideally, we should have these organizations invite the other orgs users as members (our API allows that). In this case, licenses have to be assigned to these members for them to access resources in the inviting organization.

  2. Some organizations may want to add the other org’s users to be added as “Guest” as a policy. There are two cases here:
      * The conglomerate organization is already using Azure AD and the invited users are licensed in the other organization: in this case, we don’t expect invited users to need to follow the 1:5 formula laid out earlier in this document. 

      * The conglomerate organization is not using Azure AD or doesn’t have adequate licenses: In this case, follow the 1:5 formula laid out earlier in this document.

## Next steps

See the following articles on Azure AD B2B collaboration:

* [What is Azure AD B2B collaboration?](what-is-b2b.md)
* [Azure Active Directory B2B collaboration frequently asked questions (FAQ)](faq.md)
