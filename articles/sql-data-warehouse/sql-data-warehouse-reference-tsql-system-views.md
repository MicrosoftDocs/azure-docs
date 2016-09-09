<properties
   pageTitle="SQL Data Warehouse system views | Microsoft Azure"
   description="Links to system views content for SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="barbkess"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="06/17/2016"
   ms.author="barbkess;sonyama"/>

# System views

## SQL Data Warehouse catalog views

- [sys.pdw_column_distribution_properties](http://msdn.microsoft.com/library/mt204022.aspx)
- [sys.pdw_database_mappings](http://msdn.microsoft.com/library/mt203891.aspx)
- [sys.pdw_distributions](http://msdn.microsoft.com/library/mt203892.aspx)
- [sys.pdw_index_mappings](http://msdn.microsoft.com/library/mt203912.aspx)
- [sys.pdw_loader_backup_run_details](https://msdn.microsoft.com/library/mt203877.aspx)
- [sys.pdw_loader_backup_runs](https://msdn.microsoft.com/library/mt203884.aspx)
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

## SQL Data Warehouse dynamic management views (DMVs)

- [sys.dm_pdw_dms_cores](http://msdn.microsoft.com/library/mt203911.aspx)
- [sys.dm_pdw_dms_external_work](https://msdn.microsoft.com/library/mt204024.aspx)
- [sys.dm_pdw_dms_workers](http://msdn.microsoft.com/library/mt203878.aspx)
- [sys.dm_pdw_errors](http://msdn.microsoft.com/library/mt203904.aspx)
- [sys.dm_pdw_exec_connections](http://msdn.microsoft.com/library/mt203882.aspx)
- [sys.dm_pdw_exec_requests](http://msdn.microsoft.com/library/mt203887.aspx)
- [sys.dm_pdw_exec_sessions](http://msdn.microsoft.com/library/mt203883.aspx)
- [sys.dm_pdw_hadoop_operations](https://msdn.microsoft.com/library/mt204032.aspx)
- [sys.dm_pdw_lock_waits](http://msdn.microsoft.com/library/mt203901.aspx)
- [sys.dm_pdw_nodes](http://msdn.microsoft.com/library/mt203907.aspx)
- [sys.dm_pdw_nodes_database_encryption_keys](http://msdn.microsoft.com/library/mt203922.aspx)
- [sys.dm_pdw_os_threads](http://msdn.microsoft.com/library/mt203917.aspx)
- [sys.dm_pdw_request_steps](http://msdn.microsoft.com/library/mt203913.aspx)
- [sys.dm_pdw_resource_waits](http://msdn.microsoft.com/library/mt203906.aspx)
- [sys.dm_pdw_sql_requests](http://msdn.microsoft.com/library/mt203889.aspx)
- [sys.dm_pdw_sys_info](http://msdn.microsoft.com/library/mt203900.aspx)
- [sys.dm_pdw_wait_stats](http://msdn.microsoft.com/library/mt203909.aspx)
- [sys.dm_pdw_waits](http://msdn.microsoft.com/library/mt203909.aspx)

## SQL Server catalog views

- [sys.all_columns](http://msdn.microsoft.com/library/ms177522.aspx)
- [sys.all_objects](http://msdn.microsoft.com/library/ms178618.aspx)
- [sys.all_parameters](http://msdn.microsoft.com/library/ms190340.aspx)
- [sys.all_sql_modules](http://msdn.microsoft.com/library/ms184389.aspx)
- [sys.all_views](http://msdn.microsoft.com/library/ms189510.aspx)
- [sys.assemblies](http://msdn.microsoft.com/library/ms189790.aspx)
- [sys.assembly_modules](http://msdn.microsoft.com/library/ms180052.aspx)
- [sys.assembly_types](http://msdn.microsoft.com/library/ms178020.aspx)
- [sys.certificates](http://msdn.microsoft.com/library/ms189774.aspx)
- [sys.check_constraints](http://msdn.microsoft.com/library/ms187388.aspx)
- [sys.columns](http://msdn.microsoft.com/library/ms176106.aspx)
- [sys.computed_columns](http://msdn.microsoft.com/library/ms188744.aspx)
- [sys.credentials](https://msdn.microsoft.com/library/ms189745.aspx)
- [sys.data_spaces](http://msdn.microsoft.com/library/ms190289.aspx)
- [sys.database_credentials](https://msdn.microsoft.com/library/mt270282.aspx)
- [sys.database_files](http://msdn.microsoft.com/library/ms174397.aspx)
- [sys.database_permissions](http://msdn.microsoft.com/library/ms188367.aspx)
- [sys.database_principals](http://msdn.microsoft.com/library/ms187328.aspx)
- [sys.database_role_members](http://msdn.microsoft.com/library/ms189780.aspx)
- [sys.databases](http://msdn.microsoft.com/library/ms178534.aspx)
- [sys.default_constraints](http://msdn.microsoft.com/library/ms173758.aspx)
- [sys.extended_properties](http://msdn.microsoft.com/library/ms177541.aspx)
- [sys.external_data_sources](http://msdn.microsoft.com/library/dn935019.aspx)
- [sys.external_file_formats](http://msdn.microsoft.com/library/dn935025.aspx)
- [sys.external_tables](http://msdn.microsoft.com/library/dn935029.aspx)
- [sys.filegroups](http://msdn.microsoft.com/library/ms187782.aspx)
- [sys.foreign_key_columns](http://msdn.microsoft.com/library/ms186306.aspx)
- [sys.foreign_keys](http://msdn.microsoft.com/library/ms189807.aspx)
- [sys.identity_columns](http://msdn.microsoft.com/library/ms187334.aspx)
- [sys.index_columns](http://msdn.microsoft.com/library/ms175105.aspx)
- [sys.indexes](http://msdn.microsoft.com/library/ms173760.aspx)
- [sys.key_constraints](http://msdn.microsoft.com/library/ms174321.aspx)
- [sys.numbered_procedures](http://msdn.microsoft.com/library/ms179865.aspx)
- [sys.objects](http://msdn.microsoft.com/library/ms190324.aspx)
- [sys.parameters](http://msdn.microsoft.com/library/ms176074.aspx)
- [sys.partition_functions](http://msdn.microsoft.com/library/ms187381.aspx)
- [sys.partition_parameters](http://msdn.microsoft.com/library/ms175054.aspx)
- [sys.partition_range_values](http://msdn.microsoft.com/library/ms187780.aspx)
- [sys.partition_schemes](http://msdn.microsoft.com/library/ms189752.aspx)
- [sys.partitions](http://msdn.microsoft.com/library/ms175012.aspx)
- [sys.procedures](http://msdn.microsoft.com/library/ms188737.aspx)
- [sys.schemas](http://msdn.microsoft.com/library/ms176011.aspx)
- [sys.securable_classes](http://msdn.microsoft.com/library/ms408301.aspx)
- [sys.sql_expression_dependencies](http://msdn.microsoft.com/library/bb677315.aspx)
- [sys.sql_modules](http://msdn.microsoft.com/library/ms175081.aspx)
- [sys.stats](http://msdn.microsoft.com/library/ms177623.aspx)
- [sys.stats_columns](http://msdn.microsoft.com/library/ms187340.aspx)
- [sys.symmetric_keys](https://msdn.microsoft.com/library/ms189446.aspx)
- [sys.synonyms](https://msdn.microsoft.com/library/ms189458.aspx)
- [sys.syscharsets](https://msdn.microsoft.com/library/ms190300.aspx)
- [sys.syscolumns](https://msdn.microsoft.com/library/ms186816.aspx)
- [sys.sysdatabases](https://msdn.microsoft.com/library/ms179900.aspx)
- [sys.syslanguages](https://msdn.microsoft.com/library/ms190303.aspx)
- [sys.sysobjects](https://msdn.microsoft.com/library/ms177596.aspx)
- [sys.sysreferences](https://msdn.microsoft.com/library/ms186900.aspx)
- [sys.system_columns](http://msdn.microsoft.com/library/ms178596.aspx)
- [sys.system_objects](http://msdn.microsoft.com/library/ms173551.aspx)
- [sys.system_parameters](https://msdn.microsoft.com/library/ms174367.aspx)
- [sys.system_sql_modules](http://msdn.microsoft.com/library/ms188034.aspx)
- [sys.system_views](http://msdn.microsoft.com/library/ms187764.aspx)
- [sys.systypes](https://msdn.microsoft.com/library/ms175109.aspx)
- [sys.sysusers](https://msdn.microsoft.com/library/ms179871.aspx)
- [sys.tables](http://msdn.microsoft.com/library/ms187406.aspx)
- [sys.types](http://msdn.microsoft.com/library/ms188021.aspx)
- [sys.views](http://msdn.microsoft.com/library/ms190334.aspx)

## SQL Server DMVs available in SQL Data Warehouse

SQL Data Warehouse exposes many of the SQL Server dynamic management views (DMVs). These views, when queried in SQL Data Warehouse, are reporting the state of SQL Databases running on the distributions.

Since SQL Data Warehouse is built on Microsoft's MPP technology, both SQL Data Warehouse and Analytics Platform System's Parallel Data Warehouse (PDW) use the same system views.

This is why each of these DMV's has a specific column called pdw_node_id. This is the the identifier for the Compute node. In PDW the Compute node is a stronger concept for the architecture. In SQL Data Warehouse, the architecture relies more heavily on the distributions.

>[AZURE.NOTE] To use these view, insert ‘pdw_nodes_’ into the name, as shown in the following table.


| DMV name in SQL Data Warehouse | Link to SQL Server Transact-SQL topic on MSDN |
| :----------------------------- | :-------------------------------------------- |
| sys.dm_pdw_nodes_db_file_space_usage | [sys.dm_db_file_space_usage](http://msdn.microsoft.com/library/ms174412.aspx) |
| sys.dm_pdw_nodes_db_index_usage_stats | [sys.dm_db_index_usage_stats](http://msdn.microsoft.com/library/ms188755.aspx) |
| sys.dm_pdw_nodes_db_partition_stats | [sys.dm_db_partition_stats](http://msdn.microsoft.com/library/ms187737.aspx) |
| sys.dm_pdw_nodes_db_session_space_usage | [sys.dm_db_session_space_usage](http://msdn.microsoft.com/library/ms187938.aspx) |
| sys.dm_pdw_nodes_db_task_space_usage | [sys.dm_db_task_space_usage](http://msdn.microsoft.com/library/ms190288.aspx) |
| sys.dm_pdw_nodes_exec_background_job_queue | [sys.dm_exec_background_job_queue](http://msdn.microsoft.com/library/ms173512.aspx) |
| sys.dm_pdw_nodes_exec_background_job_queue_stats | [sys.dm_exec_background_job_queue_stats](http://msdn.microsoft.com/library/ms176059.aspx) |
| sys.dm_pdw_nodes_exec_cached_plans | [sys.dm_exec_cached_plans](http://msdn.microsoft.com/library/ms187404.aspx) |
| sys.dm_pdw_nodes_exec_connections | [sys.dm_exec_connections](http://msdn.microsoft.com/library/ms181509.aspx) |
| sys.dm_pdw_nodes_exec_procedure_stats | [sys.dm_exec_procedure_stats](http://msdn.microsoft.com/library/cc280701.aspx) |
| sys.dm_pdw_nodes_exec_query_memory_grants | [sys.dm_exec_query_memory_grants](http://msdn.microsoft.com/library/ms365393.aspx) |
| sys.dm_pdw_nodes_exec_query_optimizer_info | [sys.dm_exec_query_optimizer_info](http://msdn.microsoft.com/library/ms175002.aspx) |
| sys.dm_pdw_nodes_exec_query_resource_semaphores | [sys.dm_exec_query_resource_semaphores](http://msdn.microsoft.com/library/ms366321.aspx) |
| sys.dm_pdw_nodes_exec_query_stats | [sys.dm_exec_query_stats](http://msdn.microsoft.com/library/ms189741.aspx) |
| sys.dm_pdw_nodes_exec_requests | [sys.dm_exec_requests](http://msdn.microsoft.com/library/ms177648.aspx) |
| sys.dm_pdw_nodes_exec_sessions | [sys.dm_exec_sessions](https://msdn.microsoft.com/en-us/library/ms176013.aspx) |
| sys.dm_pdw_nodes_io_pending_io_requests | [sys.dm_io_pending_io_requests](http://msdn.microsoft.com/library/ms188762.aspx) |
| sys.dm_pdw_nodes_os_buffer_descriptors | [sys.dm_os_buffer_descriptors](http://msdn.microsoft.com/library/ms173442.aspx) |
| sys.dm_pdw_nodes_os_child_instances | [sys.dm_os_child_instances](http://msdn.microsoft.com/library/ms165698.aspx) |
| sys.dm_pdw_nodes_os_cluster_nodes | [sys.dm_os_cluster_nodes](http://msdn.microsoft.com/library/ms187341.aspx) |
| sys.dm_pdw_nodes_os_dispatcher_pools | [sys.dm_os_dispatcher_pools](http://msdn.microsoft.com/library/bb630336.aspx) |
| sys.dm_pdw_nodes_os_dispatchers | Transact-SQL Documentation is not available. |
| sys.dm_pdw_nodes_os_hosts | [sys.dm_os_hosts](http://msdn.microsoft.com/library/ms187800.aspx) |
| sys.dm_pdw_nodes_os_latch_stats | [sys.dm_os_latch_stats](http://msdn.microsoft.com/library/ms175066.aspx) |
| sys.dm_pdw_nodes_os_memory_brokers | [sys.dm_os_memory_brokers](http://msdn.microsoft.com/library/bb522548.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_clock_hands | [sys.dm_os_memory_cache_clock_hands](http://msdn.microsoft.com/library/ms173786.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_counters | [sys.dm_os_memory_cache_counters](http://msdn.microsoft.com/library/ms188760.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_entries | [sys.dm_os_memory_cache_entries](http://msdn.microsoft.com/library/ms189488.aspx) |
| sys.dm_pdw_nodes_os_memory_cache_hash_tables | [sys.dm_os_memory_cache_hash_tables](http://msdn.microsoft.com/library/ms182388.aspx) |
| sys.dm_pdw_nodes_os_memory_clerks | [sys.dm_os_memory_clerks](http://msdn.microsoft.com/library/ms175019.aspx) |
| sys.dm_pdw_nodes_os_memory_node_access_stats | Transact-SQL Documentation is not available. |
| sys.dm_pdw_nodes_os_memory_nodes | [sys.dm_os_memory_nodes](http://msdn.microsoft.com/library/bb510622.aspx) |
| sys.dm_pdw_nodes_os_memory_objects | [sys.dm_os_memory_objects](https://msdn.microsoft.com/library/ms179875.aspx) |
| sys.dm_pdw_nodes_os_memory_pools | [sys.dm_os_memory_pools](http://msdn.microsoft.com/library/ms175022.aspx) |
| sys.dm_pdw_nodes_os_nodes | [sys.dm_os_nodes](http://msdn.microsoft.com/library/bb510628.aspx) |
| sys.dm_pdw_nodes_os_performance_counters | [sys.dm_os_performance_counters](http://msdn.microsoft.com/library/ms187743.aspx) |
| sys.dm_pdw_nodes_os_process_memory | [sys.dm_os_process_memory](http://msdn.microsoft.com/library/bb510747.aspx) |
| sys.dm_pdw_nodes_os_schedulers | [sys.dm_os_schedulers](http://msdn.microsoft.com/library/ms177526.aspx) |
| sys.dm_pdw_nodes_os_spinlock_stats | Transact-SQL Documentation is not available. |
| sys.dm_pdw_nodes_os_sys_info | [sys.dm_os_sys_info](http://msdn.microsoft.com/library/ms175048.aspx) |
| sys.dm_pdw_nodes_os_sys_memory | [sys.dm_os_memory_nodes](http://msdn.microsoft.com/library/bb510622.aspx) |
| sys.dm_pdw_nodes_os_tasks | [sys.dm_os_tasks](http://msdn.microsoft.com/library/ms174963.aspx) |
| sys.dm_pdw_nodes_os_threads | [sys.dm_os_threads](http://msdn.microsoft.com/library/ms187818.aspx) |
| sys.dm_pdw_nodes_os_virtual_address_dump | [sys.dm_os_virtual_address_dump](https://msdn.microsoft.com/library/ms186294.aspx) |
| sys.dm_pdw_nodes_os_wait_stats | [sys.dm_os_wait_stats](https://msdn.microsoft.com/library/ms179984.aspx) |
| sys.dm_pdw_nodes_os_waiting_tasks | [sys.dm_os_waiting_tasks](https://msdn.microsoft.com/library/ms188743.aspx) |
| sys.dm_pdw_nodes_os_workers | [sys.dm_os_workers](https://msdn.microsoft.com/library/ms178626.aspx) |
| sys.dm_pdw_nodes_resource_governor_resource_pools | [sys.dm_resource_governor_resource_pools](http://msdn.microsoft.com/library/bb934023.aspx) |
| sys.dm_pdw_nodes_resource_governor_workload_groups | [sys.dm_resource_governor_workload_groups](http://msdn.microsoft.com/library/bb934197.aspx) |
| sys.dm_pdw_nodes_tran_active_snapshot_database_transactions | [sys.dm_tran_active_snapshot_database_transactions](http://msdn.microsoft.com/library/ms180023.aspx) |
| sys.dm_pdw_nodes_tran_active_transactions | [sys.dm_tran_active_transactions](http://msdn.microsoft.com/library/ms174302.aspx) |
| sys.dm_pdw_nodes_tran_commit_table | [sys.dm_tran_commit_table](https://msdn.microsoft.com/library/cc645959.aspx) |
| sys.dm_pdw_nodes_tran_current_snapshot | [sys.dm_tran_current_snapshot](http://msdn.microsoft.com/library/ms184390.aspx) |
| sys.dm_pdw_nodes_tran_current_transaction | [sys.dm_tran_current_transaction](https://msdn.microsoft.com/library/ms186327.aspx) |
| sys.dm_pdw_nodes_tran_database_transactions | [sys.dm_tran_database_transactions](https://msdn.microsoft.com/library/ms186957.aspx) |
| sys.dm_pdw_nodes_tran_locks | [sys.dm_tran_locks](http://msdn.microsoft.com/library/ms190345.aspx) |
| sys.dm_pdw_nodes_tran_session_transactions | [sys.dm_tran_session_transactions](http://msdn.microsoft.com/library/ms188739.aspx) |
| sys.dm_pdw_nodes_tran_top_version_generators | [sys.dm_tran_top_version_generators](http://msdn.microsoft.com/library/ms188778.aspx) |

## SQL Server 2016 PolyBase DMVs available in SQL Data Warehouse

- [sys.dm_exec_compute_node_errors](http://msdn.microsoft.com/library/mt146380.aspx)
- [sys.dm_exec_compute_node_status](http://msdn.microsoft.com/library/mt146382.aspx)
- [sys.dm_exec_compute_nodes](https://msdn.microsoft.com/library/mt130700.aspx)
- [sys.dm_exec_distributed_request_steps](https://msdn.microsoft.com/library/mt130701.aspx)
- [sys.dm_exec_distributed_requests](http://msdn.microsoft.com/library/mt146385.aspx)
- [sys.dm_exec_distributed_sql_requests](http://msdn.microsoft.com/library/mt146390.aspx)
- [sys.dm_exec_dms_services](https://msdn.microsoft.com/library/mt146374.aspx)
- [sys.dm_exec_dms_workers](https://msdn.microsoft.com/library/mt146392.aspx)
- [sys.dm_exec_external_operations](https://msdn.microsoft.com/library/mt146391.aspx)
- [sys.dm_exec_external_work](https://msdn.microsoft.com/library/mt146375.aspx)

## SQL Server INFORMATION_SCHEMA views

- [CHECK_CONSTRAINTS](http://msdn.microsoft.com/library/ms189772.aspx)
- [COLUMNS](http://msdn.microsoft.com/library/ms188348.aspx)
- [PARAMETERS](http://msdn.microsoft.com/library/ms173796.aspx)
- [ROUTINES](https://msdn.microsoft.com/library/ms188757.aspx)
- [SCHEMATA](https://msdn.microsoft.com/library/ms182642.aspx)
- [TABLES](http://msdn.microsoft.com/library/ms186224.aspx)
- [VIEW_COLUMN_USAGE](https://msdn.microsoft.com/library/ms190492.aspx)
- [VIEW_TABLE_USAGE](https://msdn.microsoft.com/library/ms173869.aspx)
- [VIEWS](http://msdn.microsoft.com/library/ms181381.aspx)

## Next steps
For more reference information, see [SQL Data Warehouse reference overview][].

<!--Image references-->

<!--Article references-->
[SQL Data Warehouse reference overview]: sql-data-warehouse-overview-reference.md

<!--MSDN references-->


<!--Other Web references-->
