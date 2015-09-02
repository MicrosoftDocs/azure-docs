<properties
   pageTitle="Migrate: Data Warehouse Migration Utility | Microsoft Azure"
   description="Migrate to SQL Data Warehouse."
   services="sql-data-warehouse"
   documentationCenter="NA"
   authors="lodipalm"
   manager="barbkess"
   editor=""/>

<tags
   ms.service="sql-data-warehouse"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-services"
   ms.date="08/13/2015"
   ms.author="lodipalm"/>


#Data Warehouse Migration Utility (Preview)
The Data Warehouse Migration Utility is a tool designed to migrate schema and data from SQL Server and Azure SQL Database to Azure SQL Data Warehouse.  During schema migration, the tool automatically maps the corresponding schema from source to destination.  After the schema has been migrated, users are also presented with the option of moving data through automatically generated scripts.

In addition to schema and data migration, this tool gives users the option to generate compatibility reports which summarize incompatibilities between the target and source instances which would prevent streamlined migration. 

##Get Started
The Data Warehouse Migration Utility can be downloaded [here][].  As a prerequisite for installation, you will need the BCP command-line utility to run migration scripts and Office to view the compatibility report.  After launching the executable that is downloaded you will be prompted to accept a standard EULA before the tool will be installed.

###Launching the tool and Connecting
The tool can easily be launched by clicking on the desktop icon that will appear post install.  On opening the tool you will be prompted with an initial connection page where you can choose your source and destination for the migration tool.  At this time we support SQL Server and Azure SQL Database as sources and SQL Data Warehouse as a destination.  After selecting this you will be asked to connect to your source server by filling in server name and authenticating and then clicking ‘Connect’.
 
After authenticating, the tool will show a list of databases that are present in the server you have connected to.  You can begin the migration by selecting a database that you would like to migrate and then clicking on ‘Migrate selected’
 
##Migration Report
Selecting ‘Check Database Compatibility’ in the tool will generate a report summarizing all of the incompatibilities in the objects of the database you are looking to migrate.  A broader list of some of the SQL Server functionality that is not present in SQL Data Warehouse can be found in our [migration documentation][].  After the report is generated you will be able to save and open in excel. 

Please note that when generating the migration schema, most issues identified as ‘Object’ will be adjusted in order to allow immediate migration of that data.  Please review the changes to ensure you do not want to make additional adjustments before applying the schema.

##Migrate Schema

After connecting, selecting ‘Migrate Schema’ will generate a schema migration script for the selected tables.  This script ports the structure of the table, maps incompatible data types to more compatible forms, and creates security credentials and schema if this is indicated by the user in the migration settings.  This code can be run against the targeted SQL Data Warehouse instance, saved to a file, copied to your clipboard, or even edited in-line before taking further action.  
 
As noted above, when migrating schema review the migration changes that the tool has made in order to ensure that that you fully understand them.  

##Migrate Data

By clicking the ‘Migrate Data’ option you can generate BCP scripts that will move your data first to flat files on your server, and then directly into your SQL Data Warehouse.  We recommend this process for moving small amounts of data and, as we have not built-in retries, be aware that failures can occur do network outages.  In order to run this you will need to have the BCP command-line utility installed and the schema for the data must already have been created. 
 
After you have filled out the parameters above you simply need to click run migration and a set of two packages will be generated to your specified location.  Run the export file in order to export data from your migration source into flat files, and run the import file in order to import your data into SQL Data Warehouse. 

## Next steps
Now that you've migrated some data, check out how to [develop][].

<!--Image references-->

<!--Article references-->
[migration documentation]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-migrate/
[develop]:https://azure.microsoft.com/en-us/documentation/articles/sql-data-warehouse-overview-develop/
[here]:https://migrhoststorage.blob.core.windows.net/sqldwsample/DataWarehouseMigrationUtility.zip
