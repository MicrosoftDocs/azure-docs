---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
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
| Documentation  | [dynamic_library_path](https://www.postgresql.org/docs/16/runtime-config-client.html#GUC-DYNAMIC-LIBRARY-PATH)     |


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
| Documentation  | [gin_fuzzy_search_limit](https://www.postgresql.org/docs/16/runtime-config-client.html#GUC-GIN-FUZZY-SEARCH-LIMIT) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



