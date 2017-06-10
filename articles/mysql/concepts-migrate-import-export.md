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
ms.date: 06/09/2017
---

# Migrate your MySQL database using import and export
This tutorial will show you the most common way to import and export the data in your Azure MySQL database using MySQL Workbench. 

## Before you begin
To step through this how-to guide, you need:
- An Azure Database for MySQL server [Design your first Azure MySQL database](quickstart-create-mysql-server-database-using-azure-portal.md)
- MySQL Workbench [MySQL Workbench Download](https://dev.mysql.com/downloads/workbench/)

## Use common tools
Use common tools such as MySQL Workbench, Toad, or Navicat to remotely connect and import or export data into Azure Database for MySQL. Use such tools on your client machine with an internet connection to connect to the Azure Database for MySQL. Use an SSL encrypted connection for best security practices, see also [Configure SSL connectivity in Azure Database for MySQL](concepts-ssl-connection-security.md). You do not need to move your import and export files to any special cloud location when migrating to Azure Database for MySQL. 

## Create a database on the target Azure Database for MySQL service
You must create an empty database on the target Azure Database for MySQL server where you want to migrate the data using MySQL Workbench, Toad, Navicat or any third party tool for MySQL. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

![Azure Database for MySQL Connection String](./media/concepts-migrate-import-export/p5.png)

![MySQL Workbench Connection String](./media/concepts-migrate-import-export/p4.png)

## When to use Import and Export techniques instead of a Dump and Restore
It is recommended to use MySQL utilities such to export and import databases into an Azure MySQL Database in several common scenarios listed below. In other scenarios, you may benefit from using the [Dump and Restore](concepts-migrate-dump-restore.md) approach instead. 

-	When you need to selectively choose a few tables to import from existing MySQL database into an Azure MySQL database, it is best to use the import/export techinique.  By doing so, you can omit any unneeded tables from the migration in effort to save time and resources. For example, use the `--include-tables` or `--exclude-tables` switches with [mysqlpump](https://dev.mysql.com/doc/refman/5.7/en/mysqlpump.html#option_mysqlpump_include-tables) and `--tables` switch with the [mysqldump utility](https://dev.mysql.com/doc/refman/5.7/en/mysqldump.html#option_mysqldump_tables).
- When moving the database objects other than tables, you must explicitly create those, including constraints (primary key, foreign key, indexes), views, functions, procedures, triggers and any other database objects you wish to migrate.
-	When migrating data from external data sources other than a MySQL database, create flat files and import them using the mysqlimport utility. For more information, see: https://dev.mysql.com/doc/refman/5.7/en/mysqlimport.html

- The **InnoDB** storage engine must be used in _all tables_ in the database when loading data into Azure Database for MySQL. Azure Database for MySQL supports only InnoDB Storage engine, and therefore does not support alternative storage engines. If your tables require alternative storage engines, be sure to convert the export scripts  InnoDB engine format before migration to Azure Database for MySQL.
   For example, if you have a WordPress or other WebApp which uses non InnoDB engine such as MyISAM, or a custom application that has any non InnoDB tables, you should first convert those tables by migrating the data into InnoDB tables prior to migration. Use the clause `ENGINE=INNODB` to set the engine used when creating a new table, then transfer the data into the compatible table before the migration. 
   ```sql
   INSERT INTO innodb_table SELECT * FROM myisam_table ORDER BY primary_key_columns
   ```

## Performance recommendations for Import and Export
-	Create clustered indexes and primary keys before loading data. Load data in primary key order. 
-	Delay creation of secondary indexes until after data is loaded. Create all secondary indexes after loading. 
-	Disable foreign key constraints before load. Disabling foreign key checks will provide significant performance gains. Enable the constraints and verify the data after the load to ensure referential integrity.
-	Load data in parallel. Avoid too much parallelism that would cause you to hit a resource limit, and monitor resources using the metrics available in the Azure portal. 
-	Use partitioned tables when appropriate.
-	Use multi-value inserts when loading with SQL to minimize statement execution overhead. When using dump files generated by mysqldump utility, this is done automatically. 


## Import and Export using MySQL Workbench
There are two ways to export and import data in MySQL Workbench, each serving a different purpose. 

## Table Data Export and Import Wizard using Object Browser context menu
![MySQL Workbench Import Export using Object Browser context menu](./media/concepts-migrate-import-export/p1.png)

This wizard supports import and export operations using CSV and JSON files, and includes several configuration options (separators, column selection, encoding selection, and more). The wizard can be performed against local or remotely connected MySQL servers, and the import action includes table, column, and type mapping. 
The wizard is accessible from the object browser's context menu by right-clicking on a table and choose either **Table Data Export Wizard** or **Table Data Import Wizard**. 

## Table Data Export Wizard
The following example exports the table to a CSV file. 
- Right click on the Table of the Database to be exported. 
- Select **Table Data Export Wizard**. Select the Columns to be exported, Row Offset (if any), Count (if any). 
- Click **Next** on 'select data for export' window. Select the File Path, CSV or JSON file type, Line separator, Enclose Strings in and Field Separator. 
- Select **Next** on 'Select output file location' window and Select Next on 'Export Data' window.


## Table Data Import Wizard
The following example imports the table from a CSV file.
- Right click on the Table of the Database to be imported. 
- Browse and select the CSV file to be imported and then Next button. 
- Select the Destination Table (new or existing) and select or deselect the check box 'Truncate table before import' and click on Next button.
- Select encoding and the columns to be imported and select Next button. 
- Select Next on Import data Window and it will import the data accordingly.

## SQL Data Export and Import Wizard from Management Navigator
Use this wizard to either export or import SQL generated from MySQL Workbench or with the mysqldump command. Access these wizards from either the Navigator panel, or by selecting Server from the main menu, and then either Data Import or Data Export. 

## Data Export
![MySQL Workbench Data Export using Management Navigator](./media/concepts-migrate-import-export/p2.png)

This tab allows you to export your MySQL data. 
- Select each schema you want to export, optionally choose specific schema objects/tables from each schema, and generate the export. Configuration options include exporting to a project folder or self-contained SQL file, optionally dump stored routines and events, or skip table data. 
- Alternatively, use **Export a Result Set** to export a specific result set in the SQL editor to another format such as CSV, JSON, HTML, and XML. 
- Select the Database objects to export, and configure the related options. 
- Click **Refresh** to load the current objects. 
- Optionally open the Advanced Options tab that allows you to refine the export operation. For example, add table locks, use replace instead of insert statements, quote identifiers with backtick characters, and more. 
- Click on **Start Export** to begin the export process. 


## Data Import
![MySQL Workbench Data Import using Management Navigator](./media/concepts-migrate-import-export/p3.png)

This tab allows import or restore the exported data from the Data Export operation, or from other exported data from the mysqldump command. 
- Choose the project folder or self-contained SQL file, choose the schema that the data will be imported to, or choose New to define a new schema. 
- Click **Start Import** to begin the import process and it will import accordingly.

## Next steps
If you are unfamiliar with getting started with this database service, please review:
-  [Create an Azure Database for MySQL server using Azure portal](quickstart-create-mysql-server-database-using-azure-portal.md) 
- [Create an Azure Database for MySQL server using Azure CLI](quickstart-create-mysql-server-database-using-azure-cli.md)
