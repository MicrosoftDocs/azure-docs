---
ms.service: resource-graph
ms.topic: include
ms.date: 06/30/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get role definitions with actions

Displays a sample of [role definitions](../../../../role-based-access-control/role-definitions.md) with an expanded list of actions and not actions for each role definition's permissions list.

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
| take 5
```
