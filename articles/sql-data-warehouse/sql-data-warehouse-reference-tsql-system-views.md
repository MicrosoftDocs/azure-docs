<properties
   pageTitle="SQL Data Warehouse system views | Microsoft Azure"
   description="Links to system views content for SQL Data Warehouse."
   services="sql-data-warehouse"
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
   ms.date="06/29/2015"
   ms.author="barbkess"/>

# System Views

## SQL Data Warehouse catalog views

- [sys.pdw_column_distribution_properties](http://msdn.microsoft.com/library/mt204022.aspx)
- [sys.pdw_database_mappings](http://msdn.microsoft.com/library/mt203891.aspx)
- [sys.pdw_diag_event_properties](http://msdn.microsoft.com/library/mt203921.aspx)
- [sys.pdw_diag_events](http://msdn.microsoft.com/library/mt203895.aspx)
- [sys.pdw_diag_sessions](http://msdn.microsoft.com/library/mt203890.aspx)
- [sys.pdw_distributions](http://msdn.microsoft.com/library/mt203892.aspx)
- [sys.pdw_index_mappings](http://msdn.microsoft.com/library/mt203912.aspx)
- [sys.pdw_loader_backup_run_details](http://msdn.microsoft.com/library/mt203877.aspx)
- [sys.pdw_loader_backup_runs](http://msdn.microsoft.com/library/mt203884.aspx)
- [sys.pdw_loader_run_stages](http://msdn.microsoft.com/library/mt203879.aspx)
- [sys.pdw_nodes_column_store_dictionaries](http://msdn.microsoft.com/library/mt203902.aspx)
- [sys.pdw_nodes_column_store_row_groups](http://msdn.microsoft.com/library/mt203880.aspx)
- [sys.pdw_nodes_column_store_segments](http://msdn.microsoft.com/library/mt203916.aspx)
- [sys.pdw_nodes_columns](http://msdn.microsoft.com/library/mt203881.aspx)
- [sys.pdw_nodes_indexes](http://msdn.microsoft.com/library/mt203885.aspx)
- [sys.pdw_nodes_partitions](http://msdn.microsoft.com/library/mt203908.aspx)
- [sys.pdw_nodes_pdw_physical_databases](http://msdn.microsoft.com/library/mt203897.aspx)
- [sys.pdw_nodes_tables](http://msdn.microsoft.com/library/mt203886.aspx)
- [sys.pdw_table_distribution_properties](http://msdn.microsoft.com/library/mt203896.aspx)
- [sys.pdw_table_mappings](http://msdn.microsoft.com/library/mt203876.aspx)

## SQL Database Catalog views

- [dbo.server_quotas (Azure SQL Database)](http://msdn.microsoft.com/library/dn308512.aspx)
- [sys.bandwidth_usage (Azure SQL Database)](http://msdn.microsoft.com/library/dn269985.aspx)
- [sys.database_connection_stats (Azure SQL Database)](http://msdn.microsoft.com/library/dn269986.aspx)
- [sys.database_firewall_rules (Azure SQL Database)](http://msdn.microsoft.com/library/dn269982.aspx)
- [sys.database_usage (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff951626.aspx)
- [sys.event_log (Azure SQL Database)](http://msdn.microsoft.com/library/dn270018.aspx)
- [sys.database_firewall_rules (Azure SQL Database)](http://msdn.microsoft.com/library/dn269982.aspx)
- [sys.firewall_rules (Azure SQL Database)](http://msdn.microsoft.com/library/azure/ff951627.aspx)
- [sys.resource_stats (Azure SQL Database)](http://msdn.microsoft.com/library/dn269979.aspx)
- sys.resource_usage (Azure SQL Database)


## SQL Data Warehouse dynamic management views (DMVs)

- [sys.dm_pdw_diag_processing_stats](http://msdn.microsoft.com/library/mt203914.aspx)
- [sys.dm_pdw_dms_cores](http://msdn.microsoft.com/library/mt203911.aspx)
- [sys.dm_pdw_dms_workers](http://msdn.microsoft.com/library/mt203878.aspx)
- [sys.dm_pdw_errors](http://msdn.microsoft.com/library/mt203904.aspx)
- [sys.dm_pdw_exec_connections](http://msdn.microsoft.com/library/mt203882.aspx)
- [sys.dm_pdw_exec_requests](http://msdn.microsoft.com/library/mt203887.aspx)
- [sys.dm_pdw_exec_sessions](http://msdn.microsoft.com/library/mt203883.aspx)
- [sys.dm_pdw_network_credentials](http://msdn.microsoft.com/library/mt203915.aspx)
- [sys.dm_pdw_nodes](http://msdn.microsoft.com/library/mt203907.aspx)
- [sys.dm_pdw_nodes_database_encryption_keys](http://msdn.microsoft.com/library/mt203922.aspx)
- [sys.dm_pdw_node_status](http://msdn.microsoft.com/library/mt203905.aspx)
- [sys.dm_pdw_os_event_logs](http://msdn.microsoft.com/library/mt203910.aspx)
- [sys.dm_pdw_or_performance_counters](http://msdn.microsoft.com/library/mt203875.aspx)
- [sys.dm_pdw_os_threads](http://msdn.microsoft.com/library/mt203917.aspx)
- [sys.dm_pdw_query_stats_xe](http://msdn.microsoft.com/library/mt203898.aspx)
- [sys.dm_pdw_query_stats_xe_file](http://msdn.microsoft.com/library/mt203919.aspx)
- [sys.dm_pdw_request_steps](http://msdn.microsoft.com/library/mt203913.aspx)
- [sys.dm_pdw_resource_waits](http://msdn.microsoft.com/library/mt203906.aspx)
- [sys.dm_pdw_sql_requests](http://msdn.microsoft.com/library/mt203889.aspx)
- [sys.dm_pdw_sys_info](http://msdn.microsoft.com/library/mt203900.aspx)
- [sys.dm_pdw_wait_stats](http://msdn.microsoft.com/library/mt203909.aspx)
- [sys.dm_pdw_waits](http://msdn.microsoft.com/library/mt203909.aspx)
- [sys.dm_pdw_lock_waits](http://msdn.microsoft.com/library/mt203901.aspx)

## SQL Server catalog views

- [sys.all_columns](http://msdn.microsoft.com/library/ms177522.aspx)
- [sys.all_objects](http://msdn.microsoft.com/library/ms178618.aspx)
- [sys.all_sql_modules](http://msdn.microsoft.com/library/ms184389.aspx)
- [sys.all_views](http://msdn.microsoft.com/library/ms189510.aspx)
- [sys.assemblies](http://msdn.microsoft.com/library/ms189790.aspx)
- [sys.assembly_modules](http://msdn.microsoft.com/library/ms180052.aspx)
- [sys.assembly_types](http://msdn.microsoft.com/library/ms178020.aspx)
- [sys.check_constraints](http://msdn.microsoft.com/library/ms187388.aspx)
- [sys.certificates](http://msdn.microsoft.com/library/ms189774.aspx)
- [sys.columns](http://msdn.microsoft.com/library/ms176106.aspx)
- [sys.computed_columns](http://msdn.microsoft.com/library/ms188744.aspx)
- [sys.data_spaces](http://msdn.microsoft.com/library/ms190289.aspx)
- [sys.database_files](http://msdn.microsoft.com/library/ms174397.aspx)
- [sys.database_permissions](http://msdn.microsoft.com/library/ms188367.aspx)
- [sys.database_principals](http://msdn.microsoft.com/library/ms187328.aspx)
- [sys.database_role_members](http://msdn.microsoft.com/library/ms189780.aspx)
- [sys.databases](http://msdn.microsoft.com/library/ms178534.aspx)
- [sys.default_constraints](http://msdn.microsoft.com/library/ms173758.aspx)
- [sys.extended_properties](http://msdn.microsoft.com/library/ms177541.aspx)
- [sys.external_file formats](http://msdn.microsoft.com/library/dn935025.aspx)
- [sys.external_tables](http://msdn.microsoft.com/library/dn935029.aspx)
- [sys.external_data_sources](http://msdn.microsoft.com/library/dn935019.aspx)
- [sys.filegroups](http://msdn.microsoft.com/library/ms187782.aspx)
- [sys.foreign_key_columns](http://msdn.microsoft.com/library/ms186306.aspx)
- [sys.identity_columns](http://msdn.microsoft.com/library/ms187334.aspx)
- [sys.index_columns](http://msdn.microsoft.com/library/ms175105.aspx)
- [sys.indexes](http://msdn.microsoft.com/library/ms173760.aspx)
- [sys.key_constraints](http://msdn.microsoft.com/library/ms174321.aspx)
- [sys.master_files](http://msdn.microsoft.com/library/ms186782.aspx)
- [sys.numbered_procedures](http://msdn.microsoft.com/library/ms179865.aspx)
- [sys.objects](http://msdn.microsoft.com/library/ms190324.aspx)
- [sys.partition_functions](http://msdn.microsoft.com/library/ms187381.aspx)
- [sys.partition_parameters](http://msdn.microsoft.com/library/ms175054.aspx)
- [sys.partition_range_values](http://msdn.microsoft.com/library/ms187780.aspx)
- [sys.partition_schemes](http://msdn.microsoft.com/library/ms189752.aspx)
- [sys.partitions](http://msdn.microsoft.com/library/ms175012.aspx)
- [sys.parameters](http://msdn.microsoft.com/library/ms176074.aspx)
- [sys.procedures](http://msdn.microsoft.com/library/ms188737.aspx)
- [sys.schemas](http://msdn.microsoft.com/library/ms176011.aspx)
- [sys.securable_classes](http://msdn.microsoft.com/library/ms408301.aspx)
- [sys.server_role_members](http://msdn.microsoft.com/library/ms190331.aspx)
- [sys.server_permissions](http://msdn.microsoft.com/library/ms186260.aspx)
- [sys.server_principals](http://msdn.microsoft.com/library/ms188786.aspx)
- [sys.sql_expression_dependencies](http://msdn.microsoft.com/library/bb677315.aspx)
- [sys.sql_logins](http://msdn.microsoft.com/ms174355.aspx)
- [sys.sql_modules](http://msdn.microsoft.com/library/ms175081.aspx)
- [sys.stats](http://msdn.microsoft.com/library/ms177623.aspx)
- [sys.stats_columns](http://msdn.microsoft.com/library/ms187340.aspx)
- [sys.system_columns](http://msdn.microsoft.com/library/ms178596.aspx****)
- [sys.system_objects](http://msdn.microsoft.com/library/ms173551.aspx)
- [sys.system_sql_modules](http://msdn.microsoft.com/library/ms188034.aspx)
- [sys.system_views](http://msdn.microsoft.com/library/ms187764.aspx)
- [sys.tables](http://msdn.microsoft.com/library/ms187406.aspx)
- [sys.types](http://msdn.microsoft.com/library/ms188021.aspx)
- [sys.views](http://msdn.microsoft.com/library/ms190334.aspx)

## List of SQL Server DMVs available in SQL Data Warehouse

SQL Data Warehouse exposes many of the SQL Server dynamic management views (DMVs). These views, when queried in SQL Data Warehouse, are reporting the state of SQL Database running on the distributions. 

Since SQL Data Warehouse is built on Microsoft's MPP technology, both SQL Data Warehouse and Analytics Platform System's Parallel Data Warehouse (PDW) use the same system views.

This is why each of these DMV's has a specific column called pdw_node_id. This is the the identifier for the Compute node. In PDW the Compute node is a stronger concept for the architecture. In SQL Data Warehouse, the architecture relies more heavily on the distributions.

>[AZURE.NOTE] To use these view, insert ‘pdw_nodes_’ into the name, as shown in the following table. 


| DMV name in SQL Data Warehouse | Link to SQL Server Transact-SQL topic on MSDN |
| :----------------------------- | :-------------------------------------------- |
| sys.dm_pdw_nodes_db_file_space_usage | [sys.dm_db_file_space_usage (Transact-SQL)](http://msdn.microsoft.com/library/ms174412.aspx) |
| sys.dm_pdw_nodes_db_index_usage_stats | [sys.dm_db_index_usage_stats (Transact-SQL)](http://msdn.microsoft.com/library/ms188755.aspx) |
| sys.dm_pdw_nodes_db_partition_stats | [sys.dm_db_partition_stats (Transact-SQL)](http://msdn.microsoft.com/library/ms187737.aspx) |
| sys.dm_pdw_nodes_db_session_space_usage | [sys.dm_db_session_space_usage (Transact-SQL)](http://msdn.microsoft.com/library/ms187938.aspx) |
| sys.dm_pdw_nodes_db_task_space_usage | [sys.dm_db_task_space_usage (Transact-SQL)](http://msdn.microsoft.com/library/ms190288.aspx) |
| sys.dm_pdw_nodes_exec_background_job_queue | [sys.dm_exec_background_job_queue (Transact-SQL)](http://msdn.microsoft.com/library/ms173512.aspx) |
| sys.dm_pdw_nodes_exec_background_job_queue_stats | [sys.dm_exec_background_job_queue_stats (Transact-SQL)](http://msdn.microsoft.com/library/ms176059.aspx) |
| sys.dm_pdw_nodes_exec_cached_plans | [sys.dm_exec_cached_plans (Transact-SQL)](http://msdn.microsoft.com/library/ms187404.aspx) |
| sys.dm_pdw_nodes_exec_connections | [sys.dm_exec_connections (Transact-SQL)](http://msdn.microsoft.com/library/ms181509.aspx) |
| sys.dm_pdw_nodes_exec_procedure_stats | [sys.dm_exec_procedure_stats (Transact-SQL)](http://msdn.microsoft.com/library/cc280701.aspx) |
| sys.dm_pdw_nodes_exec_query_memory_grants | [sys.dm_exec_query_memory_grants (Transact-SQL)](http://msdn.microsoft.com/library/ms365393.aspx) |
| sys.dm_pdw_nodes_exec_query_optimizer_info | [sys.dm_exec_query_optimizer_info (Transact-SQL)](http://msdn.microsoft.com/library/ms175002.aspx) |
| sys.dm_pdw_nodes_exec_query_resource_semaphores | [sys.dm_exec_query_resource_semaphores (Transact-SQL)](http://msdn.microsoft.com/library/ms366321.aspx) |
| sys.dm_pdw_nodes_exec_query_stats | [sys.dm_exec_query_stats (Transact-SQL)](http://msdn.microsoft.com/library/ms189741.aspx) |
| sys.dm_pdw_nodes_exec_requests | [sys.dm_exec_requests (Transact-SQL)](http://msdn.microsoft.com/library/ms177648.aspx) |
| sys.dm_pdw_nodes_exec_sessions | sys.dm_pdw_nodes_exec_sessions (Transact-SQL) |
| sys.dm_pdw_nodes_io_cluster_shared_drives | [sys.dm_io_cluster_shared_drives (Transact-SQL)](http://msdn.microsoft.com/library/ms188930.aspx) |
| sys.dm_pdw_nodes_io_pending_io_requests | [sys.dm_io_pending_io_requests (Transact-SQl)](http://msdn.microsoft.com/library/ms188762.aspx) |
| sys.dm_pdw_nodes_os_buffer_descriptors | [sys.dm_os_buffer_descriptors (Transact-SQL)](http://msdn.microsoft.com/library/ms173442.aspx) |
| sys.dm_pdw_nodes_os_child_instances | [sys.dm_os_child_instances (Transact-SQL)](http://msdn.microsoft.com/library/ms165698.aspx) |
| sys.dm_pdw_nodes_os_cluster_nodes | [sys.dm_os_cluster_nodes (Transact-SQL)](http://msdn.microsoft.com/library/ms187341.aspx) |
| sys.dm_pdw_nodes_os_dispatcher_pools | [sys.dm_os_dispatcher_pools (Transact-SQL)](http://msdn.microsoft.com/library/bb630336.aspx) |
| sys.dm_pdw_nodes_os_dispatchers | Transact-SQl Documentation is not available. |
| sys.dm_pdw_nodes_os_hosts | [sys.dm_os_hosts (Transact-SQL)](http://msdn.microsoft.com/library/ms187800.aspx) |
| sys.dm_pdw_nodes_os_latch_stats | [sys.dm_os_latch stats (Transact-SQL)](http://msdn.microsoft.com/library/ms175066.aspx) |
| sys.dm_pdw_nodes_os_loaded_modules | [sys.dm_os_loaded_modules (Transact-SQL)](http://msdn.microsoft.com/library/ms179907.aspx) |
| sys.dm_pdw_nodes_os_memory_brokers | [sys.dm_os_memory_brokers (Transact-SQL)](http://msdn.microsoft.com/library/bb522548.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_clock_hands | [sys.dm_os_memory_cache_clock_hands (Transact-SQL)](http://msdn.microsoft.com/library/ms173786.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_counters | [sys.dm_os_memory_cache_counters (Transact-SQL)](http://msdn.microsoft.com/library/ms188760.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_entries | [sys.dm_os_memory_cache_entries (Transact-SQL)](http://msdn.microsoft.com/library/ms189488.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_hash_tables | [sys.dm_os_memory_cache_hash_tables (Transact-SQL)](http://msdn.microsoft.com/library/ms182388.aspx) |
| sys.dm_pdw_nodes_os_memory_clerks | [sys.dm_os_memory_clerks (Transact-SQL)](http://msdn.microsoft.com/library/ms175019.aspx) |
| sys.dm_pdw_nodes_os_memory_node_access_stats | Transact-SQl Documentation is not available. |
| sys.dm_pdw_nodes_os_memory_nodes | [sys.dm_os_memory_nodes (Transact-SQL)](http://msdn.microsoft.com/library/bb510622.aspx) |
| sys.dm_pdw_nodes_os_memory_pools | [sys.dm_os_memory_pools (Transact-SQL)](http://msdn.microsoft.com/library/ms175022.aspx) |
| sys.dm_pdw_nodes_os_nodes | [sys.dm_os_nodes (Transact-SQL)](http://msdn.microsoft.com/library/bb510628.aspx) |
| sys.dm_pdw_nodes_os_performance_counters | [sys.dm_os_performance_counters (Transact-SQL)](http://msdn.microsoft.com/library/ms187743.aspx) |
| sys.dm_pdw_nodes_os_process_memory | [sys.dm_os_process_memory (Transact-SQL)](http://msdn.microsoft.com/library/bb510747.aspx) |
| sys.dm_pdw_nodes_os_schedulers | [sys.dm_os_schedulers (Transact-SQL)](http://msdn.microsoft.com/library/ms177526.aspx) |
| sys.dm_pdw_nodes_os_spinlock_stats | sys.dm_os_spinlock_stats (Transact-SQL) |
| sys.dm_pdw_nodes_os_sys_info | [sys.dm_os_sys_info (Transact-SQL)](http://msdn.microsoft.com/library/ms175048.aspx) |
| sys.dm_pdw_nodes_os_sys_memory | [sys.dm_os_memory_nodes (Transact-SQL)](http://msdn.microsoft.com/library/bb510622.aspx) |
| sys.dm_pdw_nodes_os_tasks | [sys.dm_os_tasks (Transact-SQL)](http://msdn.microsoft.com/library/ms174963.aspx) |
| sys.dm_pdw_nodes_os_threads | [sys.dm_os_threads (Transact-SQL)](http://msdn.microsoft.com/library/ms187818.aspx) |
| sys.dm_pdw_nodes_os_virtual_address_dump | sys.dm_virtual_address_dump (Transact-SQL) |
| sys.dm_pdw_nodes_os_wait_stats | sys.ldm_pdw_nodes_os_wait_stats (Transact-SQL) |
| sys.dm_pdw_nodes_os_waiting_tasks | sys.dm_waiting_tasks (Transact-SQL) |
| sys.dm_pdw_nodes_os_workers | sys.dm_workers (Transact-SQL) |
| sys.dm_pdw_nodes_resource_governor_resource_pools | [sys.dm_resource_governor_resource_pools (Transact-SQL)](http://msdn.microsoft.com/library/bb934023.aspx) |
| sys.dm_pdw_nodes_resource_governor_workload_groups | [sys.dm_resource_governor_workload_groups (Transact-SQL)](http://msdn.microsoft.com/library/bb934197.aspx) |
| sys.dm_pdw_nodes_tran_active_snapshot_database_transactions | [sys.dm_tran_active_snapshot_database_transactions (Transact_SQL)](http://msdn.microsoft.com/library/ms180023.aspx) |
| sys.dm_pdw_nodes_tran_active_transactions | [sys.dm_tran_active_transactions (Transact-SQL)](http://msdn.microsoft.com/library/ms174302.aspx) |
| sys.dm_pdw_nodes_tran_commit_table | Transact-SQL documentation is not available. |
| sys.dm_pdw_nodes_tran_current_snapshot | [sys.dm_tran_current_snapshot (Transact-SQL)](http://msdn.microsoft.com/library/ms184390.aspx) |
| sys.dm_pdw_nodes_tran_locks | [sys.dm_tran_locks (Transact-SQL)](http://msdn.microsoft.com/library/ms190345.aspx) |
| sys.dm_pdw_nodes_tran_session_transactions | [sys.dm_tran_session_transactions (Transact-SQL)](http://msdn.microsoft.com/library/ms188739.aspx) |
| sys.dm_pdw_nodes_tran_top_version_generators | [sys.dm_tran_top_version_generators (Transact-SQL)](http://msdn.microsoft.com/library/ms188778.aspx) |

## SQL Server 2016 PolyBase dmvs available in SQL Data Warehouse

- [sys.dm_exec_compute_node_errors (Transact-SQL)](http://msdn.microsoft.com/library/mt146380.aspx)
- [sys.dm_exec_compute_node_status (Transact-SQL)](http://msdn.microsoft.com/library/mt146382.aspx)
- sys.dm_exec_compute_nodes (Transact-SQL)
- sys.dm_exec_distributed_request_steps (Transact-SQL)
- [sys.dm_exec_distributed_requests (Transact-SQL)](http://msdn.microsoft.com/library/mt146385.aspx)
- [sys.dm_exec_distributed_sql_requests (Transact-SQL)](http://msdn.microsoft.com/library/mt146390.aspx) 
- sys.dm_exec_dms_services (Transact-SQL)
- sys.dm_exec_dms_workers (Transact-SQL)
- sys.dm_exec_external_operations (Transact-SQL)
- sys.dm_exec_external_work (Transact-SQL)

## SQL Database DMVs available in SQL Data Warehouse

- sys.dm_continuous_copy_status
- [sys.dm_database_copies](http://msdn.microsoft.com/library/azure/ff951634.aspx)
- sys.dm_db_objects_impacted_on_version_change
- sys.dm_db_resource_stats
- sys.dm_db_wait_stats
- [sys.dm_operation_status](http://msdn.microsoft.com/library/azure/jj126282.aspx)


## SQL Server information_schema views

These are links to the SQL Server Information Schema views available in SQL Server PDW. All of the INFORMATION_SCHEMA views that you would expect to see in SQL Server are available in SQL Server PDW.

- [CHECK_CONSTRAINTS (Transact-SQL)](http://msdn.microsoft.com/library/ms189772.aspx)
- [COLUMN_DOMAIN_USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms189447.aspx)
- [COLUMN_PRIVILEGES (Transact-SQL)](http://msdn.microsoft.com/library/ms186812.aspx)
- [COLUMNS (Transact-SQL)](http://msdn.microsoft.com/library/ms188348.aspx)
- [CONSTRAINT COLUMN USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms174431.aspx)
- [CONSTRAINT_TABLE_USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms179883.aspx)
- [DOMAINS (Transact-SQL)](http://msdn.microsoft.com/library/ms190371.aspx)
- [KEY_COLUMN_USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms189789.aspx)
- [PARAMETERS (Transact-SQL)](http://msdn.microsoft.com/library/ms173796.aspx)
- [REFERENTIAL CONSTRAINTS (Transact-SQL)](http://msdn.microsoft.com/library/ms179987.aspx)
- [ROUTINE COLUMNS (Transact-SQL)](http://msdn.microsoft.com/library/ms187350.aspx)
- [ROUTINES (Transact-SQL)](http://msdn.microsoft.com/library/ms188757.aspx)
- [SCHEMATA (Transact-SQL)](http://msdn.microsoft.com/library/ms182642.aspx)
- [TABLE CONSTRAINTS (Transact-SQL)](http://msdn.microsoft.com/library/ms181757.aspx)
- [TABLE PRIVILEGES (Transact-SQL)](http://msdn.microsoft.com/library/ms186233.aspx)
- [TABLES (Transact-SQL)](http://msdn.microsoft.com/library/ms186224.aspx)
- [VIEW COLUMN USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms190492.aspx)
- [VIEW TABLE USAGE (Transact-SQL)](http://msdn.microsoft.com/library/ms173869.aspx)
- [VIEWS (Transact-SQL)](http://msdn.microsoft.com/library/ms181381.aspx)

## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse reference overview]: sql-data-warehouse-overview-reference.md

<!--MSDN references-->


<!--Other Web references-->

