---
title: "Known issues: Migrate from Oracle to Azure Database for PostgreSQL"
titleSuffix: Azure Database Migration Service
description: Learn about known issues and migration limitations with online migrations from Oracle to Azure Database for PostgreSQL-Single server using the Azure Database Migration Service.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: "seo-lt-2019"
ms.topic: article
ms.date: 05/20/2020
---

# Known issues/migration limitations with online migrations from Oracle to Azure DB for PostgreSQL-Single server

Known issues and limitations associated with online migrations from Oracle to Azure Database for PostgreSQL-Single server are described in the following sections.

## Oracle versions supported as a source database

Azure Database Migration Service supports connecting to:

- Oracle version 10g, 11g, and 12c.
- Oracle Enterprise, Standard, Express, and Personal Edition.

Azure Database Migration Service doesn't support connecting to multi-tenant container databases (CDBs).

## PostgreSQL versions supported as a target database

Azure Database Migration Service supports migrations to Azure Database for PostgreSQL-Single server version 9.5, 9.6, 10 and 11. See the article [Supported PostgreSQL database versions](https://docs.microsoft.com/azure/postgresql/concepts-supported-versions) for current information on version support in Azure Database for PostgreSQL-Single server.

## Datatype limitations

The following datatypes **won't** be migrated:

- BFILE
- ROWID
- REF
- UROWID
- ANYDATA
- SDO_GEOMETRY
- Nested tables
- User-defined data types
- Notes
- Virtual columns
- Materialized views based on ROWID column

Also, empty BLOB/CLOB columns are mapped to NULL on the target.

## LOB limitations

- When Limited-size LOB mode is enabled, empty LOBs on the Oracle source are replicated as NULL values.
- Long object names (over 30 bytes) aren't supported.
- Data in LONG and LONG RAW column can't exceed 64k. Any data beyond 64k will be truncated.
- In Oracle 12 only, any changes to LOB columns aren't supported (migrated).
- UPDATEs to XMLTYPE and LOB columns aren't supported (migrated).

## Known issues and limitations

- The user must have DBA privilege on the Oracle Server.
- Data changes resulting from partition/sub-partition operations (ADD, DROP, EXCHANGE, and TRUNCATE) won't be migrated and may cause the following errors:
  - For ADD operations, updates and deletes on the added data may return a "0 rows affected" warning.
  - For DROP and TRUNCATE operations, new inserts may result in "duplicates" errors.
  - For EXCHANGE operations, both a "0 rows affected" warning and "duplicates" errors may occur.
- Tables whose names contain apostrophes can't be replicated.
