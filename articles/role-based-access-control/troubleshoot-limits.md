---
title: Troubleshoot Azure RBAC limits - Azure RBAC
description: Learn how to use Azure Resource Graph to reduce the number of Azure role assignments and Azure custom roles in Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 07/31/2023
ms.author: rolyon
---

# Troubleshoot Azure RBAC limits

This article describes some common solutions when you exceed the limits in Azure role-based access control (Azure RBAC).

## Prerequisites

- [Reader](./built-in-roles.md#reader) role to run Azure Resource Graph queries.
- [User Access Administrator](./built-in-roles.md#user-access-administrator) or [Owner](./built-in-roles.md#owner) role to add role assignments, remove role assignments, or delete custom roles.
- [Groups Administrator](../active-directory/roles/permissions-reference.md#groups-administrator) or [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator) role to create groups.

> [!NOTE]
> The queries used in this article only return role assignments or custom roles that you have permissions to read. For example, if you only have permissions to read role assignments at resource group scope, role assignments at subscription scope aren't returned.

## Symptom - No more role assignments can be created

When you try to assign a role, you get the following error message:

`No more role assignments can be created (code: RoleAssignmentLimitExceeded)`

### Cause

Azure supports up to **4000** role assignments per subscription. This limit includes role assignments at the subscription, resource group, and resource scopes, but not at the management group scope. You should try to reduce the number of role assignments in the subscription.

> [!NOTE]
> The **4000** role assignments limit per subscription is fixed and cannot be increased.

To get the number of role assignments, you can view the [chart on the Access control (IAM) page](role-assignments-list-portal.md#list-number-of-role-assignments) in the Azure portal. You can also use the following Azure PowerShell commands:

```azurepowershell
$scope = "/subscriptions/<subscriptionId>"
$ras = Get-AzRoleAssignment -Scope $scope | Where-Object {$_.scope.StartsWith($scope)}
$ras.Count
```

### Solution 1 - Replace principal-based role assignments with group-based role assignments

To reduce the number of role assignments in the subscription, add principals (users, service principals, and managed identities) to groups and assign roles to the groups instead. Follow these steps to identify where multiple role assignments for principals can be replaced with a single role assignment for a group.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Select **Scope** and set the scope for the query.

    You typically set scope to **Directory** to query your entire tenant, but you can narrow the scope to particular subscriptions.

    :::image type="content" source="media/troubleshoot-limits/scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Scope selection." lightbox="media/troubleshoot-limits/scope.png":::

1. Select **Set authorization scope** and set the authorization scope to **At, above and below** to query all resources at the specified scope.

    :::image type="content" source="media/troubleshoot-limits/authorization-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Set authorization scope pane." lightbox="media/troubleshoot-limits/authorization-scope.png":::

1. Run the following query to get the role assignments with the same role and at the same scope, but for different principals.

    This query checks active role assignments and doesn't consider eligible role assignments in [Microsoft Entra Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

    [!INCLUDE [resource-graph-query-authorization-same-role-scope](../governance/includes/resource-graph/query/authorization-same-role-scope.md)]

    The following shows an example of the results. The **count_** column is the number of principals assigned the same role and at the same scope. The count is sorted in descending order.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-role-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-limits/authorization-same-role-scope.png":::

1. Identify a row where you want to replace the multiple role assignments with a single role assignment for a group.

1. In the row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-role-scope-details.png" alt-text="Screenshot of Details pane that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-limits/authorization-same-role-scope-details.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | [ID](./built-in-roles.md) of the currently assigned role. |
    | Scope | Scope for the role assignment, which will be a subscription, resource group, or resource. |
    | RoleDefinitionName | [Name](./built-in-roles.md) of the currently assigned role. |
    | count_ | Number of principals assigned the same role and at the same scope. |
    | AllPrincipals | List of principal IDs assigned the same role and at the same scope. |

1. Use **RoleDefinitionId**, **RoleDefinitionName**, and **Scope** to get the role and scope.

1. Use **AllPrincipals** to get the list of the principal IDs with the same role assignment.

1. Create a Microsoft Entra group. For more information, see [Manage Microsoft Entra groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

1. Add the principals from **AllPrincipals** to the group.

    For information about how to add principals in bulk, see [Bulk add group members in Microsoft Entra ID](../active-directory/enterprise-users/groups-bulk-import-members.md).

1. Assign the role to the group you created at the same scope. For more information, see [Assign Azure roles using the Azure portal](role-assignments-portal.md).

    Now you can find and remove the principal-based role assignments.

1. Get the principal names from the principal IDs.
  
    - To use Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - To use PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - To use Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Open the **Access control (IAM)** page at the same scope as the role assignments.

1. Select the **Role assignments** tab.

1. To filter the role assignments, select the **Role** filter and then select the role name.

1. Find the principal-based role assignments.

    You should also see your group-based role assignment.

    :::image type="content" source="media/troubleshoot-limits/role-assignments-filter-remove.png" alt-text="Screenshot of Access control (IAM) page that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-limits/role-assignments-filter-remove.png":::

1. Select and remove the principal-based role assignments. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

### Solution 2 - Remove redundant role assignments

To reduce the number of role assignments in the subscription, remove redundant role assignments. Follow these steps to identify where redundant role assignments at a lower scope can potentially be removed since a role assignment at a higher scope already grants access.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Select **Scope** and set the scope for the query.

    You typically set scope to **Directory** to query your entire tenant, but you can narrow the scope to particular subscriptions.

    :::image type="content" source="media/troubleshoot-limits/scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Scope selection." lightbox="media/troubleshoot-limits/scope.png":::

1. Select **Set authorization scope** and set the authorization scope to **At, above and below** to query all resources at the specified scope.

    :::image type="content" source="media/troubleshoot-limits/authorization-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Set authorization scope pane." lightbox="media/troubleshoot-limits/authorization-scope.png":::

1. Run the following query to get the role assignments with the same role and same principal, but at different scopes.

    This query checks active role assignments and doesn't consider eligible role assignments in [Microsoft Entra Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

    [!INCLUDE [resource-graph-query-authorization-same-role-principal](../governance/includes/resource-graph/query/authorization-same-role-principal.md)]

    The following shows an example of the results. The **count_** column is the number of different scopes for role assignments with the same role and same principal. The count is sorted in descending order.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-role-principal.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments for the same role and same principal, but at different scopes." lightbox="media/troubleshoot-limits/authorization-same-role-principal.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | [ID](./built-in-roles.md) of the currently assigned role. |
    | RoleDefinitionName | [Name](./built-in-roles.md) of the currently assigned role. |
    | PrincipalId | ID of the principal assigned the role. |
    | count_ | Number of different scopes for role assignments with the same role and same principal. |
    | Scopes | Scopes for role assignments with the same role and same principal. |

1. Identify a row where you want to remove redundant role assignments.

1. In a row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-role-principal-details.png" alt-text="Screenshot of Details pane that shows role assignments for the same role and same principal, but at different scopes." lightbox="media/troubleshoot-limits/authorization-same-role-principal-details.png":::

1. Use **RoleDefinitionId**, **RoleDefinitionName**, and **PrincipalId** to get the role and principal ID.

1. Use **Scopes** to get the list of the scopes for the same role and same principal.

1. Determine which scope is required for the role assignment. The other role assignments can be removed.

    You should follow [best practices of least privilege](best-practices.md#only-grant-the-access-users-need) when determining which role assignments can be removed. The role assignment at the higher scope might be granting more access to the principal than what is needed. In that case, you should remove the role assignment with the higher scope. For example, a user might not need a Virtual Machine Contributor role assignment at subscription scope when a Virtual Machine Contributor role assignment at a lower resource group scope grants the required access.

1. Get the principal name from the principal ID.
  
    - To use Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - To use PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - To use Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Open the **Access control (IAM)** page at the scope for a role assignment you want to remove.

1. Select the **Role assignments** tab.

1. To filter the role assignments, select the **Role** filter and then select the role name.

1. Find the principal.

1. Select and remove the role assignment. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

### Solution 3 - Replace multiple built-in role assignments with a custom role assignment

To reduce the number of role assignments in the subscription, replace multiple built-in role assignments with a single custom role assignment. Follow these steps to identify where multiple built-in role assignments can potentially be replaced.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Select **Scope** and set the scope for the query.

    You typically set scope to **Directory** to query your entire tenant, but you can narrow the scope to particular subscriptions.

    :::image type="content" source="media/troubleshoot-limits/scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Scope selection." lightbox="media/troubleshoot-limits/scope.png":::

1. Run the following query to get role assignments with the same principal and same scope, but with different built-in roles.

    This query checks active role assignments and doesn't consider eligible role assignments in [Microsoft Entra Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

    [!INCLUDE [resource-graph-query-authorization-same-principal-scope](../governance/includes/resource-graph/query/authorization-same-principal-scope.md)]

    The following shows an example of the results. The **count_** column is the number of different built-in role assignments with the same principal and same scope. The count is sorted in descending order.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-principal-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments for with the same principal and same scope." lightbox="media/troubleshoot-limits/authorization-same-principal-scope.png":::

    | Column | Description |
    | --- | --- |
    | PrincipalId | ID of the principal assigned the built-in roles. |
    | Scope | Scope for built-in role assignments. |
    | count_ | Number of built-in role assignments with the same principal and same scope. |
    | AllRD | ID and name of built-in roles. |

1. In a row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-limits/authorization-same-principal-scope-details.png" alt-text="Screenshot of Details pane that shows role assignments with the same principal and same scope." lightbox="media/troubleshoot-limits/authorization-same-principal-scope-details.png":::

1. Use **AllRD** to see the built-in roles that can potentially be combined into a custom role.

1. List the actions and data actions for the built-in roles. For more information, see [List Azure role definitions](role-definitions-list.md) or [Azure built-in roles](./built-in-roles.md)

1. Create a custom role that includes all the actions and data actions as the built-in roles. To make it easier to create the custom role, you can start by cloning one of the built-in roles. For more information, see [Create or update Azure custom roles using the Azure portal](custom-roles-portal.md).

1. Get the principal name from the principal ID.
  
    - To use Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - To use PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - To use Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Open the **Access control (IAM)** page at the same scope as the role assignments.

1. Assign the new custom role to the principal. For more information, see [Assign Azure roles using the Azure portal](role-assignments-portal.md).

    Now you can remove the built-in role assignments.

1. On the **Access control (IAM)** page at the same scope, select the **Role assignments** tab.

1. Find the principal and built-in role assignments.

1. Remove the built-in role assignments from the principal. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

### Solution 4 - Make role assignments eligible

To reduce the number of role assignments in the subscription and you have Microsoft Entra ID P2, make role assignments eligible in [Microsoft Entra Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md) instead of permanently assigned.

### Solution 5 - Add an additional subscription

Add an additional subscription.

## Symptom - No more role assignments can be created at management group scope

You're unable to assign a role at management group scope.

### Cause

Azure supports up to **500** role assignments per management group. This limit is different than the role assignments limit per subscription.

> [!NOTE]
> The **500** role assignments limit per management group is fixed and cannot be increased.

### Solution

Try to reduce the number of role assignments in the management group. For possible options, see [Symptom - No more role assignments can be created](#symptom---no-more-role-assignments-can-be-created). For the queries to retrieve resources at the management group level, you'll need to make the following change to the queries:

Replace

`| where id startswith "/subscriptions"`

With

`| where id startswith "/providers/Microsoft.Management/managementGroups"`

## Symptom - No more role definitions can be created

When you try to create a new custom role, you get the following message:

`Role definition limit exceeded. No more role definitions can be created (code: RoleDefinitionLimitExceeded)`

### Cause

Azure supports up to **5000** custom roles in a directory. (For Microsoft Azure operated by 21Vianet, the limit is 2000 custom roles.)

### Solution

Follow these steps to find and delete unused Azure custom roles.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Select **Scope** and set the scope to **Directory** for the query.

    :::image type="content" source="media/troubleshoot-limits/scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows Scope selection." lightbox="media/troubleshoot-limits/scope.png":::

1. Run the following query to get all custom roles that don't have any role assignments:

    This query checks active role assignments and doesn't consider eligible role assignments in [Microsoft Entra Privileged Identity Management](../active-directory/privileged-identity-management/pim-resource-roles-assign-roles.md).

    [!INCLUDE [resource-graph-query-authorization-unused-custom-roles](../governance/includes/resource-graph/query/authorization-unused-custom-roles.md)]

    The following shows an example of the results:

    :::image type="content" source="media/troubleshoot-limits/authorization-unused-custom-roles.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows custom roles without role assignments." lightbox="media/troubleshoot-limits/authorization-unused-custom-roles.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | ID of the unused custom role. |
    | RoleDefinitionName | Name of the unused custom role. |
    | Scope | [Assignable scopes](./role-definitions.md#assignablescopes) for the unused custom role. |

1. Open the scope (typically subscription) and then open the **Access control (IAM)** page.

1. Select the **Roles** tab to see a list of all the built-in and custom roles.

1. In the **Type** filter, select **CustomRole** to just see your custom roles.

1. Select  the ellipsis (**...**) for the custom role you want to delete and then select **Delete**.

    :::image type="content" source="media/shared/custom-roles-delete-menu.png" alt-text="Screenshot of a list of custom roles that can be selected for deletion." lightbox="media/shared/custom-roles-delete-menu.png":::

## Next steps

- [Remove Azure role assignments](./role-assignments-remove.md)
- [Create or update Azure custom roles using the Azure portal](custom-roles-portal.md)
