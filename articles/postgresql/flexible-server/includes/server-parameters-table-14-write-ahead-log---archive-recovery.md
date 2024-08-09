---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### archive_cleanup_command

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archive Recovery |
| Description    | Sets the shell command that will be executed at every restart point.         |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  | [archive_cleanup_command](https://www.postgresql.org/docs/14/runtime-config-wal.html#GUC-ARCHIVE-CLEANUP-COMMAND) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### recovery_end_command

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archive Recovery |
| Description    | Sets the shell command that will be executed once at the end of recovery.    |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  | [recovery_end_command](https://www.postgresql.org/docs/14/runtime-config-wal.html#GUC-RECOVERY-END-COMMAND)       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### restore_command

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Archive Recovery |
| Description    | Sets the shell command that will be called to retrieve an archived WAL file. |
| Data type      | string    |
| Default value  |               |
| Allowed values |                |
| Parameter type | read-only      |
| Documentation  |                                                                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



