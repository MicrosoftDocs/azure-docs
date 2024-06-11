---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### synchronous_standby_names

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Primary Server |
| Description    | Number of synchronous standbys and list of names of potential synchronous ones.                               |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |                                                                                                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### vacuum_defer_cleanup_age

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Replication / Primary Server |
| Description    | Specifies the number of transactions by which VACUUM and HOT updates will defer cleanup of dead row versions. |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0-1000000`    |
| Parameter type | dynamic        |
| Documentation  | [vacuum_defer_cleanup_age](https://www.postgresql.org/docs/14/runtime-config-replication.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



