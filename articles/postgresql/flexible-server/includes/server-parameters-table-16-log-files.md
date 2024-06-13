---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
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
| Documentation  |               |


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
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



