---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
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
| Documentation  |               |


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
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



