<properties
   pageTitle="Migrating a Database to Azure SQL Database"
   description="Microsoft Azure SQL Database, database deploy, database migration, import database, export database, migration wizard"
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jeffreyg"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="08/20/2015"
   ms.author="carlrab"/>

# Migrating a Database to Azure SQL Database

Azure SQL Database V12 brings near-complete engine compatibility with SQL Server 2014. As such, it dramatically simplifies the task of migrating most databases from SQL Server to Azure SQL Database. Migration for many databases is a straightforward movement operation requiring few if any changes to the schema and little or no re-engineering of applications. And where databases need to be changed, the scope of these changes is more confined.

By design, server-scoped features of SQL Server are not supported by SQL Database, so databases and applications that rely on these will continue to need some re-engineering before they can be migrated. While SQL Database V12 improves compatibility with SQL Server, migration still needs to be planned and executed carefully, particularly for larger, more complex databases.

## At a Glance
Migrating a small to medium SQL Server 2014 or later database that is Azure SQL Server V12 compatible is as simple as running the Deploy Database to Microsoft Azure Database wizard. For larger databases or when you have connectivity challenges (no connectivity or low bandwidth), you can export the data and schema to  There are different approaches for migrating a SQL Server database to Azure, each using one or more tools. Some approaches are quick and easy, while others take longer to prepare. Please be aware that migrating a large, complex database may take several hours.

### Option #1
***Migrate a compatible database using SQL Server Management Studio (SSMS)***

The database is deployed to Azure SQL Database using SSMS. The database can be deployed directly or exported to a BACPAC which is then imported to create a new Azure SQL database.  Use this method when the source database is fully compatible with Azure SQL Database.

### Option #2
***Update the database schema off-line using Visual Studio (VS) and then deploy with SSMS***

The source database is imported into a Visual Studio database project for processing offline. SAMW is then run across all the scripts in the project to apply a series of transformations and corrections. The project is targeted at SQL Database V12 and built, and any remaining errors are reported. These errors are then resolved manually using SQL Server Data Tools (SSDT) in Visual Studio. Once the project builds successfully, it is published back to a copy of the source database. This updated database is then deployed to Azure SQL Database using option #1. If schema-only migration is required, the schema can be publish directly from Visual Studio directly to Azure SQL Database. Use this method when the database schema requires more changes than can be handled by the migration wizard alone.

## Deciding options to use
- If you anticipate that a database can be migrated without change you should use option #1, which is quick and easy.  If you are uncertain, start by exporting a schema-only BACPAC from the database as described in option #1. If the export succeeds with no errors, you can use option #1 to migrate the database with its data.  
- If you encounter errors during the export of option#1 use the SQL Azure migration wizard to process the database in schema-only mode as described in option #2.  If the migration wizard reports no errors, use option #2.
- If SAMW reports that the schema needs additional work then, unless it needs only simple fixes, it is best to use option #3 and correct the database schema offline in Visual Studio using a combination of the migration wizard and manually applied schema changes. A copy of the source database is then updated in situ and then migrated to Azure using option #1.

## Migration tools
Tools used include SQL Server Management Studio (SSMS), the SQL Server tooling in Visual Studio (VS, SSDT), and the SQL Azure Migration Wizard (SAMW), as well the Azure portal.

> Be sure to install the latest versions of the client tools as earlier versions are not compatible with the SQL Database v12.

### SQL Server Management Studio (SSMS)
SSMS can be used to deploy a compatible database directly to Azure SQL Database or to export a logical backup of the database as a BACPAC, which can then be imported, still using SSMS, to create a new Azure SQL Database.  

[Download the latest version of SSMS](https://msdn.microsoft.com/library/mt238290.aspx) or be sure to use CU6 in SQL Server 2013 or later.  

### SQL Server tooling in Visual Studio (VS, SSDT)
The SQL Server tooling in Visual Studio can be used to create and manage a database project comprising a set of Tranact-SQL files for each object in the schema. The project can be imported from a database or from a script file. Once created, the project can be to Azure SQL Database v12; building the project then validates schema compatibility. Clicking on an error opens the corresponding Transact-SQL file allowing it to be edited and the error corrected. Once all the errors are fixed the project can be published, either directly to SQL Database to create an empty database or back to (a copy of) the original SQL Server database to update its schema, which allows the database to be deployed with its data using SSMS as above.

Use the [lastest SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx) with Visual Studio 2013 Update 4 or later.

## Comparisons
| Option #1 | Option #2 |
| ------------ | ------------ | ------------ |
| Deploy a compatible database to Azure SQL Database |   Update database in-place then deploy to Azure SQL Database |
|![SSMS](./media/sql-database-cloud-migrate/01SSMSDiagram.png)| ![Offline Edit](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png) |
| Uses SSMS | Uses VS and SSMS |
|Simple process requires that schema is compatible. Schema is migrated unchanged. | Schema is imported into a database project in Visual Studio and (optionally) transformed with SAMW. Additional updates are made using SSDT in Visual Studio and final schema used to update the database in situ. |
| If exporting a BACPAC then can choose to migrate schema only. | Can publish schema only directly to Azure from Visual Studio. Database is updated with any required changes in situ to allow schema and data to be deployed/exported. |
| Always deploys or exports the entire database. | Full control of the objects that are included in the migration. |
| No provision for changing the output if there are errors, the source schema must be compatible. | Full features of SSDT in Visual Studio available. Schema is changed offline. | Application validation occurs in Azure. Should be minimal as schema is migrated without change. |
| Application validation can be done in SQL Server before the database is deployed to Azure. |
| Simple, easily configured one- or two-step process. | More complex multi-step process (easier if only deploying schema). |
