---
author: rolyon
ms.service: resource-graph
ms.topic: include
ms.date: 05/30/2023
ms.author: rolyon
---

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
| project RoleDefinitionId = rdId, RoleDefinitionName = tostring(properties.roleName), Scope
```
