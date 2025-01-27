---
author: rolyon
ms.service: resource-graph
ms.topic: include
ms.date: 05/30/2023
ms.author: rolyon
---

```kusto
authorizationresources
| where type =~ "microsoft.authorization/roleassignments"
| where id startswith "/subscriptions"
| extend RoleId = tolower(tostring(properties.roleDefinitionId))
| join kind = leftouter (
  authorizationresources
  | where type =~ "microsoft.authorization/roledefinitions"
  | extend RoleDefinitionName = tostring(properties.roleName)
  | extend RoleId = tolower(id)
  | project RoleDefinitionName, RoleId
) on $left.RoleId == $right.RoleId
| extend principalId = tostring(properties.principalId)
| extend principal_to_ra = pack(principalId, id)
| summarize count_ = count(), AllPrincipals = make_set(principal_to_ra) by RoleDefinitionId = RoleId, Scope = tolower(properties.scope), RoleDefinitionName
| where count_ > 1
| order by count_ desc
```
