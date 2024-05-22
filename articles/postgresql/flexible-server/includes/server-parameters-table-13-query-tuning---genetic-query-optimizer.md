---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### geqo

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | Enables genetic query optimization.                                |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [geqo](https://www.postgresql.org/docs/13/runtime-config-query.html)                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_effort

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | GEQO: effort is used to set the default for other GEQO parameters. |
| Data type      | integer   |
| Default value  | `5`           |
| Allowed values | `1-10`         |
| Parameter type | dynamic        |
| Documentation  | [geqo_effort](https://www.postgresql.org/docs/13/runtime-config-query.html)         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_generations

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | GEQO: number of iterations of the algorithm.                       |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [geqo_generations](https://www.postgresql.org/docs/13/runtime-config-query.html)    |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_pool_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | GEQO: number of individuals in the population.                     |
| Data type      | integer   |
| Default value  | `0`           |
| Allowed values | `0-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [geqo_pool_size](https://www.postgresql.org/docs/13/runtime-config-query.html)      |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_seed

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | GEQO: seed for random path selection.                              |
| Data type      | numeric   |
| Default value  | `0`           |
| Allowed values | `0-1`          |
| Parameter type | dynamic        |
| Documentation  | [geqo_seed](https://www.postgresql.org/docs/13/runtime-config-query.html)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_selection_bias

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | GEQO: selective pressure within the population.                    |
| Data type      | numeric   |
| Default value  | `2`           |
| Allowed values | `1.5-2`        |
| Parameter type | dynamic        |
| Documentation  | [geqo_selection_bias](https://www.postgresql.org/docs/13/runtime-config-query.html) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### geqo_threshold

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Genetic Query Optimizer |
| Description    | Sets the threshold of FROM items beyond which GEQO is used.        |
| Data type      | integer   |
| Default value  | `12`          |
| Allowed values | `2-2147483647` |
| Parameter type | dynamic        |
| Documentation  | [geqo_threshold](https://www.postgresql.org/docs/13/runtime-config-query.html)      |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



