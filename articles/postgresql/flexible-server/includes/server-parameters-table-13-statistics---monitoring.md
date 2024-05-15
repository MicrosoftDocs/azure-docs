---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### log_executor_stats

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Monitoring |
| Description    | Writes executor performance statistics to the server log.                   |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  | [log_executor_stats](https://www.postgresql.org/docs/13/runtime-config-logging.html)  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_parser_stats

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Monitoring |
| Description    | Writes parser performance statistics to the server log.                     |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_planner_stats

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Monitoring |
| Description    | Writes planner performance statistics to the server log.                    |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `off`          |
| Parameter type | read-only      |
| Documentation  |                                                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### log_statement_stats

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Statistics / Monitoring |
| Description    | For each query, writes cumulative performance statistics to the server log. |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [log_statement_stats](https://www.postgresql.org/docs/13/runtime-config-logging.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



