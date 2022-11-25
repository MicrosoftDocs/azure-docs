---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Test Plans"
description: "WWI created a test plan that included a set of IT and the Business tasks. Successful migrations require all the tests to be executed."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Test Plans

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Migration methods](05-migration-methods.md)

## Overview

WWI created a test plan that included a set of IT and the Business tasks. Successful migrations require all the tests to be executed.

Tests:

  - Ensure the migrated database has consistency (same record counts and query results) with on-premises tables.

  - Ensure the performance is acceptable (it should match the same performance as if it were running on-premises).

  - Ensure the performance of target queries meets stated requirements.

  - Ensure acceptable network connectivity between on-premises and the Azure network.

  - Ensure all identified applications and users can connect to the migrated data instance.

WWI has identified a migration weekend and time window that started at 10 pm and ended at 2 am Pacific Time. If the migration didn't complete before the 2 am target (the 4-hr downtime target) with all tests passing, the rollback procedures were started. Issues were documented for future migration attempts. All migrations windows were pushed forward and rescheduled based on acceptable business timelines.

## Sample queries

A series of queries was executed on the source and target to verify the database migration success. The following queries and scripts help determine if the migration actions moved all required database objects from the source to the target.

### Table rows

You can use this query to get all the tables and an estimated row count:

```
SELECT SUM(TABLE_ROWS)
FROM INFORMATION_SCHEMA.TABLES
WHERE TABLE_SCHEMA = '{SchemaName}';
```

> [!NOTE]
> The `INFORMATION_SCHEMA` table provides an estimated set of values across the tables. To get a more accurate view of metrics like table size, increase the page sample size with the `innodb_stats_transient_sample_pages` server parameter. Increasing this server value forces more pages to be analyzed and provide more accurate results.

Execute the `count(*)` SQL statement against every table to get an accurate count of rows. Running this command can take a large amount of time on large tables. The following script generates a set of SQL statements that can be executed to get the exact counts:

```sql
SELECT CONCAT( 
    'SELECT "', 
    table_name, 
    '" AS table_name, COUNT(*) AS exact_row_count FROM `', 
    table_schema, 
    '`.`', 
    table_name, 
    '` UNION ' 
)  
FROM INFORMATION_SCHEMA.TABLES 
WHERE table_schema = '**my_schema**';
```

### Table fragmentation

The data tables are likely to continue to grow larger with continued application use. In some cases, the data may not grow, but it constantly changing through deletions and updates. If so, it's possible there's numerous fragmentation in the database files. The MySQL OPTIMIZE TABLE statement can reduce physical storage space needs and improve I/O efficiency.

You can [optimize the MySQL tables](https://dev.mysql.com/doc/refman/8.0/en/optimize-table.html) by running the following:

`optimize table TABLE_NAME`

### Database objects

Use the following query to ensure that all other database objects are accounted for. Although these queries can calculate the table row counts, they may not account for the version of the particular database object. For example, even though a stored procedure may exist, it could have changed between the start and end of the migration. Freezing database object development during migration is recommended.

**Users**

```sql
SELECT DISTINCT 
        USER 
FROM 
        mysql.user 
WHERE 
        user <> '' order by user
```

**Indexes**

```sql
SELECT DISTINCT 
        INDEX_NAME 
FROM 
        information_schema.STATISTICS 
WHERE 
        TABLE_SCHEMA = '{SchemaName}'
```

**Constraints**

```sql
SELECT DISTINCT 
        CONSTRAINT_NAME 
FROM 
        information_schema.TABLE_CONSTRAINTS 
WHERE 
        CONSTRAINT_SCHEMA = '{SchemaName}'
```

**Views**

```sql
SELECT 
        TABLE_NAME 
FROM 
        information_schema.VIEWS 
WHERE 
        TABLE_SCHEMA = '{SchemaName}'
```

**Stored Procedures**

```sql
SELECT 
        ROUTINE_NAME 
FROM 
        information_schema.ROUTINES 
WHERE 
        ROUTINE_TYPE = 'FUNCTION' and 
        ROUTINE_SCHEMA = '{SchemaName}'
```

**Functions**

```sql
SELECT 
        ROUTINE_NAME 
FROM 
        information_schema.ROUTINES 
WHERE 
        ROUTINE_TYPE = 'PROCEDURE' and 
        ROUTINE_SCHEMA = '{SchemaName}'
```

**Events**

```sql
SELECT 
        EVENT_NAME 
FROM 
        INFORMATION_SCHEMA.EVENTS 
WHERE 
        EVENT_SCHEMA = '{SchemaName}'
```

## Rollback strategies

The queries above provide a list of object names and counts used in a rollback decision. Migration users can take the first object verification step by checking the source and target object counts. A discrepancy in object counts may not necessarily mean a rollback is needed. Performing an in-depth evaluation could point out the difference is slight and easily recoverable. Manual migration of a few failed objects could be the solution. For example, if all tables and data rows were migrated, only a few of the functions were missed, remediate those failed objects and finalize the migration. If the database is relatively small, it could be possible to clear the Azure Database for MySQL instance and restart the migration. Large databases may need more time than available in the migration window to determine missing objects. The migration needs to stop and roll back.

Identifying missing database objects needs to occur quickly during a migration window. Every minute counts. One option could be to export the environment object names to a file and use a data comparison tool to identify missing objects quickly. Another option could be, export the source database object names and import the data into a target database environment temp table. Compare the data using a **scripted** and **tested** SQL statement. Data verification speed and accuracy are critical to the migration process. Don't rely on manually reading and verifying a long list of database objects during a migration window. The possibility of human error is too great. It would be best if you managed by exception using tools.

## WWI scenario

The WWI CIO received a confirmation report that all database objects were migrated from the on-premises database to the Azure Database for MySQL instance. The database team ran the above queries against the database before the beginning of the migration and saved all the results to a spreadsheet.

The source database schema information was used to verify the target migration object fidelity.

## Test plans checklist

  - Have test queries scripted, tested, and ready to execute.

  - Know how long test queries take to run and make it a part of the documented migration timeline.

  - Have a mitigation and rollback strategy ready for different potential outcomes.

  - Have a well-defined timeline of events for the migration.  


## Next steps

> [!div class="nextstepaction"]
> [Performance Baselines](./07-performance-baselines.md)