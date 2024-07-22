---
author: dcurwin
ms.author: dacurwin
ms.service: defender-for-cloud
ms.topic: include
ms.date: 02/18/2024
---

```bash
resources 
| where type == "microsoft.security/securityconnectors" 
| extend source = tostring(properties.environmentName)  
| where source == "AWS" 
| project name, subscriptionId, resourceGroup, accountId = properties.hierarchyIdentifier, cloud = properties.environmentName  
```
