---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### logfiles.download_enable

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Log Files |
| Description    | Enables or disables server logs functionality.                                                   |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [logfiles.download_enable](https://go.microsoft.com/fwlink/?linkid=2274270) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### logfiles.retention_days

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Log Files |
| Description    | Sets the retention period window in days for server logs - after this time data will be deleted. |
| Data type      | integer   |
| Default value  | `3`           |
| Allowed values | `1-7`          |
| Parameter type | dynamic        |
| Documentation  | [logfiles.retention_days](https://go.microsoft.com/fwlink/?linkid=2274270)  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



