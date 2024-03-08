---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: cost-management-billing
 ms.topic: include
 ms.date: 03/17/2022
 ms.author: tomfitz
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| Azure subscriptions [associated with a Microsoft Entra tenant](../articles/active-directory/fundamentals/active-directory-how-subscriptions-associated-directory.md) | Unlimited |
| [Coadministrators](../articles/cost-management-billing/manage/add-change-subscription-administrator.md) per subscription |Unlimited |
| [Resource groups](../articles/azure-resource-manager/management/overview.md) per subscription |980 |
| Azure Resource Manager API request size |4,194,304 bytes |
| Tags per subscription<sup>1</sup> |50 |
| Unique tag calculations per subscription<sup>2</sup> | 80,000 |
| [Subscription-level deployments](../articles/azure-resource-manager/templates/deploy-to-subscription.md) per location | 800<sup>3</sup> |
| Locations of [Subscription-level deployments](../articles/azure-resource-manager/templates/deploy-to-subscription.md) | 10 |

<sup>1</sup>You can apply up to 50 tags directly to a subscription. Within the subscription, each resource or resource group is also limited to 50 tags. However, the subscription can contain an unlimited number of tags that are dispersed across resources and resource groups. 

<sup>2</sup>Resource Manager returns a [list of tag name and values](/rest/api/resources/tags) in the subscription only when the number of unique tags is 80,000 or less. A unique tag is defined by the combination of resource ID, tag name, and tag value. For example, two resources with the same tag name and value would be calculated as two unique tags. You still can find a resource by tag when the number exceeds 80,000.

<sup>3</sup>Deployments are automatically deleted from the history as you near the limit. For more information, see [Automatic deletions from deployment history](../articles/azure-resource-manager/templates/deployment-history-deletions.md).
