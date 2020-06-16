---
 title: include file
 description: include file
 services: azure-resource-manager
 author: tfitzmac
 ms.service: cost-management-billing
 ms.topic: include
 ms.date: 03/26/2020
 ms.author: tomfitz
 ms.custom: include file
---

| Resource | Limit |
| --- | --- |
| Subscriptions per Azure Active Directory tenant | Unlimited. |
| [Coadministrators](../articles/cost-management-billing/manage/add-change-subscription-administrator.md) per subscription |Unlimited. |
| [Resource groups](../articles/azure-resource-manager/management/overview.md) per subscription |980 |
| Azure Resource Manager API request size |4,194,304 bytes. |
| Tags per subscription<sup>1</sup> |50 |
| Unique tag calculations per subscription<sup>1</sup> | 10,000 |
| [Subscription-level deployments](../articles/azure-resource-manager/templates/deploy-to-subscription.md) per location | 800<sup>2</sup> |

<sup>1</sup>You can apply up to 50 tags directly to a subscription. However, the subscription can contain an unlimited number of tags that are applied to resource groups and resources within the subscription. The number of tags per resource or resource group is limited to 50. Resource Manager returns a [list of unique tag name and values](/rest/api/resources/tags) in the subscription only when the number of tags is 10,000 or less. You still can find a resource by tag when the number exceeds 10,000.  

<sup>2</sup>If you reach the limit of 800 deployments, delete deployments from the history that are no longer needed. To delete subscription level deployments, use [Remove-AzDeployment](/powershell/module/az.resources/Remove-AzDeployment) or [az deployment sub delete](/cli/azure/deployment/sub?view=azure-cli-latest#az-deployment-sub-delete).
