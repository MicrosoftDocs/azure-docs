<properties 
   pageTitle="Migration to Azure SQL Database" 
   description="Microsoft Azure SQL Database, database deploy, database migration, import database, export database, migration wizard" 
   services="sql-database" 
   documentationCenter="" 
   authors="pehteh" 
   manager="jeffreyg" 
   editor="monicar"/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management" 
   ms.date="04/15/2015"
   ms.author="pehteh"/>

# Overview
Azure SQL Database V12 brings near-complete engine compatibility with SQL Server 2014. As such, it dramatically simplifies the task of migrating most databases from SQL Server to Azure SQL Database. Migration for many databases is a straightforward movement operation requiring few if any changes to the schema and little or no re-engineering of applications. And where databases need to be changed the scope of these changes is more confined. 

By design, server-scoped features of SQL Server are not supported by SQL Database, so databases and applications that rely on these will continue to need some re-engineering before they can be migrated. While SQL Database V12 improves compatibility with SQL Server, migration still needs to be planned and executed carefully, particularly for larger more complex databases. 

## At a Glance
There are different approaches for migrating a SQL Server database to Azure, each using one or more tools. Some approach are quick and easy, while others take longer to prepare. Please be aware that migrating a large complex database may take several many hours! 

### Option #1
***Migrate a compatible database using SQL Server Management Studio (SSMS)***

The database is deployed from to Azure SQL Database using SSMS. The database can be deployed directly or exported to a BACPAC which is then imported to create a new Azure SQL database.  Use when the source database is fully compatible with Azure SQL Database.

### Option #2
***Migrate a near-compatible database using SQL Azure Migration Wizard (SAMW)***

The database is processed using the SQL Azure Migration Wizard to generate a migration script containing schema or schema plus data in BCP format. Use when the database schema requires upgrade and the changes can be handled by the wizard. 

### Option #3
***Update database schema off-line using Visual Studio (VS) and SAMW and deploy with SSMS***

The source database is imported into a Visual Studio database project for processing offline. SQL Azure Migration Wizard is then run across all the scripts in the project to apply a series of transformations and corrections. The project is targeted at SQL Database V12 and built and any remaining errors are reported. These errors are then resolved manually using the SQL Server tooling in Visual Studio. Once the project builds successfully it is published back to a copy of the source database. This updated database is then deployed to Azure SQL Database using option #1. If schema-only migration is required, the schema can be publish directly from Visual Studio directly to Azure SQL Database. Use when the database schema requires more changes than can be handled by SAMW alone. 

## Deciding options to use
- If you anticipate that a database can be migrated without change you should use option #1 which is quick and easy.  If you are uncertain, start by exporting a schema-only BACPAC from the database, as described in option #1. If the export succeeds with no errors then you can use option #1 to migrate the database with its data.  
- If you encounter errors during the export of option#1 use the SQL Azure Migration Wizard (SAMW) to process the database in schema-only mode as described in option #2.  If SAMW reports no errors then option #2 can be used. 
- If SAMW reports that the schema needs additional work then, unless it needs only simple fixes, it is best to use option #3 and correct the database schema offline in Visual Studio using a combination of SAMW and manually applied schema changes. A copy of the source database is then updated in situ and then migrated to Azure using option #1.

## Migration tools
Tools used include SQL Server Management Studio (SSMS), the SQL Server tooling in Visual Studio (VS, SSDT), and the SQL Azure Migration Wizard (SAMW), as well the Azure portal. 

> Be sure to install the latest versions of the client tools as earlier versions are not compatible with the SQL Database v12.

### SQL Server Management Studio (SSMS)
SSMS can be used to deploy a compatible database directly to Azure SQL Database or to export a logical backup of the database as a BACPAC, which can then be imported, still using SSMS, to create a new Azure SQL Database.  

You must use the latest version of SSMS (CU6 in SQL Server 2013 and up) or by download the [latest version](http://msdn.microsoft.com/en-us/evalcenter/dn434042.aspx) of the tool.  

### SQL Azure Migration Wizard (SAMW)
SAMW can be used to analyze the schema of an existing database for compatibility with Azure SQL Database, and in many cases can be used to generate and then deploy a T-SQL script containing schema and data. The wizard will report errors during the transformation if it encounters schema content that it cannot transform. If this occurs, the generated script will require further editing before it can be deployed successfully. SAMW will process the body of functions or stored procedures which is normally excluded from validation performed by the SQL Server tooling in Visual Studio (see below) so may find issues that might not otherwise be reported by validation in Visual Studio alone. Combining use of SAMW with the SQL Server tooling in Visual Studio can substantially reduce the amount of work required to migrate a complex schema.

Be sure to use the latest version of the [SQL Azure Migration Wizard](http://sqlazuremw.codeplex.com/) from CodePlex . 

### SQL Server tooling in Visual Studio (VS, SSDT)
The SQL Server tooling in Visual Studio can be used to create and manage a database project comprising a set of T-SQL files for each object in the schema. The project can be imported from a database or from a script file. Once created, the project can be to Azure SQL Database v12; building the project then validates schema compatibility. Clicking on an error opens the corresponding T-SQL file allowing it to be edited and the error corrected. Once all the errors are fixed the project can be published, either directly to SQL Database to create an empty database or back to (a copy of) the original SQL Server database to update its schema, which allows the database to be deployed with its data using SSMS as above. 

You must use the lastest SQL Server database tooling for Visual Studio for Azure SQL Database Latest Update V12. Make sure you have Visual Studio 2013 with Update 4 installed . 

## Comparisons
| Option #1 | Option #2 | Option #3 |
| ------------ | ------------ | ------------ |
| Deploy a compatible database to Azure SQL Database |   Generate a migration script with changes and execute on Azure SQL Database | Update database in-place then deploy to Azure SQL Database |
|![SSMS](./media/sql-database-cloud-migrate/01SSMSDiagram.png)| ![SAMW](./media/sql-database-cloud-migrate/02SAMWDiagram.png) | ![Offline Edit](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png) |
| Uses SSMS | Uses SAMW | Uses SAMW, VS, SSMS |
|Simple process requires that schema is compatible. Schema is migrated unchanged. | T-SQL script is generated by SAMW includes changes required to ensure compatibility. Some unsupported features will be dropped from the schema, most are flagged as errors. | Schema is imported into a database project in Visual Studio and (optionally) transformed with SAMW. Additional updates are made using the SQL Server tooling in Visual Studio and final schema used to update the database in situ. |
| If exporting a BACPAC then can choose to migrate schema only.   | Can configure the wizard to script schema or schema plus data. | Can publish schema only directly to Azure from Visual Studio. Database is updated with any required changes in-situ to allow schema and data to be deployed/exported. |
| Always deploys or exports the entire database. | Can choose to exclude specific objects from the migration. | Full control of the objects that are included in the migration. |
| No provision for changing the output if there are errors, the source schema must be compatible. | Single monolithic generated script can be awkward to edit if required. The script can be opened and edited in SSMS or Visual Studio with the SQL Server database tooling. All errors must be fixed before the script can be deployed to Azure SQL Database.| Full features of SQL Server tooling in Visual Studio available. Schema is changed offline. |
| Application validation occurs in Azure. Should be minimal as schema is migrated without change. | Application validation occurs in Azure after migration. Generated script could also be installed on-premises for initial application validation. | Application validation can be done in SQL Server before the database is deployed to Azure. |
| Microsoft supported tool. | Community supported tool downloaded from CodePlex. | Microsoft supported tools with optional use of community supported tool downloaded from CodePlex. |
| Simple easily configured one- or two-step process. | Schema transformation and generation and deployment to the cloud are orchestrated from a single easy to use wizard. | More complex multi-step process (simpler if only deploying schema). |


