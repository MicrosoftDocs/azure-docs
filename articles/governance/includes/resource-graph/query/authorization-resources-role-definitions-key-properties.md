---
ms.service: resource-graph
ms.topic: include
ms.date: 06/30/2023
author: davidsmatlak
ms.author: davidsmatlak
---

### Get role definitions with key properties

Provides a sample of [role definitions](../../../../role-based-access-control/role-definitions.md) and some of the resources relevant properties.

```kusto
authorizationresources
| where type =~ 'microsoft.authorization/roledefinitions'
| extend assignableScopes = properties.assignableScopes
| extend permissionsList = properties.permissions
| extend isServiceRole = properties.isServiceRole
| take 5
```
