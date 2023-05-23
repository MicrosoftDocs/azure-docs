---
title: Troubleshoot Azure RBAC limits - Azure RBAC
description: Learn how to use Azure Resource Graph to reduce the number of Azure role assignments and Azure custom roles in Azure role-based access control (Azure RBAC).
services: active-directory
author: rolyon
manager: amycolannino
ms.service: role-based-access-control
ms.topic: how-to
ms.workload: identity
ms.date: 05/15/2023
ms.author: rolyon
---

# Troubleshoot Azure RBAC limits

This article describes some common solutions when you exceed the limits in Azure role-based access control (Azure RBAC).

## Prerequisites

- [Reader](./built-in-roles.md#reader) role to run Azure Resource Graph queries.
- [User Access Administrator](./built-in-roles.md#user-access-administrator) or [Owner](./built-in-roles.md#owner) role to add role assignments, remove role assignments, or delete custom roles.
- [Groups Administrator](../active-directory/roles/permissions-reference.md#groups-administrator), [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator), [Privileged Role Administrator](../active-directory/roles/permissions-reference.md#privileged-role-administrator) role to create groups.

## Symptom - No more role assignments can be created

When you try to assign a role, you get the following error message:

`No more role assignments can be created (code: RoleAssignmentLimitExceeded)`

#### Cause

Azure supports up to **4000** role assignments per subscription. This limit includes role assignments at the subscription, resource group, and resource scopes, but not at the management group scope. You should try to reduce the number of role assignments in the subscription.

To get the number of role assignments, you can view the [chart on the Access control (IAM) page](role-assignments-list-portal.md#list-number-of-role-assignments) in the Azure portal. You can also use the following Azure PowerShell commands:

```azurepowershell
$scope = "/subscriptions/<subscriptionId>"
$ras = Get-AzRoleAssignment -Scope $scope | Where-Object {$_.scope.StartsWith($scope)}
$ras.Count
```

#### Solution 1 - Replace principal-based role assignments with group-based role assignments

To reduce the number of role assignments in the subscription, add principals (users, service principals, and managed identities) to groups and assign roles to the groups instead. Follow these steps to identify where multiple role assignments for principals can be replaced with a single role assignment for a group.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Run the following query to get the role assignments with the same role and at the same scope, but for different principals.

    ```kusto
    AuthorizationResources  
    | where type =~ "microsoft.authorization/roleassignments" 
    | where id startswith "/subscriptions" 
     | extend RoleId = tostring(split(tolower(properties.roleDefinitionId), "roledefinitions/", 1)[0]) 
     | join kind = leftouter ( 
     AuthorizationResources
      | where type =~ "microsoft.authorization/roledefinitions" 
      | extend RoleDefinitionName = name
      | extend rdId = tostring(split(tolower(id), "roledefinitions/", 1)[0])  
      | project RoleDefinitionName, rdId
    ) on $left.RoleId == $right.rdId 
    | extend principalId = tostring(properties.principalId) 
    | extend principal_to_ra = pack(principalId, id) 
    | summarize count_ = count(), AllPrincipals = make_set(principal_to_ra) by RoleDefinitionId = tolower(properties.roleDefinitionId), Scope = tolower(properties.scope), RoleDefinitionName
    | where count_ > 1
    | order by count_ desc
    ```

    The following shows an example of the results. The **count_** column is the number of principals assigned the same role and at the same scope. The count is sorted in descending order.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-group.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-group.png":::

1. Identify a row where you want to replace the multiple role assignments with a single role assignment for a group.

1. In the row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-group-details.png" alt-text="Screenshot of Details pane that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-group-details.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | [ID](./built-in-roles.md) of the currently assigned role. |
    | Scope | Scope for the role assignment, which will be a subscription, resource group, or resource. |
    | RoleDefinitionName | [Name](./built-in-roles.md) of the currently assigned role. |
    | count_ | Number of principals assigned the same role and at the same scope. |
    | AllPrincipals | List of principal IDs assigned the same role and at the same scope. |

1. Use **RoleDefinitionId**, **RoleDefinitionName**, and **Scope** to get the role and scope.

1. Use **AllPrincipals** to get the list of the principal IDs with the same role assignment.

1. Create an Azure AD group. For more information, see [Manage Azure Active Directory groups and group membership](../active-directory/fundamentals/how-to-manage-groups.md).

1. Add the principals from **AllPrincipals** to the group.

1. Assign the role to the group you created at the same scope. For more information, see [Assign Azure roles using the Azure portal](role-assignments-portal.md).

    Now you can find and remove the principal-based role assignments.

1. Get the principal names from the principal IDs.
  
    - To use Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - To use PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - To use Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Open the **Access control (IAM)** page at the same scope as the role assignments.

1. Select the **Role assignments** tab.

1. In the **Role** filter, select the role to just see the role assignments for this role.

1. Find the principal-based role assignments.

    You should also see your group-based role assignment.

    :::image type="content" source="media/troubleshoot-resource-graph/role-assignments-filter-remove.png" alt-text="Screenshot of Access control (IAM) page that shows role assignments with the same role and at the same scope, but for different principals." lightbox="media/troubleshoot-resource-graph/role-assignments-filter-remove.png":::

1. Select and remove the principal-based role assignments. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

#### Solution 2 - Combine multiple built-in roles with a custom role

To reduce the number of role assignments in the subscription, combine multiple built-in roles with a custom role and assigning the custom role instead.

#### Solution 3 - Make role assignments eligible

To reduce the number of role assignments in the subscription and you have Azure AD Premium P2, make role assignments eligible in [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) instead of permanently assigned.

#### Solution 4 - Add an additional subscription

Add an additional subscription.

#### Solution 5 - Remove redundant role assignments

If you still need to reduce the number of role assignments in the subscription and other solutions don't work for you, remove redundant role assignments. Follow these steps to identify where redundant role assignments at a lower scope can potentially be removed since a role assignment at a higher scope already grants access.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Run the following query to get the role assignments with the same principal and same role, but at different scopes.

    ```kusto
    AuthorizationResources  
    | where type =~ "microsoft.authorization/roleassignments"  
    | where id startswith "/subscriptions"  
    | extend RoleId = tostring(split(tolower(properties.roleDefinitionId), "roledefinitions/", 1)[0])  
    | extend PrincipalId = tolower(properties.principalId)
    | extend RoleId_PrincipalId = strcat(RoleId, "_", PrincipalId)
    | join kind = leftouter (  
     AuthorizationResources 
      | where type =~ "microsoft.authorization/roledefinitions"  
      | extend RoleDefinitionName = name 
      | extend rdId = tostring(split(tolower(id), "roledefinitions/", 1)[0])   
      | project RoleDefinitionName, rdId 
    ) on $left.RoleId == $right.rdId  
     | summarize count_ = count(), Scopes = make_set(tolower(properties.scope)) by RoleId_PrincipalId, RoleDefinitionName
     | project RoleId = split(RoleId_PrincipalId, "_", 0)[0], RoleDefinitionName, PrincipalId = split(RoleId_PrincipalId, "_", 1)[0], count_, Scopes
     | where count_ > 1
     | order by count_ desc
    ```

    The following shows an example of the results. The **count_** column is the number of different scopes for role assignments with the same principal and same role. The count is sorted in descending order.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments for the same principal and role, but at different scopes." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | [ID](./built-in-roles.md) of the currently assigned role. |
    | RoleDefinitionName | [Name](./built-in-roles.md) of the currently assigned role. |
    | PrincipalId | ID of the principal assigned the role. |
    | count_ | Number of different scopes for role assignments with the same principal and same role. |
    | Scopes | Scopes for role assignments with the same principal and same role. |

1. Identify a row where you want to remove redundant role assignments.

1. In a row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope-details.png" alt-text="Screenshot of Details pane that shows role assignments for the same principal and role, but at different scopes." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope-details.png":::

1. Use **RoleDefinitionId**, **RoleDefinitionName**, and **PrincipalId** to get the role and principal ID.

1. Use **Scopes** to get the list of the scopes for the same principal and role.

1. Determine which scope is required for the role assignment. The other role assignments can be removed.

    You should follow [best practices of least privilege](best-practices.md#only-grant-the-access-users-need) when determining which role assignments can be removed. The role assignment at the higher scope might be granting more access to the principal than what is needed. In that case, you should remove the role assignment with the higher scope. For example, a user might not need a Virtual Machine Contributor role assignment at subscription scope when a Virtual Machine Contributor role assignment at a lower resource group scope grants the required access.

1. Get the principal name from the principal ID.
  
    - To use Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - To use PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - To use Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Open the **Access control (IAM)** page at the scope for a role assignment you want to remove.

1. Select the **Role assignments** tab.

1. Find the principal and role assignment.

1. Select and remove the role assignment. For more information, see [Remove Azure role assignments](role-assignments-remove.md).

## Symptom - No more role assignments can be created at management group scope

You're unable to assign a role at management group scope.

**Cause**

Azure supports up to **500** role assignments per management group. This limit is different than the role assignments limit per subscription.

> [!NOTE]
> The **500** role assignments limit per management group is fixed and cannot be increased.

**Solution**

Try to reduce the number of role assignments in the management group. For possible options, see [Symptom - No more role assignments can be created](#symptom---no-more-role-assignments-can-be-created).

## Symptom - No more role definitions can be created

When you try to create a new custom role, you get the following message:

`Role definition limit exceeded. No more role definitions can be created (code: RoleDefinitionLimitExceeded)`

#### Cause

Azure supports up to **5000** custom roles in a directory. (For Azure China 21Vianet, the limit is 2000 custom roles.)

#### Solution

Follow these steps to find and delete unused Azure custom roles.

1. Sign in to the [Azure portal](https://portal.azure.com) and open the Azure Resource Graph Explorer.

1. Run the following query to get all custom roles that don't have any role assignments:

    ```kusto
    AuthorizationResources 
    | where type =~ "microsoft.authorization/roledefinitions" 
    | where tolower(properties.type) == "customrole" 
    | extend rdId = tostring(split(tolower(id), "roledefinitions/", 1)[0]) 
    | extend Scope = tolower(properties.assignableScopes)
    | join kind = leftouter ( 
    AuthorizationResources 
      | where type =~ "microsoft.authorization/roleassignments" 
      | extend RoleId = tostring(split(tolower(properties.roleDefinitionId), "roledefinitions/", 1)[0]) 
      | summarize RoleAssignmentCount = count() by RoleId 
    ) on $left.rdId == $right.RoleId 
    | where isempty(RoleAssignmentCount) 
    | project RoleDefinitionId = rdId, RoleDefinitionName = name, Scope
    ```

    The following shows an example of the results:

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-custom-roles-unused.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows custom roles without role assignments." lightbox="media/troubleshoot-resource-graph/resource-graph-custom-roles-unused.png":::

    | Column | Description |
    | --- | --- |
    | RoleDefinitionId | ID of the unused custom role. |
    | RoleDefinitionName | Name of the unused custom role. |
    | Scope | [Assignable scopes](./role-definitions.md#assignablescopes) for the unused custom role. |

1. Open a management group or subscription and then open the **Access control (IAM)** page.

1. Select the **Roles** tab to see a list of all the built-in and custom roles.

1. In the **Type** filter, select **CustomRole** to just see your custom roles.

1. Select  the ellipsis (**...**) for the custom role you want to delete and then select **Delete**.

    :::image type="content" source="media/shared/custom-roles-delete-menu.png" alt-text="Screenshot of a list of custom roles that can be selected for deletion." lightbox="media/shared/custom-roles-delete-menu.png":::

## Next steps

- [Remove Azure role assignments](./role-assignments-remove.md)
- [Create or update Azure custom roles using the Azure portal](custom-roles-portal.md)
