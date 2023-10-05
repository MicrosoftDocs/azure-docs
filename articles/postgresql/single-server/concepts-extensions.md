---
title: Extensions - Azure Database for PostgreSQL - Single Server
description: Learn about the available PostgreSQL extensions in Azure Database for PostgreSQL - Single Server
ms.service: postgresql
ms.subservice: single-server
ms.topic: conceptual
ms.author: sunila
author: sunilagarwal
ms.date: 06/24/2022
---

# PostgreSQL extensions in Azure Database for PostgreSQL - Single Server

[!INCLUDE [applies-to-postgresql-single-server](../includes/applies-to-postgresql-single-server.md)]

[!INCLUDE [azure-database-for-postgresql-single-server-deprecation](../includes/azure-database-for-postgresql-single-server-deprecation.md)]

PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions bundle multiple related SQL objects together in a single package that can be loaded or removed from your database with a single command. After being loaded in the database, extensions function like built-in features.

## How to use PostgreSQL extensions

PostgreSQL extensions must be installed in your database before you can use them. To install a particular extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/sql-createextension.html) command from psql tool to load the packaged objects into your database.

Azure Database for PostgreSQL supports a subset of key extensions as listed below. This information is also available by running `SELECT * FROM pg_available_extensions;`. Extensions beyond the ones listed are not supported. You cannot create your own extension in Azure Database for PostgreSQL.

## Postgres 11 extensions

The following extensions are available in Azure Database for PostgreSQL servers which have Postgres version 11.

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 2.5.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 2.5.1           | Address Standardizer US dataset example|
> |[btree_gin](https://www.postgresql.org/docs/11/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/11/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[citext](https://www.postgresql.org/docs/11/citext.html)                       | 1.5             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/11/cube.html)                         | 1.4             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/11/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/11/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[earthdistance](https://www.postgresql.org/docs/11/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/11/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/11/hstore.html)                       | 1.5             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://hypopg.readthedocs.io/en/latest/)                       | 1.1.2           | Hypothetical indexes for PostgreSQL|
> |[intarray](https://www.postgresql.org/docs/11/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/11/isn.html)                          | 1.2             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/11/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[orafce](https://github.com/orafce/orafce)                       | 3.7             | Functions and operators that emulate a subset of functions and packages from commercial RDBMS|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.3.1             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/11/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pgrouting](https://pgrouting.org/)                    | 2.6.2           | pgRouting Extension|
> |[pgrowlocks](https://www.postgresql.org/docs/11/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/11/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[pg_buffercache](https://www.postgresql.org/docs/11/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_partman](https://github.com/pgpartman/pg_partman)                   | 4.0.0           | Extension to manage partitioned tables by time or ID|
> |[pg_prewarm](https://www.postgresql.org/docs/11/pgprewarm.html)                   | 1.2             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/11/pgstatstatements.html)           | 1.6             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/11/pgtrgm.html)                      | 1.4             | text similarity measurement and index searching based on trigrams|
> |[plpgsql](https://www.postgresql.org/docs/11/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                         | 2.3.11          | PL/JavaScript (v8) trusted procedural language|
> |[postgis](https://www.postgis.net/)                      | 2.5.1           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.5.1           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.5.1           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.5.1           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/11/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[tablefunc](https://www.postgresql.org/docs/11/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[timescaledb](https://docs.timescale.com/timescaledb/latest/)                    |1.7.4             | Enables scalable inserts and complex queries for time-series data|
> |[unaccent](https://www.postgresql.org/docs/11/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/11/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 10 extensions

The following extensions are available in Azure Database for PostgreSQL servers which have Postgres version 10.

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 2.5.1           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 2.5.1           | Address Standardizer US dataset example|
> |[btree_gin](https://www.postgresql.org/docs/10/btree-gin.html)                    | 1.3             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/10/btree-gist.html)                   | 1.5             | support for indexing common datatypes in GiST|
> |[chkpass](https://www.postgresql.org/docs/10/chkpass.html)                       | 1.0             | data type for auto-encrypted passwords|
> |[citext](https://www.postgresql.org/docs/10/citext.html)                       | 1.4             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/10/cube.html)                         | 1.2             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/10/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/10/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[earthdistance](https://www.postgresql.org/docs/10/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/10/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/10/hstore.html)                       | 1.4             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://hypopg.readthedocs.io/en/latest/)                       | 1.1.1           | Hypothetical indexes for PostgreSQL|
> |[intarray](https://www.postgresql.org/docs/10/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/10/isn.html)                          | 1.1             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/10/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[orafce](https://github.com/orafce/orafce)                       | 3.7             | Functions and operators that emulate a subset of functions and packages from commercial RDBMS|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.2             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/10/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pgrouting](https://pgrouting.org/)                    | 2.5.2           | pgRouting Extension|
> |[pgrowlocks](https://www.postgresql.org/docs/10/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/10/pgstattuple.html)                  | 1.5             | show tuple-level statistics|
> |[pg_buffercache](https://www.postgresql.org/docs/10/pgbuffercache.html)               | 1.3             | examine the shared buffer cache|
> |[pg_partman](https://github.com/pgpartman/pg_partman)                   | 2.6.3           | Extension to manage partitioned tables by time or ID|
> |[pg_prewarm](https://www.postgresql.org/docs/10/pgprewarm.html)                   | 1.1             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/10/pgstatstatements.html)           | 1.6             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/10/pgtrgm.html)                      | 1.3             | text similarity measurement and index searching based on trigrams|
> |[plpgsql](https://www.postgresql.org/docs/10/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                         | 2.1.0          | PL/JavaScript (v8) trusted procedural language|
> |[postgis](https://www.postgis.net/)                      | 2.4.3           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.4.3           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.4.3           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.4.3           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/10/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[tablefunc](https://www.postgresql.org/docs/10/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[timescaledb](https://docs.timescale.com/timescaledb/latest/)                    | 1.7.4             | Enables scalable inserts and complex queries for time-series data|
> |[unaccent](https://www.postgresql.org/docs/10/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/10/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 9.6 extensions

The following extensions are available in Azure Database for PostgreSQL servers which have Postgres version 9.6.

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 2.3.2           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 2.3.2           | Address Standardizer US dataset example|
> |[btree_gin](https://www.postgresql.org/docs/9.6/btree-gin.html)                    | 1.0             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/9.6/btree-gist.html)                   | 1.2             | support for indexing common datatypes in GiST|
> |[chkpass](https://www.postgresql.org/docs/9.6/chkpass.html)                       | 1.0             | data type for auto-encrypted passwords|
> |[citext](https://www.postgresql.org/docs/9.6/citext.html)                       | 1.3             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/9.6/cube.html)                         | 1.2             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/9.6/dblink.html)                       | 1.2             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/9.6/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[earthdistance](https://www.postgresql.org/docs/9.6/earthdistance.html)                | 1.1             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/9.6/fuzzystrmatch.html)                | 1.1             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/9.6/hstore.html)                       | 1.4             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://hypopg.readthedocs.io/en/latest/)                       | 1.1.1           | Hypothetical indexes for PostgreSQL|
> |[intarray](https://www.postgresql.org/docs/9.6/intarray.html)                     | 1.2             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/9.6/isn.html)                          | 1.1             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/9.6/ltree.html)                        | 1.1             | data type for hierarchical tree-like structures|
> |[orafce](https://github.com/orafce/orafce)                       | 3.7             | Functions and operators that emulate a subset of functions and packages from commercial RDBMS|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.1.2             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/9.6/pgcrypto.html)                     | 1.3             | cryptographic functions|
> |[pgrouting](https://pgrouting.org/)                    | 2.3.2           | pgRouting Extension|
> |[pgrowlocks](https://www.postgresql.org/docs/9.6/pgrowlocks.html)                   | 1.2             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/9.6/pgstattuple.html)                  | 1.4             | show tuple-level statistics|
> |[pg_buffercache](https://www.postgresql.org/docs/9.6/pgbuffercache.html)               | 1.2             | examine the shared buffer cache|
> |[pg_partman](https://github.com/pgpartman/pg_partman)                   | 2.6.3           | Extension to manage partitioned tables by time or ID|
> |[pg_prewarm](https://www.postgresql.org/docs/9.6/pgprewarm.html)                   | 1.1             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/9.6/pgstatstatements.html)           | 1.4             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/9.6/pgtrgm.html)                      | 1.3             | text similarity measurement and index searching based on trigrams|
> |[plpgsql](https://www.postgresql.org/docs/9.6/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[plv8](https://plv8.github.io/)                         | 2.1.0          | PL/JavaScript (v8) trusted procedural language|
> |[postgis](https://www.postgis.net/)                      | 2.3.2           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.3.2           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.3.2           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.3.2           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/9.6/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[tablefunc](https://www.postgresql.org/docs/9.6/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[timescaledb](https://docs.timescale.com/timescaledb/latest/)                    | 1.7.4             | Enables scalable inserts and complex queries for time-series data|
> |[unaccent](https://www.postgresql.org/docs/9.6/unaccent.html)                     | 1.1             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/9.6/uuid-ossp.html)                    | 1.1             | generate universally unique identifiers (UUIDs)|

## Postgres 9.5 extensions

>[!NOTE]
> PostgreSQL version 9.5 has been retired.

The following extensions are available in Azure Database for PostgreSQL servers which have Postgres version 9.5.

> [!div class="mx-tableFixed"]
> | **Extension**| **Extension version** | **Description** |
> |---|---|---|
> |[address_standardizer](http://postgis.net/docs/manual-2.5/Address_Standardizer.html)         | 2.3.0           | Used to parse an address into constituent elements. |
> |[address_standardizer_data_us](http://postgis.net/docs/manual-2.5/Address_Standardizer.html) | 2.3.0           | Address Standardizer US dataset example|
> |[btree_gin](https://www.postgresql.org/docs/9.5/btree-gin.html)                    | 1.0             | support for indexing common datatypes in GIN|
> |[btree_gist](https://www.postgresql.org/docs/9.5/btree-gist.html)                   | 1.1             | support for indexing common datatypes in GiST|
> |[chkpass](https://www.postgresql.org/docs/9.5/chkpass.html)                       | 1.0             | data type for auto-encrypted passwords|
> |[citext](https://www.postgresql.org/docs/9.5/citext.html)                       | 1.1             | data type for case-insensitive character strings|
> |[cube](https://www.postgresql.org/docs/9.5/cube.html)                         | 1.0             | data type for multidimensional cubes|
> |[dblink](https://www.postgresql.org/docs/9.5/dblink.html)                       | 1.1             | connect to other PostgreSQL databases from within a database|
> |[dict_int](https://www.postgresql.org/docs/9.5/dict-int.html)                     | 1.0             | text search dictionary template for integers|
> |[earthdistance](https://www.postgresql.org/docs/9.5/earthdistance.html)                | 1.0             | calculate great-circle distances on the surface of the Earth|
> |[fuzzystrmatch](https://www.postgresql.org/docs/9.5/fuzzystrmatch.html)                | 1.0             | determine similarities and distance between strings|
> |[hstore](https://www.postgresql.org/docs/9.5/hstore.html)                       | 1.3             | data type for storing sets of (key, value) pairs|
> |[hypopg](https://hypopg.readthedocs.io/en/latest/)                       | 1.1.1           | Hypothetical indexes for PostgreSQL|
> |[intarray](https://www.postgresql.org/docs/9.5/intarray.html)                     | 1.0             | functions, operators, and index support for 1-D arrays of integers|
> |[isn](https://www.postgresql.org/docs/9.5/isn.html)                          | 1.0             | data types for international product numbering standards|
> |[ltree](https://www.postgresql.org/docs/9.5/ltree.html)                        | 1.0             | data type for hierarchical tree-like structures|
> |[orafce](https://github.com/orafce/orafce)                       | 3.7             | Functions and operators that emulate a subset of functions and packages from commercial RDBMS|
> |[pgaudit](https://www.pgaudit.org/)                     | 1.0.7             | provides auditing functionality|
> |[pgcrypto](https://www.postgresql.org/docs/9.5/pgcrypto.html)                     | 1.2             | cryptographic functions|
> |[pgrouting](https://pgrouting.org/)                    | 2.3.0           | pgRouting Extension|
> |[pgrowlocks](https://www.postgresql.org/docs/9.5/pgrowlocks.html)                   | 1.1             | show row-level locking information|
> |[pgstattuple](https://www.postgresql.org/docs/9.5/pgstattuple.html)                  | 1.3             | show tuple-level statistics|
> |[pg_buffercache](https://www.postgresql.org/docs/9.5/pgbuffercache.html)               | 1.1             | examine the shared buffer cache|
> |[pg_partman](https://github.com/pgpartman/pg_partman)                   | 2.6.3           | Extension to manage partitioned tables by time or ID|
> |[pg_prewarm](https://www.postgresql.org/docs/9.5/pgprewarm.html)                   | 1.0             | prewarm relation data|
> |[pg_stat_statements](https://www.postgresql.org/docs/9.5/pgstatstatements.html)           | 1.3             | track execution statistics of all SQL statements executed|
> |[pg_trgm](https://www.postgresql.org/docs/9.5/pgtrgm.html)                      | 1.1             | text similarity measurement and index searching based on trigrams|
> |[plpgsql](https://www.postgresql.org/docs/9.5/plpgsql.html)                      | 1.0             | PL/pgSQL procedural language|
> |[postgis](https://www.postgis.net/)                      | 2.3.0           | PostGIS geometry, geography, and raster spatial types and functions|
> |[postgis_sfcgal](https://www.postgis.net/)               | 2.3.0           | PostGIS SFCGAL functions|
> |[postgis_tiger_geocoder](https://www.postgis.net/)       | 2.3.0           | PostGIS tiger geocoder and reverse geocoder|
> |[postgis_topology](https://postgis.net/docs/Topology.html)             | 2.3.0           | PostGIS topology spatial types and functions|
> |[postgres_fdw](https://www.postgresql.org/docs/9.5/postgres-fdw.html)                 | 1.0             | foreign-data wrapper for remote PostgreSQL servers|
> |[tablefunc](https://www.postgresql.org/docs/9.5/tablefunc.html)                    | 1.0             | functions that manipulate whole tables, including crosstab|
> |[unaccent](https://www.postgresql.org/docs/9.5/unaccent.html)                     | 1.0             | text search dictionary that removes accents|
> |[uuid-ossp](https://www.postgresql.org/docs/9.5/uuid-ossp.html)                    | 1.0             | generate universally unique identifiers (UUIDs)|

## pg_stat_statements

The [pg_stat_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded on every Azure Database for PostgreSQL server to provide you a means of tracking execution statistics of SQL statements.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter through the [Azure portal](./how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](./how-to-configure-server-parameters-using-cli.md).

There is a tradeoff between the query execution information pg_stat_statements provides and the impact on server performance as it logs each SQL statement. If you are not actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Note that some third party monitoring services may rely on pg_stat_statements to deliver query performance insights, so confirm whether this is the case for you or not.

## dblink and postgres_fdw

[dblink](https://www.postgresql.org/docs/current/contrib-dblink-function.html) and [postgres_fdw](https://www.postgresql.org/docs/current/postgres-fdw.html) allow you to connect from one PostgreSQL server to another, or to another database in the same server. The receiving server needs to allow connections from the sending server through its firewall. When using these extensions to connect between Azure Database for PostgreSQL servers, this can be done by setting "Allow access to Azure services" to ON. This is also needed if you want to use the extensions to loop back to the same server. The "Allow access to Azure services" setting can be found in the Azure portal page for the Postgres server, under Connection Security. Turning "Allow access to Azure services" ON puts all Azure IPs on the allow list.

> [!NOTE]
> Currently, outbound connections from Azure Database for PostgreSQL via foreign data wrapper extensions such as postgres_fdw  are not supported, except for connections to other Azure Database for PostgreSQL servers in the same Azure region.

## uuid

If you are planning to use `uuid_generate_v4()` from the [uuid-ossp extension](https://www.postgresql.org/docs/current/uuid-ossp.html), consider comparing with `gen_random_uuid()` from the [pgcrypto extension](https://www.postgresql.org/docs/current/pgcrypto.html) for performance benefits.

## pgAudit

The [pgAudit extension](https://github.com/pgaudit/pgaudit/blob/master/README.md) provides session and object audit logging. To learn how to use this extension in Azure Database for PostgreSQL, visit the [auditing concepts article](concepts-audit.md).

## pg_prewarm

The pg_prewarm extension loads relational data into cache. Prewarming your caches means that your queries have better response times on their first run after a restart. In Postgres 10 and below, prewarming is done manually using the [prewarm function](https://www.postgresql.org/docs/10/pgprewarm.html).

In Postgres 11 and above, you can configure prewarming to happen [automatically](https://www.postgresql.org/docs/current/pgprewarm.html). You need to include pg_prewarm in your `shared_preload_libraries` parameter's list and restart the server to apply the change. Parameters can be set from the [Azure portal](how-to-configure-server-parameters-using-portal.md), [CLI](how-to-configure-server-parameters-using-cli.md), REST API, or ARM template.

## TimescaleDB

TimescaleDB is a time-series database that is packaged as an extension for PostgreSQL. TimescaleDB provides time-oriented analytical functions, optimizations, and scales Postgres for time-series workloads.

[Learn more about TimescaleDB](https://docs.timescale.com/timescaledb/latest/), a registered trademark of [Timescale, Inc.](https://www.timescale.com/). Azure Database for PostgreSQL provides the TimescaleDB [Apache-2 edition](https://www.timescale.com/legal/licenses).

### Installing TimescaleDB

To install TimescaleDB, you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](how-to-configure-server-parameters-using-portal.md) or the [Azure CLI](how-to-configure-server-parameters-using-cli.md).

Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL server.

2. On the sidebar, select **Server Parameters**.

3. Search for the `shared_preload_libraries` parameter.

4. Select **TimescaleDB**.

5. Select **Save** to preserve your changes. You get a notification once the change is saved.

6. After the notification, **restart** the server to apply these changes. To learn how to restart a server, see [Restart an Azure Database for PostgreSQL server](how-to-restart-server-portal.md).

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
