---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### max_files_per_process

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Kernel Resources |
| Description    | Sets the maximum number of simultaneously open files for each server process. |
| Data type      | integer   |
| Default value  | `1000`        |
| Allowed values | `1000`         |
| Parameter type | read-only      |
| Documentation  | [max_files_per_process](https://www.postgresql.org/docs/12/runtime-config-resource.html#GUC-MAX-FILES-PER-PROCESS) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



