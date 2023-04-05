---
title: Limitations of B2B collaboration
description: Current limitations for Azure Active Directory B2B collaboration

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 02/13/2023

ms.author: mimart
author: msmimart
manager: celestedg
ms.reviewer: elisolMS

ms.collection: content-health, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to know about the current limitations for Azure AD B2B collaboration. 
---

# Limitations of Azure AD B2B collaboration
Azure Active Directory (Azure AD) B2B collaboration is currently subject to the limitations described in this article.

## Possible double multi-factor authentication
With Azure AD B2B, you can enforce multi-factor authentication at the resource organization (the inviting organization). The reasons for this approach are detailed in [Conditional Access for B2B collaboration users](authentication-conditional-access.md). If a partner already has multi-factor authentication set up and enforced, their users might have to perform the authentication once in their home organization and then again in yours.

## Instant-on
In the B2B collaboration flows, we add users to the directory and dynamically update them during invitation redemption, app assignment, and so on. The updates and writes ordinarily happen in one directory instance and must be replicated across all instances. Replication is completed once all instances are updated. Sometimes when the object is written or updated in one instance and the call to retrieve this object is to another instance, replication latencies can occur. If that happens, refresh or retry to help. If you're writing an app using our API, then retries with some back-off is a good, defensive practice to alleviate this issue.

## Azure AD directories
Azure AD B2B is subject to Azure AD service directory limits. For details about the number of directories a user can create and the number of directories to which a user or guest user can belong, see [Azure AD service limits and restrictions](../enterprise-users/directory-service-limits-restrictions.md).

## Next steps

See the following articles on Azure AD B2B collaboration:

- [Azure AD B2B in government and national clouds](b2b-government-national-clouds.md)
- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [Delegate B2B collaboration invitations](external-collaboration-settings-configure.md)
