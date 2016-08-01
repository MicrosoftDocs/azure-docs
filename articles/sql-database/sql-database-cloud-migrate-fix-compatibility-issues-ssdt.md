<properties
   pageTitle="Fix SQL Server database compatibility issues before migration to SQL Database | Microsoft Azure"
   description="Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard, SSDT"
   services="sql-database"
   documentationCenter=""
   authors="CarlRabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="sqldb-migrate"
   ms.date="06/07/2016"
   ms.author="carlrab"/>

# Migrate a SQL Server Database to Azure SQL Database Using SQL Server Data Tools for Visual Studio 

> [AZURE.SELECTOR]
- [SSDT](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md)
- [SqlPackage](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md)
- [SSMS](sql-database-cloud-migrate-determine-compatibility-ssms.md)
- [Upgrade Advisor](http://www.microsoft.com/download/details.aspx?id=48119)
- [SAMW](sql-database-cloud-migrate-fix-compatibility-issues.md)

In this article, you learn to detect and fix SQL Server database compatibility issues using the SQL Server Data Tools for Visual Studio before migration to Azure SQL Database.

## Using SQL Server Data Tools for Visual Studio

Use SQL Server Data Tools for Visual Studio ("SSDT") to import the database schema into a Visual Studio database project for analysis. To analyze, you specify the target platform for the project as SQL Database V12 and then build the project. If the build is successful, the database is compatible. If the build fails, you can resolve the errors in SSDT (or one of the other tools discussed in this topic). Once the project builds successfully, you can publish it back as a copy of the source database and then use the data compare feature in SSDT to copy the data from the source database to the Azure SQL V12 compatible database. You can then migrate this updated database. To use this option, download the [newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx).

  ![VSSSDT migration diagram](./media/sql-database-cloud-migrate/03VSSSDTDiagram.png)

  > [AZURE.NOTE] If schema-only migration is required, the schema can be published directly from Visual Studio directly to Azure SQL Database. Use this method when the database schema requires more changes than can be handled by the migration wizard alone.

## Detecting Compatibility Issues Using SQL Server Data Tools for Visual Studio
   
1.	Open the **SQL Server Object Explorer** in Visual Studio. Use **Add SQL Server** to connect to the SQL Server instance containing the database being migrated. Locate the database in the explorer, right click it and select **Create New Project…**     
    
	![New Project](./media/sql-database-migrate-visualstudio-ssdt/02MigrateSSDT.png)    
   
2.	Configure the import settings to **Import application-scoped objects only**. Uncheck the options to import the following: referenced logins, permissions and database settings.    

    ![alt text](./media/sql-database-migrate-visualstudio-ssdt/03MigrateSSDT.png)    

3.	Click **Start** to import the database and create the project, which will contain a T-SQL script file for each object in the database. The script files are nested in folders within the project.    

    ![alt text](./media/sql-database-migrate-visualstudio-ssdt/04MigrateSSDT.png)    

4.	In the Visual Studio Solution Explorer, right click on the database project and select Properties. This will open the **Project Settings** page on which you should configure the Target Platform to Microsoft Azure SQL Database V12.    
    
    ![alt text](./media/sql-database-migrate-visualstudio-ssdt/05MigrateSSDT.png)    
    
5.	Right-click on the project and select **Build** to build the project.    
    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/06MigrateSSDT.png)    
    
6.	The **Error List** displays each incompatibility. In this case, the user name NT AUTHORITY\NETWORK SERVICE is incompatible. Since it is incompatible, you can comment it out or remove it (and address the implications of removing this login and role from the database solution).     
    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/07MigrateSSDT.png)    
    
## Fixing Compatibility Issues Using SQL Server Data Tools for Visual Studio        
      
1.	Double-click the first script to open the script in a query window and comment out the script, and then execute the script.     
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/08MigrateSSDT.png)    

2.	Repeat this process for each script containing incompatibilities until no error remain.    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/09MigrateSSDT.png)    
     
3.	When the database is free of errors right click on the project and select **Publish** to build and publish the database to a copy of the source database (it is highly recommended to use a copy, at least initially).     
 - Before you publish, depending on the source SQL Server version (earlier than SQL Server 2014), you may need to reset the project’s target platform to enable deployment.     
 - If you are migrating an older SQL Server database you must not introduce any features into the project that are not supported in the source SQL Server unless you first migrate the database to a newer version of SQL Server.     

    	![alt text](./media/sql-database-migrate-visualstudio-ssdt/10MigrateSSDT.png)    
    
    	![alt text](./media/sql-database-migrate-visualstudio-ssdt/11MigrateSSDT.png)    
    
4.	In SQL Server Object Explorer, right-click your source database and click **Data Comparison** to compare the project to the original database to understand what changes have been made by the wizard. Select your Azure SQL V12 version of the database and then click **Finish**.    
    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/12MigrateSSDT.png)    
    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/13MigrateSSDT.png)    
    
5.	Review the differences detected and then click **Update Target** to migrate data from the source database into the Azure SQL V12 database.     
    
	![alt text](./media/sql-database-migrate-visualstudio-ssdt/14MigrateSSDT.png)    
    
6.	Choose a deployment methos. See [Migrate a compatible SQL Server database to SQL Database.](sql-database-cloud-migrate.md)  

## Next steps

- [Newest version of SSDT](https://msdn.microsoft.com/library/mt204009.aspx)
- [Newest version of SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx)

## Additional resources

- [SQL Database V12](sql-database-v12-whats-new.md)
- [Transact-SQL partially or unsupported functions](sql-database-transact-sql-information.md)
- [Migrate non-SQL Server databases using SQL Server Migration Assistant](http://blogs.msdn.com/b/ssma/)
