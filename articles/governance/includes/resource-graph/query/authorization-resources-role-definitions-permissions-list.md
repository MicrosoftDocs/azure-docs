---
ms.service: resource-graph
ms.topic: include
ms.date: 06/30/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get Role Definitions with permissions listed out

Displays a summary of the `Actions` and `notActions` for each unique role definition.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roledefinitions'
| extend assignableScopes = properties.assignableScopes
| extend permissionsList = properties.permissions
| extend isServiceRole = properties.isServiceRole
| mv-expand permissionsList
| extend Actions = permissionsList.Actions
| extend notActions = permissionsList.notActions
| extend DataActions = permissionsList.DataActions
| extend notDataActions = permissionsList.notDataActions
| summarize make_set(Actions), make_set(notActions), make_set(DataActions), make_set(notDataActions), any(assignableScopes, isServiceRole) by id
```
