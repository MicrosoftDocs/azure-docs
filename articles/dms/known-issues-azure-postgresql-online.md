---
title: Article about known issues/migration limitations with online migrations to Azure Database for MySQL | Microsoft Docs
description: Learn about known issues/migration limitations with online migrations to Azure Database for MySQL.
services: database-migration
author: HJToland3
ms.author: scphang
manager: 
ms.reviewer: 
ms.service: database-migration
ms.workload: data-services
ms.custom: mvc
ms.topic: article
ms.date: 09/22/2018
---

# Known issues/migration limitations with online migrations to Azure DB for PostgreSQL

Known issues and limitations associated with online migrations from PostgreSQL to Azure Database for PostgreSQL are described in the following sections. 

## Online migration configuration
- The source PostgreSQL Server must be running version 9.5.11, 9.6.7, or 10.3 or later. For more information, see the article [Supported PostgreSQL Database Versions](1.2.%09https:/docs.microsoft.com/azure/postgresql/concepts-supported-versions).
- Only same version migrations are supported. For example, migrating PostgreSQL 9.5.11 to Azure Database for PostgreSQL 9.6.7 is not supported.
- To enable logical replication in the **source PostgreSQL postgresql.conf** file, set the following parameters:
    - **wal_level** = logical
    - **max_replication_slots** = [max number of databases for migration]; if you want to migrate 4 databases, set the value to 4
    - **max_wal_senders** = [number of databases running concurrently]; the recommended value is 10
- Add DMS agent IP to the source PostgresSQL pg_hba.conf
    1. Make a note of the DMS IP address after you finish provisioning an instance of DMS.
    2. Add the IP address to the pg_hba.conf file as shown:

        host	all		172.16.136.18/10	md5
        host	replication	postgres	172.16.136.18/10	md5

- The user must have the super user permission on the server hosting the source database
- Aside from having ENUM in the source database schema, the source and target database schemas must match.
- The schema in the target Azure Database for PostgreSQL must not have foreign keys. Use the following query to drop foreign keys:

    ```
    							SELECT Queries.tablename
           ,concat('alter table ', Queries.tablename, ' ', STRING_AGG(concat('DROP CONSTRAINT ', Queries.foreignkey), ',')) as DropQuery
                ,concat('alter table ', Queries.tablename, ' ', 
                                                STRING_AGG(concat('ADD CONSTRAINT ', Queries.foreignkey, ' FOREIGN KEY (', column_name, ')', 'REFERENCES ', foreign_table_name, '(', foreign_column_name, ')' ), ',')) as AddQuery
        FROM
        (SELECT
        tc.table_schema, 
        tc.constraint_name as foreignkey, 
        tc.table_name as tableName, 
        kcu.column_name, 
        ccu.table_schema AS foreign_table_schema,
        ccu.table_name AS foreign_table_name,
        ccu.column_name AS foreign_column_name 
    FROM 
        information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
          ON tc.constraint_name = kcu.constraint_name
          AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
          ON ccu.constraint_name = tc.constraint_name
          AND ccu.table_schema = tc.table_schema
    WHERE constraint_type = 'FOREIGN KEY') Queries
      GROUP BY Queries.tablename;
    
    ```

    Run the drop foreign key (which is the second column) in the query result.

- The schema in target Azure Database for PostgreSQL must not have any triggers. Use the following to disable triggers in target database:

     ```
    SELECT Concat('DROP TRIGGER ', Trigger_Name, ';') FROM  information_schema.TRIGGERS WHERE TRIGGER_SCHEMA = 'your_schema';
     ```

## Datatype limitations

- **Limitation**: If there's an ENUM datatype in the source PostgreSQL database, the migration will fail during continuous sync.

    **Workaround**: Modify ENUM datatype to character varying in Azure Database for PostgreSQL.

- **Limitation**: If there's no primary key on tables, continuous sync will fail.

    **Workaround**: Temporarily set a primary key for the table for migration to proceed. You can remove the primary key after data migration is complete.

## LOB limitations
Large Object (LOB) columns are columns that can grow large. For PostgreSQL, examples of LOB data types include XML, JSON, IMAGE, TEXT, etc.

- **Limitation**: If LOB data types are used as primary keys, migration will fail.

    **Workaround**: Replace primary key with other datatypes or columns that are not LOB.

- **Limitation**: If the length of Large Object (LOB) column is bigger than 32 KB, data might be truncated at the target. You can check the length of LOB column using this query:

    ```
    SELECT max(length(cast(body as text))) as body FROM customer_mail
    ```

    **Workaround**: If you have LOB object that is bigger than 32 KB, contact engineering team at [dmsfeedback@microsoft.com](mailto:dmsfeedback@microsoft.com).

- **Limitation**: If there are LOB columns in the table, and there's no primary key set for the table, data might not be migrated for this table.

    **Workaround**: Temporarily set a primary key for the table for migration to proceed. You can remove the primary key after data migration is complete.

## PostgreSQL10 workaround
PostgreSQL 10.x makes various changes to pg_xlog folder names and hence causing migration not running as expected. If you're migrating from PostgreSQL 10.x to Azure Database for PostgreSQL 10.3, execute the following script on the source PostgreSQL database to create wrapper function around pg_xlog functions.

```
BEGIN;
CREATE SCHEMA IF NOT EXISTS fnRenames;
CREATE OR REPLACE FUNCTION fnRenames.pg_switch_xlog() RETURNS pg_lsn AS $$ 
   SELECT pg_switch_wal(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_xlog_replay_pause() RETURNS VOID AS $$ 
   SELECT pg_wal_replay_pause(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_xlog_replay_resume() RETURNS VOID AS $$ 
   SELECT pg_wal_replay_resume(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_current_xlog_location() RETURNS pg_lsn AS $$ 
   SELECT pg_current_wal_lsn(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_is_xlog_replay_paused() RETURNS boolean AS $$ 
   SELECT pg_is_wal_replay_paused(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_xlogfile_name(lsn pg_lsn) RETURNS TEXT AS $$ 
   SELECT pg_walfile_name(lsn); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_last_xlog_replay_location() RETURNS pg_lsn AS $$ 
   SELECT pg_last_wal_replay_lsn(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_last_xlog_receive_location() RETURNS pg_lsn AS $$ 
   SELECT pg_last_wal_receive_lsn(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_current_xlog_flush_location() RETURNS pg_lsn AS $$ 
   SELECT pg_current_wal_flush_lsn(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_current_xlog_insert_location() RETURNS pg_lsn AS $$ 
   SELECT pg_current_wal_insert_lsn(); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_xlog_location_diff(lsn1 pg_lsn, lsn2 pg_lsn) RETURNS NUMERIC AS $$ 
   SELECT pg_wal_lsn_diff(lsn1, lsn2); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_xlogfile_name_offset(lsn pg_lsn, OUT TEXT, OUT INTEGER) AS $$ 
   SELECT pg_walfile_name_offset(lsn); $$ LANGUAGE SQL;
CREATE OR REPLACE FUNCTION fnRenames.pg_create_logical_replication_slot(slot_name name, plugin name, 
   temporary BOOLEAN DEFAULT FALSE, OUT slot_name name, OUT xlog_position pg_lsn) RETURNS RECORD AS $$ 
   SELECT slot_name::NAME, lsn::pg_lsn FROM pg_catalog.pg_create_logical_replication_slot(slot_name, plugin, 
   temporary); $$ LANGUAGE SQL;
ALTER USER PG_User SET search_path = fnRenames, pg_catalog, "$user", public;

-- DROP SCHEMA fnRenames CASCADE;
-- ALTER USER PG_User SET search_path TO DEFAULT;
COMMIT;
```

## Other limitations
- The database name can't include a semi-colon (;).
- Password string that has opening and closing curly brackets {  } isn't supported. This limitation applies to both connecting to source PostgreSQL and target Azure Database for PostgreSQL.
- A captured table must have a Primary Key. If a table doesn't have a primary key, the result of DELETE and UPDATE record operations will be unpredictable.
- Updating a Primary Key segment is ignored. In such cases, applying such an update will be identified by the target as an update that didn't update any rows and will result in a record written to the exceptions table.
- Migration of multiple tables with the same name but a different case (e.g. table1, TABLE1, and Table1) may cause unpredictable behavior and is therefore not supported.
- Change processing of [CREATE | ALTER | DROP] table DDLs are supported unless they are held in an inner function/procedure body block or in other nested constructs. For example, the following change will not be captured:

    ```
    CREATE OR REPLACE FUNCTION pg.create_distributors1() RETURNS void
    LANGUAGE plpgsql
    AS $$
    BEGIN
    create table pg.distributors1(did serial PRIMARY KEY,name varchar(40)
    NOT NULL);
    END;
    $$;
    ```

- Change processing (continuous sync) of TRUNCATE operations is not supported. Migration of partitioned tables is not supported. When a partitioned table is detected, the following things occur:
    - The database will report a list of parent and child tables.
    - The table will be created on the target as a regular table with the same properties as the selected tables.
    - If the parent table in the source database has the same Primary Key value as its child tables, a “duplicate key” error will be generated.
- In DMS, the limit of databases to migrate in one single migration activity is four.