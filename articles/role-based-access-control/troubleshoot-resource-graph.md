---
title: Reduce the number of Azure role assignments and Azure custom roles - Azure RBAC
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

# Reduce the number of Azure role assignments and Azure custom roles


## Prerequisites

To follow these steps, you must have:

- [Owner](./built-in-roles.md#owner) or [User Access Administrator](./built-in-roles.md#user-access-administrator) role

## Reduce the number of Azure role assignments

Azure supports up to 4000 role assignments per subscription. If you get the error message: `No more role assignments can be created (code: RoleAssignmentLimitExceeded)`, you can use these steps to reduce the number of role assignments.

### Replace user role assignments with a group

Follow these steps to identify where multiple role assignments for users can be replaced with a single role assignment for a group.

1. Sign in to the Azure portal and open the Azure Resource Graph Explorer.

1. Run the following query to get role assignments that assign the same role at the same scope, but to different principals. 

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

1. For a row, select **See details** to open the **Details** pane.

1. Under **AllPrincipals**, get the list of the principal IDs with the same role assignment.

1. Create an Azure AD group and add the principals to the group.

1. Replace the principal role assignments with a single role assignment for the group.

### Replace role assignments at a higher scope

Follow these steps to identify where multiple role assignments can be replaced with a single role assignment at a higher scope.

1. Sign in to the Azure portal and open the Azure Resource Graph Explorer.

1. Run the following query to get role assignments that assign the same principal and role at different scopes.

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

1. For a row, select **See details** to open the **Details** pane.

1. Under **Scopes**, get the list of the scopes for the same principal and role.

1. Replace the multiple role assignments with a single role assignment at the highest scope.

## Find and delete unused Azure custom roles

Azure supports up to 5000 custom roles in a directory. If you get the error message: `Role definition limit exceeded. No more role definitions can be created (code: RoleDefinitionLimitExceeded)`, you can use these steps to find and delete unused custom roles.

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
