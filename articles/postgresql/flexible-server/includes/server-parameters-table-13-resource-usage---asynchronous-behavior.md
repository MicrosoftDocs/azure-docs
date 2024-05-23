---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### backend_flush_after

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Number of pages after which previously performed writes are flushed to disk.                              |
| Data type      | integer   |
| Default value  | `256`         |
| Allowed values | `0-256`        |
| Parameter type | dynamic        |
| Documentation  | [backend_flush_after](https://www.postgresql.org/docs/13/runtime-config-resource.html)              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### effective_io_concurrency

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Sets the number of concurrent disk I/O operations that PostgreSQL expects can be executed simultaneously. |
| Data type      | integer   |
| Default value  | `1`           |
| Allowed values | `0-1000`       |
| Parameter type | dynamic        |
| Documentation  | [effective_io_concurrency](https://www.postgresql.org/docs/13/runtime-config-resource.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### maintenance_io_concurrency

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | A variant of effective_io_concurrency that is used for maintenance work.                                  |
| Data type      | integer   |
| Default value  | `10`          |
| Allowed values | `10`           |
| Parameter type | read-only      |
| Documentation  |                                                                                                     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_parallel_maintenance_workers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Sets the maximum number of parallel processes per maintenance operation.                                  |
| Data type      | integer   |
| Default value  | `2`           |
| Allowed values | `0-64`         |
| Parameter type | dynamic        |
| Documentation  | [max_parallel_maintenance_workers](https://www.postgresql.org/docs/13/runtime-config-resource.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_parallel_workers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Sets the maximum number of workers than can be supported for parallel operations.                         |
| Data type      | integer   |
| Default value  | `8`           |
| Allowed values | `0-1024`       |
| Parameter type | dynamic        |
| Documentation  | [max_parallel_workers](https://www.postgresql.org/docs/13/runtime-config-resource.html)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_parallel_workers_per_gather

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Sets the maximum number of parallel processes per executor node.                                          |
| Data type      | integer   |
| Default value  | `2`           |
| Allowed values | `0-1024`       |
| Parameter type | dynamic        |
| Documentation  | [max_parallel_workers_per_gather](https://www.postgresql.org/docs/13/runtime-config-resource.html)  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_worker_processes

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Sets the maximum number of background processes that the system can support.                              |
| Data type      | integer   |
| Default value  | `8`           |
| Allowed values | `0-262143`     |
| Parameter type | static         |
| Documentation  | [max_worker_processes](https://www.postgresql.org/docs/13/runtime-config-resource.html)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### parallel_leader_participation

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Asynchronous Behavior |
| Description    | Controls whether Gather and Gather Merge also run subplans.                                               |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  |                                                                                                     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



