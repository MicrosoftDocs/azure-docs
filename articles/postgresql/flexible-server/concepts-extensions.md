---
title: Extensions
description: Learn about the available PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server.
author: varun-dhawan
ms.author: varundhawan
ms.date: 3/19/2024
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
---

# PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

Azure Database for PostgreSQL flexible server provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects in a single package that can be loaded or removed from your database with a command. After being loaded into the database, extensions function like built-in features.

## How to use PostgreSQL extensions

Before installing extensions in Azure Database for PostgreSQL flexible server, you need to allowlist these extensions for use.

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL flexible server instance.
   1. On the sidebar, select **Server Parameters**.
   1. Search for the `azure.extensions` parameter.
   1. Select extensions you wish to allowlist.
     :::image type="content" source="./media/concepts-extensions/allow-list.png" alt-text="Screenshot showing Azure Database for PostgreSQL flexible server - allow-listing extensions for installation." lightbox="./media/concepts-extensions/allow-list.png":::

Using [Azure CLI](/cli/azure/):

   You can allowlist extensions via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true).

   ```bash
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name azure.extensions --value <extension name>,<extension name>
   ```

   Using [ARM Template](../../azure-resource-manager/templates/index.yml):
   Example shown below allowlists extensions dblink, dict_xsyn, pg_buffercache on the server mypostgreserver

```json
{

    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",

    "contentVersion": "1.0.0.0",

    "parameters": {

        "flexibleServers_name": {

            "defaultValue": "mypostgreserver",

            "type": "String"

        },

        "azure_extensions_set_value": {

            "defaultValue": " dblink,dict_xsyn,pg_buffercache",

            "type": "String"

        }

    },

    "variables": {},

    "resources": [

        {

            "type": "Microsoft.DBforPostgreSQL/flexibleServers/configurations",

            "apiVersion": "2021-06-01",

            "name": "[concat(parameters('flexibleServers_name'), '/azure.extensions')]",

            "properties": {

                "value": "[parameters('azure_extensions_set_value')]",

                "source": "user-override"

            }

        }

    ]

}
  ```

`shared_preload_libraries` is a server configuration parameter determining which libraries are to be loaded when Azure Database for PostgreSQL flexible server starts. Any libraries, which use shared memory must be loaded via this parameter. If your extension needs to be added to shared preload libraries this action can be done:

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL flexible server instance.
   1. On the sidebar, select **Server Parameters**.
   1. Search for the `shared_preload_libraries` parameter.
   1. Select extensions you wish to add.
     :::image type="content" source="./media/concepts-extensions/shared-libraries.png" alt-text="Screenshot showing Azure Database for PostgreSQL -setting shared preload libraries parameter setting for extensions installation." lightbox="./media/concepts-extensions/shared-libraries.png":::

Using [Azure CLI](/cli/azure/):

   You can set `shared_preload_libraries` via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true).

   ```bash
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name shared_preload_libraries --value <extension name>,<extension name>
   ```

After extensions are allow-listed and loaded, these must be installed in your database before you can use them. To install a particular extension, you should run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command. This command loads the packaged objects into your database.

> [!NOTE]  
> Third party extensions offered in Azure Database for PostgreSQL flexible server are open source licensed code. Currently, we don't offer any third party extensions or extension versions with premium or proprietary licensing models.

Azure Database for PostgreSQL flexible server instance supports a subset of key PostgreSQL extensions as listed below. This information is also available by running `SHOW azure.extensions;`. Extensions not listed in this document aren't supported on Azure Database for PostgreSQL flexible server. You can't create or load your own extension in Azure Database for PostgreSQL flexible server.

## Extension versions

The following extensions are available in Azure Database for PostgreSQL flexible server:

|**Extension Name**                                                                          |**Description**                                                                                                                                                  |**Postgres 16**|**Postgres 15**|**Postgres 14**|**Postgres 13**|**Postgres 12**|**Postgres 11**|
|--------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------|-----------|-----------|-----------|-----------|-----------|------------|
|[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)        |Used to parse an address into constituent elements.                                                                                                              |3.3.3      |3.1.1      |3.1.1      |3.1.1      |3.0.0      |2.5.1       |
|[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)|Address Standardizer US dataset example.                                                                                                                         |3.3.3      |3.1.1      |3.1.1      |3.1.1      |3.0.0      |2.5.1       |
|[amcheck](https://www.postgresql.org/docs/13/amcheck.html)                                  |Functions for verifying the logical consistency of the structure of relations.                                                                                   |1.3        |1.2        |1.2        |1.2        |1.2        |1.1         |
|[anon](https://gitlab.com/dalibo/postgresql_anonymizer)                                     |Mask or replace personally identifiable information (PII) or commercially sensitive data from a PostgreSQL database.                                             |1.2.0      |1.2.0      |1.2.0      |1.2.0      |1.2.0      |N/A         |
|[azure_ai](./generative-ai-azure-overview.md)                                               |Azure OpenAI and Cognitive Services integration for PostgreSQL.                                                                                                  |0.1.0      |0.1.0      |0.1.0      |0.1.0      |N/A        |N/A         |
|[azure_storage](../../postgresql/flexible-server/concepts-storage-extension.md)             |Extension to export and import data from Azure Storage.                                                                                                          |1.3        |1.3        |1.3        |1.3        |1.3        |N/A         |
|[bloom](https://www.postgresql.org/docs/13/bloom.html)                                      |Bloom access method - signature file based index.                                                                                                                |1          |1          |1          |1          |1          |1           |
|[btree_gin](https://www.postgresql.org/docs/13/btree-gin.html)                              |Support for indexing common datatypes in GIN.                                                                                                                    |1.3        |1.3        |1.3        |1.3        |1.3        |1.3         |
|[btree_gist](https://www.postgresql.org/docs/13/btree-gist.html)                            |Support for indexing common datatypes in GiST.                                                                                                                   |1.7        |1.5        |1.5        |1.5        |1.5        |1.5         |
|[citext](https://www.postgresql.org/docs/13/citext.html)                                    |Data type for case-insensitive character strings.                                                                                                                |1.6        |1.6        |1.6        |1.6        |1.6        |1.5         |
|[cube](https://www.postgresql.org/docs/13/cube.html)                                        |Data type for multidimensional cubes.                                                                                                                            |1.5        |1.4        |1.4        |1.4        |1.4        |1.4         |
|[dblink](https://www.postgresql.org/docs/13/dblink.html)                                    |Connect to other PostgreSQL databases from within a database.                                                                                                    |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[dict_int](https://www.postgresql.org/docs/13/dict-int.html)                                |Text search dictionary template for integers.                                                                                                                    |1          |1          |1          |1          |1          |1           |
|[dict_xsyn](https://www.postgresql.org/docs/13/dict-xsyn.html)                              |Text search dictionary template for extended synonym processing.                                                                                                 |1          |1          |1          |1          |1          |1           |
|[earthdistance](https://www.postgresql.org/docs/13/earthdistance.html)                      |Calculate great-circle distances on the surface of the Earth.                                                                                                    |1.1        |1.1        |1.1        |1.1        |1.1        |1.1         |
|[fuzzystrmatch](https://www.postgresql.org/docs/13/fuzzystrmatch.html)                      |Determine similarities and distance between strings.                                                                                                             |1.2        |1.1        |1.1        |1.1        |1.1        |1.1         |
|[hstore](https://www.postgresql.org/docs/13/hstore.html)                                    |Data type for storing sets of (key, value) pairs.                                                                                                                |1.8        |1.7        |1.7        |1.7        |1.2        |1.1.2       |
|[hypopg](https://github.com/HypoPG/hypopg)                                                  |Extension adding support for hypothetical indexes.                                                                                                               |1.3.1      |1.3.1      |1.3.1      |1.3.1      |1.6        |1.5         |
|[intagg](https://www.postgresql.org/docs/13/intagg.html)                                    |Integer aggregator and enumerator. (Obsolete)                                                                                                                    |1.1        |1.1        |1.1        |1.1        |1.1        |1.1         |
|[intarray](https://www.postgresql.org/docs/13/intarray.html)                                |Functions, operators, and index support for 1-D arrays of integers.                                                                                              |1.5        |1.3        |1.3        |1.3        |1.2        |1.2         |
|[isn](https://www.postgresql.org/docs/13/isn.html)                                          |Data types for international product numbering standards: EAN13, UPC, ISBN (books), ISMN (music), and ISSN (serials).                                            |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[lo](https://www.postgresql.org/docs/13/lo.html)                                            |Large object maintenance.                                                                                                                                        |1.1        |1.1        |1.1        |1.1        |1.1        |1.1         |
|[login_hook](https://github.com/splendiddata/login_hook)                                    |Extension to execute some code on user login, comparable to Oracle's after logon trigger.                                                                        |1.5        |1.4        |1.4        |1.4        |1.4        |1.4         |
|[ltree](https://www.postgresql.org/docs/13/ltree.html)                                      |Data type for hierarchical tree-like structures.                                                                                                                 |1.2        |1.2        |1.2        |1.2        |1.1        |1.1         |
|[orafce](https://github.com/orafce/orafce)                                                  |Implements in Postgres some of the functions from the Oracle database that are missing.                                                                          |4.4        |3.24       |3.18       |3.18       |3.18       |3.18        |
|[pageinspect](https://www.postgresql.org/docs/13/pageinspect.html)                          |Inspect the contents of database pages at a low level.                                                                                                           |1.12       |1.8        |1.8        |1.8        |1.7        |1.7         |
|[pg_anon](https://gitlab.com/dalibo/postgresql_anonymizer)                                  |Mask or replace personally identifiable information  (PII) or commercially sensitive data from a PostgreSQL database.                                            |1.2.0      |1.2.0      |1.2.0      |1.2.0      |1.2.0      |N/A         |
|[pg_buffercache](https://www.postgresql.org/docs/13/pgbuffercache.html)                     |Examine the shared buffer cache.                                                                                                                                 |1.4        |1.3        |1.3        |1.3        |1.3        |1.3         |
|[pg_cron](https://github.com/citusdata/pg_cron)                                             |Job scheduler for PostgreSQL.                                                                                                                                    |1.5        |1.4        |1.4        |1.4        |1.4        |1.4         |
|[pg_failover_slots](https://github.com/EnterpriseDB/pg_failover_slots) (preview)            |Logical replication slot manager for failover purposes.                                                                                                          |1.0.1      |1.0.1      |1.0.1      |1.0.1      |1.0.1      |1.0.1       |
|[pg_freespacemap](https://www.postgresql.org/docs/13/pgfreespacemap.html)                   |Examine the free space map (FSM).                                                                                                                                |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[pg_hint_plan](https://github.com/ossc-db/pg_hint_plan)                                     |Makes it possible to tweak PostgreSQL execution plans using so-called "hints" in SQL comments.                                                                   |1.6.0      |1.4        |1.4        |1.4        |1.4        |1.4         |
|[pg_partman](https://github.com/pgpartman/pg_partman)                                       |Manage partitioned tables by time or ID.                                                                                                                         |4.7.1      |4.7.1      |4.6.1      |4.5.0      |4.5.0      |4.5.0       |
|[pg_prewarm](https://www.postgresql.org/docs/13/pgprewarm.html)                             |Prewarm relation data.                                                                                                                                           |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[pg_repack](https://reorg.github.io/pg_repack/)                                             |Lets you remove bloat from tables and indexes.                                                                                                                   |1.4.7      |1.4.7      |1.4.7      |1.4.7      |1.4.7      |1.4.7       |
|[pg_squeeze](https://github.com/cybertec-postgresql/pg_squeeze)                             |A tool to remove unused space from a relation.                                                                                                                   |1.6        |1.5        |1.5        |1.5        |1.5        |1.5         |
|[pg_stat_statements](https://www.postgresql.org/docs/13/pgstatstatements.html)              |Track execution statistics of all SQL statements executed.                                                                                                       |1.1        |1.8        |1.8        |1.8        |1.7        |1.6         |
|[pg_trgm](https://www.postgresql.org/docs/13/pgtrgm.html)                                   |Text similarity measurement and index searching based on trigrams.                                                                                               |1.6        |1.5        |1.5        |1.5        |1.4        |1.4         |
|[pg_visibility](https://www.postgresql.org/docs/13/pgvisibility.html)                       |Examine the visibility map (VM) and page-level visibility info.                                                                                                  |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[pgaudit](https://www.pgaudit.org/)                                                         |Provides auditing functionality.                                                                                                                                 |16.0       |1.7        |1.6.2      |1.5        |1.4        |1.3.1       |
|[pgcrypto](https://www.postgresql.org/docs/13/pgcrypto.html)                                |Cryptographic functions.                                                                                                                                         |1.3        |1.3        |1.3        |1.3        |1.3        |1.3         |
|[pglogical](https://github.com/2ndQuadrant/pglogical)                                       |Logical streaming replication.                                                                                                                                   |2.4.4      |2.3.2      |2.3.2      |2.3.2      |2.3.2      |2.3.2       |
|[pgrouting](https://pgrouting.org/)                                                         |Geospatial database to provide geospatial routing.                                                                                                               |N/A        |3.3.0      |3.3.0      |3.3.0      |3.3.0      |3.3.0       |
|[pgrowlocks](https://www.postgresql.org/docs/13/pgrowlocks.html)                            |Show row-level locking information.                                                                                                                              |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[pgstattuple](https://www.postgresql.org/docs/13/pgstattuple.html)                          |Show tuple-level statistics.                                                                                                                                     |1.5        |1.5        |1.5        |1.5        |1.5        |1.5         |
|[pgvector](https://github.com/pgvector/pgvector)                                            |Open-source vector similarity search for Postgres.                                                                                                               |0.6.0      |0.6.0      |0.6.0      |0.6.0      |0.6.0      |0.5.1       |
|[plpgsql](https://www.postgresql.org/docs/13/plpgsql.html)                                  |PL/pgSQL procedural language.                                                                                                                                    |1          |1          |1          |1          |1          |1           |
|[plv8](https://github.com/plv8/plv8)                                                        |Trusted JavaScript language extension.                                                                                                                           |3.1.7      |3.1.7      |3.0.0      |3.0.0      |3.2.0      |3.0.0       |
|[postgis](https://www.postgis.net/)                                                         |PostGIS geometry, geography.                                                                                                                                     |3.3.3      |3.2.0      |3.2.0      |3.2.0      |3.2.0      |2.5.5       |
|[postgis_raster](https://www.postgis.net/)                                                  |PostGIS raster types and functions.                                                                                                                              |3.3.3      |3.2.0      |3.2.0      |3.2.0      |3.2.0      |N/A         |
|[postgis_sfcgal](https://www.postgis.net/)                                                  |PostGIS SFCGAL functions.                                                                                                                                        |3.3.3      |3.2.0      |3.2.0      |3.2.0      |3.2.0      |2.5.5       |
|[postgis_tiger_geocoder](https://www.postgis.net/)                                          |PostGIS tiger geocoder and reverse geocoder.                                                                                                                     |3.3.3      |3.2.0      |3.2.0      |3.2.0      |3.2.0      |2.5.5       |
|[postgis_topology](https://postgis.net/docs/Topology.html)                                  |PostGIS topology spatial types and functions.                                                                                                                    |3.3.3      |3.2.0      |3.2.0      |3.2.0      |3.2.0      |2.5.5       |
|[postgres_fdw](https://www.postgresql.org/docs/13/postgres-fdw.html)                        |Foreign-data wrapper for remote PostgreSQL servers.                                                                                                              |1.1        |1          |1          |1          |1          |1           |
|[semver](https://pgxn.org/dist/semver/doc/semver.html)                                      |Semantic version data type.                                                                                                                                      |0.32.1     |0.32.0     |0.32.0     |0.32.0     |0.32.0     |0.32.0      |
|[session_variable](https://github.com/splendiddata/session_variable)                        |Provides a way to create and maintain session scoped variables and constants.                                                                                    |3.3        |3.3        |3.3        |3.3        |3.3        |3.3         |
|[sslinfo](https://www.postgresql.org/docs/13/sslinfo.html)                                  |Information about SSL certificates.                                                                                                                              |1.2        |1.2        |1.2        |1.2        |1.2        |1.2         |
|[tablefunc](https://www.postgresql.org/docs/11/tablefunc.html)                              |Functions that manipulate whole tables, including crosstab.                                                                                                      |1          |1          |1          |1          |1          |1           |
|[tds_fdw](https://github.com/tds-fdw/tds_fdw)                                               |PostgreSQL foreign data wrapper that can connect to databases that use the Tabular Data Stream (TDS) protocol, such as Sybase databases and Microsoft SQL server.|2.0.3      |2.0.3      |2.0.3      |2.0.3      |2.0.3      |2.0.3       |
|[timescaledb](https://github.com/timescale/timescaledb)                                     |Open-source relational database for time-series and analytics.                                                                                                   |N/A        |2.5.1      |2.5.1      |2.5.1      |2.5.1      |1.7.4       |
|[tsm_system_rows](https://www.postgresql.org/docs/13/tsm-system-rows.html)                  |TABLESAMPLE method which accepts number of rows as a limit.                                                                                                      |1          |1          |1          |1          |1          |1           |
|[tsm_system_time](https://www.postgresql.org/docs/13/tsm-system-time.html)                  |TABLESAMPLE method which accepts time in milliseconds as a limit.                                                                                                |1          |1          |1          |1          |1          |1           |
|[unaccent](https://www.postgresql.org/docs/13/unaccent.html)                                |Text search dictionary that removes accents.                                                                                                                     |1.1        |1.1        |1.1        |1.1        |1.1        |1.1         |
|[uuid-ossp](https://www.postgresql.org/docs/13/uuid-ossp.html)                              |Generate universally unique identifiers (UUIDs).                                                                                                                 |1.1        |1.1        |1.1        |1.1        |1.1        |1.1         |

## dblink and postgres_fdw

[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) and [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) allow you to connect from one Azure Database for PostgreSQL flexible server instance to another, or to another database in the same server. Azure Database for PostgreSQL flexible server supports both incoming and outgoing connections to any PostgreSQL server. The sending server needs to allow outbound connections to the receiving server. Similarly, the receiving server needs to allow connections from the sending server.

We recommend deploying your servers with [virtual network integration](concepts-networking.md) if you plan to use these two extensions. By default virtual network integration allows connections between servers in the virtual network. You can also choose to use [virtual network network security groups](../../virtual-network/manage-network-security-group.md) to customize access.

## pg_prewarm

The pg_prewarm extension loads relational data into cache. Prewarming your caches means that your queries have better response times on their first run after a restart. The auto-prewarm functionality isn't currently available in Azure Database for PostgreSQL flexible server.

## pg_cron

[pg_cron](https://github.com/citusdata/pg_cron/) is a simple, cron-based job scheduler for PostgreSQL that runs inside the database as an extension. The pg_cron extension can be used to run scheduled maintenance tasks within a PostgreSQL database. For example, you can run periodic vacuum of a table or removing old data jobs.

`pg_cron` can run multiple jobs in parallel, but it runs at most one instance of a job at a time. If a second run is supposed to start before the first one finishes, then the second run is queued and started as soon as the first run completes. This ensures that jobs run exactly as many times as scheduled and don't run concurrently with themselves.

Some examples:

To delete old data on Saturday at 3:30am (GMT)

```
SELECT cron.schedule('30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$);
```
To run vacuum every day at 10:00am (GMT) in default database 'postgres'


```
SELECT cron.schedule('0 10 * * *', 'VACUUM');
```

To unschedule all tasks from pg_cron

```
SELECT cron.unschedule(jobid) FROM cron.job;
```
To see all jobs currently scheduled with pg_cron


```
SELECT * FROM cron.job;
```
To run vacuum every day at 10:00 am (GMT) in database 'testcron' under azure_pg_admin role account


```
SELECT cron.schedule_in_database('VACUUM','0 10 * * * ','VACUUM','testcron',null,TRUE)
```

> [!NOTE]  
> pg_cron extension is preloaded in shared_preload_libraries for every Azure Database for PostgreSQL flexible server instance inside postgres database to provide you with ability to schedule jobs to run in other databases within your Azure Database for PostgreSQL flexible server DB instance without compromising security. However, for security reasons, you still have to [allow list](#how-to-use-postgresql-extensions) pg_cron extension and install it using [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command.

Starting with pg_cron version 1.4, you can use the cron.schedule_in_database and cron.alter_job functions to schedule your job in a specific database and update an existing schedule respectively.

Some examples:

To delete old data on Saturday at 3:30am (GMT) on database DBName

```
SELECT cron.schedule_in_database('JobName', '30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$,'DBName');
```
> [!NOTE]  
> cron_schedule_in_database function allows for user name as optional parameter. Setting the username to a non-null value requires PostgreSQL superuser privilege and is not supported in Azure Database for PostgreSQL flexible server. Preceding examples show running this function with optional user name parameter ommitted or set to null, which runs the job in context of user scheduling the job, which should have azure_pg_admin role privileges.

To update or change the database name for the existing schedule

```
select cron.alter_job(job_id:=MyJobID,database:='NewDBName');
```

## pg_failover_slots (preview)

The PG Failover Slots extension enhances Azure Database for PostgreSQL flexible server when operating with both logical replication and high availability enabled servers. It effectively addresses the challenge within the standard PostgreSQL engine that doesn't preserve logical replication slots after a failover. Maintaining these slots is critical to prevent replication pauses or data mismatches during primary server role changes, ensuring operational continuity and data integrity.

The extension streamlines the failover process by managing the necessary transfer, cleanup, and synchronization of replication slots, thus providing a seamless transition during server role changes.
The extension is supported for PostgreSQL versions 16 to 11.

You can find more information and how to use the PG Failover Slots extension on its [GitHub page](https://github.com/EnterpriseDB/pg_failover_slots).

### Enable pg_failover_slots

To enable the PG Failover Slots extension for your Azure Database for PostgreSQL flexible server instance, you need to modify the server's configuration by including the extension in the server's shared preload libraries and adjusting a specific server parameter. Here's the process:

1. Add `pg_failover_slots` to the server's shared preload libraries by updating the `shared_preload_libraries` parameter.
1. Change the server parameter `hot_standby_feedback` to `on`.

Any changes to the `shared_preload_libraries` parameter require a server restart to take effect.

Follow these steps in the Azure portal:

1. Sign in to the [Azure portal](https://portal.azure.com/) and go to your Azure Database for PostgreSQL flexible server instance's page.
1. In the menu on the left, select **Server parameters**.
1. Find the `shared_preload_libraries` parameter in the list and edit its value to include `pg_failover_slots`.
1. Search for the `hot_standby_feedback` parameter and set its value to `on`.
1. Select on **Save** to preserve your changes. Now, you'll have the option to **Save and restart**. Choose this to ensure that the changes take effect since modifying `shared_preload_libraries` requires a server restart.

By selecting **Save and restart**, your server will automatically reboot, applying the changes you've made. Once the server is back online, the PG Failover Slots extension is enabled and operational on your primary Azure Database for PostgreSQL flexible server instance, ready to handle logical replication slots during failovers.

## pg_stat_statements

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) gives you a view of all the queries that have run on your database. That is useful to get an understanding of what your query workload performance looks like on a production system.

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded in shared_preload_libraries on every Azure Database for PostgreSQL flexible server instance to provide you a means of tracking execution statistics of SQL statements.
However, for security reasons, you still have to [allowlist](#how-to-use-postgresql-extensions)  [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) and install it using [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter.

There's a tradeoff between the query execution information pg_stat_statements provides and the impact on server performance as it logs each SQL statement. If you aren't actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Some third-party monitoring services might rely on pg_stat_statements to deliver query performance insights, so confirm whether this is the case for you or not.

## TimescaleDB

TimescaleDB is a time-series database that is packaged as an extension for PostgreSQL. TimescaleDB provides time-oriented analytical functions, optimizations, and scales Postgres for time-series workloads.
[Learn more about TimescaleDB](https://docs.timescale.com/timescaledb/latest/), a registered trademark of Timescale, Inc. Azure Database for PostgreSQL flexible server provides the TimescaleDB [Apache-2 edition](https://www.timescale.com/legal/licenses).
### Install TimescaleDB

To install TimescaleDB, in addition, to allow listing it, as shown [above](#how-to-use-postgresql-extensions), you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).
Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL flexible server instance.

1. On the sidebar, select **Server Parameters**.

1. Search for the `shared_preload_libraries` parameter.

1. Select **TimescaleDB**.

1. Select **Save** to preserve your changes. You get a notification once the change is saved.

1. After the notification, **restart** the server to apply these changes.

You can now enable TimescaleDB in your Azure Database for PostgreSQL flexible server database. Connect to the database and issue the following command:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```
> [!TIP]  
> If you see an error, confirm that you [restarted your server](how-to-restart-server-portal.md) after saving shared_preload_libraries.

You can now create a TimescaleDB hypertable [from scratch](https://docs.timescale.com/getting-started/creating-hypertables) or migrate [existing time-series data in PostgreSQL](https://docs.timescale.com/getting-started/migrating-data).

### Restore a Timescale database using pg_dump and pg_restore

To restore a Timescale database using pg_dump and pg_restore, you must run two helper procedures in the destination database: `timescaledb_pre_restore()` and `timescaledb_post restore()`.

First, prepare the destination database:

```SQL
--create the new database where you'll perform the restore
CREATE DATABASE tutorial;
\c tutorial --connect to the database
CREATE EXTENSION timescaledb;

SELECT timescaledb_pre_restore();
```

Now you can run pg_dump on the original database and then do pg_restore. After the restore, be sure to run the following command in the restored database:

```SQL
SELECT timescaledb_post_restore();
```
For more details on restore method with Timescale enabled database, see [Timescale documentation](https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/pg-dump-and-restore/#restore-your-entire-database-from-backup)


### Restore a Timescale database using timescaledb-backup

While running `SELECT timescaledb_post_restore()` procedure listed above you might get permissions denied error updating timescaledb.restoring flag. This is due to limited ALTER DATABASE permission in Cloud PaaS database services. In this case you can perform alternative method using `timescaledb-backup` tool to backup and restore Timescale database. Timescaledb-backup is a program for making dumping and restoring a TimescaleDB database simpler, less error-prone, and more performant.  
To do so, you should do following
   1. Install  tools as detailed [here](https://github.com/timescale/timescaledb-backup#installing-timescaledb-backup)
   1. Create a target Azure Database for PostgreSQL flexible server instance and database
   1. Enable Timescale extension as shown above
   1. Grant azure_pg_admin [role](https://www.postgresql.org/docs/11/database-roles.html) to user that will be used by [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore)
   1. Run [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore) to restore database

More details on these utilities can be found [here](https://github.com/timescale/timescaledb-backup).  
> [!NOTE]  
> When using `timescale-backup` utilities to restore to Azure, since database user names for Azure Database for PostgreSQL single server must use the `<user@db-name>` format, you need to replace `@` with `%40` character encoding.

## pg_hint_plan

`pg_hint_plan` makes it possible to tweak PostgreSQL execution plans using so-called "hints" in SQL comments, like

```sql
/*+ SeqScan(a) */
```
`pg_hint_plan` reads hinting phrases in a comment of special form given with the target SQL statement. The special form is beginning by the character sequence "/\*+" and ends with "\*/". Hint phrases consist of hint name and following parameters enclosed by parentheses and delimited by spaces. New lines for readability can delimit each hinting phrase.

Example:

```sql
  /*+
      HashJoin(a b)
      SeqScan(a)
    */
    SELECT *
      FROM pgbench_branches b
      JOIN pgbench_accounts an ON b.bid = a.bid
     ORDER BY a.aid;
```
The above example causes the planner to use the results of a `seq scan` on the table a to be combined with table b as a `hash join`.

To install pg_hint_plan, in addition, to allow listing it, as shown [above](#how-to-use-postgresql-extensions), you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).
Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL flexible server instance.

1. On the sidebar, select **Server Parameters**.

1. Search for the `shared_preload_libraries` parameter.

1. Select **pg_hint_plan**.

1. Select **Save** to preserve your changes. You get a notification once the change is saved.

1. After the notification, **restart** the server to apply these changes.

You can now enable pg_hint_plan your Azure Database for PostgreSQL flexible server database. Connect to the database and issue the following command:

```sql
CREATE EXTENSION  pg_hint_plan ;
```

## pg_buffercache

`Pg_buffercache` can be used to study the contents of *shared_buffers*. Using [this extension](https://www.postgresql.org/docs/current/pgbuffercache.html) you can tell if a particular relation is cached or not(in *shared_buffers*). This extension can help you in troubleshooting performance issues (caching related performance issues)

This is part of contrib, and it's easy to install this extension.

```sql
CREATE EXTENSION pg_buffercache;
```

## Extensions and Major Version Upgrade

Azure Database for PostgreSQL flexible server has introduced an [in-place major version upgrade](./concepts-major-version-upgrade.md#overview) feature that performs an in-place upgrade of the Azure Database for PostgreSQL flexible server instance with just a click. In-place major version upgrade simplifies the Azure Database for PostgreSQL flexible server upgrade process, minimizing the disruption to users and applications accessing the server. In-place major version upgrade doesn't support specific extensions, and there are some limitations to upgrading certain extensions. The extensions **Timescaledb**, **pgaudit**, **dblink**, **orafce**, and **postgres_fdw** are unsupported for all Azure Database for PostgreSQL flexible server versions when using [in-place major version update feature](./concepts-major-version-upgrade.md#overview).

## Related content

> [!div class="nextstepaction"]
> [feedback forum](https://feedback.azure.com/d365community/forum/c5e32b97-ee24-ec11-b6e6-000d3a4f0da0)
