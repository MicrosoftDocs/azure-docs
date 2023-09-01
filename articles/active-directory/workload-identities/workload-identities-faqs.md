---
title: Microsoft Entra Workload Identities license plans FAQ

description: Learn about Microsoft Entra Workload Identities license plans, features and capabilities. 
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: workload-identities
ms.workload: identity
ms.topic: conceptual
ms.date: 2/21/2023
ms.author: gasinh
ms.reviewer: 
ms.custom: aaddev 
#Customer intent: I want to know about Microsoft Entra Workload Identities licensing plans 
---

# Frequently asked questions about Microsoft Entra Workload Identities license plans

[Microsoft Entra Workload Identities](workload-identities-overview.md) is now available in two editions: **Free** and **Workload Identities Premium**. The free edition of workload identities is included with a subscription of a commercial online service such as [Azure](https://azure.microsoft.com/) and [Power Platform](https://powerplatform.microsoft.com/). The Workload
Identities Premium offering is available through a Microsoft representative, the [Open Volume License
Program](https://www.microsoft.com/licensing/how-to-buy/how-to-buy), and the [Cloud Solution Providers program](../../lighthouse/concepts/cloud-solution-provider.md). Azure and Microsoft 365 subscribers can also purchase Workload
Identities Premium online.

For more information, see [what are workload identities?](workload-identities-overview.md)

>[!NOTE]
>Workload Identities Premium is a standalone product and isn't included in other premium product plans. All subscribers require a license to use Workload Identities Premium features.

Learn more about [Workload Identities
pricing](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz).

## What features are included in Workload Identities Premium plan and which features are free? 

|Capabilities | Description | Free | Premium |                 
|:--------|:----------|:------------|:-----------|
| **Authentication and authorization**|  | | |
| Create, read, update, delete workload identities  | Create and update identities for securing service to service access  | Yes |  Yes |
| Authenticate workload identities and tokens to access resources |  Use Azure Active Directory (Azure AD) to protect resource access |  Yes|  Yes |
| Workload identities sign-in activity and audit trail |   Monitor and track workload identity behavior  |  Yes |  Yes |
| **Managed identities**| Use Azure AD identities in Azure without handling credentials |  Yes| Yes |
| Workload identity federation | Use workloads tested by external Identity Providers (IdPs) to access Azure AD protected resources | Yes | Yes |
|  **Conditional Access**     |   |   |    
| Conditional Access policies for workload identities |Define the condition in which a workload can access a resource, such as an IP range | |  Yes | 
|**Lifecycle Management**|    |    |   |
|Access reviews for service provider-assigned privileged roles  |   Closely monitor workload identities with impactful permissions |    |  Yes |
|**Identity Protection**  |  | |
|Identity Protection for workload identities  | Detect and remediate compromised workload identities | | Yes |                                                                            

## What is the cost of Workload Identities Premium plan? 

Check the pricing for the [Microsoft Entra Workload Identities
Premium](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz)
plan.

## How do I purchase a Workload Identities Premium plan?

You need an Azure or Microsoft 365 subscription. You can use a
current subscription or set up a new one. Then, sign into the [Microsoft
Entra admin
center](https://entra.microsoft.com/)
with your credentials to buy Workload Identities licenses.

## Through what channels can I purchase Workload Identities Premium plan? 

You can purchase the plan through Enterprise Agreement (EA)/Enterprise Subscription (EAS), Cloud Solution Providers (CSPs), or Web Direct.

## Where can I find more feature details to determine if I need a license(s)?

Entra workload identities has three premium features that require a license. 

- [Conditional Access](../conditional-access/workload-identity.md):
Supports location or risk-based policies for workload identities.

- [Identity Protection](../identity-protection/concept-workload-identity-risk.md):
Provides reports of compromised credentials, anomalous sign-ins, and
suspicious changes to accounts.

- [Access Reviews](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/introducing-azure-ad-access-reviews-for-service-principals/ba-p/1942488):
Enables delegation of reviews to the right people, focused on the most
important privileged roles.

## What do the numbers in each category on the [Workload identities - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade) mean?

Category definitions:

- **Enterprise apps/Service Principals**: This category includes multi-tenant apps, gallery apps, non-gallery apps and service principals.

- **Microsoft apps**: Apps such as Outlook and Microsoft Teams.

- [**Managed Identities**](https://entra.microsoft.com/#home): An identity for
applications for connecting resources that support Azure AD authentication.

## How many licenses do I need to purchase? Do I need to license all workload identities including Microsoft and Managed Service Identities? 

All workload identities - service principles, apps and managed identities, configured in your directory for a Microsoft Entra
Workload Identities Premium feature require a license. Select and prioritize the identities based on the available licenses. Remove
the workload identities from the directory that are no longer required.

The following identity functionalities are currently available to view
in a directory:

- Identity Protection: All single-tenant and multi-tenant service
  principals excluding managed identities and Microsoft apps.

- Conditional Access: Single-tenant service principals (excluding
  managed identities) capable of acting as a subject/client, having a
  defined credential.

- Access reviews: All single-tenant and multi-tenant service
  principals assigned to privileged roles.

>[!NOTE]
>Functionality is subject to change, and feature coverage is
intended to expand.

## Do these licenses require individual workload identities assignment? 

No, license assignment isn't required. 

## Can I get a free trial of Workload Identities Premium? 

Yes. you can get a [90-day free trial](https://entra.microsoft.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade).
In the Modern channel, a 30-day only trial is available. Free trial is
unavailable in Government clouds.

## Is the Workload Identities Premium edition available on Government clouds? 

Yes, it's available.

## Is it possible to have a mix of Azure AD Premium P1, Azure AD Premium P2 and Workload Identities Premium licenses in one tenant?

Yes, customers can have a mixture of license plans in one tenant.
