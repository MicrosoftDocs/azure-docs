---
title: Using PostgreSQL extensions in Azure Database for PostgreSQL  | Microsoft Docs
description: Describes the ability to extend the functionality of your database using extensions in Azure Database for PostgreSQL.
services: postgresql
author: SaloniSonpal
ms.author: salonis
manager: jhubbard
editor: jasonwhowell
ms.service: postgresql-database
ms.topic: article
ms.date: 06/29/2017
---
# PostgreSQL Extensions in Azure Database for PostgreSQL
PostgreSQL provides the ability to extend the functionality of your database using extensions. Extensions allow for multiple related SQL objects to be bundled together in a single package and can be loaded or removed from your database with a single command. Extensions once loaded into the database can function just like features that are built in. For more information on PostgreSQL extensions, see [Packaging Related Objects into an Extension](https://www.postgresql.org/docs/9.6/static/extend-extensions.html).

## How to use PostgreSQL extensions?
PostgreSQL extensions need to be installed for your database before you can use them. To install a particular extension, run the [CREATE EXTENSION](https://www.postgresql.org/docs/9.6/static/sql-createextension.html) command from psql tool to load the packaged objects into your database.

Azure Database for PostgreSQL supports a subset of key extensions as listed here. Beyond the ones listed, other extensions are not supported. You cannot create your own extension with Azure Database for PostgreSQL service.

## Extensions supported by Azure Database for PostgreSQL
The following tables list the standard PostgreSQL extensions that are currently supported by Azure Database for PostgreSQL. You can also obtain this information by querying pg\_available\_extensions. 

### Data types extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|------------------------------------------------------------------|--------------------------------------------------------|
| [citext](https://www.postgresql.org/docs/9.6/static/citext.html) | Provides a case-insensitive character string type |
| [hstore](https://www.postgresql.org/docs/9.6/static/hstore.html) | Provides data type for storing sets of key/value pairs |

### Functions extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|--------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| [fuzzystrmatch](https://www.postgresql.org/docs/9.6/static/fuzzystrmatch.html) | Provides several functions to determine similarities and distance between strings. |
| [intarray](https://www.postgresql.org/docs/9.6/static/intarray.html) | Provides functions and operators for manipulating null-free arrays of integers. |
| [pgcrypto](https://www.postgresql.org/docs/9.6/static/pgcrypto.html) | Provides cryptographic functions |
| [pg\_partman](https://pgxn.org/dist/pg_partman/doc/pg_partman.html) | Manages partitioned tables by time or ID |
| [pg\_trgm](https://www.postgresql.org/docs/9.6/static/pgtrgm.html) | Provides functions and operators for determining the similarity of alphanumeric text based on trigram matching |
| [uuid-ossp](https://www.postgresql.org/docs/9.6/static/uuid-ossp.html) | Generate universally unique identifiers (UUIDs) |

### Full-text Search extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|----------------------------------------------------------------------|-------------------------------------------------------------------------------|
| [unaccent](https://www.postgresql.org/docs/9.6/static/unaccent.html) | A text search dictionary that removes accents (diacritic signs) from lexemes. |

### Index Types extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|---------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------|
| [btree\_gin](https://www.postgresql.org/docs/9.6/static/btree-gin.html) | Provides sample GIN operator classes that implement B-tree like behavior for certain data types. |
| [btree\_gist](https://www.postgresql.org/docs/9.6/static/btree-gist.html) | Provides GiST index operator classes that implement B-tree. |

### Language extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|--------------------------------------------------------------------|---------------------------------------|
| [plpgsql](https://www.postgresql.org/docs/9.6/static/plpgsql.html) | PL/pgSQL loadable procedural language |

### Miscellaneous extensions

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|
| [pg\_buffercache](https://www.postgresql.org/docs/9.6/static/pgbuffercache.html) | Provides a means for examining what's happening in the shared buffer cache in real time. |
| [pg\_prewarm](https://www.postgresql.org/docs/9.6/static/pgprewarm.html) | Provides a way to load relation data into the buffer cache. |
| [pg\_stat\_statements](https://www.postgresql.org/docs/9.6/static/pgstatstatements.html) | Provides a means for tracking execution statistics of all SQL statements executed by a server. |
| [postgres\_fdw](https://www.postgresql.org/docs/9.6/static/postgres-fdw.html) | Foreign-data wrapper used to access data stored in external PostgreSQL servers |

### PostGIS

> [!div class="mx-tableFixed"]
| **Extension** | **Description** |
|--------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------|
| [PostGIS](http://www.postgis.net/), postgis\_topology, postgis\_tiger\_geocoder, postgis\_sfcgal | Spatial and geographic objects for PostgreSQL. |
| address\_standardizer, address\_standardizer\_data\_us | Used to parse an address into constituent elements. Used to support geocoding address normalization step. |
| [pgrouting](http://pgrouting.org/) | Extends the PostGIS / PostgreSQL geospatial database to provide geospatial routing functionality. |

## Next steps
Don't see an extension you'd like to use? Please let us know. Vote for existing requests or create new feedback and wishes in our [Customer feedback forum](https://feedback.azure.com/forums/597976-azure-database-for-postgresql).
