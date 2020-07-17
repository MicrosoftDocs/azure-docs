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

## Azure US Government clouds
Within the Azure US Government cloud, B2B collaboration is supported between tenants that are both within Azure US Government cloud and that both support B2B collaboration. Azure US Government tenants that support B2B collaboration can also collaborate with social users using Microsoft or Google accounts. If you invite a user outside of these groups (for example, if the user is in a tenant that isn't part of the Azure US Government cloud or doesn't yet support B2B collaboration), the invitation will fail or the user won't be able to redeem the invitation. For details about other limitations, see [Azure Active Directory Premium P1 and P2 Variations](https://docs.microsoft.com/azure/azure-government/documentation-government-services-securityandidentity#azure-active-directory-premium-p1-and-p2).

### How can I tell if B2B collaboration is available in my Azure US Government tenant?
To find out if your Azure US Government cloud tenant supports B2B collaboration, do the following:

1. In a browser, go to the following URL, substituting your tenant name for *&lt;tenantname&gt;*:

   `https://login.microsoftonline.com/<tenantname>/v2.0/.well-known/openid-configuration`

2. Find `"tenant_region_scope"` in the JSON response:

   - If `"tenant_region_scope":"USGOV”` appears, B2B is supported.
   - If `"tenant_region_scope":"USG"` appears, B2B is not supported.

## Next steps

See the following articles on Azure AD B2B collaboration:

- [What is Azure AD B2B collaboration?](what-is-b2b.md)
- [Delegate B2B collaboration invitations](delegate-invitations.md)
