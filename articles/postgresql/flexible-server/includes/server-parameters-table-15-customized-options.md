---
author: AlicjaKucharczyk
ms.author: alkuchar
ms.reviewer: maghan
ms.date: 05/15/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: include
---
### auto_explain.log_analyze

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Use EXPLAIN ANALYZE for plan logging.                                                                                                                                               |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_analyze](https://www.postgresql.org/docs/current/auto-explain.html)                                            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_buffers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log buffers usage.                                                                                                                                                                  |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_buffers](https://www.postgresql.org/docs/current/auto-explain.html)                                            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_format

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | EXPLAIN format to be used for plan logging.                                                                                                                                         |
| Data type      | enumeration |
| Default value  | `text`         |
| Allowed values | `text,xml,json,yaml`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_format](https://www.postgresql.org/docs/current/auto-explain.html)                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_level

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log level for the plan.                                                                                                                                                             |
| Data type      | enumeration |
| Default value  | `log`          |
| Allowed values | `debug5,debug4,debug3,debug2,debug1,debug,info,notice,warning,log`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_level](https://www.postgresql.org/docs/current/auto-explain.html)                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_min_duration

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the minimum execution time above which plans will be logged. Zero prints all plans. -1 turns this feature off.                                                                 |
| Data type      | integer     |
| Default value  | `-1`           |
| Allowed values | `-1-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_min_duration](https://www.postgresql.org/docs/current/auto-explain.html)                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_nested_statements

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log nested statements.                                                                                                                                                              |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_nested_statements](https://www.postgresql.org/docs/current/auto-explain.html)                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_settings

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log modified configuration parameters affecting query planning.                                                                                                                     |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_settings](https://www.postgresql.org/docs/current/auto-explain.html)                                           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_timing

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Collect timing data, not just row counts.                                                                                                                                           |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_timing](https://www.postgresql.org/docs/current/auto-explain.html)                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_triggers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Include trigger statistics in plans. This has no effect unless log_analyze is also set.                                                                                             |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_triggers](https://www.postgresql.org/docs/current/auto-explain.html)                                           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_verbose

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Use EXPLAIN VERBOSE for plan logging.                                                                                                                                               |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_verbose](https://www.postgresql.org/docs/current/auto-explain.html)                                            |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.log_wal

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log WAL usage.                                                                                                                                                                      |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [auto_explain.log_wal](https://www.postgresql.org/docs/current/auto-explain.html)                                                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### auto_explain.sample_rate

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Fraction of queries to process.                                                                                                                                                     |
| Data type      | numeric     |
| Default value  | `1`            |
| Allowed values | `0.0-1.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure.accepted_password_auth_method

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Accepted password authentication method                                                                                                                                             |
| Data type      | set         |
| Default value  | `md5`          |
| Allowed values | `md5,scram-sha-256`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure.enable_temp_tablespaces_on_local_ssd

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Create temp tablespace on ephemeral disk                                                                                                                                            |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure.extensions

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies which extensions are allowed to be created in the server.                                                                                                                 |
| Data type      | set         |
| Default value  |                |
| Allowed values | `address_standardizer,address_standardizer_data_us,amcheck,azure_ai,azure_storage,bloom,btree_gin,btree_gist,citext,cube,dblink,dict_int,dict_xsyn,earthdistance,fuzzystrmatch,hstore,hypopg,intagg,intarray,isn,lo,login_hook,ltree,orafce,pageinspect,pg_buffercache,pg_cron,pg_freespacemap,pg_hint_plan,pg_partman,pg_prewarm,pg_repack,pg_squeeze,pg_stat_statements,pg_trgm,pg_visibility,pgaudit,pgcrypto,pglogical,pgrouting,pgrowlocks,pgstattuple,plpgsql,plv8,postgis,postgis_raster,postgis_sfcgal,postgis_tiger_geocoder,postgis_topology,postgres_fdw,semver,session_variable,sslinfo,tablefunc,tds_fdw,timescaledb,tsm_system_rows,tsm_system_time,unaccent,uuid-ossp,vector` |
| Parameter type | dynamic        |
| Documentation  | [azure.extensions](../concepts-extensions.md#extension-versions) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure.single_to_flex_migration

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies if this is a server created for migrating from Azure Database for PostgreSQL Single Server to Flexible Server                                                             |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Parameter type | read-only      |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure_storage.allow_network_access

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Allow accessing data from blob storage in extension azure_storage.                                                                                                                  |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure_storage.blob_block_size_mb

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Blob block size in megabytes for blob_put in extension azure_storage.                                                                                                               |
| Data type      | integer     |
| Default value  | `512`          |
| Allowed values | `512`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Parameter type | read-only      |
| Documentation  | [azure_storage.blob_block_size_mb](/rest/api/storageservices/put-block?tabs=azure-ad#remarks)   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### azure_storage.public_account_access

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Allow all users to access data from public storage accounts in extension azure_storage.                                                                                             |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.bucket_limit

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Max login tokens per bucket.                                                                                                                                                        |
| Data type      | integer     |
| Default value  | `2000`         |
| Allowed values | `1-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.enable

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Enables temporary connection throttling per IP for too many login failures.                                                                                                         |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.factor_bias

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | The factor bias for calculating number of tokens for an IP's bucket.                                                                                                                |
| Data type      | numeric     |
| Default value  | `0.8`          |
| Allowed values | `0.0-0.9`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.hash_entries_max

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Max number of entries in the login failures hash table.                                                                                                                             |
| Data type      | integer     |
| Default value  | `500`          |
| Allowed values | `1-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.reset_time

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Time between resetting the login bucket.                                                                                                                                            |
| Data type      | integer     |
| Default value  | `120`          |
| Allowed values | `1-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.restore_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Factor to increase number of tokens by for IPs with low failure rate.                                                                                                               |
| Data type      | numeric     |
| Default value  | `2`            |
| Allowed values | `1.0-100.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### connection_throttle.update_time

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Time between updating the login bucket.                                                                                                                                             |
| Data type      | integer     |
| Default value  | `20`           |
| Allowed values | `1-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cron.database_name

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the database in which pg_cron metadata is kept.                                                                                                                                |
| Data type      | string      |
| Default value  | `postgres`     |
| Allowed values | `[A-Za-z0-9_]+`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | static         |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cron.log_run

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log all jobs runs into the job_run_details table.                                                                                                                                   |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | static         |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cron.log_statement

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Log all cron statements prior to execution.                                                                                                                                         |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | static         |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### cron.max_running_jobs

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the maximum number of jobs that can run concurrently. This value is limited by max_connections.                                                                                |
| Data type      | integer     |
| Default value  | `32`           |
| Allowed values | `0-5000`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | static         |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.analysis_interval

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the frequency at which each index optimization session is triggered when index_tuning.mode is set to 'REPORT'.                                                                 |
| Data type      | integer     |
| Default value  | `720`          |
| Allowed values | `60-10080`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.analysis_interval](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_columns_per_index

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Maximum number of columns that can be part of the index key for any recommended index.                                                                                              |
| Data type      | integer     |
| Default value  | `2`            |
| Allowed values | `1-10`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_columns_per_index](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_index_count

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Maximum number of indexes that can be recommended for each database during one optimization session.                                                                                |
| Data type      | integer     |
| Default value  | `10`           |
| Allowed values | `1-25`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_index_count](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_indexes_per_table

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Maximum number of indexes that can be recommended for each table.                                                                                                                   |
| Data type      | integer     |
| Default value  | `10`           |
| Allowed values | `1-25`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_indexes_per_table](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_queries_per_database

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Number of slowest queries per database for which indexes can be recommended.                                                                                                        |
| Data type      | integer     |
| Default value  | `25`           |
| Allowed values | `5-100`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_queries_per_database](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_regression_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Acceptable regression introduced by a recommended index on any of the queries analyzed during one optimization session.                                                             |
| Data type      | numeric     |
| Default value  | `0.1`          |
| Allowed values | `0.05-0.2`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_regression_factor](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.max_total_size_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Maximum total size, in percentage of total disk space, that all recommended indexes for any given database can use.                                                                 |
| Data type      | numeric     |
| Default value  | `0.1`          |
| Allowed values | `0-1.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.max_total_size_factor](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.min_improvement_factor

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Cost improvement that a recommended index must provide to at least one of the queries analyzed during one optimization session.                                                     |
| Data type      | numeric     |
| Default value  | `0.2`          |
| Allowed values | `0-20.0`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.min_improvement_factor](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Configures index optimization as disabled ('OFF') or enabled to only emit recommendation. Requires Query Store to be enabled by setting pg_qs.query_capture_mode to 'TOP' or 'ALL'. |
| Data type      | enumeration |
| Default value  | `off`          |
| Allowed values | `off,report`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.mode](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.unused_dml_per_table

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Minimum number of daily average DML operations affecting the table, so that their unused indexes are considered for dropping.                                                       |
| Data type      | integer     |
| Default value  | `1000`         |
| Allowed values | `0-9999999`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.unused_dml_per_table](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.unused_min_period

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Minimum number of days the index has not been used, based on system statistics, so that it is considered for dropping.                                                              |
| Data type      | integer     |
| Default value  | `35`           |
| Allowed values | `30-720`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.unused_min_period](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### index_tuning.unused_reads_per_table

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Minimum number of daily average read operations affecting the table, so that their unused indexes are considered for dropping.                                                      |
| Data type      | integer     |
| Default value  | `1000`         |
| Allowed values | `0-9999999`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  | [index_tuning.unused_reads_per_table](../how-to-configure-index-tuning.md#configuration-options) |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies which classes of statements will be logged by session audit logging.                                                                                                      |
| Data type      | set         |
| Default value  | `none`         |
| Allowed values | `none,read,write,function,role,ddl,misc,all`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                          |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_catalog

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies that session logging should be enabled in the case where all relations in a statement are in pg_catalog.                                                                  |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_catalog](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_client

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies whether audit messages should be visible to client.                                                                                                                       |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_client](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_level

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies the log level that will be used for log entries.                                                                                                                          |
| Data type      | enumeration |
| Default value  | `log`          |
| Allowed values | `debug5,debug4,debug3,debug2,debug1,info,notice,warning,log`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_level](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                    |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_parameter

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies that audit logging should include the parameters that were passed with the statement.                                                                                     |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_parameter](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_relation

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies whether session audit logging should create a separate log entry for each relation referenced in a SELECT or DML statement.                                               |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_relation](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                 |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.log_statement_once

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies whether logging will include the statement text and parameters with the first log entry for a statement/substatement combination or with every entry.                     |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.log_statement_once](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                           |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgaudit.role

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Specifies the master role to use for object audit logging.                                                                                                                          |
| Data type      | string      |
| Default value  |                |
| Allowed values | `[A-Za-z\\._]*`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | dynamic        |
| Documentation  | [pgaudit.role](https://github.com/pgaudit/pgaudit/blob/master/README.md)                                                         |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pglogical.batch_inserts

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Tells PGLogical to use batch insert mechanism if possible.                                                                                                                          |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pglogical.batch_inserts](https://github.com/ArmMbedCloud/pglogical)                                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pglogical.conflict_log_level

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the log level for reporting detected conflicts when the pglogical.conflict_resolution is set to anything else than error.                                                      |
| Data type      | enumeration |
| Default value  | `log`          |
| Allowed values | `debug5,debug4,debug3,debug2,debug1,info,notice,warning,error,log,fatal,panic`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  | [pglogical.conflict_log_level](https://github.com/ArmMbedCloud/pglogical)                                                        |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pglogical.conflict_resolution

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the resolution method for any detected conflicts between local data and incoming changes.                                                                                      |
| Data type      | enumeration |
| Default value  | `apply_remote` |
| Allowed values | `error,apply_remote,keep_local,last_update_wins,first_update_wins`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Parameter type | dynamic        |
| Documentation  | [pglogical.conflict_resolution](https://github.com/ArmMbedCloud/pglogical)                                                       |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pglogical.use_spi

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Tells PGLogical to use SPI interface to form actual SQL (INSERT, UPDATE, DELETE) statements to apply incoming changes instead of using internal low level interface.                |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pglogical.use_spi](https://github.com/ArmMbedCloud/pglogical)                                                                   |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgms_stats.is_enabled_fs

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Enables or disables pgms_stats. On means the extension is running.                                                                                                                  |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Parameter type | read-only      |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgms_wait_sampling.history_period

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Set the frequency, in milliseconds, at which wait events are sampled.                                                                                                               |
| Data type      | integer     |
| Default value  | `100`          |
| Allowed values | `1-600000`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgms_wait_sampling.is_enabled_fs

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Enables or disables pgms_wait_sampling. Off means pgms_wait_sampling isn't available to be turned on.                                                                               |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Parameter type | read-only      |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pgms_wait_sampling.query_capture_mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Selects which statements are tracked by the pgms_wait_sampling extension.                                                                                                           |
| Data type      | enumeration |
| Default value  | `none`         |
| Allowed values | `all,none`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_partman_bgw.analyze

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Same purpose as the p_analyze argument to run_maintenance().                                                                                                                        |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_partman_bgw.dbname

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Required. The database(s) that run_maintenance() will run on. If more than one, use a comma separated list. If not set, BGW will do nothing.                                        |
| Data type      | string      |
| Default value  |                |
| Allowed values | `[A-Za-z0-9_,]*`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_partman_bgw.interval

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Number of seconds between calls to run_maintenance().                                                                                                                               |
| Data type      | integer     |
| Default value  | `3600`         |
| Allowed values | `1-315360000`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_partman_bgw.jobmon

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Same purpose as the p_jobmon argument to run_maintenance().                                                                                                                         |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_partman_bgw.role

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | The role that run_maintenance() will run as. Default is postgres. Only a single role name is allowed.                                                                               |
| Data type      | string      |
| Default value  | `postgres`     |
| Allowed values | `[A-Za-z\\._]*`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.interval_length_minutes

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the query_store capture interval in minutes for pg_qs - this is the frequency of data persistence.                                                                             |
| Data type      | integer     |
| Default value  | `15`           |
| Allowed values | `1-30`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Parameter type | static         |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.is_enabled_fs

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Enables or disables pg_qs. off means pg_qs isn't avaible to be turned on.                                                                                                           |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Parameter type | read-only      |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.max_plan_size

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the maximum number of bytes that will be saved for query plan text  for pg_qs; longer plans will be truncated.                                                                 |
| Data type      | integer     |
| Default value  | `7500`         |
| Allowed values | `100-10000`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.max_query_text_length

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the maximum query text length that will be saved; longer queries will be truncated.                                                                                            |
| Data type      | integer     |
| Default value  | `6000`         |
| Allowed values | `100-10000`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.query_capture_mode

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets query capture mode for query store. None disables any capturing.                                                                                                               |
| Data type      | enumeration |
| Default value  | `none`         |
| Allowed values | `top,all,none`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.retention_period_in_days

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the retention period window in days for pg_qs - after this time data will be deleted.                                                                                          |
| Data type      | integer     |
| Default value  | `7`            |
| Allowed values | `1-30`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.store_query_plans

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Turns saving query plans on or off for pg_qs                                                                                                                                        |
| Data type      | boolean     |
| Default value  | `off`          |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_qs.track_utility

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Selects whether utility commands are tracked by pg_qs.                                                                                                                              |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_stat_statements.max

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Sets the maximum number of statements tracked by pg_stat_statements.                                                                                                                |
| Data type      | integer     |
| Default value  | `5000`         |
| Allowed values | `100-2147483647`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Parameter type | static         |
| Documentation  | [pg_stat_statements.max](https://www.postgresql.org/docs/15/pgstatstatements.html)                                               |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_stat_statements.save

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Save pg_stat_statements statistics across server shutdowns.                                                                                                                         |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pg_stat_statements.save](https://www.postgresql.org/docs/15/pgstatstatements.html)                                              |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_stat_statements.track

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Controls which statements are counted by pg_stat_statements.                                                                                                                        |
| Data type      | enumeration |
| Default value  | `none`         |
| Allowed values | `top,all,none`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Parameter type | dynamic        |
| Documentation  | [pg_stat_statements.track](https://www.postgresql.org/docs/15/pgstatstatements.html)                                             |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### pg_stat_statements.track_utility

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Selects whether utility commands are tracked by pg_stat_statements.                                                                                                                 |
| Data type      | boolean     |
| Default value  | `on`           |
| Allowed values | `on,off`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  | [pg_stat_statements.track_utility](https://www.postgresql.org/docs/15/pgstatstatements.html)                                     |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



### postgis.gdal_enabled_drivers

| Attribute      | Value                                                      |
|----------------|------------------------------------------------------------|
| Category       | Customized Options |
| Description    | Controls postgis GDAL enabled driver settings.                                                                                                                                      |
| Data type      | enumeration |
| Default value  | `DISABLE_ALL`  |
| Allowed values | `DISABLE_ALL,ENABLE_ALL`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Parameter type | dynamic        |
| Documentation  |                                                                                                                                  |


[!INCLUDE [server-parameters-azure-notes-void](./server-parameters-azure-notes-void.md)]



