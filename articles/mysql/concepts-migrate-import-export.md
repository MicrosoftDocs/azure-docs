---
title: Import and Export in Azure Database for MySQL | Microsoft Docs
description: Introduces importing and exporting databases in Azure Database for MySQL 
services: mysql
author: v-chenyh
ms.author: v-chenyh
manager: jhubbard
editor: jasonh
ms.assetid:
ms.service: mysql-database
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: portal
ms.date: 05/10/2017
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
