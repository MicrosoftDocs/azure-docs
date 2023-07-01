---
ms.service: resource-graph
ms.topic: include
ms.date: 06/30/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get Role Assignments with key properties

Provides a sample of [role assignments](../../../../role-based-access-control/role-assignments.md) and some of the resources relevant properties.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roleassignments'
| extend roleDefinitionId = properties.roleDefinitionId
| extend principalType = properties.principalType
| extend principalId = properties.principalId
| extend scope = properties.scope
| take 5
```
