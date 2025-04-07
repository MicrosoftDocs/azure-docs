---
ms.topic: include
ms.date: 03/24/2025
author: shsagir
ms.author: shsagir
ms.service: azure-synapse-analytics
ms.subservice: data-explorer
---
## Clean up resources

To delete the data connection, use the following command:

```csharp
kustoManagementClient.DataConnections.Delete(resourceGroupName, clusterName, databaseName, dataConnectionName);
```
