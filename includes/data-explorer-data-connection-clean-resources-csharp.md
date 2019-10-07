---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 10/07/2019
ms.author: orspodek
---

## Clean up resources

To delete the data connection, use the following command:

```csharp
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```