---
title: Reference – Hyperscale (Citus) - Azure Database for PostgreSQL
description: Overview of the Hyperscale (Citus) SQL API
author: jonels-msft
ms.author: jonels
ms.service: postgresql
ms.subservice: hyperscale-citus
ms.topic: reference
ms.date: 02/11/2022
---

# The Hyperscale (Citus) SQL API

Foo bar baz

## SQL Functions

### Sharding

| Name | Description |
|------|-------------|
| alter_distributed_table | change the distribution column, shard count or colocation properties of a distributed table |
| [citus_copy_shard_placement](reference-functions.md#master_copy_shard_placement) | repair an inactive shard placement using data from a healthy placement |
| [create_distributed_table](reference-functions.md#create_distributed_table) | turn a PostgreSQL table into a distributed (sharded) table |
| [create_reference_table](reference-functions.md#create_reference_table) | maintain full copies of a table in sync across all nodes |
| [isolate_tenant_to_new_shard](reference-functions.md#isolate_tenant_to_new_shard) | create a new shard to hold rows with a specific single value in the distribution column |
| remove_local_tables_from_metadata | remove local tables from distribution metadata that no longer need to be there |
| [replicate_table_shards](reference-functions.md#replicate_table_shards) | replicate the under-replicated shards of a given table |
| truncate_local_data_after_distributing_table | truncate all local rows after distributing a table |
| undistribute_table | undo the action of create_distributed_table or create_reference_table |
| [upgrade_to_reference_table](reference-functions.md#upgrade_to_reference_table) | turn an existing distributed table with a shard count of one into a reference table |

### Shard rebalancing

| Name | Description |
|------|-------------|
| [citus_add_rebalance_strategy](reference_functions.md@citus_add_rebalance_strategy) | append a row to `pg_dist_rebalance_strategy` |
| [citus_move_shard_placement](reference-functions.md#master_move_shard_placement) | typically used indirectly during shard rebalancing rather than being called directly by a database administrator |
| [citus_set_default_rebalance_strategy](reference-functions.md#) | change the strategy named by its argument to be the default chosen when rebalancing shards |
| [get_rebalance_progress](reference-functions.md#get_rebalance_progress) | monitor the moves planned and executed by `rebalance_table_shards` |
| [get_rebalance_table_shards_plan](reference-functions.md#get_rebalance_table_shards_plan) | output the planned shard movements of rebalance_table_shards without performing them |
| [rebalance_table_shards](reference-functions.md#rebalance_table_shards) | move shards of the given table to make them evenly distributed among the workers |

### Colocation

| Name | Description |
|------|-------------|
| [create_distributed_function](reference-functions.md#create_distributed_function) | make function run on workers near colocated shards |
| [mark_tables_colocated](reference-functions.md#mark_tables_colocated) | put targets into the same colocation group as the source |
| [update_distributed_table_colocation](reference-functions.md#update_distributed_table_colocation) | update or break colocation of a distributed table |

### Columnar storage

| Name | Description |
|------|-------------|
| [alter_columnar_table_set](reference-functions.md#alter_columnar_table_set) | change settings on a columnar table |
| alter_table_set_access_method | convert a table between heap or columnar storage |

### Partitioning

| Name | Description |
|------|-------------|
| alter_old_partitions_set_access_method | change storage method of partitions |
| create_time_partitions | create partitions of a given interval to cover a given range of time |
| drop_old_time_partitions | remove all partitions whose intervals fall before a given timestamp |

### Informational

| Name | Description |
|------|-------------|
| citus_get_active_worker_nodes | get active worker host names and port numbers |
| [citus_relation_size](reference-functions.md#citus_relation_size) | get disk space used by all the shards of the specified distributed table |
| [citus_remote_connection_stats](reference-functions.md#citus_remote_connection_stats) | show the number of active connections to each remote node |
| [citus_stat_statements_reset](reference-functions.md#citus_stat_statements_reset) | remove all rows from `citus_stat_statements` |
| [citus_table_size](reference-functions.md#citus_table_size) | get disk space used by all the shards of the specified distributed table, excluding indexes |
| [citus_total_relation_size](reference-functions.md#citus_total_relation_size) | get total disk space used by the all the shards of the specified distributed table, including all indexes and TOAST data |
| [column_to_column_name](reference-functions.md#column_to_column_name) | translate the `partkey` column of `pg_dist_partition` into a textual column name |
| [get_shard_id_for_distribution_column](reference-functions.md#get_shard_id_for_distribution_column) | find the shard id associated with a value of the distribution column |
| [master_get_table_metadata](reference-functions.md#master_get_table_metadata) | return distribution-related metadata for a distributed table |

## Server parameters

### Query execution

| Name | Description |
|------|-------------|
| [citus.all_modifications_commutative](reference-parameters.md#citusall_modifications_commutative) | allow all commands to claim a shared lock |
| [citus.count_distinct_error_rate](reference-parameters.md#cituscount_distinct_error_rate-floating-point) | tune error rate of postgresql-hll approximate counting |
| [citus.enable_ddl_propagation](reference-parameters.md#citusenable_ddl_propagation-boolean) | whether to automatically propagate DDL changes from the coordinator to all workers |
| citus.enable_local_reference_table_foreign_keys | allow foreign keys to be created between reference and local tables |
| [citus.enable_repartition_joins](reference-parameters.md#citusenable_repartition_joins-boolean) | allow JOINs made on non-distribution columns |
| citus.enable_repartitioned_insert_select | allow repartitioning rows from the SELECT statement and transfering them between workers for insertion |
| [citus.limit_clause_row_fetch_count](reference-parameters.md#cituslimit_clause_row_fetch_count-integer) | the number of rows to fetch per task for limit clause optimization |
| citus.local_table_join_policy | where data moves when doing a join between local and distributed tables |
| [citus.multi_shard_commit_protocol](reference-parameters.md#citusmulti_shard_commit_protocol-enum) | the commit protocol to use when performing COPY on a hash distributed table |
| citus.propagate_set_commands | which SET commands are propagated from the coordinator to workers |

### Debugging

| Name | Description |
|------|-------------|
| [citus.explain_all_tasks](reference-parameters.md#citusexplain_all_tasks-boolean) | make EXPLAIN output show all tasks |
| citus.explain_analyze_sort_method | sort method of the tasks in the output of EXPLAIN ANALYZE |
| [citus.multi_task_query_log_level](reference-parameters.md#citusmulti_task_query_log_level-enum-multi_task_logging) | log-level for any query that generates more than one task |
| citus.stat_statements_max | max number of rows to store in `citus_stat_statements` |
| [citus.stat_statements_purge_interval](reference-parameters.md#citusstat_statements_purge_interval-integer) | frequency at which the maintenance daemon removes records from `citus_stat_statements` that are unmatched in `pg_stat_statements` |
| citus.stat_statements_track | enable/disable statement tracking |

### Inter-node connection management

| Name | Description |
|------|-------------|
| citus.executor_slow_start_interval | time to wait in milliseconds between opening connections to the same worker node |
| citus.force_max_query_parallelization | open as many connections as possible |
| citus.max_adaptive_executor_pool_size | max worker connections per session |
| citus.max_cached_conns_per_worker | number of connections kept open to speed up subsequent commands |
| citus.max_shared_pool_size | max total connections per worker between all tasks |
| [citus.node_connection_timeout](reference-parameters.md#citusnode_connection_timeout-integer) | max duration (in milliseconds) to wait for connection establishment |

### Data management

| Name | Description |
|------|-------------|
| [citus.shard_count](reference-parameters.md#citusshard_count-integer) | default value used by `create_distributed_table` |
| [citus.shard_max_size](reference-parameters.md#citusshard_max_size-integer) | size to which a shard will grow before it gets split |

### Data transfer

| Name | Description |
|------|-------------|
| [citus.binary_master_copy_format](reference-parameters.md#citusbinary_master_copy_format-boolean) | use the binary copy format to transfer data between coordinator and the workers |
| [citus.binary_worker_copy_format](reference-parameters.md#citusbinary_worker_copy_format-boolean) | use the binary copy format to transfer intermediate data between workers |
| enable_binary_protocol | use PostgreSQL’s binary serialization format (when applicable) to transfer data with workers |
| [citus.max_intermediate_result_size](reference-parameters.md#citusmax_intermediate_result_size-integer) | size in KB of intermediate results for CTEs and subqueries that are unable to be pushed down |

### Deadlock

| Name | Description |
|------|-------------|
| [citus.distributed_deadlock_detection_factor](reference-parameters.md#citusdistributed_deadlock_detection_factor-floating-point) | time to wait before checking for distributed deadlocks |
| [citus.log_distributed_deadlock_detection](reference-parameters.md#cituslog_distributed_deadlock_detection-boolean) | whether to log distributed deadlock detection-related processing in the server log |

## System tables

### Foo

### Bar

## Next steps

* A
* B
* C
