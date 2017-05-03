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

## Migrate your MySQL database using import and export
This tutorial will show you two most common ways to import and export the data in your Azure MySQL database. 
- Import and export using PHPMyAdmin 
- Import and export using MySQL Workbench  

## Before you begin
To step through this how-to guide, you need:
- An Azure Database for MySQL server
- PHPMyAdmin
- MySQL Workbench
- WinSCP to upload your dump file to Azure Server

## Upload Files
With WinSCP you can easily upload and manage the dump files on your Microsoft Azure instance/service over SFTP protocol or FTPS protocol. 

## Create a database on the target Azure MySQL server
You must create an empty database on the target Azure Database for MySQL server where you want to migrate the data using MySQL Workbench, Toad, Navicat or any third party free tool for MySQL. The database can have the same name as the database that is contained the dumped data or you can create a database with a different name.

Use the following style of parameters into your query tool to connect to MySQL:
Server=mymysqltest.database.windows.net;
Port=3306;
Database= testdb3;
User=mytestlogin@mymysqltest and Password you may have set up.


## Import and Export using PHPMyAdmin
It is assumed that you have phpMyAdmin installed since a lot of web service providers use it. To export your MySQL database using PHPMyAdmin just follow a couple of steps:
- Open phpMyAdmin.
- Select your database by clicking the database name in the list on the left of the screen. 
- Click the Export link. This should bring up a new screen that says View dump of database. 
- In the Export area, click the Select All link to choose all of the tables in your database. 
- In the SQL options area, click the right options. 
- Click on the Save as file option and the corresponding compression option and then click the 'Go' button. A dialog box should appear prompting you to save the file locally.

Importing your database is easy just like exporting. Make the following:
- Open phpMyAdmin. 
- Create an appropriately named database and select it by clicking the database name in the list on the left of the screen. If you would like to rewrite the import over an existing database then click on the database name, select all the check boxes next to the table names and select Drop to delete all existing tables in the database. 
- Click the SQL link. This should bring up a new screen where you can either type in SQL commands, or upload your SQL file. 
- Use the browse button to find the database file. 
- Click Go button. This will export the backup, execute the SQL commands and re-create your database.



## Import and Export using MySQL Workbench
There are two ways to export and import data in MySQL Workbench, each serving a different purpose. 

## Table Data Export and Import Wizard using Object Browser context menu
![MySQL Workbench Import Export using Object Browser context menu](./media/concepts-migrate-import-export/p1.png)

This wizard supports import and export operations using CSV and JSON files, and includes several configuration options (separators, column selection, encoding selection, and more). The wizard can be performed against local or remotely connected MySQL servers, and the import action includes table, column, and type mapping. 
The wizard is accessible from the object browser's context menu by right-clicking on a table and choose either Table Data Export Wizard or Table Data Import Wizard. 

## Table Data Export Wizard
The following example exports the table to a CSV file. 
- Right click on the Table of the Database to be exported. 
- Select ‘Table Data Export Wizard’. Select the Columns to be exported, Row Offset (if any), Count (if any). 
- Click Next on ‘select data for export’ window. Select the File Path, CSV or JSON file type, Line separator, Enclose Strings in and Field Separator. 
- Select Next on ‘Select output file location’ window and Select Next on ‘Export Data’ window.


## Table Data Import Wizard
The following example imports the table from a CSV file.
- Right click on the Table of the Database to be imported. 
- Browse and select the CSV file to be imported and then Next button. 
- Select the Destination Table (New or existing) and select or deselect the check box ‘Truncate table before import’ and click on Next button.
- Select encoding and the columns to be imported and select Next button. 
- Select Next on Import data Window and it will import the data accordingly.

## SQL Data Export and Import Wizard from Management Navigator
Use this wizard to either export or import SQL generated from MySQL Workbench or with the mysqldump command. Access these wizards from either the Navigator panel, or by selecting Server from the main menu, and then either Data Import or Data Export. 

## Data Export
![MySQL Workbench Data Export using Management Navigator](./media/concepts-migrate-import-export/p2.png)

This tab allows you to export your MySQL data. 
- Select each schema you want to export, optionally choose specific schema objects/tables from each schema, and generate the export. Configuration options include exporting to a project folder or self-contained SQL file, optionally dump stored routines and events, or skip table data. 
- Alternatively, use Export a Result Set to export a specific result set in the SQL editor to another format such as CSV, JSON, HTML, and XML. 
- Select the Database objects to export, and configure the related options. 
- Click Refresh to load the current objects. 
- Optionally open the Advanced Options tab that allows you to refine the export operation. For example, add table locks, use replace instead of insert statements, quote identifiers with backtick characters, and more. 
- Click on Start Export to begin the export process. This functionality uses the mysqldump command. 


## Data Import
![MySQL Workbench Data Import using Management Navigator](./media/concepts-migrate-import-export/p3.png)

This tab allows import or restore the exported data from the Data Export operation, or from other exported data from the mysqldump command. 
- Choose the project folder or self-contained SQL file, choose the schema that the data will be imported to, or choose New to define a new schema. 
- Click Start Import to begin the import process and it will import accordingly.