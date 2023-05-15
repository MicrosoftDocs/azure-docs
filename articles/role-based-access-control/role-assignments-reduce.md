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


## Reduce the number of Azure role assignments

Azure supports up to 4000 role assignments per subscription. If you get the error message: `No more role assignments can be created (code: RoleAssignmentLimitExceeded)`, you can use these steps to reduce the number of role assignments.

### Assign roles to groups instead of users

Follow these steps to identify where multiple role assignments for users can be replaced with a single role assignment for a group.

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

### Assign roles at a higher scope

Follow these steps to identify where multiple role assignments can be replaced with a single role assignment at a higher scope.

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

## Delete unused Azure custom roles

Azure supports up to 5000 custom roles in a directory. If you get the error message: `Role definition limit exceeded. No more role definitions can be created (code: RoleDefinitionLimitExceeded)`, you can use these steps to find and delete unused custom roles.

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

## Next steps

- 