---
title: Examples to delegate Azure role assignments with conditions (preview) - Azure ABAC
description: Examples to delegate the Azure role assignment task with conditions to other users by using Azure attribute-based access control (Azure ABAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.subservice: conditions
ms.topic: conceptual
ms.workload: identity
ms.custom: devx-track-azurepowershell
ms.date: 09/20/2023
ms.author: rolyon
#Customer intent: As a dev, devops, or it admin, I want to learn about the conditions so that I write more complex conditions.
---

# Examples to delegate Azure role assignments with conditions (preview)

> [!IMPORTANT]
> Delegating Azure role assignments with conditions is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.

This article lists examples to delegate the Azure role assignment task with conditions to other users.

## Prerequisites

For information about the prerequisites to add or edit role assignment conditions, see [Conditions prerequisites](conditions-prerequisites.md).

## Example: Constrain roles

This condition allows a delegate to only add or remove role assignments for the [Backup Contributor](built-in-roles.md#backup-contributor) or [Backup Reader](built-in-roles.md#backup-reader) roles.

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/shared/roles-constrained.png" alt-text="Diagram of role assignments constrained to Backup Contributor or Backup Reader roles." lightbox="./media/shared/roles-constrained.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain roles and principal types

This condition allows a delegate to only add or remove role assignments for the [Backup Contributor](built-in-roles.md#backup-contributor) or [Backup Reader](built-in-roles.md#backup-reader) roles. Also, the delegate can only assign these roles to principals of type user or group.

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/shared/principal-types-constrained.png" alt-text="Diagram of role assignments constrained Backup Contributor or Backup Reader roles and user or group principal types." lightbox="./media/shared/principal-types-constrained.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles and principal types |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Principal types | Users<br/>Groups |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Request |
> | Attribute | [Principal type](conditions-authorization-actions-attributes.md#principal-type) |
> | Operator | [ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |
> | Value | User<br/>Group |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Resource |
> | Attribute | [Principal type](conditions-authorization-actions-attributes.md#principal-type) |
> | Operator | [ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |
> | Value | User<br/>Group |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
  AND
  @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User', 'Group'}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
  AND
  @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User', 'Group'}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User', 'Group'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'User', 'Group'}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain roles and specific groups

This condition allows a delegate to only add or remove role assignments for the [Backup Contributor](built-in-roles.md#backup-contributor) or [Backup Reader](built-in-roles.md#backup-reader) roles. Also, the delegate can only assign these roles to specific groups named Marketing (28c35fea-2099-4cf5-8ad9-473547bc9423) or Sales (86951b8b-723a-407b-a74a-1bca3f0c95d0).

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/shared/groups-constrained.png" alt-text="Diagram of role assignments constrained to Backup Contributor or Backup Reader roles and Marketing or Sales groups." lightbox="./media/shared/groups-constrained.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles and principals |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Principals | Marketing<br/>Sales |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Request |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Marketing<br/>Sales |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Resource |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Marketing<br/>Sales |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
  AND
  @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {28c35fea-2099-4cf5-8ad9-473547bc9423, 86951b8b-723a-407b-a74a-1bca3f0c95d0}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
  AND
  @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {28c35fea-2099-4cf5-8ad9-473547bc9423, 86951b8b-723a-407b-a74a-1bca3f0c95d0}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {28c35fea-2099-4cf5-8ad9-473547bc9423, 86951b8b-723a-407b-a74a-1bca3f0c95d0})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {28c35fea-2099-4cf5-8ad9-473547bc9423, 86951b8b-723a-407b-a74a-1bca3f0c95d0}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain virtual machine management

This condition allows a delegate to only add or remove role assignments for the [Virtual Machine Administrator Login](built-in-roles.md#virtual-machine-administrator-login) or [Virtual Machine User Login](built-in-roles.md#virtual-machine-user-login) roles. Also, the delegate can only assign these roles to a specific user named Dara (ea585310-c95c-4a68-af22-49af4363bbb1).

This condition is useful when you want to allow a delegate to assign a virtual machine login role to themselves for a virtual machine they've just created.

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/delegate-role-assignments-examples/virtual-machines-constrained.png" alt-text="Diagram of role assignments constrained to Virtual Machine Administrator Login or Virtual Machine User Login roles and a specific user." lightbox="./media/delegate-role-assignments-examples/virtual-machines-constrained.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles and principals |
> | Roles | [Virtual Machine Administrator Login](built-in-roles.md#virtual-machine-administrator-login)<br/>[Virtual Machine User Login](built-in-roles.md#virtual-machine-user-login) |
> | Principals | Dara |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Virtual Machine Administrator Login](built-in-roles.md#virtual-machine-administrator-login)<br/>[Virtual Machine User Login](built-in-roles.md#virtual-machine-user-login) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Request |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Dara |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Virtual Machine Administrator Login](built-in-roles.md#virtual-machine-administrator-login)<br/>[Virtual Machine User Login](built-in-roles.md#virtual-machine-user-login) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Resource |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Dara |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52}
  AND
  @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52}
  AND
  @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {1c0163c0-47e6-4577-8991-ea5c82e286e4, fb879df8-f326-4884-b1cf-06f3ad86be52} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain AKS cluster management

This condition allows a delegate to only add or remove role assignments for the [Azure Kubernetes Service RBAC Admin](built-in-roles.md#azure-kubernetes-service-rbac-admin), [Azure Kubernetes Service RBAC Cluster Admin](built-in-roles.md#azure-kubernetes-service-rbac-cluster-admin), [Azure Kubernetes Service RBAC Reader](built-in-roles.md#azure-kubernetes-service-rbac-reader), or [Azure Kubernetes Service RBAC Writer](built-in-roles.md#azure-kubernetes-service-rbac-writer) roles. Also, the delegate can only assign these roles to a specific user named Dara (ea585310-c95c-4a68-af22-49af4363bbb1).

This condition is useful when you want to allow a delegate to assign Azure Kubernetes Service (AKS) cluster data plane authorization roles to themselves for a cluster they've just created.

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/delegate-role-assignments-examples/aks-cluster.png" alt-text="Diagram of role assignments constrained to Azure Kubernetes Service RBAC Admin, Azure Kubernetes Service RBAC Cluster Admin, Azure Kubernetes Service RBAC Reader, or Azure Kubernetes Service RBAC Writer roles and a specific user." lightbox="./media/delegate-role-assignments-examples/aks-cluster.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles and principals |
> | Roles | [Azure Kubernetes Service RBAC Admin](built-in-roles.md#azure-kubernetes-service-rbac-admin)<br/>[Azure Kubernetes Service RBAC Cluster Admin](built-in-roles.md#azure-kubernetes-service-rbac-cluster-admin)<br/>[Azure Kubernetes Service RBAC Reader](built-in-roles.md#azure-kubernetes-service-rbac-reader)<br/>[Azure Kubernetes Service RBAC Writer](built-in-roles.md#azure-kubernetes-service-rbac-writer) |
> | Principals | Dara |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Azure Kubernetes Service RBAC Admin](built-in-roles.md#azure-kubernetes-service-rbac-admin)<br/>[Azure Kubernetes Service RBAC Cluster Admin](built-in-roles.md#azure-kubernetes-service-rbac-cluster-admin)<br/>[Azure Kubernetes Service RBAC Reader](built-in-roles.md#azure-kubernetes-service-rbac-reader)<br/>[Azure Kubernetes Service RBAC Writer](built-in-roles.md#azure-kubernetes-service-rbac-writer) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Request |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Dara |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Azure Kubernetes Service RBAC Admin](built-in-roles.md#azure-kubernetes-service-rbac-admin)<br/>[Azure Kubernetes Service RBAC Cluster Admin](built-in-roles.md#azure-kubernetes-service-rbac-cluster-admin)<br/>[Azure Kubernetes Service RBAC Reader](built-in-roles.md#azure-kubernetes-service-rbac-reader)<br/>[Azure Kubernetes Service RBAC Writer](built-in-roles.md#azure-kubernetes-service-rbac-writer) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Resource |
> | Attribute | [Principal ID](conditions-authorization-actions-attributes.md#principal-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Principals | Dara |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {3498e952-d568-435e-9b2c-8d77e338d7f7, b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b, 7f6c6a51-bcf8-42ba-9220-52d62157d7db, a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb}
  AND
  @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {3498e952-d568-435e-9b2c-8d77e338d7f7, b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b, 7f6c6a51-bcf8-42ba-9220-52d62157d7db, a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb}
  AND
  @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {3498e952-d568-435e-9b2c-8d77e338d7f7, b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b, 7f6c6a51-bcf8-42ba-9220-52d62157d7db, a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {3498e952-d568-435e-9b2c-8d77e338d7f7, b1ff04bb-8a4e-4dc4-8eb5-8693973ce19b, 7f6c6a51-bcf8-42ba-9220-52d62157d7db, a7ffa36f-339b-4b5c-8bdf-e2c188b2c0eb} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalId] ForAnyOfAnyValues:GuidEquals {ea585310-c95c-4a68-af22-49af4363bbb1}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain ACR management

This condition allows a delegate to only add or remove role assignments for the [AcrPull](built-in-roles.md#acrpull) role. Also, the delegate can only assign these roles to principals of type service principal.

This condition is useful when you want to allow a developer to assign the AcrPull role to a managed identity themselves so that it can pull images from the Azure Container Registry (ACR).

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/delegate-role-assignments-examples/acr-constrained.png" alt-text="Diagram of role assignments constrained to the AcrPull role and service principal type." lightbox="./media/delegate-role-assignments-examples/acr-constrained.png":::

# [Template](#tab/template)

Here are the settings to add this condition using the Azure portal and a condition template.

> [!div class="mx-tableFixed"]
> | Condition | Setting |
> | --- | --- |
> | Template | Constrain roles and principal types |
> | Roles | [AcrPull](built-in-roles.md#acrpull) |
> | Principal types | Service principals |

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [AcrPull](built-in-roles.md#acrpull) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Request |
> | Attribute | [Principal type](conditions-authorization-actions-attributes.md#principal-type) |
> | Operator | [ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |
> | Value | ServicePrincipal |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |
> | Operator | And |
> | **Expression 2** |  |
> | Attribute source | Resource |
> | Attribute | [Principal type](conditions-authorization-actions-attributes.md#principal-type) |
> | Operator | [ForAnyOfAnyValues:StringEqualsIgnoreCase](conditions-format.md#foranyofanyvalues) |
> | Value | ServicePrincipal |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {7f951dda-4ed3-4680-a7ca-43fe172d538d}
  AND
  @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'ServicePrincipal'}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {7f951dda-4ed3-4680-a7ca-43fe172d538d}
  AND
  @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'ServicePrincipal'}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {7f951dda-4ed3-4680-a7ca-43fe172d538d} AND @Request[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'ServicePrincipal'})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {7f951dda-4ed3-4680-a7ca-43fe172d538d} AND @Resource[Microsoft.Authorization/roleAssignments:PrincipalType] ForAnyOfAnyValues:StringEqualsIgnoreCase {'ServicePrincipal'}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Constrain add role assignments

This condition allows a delegate to only add role assignments for the [Backup Contributor](built-in-roles.md#backup-contributor) or [Backup Reader](built-in-roles.md#backup-reader) roles. The delegate can remove any role assignments.

You must add this condition to any role assignments for the delegate that include the following action.

- `Microsoft.Authorization/roleAssignments/write`

:::image type="content" source="./media/shared/actions-constrained.png" alt-text="Diagram of add and remove role assignments constrained to Backup Contributor or Backup Reader roles." lightbox="./media/shared/actions-constrained.png":::

# [Template](#tab/template)

None

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Backup Contributor](built-in-roles.md#backup-contributor)<br/>[Backup Reader](built-in-roles.md#backup-reader) |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidEquals {5e467623-bb1f-42f4-a55d-6e525e11384b, a795c7a0-d4a2-40c1-ae25-d81f01202912}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Example: Allow most roles, but don't allow others to assign roles

This condition allows a delegate to add or remove role assignments for all roles except the [Owner](built-in-roles.md#owner), [Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator-preview), and [User Access Administrator](built-in-roles.md#user-access-administrator) roles.

This condition is useful when you want to allow a delegate to assign most roles, but not allow the delegate to allow others to assign roles.

> [!NOTE]
> This condition should be used with caution. If a new built-in or custom role is later added that includes the permission to create role assignments, this condition would not prevent the delegate from assigning roles. The condition would have to be updated to include the new built-in or custom role.

You must add this condition to any role assignments for the delegate that include the following actions.

- `Microsoft.Authorization/roleAssignments/write`
- `Microsoft.Authorization/roleAssignments/delete`

:::image type="content" source="./media/delegate-role-assignments-examples/roles-all-except-specific-roles.png" alt-text="Diagram of add and remove role assignments for all roles except Owner, Role Based Access Control Administrator, and User Access Administrator." lightbox="./media/delegate-role-assignments-examples/roles-all-except-specific-roles.png":::

# [Template](#tab/template)

None

# [Condition editor](#tab/condition-editor)

Here are the settings to add this condition using the Azure portal and the condition editor.

To target both the add and remove role assignment actions, notice that you must add two conditions. You must add two conditions because the attribute source is different for each action. If you try to target both actions in the same condition, you won't be able to add an expression. For more information, see [Symptom - No options available error](conditions-troubleshoot.md#symptom---no-options-available-error).

> [!div class="mx-tableFixed"]
> | Condition #1 | Setting |
> | --- | --- |
> | Actions | [Create or update role assignments](conditions-authorization-actions-attributes.md#create-or-update-role-assignments) |
> | Attribute source | Request |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidNotEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Owner](built-in-roles.md#owner)<br/>[Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator-preview)<br/>[User Access Administrator](built-in-roles.md#user-access-administrator) |

> [!div class="mx-tableFixed"]
> | Condition #2 | Setting |
> | --- | --- |
> | Actions | [Delete a role assignment](conditions-authorization-actions-attributes.md#delete-a-role-assignment) |
> | Attribute source | Resource |
> | Attribute | [Role definition ID](conditions-authorization-actions-attributes.md#role-definition-id) |
> | Operator | [ForAnyOfAnyValues:GuidNotEquals](conditions-format.md#foranyofanyvalues) |
> | Comparison | Value |
> | Roles | [Owner](built-in-roles.md#owner)<br/>[Role Based Access Control Administrator](built-in-roles.md#role-based-access-control-administrator-preview)<br/>[User Access Administrator](built-in-roles.md#user-access-administrator) |

```
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})
 )
 OR 
 (
  @Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidNotEquals {8e3af657-a8ff-443c-a75c-2fe8c4bcb635, f58310d9-a9f6-439a-9e8d-f62e7b41a168, 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9}
 )
)
AND
(
 (
  !(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})
 )
 OR 
 (
  @Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidNotEquals {8e3af657-a8ff-443c-a75c-2fe8c4bcb635, f58310d9-a9f6-439a-9e8d-f62e7b41a168, 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9}
 )
)
```

# [Azure PowerShell](#tab/azure-powershell)

Here's how to add this condition using Azure PowerShell.

```azurepowershell
$roleDefinitionId = "f58310d9-a9f6-439a-9e8d-f62e7b41a168"
$principalId = "<principalId>"
$scope = "/subscriptions/<subscriptionId>"
$condition = "((!(ActionMatches{'Microsoft.Authorization/roleAssignments/write'})) OR (@Request[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidNotEquals {8e3af657-a8ff-443c-a75c-2fe8c4bcb635, f58310d9-a9f6-439a-9e8d-f62e7b41a168, 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9})) AND ((!(ActionMatches{'Microsoft.Authorization/roleAssignments/delete'})) OR (@Resource[Microsoft.Authorization/roleAssignments:RoleDefinitionId] ForAnyOfAnyValues:GuidNotEquals {8e3af657-a8ff-443c-a75c-2fe8c4bcb635, f58310d9-a9f6-439a-9e8d-f62e7b41a168, 18d7d88d-d35e-4fb5-a5c3-7773c20a72d9}))"
$conditionVersion = "2.0"
New-AzRoleAssignment -ObjectId $principalId -Scope $scope -RoleDefinitionId $roleDefinitionId -Condition $condition -ConditionVersion $conditionVersion
```

---

## Next steps

- [Authorization actions and attributes (preview)](conditions-authorization-actions-attributes.md)
- [Azure role assignment condition format and syntax (preview)](conditions-format.md)
- [Troubleshoot Azure role assignment conditions (preview)](conditions-troubleshoot.md)
