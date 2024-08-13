---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### recovery_prefetch

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery |
| Description    | Prefetch referenced blocks during recovery.               |
| Data type      | enumeration |
| Default value  | `try`         |
| Allowed values | `try`          |
| Parameter type | read-only      |
| Documentation  | [recovery_prefetch](https://www.postgresql.org/docs/15/runtime-config-wal.html#GUC-RECOVERY-PREFETCH)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### wal_decode_buffer_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Write-Ahead Log / Recovery |
| Description    | Buffer size for reading ahead in the WAL during recovery. |
| Data type      | integer     |
| Default value  | `524288`      |
| Allowed values | `524288`       |
| Parameter type | read-only      |
| Documentation  | [wal_decode_buffer_size](https://www.postgresql.org/docs/15/runtime-config-wal.html#GUC-WAL-DECODE-BUFFER-SIZE) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



