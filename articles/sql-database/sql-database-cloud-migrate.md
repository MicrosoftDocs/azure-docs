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

Azure SQL Database V12 brings near-complete engine compatibility with SQL Server 2014. As such, the task of migrating most databases from an on-premises instance of SQL Server 2005 or greater to an Azure SQL database is much simpler. Migration for many databases is a straightforward schema and data movement operation requiring few, if any, changes to the schema and little or no re-engineering of applications. Where databases need to be changed, the scope of these changes is more confined.

By design, server-scoped features of SQL Server are not supported by Azure SQL Database V12. Databases and applications that rely on these features will need some re-engineering before they can be migrated. While Azure SQL Database V12 improves compatibility with an on-premises SQL Server database, migration still needs to be planned and executed carefully, particularly for larger, more complex databases.

## Determining Compatibility
To determine if your on-premises SQL Server database is compatible with Azure SQL Database V12, you can either begin the migration using one of the two methods discussed under option #1 below and see if the schema validation routines detect an incompatibility or you can use SQL Server Data Tools in Visual Studio as discussed in option #2 below to validate compatibility. If your on-premises SQL Server database has compatibility issues, you can use SQL Server Data Tools in Visual Studio or SQL Server Management Studio to address and resolve the compatibility issues.

## Migration Methods
There are a number of methods for migrating a compatible on-premises SQL Server database to Azure SQL Database V12.

- Migrating a compatible small to medium SQL Server 2005 or later database is as simple as running the Deploy Database to Microsoft Azure Database wizard in SQL Server Management Studio, provided you do not have connectivity challenges (no connectivity, low bandwidth, or timeout issues). 
- For medium to large databases or when you have connectivity challenges, you can use SQL Server Management Studio to export the data and schema to a BACPAC file (stored locally or in an Azure blob) and then import the BACPAC file into your Azure SQL instance. If you store the BACPAC in an Azure blob, you can also import the BACPAC file from within the Azure portal.  
- For larger databases, you will achieve the best performance by migrating the schema and the data separately. You can extract the schema into a database project using SQL Server Management Studio or Visual Studio and then deploy the schema to create the Azure SQL database. You can then extract the data using BCP and then use BCP to import the data using parallel streams into the Azure SQL database. Migrating a large, complex database will take many hours regardless of the method you choose.

### Option #1
***Migrating a compatible database using SQL Server Management Studio ***

SQL Server Management Studio provides two methods for migrating your compatible on-premises SQL Server database to an Azure SQL database. You can either use the Deploy Database to Microsoft Azure SQL Database wizard or export the database to a BACPAC file, which can then be imported to create a new Azure SQL database.  The wizard validates Azure SQL Database V12 compatibility, extracts the schema and data into a BACPAC file and then imports it into the Azure SQL Database instance specified. 

### Option #2
***Update the database schema off-line using Visual Studio  and then deploy with SQL Server Management Studio***

If your on-premises SQL Server database is not compatible or to determine if it is compatible, you can import the database schema into a Visual Studio database project for analysis. To analyze, you specify the target platform for the project as SQL Database V12 and then build the project. If the build is successful, the database is compatible. If the build fails, you can resolve the errors in either SQL Server Data Tools in Visual Studio , and any remaining errors are reported. These errors are then resolved manually using SQL Server Data Tools (SSDT) in Visual Studio. Once the project builds successfully, it is published back to a copy of the source database. This updated database is then deployed to Azure SQL Database using option #1. If schema-only migration is required, the schema can be publish directly from Visual Studio directly to Azure SQL Database. Use this method when the database schema requires more changes than can be handled by the migration wizard alone.

## Deciding options to use
- If you anticipate that a database can be migrated without change you should use option #1, which is quick and easy.  If you are uncertain, start by exporting a schema-only BACPAC from the database as described in option #1. If the export succeeds with no errors, you can use option #1 to migrate the database with its data.  
- If you encounter errors during the export of option#1, use option #2 and correct the database schema offline in Visual Studio using a combination of the migration wizard and manually applied schema changes. A copy of the source database is then updated in situ and then migrated to Azure using option #1.

## Migration tools
Tools used include SQL Server Management Studio (SSMS), the SQL Server tooling in Visual Studio (VS, SSDT), and the SQL Azure Migration Wizard (SAMW), as well the Azure portal.

> Be sure to install the latest versions of the client tools as earlier versions are not compatible with the SQL Database v12.

### SQL Server Management Studio (SSMS)
SSMS can be used to deploy a compatible database directly to Azure SQL Database or to export a logical backup of the database as a BACPAC, which can then be imported, still using SSMS, to create a new Azure SQL Database.  

[Download the latest version of SSMS](https://msdn.microsoft.com/library/mt238290.aspx)  

### SQL Server tooling in Visual Studio (VS, SSDT)
The SQL Server tooling in Visual Studio can be used to create and manage a database project comprising a set of Tranact-SQL files for each object in the schema. The project can be imported from a database or from a script file. Once created, the project can be to Azure SQL Database v12; building the project then validates schema compatibility. Clicking on an error opens the corresponding Transact-SQL file allowing it to be edited and the error corrected. Once all the errors are fixed the project can be published, either directly to SQL Database to create an empty database or back to (a copy of) the original SQL Server database to update its schema, which allows the database to be deployed with its data using SSMS as above.

Use the [lastest SQL Server Data Tools for Visual Studio](https://msdn.microsoft.com/library/mt204009.aspx) with Visual Studio 2013 Update 4 or later.

## Comparisons
| Option #1 | Option #2 |
| ------------ | ------------ | ------------ |
| Deploy a compatible database to Azure SQL Database |   Update database in-place then deploy to Azure SQL Database |
|![SSMS](./media/sql-database-cloud-migrate/01SSMSDiagram.png)| ![Offline Edit](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png) |
| Uses SSMS | Uses VS and SSMS |
|Simple process requires that schema is compatible. Schema is migrated unchanged. | Schema is imported into a database project in Visual Studio. Additional updates are made using SSDT in Visual Studio and final schema used to update the database in situ. |
| If exporting a BACPAC then can choose to migrate schema only. | Can publish schema only directly to Azure from Visual Studio. Database is updated with any required changes in situ to allow schema and data to be deployed/exported. |
| Always deploys or exports the entire database. | Full control of the objects that are included in the migration. |
| No provision for changing the output if there are errors, the source schema must be compatible. | Full features of SSDT in Visual Studio available. Schema is changed offline. | Application validation occurs in Azure. Should be minimal as schema is migrated without change. | Application validation can be done in SQL Server before the database is deployed to Azure. |
| Simple, easily configured one- or two-step process. | More complex multi-step process (easier if only deploying schema). |
