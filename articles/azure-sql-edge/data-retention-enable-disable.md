---
title: Enable and disable data retention policies - Azure SQL Edge
description: Learn how to enable and disable data retention policies in Azure SQL Edge
keywords: SQL Edge, data retention
services: sql-edge
ms.service: sql-edge
ms.topic: conceptual
author: SQLSourabh
ms.author: sourabha
ms.reviewer: sstein
ms.date: 09/04/2020
---

# Enable and disable data retention policies

This topic describes how to enable and disable data retention policies for a database and a table. 

## Enable data retention for a database

The following example shows how to enable data retention by using [Alter Database](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-options).

```sql
ALTER DATABASE [<DatabaseName>] SET DATA_RETENTION  ON;
```

## Check if data retention is enabled for a database

The following command can be used to check if data retention is enabled for a database
```sql
SELECT is_data_retention_enabled, name
FROM sys.databases;
```

## Enable data retention for a table

Data Retention must be enabled for each table for which you want data to be automatically purged. When Data Retention is enabled on the database and the table, a background system task will periodically scan the table to identify and delete any obsolete (aged) rows. Data Retention can be enabled on a table either during table creation using [Create Table](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql) or by using [Alter Table](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql).

The following example shows how to enable data retention for a table by using [Create Table](https://docs.microsoft.com/sql/t-sql/statements/create-table-transact-sql). 

```sql
CREATE TABLE [dbo].[data_retention_table] 
(
[dbdatetime2] datetime2(7), 
[product_code] int, 
[value] char(10),  
CONSTRAINT [pk_current_data_retention_table] PRIMARY KEY CLUSTERED ([product_code])
) WITH (DATA_DELETION = ON ( FILTER_COLUMN = [dbdatetime2], RETENTION_PERIOD = 1 day ) )
```

The `WITH (DATA_DELETION = ON ( FILTER_COLUMN = [dbdatetime2], RETENTION_PERIOD = 1 day ) )` part of the create table command sets the data retention on the table. The command uses the following required parameters 

- DATA_DELETION - Indicates whether data retention is ON or OFF.
- FILTER_COLUMN - Name on the column in the table, which will be used to ascertain if the rows are obsolete or not. The filter column can only be a column with the following data types 
    - Date
    - SmallDateTime
    - DateTime
    - DateTime2
    - DateTimeOffset
- RETENTION_PERIOD - An integer value followed by a unit descriptor. The allowed units are DAY, DAYS, WEEK, WEEKS, MONTH, MONTHS, YEAR and YEARS.

The following example shows how to enable data retention for table by using [Alter Table](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql).  

```sql
Alter Table [dbo].[data_retention_table]
SET (DATA_DELETION = On (FILTER_COLUMN = [timestamp], RETENTION_PERIOD = 1 day))
```

## Check if data retention is enabled for a table

The following command can be used to check the tables for which data retention is enabled

```sql
select name, data_retention_period, data_retention_period_unit from sys.tables
```

A value of data_retention_period = -1 and data_retention_period_unit as INFINITE, indicates that data retention is not set on the table.

The following query can be used to identify the column used as the filter_column for data retention. 

```sql
Select name from sys.columns
where is_data_deletion_filter_column =1 
and object_id = object_id(N'dbo.data_retention_table', N'U')
```

## Corelating DB and table data retention settings

The data retention setting on the database and the table, are used in conjunction to determine if autocleanup for aged rows will run on the tables or not. 

|Database Option | Table Option | Behavior |
|----------------|--------------|----------|
| OFF | OFF | Data Retention policy is disabled and both auto and manual cleanup of aged records is disabled.|
| OFF | ON  | Data Retention policy is enabled for the table. Auto cleanup of obsolete records is disabled, however manual cleanup method can be used to cleanup obsolete records. |
| ON | OFF | Data Retention policy is enabled at the database level. However since the option is disabled at the table level, there is no retention-based cleanup of aged rows.|
| ON | ON | Data Retention policy is enabled for both the database and tables. Automatic cleanup of obsolete records is enabled. |

## Disable data retention on a table 

Data Retention can be disabled on a table by using [Alter Table](https://docs.microsoft.com/sql/t-sql/statements/alter-table-transact-sql). The following command can be used to disable data retention on a table.

```sql
Alter Table [dbo].[data_retention_table]
Set (DATA_DELETION = OFF)
```

## Disable data retention on a database

Data Retention can be disabled on a table by using [Alter Database](https://docs.microsoft.com/sql/t-sql/statements/alter-database-transact-sql-set-options). The following command can be used to disable data retention on a database.

```sql
ALTER DATABASE <DatabaseName> SET DATA_RETENTION  OFF;
```

## Next steps
- [Data Retention and Automatic Data Purging](data-retention-overview.md)
- [Manage historical data with retention policy](data-retention-cleanup.md)
