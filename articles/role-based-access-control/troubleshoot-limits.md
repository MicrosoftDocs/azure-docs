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

- [Reader](./built-in-roles.md#reader) to run Azure Resource Graph queries.
- [User Access Administrator](./built-in-roles.md#user-access-administrator) or [Owner](./built-in-roles.md#owner) role to add role assignments, remove role assignments, or delete custom roles.
- [Groups Administrator](../active-directory/roles/permissions-reference.md#groups-administrator), [User Administrator](../active-directory/roles/permissions-reference.md#user-administrator), [Privileged Role Administrator](../active-directory/roles/permissions-reference.md#privileged-role-administrator) to create groups.

##  Symptom - No more role assignments can be created

When you try to assign a role, you get the following error message:

`No more role assignments can be created (code: RoleAssignmentLimitExceeded)`

**Cause**

Azure supports up to **4000** role assignments per subscription. This limit includes role assignments at the subscription, resource group, and resource scopes, but not at the management group scope. You should try to reduce the number of role assignments in the subscription.

To get the number of role assignments, you can view the [chart on the Access control (IAM) page](role-assignments-list-portal.md#list-number-of-role-assignments) in the Azure portal. You can also use the following Azure PowerShell commands:

```azurepowershell
$scope = "/subscriptions/<subscriptionId>"
$ras = Get-AzRoleAssignment -Scope $scope | Where-Object {$_.scope.StartsWith($scope)}
$ras.Count
```

**Solution 1 - Replace user role assignments with a group**

To reduce the number of role assignments in the subscription, add users to groups and assign roles to the groups instead. Follow these steps to identify where multiple role assignments for users can be replaced with a single role assignment for a group.

1. Sign in to the Azure portal and open the Azure Resource Graph Explorer.

1. Run the following query to get role assignments that assign the same role at the same scope, but for different principals. 

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
    | order by count_ desc
    ```

    The following shows an example of the output. The results are ordered by the number of principals.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-group.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments at the same scope, but for different principals." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-group.png":::

1. For a row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-group-details.png" alt-text="Screenshot of Details pane that shows role assignments at the same scope, but for different principals." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-group-details.png":::

1. Under **AllPrincipals**, get the list of the principal IDs with the same role assignment.

1. If necessary, get the principal name from the principal ID.

    # [Portal](#tab/portal)
    
    See [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md)
    
    # [PowerShell](#tab/powershell)
    
    See [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main)
    
    # [Azure CLI](#tab/cli)
    
    See [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show)

    ---

1. Create an Azure AD group and add the principals to the group.

1. Replace the principal role assignments with a single role assignment for the group.

**Solution 2 - Replace role assignments at a higher scope**

To reduce the number of role assignments in the subscription, make common role assignments at a higher scope. Follow these steps to identify where multiple role assignments can be replaced with a single role assignment at a higher scope.

1. Sign in to the Azure portal and open the Azure Resource Graph Explorer.

1. Run the following query to get role assignments for the same principal and role, but at different scopes.

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

    The following shows an example of the output. The results are ordered by the number of scopes.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows role assignments for the same principal and role, but at different scopes." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope.png":::

1. For a row, select **See details** to open the **Details** pane.

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope-details.png" alt-text="Screenshot of Details pane that shows role assignments for the same principal and role, but at different scopes." lightbox="media/troubleshoot-resource-graph/resource-graph-role-assignments-scope-details.png":::

1. Under **Scopes**, get the list of the scopes for the same principal and role.

1. If necessary, get the principal name from the principal ID.

    
    - For Azure portal, see [Add or update a user's profile information and settings](../active-directory/fundamentals/how-to-manage-user-profile-info.md).
    - For PowerShell, see [Get-MgUser](/powershell/module/microsoft.graph.users/get-mguser?branch=main).
    - For Azure, CLI, see [az ad user show](/cli/azure/ad/user?branch=main#az-ad-user-show).

1. Replace the multiple role assignments with a single role assignment at the highest scope.

**Solution 3 - Combine multiple built-in roles with a custom role**

To reduce the number of role assignments in the subscription, combine multiple built-in roles with a custom role and assigning the custom role instead.

**Solution 4 - Make role assignments eligible**

To reduce the number of role assignments in the subscription and you have Azure AD Premium P2, make role assignments eligible in [Azure AD Privileged Identity Management](../active-directory/privileged-identity-management/pim-configure.md) instead of permanently assigned.

**Solution 5 - Add an additional subscription**

Add an additional subscription.

##  Symptom - No more role assignments can be created at management group scope

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

**Cause**

Azure supports up to **5000** custom roles in a directory. (For Azure China 21Vianet, the limit is 2000 custom roles.)

**Solution**

Follow these steps to find and delete unused Azure custom roles.

1. Sign in to the Azure portal and open the Azure Resource Graph Explorer.

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

    The following shows an example of the output:

    :::image type="content" source="media/troubleshoot-resource-graph/resource-graph-custom-roles-unused.png" alt-text="Screenshot of Azure Resource Graph Explorer that shows custom roles without role assignments." lightbox="media/troubleshoot-resource-graph/resource-graph-custom-roles-unused.png":::

1. Open your list of custom roles and delete the custom roles you no longer need.

    :::image type="content" source="media/shared/custom-roles-delete-menu.png" alt-text="Screenshot of a list of custom roles that can be selected for deletion." lightbox="media/shared/custom-roles-delete-menu.png":::

## Next steps

- [Remove Azure role assignments](./role-assignments-remove.md)
- [Create or update Azure custom roles using the Azure portal](custom-roles-portal.md)
