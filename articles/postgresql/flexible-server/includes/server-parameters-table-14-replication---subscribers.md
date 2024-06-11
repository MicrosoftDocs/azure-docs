---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### max_logical_replication_workers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Subscribers |
| Description    | Specifies maximum number of logical replication workers. This includes both apply workers and table synchronization workers. |
| Data type      | integer   |
| Default value  | `4`           |
| Allowed values | `0-262143`     |
| Parameter type | static         |
| Documentation  | [max_logical_replication_workers](https://www.postgresql.org/docs/14/runtime-config-replication.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_sync_workers_per_subscription

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Subscribers |
| Description    | Maximum number of table synchronization workers per subscription.                                                            |
| Data type      | integer   |
| Default value  | `2`           |
| Allowed values | `0-262143`     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



