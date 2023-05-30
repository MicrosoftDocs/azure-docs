---
author: rolyon
ms.service: resource-graph
ms.topic: include
ms.date: 05/30/2023
ms.author: rolyon
---

```kusto
AuthorizationResources
| where type =~ "microsoft.authorization/roleassignments"
| extend RoleDefinitionId = tolower(properties.roleDefinitionId)
| extend PrincipalId = tolower(properties.principalId)
| extend Scope = tolower(properties.scope)
| join kind = leftouter (
AuthorizationResources
| where type =~ "microsoft.authorization/roledefinitions"
| extend RoleId = tolower(id)
) on $left.RoleDefinitionId == $right.RoleId
| join kind = leftouter (
  AuthorizationResources
  | where type =~ "microsoft.authorization/roledefinitions"
  | extend RoleName = tostring(properties.roleName)
  | extend RoleId = tolower(id)
  | extend RoleType = tostring(properties.type)
  | where RoleType == "BuiltInRole"
  | extend RoleId_RoleName = pack(name, RoleName)
) on $left.RoleDefinitionId == $right.RoleId
| summarize count_ = count(), AllRD = make_set(RoleId_RoleName) by PrincipalId, Scope
| where count_ > 1
| order by count_ desc
```
