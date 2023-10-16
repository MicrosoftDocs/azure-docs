---
title: B2B collaboration for hybrid organizations
description: Give partners access to both on-premises and cloud resources with Microsoft Entra B2B collaboration.

services: active-directory
ms.service: active-directory
ms.subservice: B2B
ms.topic: conceptual
ms.date: 11/23/2022
ms.author: cmulligan
author: csmulligan
manager: celestedg
ms.collection: engagement-fy23, M365-identity-device-management

# Customer intent: As a tenant administrator, I want to give partners access to both on-premises and cloud resources with Microsoft Entra B2B collaboration. 
---

# Microsoft Entra B2B collaboration for hybrid organizations

Microsoft Entra B2B collaboration makes it easy for you to give your external partners access to apps and resources in your organization. This is true even in a hybrid configuration where you have both on-premises and cloud-based resources. It doesn’t matter if you currently manage external partner accounts locally in your on-premises identity system, or if you manage the external accounts in the cloud as Microsoft Entra B2B users. You can now grant these users access to resources in either location, using the same sign-in credentials for both environments.

<a name='grant-b2b-users-in-azure-ad-access-to-your-on-premises-apps'></a>

## Grant B2B users in Microsoft Entra ID access to your on-premises apps

If your organization uses [Microsoft Entra B2B](what-is-b2b.md) collaboration capabilities to invite guest users from partner organizations to your Microsoft Entra ID, you can now provide these B2B users access to on-premises apps.

For apps that use SAML-based authentication, you can make these apps available to B2B users through the Azure portal, using Microsoft Entra application proxy for authentication.

For apps that use integrated Windows authentication (IWA) with Kerberos constrained delegation (KCD), you also use Microsoft Entra ID Proxy for authentication. However, for authorization to work, a user object is required in the on-premises Windows Server Active Directory. There are two methods you can use to create local user objects that represent your B2B guest users.

- You can use Microsoft Identity Manager (MIM) 2016 SP1 and the MIM management agent for Microsoft Graph.
- You can use a PowerShell script. (This solution doesn't require MIM.)

For details about how to implement these solutions, see [Grant Microsoft Entra B2B users access to your on-premises applications](hybrid-cloud-to-on-premises.md).

## Grant locally managed partner accounts access to cloud resources

Before Microsoft Entra ID, organizations with on-premises identity systems have traditionally managed partner accounts in their on-premises directory. If you’re such an organization, you want to make sure that your partners continue to have access as you move your apps and other resources to the cloud. Ideally, you want these users to use the same set of credentials to access both cloud and on-premises resources. 

We now offer methods where you can use Microsoft Entra Connect to sync these local accounts to the cloud as "guest users," where the accounts behave just like Microsoft Entra B2B users.

To help protect your company data, you can control access to just the right resources, and configure authorization policies that treat these guest users differently from your employees.

For implementation details, see [Grant locally managed partner accounts access to cloud resources using Microsoft Entra B2B collaboration](hybrid-on-premises-to-cloud.md).
 
## Next steps

- [Grant Microsoft Entra B2B users access to your on-premises applications](hybrid-cloud-to-on-premises.md)
- [B2B direct connect](b2b-direct-connect-overview.md)
- [Grant locally managed partner accounts access to cloud resources using Microsoft Entra B2B collaboration](hybrid-on-premises-to-cloud.md)
