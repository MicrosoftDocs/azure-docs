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

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```
