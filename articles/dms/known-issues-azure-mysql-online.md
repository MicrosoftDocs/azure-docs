---
title: Article about known issues/migration limitations with online migrations to Azure Database for MySQL | Microsoft Docs
description: Learn about known issues/migration limitations with online migrations to Azure Database for MySQL.
services: database-migration
author: HJToland3
ms.author: jtoland
manager: craigg
ms.reviewer: craigg
ms.service: dms
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 03/12/2019
---

# Known issues/migration limitations with online migrations to Azure DB for MySQL

Known issues and limitations associated with online migrations from MySQL to Azure Database for MySQL are described in the following sections. 

## Online migration configuration
- The source MySQL Server version must be version 5.6.35, 5.7.18 or later
- Azure Database for MySQL supports:
    - MySQL community edition
    - InnoDB engine
- Same version migration. Migrating MySQL 5.6 to Azure Database for MySQL 5.7 isn't supported.
- Enable binary logging in my.ini (Windows) or my.cnf (Unix)
    - Set Server_id to any number larger or equals to 1, for example, Server_id=1 (only for MySQL 5.6)
    - Set log-bin = \<path> (only for MySQL 5.6)
    - Set binlog_format = row
    - Expire_logs_days = 5 (recommended - only for MySQL 5.6)
- User must have the ReplicationAdmin role.
- Collations defined for the source MySQL database are the same as the ones defined in target Azure Database for MySQL.
- Schema must match between source MySQL database and target database in Azure Database for MySQL.
- Schema in target Azure Database for MySQL must not have foreign keys. Use the following query to drop foreign keys:
    ```
    SET group_concat_max_len = 8192;
    SELECT SchemaName, GROUP_CONCAT(DropQuery SEPARATOR ';\n') as DropQuery, GROUP_CONCAT(AddQuery SEPARATOR ';\n') as AddQuery
    FROM
    (SELECT 
    KCU.REFERENCED_TABLE_SCHEMA as SchemaName, KCU.TABLE_NAME, KCU.COLUMN_NAME,
    	CONCAT('ALTER TABLE ', KCU.TABLE_NAME, ' DROP FOREIGN KEY ', KCU.CONSTRAINT_NAME) AS DropQuery,
        CONCAT('ALTER TABLE ', KCU.TABLE_NAME, ' ADD CONSTRAINT ', KCU.CONSTRAINT_NAME, ' FOREIGN KEY (`', KCU.COLUMN_NAME, '`) REFERENCES `', KCU.REFERENCED_TABLE_NAME, '` (`', KCU.REFERENCED_COLUMN_NAME, '`) ON UPDATE ',RC.UPDATE_RULE, ' ON DELETE ',RC.DELETE_RULE) AS AddQuery
    	FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE KCU, information_schema.REFERENTIAL_CONSTRAINTS RC
    	WHERE
    	  KCU.CONSTRAINT_NAME = RC.CONSTRAINT_NAME
    	  AND KCU.REFERENCED_TABLE_SCHEMA = RC.UNIQUE_CONSTRAINT_SCHEMA
      AND KCU.REFERENCED_TABLE_SCHEMA = ['schema_name']) Queries
      GROUP BY SchemaName;
    ```

    Run the drop foreign key (which is the second column) in the query result.
- Schema in target Azure Database for MySQL must not have any triggers. To drop triggers in target database:
    ```
    SELECT Concat('DROP TRIGGER ', Trigger_Name, ';') FROM  information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'your_schema';
    ```

## Datatype limitations
- **Limitation**: If there's a JSON datatype in the source MySQL database, migration will fail during continuous sync.

    **Workaround**: Modify JSON datatype to medium text or longtext in source MySQL database.

- **Limitation**: If there's no primary key on tables, continuous sync will fail.
 
    **Workaround**: Temporarily set a primary key for the table for migration to continue. You can remove the primary key after data migration is complete.

## LOB limitations
Large Object (LOB) columns are columns that could grow large in size. For MySQL, Medium text, Longtext, Blob, Mediumblob, Longblob, etc. are some of the datatypes of LOB.

- **Limitation**: If LOB data types are used as primary keys, migration will fail.

    **Workaround**: Replace primary key with other datatypes or columns that aren't LOB.

- **Limitation**: If the length of Large Object (LOB) column is bigger than 32 KB, data might be truncated at the target. You can check the length of LOB column using this query:
    ```
    SELECT max(length(description)) as LEN from catalog;
    ```

    **Workaround**: If you have LOB object that is bigger than 32 KB, contact engineering team at [Ask Azure Database Migrations](mailto:AskAzureDatabaseMigrations@service.microsoft.com). 

## Other limitations
- A password string that has opening and closing curly brackets {  } at the beginning and end of the password string isn't supported. This limitation applies to both connecting to source MySQL and target Azure Database for MySQL.
- The following DDLs aren't supported:
    - All partition DDLs
    - Drop table
    - Rename table
- Using the *alter table <table_name> add column <column_name>* statement to add columns to the beginning or to the middle of a table isn't supported. THe *alter table <table_name> add column <column_name>* adds the column at the end of the table.
- Indexes created on only part of the column data aren't supported. The following statement is an example that creates an index using only part of the column data:
    ``` 
    CREATE INDEX partial_name ON customer (name(10));
    ```

- In DMS, the limit of databases to migrate in one single migration activity is four.
