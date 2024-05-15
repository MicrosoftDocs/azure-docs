---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### track_activities

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Collects information about executing commands for each session.          |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [track_activities](https://www.postgresql.org/docs/14/runtime-config-statistics.html)          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_activity_query_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Sets the amount of memory reserved for pg_stat_activity.query, in bytes. |
| Data type      | integer     |
| Default value  | `1024`        |
| Allowed values | `100-102400`   |
| Parameter type | static         |
| Documentation  | [track_activity_query_size](https://www.postgresql.org/docs/14/runtime-config-statistics.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_counts

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Enables collection of statistics on database activity                    |
| Data type      | boolean     |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [track_counts](https://www.postgresql.org/docs/14/runtime-config-statistics.html)              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_functions

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Enables tracking of function call counts and time used.                  |
| Data type      | enumeration |
| Default value  | `none`        |
| Allowed values | `none,pl,all`  |
| Parameter type | dynamic        |
| Documentation  | [track_functions](https://www.postgresql.org/docs/14/runtime-config-statistics.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_io_timing

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Enables timing of database I/O calls.                                    |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [track_io_timing](https://www.postgresql.org/docs/14/runtime-config-statistics.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### track_wal_io_timing

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Cumulative Query and Index Statistics |
| Description    | Collects timing statistics for WAL I/O activity.                         |
| Data type      | boolean     |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  |                                                                                                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



