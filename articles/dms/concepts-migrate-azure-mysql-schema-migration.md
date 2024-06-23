---
title: MySQL to Azure Database for MySQL Data Migration - MySQL Schema Migration
description: Learn how to use the Azure Database for MySQL Data Migration - MySQL Schema Migration
author: adig
ms.author: adig
ms.date: 07/23/2023
ms.service: dms
ms.topic: conceptual
ms.custom:
  - references_regions
  - sql-migration-content
---

# MySQL to Azure Database for MySQL Data Migration - MySQL Schema Migration

MySQL Schema Migration is a new feature that allows users to migrate the schema for objects such as databases, tables, views, triggers, events, stored procedures, and functions. This feature is useful for automating some of work required to prepare the target database prior to starting a migration.

## Current implementation

In the current implementation, users can select the **server objects (views, triggers, events, routines)** that they want to migrate in **Select databases** tab under **Select Server Objects** section when configuring the DMS migration project. Additionally, they can select the databases under **Select databases** section whose schema is to be migrated.
:::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/16-select-db.png" alt-text="Screenshot of a Select database.":::

To migrate the schema for table objects, navigate to the **Select tables** tab. Before the tab populates, DMS fetches the tables from the selected database(s) on the source and target, and then determines whether the table exists and contains data. If you select a table in the source database that doesn't exist on the target database, the box under **Migrate schema** is selected by default. For tables that do exist in the target database, a note indicates that the selected table already contains and will be truncated. In addition, if the schema of a table on the target server doesn't match the schema on the source, the table will be dropped before the migration continues.

   :::image type="content" source="media/tutorial-mysql-to-azure-mysql-online/17-select-tables.png" alt-text="Screenshot of a Select Tables.":::

When you continue to the next tab, DMS validates your inputs and confirms that the tables selected match if they were selected without the schema migration input. Once the validation passes, you can begin the migration scenario.

After you begin the migration and as the migration progresses, each table is created prior to migrating its data from the source to the target. Except for triggers and views, which are migrated after data migration is complete, other objects are created for tables prior to the data migration.

### How Schema Migration works

Schema migration is supported by MySQL’s **“SHOW CREATE”** syntax to gather schema information for objects from the source. When migrating the schema for the objects from the source to the target, DMS processes the input and individually migrates the objects. DMS also wraps the collation, character set, and other relevant information that is provided by the “SHOW CREATE” query to the create query that is then processed on to the target.

**Routines** and **Events** are migrated before any data is migrated. The schema for each individual **table** is migrated immediately prior to data movement starting for the table. **Triggers** are migrated after the data migration portion. For **views**, since MySQL validates the contents of views and they can depend on other tables, DMS first creates tables for views before the start of database data movement and then drops the temporary table and creates the view.

When querying the source and target, if a transient error occurs, DMS **retries** the queries. However, if an error occurs that DMS can't recover from – as an example, an invalid syntax when performing a version upgrade migration – DMS fails and report that error message on completion. If the failure occurs when creating a table, the data for that table isn't migrated, but the data and schema migration for the other selected tables is attempted. If an unrecoverable error occurs for events, routines, or when creating the temporary table for views, the migration fails prior to running the migration for the selected tables and the objects that are migrated following the data migration portion.

Since a temporary table is created for views, if there's a failure migrating a view, the temporary table is left on the target. After the underlying issue is fixed and the migration is retried, DMS deletes that table prior to creating the view. Alternatively, if electing not to use schema migration for views in a future migration, the temporary table needs to be manually deleted prior to manually migrating the view.

## Prerequisites

To complete a schema migration successfully, ensure that the following prerequisites are in place.

* “READ” privilege on the source database.
* “SELECT” privilege for the ability to select objects from the database
* If migrating views, the user must have the “SHOW VIEW” privilege.
* If migrating triggers, the user must have the “TRIGGER” privilege.
* If migrating routines (procedures and/or functions), the user must be named in the definer clause of the routine. Alternatively, based on version, the user must have the following privilege:
  * For 5.7, have “SELECT” access to the “mysql.proc” table.
  * For 8.0, have “SHOW_ROUTINE” privilege or have the “CREATE ROUTINE,” “ALTER ROUTINE,” or “EXECUTE” privilege granted at a scope that includes the routine.
* If migrating events, the user must have the “EVENT” privilege for the database from which the events are to be shown.

## Limitations

* When migrating non table objects, DMS doesn't support renaming databases.
* When migrating to a target server that has bin_log enabled, log_bin_trust_function_creators should be enabled to allow for creation of routines and triggers.
* Currently there's no support for migrating the DEFINER clause for objects. All object types with definers on source get dropped and after the migration the default definer for tables are set to the login used to run the migration.
* Some version upgrades aren't supported if there are breaking changes in version compatibility. Refer to the MySQL docs for more information on version upgrades.
* Currently we can only migrate schema as part of data movement. If nothing is selected for data movement, no schema migration happens. If a table is selected for schema migration, it is selected for data movement.

## Next steps

- Learn more about [Data-in Replication](../mysql/concepts-data-in-replication.md)

- [Tutorial: Migrate MySQL to Azure Database for MySQL offline using DMS](tutorial-mysql-azure-mysql-offline-portal.md)
