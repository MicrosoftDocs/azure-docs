---
title: Import and export - Azure Database for MySQL
description: This article explains common ways to import and export databases in Azure Database for MySQL, by using tools such as MySQL Workbench.
author: ajlam
ms.author: andrela
ms.service: mysql
ms.topic: conceptual
ms.date: 2/27/2020
---

# Migrate your MySQL database by using import and export
This article explains two common approaches to importing and exporting data to an Azure Database for MySQL server by using MySQL Workbench. 

## Before you begin
To step through this how-to guide, you need:
- An Azure Database for MySQL server, by following [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md).
- MySQL Workbench [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/) or another third-party MySQL tool to do the import/export.

## Use common tools
Use common utilities and tools such as MySQL Workbench or mysqldump to remotely connect and import or export data into Azure Database for MySQL. 

Use such tools on your client machine with an Internet connection to connect to Azure Database for MySQL. Use an SSL-encrypted connection for best security practices, as described in [Configure SSL connectivity in Azure Database for MySQL](concepts-ssl-connection-security.md).

You do not need to move your import and export files to any special cloud location when migrating to Azure Database for MySQL. 

## Create a database on the Azure Database for MySQL server
Create an empty database on the Azure Database for MySQL server where you want to migrate the data. Use a tool such as MySQL Workbench, Toad, or Navicat to create the database. The database can have the same name as the database that contains the dumped data, or you can create a database with a different name.

To get connected, locate the connection information in the **Overview** of your Azure Database for MySQL.

![Find the connection information in the Azure portal](./media/concepts-migrate-import-export/1_server-overview-name-login.png)

Add the connection information to MySQL Workbench.

![MySQL Workbench connection string](./media/concepts-migrate-import-export/2_setup-new-connection.png)

## Determine when to use import and export techniques instead of a dump and restore
Use MySQL tools to import and export databases into Azure MySQL Database in the following scenarios. In other scenarios, you might benefit from using the [dump and restore](concepts-migrate-dump-restore.md) approach instead. 

- When you need to selectively choose a few tables to import from an existing MySQL database into Azure MySQL Database, it's best to use the import and export technique.  By doing so, you can omit any unneeded tables from the migration to save time and resources. For example, use the `--include-tables` or `--exclude-tables` switch with [mysqlpump](https://dev.mysql.com/doc/refman/5.7/en/mysqlpump.html#option_mysqlpump_include-tables) and the `--tables` switch with [mysqldump](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html#option_mysqldump_tables).
- When you're moving the database objects other than tables, explicitly create those objects. Include constraints (primary key, foreign key, indexes), views, functions, procedures, triggers, and any other database objects that you want to migrate.
- When you're migrating data from external data sources other than a MySQL database, create flat files and import them by using [mysqlimport](https://dev.mysql.com/doc/refman/5.7/en/mysqlimport.html).

Make sure that all tables in the database use the InnoDB storage engine when you're loading data into Azure Database for MySQL. Azure Database for MySQL supports only the InnoDB storage engine, so it doesn't support alternative storage engines. If your tables require alternative storage engines, be sure to convert them to use the InnoDB engine format before the migration to Azure Database for MySQL. 

For example, if you have a WordPress or web app that uses the MyISAM engine, first convert the tables by migrating the data into InnoDB tables. Then restore to Azure Database for MySQL. Use the clause `ENGINE=INNODB` to set the engine for creating a table, and then transfer the data into the compatible table before the migration. 

   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```

## Performance recommendations for import and export
-	Create clustered indexes and primary keys before loading data. Load data in primary key order. 
-	Delay creation of secondary indexes until after data is loaded. Create all secondary indexes after loading. 
-	Disable foreign key constraints before loading. Disabling foreign key checks provides significant performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources by using the metrics available in the Azure portal. 
-	Use partitioned tables when appropriate.

## Import and export by using MySQL Workbench
There are two ways to export and import data in MySQL Workbench. Each serves a different purpose. 

### Table data export and import wizards from the object browser's context menu
![MySQL Workbench wizards on the object browser's context menu](./media/concepts-migrate-import-export/p1.png)

The wizards for table data support import and export operations by using CSV and JSON files. They include several configuration options, such as separators, column selection, and encoding selection. You can perform each wizard against local or remotely connected MySQL servers. The import action includes table, column, and type mapping. 

You can access these wizards from the object browser's context menu by right-clicking a table. Then choose either **Table Data Export Wizard** or **Table Data Import Wizard**. 

#### Table Data Export Wizard
The following example exports the table to a CSV file: 
1. Right-click the table of the database to be exported. 
2. Select **Table Data Export Wizard**. Select the columns to be exported, row offset (if any), and count (if any). 
3. On the **Select data for export** page, click **Next**. Select the file path, CSV, or JSON file type. Also select the line separator, method of enclosing strings, and field separator. 
4. On the **Select output file location** page, click **Next**. 
5. On the **Export data** page, click **Next**.

#### Table Data Import Wizard
The following example imports the table from a CSV file:
1. Right-click the table of the database to be imported. 
2. Browse to and select the CSV file to be imported, and then click **Next**. 
3. Select the destination table (new or existing), and select or clear the **Truncate table before import** check box. Click **Next**.
4. Select encoding and the columns to be imported, and then click **Next**. 
5. On the **Import data** page, click **Next**. The wizard imports the data accordingly.

### SQL data export and import wizards from the Navigator pane
Use a wizard to export or import SQL generated from MySQL Workbench or generated from the mysqldump command. Access these wizards from the **Navigator** pane or by selecting **Server** from the main menu. Then select **Data Export** or **Data Import**. 

#### Data Export
![MySQL Workbench data export using the Navigator pane](./media/concepts-migrate-import-export/p2.png)

You can use the **Data Export** tab to export your MySQL data. 
1. Select each schema that you want to export, optionally choose specific schema objects/tables from each schema, and generate the export. Configuration options include export to a project folder or self-contained SQL file, dump stored routines and events, or skip table data. 
 
   Alternatively, use **Export a Result Set** to export a specific result set in the SQL editor to another format, such as CSV, JSON, HTML, and XML. 
3. Select the database objects to export, and configure the related options.
4. Click **Refresh** to load the current objects.
5. Optionally, open the **Advanced Options** tab to refine the export operation. For example, add table locks, use replace instead of insert statements, and quote identifiers with backtick characters.
6. Click **Start Export** to begin the export process.


#### Data Import
![MySQL Workbench Data Import using Management Navigator](./media/concepts-migrate-import-export/p3.png)

You can use the **Data Import** tab to import or restore exported data from the data export operation or from the mysqldump command. 
1. Choose the project folder or self-contained SQL file, choose the schema to import into, or choose **New** to define a new schema. 
2. Click **Start Import** to begin the import process.

## Next steps
- As another migration approach, read [Migrate your MySQL database using dump and restore in Azure Database for MySQL](concepts-migrate-dump-restore.md).
- For more information about migrating databases to Azure Database for MySQL, see the [Database Migration Guide](https://aka.ms/datamigration). 
