---
 title: include file
 description: include file
 author: xelu86
 ms.service: azure
 ms.topic: include
 ms.date: 08/04/2026
 ms.author: alalve
 ms.custom: include file
 ms.subservice: azure-governance
---

|                                                           Resource                                                            |                Limit                 |
| ----------------------------------------------------------------------------------------------------------------------------- | ------------------------------------ |
| Management groups per Microsoft Entra tenant                                                                                  | 10,000                               |
| Subscriptions per management group                                                                                            | Unlimited                            |
| Levels of management group hierarchy                                                                                          | Root level plus 6 levels<sup>1</sup> |
| Direct parent management group per management group                                                                           | One                                  |
| [Management group level deployments](../articles/azure-resource-manager/templates/deploy-to-management-group.md)              | 800<sup>2</sup>                      |
| Locations of [Management group level deployments](../articles/azure-resource-manager/templates/deploy-to-management-group.md) | 10                                   |

<sup>1</sup>The 6 levels don't include the subscription level.

<sup>2</sup>If you reach the limit of 800 deployments, delete deployments from the history that are no longer needed. To delete management group level deployments, use [Remove-AzManagementGroupDeployment](/powershell/module/az.resources/Remove-AzManagementGroupDeployment) or [az deployment mg delete](/cli/azure/deployment/mg#az-deployment-mg-delete). Deployments are automatically deleted from the history as you near the limit. Deleting an entry from the deployment history doesn't affect the deployed resources. For more information, see [Automatic deletions from deployment history](../articles/azure-resource-manager/templates/deployment-history-deletions.md).
