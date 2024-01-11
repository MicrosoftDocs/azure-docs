---
title: Extensions – Azure Cosmos DB for PostgreSQL
description: Describes the ability to extend the functionality of your database by using extensions in Azure Cosmos DB for PostgreSQL
ms.author: nlarin
author: niklarin
ms.service: cosmos-db
ms.subservice: postgresql
ms.custom: build-2023
ms.topic: conceptual
ms.date: 11/20/2023
---
# PostgreSQL extensions in Azure Cosmos DB for PostgreSQL

[!INCLUDE [PostgreSQL](../includes/appliesto-postgresql.md)]

PostgreSQL extend the functionality of your database by using extensions. Extensions allow for bundling multiple related SQL objects together in a single package that can be loaded or removed from your database with a single command. After being loaded in the database, extensions can function like built-in features. For more information on PostgreSQL extensions, see [Package related objects into an extension](https://www.postgresql.org/docs/current/static/extend-extensions.html).

## Use PostgreSQL extensions

PostgreSQL extensions must be installed in your database before you can use them. To install a particular extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/current/static/sql-createextension.html) command from the psql tool to load the packaged objects into your database.

> [!NOTE]
> If `CREATE EXTENSION` fails with a permission denied error, try the
> `create_extension()` function instead. For instance:
>
> ```sql
> SELECT create_extension('postgis');
> ```
>
> To remove an extension installed this way, use `drop_extension()`.

Azure Cosmos DB for PostgreSQL currently supports a subset of key extensions as listed here. Extensions other than the ones listed aren't supported. You can't create your own extension with Azure Cosmos DB for PostgreSQL.

## Extensions supported by Azure Cosmos DB for PostgreSQL

The following tables list the standard PostgreSQL extensions that are supported on Azure Cosmos DB for PostgreSQL. This information is also available by running `SELECT * FROM pg_available_extensions;`.

The versions of each extension installed in a cluster sometimes differ based on the version of PostgreSQL (11, 12, 13, 14, 15, or 16). The tables list extension versions per database version.

### Citus extension

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [citus](https://github.com/citusdata/citus) | Citus distributed database. | 9.5 | 10.2 | 11.3 | 12.1 | 12.1 | 12.1 |

### Data types extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [citext](https://www.postgresql.org/docs/current/static/citext.html) | Provides a case-insensitive character string type. | 1.5 | 1.6 | 1.6 | 1.6 | 1.6 | 1.6 |
> | [cube](https://www.postgresql.org/docs/current/static/cube.html) | Provides a data type for multidimensional cubes. | 1.4 | 1.4 | 1.4 | 1.5 | 1.5 | 1.5 |
> | [hll](https://github.com/citusdata/postgresql-hll) | Provides a HyperLogLog data structure. | 2.18 | 2.18 | 2.18 | 2.18 | 2.18 | 2.18 |
> | [hstore](https://www.postgresql.org/docs/current/static/hstore.html) | Provides a data type for storing sets of key-value pairs. | 1.5 | 1.6 | 1.7 | 1.8 | 1.8 | 1.8 |
> | [isn](https://www.postgresql.org/docs/current/static/isn.html) | Provides data types for international product numbering standards. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [lo](https://www.postgresql.org/docs/current/lo.html) | Large Object maintenance. | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |
> | [ltree](https://www.postgresql.org/docs/current/static/ltree.html) | Provides a data type for hierarchical tree-like structures. | 1.1 | 1.1 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [seg](https://www.postgresql.org/docs/current/seg.html) | Data type for representing line segments or floating-point intervals. | 1.3 | 1.3 | 1.3 | 1.4 | 1.4 | 1.4 |
> | [tdigest](https://github.com/tvondra/tdigest) | Data type for on-line accumulation of rank-based statistics such as quantiles and trimmed means. | 1.4.1 | 1.4.1 | 1.4.1 | 1.4.1 | 1.4.1 | 1.4.1 |
> | [topn](https://github.com/citusdata/postgresql-topn/) | Type for top-n JSONB. | 2.6.0 | 2.6.0 | 2.6.0 | 2.6.0 | 2.6.0 | 2.6.0 |

### Full-text search extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [dict\_int](https://www.postgresql.org/docs/current/static/dict-int.html) | Provides a text search dictionary template for integers. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [dict\_xsyn](https://www.postgresql.org/docs/current/dict-xsyn.html) | Text search dictionary template for extended synonym processing. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [unaccent](https://www.postgresql.org/docs/current/static/unaccent.html) | A text search dictionary that removes accents (diacritic signs) from lexemes. | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |

### Functions extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 15** |
> |---|---|---|---|---|---|
> | [autoinc](https://www.postgresql.org/docs/current/contrib-spi.html#id-1.11.7.45.7) | Functions for autoincrementing fields. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [earthdistance](https://www.postgresql.org/docs/current/static/earthdistance.html) | Provides a means to calculate great-circle distances on the surface of the Earth. | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |
> | [fuzzystrmatch](https://www.postgresql.org/docs/current/static/fuzzystrmatch.html) | Provides several functions to determine similarities and distance between strings. | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.2 |
> | [insert\_username](https://www.postgresql.org/docs/current/contrib-spi.html#id-1.11.7.45.8) | Functions for tracking who changed a table. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [intagg](https://www.postgresql.org/docs/current/intagg.html) | Integer aggregator and enumerator (obsolete). | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |
> | [intarray](https://www.postgresql.org/docs/current/static/intarray.html) | Provides functions and operators for manipulating null-free arrays of integers. | 1.2 | 1.2 | 1.3 | 1.5 | 1.5 | 1.5 |
> | [moddatetime](https://www.postgresql.org/docs/current/contrib-spi.html#id-1.11.7.45.9) | Functions for tracking last modification time. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [pg\_partman](https://pgxn.org/dist/pg_partman/doc/pg_partman.html) | Manages partitioned tables by time or ID. | 4.7.4 | 4.7.4 | 4.7.4 | 5.0.0 | 5.0.0 | 5.0.0 |
> | [pg\_surgery](https://www.postgresql.org/docs/current/pgsurgery.html) | Functions to perform surgery on a damaged relation. |     |     |     | 1.0 | 1.0 | 1.0 |
> | [pg\_trgm](https://www.postgresql.org/docs/current/static/pgtrgm.html) | Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching. | 1.4 | 1.4 | 1.5 | 1.6 | 1.6 | 1.6 |
> | [pgcrypto](https://www.postgresql.org/docs/current/static/pgcrypto.html) | Provides cryptographic functions. | 1.3 | 1.3 | 1.3 | 1.3 | 1.3 | 1.3 |
> | [refint](https://www.postgresql.org/docs/current/contrib-spi.html#id-1.11.7.45.5) | Functions for implementing referential integrity (obsolete). | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [tablefunc](https://www.postgresql.org/docs/current/static/tablefunc.html) | Provides functions that manipulate whole tables, including crosstab. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [tcn](https://www.postgresql.org/docs/current/tcn.html) | Triggered change notifications. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [timetravel](https://www.postgresql.org/docs/current/contrib-spi.html#id-1.11.7.45.6) | Functions for implementing time travel. | 1.0 | | | | |
> | [uuid-ossp](https://www.postgresql.org/docs/current/static/uuid-ossp.html) | Generates universally unique identifiers (UUIDs). | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |

### Index types extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [bloom](https://www.postgresql.org/docs/current/bloom.html) | Bloom access method - signature file-based index. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [btree\_gin](https://www.postgresql.org/docs/current/static/btree-gin.html) | Provides sample GIN operator classes that implement B-tree-like behavior for certain data types. | 1.3 | 1.3 | 1.3 | 1.3 | 1.3 | 1.3 |
> | [btree\_gist](https://www.postgresql.org/docs/current/static/btree-gist.html) | Provides GiST index operator classes that implement B-tree. | 1.5 | 1.5 | 1.5 | 1.6 | 1.7 | 1.7 |

### Language extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [plpgsql](https://www.postgresql.org/docs/current/static/plpgsql.html) | PL/pgSQL loadable procedural language. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |

### Miscellaneous extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [amcheck](https://www.postgresql.org/docs/current/amcheck.html) | Functions for verifying relation integrity. | 1.1 | 1.2 | 1.2 | 1.3 | 1.3 | 1.3 |
> | [dblink](https://www.postgresql.org/docs/current/dblink.html) | A module that supports connections to other PostgreSQL databases from within a database session. See the "dblink and postgres_fdw" section for information about this extension. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [old\_snapshot](https://www.postgresql.org/docs/current/oldsnapshot.html) | Allows inspection of the server state that is used to implement old_snapshot_threshold. |     |     |     | 1.0 | 1.0 |     |
> | [pageinspect](https://www.postgresql.org/docs/current/pageinspect.html) | Inspect the contents of database pages at a low level. | 1.7 | 1.7 | 1.8 | 1.9 | 1.11 | 1.12 |
> | [pg\_azure\_storage](howto-ingest-azure-blob-storage.md) | Azure integration for PostgreSQL. | | | 1.3 | 1.3 | 1.3 | 1.3 |
> | [pg\_buffercache](https://www.postgresql.org/docs/current/static/pgbuffercache.html) | Provides a means for examining what's happening in the shared buffer cache in real time. | 1.3 | 1.3 | 1.3 | 1.3 | 1.3 | 1.4 |
> | [pg\_cron](https://github.com/citusdata/pg_cron) | Job scheduler for PostgreSQL. | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 |
> | [pg\_freespacemap](https://www.postgresql.org/docs/current/pgfreespacemap.html) | Examine the free space map (FSM). | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [pg\_prewarm](https://www.postgresql.org/docs/current/static/pgprewarm.html) | Provides a way to load relation data into the buffer cache. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [pg\_stat\_statements](https://www.postgresql.org/docs/current/static/pgstatstatements.html) | Provides a means for tracking execution statistics of all SQL statements executed by a server. See the "pg_stat_statements" section for information about this extension. | 1.6 | 1.7 | 1.8 | 1.9 | 1.10 | 1.10 |
> | [pg\_visibility](https://www.postgresql.org/docs/current/pgvisibility.html) | Examine the visibility map (VM) and page-level visibility information. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [pgrowlocks](https://www.postgresql.org/docs/current/static/pgrowlocks.html) | Provides a means for showing row-level locking information. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [pgstattuple](https://www.postgresql.org/docs/current/static/pgstattuple.html) | Provides a means for showing tuple-level statistics. | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 | 1.5 |
> | [postgres\_fdw](https://www.postgresql.org/docs/current/static/postgres-fdw.html) | Foreign-data wrapper used to access data stored in external PostgreSQL servers. See the "dblink and postgres_fdw" section for information about this extension.| 1.0 | 1.0 | 1.0 | 1.1 | 1.1 | 1.1 |
> | [sslinfo](https://www.postgresql.org/docs/current/sslinfo.html) | Information about TLS/SSL certificates. | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 | 1.2 |
> | [tsm\_system\_rows](https://www.postgresql.org/docs/current/tsm-system-rows.html) | TABLESAMPLE method, which accepts number of rows as a limit. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [tsm\_system\_time](https://www.postgresql.org/docs/current/tsm-system-time.html) | TABLESAMPLE method, which accepts time in milliseconds as a limit. | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 | 1.0 |
> | [xml2](https://www.postgresql.org/docs/current/xml2.html) | XPath querying and XSLT. | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 | 1.1 |

### Pgvector extension
> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> [pgvector](https://github.com/pgvector/pgvector#installation-notes) | Open-source vector similarity search for Postgres | 0.5.1 | 0.5.1 | 0.5.1 | 0.5.1 | 0.5.1 | 0.5.1 |

### PostGIS extensions

> [!div class="mx-tableFixed"]
> | **Extension** | **Description** | **PG 11** | **PG 12** | **PG 13** | **PG 14** | **PG 15** | **PG 16** |
> |---|---|---|---|---|---|
> | [PostGIS](https://www.postgis.net/) | Spatial and geographic objects for PostgreSQL. | 3.3.4 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 |
> | address\_standardizer | Used to parse an address into constituent elements. Used to support geocoding address normalization step. | 3.3.4 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 |
> | postgis\_sfcgal | PostGIS SFCGAL functions. | 3.3.4 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 |
> | postgis\_topology | PostGIS topology spatial types and functions. | 3.3.4 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 | 3.4.0 |


## pg_stat_statements
The [pg\_stat\_statements extension](https://www.postgresql.org/docs/current/pgstatstatements.html) is preloaded on every Azure Cosmos DB for PostgreSQL cluster to provide you with a means of tracking execution statistics of SQL statements.

The setting `pg_stat_statements.track` controls what statements are counted by the extension. It defaults to `top`, which means that all statements issued directly by clients are tracked. The two other tracking levels are `none` and `all`.

There's a tradeoff between the query execution information pg_stat_statements provides and the effect on server performance as it logs each SQL statement. If you aren't actively using the pg_stat_statements extension, we recommend that you set `pg_stat_statements.track` to `none`. Some third-party monitoring services might rely on pg_stat_statements to deliver query performance insights, so confirm whether it's the case for you or not.

## dblink and postgres_fdw

You can use dblink and postgres\_fdw to connect from one PostgreSQL server to
another, or to another database in the same server.  The receiving server needs
to allow connections from the sending server through its firewall.  To use
these extensions to connect between Azure Cosmos DB for PostgreSQL clusters with [public access](./concepts-firewall-rules.md), set **Allow Azure services and resources to access this cluster (or
server)** to ON.  You also need to turn this setting ON if you want to use the
extensions to loop back to the same server.  The **Allow Azure services and
resources to access this cluster** setting can be found in the Azure portal
page for the cluster under **Networking**.  Currently, outbound connections
from Azure Cosmos DB for PostgreSQL aren't supported.
