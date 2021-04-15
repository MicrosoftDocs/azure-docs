---
title: Extensions - Azure Database for PostgreSQL - Flexible Server
description: Learn about the available Postgres extensions in Azure Database for PostgreSQL - Flexible Server
author: sunilagarwal
ms.author: sunila
ms.service: postgresql
ms.topic: conceptual
ms.date: 03/17/2021
---

# PostgreSQL extensions in Azure Database for PostgreSQL - Flexible Server

> [!IMPORTANT]
> Azure Database for PostgreSQL - Flexible Server is in preview

PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects together in a single package that can be loaded or removed from your database with a command. After being loaded in the database, extensions function like built-in features.

## How to use PostgreSQL extensions
PostgreSQL extensions must be installed in your database before you can use them. To install a particular extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command. This command loads the packaged objects into your database.

Azure Database for PostgreSQL supports a subset of key extensions as listed below. This information is also available by running `SHOW azure.extensions;`. Extensions not listed in this document are not supported on Azure Database for PostgreSQL - Flexible Server. You cannot create or load your own extension in Azure Database for PostgreSQL.


## Postgres 12 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 12. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/Address_Standardizer.html)         | 3.0.0           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/Address_Standardizer.html) | 3.0.0           | Address Standardizer US dataset example|
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
> |[intagg](https://www.postgresql.org/docs/12/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/12/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/12/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/12/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[pageinspect](https://www.postgresql.org/docs/12/pageinspect.html)                        | 1.7             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/12/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_freespacemap](https://www.postgresql.org/docs/12/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_prewarm](https://www.postgresql.org/docs/12/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/12/pgstatstatements.html)           | 1.7             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/12/pgtrgm.html)                      | 1.4             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/12/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.4             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/12/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pgrowlocks](https://www.postgresql.org/docs/12/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/12/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/12/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[postgis](https://www.postgis.net/)                      | 3.0.0           | PostGIS geometry, geography |
> |[postgis_raster](https://www.postgis.net/)               | 3.0.0           | PostGIS raster types and functions| 
> |[postgis_sfcgal](https://www.postgis.net/)               | 3.0.0           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 3.0.0           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 3.0.0           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/12/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/12/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[tsm_system_rows](https://www.postgresql.org/docs/12/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/12/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/12/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/12/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 11 extensions

The following extensions are available in Azure Database for PostgreSQL - Flexible Servers which have Postgres version 11. 

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/Address_Standardizer.html)         | 2.5.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/Address_Standardizer.html) | 2.5.1           | Address Standardizer US dataset example|
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
> |[intagg](https://www.postgresql.org/docs/11/intagg.html)                     | 1.1             | integer aggregator and enumerator. (Obsolete)|
> |[intarray](https://www.postgresql.org/docs/11/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/11/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/11/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[pageinspect](https://www.postgresql.org/docs/11/pageinspect.html)                        | 1.7             | inspect the contents of database pages at a low level|
> |[pg_buffercache](https://www.postgresql.org/docs/11/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_freespacemap](https://www.postgresql.org/docs/11/pgfreespacemap.html)               | 1.2             | examine the free space map (FSM)|
> |[pg_prewarm](https://www.postgresql.org/docs/11/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/11/pgstatstatements.html)           | 1.6             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/11/pgtrgm.html)                      | 1.4             | text similarity measurement and index searching based on trigrams|
> |[pg_visibility](https://www.postgresql.org/docs/11/pgvisibility.html)                      | 1.2             | examine the visibility map (VM) and page-level visibility info|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.3.1             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/11/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pgrowlocks](https://www.postgresql.org/docs/11/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/11/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[plpgsql](https://www.postgresql.org/docs/11/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[postgis](https://www.postgis.net/)                      | 2.5.1           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.5.1           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.5.1           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.5.1           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/11/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[sslinfo](https://www.postgresql.org/docs/11/sslinfo.html)                    | 1.2             | information about SSL certificates|
> |[tablefunc](https://www.postgresql.org/docs/11/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[tsm_system_rows](https://www.postgresql.org/docs/11/tsm-system-rows.html)                    | 1.0             |  TABLESAMPLE method which accepts number of rows as a limit|
> |[tsm_system_time](https://www.postgresql.org/docs/11/tsm-system-time.html)                    | 1.0             |  TABLESAMPLE method which accepts time in milliseconds as a limit|
> |[unaccent](https://www.postgresql.org/docs/11/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/11/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|


## dblink and postgres_fdw
[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) and [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) allow you to connect from one PostgreSQL server to another, or to another database in the same server. Flexible server supports both incoming and outgoing connections to any PostgreSQL server. The sending server needs to allow outbound connections to the receiving server. Similarly, the receiving server needs to allow connections from the sending server. 

We recommend deploying your servers with [VNet integration](concepts-networking.md) if you plan to use these two extensions. By default VNet integration allows connections between servers in the VNET. You can also choose to use [VNet network security groups](../../virtual-network/manage-network-security-group.md) to customize access.

## pg_prewarm

The pg_prewarm extension loads relational data into cache. Prewarming your caches means that your queries have better response times on their first run after a restart. The auto-prewarm functionality is not currently available in Azure Database for PostgreSQL - Flexible Server.

## pg_stat_statements
The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded on every Azure Database for PostgreSQL flexible server to provide you a means of tracking execution statistics of SQL statements.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter.

There is a tradeoff between the query execution information pg_stat_statements provides and the impact on server performance as it logs each SQL statement. If you are not actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Note that some third party monitoring services may rely on pg_stat_statements to deliver query performance insights, so confirm whether this is the case for you or not.


## Next steps

If you don't see an extension that you'd like to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).