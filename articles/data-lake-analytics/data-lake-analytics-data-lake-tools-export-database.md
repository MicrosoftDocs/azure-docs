---
title: How to export U-SQL databases | Microsoft Docs
description: 'Learn how to use Azure Data Lake Tools for Visual Studio to export U-SQL database and import it to local account at the same time.'
services: data-lake-analytics
documentationcenter: ''
author: yanancai 
manager:  
editor:  

ms.assetid: dc9b21d8-c5f4-4f77-bcbc-eff458f48de2
ms.service: data-lake-analytics
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: big-data
ms.date: 11/27/2017
ms.author: yanacai

---

# How to export U-SQL database

In this document, we will introduce how to use [Azure Data Lake Tools for Visual Studio](http://aka.ms/adltoolsvs) to export U-SQL database as a single U-SQL script and downloaded resources. Importing the database to local account is also supported in the same process.

Customers usually maintain multiple environments for development, test and production. These environments are hosted on both local account on developers local machine and Azure Data Lake Analytics account on Azure. When developing and tunning U-SQL queries on development and test environments, it is very common that developers need to recreate everything in the production database. **Database Export Wizard** helps accelerate this process. By using the wizard, developers can clone the existing database environment and sample data to other Azure Data Lake Analytics account.

## Step 1: Right click your database in Server Explorer and click "Export..."

All Azure Data Lake Analytics accounts you have permission to are listed in Server Explorer. Expand the one contains the database you want to export, and right click the database to export. If you don't find the context menu, please [update the tool to the lasted release](http://aka.ms/adltoolsvs).

![Data Lake Analytics Tools Export Database](./media/data-lake-analytics-data-lake-tools-export-database/export-database.png)

## Step 2: Configure the objects you want to export

Sometimes a database is very large but you just need a small part of it, then you can configure the subset of objects you want to export in the export wizard. Please note that the export action is completed by running a U-SQL job, and therefore exporting from Azure account will incur some cost.

![Data Lake Analytics Tools Export Database Wizard](./media/data-lake-analytics-data-lake-tools-export-database/export-database-wizard.png)

## Step 3: Check the objects list and more configurations

In this step, you can double check the selected objects at the top of the dialog. If there are some errors, you can click Previous to go back and configure the objects you want to export again.

You can also do other configurations about export target, the detail definition of these configurations are listed in below table:

|Configuration|Description|
|Destination Name|This name indicates where you want to save the exported database resources, like assemblies, additional files and sample data. A folder with this name will be created under your local data root folder.|
|Project Directory|This path defines where you want to save the exported U-SQL script which includes all database object definitions.|
|Schema Only|Selecting this option results in only database definitions and resources (like assemblies and additional files) being exported.|
|Schema and Data|Selecting this option results in database definitions, resources, and data to be exported. The top N rows of tables are exported.|
|Import to Local Database Automatically|Checking this means the exported database will be imported to your local database automatically after exporting is completed.|

![Data Lake Analytics Tools Export Database Wizard Configuration](./media/data-lake-analytics-data-lake-tools-export-database/export-database-wizard-configuration.png)

## Step 4: Check the export results

After all these settings and export progress, you can find the exported results from the log window in the wizard. Through the log marked by red rectangle in blow screenshot, you can find the location of the exported U-SQL script and database resources including assemblies, additional files and sample data.

![Data Lake Analytics Tools Export Database Wizard Completed](./media/data-lake-analytics-data-lake-tools-export-database/export-database-wizard-completed.png)

## How to import the exported database to my local account

The most convenient way to do this is checking **Import to Local Database Automatically** during the exporting progress in Step 3. If you forgot to do so, you can find the exported U-SQL script through the exporting log and run the U-SQL script locally to import the database to your local account.

## How to import the exported database to my Azure Data Lake Analytics account

To import the database to other Azure Data Lake Analytics account, you need 2 steps:

1. Upload the exported resources including assemblies, additional files and sample data to your default Azure Data Lake Store account. You can find the exported resource folder under the local data root folder, and upload the entire folder to the root of the default store account.
2. Submit the exported U-SQL script to the Azure Data Lake Analytics account you want to import database to.

## Known limitation

Currently, we run a U-SQL job to export the data in tables if you selected **Schema and Data** in the wizard. That's why the data exporting process could be slow, and the large size of data exporting is not supported well. 

## Next steps

* [Understand U-SQL database](https://msdn.microsoft.com/en-us/library/azure/mt621299.aspx) 
* [how to test and debug U-SQL jobs by using local run and the Azure Data Lake U-SQL SDK](data-lake-analytics-data-lake-tools-local-run.md)


