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
| extend RoleId = tostring(split(tolower(properties.roleDefinitionId), "roledefinitions/", 1)[0])
| join kind = leftouter (
  AuthorizationResources
  | where type =~ "microsoft.authorization/roledefinitions"
  | extend RoleDefinitionName = tostring(properties.roleName)
  | extend rdId = tostring(split(tolower(id), "roledefinitions/", 1)[0])
  | project RoleDefinitionName, rdId
) on $left.RoleId == $right.rdId
| extend principalId = tostring(properties.principalId)
| extend principal_to_ra = pack(principalId, id)
| summarize count_ = count(), AllPrincipals = make_set(principal_to_ra) by RoleDefinitionId = tolower(properties.roleDefinitionId), Scope = tolower(properties.scope), RoleDefinitionName
| where count_ > 1
| order by count_ desc
```
