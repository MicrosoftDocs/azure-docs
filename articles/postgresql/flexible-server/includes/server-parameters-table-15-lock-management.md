---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### deadlock_timeout

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Lock Management |
| Description    | Sets the amount of time, in milliseconds, to wait on a lock before checking for deadlock.                                                                                        |
| Data type      | integer   |
| Default value  | `1000`        |
| Allowed values | `1-2147483647`           |
| Parameter type | dynamic        |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_locks_per_transaction

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Lock Management |
| Description    | Sets the maximum number of locks can be taken per transaction. When running a replica server, you must set this parameter to the same or higher value than on the master server. |
| Data type      | integer   |
| Default value  | `64`          |
| Allowed values | `10-8388608`             |
| Parameter type | static         |
| Documentation  | [max_locks_per_transaction](https://www.postgresql.org/docs/current/runtime-config-locks.html)   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_pred_locks_per_page

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Lock Management |
| Description    | Sets the maximum number of predicate-locked tuples per page.                                                                                                                     |
| Data type      | integer   |
| Default value  | `2`           |
| Allowed values | `0-2147483647`           |
| Parameter type | dynamic        |
| Documentation  | [max_pred_locks_per_page](https://www.postgresql.org/docs/current/runtime-config-locks.html)     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_pred_locks_per_relation

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Lock Management |
| Description    | Sets the maximum number of predicate-locked pages and tuples per relation.                                                                                                       |
| Data type      | integer   |
| Default value  | `-2`          |
| Allowed values | `-2147483648-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [max_pred_locks_per_relation](https://www.postgresql.org/docs/current/runtime-config-locks.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### max_pred_locks_per_transaction

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Lock Management |
| Description    | Sets the maximum number of predicate locks per transaction.                                                                                                                      |
| Data type      | integer   |
| Default value  | `64`          |
| Allowed values | `64`                     |
| Parameter type | read-only      |
| Documentation  |                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



