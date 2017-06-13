---
title: Import and Export in Azure Database for MySQL | Microsoft Docs
description: This article explains common ways to import and export databases in your Azure Database for MySQL, using tools such as MySQL Workbench.
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonwhowell
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 06/12/2017
---

# Migrate your MySQL database using import and export
This article explains two common approaches to import and export data to your Azure Database for MySQL server using MySQL Workbench. 

## Before you begin
To step through this how-to guide, you need:
- An Azure Database for MySQL server, following [Create DB - Portal](quickstart-create-mysql-server-database-using-azure-portal.md)
- MySQL Workbench [downloaded](https://dev.mysql.com/downloads/workbench/) or another MySQL tool to import and export.

## Use common tools
Use common tools such as MySQL Workbench, Toad, or Navicat to remotely connect and import or export data into Azure Database for MySQL. Use such tools on your client machine with an internet connection to connect to the Azure Database for MySQL. Use an SSL encrypted connection for best security practices, see also [Configure SSL connectivity in Azure Database for MySQL](concepts-ssl-connection-security.md). You do not need to move your import and export files to any special cloud location when migrating to Azure Database for MySQL. 

## Create a database on the target Azure Database for MySQL service
Create an empty database on the target Azure Database for MySQL server where you want to migrate the data. Use a tool such as MySQL Workbench, Toad, or Navicat to create the database. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

To get connected, locate the connection information on the Properties page in your Azure Database for MySQL.

![Find the connection information in the Azure portal](./media/concepts-migrate-import-export/1_server-properties-name-login.png)

Add the connection information into your MySQL Workbench.

![MySQL Workbench Connection String](./media/concepts-migrate-import-export/2_setup-new-connection.png)

## When to use Import and Export techniques instead of a Dump and Restore
Use MySQL utilities such to export and import databases into an Azure MySQL Database in the following scenarios. In other scenarios, you may benefit from using the [Dump and Restore](concepts-migrate-dump-restore.md) approach instead. 

-	When you need to selectively choose a few tables to import from existing MySQL database into an Azure MySQL database, it is best to use the import and export technique.  By doing so, you can omit any unneeded tables from the migration in effort to save time and resources. For example, use the `--include-tables` or `--exclude-tables` switches with [mysqlpump](https://dev.mysql.com/doc/refman/5.7/en/mysqlpump.html#option_mysqlpump_include-tables) and `--tables` switch with the [mysqldump utility](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html#option_mysqldump_tables).
- When moving the database objects other than tables, explicitly create those. Include constraints (primary key, foreign key, indexes), views, functions, procedures, triggers, and any other database objects you wish to migrate.
- When migrating data from external data sources other than a MySQL database, create flat files and import them using the mysqlimport utility. For more information, see: https://dev.mysql.com/doc/refman/5.7/en/mysqlimport.html
- Make sure all tables in the database must use the InnoDB storage engine when loading data into Azure Database for MySQL. Azure Database for MySQL supports only InnoDB Storage engine, and therefore does not support alternative storage engines. If your tables require alternative storage engines, be sure to convert to use InnoDB engine format before migration to Azure Database for MySQL. For example, if you have a WordPress or WebApp using the MyISAM engine, first convert the tables by migrating the data into InnoDB tables before restoring to Azure Database for MySQL. Use the clause `ENGINE=INNODB` to set the engine used when creating a new table, then transfer the data into the compatible table before the migration. 

   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```

## Performance recommendations for Import and Export
-	Create clustered indexes and primary keys before loading data. Load data in primary key order. 
-	Delay creation of secondary indexes until after data is loaded. Create all secondary indexes after loading. 
-	Disable foreign key constraints before load. Disabling foreign key checks provides significant performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources using the metrics available in the Azure portal. 
-	Use partitioned tables when appropriate.
-	Use multi-value inserts when loading with SQL to minimize statement execution overhead. When using dump files generated by mysqldump utility, multi-value inserts are used automatically.


## Import and Export using MySQL Workbench
There are two ways to export and import data in MySQL Workbench, each serving a different purpose. 

### Table Data Export and Import Wizard using Object Browser context menu
![MySQL Workbench Import Export using Object Browser context menu](./media/concepts-migrate-import-export/p1.png)

This wizard supports import and export operations using CSV and JSON files, and includes several configuration options (separators, column selection, encoding selection, and more). The wizard can be performed against local or remotely connected MySQL servers, and the import action includes table, column, and type mapping. 
The wizard is accessible from the object browser's context menu by right-clicking on a table. Then choose either **Table Data Export Wizard** or **Table Data Import Wizard**. 

#### Table Data Export Wizard
The following example exports the table to a CSV file. 
- Right-click the Table of the Database to be exported. 
- Select **Table Data Export Wizard**. Select the Columns to be exported, Row Offset (if any), Count (if any). 
- Click **Next** on 'select data for export' window. Select the File Path, CSV or JSON file type, Line separator, Enclose Strings in and Field Separator. 
- Click **Next** on 'Select output file location' window and click **Next** on 'Export Data' window.

#### Table Data Import Wizard
The following example imports the table from a CSV file.
- Right-click the Table of the Database to be imported. 
- Browse and select the CSV file to be imported and then click **Next**. 
- Select the Destination Table (new or existing) and select or deselect the check box 'Truncate table before import' and click **Next**.
- Select encoding and the columns to be imported and then click  **Next**. 
- Select **Next** on Import data Window and it imports the data accordingly.

### SQL Data Export and Import Wizard from Management Navigator
Use this wizard to either export or import SQL generated from MySQL Workbench or with the mysqldump command. Access these wizards from  the Navigator panel or by selecting Server from the main menu. Then select Data Import or Data Export. 

#### Data Export
![MySQL Workbench Data Export using Management Navigator](./media/concepts-migrate-import-export/p2.png)

This tab allows you to export your MySQL data. 
- Select each schema you want to export, optionally choose specific schema objects/tables from each schema, and generate the export. Configuration options include exporting to a project folder or self-contained SQL file, optionally dump stored routines and events, or skip table data. 
- Alternatively, use **Export a Result Set** to export a specific result set in the SQL editor to another format such as CSV, JSON, HTML, and XML. 
- Select the Database objects to export, and configure the related options. 
- Click **Refresh** to load the current objects. 
- Optionally open the Advanced Options tab that allows you to refine the export operation. For example, add table locks, use replace instead of insert statements, quote identifiers with backtick characters, and more. 
- Click **Start Export** to begin the export process. 


#### Data Import
![MySQL Workbench Data Import using Management Navigator](./media/concepts-migrate-import-export/p3.png)

This tab allows import or restore the exported data from the Data Export operation, or from other exported data from the mysqldump command. 
- Choose the project folder or self-contained SQL file, choose the schema to import into, or choose New to define a new schema. 
- Click **Start Import** to begin the import process.

## Next steps
As another migration approach, read [Migrate your MySQL database using dump and restore in Azure Database for MySQL ](concepts-migrate-dump-restore.md) 
