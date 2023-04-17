---
title: Reference – Azure Cosmos DB for PostgreSQL
description: Overview of the Azure Cosmos DB for PostgreSQL distributed SQL API
ms.author: jonels
author: jonels-msft
ms.service: cosmos-db
ms.subservice: postgresql
ms.topic: reference
ms.date: 08/02/2022
---

# Azure Cosmos DB for PostgreSQL distributed SQL API

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

Azure Cosmos DB for PostgreSQL includes features beyond
standard PostgreSQL. Below is a categorized reference of functions and
configuration options for:

* Parallelizing query execution across shards
* Managing sharded data between multiple servers
* Compressing data with columnar storage
* Automating timeseries partitioning

## SQL functions

### Sharding

| Name | Description |
|------|-------------|
| [alter_distributed_table](reference-functions.md#alter_distributed_table) | Change the distribution column, shard count or colocation properties of a distributed table |
| [citus_copy_shard_placement](reference-functions.md#master_copy_shard_placement) | Repair an inactive shard placement using data from a healthy placement |
| [create_distributed_table](reference-functions.md#create_distributed_table) | Turn a PostgreSQL table into a distributed (sharded) table |
| [create_reference_table](reference-functions.md#create_reference_table) | Maintain full copies of a table in sync across all nodes |
| [isolate_tenant_to_new_shard](reference-functions.md#isolate_tenant_to_new_shard) | Create a new shard to hold rows with a specific single value in the distribution column |
| [truncate_local_data_after_distributing_table](reference-functions.md#truncate_local_data_after_distributing_table) | Truncate all local rows after distributing a table |
| [undistribute_table](reference-functions.md#undistribute_table) | Undo the action of create_distributed_table or create_reference_table |

### Shard rebalancing

| Name | Description |
|------|-------------|
| [citus_add_rebalance_strategy](reference-functions.md#citus_add_rebalance_strategy) | Append a row to `pg_dist_rebalance_strategy` |
| [citus_move_shard_placement](reference-functions.md#master_move_shard_placement) | Typically used indirectly during shard rebalancing rather than being called directly by a database administrator |
| [citus_set_default_rebalance_strategy](reference-functions.md#) | Change the strategy named by its argument to be the default chosen when rebalancing shards |
| [get_rebalance_progress](reference-functions.md#get_rebalance_progress) | Monitor the moves planned and executed by `rebalance_table_shards` |
| [get_rebalance_table_shards_plan](reference-functions.md#get_rebalance_table_shards_plan) | Output the planned shard movements of rebalance_table_shards without performing them |
| [rebalance_table_shards](reference-functions.md#rebalance_table_shards) | Move shards of the given table to distribute them evenly among the workers |

### Colocation

| Name | Description |
|------|-------------|
| [create_distributed_function](reference-functions.md#create_distributed_function) | Make function run on workers near colocated shards |
| [update_distributed_table_colocation](reference-functions.md#update_distributed_table_colocation) | Update or break colocation of a distributed table |

### Columnar storage

| Name | Description |
|------|-------------|
| [alter_columnar_table_set](reference-functions.md#alter_columnar_table_set) | Change settings on a columnar table |
| [alter_table_set_access_method](reference-functions.md#alter_table_set_access_method) | Convert a table between heap or columnar storage |

### Timeseries partitioning

| Name | Description |
|------|-------------|
| [alter_old_partitions_set_access_method](reference-functions.md#alter_old_partitions_set_access_method) | Change storage method of partitions |
| [create_time_partitions](reference-functions.md#create_time_partitions) | Create partitions of a given interval to cover a given range of time |
| [drop_old_time_partitions](reference-functions.md#drop_old_time_partitions) | Remove all partitions whose intervals fall before a given timestamp |

### Informational

| Name | Description |
|------|-------------|
| [citus_get_active_worker_nodes](reference-functions.md#citus_get_active_worker_nodes) | Get active worker host names and port numbers |
| [citus_relation_size](reference-functions.md#citus_relation_size) | Get disk space used by all the shards of the specified distributed table |
| [citus_remote_connection_stats](reference-functions.md#citus_remote_connection_stats) | Show the number of active connections to each remote node |
| [citus_stat_statements_reset](reference-functions.md#citus_stat_statements_reset) | Remove all rows from `citus_stat_statements` |
| [citus_table_size](reference-functions.md#citus_table_size) | Get disk space used by all the shards of the specified distributed table, excluding indexes |
| [citus_total_relation_size](reference-functions.md#citus_total_relation_size) | Get total disk space used by the all the shards of the specified distributed table, including all indexes and TOAST data |
| [column_to_column_name](reference-functions.md#column_to_column_name) | Translate the `partkey` column of `pg_dist_partition` into a textual column name |
| [get_shard_id_for_distribution_column](reference-functions.md#get_shard_id_for_distribution_column) | Find the shard ID associated with a value of the distribution column |

## Server parameters

### Query execution

| Name | Description |
|------|-------------|
| [citus.all_modifications_commutative](reference-parameters.md#citusall_modifications_commutative) | Allow all commands to claim a shared lock |
| [citus.count_distinct_error_rate](reference-parameters.md#cituscount_distinct_error_rate-floating-point) | Tune error rate of postgresql-hll approximate counting |
| [citus.enable_repartition_joins](reference-parameters.md#citusenable_repartition_joins-boolean) | Allow JOINs made on non-distribution columns |
| [citus.enable_repartitioned_insert_select](reference-parameters.md#citusenable_repartition_joins-boolean) | Allow repartitioning rows from the SELECT statement and transferring them between workers for insertion |
| [citus.limit_clause_row_fetch_count](reference-parameters.md#cituslimit_clause_row_fetch_count-integer) | The number of rows to fetch per task for limit clause optimization |
| [citus.local_table_join_policy](reference-parameters.md#cituslocal_table_join_policy-enum) | Where data moves when doing a join between local and distributed tables |
| [citus.multi_shard_commit_protocol](reference-parameters.md#citusmulti_shard_commit_protocol-enum) | The commit protocol to use when performing COPY on a hash distributed table |
| [citus.propagate_set_commands](reference-parameters.md#cituspropagate_set_commands-enum) | Which SET commands are propagated from the coordinator to workers |
| [citus.create_object_propagation](reference-parameters.md#cituscreate_object_propagation-enum) | Behavior of CREATE statements in transactions for supported objects |
| [citus.use_citus_managed_tables](reference-parameters.md#citususe_citus_managed_tables-boolean) | Allow local tables to be accessed in worker node queries |

### Informational

| Name | Description |
|------|-------------|
| [citus.explain_all_tasks](reference-parameters.md#citusexplain_all_tasks-boolean) | Make EXPLAIN output show all tasks |
| [citus.explain_analyze_sort_method](reference-parameters.md#citusexplain_analyze_sort_method-enum) | Sort method of the tasks in the output of EXPLAIN ANALYZE |
| [citus.log_remote_commands](reference-parameters.md#cituslog_remote_commands-boolean) | Log queries the coordinator sends to worker nodes |
| [citus.multi_task_query_log_level](reference-parameters.md#citusmulti_task_query_log_level-enum-multi_task_logging) | Log-level for any query that generates more than one task |
| [citus.stat_statements_max](reference-parameters.md#citusstat_statements_max-integer) | Max number of rows to store in `citus_stat_statements` |
| [citus.stat_statements_purge_interval](reference-parameters.md#citusstat_statements_purge_interval-integer) | Frequency at which the maintenance daemon removes records from `citus_stat_statements` that are unmatched in `pg_stat_statements` |
| [citus.stat_statements_track](reference-parameters.md#citusstat_statements_track-enum) | Enable/disable statement tracking |
| [citus.show_shards_for_app_name_prefixes](reference-parameters.md#citusshow_shards_for_app_name_prefixes-text) | Allows shards to be displayed for selected clients that want to see them |
| [citus.override_table_visibility](reference-parameters.md#citusoverride_table_visibility-boolean) | Enable/disable shard hiding |

### Inter-node connection management

| Name | Description |
|------|-------------|
| [citus.executor_slow_start_interval](reference-parameters.md#citusexecutor_slow_start_interval-integer) | Time to wait in milliseconds between opening connections to the same worker node |
| [citus.force_max_query_parallelization](reference-parameters.md#citusforce_max_query_parallelization-boolean) | Open as many connections as possible |
| [citus.max_adaptive_executor_pool_size](reference-parameters.md#citusmax_adaptive_executor_pool_size-integer) | Max worker connections per session |
| [citus.max_cached_conns_per_worker](reference-parameters.md#citusmax_cached_conns_per_worker-integer) | Number of connections kept open to speed up subsequent commands |
| [citus.node_connection_timeout](reference-parameters.md#citusnode_connection_timeout-integer) | Max duration (in milliseconds) to wait for connection establishment |

### Data transfer

| Name | Description |
|------|-------------|
| [citus.enable_binary_protocol](reference-parameters.md#citusenable_binary_protocol-boolean) | Use PostgreSQL’s binary serialization format (when applicable) to transfer data with workers |
| [citus.max_intermediate_result_size](reference-parameters.md#citusmax_intermediate_result_size-integer) | Size in KB of intermediate results for CTEs and subqueries that are unable to be pushed down |

### Deadlock

| Name | Description |
|------|-------------|
| [citus.distributed_deadlock_detection_factor](reference-parameters.md#citusdistributed_deadlock_detection_factor-floating-point) | Time to wait before checking for distributed deadlocks |
| [citus.log_distributed_deadlock_detection](reference-parameters.md#cituslog_distributed_deadlock_detection-boolean) | Whether to log distributed deadlock detection-related processing in the server log |

## System tables

The coordinator node contains metadata tables and views to
help you see data properties and query activity across the cluster.

| Name | Description |
|------|-------------|
| [citus_dist_stat_activity](reference-metadata.md#distributed-query-activity) | Distributed queries that are executing on all nodes |
| [citus_lock_waits](reference-metadata.md#distributed-query-activity) | Queries blocked throughout the cluster |
| [citus_shards](reference-metadata.md#shard-information-view) | The location of each shard, the type of table it belongs to, and its size |
| [citus_stat_statements](reference-metadata.md#query-statistics-table) | Stats about how queries are being executed, and for whom |
| [citus_tables](reference-metadata.md#distributed-tables-view) | A summary of all distributed and reference tables |
| [citus_worker_stat_activity](reference-metadata.md#distributed-query-activity) | Queries on workers, including tasks on individual shards |
| [pg_dist_colocation](reference-metadata.md#colocation-group-table) | Which tables' shards should be placed together |
| [pg_dist_node](reference-metadata.md#worker-node-table) | Information about worker nodes in the cluster |
| [pg_dist_object](reference-metadata.md#distributed-object-table) | Objects such as types and functions that have been created on the coordinator node and propagated to worker nodes |
| [pg_dist_placement](reference-metadata.md#shard-placement-table) | The location of shard replicas on worker nodes |
| [pg_dist_rebalance_strategy](reference-metadata.md#rebalancer-strategy-table) | Strategies that `rebalance_table_shards` can use to determine where to move shards |
| [pg_dist_shard](reference-metadata.md#shard-table) | The table, distribution column, and value ranges for every shard |
| [time_partitions](reference-metadata.md#time-partitions-view) | Information about each partition managed by such functions as `create_time_partitions` and `drop_old_time_partitions` |


## Next steps

* Learn some [useful diagnostic queries](howto-useful-diagnostic-queries.md)
* Review the list of [configuration
  parameters](reference-parameters.md#postgresql-parameters) in the underlying
  PostgreSQL database.
