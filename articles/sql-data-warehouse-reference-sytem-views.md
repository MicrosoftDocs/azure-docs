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

sys.external_file formats
sys.external_tables
sys.external_data_sources
sys.dm_pdw_hadoop_operations
sys.dm_pdw_dms_external_work

## SQL Data Warehouse catalog views

sys.pdw_column_distribution_properties
sys.pdw_database_mappings
sys.pdw_diag_event_properties
sys.pdw_diag_sessions
sys.pdw_distributions
sys.pdw_health_alerts
sys.pdw_health_component_groups
sys.pdw_health_component_status_mappings
sys.pdw_health_components
sys.pdw_index_mappings
sys.pdw_loader_backup_run_details
sys.pdw_loader_backup_runs
sys.pdw_loader_run_stages
sys.pdw_nodes_column_store_dictionaries
sys.pdw_nodes_column_store_row_groups
sys.pdw_nodes_column_store_segments
sys.pdw_nodes_columns
sys.pdw_nodes_indexes
sys.pdw_nodes_partitions
sys.pdw_nodes_pdw_physical_databases
sys.pdw_nodes_tables
sys.pdw_table_distribution_properties
sys.pdw_table_mappings

## SQL Data Warehouse dynamic management views (DMVs)

sys.dm_pdw_component_health_active_alerts
sys.dm_pdw_component_health_alerts
sys.dm_pdw_component_health_status
sys.dm_pdw_diag_processing_stats
sys.dm_pdw_dms_cores
sys.dm_pdw_dms_workers
sys.dm_pdw_errors
sys.dm_pdw_exec_connections
sys.dm_pdw_exec_requests
sys.dm_pdw_exec_sessions
sys.dm_pdw_exec_sessions
sys.dm_pdw_network_credentials
sys.dm_pdw_nodes
sys.dm_pdw_nodes_database_encryption_keys
sys.dm_pdw_node_status
sys.dm_pdw_os_event_logs
sys.dm_pdw_or_performance_counters
sys.dm_pdw_os_threads
sys.dm_pdw_query_stats_xe
sys.dm_pdw_query_stats_xe_file
sys.dm_pdw_request_steps
sys.dm_pdw_resource_waits
sys.dm_pdw_sql_requests
sys.dm_pdw_sys_info
sys.dm_pdw_wait_stats
sys.dm_pdw_waits
sys.dm_pdw_lock_waits

## SQL Server catalog views

sys.all_columns
sys.all_objects
sys.all_sql_modules
sys.all_views
sys.assemblies
sys.assembly_modules
sys.assembly_types
sys.check_constraints
sys.certificates
sys.columns
sys.computed_columns
sys.data_spaces
sys.database_files
sys.database_permissions
sys.database_principals
sys.database_role_members
sys.databases
sys.default_constraings
sys.extended_properties
sys.filegroups
sys.foreign_key_columns
sys.identity_columns
sys.index_columns
sys.indexes
sys.key_constraings
sys.master_files
sys.numbered_procedures
sys.objects
sys.partition_functions
sys.partition_parameters
sys.partition_range_values
sys.partition_schemes
sys.partitions
sys.parameters
sys.procedures
sys.schemas
sys.securable_classes
sys.server_role_members
sys.server_permissions
sys.server_principals
sys.sql_expression_dependencies
sys.sql_logins
sys.sql_modules
sys.stats
sys.stats_columns
sys.system_columns
sys.system_objects
sys.system_sql_modules
sys.system_views
sys.tables
sys.types
sys.views

## List of SQL Server DMVs available in SQL Data Warehouse

SQL Data Warehouse exposes many of the SQL Server dynamic management views (DMVs). These views, when queried in SQL Server PDW, are reporting the state of SQL Server running on the Compute Nodes. 

Each SQL Server DMV has a PDW-specific column called pdw_node_id, which is the identifier for the Compute node.

>[AZURE.NOTE] To use SQL Server PDW DMVs in SQL Server PDW, insert ‘pdw_nodes_’ into the name, as shown in the following table. 

| -----------------------------; | --------------------------------------------; |
| DMV name in SQL Data Warehouse | Link to SQL Server Transact-SQL topic on MSDN |
| -----------------------------; | --------------------------------------------; |
| sys.dm_pdw_nodes_db_file_space_usage | sys.dm_db_file_space_usage (Transact-SQL) |
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

CHECK_CONSTRAINTS (Transact-SQL)
COLUMN_DOMAIN_USAGE (Transact-SQL)
COLUMN_PRIVILEGES (Transact-SQL)
COLUMNS (Transact-SQL)
CONSTRAINT COLUMN USAGE (Transact-SQL)
CONSTRAINT_TABLE_USAGE (Transact-SQL)
DOMAINS (Transact-SQL)
KEY_COLUMN_USAGE (Transact-SQL)
PARAMETERS (Transact-SQL)
REFERENTIAL CONSTRAINTS (Transact-SQL)
ROUTINE COLUMNS (Transact-SQL)
ROUTINES (Transact-SQL)
SCHEMATA (Transact-SQL)
TABLE CONSTRAINTS (Transact-SQL)
TABLE PRIVILEGES (Transact-SQL)
TABLES (Transact-SQL)
VIEW COLUMN USAGE (Transact-SQL)
VIEW TABLE USAGE (Transact-SQL)
VIEWS (Transact-SQL)


