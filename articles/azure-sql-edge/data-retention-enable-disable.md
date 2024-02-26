---
title: Enable and disable data retention policies - Azure SQL Edge
description: Learn how to enable and disable data retention policies in Azure SQL Edge
author: rwestMSFT
ms.author: randolphwest
ms.date: 09/14/2023
ms.service: sql-edge
ms.topic: conceptual
keywords:
  - SQL Edge
  - data retention
---
# Enable and disable data retention policies

> [!IMPORTANT]  
> Azure SQL Edge no longer supports the ARM64 platform.

This article describes how to enable and disable data retention policies for a database and a table.

## Enable data retention for a database

The following example shows how to enable data retention by using [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql-set-options).

```sql
ALTER DATABASE [<DatabaseName>] SET DATA_RETENTION ON;
```

## Check if data retention is enabled for a database

The following command can be used to check if data retention is enabled for a database.

```sql
SELECT is_data_retention_enabled,
    name
FROM sys.databases;
```

## Enable data retention for a table

Data Retention must be enabled for each table for which you want data to be automatically purged. When data retention is enabled on the database and the table, a background system task periodically scans the table to identify and delete any obsolete (aged) rows. Data retention can be enabled on a table either during table creation using [CREATE TABLE](/sql/t-sql/statements/create-table-transact-sql) or by using [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql).

The following example shows how to enable data retention for a table by using [CREATE TABLE](/sql/t-sql/statements/create-table-transact-sql).

```sql
CREATE TABLE [dbo].[data_retention_table] (
    [dbdatetime2] DATETIME2(7),
    [product_code] INT,
    [value] CHAR(10),
    CONSTRAINT [pk_current_data_retention_table] PRIMARY KEY CLUSTERED ([product_code])
)
WITH (
        DATA_DELETION = ON (
            FILTER_COLUMN = [dbdatetime2],
            RETENTION_PERIOD = 1 day
            )
        );
```

The `WITH (DATA_DELETION = ON (FILTER_COLUMN = [dbdatetime2], RETENTION_PERIOD = 1 day))` part of the CREATE TABLE command sets the data retention on the table. The command uses the following required parameters:

- DATA_DELETION: Indicates whether data retention is ON or OFF.

- FILTER_COLUMN: Name on the column in the table, which will be used to ascertain if the rows are obsolete or not. The filter column can only be a column with the following data types:

    - **date**
    - **smalldatetime**
    - **datetime**
    - **datetime2**
    - **datetimeoffset**

- RETENTION_PERIOD: An integer value followed by a unit descriptor. The allowed units are DAY, DAYS, WEEK, WEEKS, MONTH, MONTHS, YEAR and YEARS.

The following example shows how to enable data retention for table by using [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql).

```sql
ALTER TABLE [dbo].[data_retention_table]
SET (
    DATA_DELETION = ON (
        FILTER_COLUMN = [timestamp],
        RETENTION_PERIOD = 1 day
    )
)
```

## Check if data retention is enabled for a table

The following command can be used to check the tables for which data retention is enabled

```sql
SELECT name,
    data_retention_period,
    data_retention_period_unit
FROM sys.tables;
```

A value of `data_retention_period = -1` and `data_retention_period_unit` as INFINITE, indicates that data retention isn't set on the table.

The following query can be used to identify the column used as the `filter_column` for data retention.

```sql
SELECT name
FROM sys.columns
WHERE is_data_deletion_filter_column = 1
    AND object_id = object_id(N'dbo.data_retention_table', N'U');
```

## Correlate database and table data retention settings

The data retention setting on the database and the table are used in conjunction to determine if autocleanup for aged rows runs on the tables.

| Database option | Table option | Behavior |
| --- | --- | --- |
| OFF | OFF | Data retention policy is disabled and both auto and manual cleanup of aged records is disabled. |
| OFF | ON | Data retention policy is enabled for the table. Auto cleanup of obsolete records is disabled, however manual cleanup method can be used to clean up obsolete records. |
| ON | OFF | Data retention policy is enabled at the database level. However since the option is disabled at the table level, there's no retention-based cleanup of aged rows. |
| ON | ON | Data retention policy is enabled for both the database and tables. Automatic cleanup of obsolete records is enabled. |

## Disable data retention on a table

Data retention can be disabled on a table by using [ALTER TABLE](/sql/t-sql/statements/alter-table-transact-sql). The following command can be used to disable data retention on a table.

```sql
ALTER TABLE [dbo].[data_retention_table]
SET (DATA_DELETION = OFF);
```

## Disable data retention on a database

Data retention can be disabled on a table by using [ALTER DATABASE](/sql/t-sql/statements/alter-database-transact-sql-set-options). The following command can be used to disable data retention on a database.

```sql
ALTER DATABASE [<DatabaseName>] SET DATA_RETENTION OFF;
```

## Next steps

- [Data Retention and Automatic Data Purging](data-retention-overview.md)
- [Manage historical data with retention policy](data-retention-cleanup.md)
