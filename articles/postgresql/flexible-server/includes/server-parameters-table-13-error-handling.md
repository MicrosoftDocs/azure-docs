---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### data_sync_retry

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Error Handling |
| Description    | Whether to continue running after a failure to sync data files. |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  |                                                                                        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### exit_on_error

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Error Handling |
| Description    | Terminates session on any error.                                |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [exit_on_error](https://www.postgresql.org/docs/13/runtime-config-error-handling.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### restart_after_crash

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Error Handling |
| Description    | Reinitialize server after backend crash.                        |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  |                                                                                        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



