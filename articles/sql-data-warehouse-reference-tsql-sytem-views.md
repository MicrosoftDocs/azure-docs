<properties
   pageTitle="SQL Data Warehouse system views | Microsoft Azure"
   description="Links to system views content for SQL Data Warehouse."
   services="SQL Data Warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/13/2015"
   ms.author="barbkess"/>

# System Views

## External operations catalog views

- sys.external_file formats
- sys.external_tables
- sys.external_data_sources
- sys.dm_pdw_hadoop_operations
- sys.dm_pdw_dms_external_work

## SQL Data Warehouse catalog views

- sys.pdw_column_distribution_properties
- sys.pdw_database_mappings
- sys.pdw_diag_event_properties
- sys.pdw_diag_sessions
- sys.pdw_distributions
- sys.pdw_health_alerts
- sys.pdw_health_component_groups
- sys.pdw_health_component_status_mappings
- sys.pdw_health_components
- sys.pdw_index_mappings
- sys.pdw_loader_backup_run_details
- sys.pdw_loader_backup_runs
- sys.pdw_loader_run_stages
- sys.pdw_nodes_column_store_dictionaries
- sys.pdw_nodes_column_store_row_groups
- sys.pdw_nodes_column_store_segments
- sys.pdw_nodes_columns
- sys.pdw_nodes_indexes
- sys.pdw_nodes_partitions
- sys.pdw_nodes_pdw_physical_databases
- sys.pdw_nodes_tables
- sys.pdw_table_distribution_properties
- sys.pdw_table_mappings

## SQL Data Warehouse dynamic management views (DMVs)

- sys.dm_pdw_component_health_active_alerts
- sys.dm_pdw_component_health_alerts
- sys.dm_pdw_component_health_status
- sys.dm_pdw_diag_processing_stats
- sys.dm_pdw_dms_cores
- sys.dm_pdw_dms_workers
- sys.dm_pdw_errors
- sys.dm_pdw_exec_connections
- sys.dm_pdw_exec_requests
- sys.dm_pdw_exec_sessions
- sys.dm_pdw_exec_sessions
- sys.dm_pdw_network_credentials
- sys.dm_pdw_nodes
- sys.dm_pdw_nodes_database_encryption_keys
- sys.dm_pdw_node_status
- sys.dm_pdw_os_event_logs
- sys.dm_pdw_or_performance_counters
- sys.dm_pdw_os_threads
- sys.dm_pdw_query_stats_xe
- sys.dm_pdw_query_stats_xe_file
- sys.dm_pdw_request_steps
- sys.dm_pdw_resource_waits
- sys.dm_pdw_sql_requests
- sys.dm_pdw_sys_info
- sys.dm_pdw_wait_stats
- sys.dm_pdw_waits
- sys.dm_pdw_lock_waits

## SQL Server catalog views

- [sys.all_columns](https://msdn.microsoft.com/library/ms177522.aspx)
- [sys.all_objects](https://msdn.microsoft.com/library/ms178618.aspx)
- [sys.all_sql_modules](https://msdn.microsoft.com/library/ms184389.aspx)
- [sys.all_views](https://msdn.microsoft.com/library/ms189510.aspx)
- [sys.assemblies](https://msdn.microsoft.com/library/ms189790.aspx)
- [sys.assembly_modules](https://msdn.microsoft.com/library/ms180052.aspx)
- [sys.assembly_types](https://msdn.microsoft.com/library/ms178020.aspx)
- [sys.check_constraints](https://msdn.microsoft.com/library/ms187388.aspx)
- [sys.certificates](https://msdn.microsoft.com/library/ms189774.aspx)
- [sys.columns](https://msdn.microsoft.com/library/ms176106.aspx)
- [sys.computed_columns](https://msdn.microsoft.com/library/ms188744.aspx)
- [sys.data_spaces](https://msdn.microsoft.com/library/ms190289.aspx)
- [sys.database_files](https://msdn.microsoft.com/library/ms174397.aspx)
- [sys.database_permissions](https://msdn.microsoft.com/library/ms188367.aspx)
- [sys.database_principals](https://msdn.microsoft.com/library/ms187328.aspx)
- [sys.database_role_members](https://msdn.microsoft.com/library/ms189780.aspx)
- [sys.databases](https://msdn.microsoft.com/library/ms178534.aspx)
- [sys.default_constraints](https://msdn.microsoft.com/library/ms173758.aspx)
- [sys.extended_properties](https://msdn.microsoft.com/library/ms177541.aspx)
- [sys.filegroups](https://msdn.microsoft.com/library/ms187782.aspx)
- [sys.foreign_key_columns](https://msdn.microsoft.com/library/ms186306.aspx)
- [sys.identity_columns](https://msdn.microsoft.com/library/ms187334.aspx)
- [sys.index_columns](https://msdn.microsoft.com/library/ms175105.aspx)
- [sys.indexes](https://msdn.microsoft.com/library/ms173760.aspx)
- [sys.key_constraints](https://msdn.microsoft.com/library/ms174321.aspx)
- [sys.master_files](https://msdn.microsoft.com/library/ms186782.aspx)
- [sys.numbered_procedures](https://msdn.microsoft.com/library/ms179865.aspx)
- [sys.objects](https://msdn.microsoft.com/library/ms190324.aspx)
- [sys.partition_functions](https://msdn.microsoft.com/library/ms187381.aspx)
- [sys.partition_parameters](https://msdn.microsoft.com/library/ms175054.aspx)
- [sys.partition_range_values](https://msdn.microsoft.com/library/ms187780.aspx)
- [sys.partition_schemes](https://msdn.microsoft.com/library/ms189752.aspx)
- [sys.partitions](https://msdn.microsoft.com/library/ms175012.aspx)
- [sys.parameters](https://msdn.microsoft.com/library/ms176074.aspx)
- [sys.procedures](https://msdn.microsoft.com/library/ms188737.aspx)
- [sys.schemas](https://msdn.microsoft.com/library/ms176011.aspx)
- [sys.securable_classes](https://msdn.microsoft.com/library/ms408301.aspx)
- [sys.server_role_members](https://msdn.microsoft.com/library/ms190331.aspx)
- [sys.server_permissions](https://msdn.microsoft.com/library/ms186260.aspx)
- [sys.server_principals](https://msdn.microsoft.com/library/ms188786.aspx)
- [sys.sql_expression_dependencies](https://msdn.microsoft.com/library/bb677315.aspx)
- [sys.sql_logins](https://msdn.microsoft.com/ms174355.aspx)
- [sys.sql_modules](https://msdn.microsoft.com/library/ms175081.aspx)
- [sys.stats](https://msdn.microsoft.com/library/ms177623.aspx)
- [sys.stats_columns](https://msdn.microsoft.com/library/ms187340.aspx)
- [sys.system_columns](https://msdn.microsoft.com/library/ms178596.aspx****)
- [sys.system_objects](https://msdn.microsoft.com/library/ms173551.aspx)
- [sys.system_sql_modules](https://msdn.microsoft.com/library/ms188034.aspx)
- [sys.system_views](https://msdn.microsoft.com/library/ms187764.aspx)
- [sys.tables](https://msdn.microsoft.com/library/ms187406.aspx)
- [sys.types](https://msdn.microsoft.com/library/ms188021.aspx)
- [sys.views](https://msdn.microsoft.com/library/ms190334.aspx)

## List of SQL Server DMVs available in SQL Data Warehouse

SQL Data Warehouse exposes many of the SQL Server dynamic management views (DMVs). These views, when queried in SQL Server PDW, are reporting the state of SQL Server running on the Compute Nodes. 

Each SQL Server DMV has a PDW-specific column called pdw_node_id, which is the identifier for the Compute node.

>[AZURE.NOTE] To use SQL Server PDW DMVs in SQL Server PDW, insert ‘pdw_nodes_’ into the name, as shown in the following table. 

| -----------------------------; | --------------------------------------------; |
| DMV name in SQL Data Warehouse | Link to SQL Server Transact-SQL topic on MSDN |
| -----------------------------; | --------------------------------------------; |
| sys.dm_pdw_nodes_db_file_space_usage | [sys.dm_db_file_space_usage] (https://msdn.microsoft.com/en-us/library/ms174412.aspx) |
| sys.dm_pdw_nodes_db_index_usage_stats | sys.dm_db_index_usage_stats (Transact-SQL |
| sys.dm_pdw_nodes_db_partition_stats | sys.dm_db_partition_stats (Transact-SQL) |
| sys.dm_pdw_nodes_db_session_space_usage | sys.dm_db_session_space_usage (Transact-SQL) |
| sys.dm_pdw_nodes_db_task_space_usage | sys.dm_db_task_space_usage (Transact-SQL) |
| sys.dm_pdw_nodes_exec_background_job_queue | sys.dm_exec_background_job_queue (Transact-SQL) |
| sys.dm_pdw_nodes_exec_background_job_queue_stats | sys.dm_exec_background_job_queue_stats (Transact-SQL) |
| sys.dm_pdw_nodes_exec_cached_plans | sys.dm_exec_cached_plans (Transact-SQL) |
| sys.dm_pdw_nodes_exec_connections | sys.dm_exec_connections (Transact-SQL)
| sys.dm_pdw_nodes_exec_procedure_stats | sys.dm_exec_procedure_stats (Transact-SQL) |
| sys.dm_pdw_nodes_exec_query_memory_grants | sys.dm_exec_query_memory_grants (Transact-SQL) |
| sys.dm_pdw_nodes_exec_query_optimizer_info | sys.dm_exec_query_optimizer_info (Transact-SQL) |
| sys.dm_pdw_nodes_exec_query_resource_semaphores | sys.dm_exec_query_resource_semaphores (Transact-SQL) |
| sys.dm_pdw_nodes_exec_query_stats | sys.dm_exec_query_stats (Transact-SQL) |
| sys.dm_pdw_nodes_exec_requests | sys.dm_exec_requests (Transact-SQL) |
| sys.dm_pdw_nodes_exec_sessions | sys.dm_pdw_nodes_exec_sessions (Transact-SQL) |
| sys.dm_pdw_nodes_io_cluster_shared_drives | sys.dm_io_cluster_shared_drives (Transact-SQL) |
| sys.dm_pdw_nodes_io_pending_io_requests | sys.dm_io_pending_io_requests (Transact-SQl) |
| sys.dm_pdw_nodes_os_buffer_descriptors | sys.dm_os_buffer_descriptors (Transact-SQL) |
| sys.dm_pdw_nodes_os_child_instances | sys.dm_os_child_instances 9Transact-SQL) |
| sys.dm_pdw_nodes_os_cluster_nodes | sys.dm_os_cluster_nodes (Transact-SQL) |
| sys.dm_pdw_nodes_os_dispatcher_pools | sys.dm_os_dispatcher_pools (Transact-SQl) |
| sys.dm_pdw_nodes_os_dispatchers | Transact-SQL documentation is not available |
| sys.dm_pdw_nodes_os_hosts | sys.dm_os_hosts (Transact-SQL) |
| sys.dm_pdw_nodes_os_latch_stats | sys.dm_os_latch stats ( Transact-SQL) |
| sys.dm_pdw_nodes_os_loaded_modules | sys.dm_os_loaded_modules (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_brokers | sys.dm_os_memory_brokers (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_cache_clock_hands | sys.dm_os_memory_cache_clock_hands (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_cache_counters | sys.dm_os_memory_cache_counters (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_cache_entries | sys.dm_os_memory_cache_entries (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_cache_hash_tables | sys.dm_os_memory_cache_hash_tables (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_clerks | sys.dm_os_memory_clerks (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_node_access_stats | Transact-SQl Documentation is not available. |
| sys.dm_pdw_nodes_os_memory_nodes | sys.dm_os_memory_nodes (Transact-SQL) |
| sys.dm_pdw_nodes_os_memory_pools | sys.dm_os_memory_pools (Transact-SQL) |
| sys.dm_pdw_nodes_os_nodes | sys.dm_os_nodes (Transact-SQL) |
| sys.dm_pdw_nodes_os_performance_counters | sys.dm_os_performance_counters (Transact-SQL) |
| sys.dm_pdw_nodes_os_process_memory | sys.dm_os_process_memory (Transact-SQL) |
| sys.dm_pdw_nodes_os_schedulers | sys.dm_os_schedulers (Transact-SQL) |
| sys.dm_pdw_nodes_os_spinlock_stats | sys.dm_os_spinlock_stats (Transact-SQL) |
| sys.dm_pdw_nodes_os_sys_info | sys.dm_os_sys_info (Transact-SQL) |
| sys.dm_pdw_nodes_os_sys_memory | sys.dm_os_memory_nodes (Transact-SQL) |
| sys.dm_pdw_nodes_os_tasks | sys.dm_os_tasks (Transact-SQL) |
| sys.dm_pdw_nodes_os_threads | sys.dm_os_threads (Transact-SQl) |
| sys.dm_pdw_nodes_os_virtual_address_dump | sys.dm_virtual_address_dump (Transact-SQL) |
| sys.dm_pdw_nodes_os_wait_stats | sys.ldm_pdw_nodes_os_wait_stats (Transact-SQL) |
| sys.dm_pdw_nodes_os_waiting_tasks | sys.dm_waiting_tasks (Transact-SQl) |
| sys.dm_pdw_nodes_os_workers | sys.dm_workers (Transact-SQL) |
| sys.dm_pdw_nodes_resource_governor_resource_pools | sys.dm_resource_governor_resource_pools |
| sys.dm_pdw_nodes_resource_governor_workload_groups | sys.dm_resource_governor_workload_groups |
| sys.dm_pdw_nodes_tran_active_snapshot_database_transactions | sys.dm_tran_active_snapshot_database_transactions (Transact_SQl) |
| sys.dm_pdw_nodes_tran_active_transactions | sys.dm_tran_active_transactions (Transact-SQL) |
| sys.dm_pdw_nodes_tran_commit_table | Transact-SQL documentation is not available. |
| sys.dm_pdw_nodes_tran_current_snapshot | sys.dm_tran_current_snapshot (Transact-SQl) |
| sys.dm_pdw_nodes_tran_locks | sys.dm_tran_locks (Transact-SQl) |
| sys.dm_pdw_nodes_tran_session_transactions | sys.dm_tran_session_transactions (Transact-SQL) |
| sys.dm_pdw_nodes_tran_top_version_generators | sys.dm_tran_top_version_generators (Transact-Sql) |

## SQL Server information_schema views

These are links to the SQL Server Information Schema views available in SQL Server PDW. All of the INFORMATION_SCHEMA views that you would expect to see in SQL Server are available in SQL Server PDW.

- [CHECK_CONSTRAINTS (Transact-SQL)](https://msdn.microsoft.com/library/ms189772.aspx)
- [COLUMN_DOMAIN_USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms189447.aspx)
- [COLUMN_PRIVILEGES (Transact-SQL)](https://msdn.microsoft.com/library/ms186812.aspx)
- [COLUMNS (Transact-SQL)](https://msdn.microsoft.com/library/ms188348.aspx)
- [CONSTRAINT COLUMN USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms174431.aspx)
- [CONSTRAINT_TABLE_USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms179883.aspx)
- [DOMAINS (Transact-SQL)](https://msdn.microsoft.com/library/ms190371.aspx)
- [KEY_COLUMN_USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms189789.aspx)
- [PARAMETERS (Transact-SQL)](https://msdn.microsoft.com/library/ms173796.aspx)
- [REFERENTIAL CONSTRAINTS (Transact-SQL)](https://msdn.microsoft.com/library/ms179987.aspx)
- [ROUTINE COLUMNS (Transact-SQL)](https://msdn.microsoft.com/library/ms187350.aspx)
- [ROUTINES (Transact-SQL)](https://msdn.microsoft.com/library/ms188757.aspx)
- [SCHEMATA (Transact-SQL)](https://msdn.microsoft.com/library/ms182642.aspx)
- [TABLE CONSTRAINTS (Transact-SQL)](https://msdn.microsoft.com/library/ms181757.aspx)
- [TABLE PRIVILEGES (Transact-SQL)](https://msdn.microsoft.com/library/ms186233.aspx)
- [TABLES (Transact-SQL)](https://msdn.microsoft.com/library/ms186224.aspx)
- [VIEW COLUMN USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms190492.aspx)
- [VIEW TABLE USAGE (Transact-SQL)](https://msdn.microsoft.com/library/ms173869.aspx)
- [VIEWS (Transact-SQL)](https://msdn.microsoft.com/library/ms181381.aspx)


