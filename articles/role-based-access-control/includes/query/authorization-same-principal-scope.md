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
| where id startswith "/subscriptions"
| extend PrincipalId = tostring(properties.principalId) 
| extend Scope = tolower(properties.scope)
| extend RoleDefinitionId = tolower(tostring(properties.roleDefinitionId))
| join kind = leftouter (
  AuthorizationResources
  | where type =~ "microsoft.authorization/roledefinitions"
  | extend RoleName = tostring(properties.roleName)
  | extend RoleId = tolower(id)
  | extend RoleType = tostring(properties.type) 
  | where RoleType == "BuiltInRole"
  | extend RoleId_RoleName = pack(RoleId, RoleName)
) on $left.RoleDefinitionId == $right.RoleId
| summarize count_ = count(), AllRD = make_set(RoleId_RoleName) by PrincipalId, Scope
| where count_ > 1
| order by count_ desc
```
