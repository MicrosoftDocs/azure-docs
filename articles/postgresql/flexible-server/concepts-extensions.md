---
title: Extensions - Azure Database for PostgreSQL - Flexible Server
description: Learn about the available PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server
ms.author: sunila
author: sunilagarwal
ms.service: postgresql
ms.subservice: flexible-server
ms.topic: conceptual
ms.date: 11/30/2021
---

# PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server

[!INCLUDE [!INCLUDE [applies-to-postgresql-flexible-server](../includes/applies-to-postgresql-flexible-server.md)]

PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects together in a single package that can be loaded or removed from your database with a command. After being loaded in the database, extensions function like built-in features.


## How to use PostgreSQL extensions
Before you can install extensions in Azure Database for PostgreSQL - Flexible Server, you will need to allow-list these extensions for use. 

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL - Flexible Server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `azure.extensions` parameter.
   4. Select extensions you wish to allow-list.
     :::image type="content" source="./media/concepts-extensions/allow-list.png" alt-text=" Screenshot showing Azure Database for PostgreSQL - allow-listing extensions for installation ":::
  
Using [Azure CLI](/cli/azure/):

   You can allow-list extensions via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true). 

   ```bash
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name azure.extensions --value <extension name>,<extension name>
   ```

   Using [ARM Template](../../azure-resource-manager/templates/index.yml):
   Example below allow-lists extensions dblink, dict_xsyn, pg_buffercache on server mypostgreserver 
```json
{

    "$schema": https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#,

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

Shared_Preload_Libraries is a server configuration parameter determining which libraries are to be loaded when PostgreSQL starts. Any libraries which use shared memory must be loaded via this parameter. If your extension needs to be added to shared preload libraries this can be done:

Using the [Azure portal](https://portal.azure.com):

   1. Select your Azure Database for PostgreSQL - Flexible Server.
   2. On the sidebar, select **Server Parameters**.
   3. Search for the `shared_preload_libraries` parameter.
   4. Select extensions you wish to add.
     :::image type="content" source="./media/concepts-extensions/shared-libraries.png" alt-text=" Screenshot showing Azure Database for PostgreSQL -setting shared preload libraries parameter setting  for extensions installation .":::
  

Using [Azure CLI](/cli/azure/):

   You can set `shared_preload_libraries` via CLI parameter set [command](/cli/azure/postgres/flexible-server/parameter?view=azure-cli-latest&preserve-view=true). 

   ```bash
az postgres flexible-server parameter set --resource-group <your resource group>  --server-name <your server name> --subscription <your subscription id> --name shared_preload_libraries --value <extension name>,<extension name>
   ```


After extensions are allow-listed and loaded, these must be installed in your database before you can use them. To install a particular extension, you should run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command. This command loads the packaged objects into your database.




Azure Database for PostgreSQL supports a subset of key extensions as listed below. This information is also available by running `SHOW azure.extensions;`. Extensions not listed in this document are not supported on Azure Database for PostgreSQL - Flexible Server. You cannot create or load your own extension in Azure Database for PostgreSQL.
## Postgres 14 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 14. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 3.1.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 3.1.1           | Address Standardizer US dataset example|
> |[amcheck](https://www.postgresql.org/docs/13/amcheck.html)                    | 1.2             | functions for verifying relation integrity|
> |[bloom](https://www.postgresql.org/docs/13/bloom.html)                    | 1.0             | bloom access method - signature file based index|
> |[btree_gin](https://www.postgresql.org/docs/13/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/13/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[citext](https://www.postgresql.org/docs/13/citext.html)                       | 1.6             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/13/cube.html)                         | 1.4             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/13/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/13/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[dict_xsyn](https://www.postgresql.org/docs/13/dict-xsyn.html)                     | 1.0             | text search dictionary template for extended synonym processing|
> |[earthdistance](https://www.postgresql.org/docs/13/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/13/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
>|[hypopg](https://github.com/HypoPG/hypopg)                                   |  1.3.1             | extension adding support for hypothetical indexes |
> |[hstore](https://www.postgresql.org/docs/13/hstore.html)                       | 1.7             | data type for storing sets of (key, value) pairs|
> |[intagg](https://www.postgresql.org/docs/13/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/13/intarray.html)                     | 1.3             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/13/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[lo](https://www.postgresql.org/docs/13/lo.html)                            | 1.1             | large object maintenance |
> |[ltree](https://www.postgresql.org/docs/13/ltree.html)                        | 1.2             | data type for hierarchical tree-like structures|
 > |[orafce](https://github.com/orafce/orafce)                        | 3.1.8            |implements in Postgres some of the functions from the Oracle database that are missing|
> |[pageinspect](https://www.postgresql.org/docs/13/pageinspect.html)                        | 1.8             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/13/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_cron](https://github.com/citusdata/pg_cron)                        | 1.4             | Job scheduler for PostgreSQL|
> |[pg_freespacemap](https://www.postgresql.org/docs/13/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_partman](https://github.com/pgpartman/pg_partman)         | 4.6.1           | Extension to manage partitioned tables by time or ID |
> |[pg_prewarm](https://www.postgresql.org/docs/13/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/13/pgstatstatements.html)           | 1.8             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/13/pgtrgm.html)                      | 1.5             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/13/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.6.2            | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/13/pgcrypto.html)                     | 1.3             | cryptographic functions| 
> |[pglogical](https://github.com/2ndQuadrant/pglogical)       | 2.3.2                | Logical streaming replication |
> |[pgrouting](https://pgrouting.org/)                   | 3.3.0            | geospatial database to provide geospatial routing|
> |[pgrowlocks](https://www.postgresql.org/docs/13/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/13/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/13/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                      | 3.0.0             | Trusted Javascript language extension|
> |[postgis](https://www.postgis.net/)                      | 3.2.0           | PostGIS geometry, geography |
> |[postgis_raster](https://www.postgis.net/)               | 3.2.0           | PostGIS raster types and functions| 
> |[postgis_sfcgal](https://www.postgis.net/)               | 3.2.0          | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 3.2.0          | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 3.2.0           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/13/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/13/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[timescaledb](https://github.com/timescale/timescaledb)                    | 2.5.1            |  Open-source relational database for time-series and analytics|
> |[tsm_system_rows](https://www.postgresql.org/docs/13/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/13/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/13/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/13/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 13 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 13. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 3.1.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 3.1.1           | Address Standardizer US dataset example|
> |[amcheck](https://www.postgresql.org/docs/13/amcheck.html)                    | 1.2             | functions for verifying relation integrity|
> |[bloom](https://www.postgresql.org/docs/13/bloom.html)                    | 1.0             | bloom access method - signature file based index|
> |[btree_gin](https://www.postgresql.org/docs/13/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/13/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[citext](https://www.postgresql.org/docs/13/citext.html)                       | 1.6             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/13/cube.html)                         | 1.4             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/13/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/13/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[dict_xsyn](https://www.postgresql.org/docs/13/dict-xsyn.html)                     | 1.0             | text search dictionary template for extended synonym processing|
> |[earthdistance](https://www.postgresql.org/docs/13/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/13/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
>|[hypopg](https://github.com/HypoPG/hypopg)                                   |  1.3.1             | extension adding support for hypothetical indexes |
> |[hstore](https://www.postgresql.org/docs/13/hstore.html)                       | 1.7             | data type for storing sets of (key, value) pairs|
> |[intagg](https://www.postgresql.org/docs/13/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/13/intarray.html)                     | 1.3             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/13/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[lo](https://www.postgresql.org/docs/13/lo.html)                            | 1.1             | large object maintenance |
> |[ltree](https://www.postgresql.org/docs/13/ltree.html)                        | 1.2             | data type for hierarchical tree-like structures|
 > |[orafce](https://github.com/orafce/orafce)                        | 3.1.8            |implements in Postgres some of the functions from the Oracle database that are missing|
> |[pageinspect](https://www.postgresql.org/docs/13/pageinspect.html)                        | 1.8             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/13/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_cron](https://github.com/citusdata/pg_cron)                        | 1.4             | Job scheduler for PostgreSQL|
> |[pg_freespacemap](https://www.postgresql.org/docs/13/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_partman](https://github.com/pgpartman/pg_partman)         | 4.5.0           | Extension to manage partitioned tables by time or ID |
> |[pg_prewarm](https://www.postgresql.org/docs/13/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/13/pgstatstatements.html)           | 1.8             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/13/pgtrgm.html)                      | 1.5             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/13/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.5             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/13/pgcrypto.html)                     | 1.3             | cryptographic functions| 
> |[pglogical](https://github.com/2ndQuadrant/pglogical)       | 2.3.2                | Logical streaming replication |
> |[pgrouting](https://pgrouting.org/)                   | 3.3.0            | geospatial database to provide geospatial routing|
> |[pgrowlocks](https://www.postgresql.org/docs/13/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/13/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/13/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                      | 3.0.0             | Trusted Javascript language extension|
> |[postgis](https://www.postgis.net/)                      | 3.2.0           | PostGIS geometry, geography |
> |[postgis_raster](https://www.postgis.net/)               | 3.2.0           | PostGIS raster types and functions| 
> |[postgis_sfcgal](https://www.postgis.net/)               | 3.2.0          | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 3.2.0          | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 3.2.0           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/13/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/13/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[timescaledb](https://github.com/timescale/timescaledb)                    | 2.5.1            |  Open-source relational database for time-series and analytics|
> |[tsm_system_rows](https://www.postgresql.org/docs/13/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/13/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/13/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/13/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 12 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 12. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 3.0.0           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 3.0.0           | Address Standardizer US dataset example|
> |[amcheck](https://www.postgresql.org/docs/12/amcheck.html)                    | 1.2             | functions for verifying relation integrity|
> |[bloom](https://www.postgresql.org/docs/12/bloom.html)                    | 1.0             | bloom access method - signature file based index|
> |[btree_gin](https://www.postgresql.org/docs/12/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/12/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[citext](https://www.postgresql.org/docs/12/citext.html)                       | 1.6             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/12/cube.html)                         | 1.4             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/12/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/12/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[dict_xsyn](https://www.postgresql.org/docs/12/dict-xsyn.html)                     | 1.0             | text search dictionary template for extended synonym processing|
> |[earthdistance](https://www.postgresql.org/docs/12/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/12/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/12/hstore.html)                       | 1.6             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://github.com/HypoPG/hypopg)                                   |  1.2             | extension adding support for hypothetical indexes |
> |[intagg](https://www.postgresql.org/docs/12/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/12/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/12/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[lo](https://www.postgresql.org/docs/12/lo.html)                            | 1.1             | large object maintenance |
> |[ltree](https://www.postgresql.org/docs/12/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
>  |[orafce](https://github.com/orafce/orafce)                        | 3.1.8            |implements in Postgres some of the functions from the Oracle database that are missing|
> |[pageinspect](https://www.postgresql.org/docs/12/pageinspect.html)                        | 1.7             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/12/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_cron](https://github.com/citusdata/pg_cron)                        | 1.4            | Job scheduler for PostgreSQL|
> |[pg_freespacemap](https://www.postgresql.org/docs/12/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_partman](https://github.com/pgpartman/pg_partman)         | 4.5.0           | Extension to manage partitioned tables by time or ID |
> |[pg_prewarm](https://www.postgresql.org/docs/12/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/12/pgstatstatements.html)           | 1.7             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/12/pgtrgm.html)                      | 1.4             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/12/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.4             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/12/pgcrypto.html)                     | 1.3             | cryptographic functions|
>|[pglogical](https://github.com/2ndQuadrant/pglogical)       | 2.3.2                | Logical streaming replication |
> |[pgrouting](https://pgrouting.org/)                   | 3.3.0            | geospatial database to provide geospatial routing|
> |[pgrowlocks](https://www.postgresql.org/docs/12/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/12/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/12/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                      | 3.2.0             | Trusted Javascript language extension|
> |[postgis](https://www.postgis.net/)                      | 3.2.0           | PostGIS geometry, geography |
> |[postgis_raster](https://www.postgis.net/)               | 3.2.0           | PostGIS raster types and functions| 
> |[postgis_sfcgal](https://www.postgis.net/)               | 3.2.0           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 3.2.0           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 3.2.0           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/12/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/12/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[timescaledb](https://github.com/timescale/timescaledb)                    | 2.5.1            |  Open-source relational database for time-series and analytics|
> |[tsm_system_rows](https://www.postgresql.org/docs/12/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/12/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/12/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/12/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 11 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 11. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 2.5.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 2.5.1           | Address Standardizer US dataset example|
> |[amcheck](https://www.postgresql.org/docs/11/amcheck.html)                    | 1.1             | functions for verifying relation integrity|
> |[bloom](https://www.postgresql.org/docs/11/bloom.html)                    | 1.0             | bloom access method - signature file based index|
> |[btree_gin](https://www.postgresql.org/docs/11/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/11/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[citext](https://www.postgresql.org/docs/11/citext.html)                       | 1.5             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/11/cube.html)                         | 1.4             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/11/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/11/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[dict_xsyn](https://www.postgresql.org/docs/11/dict-xsyn.html)                     | 1.0             | text search dictionary template for extended synonym processing|
> |[earthdistance](https://www.postgresql.org/docs/11/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/11/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/11/hstore.html)                       | 1.5             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://github.com/HypoPG/hypopg)                                   |  1.1.2            | extension adding support for hypothetical indexes |
> |[intagg](https://www.postgresql.org/docs/11/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/11/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/11/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[lo](https://www.postgresql.org/docs/11/lo.html)                            | 1.1             | large object maintenance |
> |[ltree](https://www.postgresql.org/docs/11/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[orafce](https://github.com/orafce/orafce)                        | 3.1.8            |implements in Postgres some of the functions from the Oracle database that are missing|
> |[pageinspect](https://www.postgresql.org/docs/11/pageinspect.html)                        | 1.7             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/11/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_cron](https://github.com/citusdata/pg_cron)                        | 1.4            | Job scheduler for PostgreSQL|
> |[pg_freespacemap](https://www.postgresql.org/docs/11/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_partman](https://github.com/pgpartman/pg_partman)         | 4.5.0           | Extension to manage partitioned tables by time or ID |
> |[pg_prewarm](https://www.postgresql.org/docs/11/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/11/pgstatstatements.html)           | 1.6             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/11/pgtrgm.html)                      | 1.4             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/11/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.3.1             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/11/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pglogical](https://github.com/2ndQuadrant/pglogical)       | 2.3.2                | Logical streaming replication |
> |[pgrouting](https://pgrouting.org/)                   | 3.3.0            | geospatial database to provide geospatial routing|
> |[pgrowlocks](https://www.postgresql.org/docs/11/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/11/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/11/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                      | 3.0.0             | Trusted Javascript language extension|
> |[postgis](https://www.postgis.net/)                      | 2.5.5           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.5.5           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.5.5           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.5.5           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/11/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/11/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[tablefunc](https://www.postgresql.org/docs/11/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[timescaledb](https://github.com/timescale/timescaledb)                    | 1.7.4           |  Open-source relational database for time-series and analytics|
> |[tsm_system_rows](https://www.postgresql.org/docs/11/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/11/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/11/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/11/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|


## dblink and postgres_fdw
[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) and [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) allow you to connect from one PostgreSQL server to another, or to another database in the same server. Flexible server supports both incoming and outgoing connections to any PostgreSQL server. The sending server needs to allow outbound connections to the receiving server. Similarly, the receiving server needs to allow connections from the sending server. 

We recommend deploying your servers with [VNet integration](concepts-networking.md) if you plan to use these two extensions. By default VNet integration allows connections between servers in the VNET. You can also choose to use [VNet network security groups](../../virtual-network/manage-network-security-group.md) to customize access.

## pg_prewarm

The pg_prewarm extension loads relational data into cache. Prewarming your caches means that your queries have better response times on their first run after a restart. The auto-prewarm functionality is not currently available in Azure Database for PostgreSQL - Flexible Server.

## pg_cron

[pg_cron](https://github.com/citusdata/pg_cron/) is a simple, cron-based job scheduler for PostgreSQL that runs inside the database as an extension. The pg_cron extension can be used to run scheduled maintenance tasks within a PostgreSQL database. For example, you can run periodic vacuum of a table or removing old data jobs.

`pg_cron` can run multiple jobs in parallel, but it runs at most one instance of a job at a time. If a second run is supposed to start before the first one finishes, then the second run is queued and started as soon as the first run completes. This ensures that jobs run exactly as many times as scheduled and don’t run concurrently with themselves.

Some examples:

To delete old data on Saturday at 3:30am (GMT)
```
SELECT cron.schedule('30 3 * * 6', $$DELETE FROM events WHERE event_time < now() - interval '1 week'$$);
```
To run vacuum every day at 10:00am (GMT)
```
SELECT cron.schedule('0 10 * * *', 'VACUUM');
```

To unschedule all tasks from pg_cron
```
SELECT cron.unschedule(jobid) FROM cron.job;
```
> [!NOTE]
> pg_cron extension is preloaded in every Azure Database for PostgreSQL -Flexible Server inside postgres database to provide you with ability to schedule jobs to run in other databases within your PostgreSQL DB instance without compromising security.

## pg_stat_statements

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded on every Azure Database for PostgreSQL flexible server to provide you a means of tracking execution statistics of SQL statements.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter.

There is a tradeoff between the query execution information pg_stat_statements provides and the impact on server performance as it logs each SQL statement. If you are not actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Note that some third party monitoring services may rely on pg_stat_statements to deliver query performance insights, so confirm whether this is the case for you or not.


## TimescaleDB

TimescaleDB is a time-series database that is packaged as an extension for PostgreSQL. TimescaleDB provides time-oriented analytical functions, optimizations, and scales Postgres for time-series workloads.
[Learn more about TimescaleDB](https://docs.timescale.com/timescaledb/latest/), a registered trademark of Timescale, Inc.. Azure Database for PostgreSQL provides the TimescaleDB [Apache-2 edition](https://www.timescale.com/legal/licenses).
## Installing TimescaleDB
To install TimescaleDB, you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md) or the [Azure CLI](howto-configure-server-parameters-using-cli.md).

Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL server.

2. On the sidebar, select **Server Parameters**.

3. Search for the `shared_preload_libraries` parameter.

4. Select **TimescaleDB**.

5. Select **Save** to preserve your changes. You get a notification once the change is saved. 

6. After the notification, **restart** the server to apply these changes. 


You can now enable TimescaleDB in your Postgres database. Connect to the database and issue the following command:
```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```
> [!TIP]
> If you see an error, confirm that you [restarted your server](how-to-restart-server-portal.md) after saving shared_preload_libraries. 

You can now create a TimescaleDB hypertable [from scratch](https://docs.timescale.com/getting-started/creating-hypertables) or migrate [existing time-series data in PostgreSQL](https://docs.timescale.com/getting-started/migrating-data).

### Restoring a Timescale database using pg_dump and pg_restore
To restore a Timescale database using pg_dump and pg_restore, you need to run two helper procedures in the destination database: `timescaledb_pre_restore()` and `timescaledb_post restore()`.

First prepare the destination database:

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
For more details on restore method wiith Timescale enabled database see [Timescale documentation](https://docs.timescale.com/timescaledb/latest/how-to-guides/backup-and-restore/pg-dump-and-restore/#restore-your-entire-database-from-backup)


### Restoring a Timescale database using timescaledb-backup

 While running `SELECT timescaledb_post_restore()` procedure listed above you may get permissions denied error updating timescaledb.restoring flag. This is due to limited ALTER DATABASE permission in Cloud PaaS database services. In this case you can perform alternative method using `timescaledb-backup` tool to backup and restore Timescale database. Timescaledb-backup is a program for making dumping and restoring a TimescaleDB database simpler, less error-prone, and more performant. 
 To do so you should do following
   1. Install  tools as detailed [here](https://github.com/timescale/timescaledb-backup#installing-timescaledb-backup)
   2. Create target Azure Database for PostgreSQL server and database
   3. Enable Timescale extension as shown above
   4. Grant azure_pg_admin [role](https://www.postgresql.org/docs/11/database-roles.html) to user that will be used by [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore)
   5. Run [ts-restore](https://github.com/timescale/timescaledb-backup#using-ts-restore) to restore database

 More details on these utilities can be found [here](https://github.com/timescale/timescaledb-backup). 
> [!NOTE]
> When using `timescale-backup` utilities to restore to Azure is that since database user names for non-flexible Azure Database for PostgresQL  must use the `<user@db-name>` format, you need to replace `@` with `%40` character encoding. 



## Next steps

If you don't see an extension that you'd like to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://feedback.azure.com/d365community/forum/c5e32b97-ee24-ec11-b6e6-000d3a4f0da0).
