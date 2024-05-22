---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### dynamic_library_path

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Other Defaults |
| Description    | Sets the path for dynamically loadable modules.          |
| Data type      | string    |
| Default value  | `$libdir`     |
| Allowed values | `$libdir`      |
| Parameter type | read-only      |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### gin_fuzzy_search_limit

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Client Connection Defaults / Other Defaults |
| Description    | Sets the maximum allowed result for exact search by GIN. |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  |               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



