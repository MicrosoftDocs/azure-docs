---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: cost-management-billing
 ms.topic: include
 ms.date: 06/04/2021
 ms.author: tomfitz
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| Subscriptions [associated with an Azure Active Directory tenant](../articles/active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) | Unlimited |
| [Coadministrators](../articles/cost-management-billing/manage/add-change-subscription-administrator.md) per subscription |Unlimited |
| [Resource groups](../articles/azure-resource-manager/management/overview.md) per subscription |980 |
| Azure Resource Manager API request size |4,194,304 bytes |
| Tags per subscription<sup>1</sup> |50 |
| Unique tag calculations per subscription<sup>1</sup> | 80,000 |
| [Subscription-level deployments](../articles/azure-resource-manager/templates/deploy-to-subscription.md) per location | 800<sup>2</sup> |
| Locations of [Subscription-level deployments](../articles/azure-resource-manager/templates/deploy-to-subscription.md) | 10 |

<sup>1</sup>You can apply up to 50 tags directly to a subscription. However, the subscription can contain an unlimited number of tags that are applied to resource groups and resources within the subscription. The number of tags per resource or resource group is limited to 50. Resource Manager returns a [list of unique tag name and values](/rest/api/resources/tags) in the subscription only when the number of tags is 80,000 or less. You still can find a resource by tag when the number exceeds 80,000.

<sup>2</sup>Deployments are automatically deleted from the history as you near the limit. For more information, see [Automatic deletions from deployment history](../articles/azure-resource-manager/templates/deployment-history-deletions.md).