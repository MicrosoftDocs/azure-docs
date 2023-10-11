---
title: Microsoft Entra Workload ID license plans FAQ

description: Learn about Microsoft Entra Workload ID license plans, features and capabilities. 
author: gargi-sinha
manager: martinco
ms.service: active-directory
ms.subservice: workload-identities
ms.workload: identity
ms.topic: conceptual
ms.date: 10/03/2023
ms.author: gasinh
ms.reviewer: 
ms.custom: aaddev 
#Customer intent: I want to know about Microsoft Entra Workload ID licensing plans 
---

# Frequently asked questions about Microsoft Entra Workload ID license plans

[Microsoft Entra Workload ID](workload-identities-overview.md) is now available in two editions: **Free** and **Workload Identities Premium**. The free edition of workload identities is included with a subscription of a commercial online service such as [Azure](https://azure.microsoft.com/) and [Power Platform](https://powerplatform.microsoft.com/). The Workload
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
| Authenticate workload identities and tokens to access resources |  Use Microsoft Entra ID to protect resource access |  Yes|  Yes |
| Workload identities sign-in activity and audit trail |   Monitor and track workload identity behavior  |  Yes |  Yes |
| **Managed identities**| Use Microsoft Entra identities in Azure without handling credentials |  Yes| Yes |
| Workload identity federation | Use workloads tested by external Identity Providers (IdPs) to access Microsoft Entra protected resources | Yes | Yes |
|  **Conditional Access**     |   |   |    
| Conditional Access policies for workload identities |Define the condition in which a workload can access a resource, such as an IP range | |  Yes | 
|**Lifecycle Management**|    |    |   |
|Access reviews for service provider-assigned privileged roles  |   Closely monitor workload identities with impactful permissions |    |  Yes |
| Application authentication methods API |  Allows IT admins to enforce best practices for how apps in their organizations use application authentication methods. |  | Yes |
| App Health Recommendations | Identify unused or inactive workload identities and their risk levels.  Get remediation guidelines.  |  | Yes |
|**Identity Protection**  |  | |
|Identity Protection for workload identities  | Detect and remediate compromised workload identities | | Yes |

## What is the cost of Workload Identities Premium plan? 

Check the pricing for the [Microsoft Entra Workload ID
Premium](https://www.microsoft.com/security/business/identity-access/microsoft-entra-workload-identities#office-StandaloneSKU-k3hubfz)
plan.

## How do I purchase a Workload Identities Premium plan?

You need an Azure or Microsoft 365 subscription. You can use a
current subscription or set up a new one. Then, sign into the [Microsoft
Microsoft Entra admin
center](https://entra.microsoft.com/)
with your credentials to buy Workload Identities licenses.

## Through what channels can I purchase Workload Identities Premium plan? 

You can purchase the plan through Enterprise Agreement (EA)/Enterprise Subscription (EAS), Cloud Solution Providers (CSPs), or Web Direct.

## Where can I find more feature details to determine if I need a license(s)?

Microsoft Entra Workload ID has four premium features that require a license. 

- [Conditional Access](../conditional-access/workload-identity.md):
Supports location or risk-based policies for workload identities.

- [Identity Protection](../identity-protection/concept-workload-identity-risk.md):
Provides reports of compromised credentials, anomalous sign-ins, and
suspicious changes to accounts.

- [Access Reviews](https://techcommunity.microsoft.com/t5/azure-active-directory-identity/introducing-azure-ad-access-reviews-for-service-principals/ba-p/1942488):
Enables delegation of reviews to the right people, focused on the most
important privileged roles.

- [App health recommendations](/azure/active-directory/reports-monitoring/howto-use-recommendations): Provides recommendations for addressing identity hygiene gaps in your application portfolio so you can improve the security and resilience posture of a tenant. 

## What do the numbers in each category on the [Workload identities - Microsoft Entra admin center](https://entra.microsoft.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade) mean?

Category definitions:

- **Enterprise apps/Service Principals**: This category includes multitenant apps, gallery apps, non-gallery apps and service principals.

- **Microsoft apps**: Apps such as Outlook and Microsoft Teams.

- [**Managed Identities**](https://entra.microsoft.com/#home): An identity for
applications for connecting resources that support Microsoft Entra authentication.

## How many licenses do I need to purchase? Do I need to license all workload identities including Microsoft and Managed Service Identities? 

All workload identities - service principles, apps and managed identities, configured in your directory for a Microsoft Entra Workload ID Premium feature require a license. Customers don’t need to license all the workload identities. You can find the right number of Workload ID licenses with the following guidance:

1. Customer needs to license enterprise applications or service principals ONLY if they set up Conditional Access policies or use Identity Protection for them.
2. Customers don't need to license applications at all, even if they're using Conditional Access policies.
3. Customers need to license managed identities, only when they set up access reviews for managed identities.
You can find the number of each workload identity type (enterprise apps/service principals, apps, managed identities) on the product landing page at the [Microsoft Entra admin center](https://entra.microsoft.com).

## Do these licenses require individual workload identities assignment? 

No, license assignment isn't required. 

## Can I get a free trial of Workload Identities Premium? 

Yes. you can get a [90-day free trial](https://entra.microsoft.com/#view/Microsoft_Azure_ManagedServiceIdentity/WorkloadIdentitiesBlade).
In the Modern channel, a 30-day only trial is available. Free trial is
unavailable in Government clouds.

## Is the Workload Identities Premium edition available on Government clouds? 

Yes, it's available.

<a name='is-it-possible-to-have-a-mix-of-azure-ad-premium-p1-azure-ad-premium-p2-and-workload-identities-premium-licenses-in-one-tenant'></a>

## Is it possible to have a mix of Microsoft Entra ID P1, Microsoft Entra ID P2 and Workload Identities Premium licenses in one tenant?

Yes, customers can have a mixture of license plans in one tenant.
