---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### temp_file_limit

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Resource Usage / Disk |
| Description    | Limits the total size of all temporary files used by each process. |
| Data type      | integer   |
| Default value  | `-1`          |
| Allowed values | `-1`           |
| Parameter type | read-only      |
| Documentation  | [temp_file_limit](https://www.postgresql.org/docs/16/runtime-config-resource.html#GUC-TEMP-FILE-LIMIT) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



