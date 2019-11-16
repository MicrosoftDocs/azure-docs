---
author: orspod
ms.service: data-explorer
ms.topic: include
ms.date: 10/07/2019
ms.author: orspodek
---

## Clean up resources

To delete the data connection, use the following command:

```python
kusto_management_client.data_connections.delete(resource_group_name=resource_group_name, cluster_name=kusto_cluster_name, database_name=kusto_database_name, data_connection_name=kusto_data_connection_name)
```