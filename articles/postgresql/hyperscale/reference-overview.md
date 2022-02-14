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

alter_distributed_table
citus_copy_shard_placement
citus_move_shard_placement
column_to_column_name
create_distributed_table
create_reference_table
isolate_tenant_to_new_shard
master_copy_shard_placement
remove_local_tables_from_metadata
replicate_table_shards
truncate_local_data_after_distributing_table
undistribute_table
upgrade_to_reference_table

### Shard rebalancing

citus_add_rebalance_strategy
citus_set_default_rebalance_strategy
get_rebalance_progress
get_rebalance_table_shards_plan
rebalance_table_shards

### Colocation

create_distributed_function
mark_tables_colocated
update_distributed_table_colocation

### Columnar storage

alter_columnar_table_set
alter_table_set_access_method

### Partitioning

alter_old_partitions_set_access_method
create_time_partitions
drop_old_time_partitions

### Informational

citus_get_active_worker_nodes
citus_relation_size
citus_remote_connection_stats
citus_remote_connection_stats
citus_stat_statements_reset
citus_table_size
citus_total_relation_size
column_to_column_name
get_shard_id_for_distribution_column
master_get_table_metadata

## Server parameters

### Query execution

all_modifications_commutative
count_distinct_error_rate
enable_ddl_propagation
enable_local_reference_table_foreign_keys
enable_repartition_joins
enable_repartitioned_insert_select
limit_clause_row_fetch_count
local_table_join_policy
multi_shard_commit_protocol
propagate_set_commands

### Debugging

explain_all_tasks
explain_analyze_sort_method
multi_task_query_log_level
stat_statements_max
stat_statements_purge_interval
stat_statements_track

### Inter-node connection management

executor_slow_start_interval
force_max_query_parallelization
max_adaptive_executor_pool_size
max_cached_conns_per_worker
max_shared_pool_size
node_connection_timeout

### Data management

shard_count
shard_max_size

### Data transfer

binary_master_copy_format
binary_worker_copy_format
enable_binary_protocol
max_intermediate_result_size

### Deadlock

distributed_deadlock_detection_factor
log_distributed_deadlock_detection

## System tables

### Foo

### Bar

## Next steps

* A
* B
* C
