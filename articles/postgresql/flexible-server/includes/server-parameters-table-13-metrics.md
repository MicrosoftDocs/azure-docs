---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### metrics.autovacuum_diagnostics

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Metrics  |
| Description    | Enables metrics collection for all table statistics within a database |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [metrics.autovacuum_diagnostics](../concepts-monitoring.md)      |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### metrics.collector_database_activity

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Metrics  |
| Description    | Enables metrics collection for database and activity statistics       |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [metrics.collector_database_activity](../concepts-monitoring.md) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### metrics.pgbouncer_diagnostics

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Metrics  |
| Description    | Enables metrics collection for PgBouncer.                             |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [metrics.pgbouncer_diagnostics](../concepts-monitoring.md)       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



