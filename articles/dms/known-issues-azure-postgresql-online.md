---
title: "Known issues: Online migrations from PostgreSQL to Azure Database for PostgreSQL"
titleSuffix: Azure Database Migration Service
description: Learn about known issues and migration limitations with online migrations from PostgreSQL to Azure Database for PostgreSQL using the Azure Database Migration Service.
services: database-migration
author: arunkumarthiags
ms.author: arthiaga
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: [seo-lt-2019, seo-dt-2019]
ms.topic: troubleshooting
ms.date: 02/20/2020
---

# Known issues/migration limitations with online migrations from PostgreSQL to Azure DB for PostgreSQL

Known issues and limitations associated with online migrations from PostgreSQL to Azure Database for PostgreSQL are described in the following sections.

## Online migration configuration

- The source PostgreSQL server must be running version 9.4, 9.5, 9.6, 10, or 11. For more information, see the article [Supported PostgreSQL Database Versions](../postgresql/concepts-supported-versions.md).
- Only migrations to the same or a higher version are supported. For example, migrating PostgreSQL 9.5 to Azure Database for PostgreSQL 9.6 or 10 is supported, but migrating from PostgreSQL 11 to PostgreSQL 9.6 isn't supported.
- To enable logical replication in the **source PostgreSQL postgresql.conf** file, set the following parameters:
  - **wal_level** = logical
  - **max_replication_slots** = [at least max number of databases for migration]; if you want to migrate four databases, set the value to at least 4.
  - **max_wal_senders** = [number of databases running concurrently]; the recommended value is 10
- Add DMS agent IP to the source PostgreSQL pg_hba.conf
  1. Make a note of the DMS IP address after you finish provisioning an instance of Azure Database Migration Service.
  2. Add the IP address to the pg_hba.conf file as shown:

      ```
          host    all    172.16.136.18/10    md5
          host    replication postgres    172.16.136.18/10     md5
      ```

- The user must have the REPLICATION role on the server hosting the source database.
- The source and target database schemas must match.

## Size limitations
- You can migrate up to 1 TB of data from PostgreSQL to Azure DB for PostgreSQL using a single DMS service.
## Datatype limitations

  **Limitation**: If there's no primary key on tables, changes may not be synced to the target database.

  **Workaround**: Temporarily set a primary key for the table for migration to continue. You can remove the primary key after data migration is complete.

## Limitations when migrating online from AWS RDS PostgreSQL

When you try to perform an online migration from AWS RDS PostgreSQL to Azure Database for PostgreSQL, you may encounter the following errors.

- **Error**: The Default value of column '{column}' in table '{table}' in database '{database}' is different on source and target servers. It's '{value on source}' on source and '{value on target}' on target.

  **Limitation**: This error occurs when the default value on a column schema is different between the source and target databases.
  **Workaround**: Ensure that the schema on the target matches schema on the source. For detail on migrating schema, refer to the [Azure PostgreSQL online migration documentation](./tutorial-postgresql-azure-postgresql-online.md#migrate-the-sample-schema).

- **Error**: Target database '{database}' has '{number of tables}' tables where as source database '{database}' has '{number of tables}' tables. The number of tables on source and target databases should match.

  **Limitation**: This error occurs when the number of tables is different between the source and target databases.

  **Workaround**: Ensure that the schema on the target matches schema on the source. For detail on migrating schema, refer to the [Azure PostgreSQL online migration documentation](./tutorial-postgresql-azure-postgresql-online.md#migrate-the-sample-schema).

- **Error:** The source database {database} is empty.

  **Limitation**: This error occurs when the source database is empty. It is most likely because you have selected the wrong database as source.

  **Workaround**: Double-check the source database you selected for migration, and then try again.

- **Error:** The target database {database} is empty. Please migrate the schema.

  **Limitation**: This error occurs when there's no schema on the target database. Make sure schema on the target matches schema on the source.
  **Workaround**: Ensure that the schema on the target matches schema on the source. For detail on migrating schema, refer to the [Azure PostgreSQL online migration documentation](./tutorial-postgresql-azure-postgresql-online.md#migrate-the-sample-schema).

## Other limitations

- The database name can't include a semi-colon (;).
- A captured table must have a Primary Key. If a table doesn't have a primary key, the result of DELETE and UPDATE record operations will be unpredictable.
- Updating a Primary Key segment is ignored. In such cases, applying such an update will be identified by the target as an update that didn't update any rows and will result in a record written to the exceptions table.
- Migration of multiple tables with the same name but a different case (e.g. table1, TABLE1, and Table1) may cause unpredictable behavior and is therefore not supported.
- Change processing of [CREATE | ALTER | DROP | TRUNCATE] table DDLs isn't supported.
- In Azure Database Migration Service, a single migration activity can only accommodate up to four databases.
- Migration of the pg_largeobject table is not supported. 
