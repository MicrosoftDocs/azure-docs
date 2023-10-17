---
title: Microsoft Entra B2B in government and national clouds
description: Learn what features are available in Microsoft Entra B2B collaboration in US Government and national clouds 

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 02/14/2023

ms.author: mimart
author: msmimart
manager: celestedg

ms.collection: M365-identity-device-management
---

# Microsoft Entra B2B in government and national clouds

Microsoft Azure [national clouds](../develop/authentication-national-cloud.md) are physically isolated instances of Azure. B2B collaboration isn't enabled by default across national cloud boundaries, but you can use Microsoft cloud settings to establish mutual B2B collaboration between the following Microsoft Azure clouds:

- Microsoft Azure global cloud and Microsoft Azure Government
- Microsoft Azure global cloud and Microsoft Azure operated by 21Vianet

## B2B collaboration across Microsoft clouds

To set up B2B collaboration between tenants in different clouds, both tenants need to configure their Microsoft cloud settings to enable collaboration with the other cloud. Then each tenant must configure inbound and outbound cross-tenant access with the tenant in the other cloud. For details, see [Microsoft cloud settings](cross-cloud-settings.md).

## B2B collaboration within the Microsoft Azure Government cloud

Within the Azure US Government cloud, B2B collaboration is enabled between tenants that are both within Azure US Government cloud and that both support B2B collaboration. Azure US Government tenants that support B2B collaboration can also collaborate with social users using Microsoft, Google accounts, or email one-time passcode accounts. If you invite a user outside of these groups (for example, if the user is in a tenant that isn't part of the Azure US Government cloud or doesn't yet support B2B collaboration), the invitation will fail or the user won't be able to redeem the invitation. For Microsoft accounts (MSAs), there are known limitations with accessing the Microsoft Entra admin center: newly invited MSA guests are unable to redeem direct link invitations to the Microsoft Entra admin center, and existing MSA guests are unable to sign in to the Microsoft Entra admin center. For details about other limitations, see [Microsoft Entra ID P1 and P2 Variations](/azure/azure-government/compare-azure-government-global-azure#azure-active-directory-premium-p1-and-p2).

### How can I tell if B2B collaboration is available in my Azure US Government tenant?
To find out if your Azure US Government cloud tenant supports B2B collaboration, do the following:

1. In a browser, go to the following URL, substituting your tenant name for *&lt;tenantname&gt;*:

   `https://login.microsoftonline.com/<tenantname>/v2.0/.well-known/openid-configuration`

2. Find `"tenant_region_scope"` in the JSON response:

   - If `"tenant_region_scope":"USGOV”` appears, B2B is supported.
   - If `"tenant_region_scope":"USG"` appears, B2B is not supported.

## Next steps

See the following articles on Microsoft Entra B2B collaboration:

- [What is Microsoft Entra B2B collaboration?](what-is-b2b.md)
- [Delegate B2B collaboration invitations](external-collaboration-settings-configure.md)
