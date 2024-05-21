---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### cpu_index_tuple_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of processing each index entry during an index scan.             |
| Data type      | numeric   |
| Default value  | `0.005`       |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  | [cpu_index_tuple_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cpu_operator_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of processing each operator or function executed during a query. |
| Data type      | numeric   |
| Default value  | `0.0025`      |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  | [cpu_operator_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cpu_tuple_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of processing each row during a query.                           |
| Data type      | numeric   |
| Default value  | `0.01`        |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  | [cpu_tuple_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### effective_cache_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's assumption about the size of the disk cache.                                          |
| Data type      | integer   |
| Default value  | Depends on resources (vCores, RAM, or disk space) allocated to the server.      |
| Allowed values | `1-2147483647`   |
| Parameter type | dynamic        |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_above_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the query cost above which JIT compilation is activated, if enabled.                                |
| Data type      | integer   |
| Default value  | `100000`      |
| Allowed values | `-1-2147483647`  |
| Parameter type | dynamic        |
| Documentation  | [jit_above_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_inline_above_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the query cost above which JIT compilation attempts to inline functions and operators.              |
| Data type      | integer   |
| Default value  | `500000`      |
| Allowed values | `-1-2147483647`  |
| Parameter type | dynamic        |
| Documentation  | [jit_inline_above_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### jit_optimize_above_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the query cost above which JIT compilation applies expensive optimizations.                         |
| Data type      | integer   |
| Default value  | `500000`      |
| Allowed values | `-1-2147483647`  |
| Parameter type | dynamic        |
| Documentation  | [jit_optimize_above_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)      |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### min_parallel_index_scan_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the minimum amount of index data for a parallel scan.                                               |
| Data type      | integer   |
| Default value  | `64`          |
| Allowed values | `0-715827882`    |
| Parameter type | dynamic        |
| Documentation  | [min_parallel_index_scan_size](https://www.postgresql.org/docs/13/runtime-config-query.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### min_parallel_table_scan_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the minimum amount of table data that must be scanned for a parallel scan to be considered.         |
| Data type      | integer   |
| Default value  | `1024`        |
| Allowed values | `0-715827882`    |
| Parameter type | dynamic        |
| Documentation  | [min_parallel_table_scan_size](https://www.postgresql.org/docs/13/runtime-config-query.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### parallel_setup_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of starting up worker processes for parallel query.              |
| Data type      | numeric   |
| Default value  | `1000`        |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  | [parallel_setup_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### parallel_tuple_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of passing each tuple (row) from worker to master backend.       |
| Data type      | numeric   |
| Default value  | `0.1`         |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  | [parallel_tuple_cost](https://www.postgresql.org/docs/13/runtime-config-query.html)          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### random_page_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of a nonsequentially fetched disk page.                          |
| Data type      | numeric   |
| Default value  | `2`           |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### seq_page_cost

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Cost Constants |
| Description    | Sets the planner's estimate of the cost of a sequentially fetched disk page.                             |
| Data type      | numeric   |
| Default value  | `1`           |
| Allowed values | `0-1.79769e+308` |
| Parameter type | dynamic        |
| Documentation  |                                                                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



