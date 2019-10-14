---
title: Limitations of B2B collaboration - Azure Active Directory | Microsoft Docs
description: Current limitations for Azure Active Directory B2B collaboration

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 05/29/2019

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: M365-identity-device-management
---

# Limitations of Azure AD B2B collaboration
Azure Active Directory (Azure AD) B2B collaboration is currently subject to the limitations described in this article.

## Possible double multi-factor authentication
With Azure AD B2B, you can enforce multi-factor authentication at the resource organization (the inviting organization). The reasons for this approach are detailed in [Conditional Access for B2B collaboration users](conditional-access.md). If a partner already has multi-factor authentication set up and enforced, their users might have to perform the authentication once in their home organization and then again in yours.

## Instant-on
In the B2B collaboration flows, we add users to the directory and dynamically update them during invitation redemption, app assignment, and so on. The updates and writes ordinarily happen in one directory instance and must be replicated across all instances. Replication is completed once all instances are updated. Sometimes when the object is written or updated in one instance and the call to retrieve this object is to another instance, replication latencies can occur. If that happens, refresh or retry to help. If you are writing an app using our API, then retries with some back-off is a good, defensive practice to alleviate this issue.

## Azure AD directories
Azure AD B2B is subject to Azure AD service directory limits. For details about the number of directories a user can create and the number of directories to which a user or guest user can belong, see [Azure AD service limits and restrictions](https://docs.microsoft.com/azure/active-directory/users-groups-roles/directory-service-limits-restrictions).

## National clouds
[National clouds](https://docs.microsoft.com/azure/active-directory/develop/authentication-national-cloud) are physically isolated instances of Azure. B2B collaboration is not supported across national cloud boundaries. For example, if your Azure tenant is in the public, global cloud, you can't invite a user whose account is in a national cloud. To collaborate with the user, ask them for another email address or create a member user account for them in your directory.

## Next steps

See the following articles on Azure AD B2B collaboration:

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [Delegate B2B collaboration invitations](delegate-invitations.md)

