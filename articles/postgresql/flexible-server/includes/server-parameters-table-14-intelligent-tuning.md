---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### intelligent_tuning

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Intelligent Tuning |
| Description    | Enables intelligent tuning                                      |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  | [intelligent_tuning](../concepts-intelligent-tuning.md)                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### intelligent_tuning.metric_targets

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Intelligent Tuning |
| Description    | Specifies which metrics will be adjusted by intelligent tuning. |
| Data type      | set       |
| Default value  | `none`        |
| Allowed values | `none,Storage-checkpoint_completion_target,Storage-min_wal_size,Storage-max_wal_size,Storage-bgwriter_delay,tuning-autovacuum,all` |
| Parameter type | dynamic        |
| Documentation  | [intelligent_tuning.metric_targets](../concepts-intelligent-tuning.md) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



