---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### checkpoint_completion_target

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Specifies the target of checkpoint completion, as a fraction of total time between checkpoints.                |
| Data type      | numeric   |
| Default value  | `0.9`         |
| Allowed values | `0-1`          |
| Parameter type | dynamic        |
| Documentation  | [checkpoint_completion_target](https://www.postgresql.org/docs/14/runtime-config-wal.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### checkpoint_flush_after

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Number of pages after which previously performed writes are flushed to disk.                                   |
| Data type      | integer   |
| Default value  | `32`          |
| Allowed values | `32`           |
| Parameter type | read-only      |
| Documentation  |                                                                                            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### checkpoint_timeout

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Maximum time between automatic WAL checkpoints, in seconds. The valid range is between 30 seconds and one day. |
| Data type      | integer   |
| Default value  | `600`         |
| Allowed values | `30-86400`     |
| Parameter type | dynamic        |
| Documentation  | [checkpoint_timeout](https://www.postgresql.org/docs/14/runtime-config-wal.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### checkpoint_warning

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Writes a warning message if checkpoints caused by the filling of WAL segment more frequently than this.        |
| Data type      | integer   |
| Default value  | `30`          |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [checkpoint_warning](https://www.postgresql.org/docs/14/runtime-config-wal.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_wal_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Maximum size to let the WAL grow before triggering automatic checkpoint.                                       |
| Data type      | integer   |
| Default value  | Depends on resources (vCores, RAM, or disk space) allocated to the server.        |
| Allowed values | `32-65536`     |
| Parameter type | dynamic        |
| Documentation  | [max_wal_size](https://www.postgresql.org/docs/14/runtime-config-wal.html)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### min_wal_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Checkpoints |
| Description    | Sets the minimum size to shrink the WAL to.                                                                    |
| Data type      | integer   |
| Default value  | `80`          |
| Allowed values | `32-2097151`   |
| Parameter type | dynamic        |
| Documentation  | [min_wal_size](https://www.postgresql.org/docs/14/runtime-config-wal.html)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



