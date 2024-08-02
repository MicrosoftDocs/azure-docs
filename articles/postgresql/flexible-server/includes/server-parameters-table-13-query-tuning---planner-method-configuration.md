---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 06/18/2024
ms.service: azure-database-postgresql
ms.subservice: flexible-server
ms.topic: include
---
### enable_bitmapscan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of bitmap-scan plans.                                                                                                                                             |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_bitmapscan](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-BITMAPSCAN)                           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_gathermerge

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of gather merge plans.                                                                                                                                            |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_gathermerge](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-GATHERMERGE)                         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_hashagg

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of hashed aggregation plans.                                                                                                                                      |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_hashagg](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-HASHAGG)                                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_hashjoin

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of hash join plans.                                                                                                                                               |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_hashjoin](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-HASHJOIN)                               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_incremental_sort

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of incremental sort steps.                                                                                                                                        |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  | [enable_incremental_sort](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-INCREMENTAL-SORT)               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_indexonlyscan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of index-only-scan plans.                                                                                                                                         |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_indexonlyscan](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-INDEXONLYSCAN)                     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_indexscan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of index-scan plans.                                                                                                                                              |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_indexscan](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-INDEXSCAN)                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_material

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of materialization.                                                                                                                                               |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_material](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-MATERIAL)                               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_mergejoin

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of merge join plans.                                                                                                                                              |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_mergejoin](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-MERGEJOIN)                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_nestloop

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of nested loop join plans.                                                                                                                                        |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_nestloop](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-NESTLOOP)                               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_parallel_append

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of parallel append plans.                                                                                                                                         |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  | [enable_parallel_append](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-PARALLEL-APPEND)                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_parallel_hash

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of parallel hash plans.                                                                                                                                           |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  | [enable_parallel_hash](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-PARALLEL-HASH)                     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_partition_pruning

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables plan-time and run-time partition pruning.                                                                                                                                           |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on`           |
| Parameter type | read-only      |
| Documentation  | [enable_partition_pruning](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-PARTITION-PRUNING)             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_partitionwise_aggregate

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables or disables the query planner's use of partitionwise grouping or aggregation, which allows grouping or aggregation on a partitioned tables performed separately for each partition. |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_partitionwise_aggregate](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-PARTITIONWISE-AGGREGATE) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_partitionwise_join

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables or disables the query planner's use of partitionwise join, which allows a join between partitioned tables to be performed by joining the matching partitions.                       |
| Data type      | boolean   |
| Default value  | `off`         |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_partitionwise_join](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-PARTITIONWISE-JOIN)           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_seqscan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of sequential-scan plans.                                                                                                                                         |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_seqscan](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-SEQSCAN)                                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_sort

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of explicit sort steps.                                                                                                                                           |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_sort](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-SORT)                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### enable_tidscan

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Query Tuning / Planner Method Configuration |
| Description    | Enables the planner's use of TID scan plans.                                                                                                                                                |
| Data type      | boolean   |
| Default value  | `on`          |
| Allowed values | `on,off`       |
| Parameter type | dynamic        |
| Documentation  | [enable_tidscan](https://www.postgresql.org/docs/13/runtime-config-query.html#GUC-ENABLE-TIDSCAN)                                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



