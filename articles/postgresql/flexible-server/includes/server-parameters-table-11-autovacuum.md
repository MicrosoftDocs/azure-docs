---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### autovacuum

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Controls whether the server should run the autovacuum subprocess.                                                       |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`            |
| Parameter type | dynamic        |
| Documentation  | [autovacuum](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)                          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_analyze_scale_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Specifies a fraction of the table size to add to autovacuum_vacuum_threshold when deciding whether to trigger a VACUUM. |
| Data type      | numeric   |
| Default value  | `0.1`         |
| Allowed values | `0-100`             |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_analyze_scale_factor](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_analyze_threshold

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Sets the minimum number of inserted, updated or deleted tuples needed to trigger an ANALYZE in any one table.           |
| Data type      | integer   |
| Default value  | `50`          |
| Allowed values | `0-2147483647`      |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_analyze_threshold](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_freeze_max_age

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Maximum age (in transactions) before triggering autovacuum on a table to prevent transaction ID wraparound.             |
| Data type      | integer   |
| Default value  | `200000000`   |
| Allowed values | `100000-2000000000` |
| Parameter type | static         |
| Documentation  | [autovacuum_freeze_max_age](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_max_workers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Sets the maximum number of simultaneously running autovacuum worker processes.                                          |
| Data type      | integer   |
| Default value  | `3`           |
| Allowed values | `1-262143`          |
| Parameter type | static         |
| Documentation  | [autovacuum_max_workers](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_multixact_freeze_max_age

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Maximum age (in multixact) before triggering autovacuum on a table to prevent multixact wraparound.                     |
| Data type      | integer   |
| Default value  | `400000000`   |
| Allowed values | `10000-2000000000`  |
| Parameter type | static         |
| Documentation  | [autovacuum_multixact_freeze_max_age](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_naptime

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Sets minimum delay between autovacuum runs on any given database.                                                       |
| Data type      | integer   |
| Default value  | `60`          |
| Allowed values | `1-2147483`         |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_naptime](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_vacuum_cost_delay

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Sets cost delay value (milliseconds) that will be used in automatic VACUUM operations.                                  |
| Data type      | integer   |
| Default value  | `20`          |
| Allowed values | `-1-100`            |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_vacuum_cost_delay](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_vacuum_cost_limit

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Sets cost limit value that will be used in automatic VACUUM operations.                                                 |
| Data type      | integer   |
| Default value  | `-1`          |
| Allowed values | `-1-10000`          |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_vacuum_cost_limit](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_vacuum_scale_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Specifies a fraction of the table size to add to autovacuum_vacuum_threshold when deciding whether to trigger a VACUUM. |
| Data type      | numeric   |
| Default value  | `0.2`         |
| Allowed values | `0-100`             |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_vacuum_scale_factor](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)      |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### autovacuum_vacuum_threshold

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Autovacuum |
| Description    | Specifies the minimum number of updated or deleted tuples needed to trigger a VACUUM in any one table.                  |
| Data type      | integer   |
| Default value  | `50`          |
| Allowed values | `0-2147483647`      |
| Parameter type | dynamic        |
| Documentation  | [autovacuum_vacuum_threshold](https://www.postgresql.org/docs/11/runtime-config-autovacuum.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



