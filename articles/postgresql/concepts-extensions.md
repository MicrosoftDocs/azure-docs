---
title: Use PostgreSQL extensions in Azure Database for PostgreSQL - Single Server
description: Describes the ability to extend the functionality of your database using extensions in Azure Database for PostgreSQL - Single Server.
author: rachel-msft
ms.author: raagyema
ms.service: postgresql
ms.topic: conceptual
ms.date: 06/26/2019
---
# PostgreSQL extensions in Azure Database for PostgreSQL - Single Server
PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions allow for bundling multiple related SQL objects together in a single package that can be loaded or removed from your database with a single command. After being loaded in the database, extensions can function as do built-in features. For more information on PostgreSQL extensions, see [Packaging Related Objects into an Extension](https://www.postgresql.org/docs/9.6/static/extend-extensions.html).

## How to use PostgreSQL extensions
PostgreSQL extensions must be installed in your database before you can use them. To install a particular extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/9.6/static/sql-createextension.html) command from psql tool to load the packaged objects into your database.

Azure Database for PostgreSQL currently supports a subset of key extensions as listed below. Extensions beyond the ones listed are not supported; you cannot create your own extension with Azure Database for PostgreSQL service.

## Extensions supported by Azure Database for PostgreSQL
The following tables list the standard PostgreSQL extensions that are currently supported by Azure Database for PostgreSQL. This information is also available by running `SELECT * FROM pg_available_extensions;`.

### Data types extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [chkpass](https://www.postgresql.org/docs/9.6/static/chkpass.html) | Provides a data type for auto-encrypted passwords. |
> | [citext](https://www.postgresql.org/docs/9.6/static/citext.html) | Provides a case-insensitive character string type. |
> | [cube](https://www.postgresql.org/docs/9.6/static/cube.html) | Provides a data type for multidimensional cubes. |
> | [hstore](https://www.postgresql.org/docs/9.6/static/hstore.html) | Provides a data type for storing sets of key/value pairs. |
> | [isn](https://www.postgresql.org/docs/9.6/static/isn.html) | Provides data types for international product numbering standards. |
> | [ltree](https://www.postgresql.org/docs/9.6/static/ltree.html) | Provides a data type for hierarchical tree-like structures. |

### Functions extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [earthdistance](https://www.postgresql.org/docs/9.6/static/earthdistance.html) | Provides a means to calculate great-circle distances on the surface of the Earth. |
> | [fuzzystrmatch](https://www.postgresql.org/docs/9.6/static/fuzzystrmatch.html) | Provides several functions to determine similarities and distance between strings. |
> | [intarray](https://www.postgresql.org/docs/9.6/static/intarray.html) | Provides functions and operators for manipulating null-free arrays of integers. |
> | [pgcrypto](https://www.postgresql.org/docs/9.6/static/pgcrypto.html) | Provides cryptographic functions. |
> | [pg\_partman](https://pgxn.org/dist/pg_partman/doc/pg_partman.html) | Manages partitioned tables by time or ID. |
> | [pg\_trgm](https://www.postgresql.org/docs/9.6/static/pgtrgm.html) | Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching. |
> | [tablefunc](https://www.postgresql.org/docs/9.6/static/tablefunc.html) | Provides functions that manipulate whole tables, including crosstab. |
> | [uuid-ossp](https://www.postgresql.org/docs/9.6/static/uuid-ossp.html) | Generates universally unique identifiers (UUIDs). (See below for a note on this extension). |
> | [orafce](https://github.com/orafce/orafce) | Provides a subset of functions and packages emulated from commercial databases. |

### Full-text search extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [dict\_int](https://www.postgresql.org/docs/9.6/static/dict-int.html) | Provides a text search dictionary template for integers. |
> | [unaccent](https://www.postgresql.org/docs/9.6/static/unaccent.html) | A text search dictionary that removes accents (diacritic signs) from lexemes. |

### Index Types extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [btree\_gin](https://www.postgresql.org/docs/9.6/static/btree-gin.html) | Provides sample GIN operator classes that implement B-tree like behavior for certain data types. |
> | [btree\_gist](https://www.postgresql.org/docs/9.6/static/btree-gist.html) | Provides GiST index operator classes that implement B-tree. |

### Language extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [plpgsql](https://www.postgresql.org/docs/9.6/static/plpgsql.html) | PL/pgSQL loadable procedural language. |
> | [plv8](https://plv8.github.io/) | A Javascript language extension for PostgreSQL that can be used for stored procedures, triggers, etc. |

### Miscellaneous extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [pg\_buffercache](https://www.postgresql.org/docs/9.6/static/pgbuffercache.html) | Provides a means for examining what's happening in the shared buffer cache in real time. |
> | [pg\_prewarm](https://www.postgresql.org/docs/9.6/static/pgprewarm.html) | Provides a way to load relation data into the buffer cache. |
> | [pg\_stat\_statements](https://www.postgresql.org/docs/9.6/static/pgstatstatements.html) | Provides a means for tracking execution statistics of all SQL statements executed by a server. (See below for a note on this extension). |
> | [pgrowlocks](https://www.postgresql.org/docs/9.6/static/pgrowlocks.html) | Provides a means for showing row-level locking information. |
> | [pgstattuple](https://www.postgresql.org/docs/9.6/static/pgstattuple.html) | Provides a means for showing tuple-level statistics. |
> | [postgres\_fdw](https://www.postgresql.org/docs/9.6/static/postgres-fdw.html) | Foreign-data wrapper used to access data stored in external PostgreSQL servers. (See below for a note on this extension).|
> | [hypopg](https://hypopg.readthedocs.io/en/latest/) | Provides a means of creating hypothetical indexes that don't cost CPU or disk. |
> | [dblink](https://www.postgresql.org/docs/current/dblink.html) | A module that supports connections to other PostgreSQL databases from within a database session. (See below for a note on this extension). |


### PostGIS extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [PostGIS](https://www.postgis.net/), postgis\_topology, postgis\_tiger\_geocoder, postgis\_sfcgal | Spatial and geographic objects for PostgreSQL. |
> | address\_standardizer, address\_standardizer\_data\_us | Used to parse an address into constituent elements. Used to support geocoding address normalization step. |
> | [pgrouting](https://pgrouting.org/) | Extends the PostGIS / PostgreSQL geospatial database to provide geospatial routing functionality. |


### Time-series extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** |
> |---|---|
> | [TimescaleDB](https://docs.timescale.com/latest) | A time-series SQL database that supports automated partitioning for faster ingest and queries. Provides time-oriented analytical functions, optimizations, and scales PostgreSQL for time-series workloads. TimescaleDB is developed by and a registered trademark of [Timescale, Inc.](https://www.timescale.com/) (See below for a note on this extension). |


## pg_stat_statements
The [pg\_stat\_statements extension](https://www.postgresql.org/docs/9.6/static/pgstatstatements.html) is preloaded on every Azure Database for PostgreSQL server to provide you a means of tracking execution statistics of SQL statements.
The setting `pg_stat_statements.track`, which controls what statements are counted by the extension, defaults to `top`, meaning all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`. This setting is configurable as a server parameter through the [Azure portal](https://docs.microsoft.com/azure/postgresql/howto-configure-server-parameters-using-portal) or the [Azure CLI](https://docs.microsoft.com/azure/postgresql/howto-configure-server-parameters-using-cli).

There is a tradeoff between the query execution information pg_stat_statements provides and the impact on server performance as it logs each SQL statement. If you are not actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Note that some third party monitoring services may rely on pg_stat_statements to deliver query performance insights, so confirm whether this is the case for you or not.

## dblink and postgres_fdw
dblink and postgres_fdw allow you to connect from one PostgreSQL server to another, or to another database in the same server. The receiving server needs to allow connections from the sending server through its firewall. When using these extensions to connect between Azure Database for PostgreSQL servers, this can be done by setting "Allow access to Azure services" to ON. This is also needed if you want to use the extensions to loop back to the same server. The "Allow access to Azure services" setting can be found in the Azure portal page for the Postgres server, under Connection Security. Turning "Allow access to Azure services" ON whitelists all Azure IPs.

Currently, outbound connections from Azure Database for PostgreSQL are not supported, except for connections to other Azure Database for PostgreSQL servers.

## uuid
If you are planning to use `uuid_generate_v4()` from the uuid-ossp extension, consider comparing with `gen_random_uuid()` from the pgcrypto extension for performance benefits.


## TimescaleDB
TimescaleDB is a time-series database that is packaged as an extension for PostgreSQL. TimescaleDB provides time-oriented analytical functions, optimizations, and scales Postgres for time-series workloads.

[Learn more about TimescaleDB](https://docs.timescale.com/latest), a registered trademark of [Timescale, Inc.](https://www.timescale.com/)

### Installing TimescaleDB
To install TimescaleDB, you need to include it in the server's shared preload libraries. A change to Postgres's `shared_preload_libraries` parameter requires a **server restart** to take effect. You can change parameters using the [Azure portal](howto-configure-server-parameters-using-portal.md) or the [Azure CLI](howto-configure-server-parameters-using-cli.md).

> [!NOTE]
> TimescaleDB can be enabled on Azure Database for PostgreSQL versions 9.6 and 10

Using the [Azure portal](https://portal.azure.com/):

1. Select your Azure Database for PostgreSQL server.

2. On the sidebar, select **Server Parameters**.

3. Search for the `shared_preload_libraries` parameter.

4. Select **TimescaleDB**.

5. Select **Save** to preserve your changes. You get a notification once the change is saved. 

6. After the notification, **restart** the server to apply these changes. To learn how to restart a server, see [Restart an Azure Database for PostgreSQL server](howto-restart-server-portal.md).


You can now enable TimescaleDB in your Postgres database. Connect to the database and issue the following command:
```sql
CREATE EXTENSION IF NOT EXISTS timescaledb CASCADE;
```
> [!TIP]
> If you see an error, confirm that you [restarted your server](howto-restart-server-portal.md) after saving shared_preload_libraries. 

You can now create a TimescaleDB hypertable [from scratch](https://docs.timescale.com/getting-started/creating-hypertables) or migrate [existing time-series data in PostgreSQL](https://docs.timescale.com/getting-started/migrating-data).


## Next steps
If you don't see an extension that you'd like to use, let us know. Vote for existing requests or create new feedback requests in our [feedback forum](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).
