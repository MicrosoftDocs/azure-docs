<properties
   pageTitle="Explore Azure SQL Database Tutorials | Microsoft Azure"
   description="Learn about SQL Database features and capabilities"
   keywords=""
   services="sql-database"
   documentationCenter=""
   authors="carlrabeler"
   manager="jhubbard"
   editor=""/>

<tags
   ms.service="sql-database"
   ms.devlang="NA"
   ms.topic="article"
   ms.tgt_pltfrm="NA"
   ms.workload="data-management"
   ms.date="06/01/2016"
   ms.author="carlrab"/>
   
# Explore Azure SQL Database Tutorials

The links below take you to an overview of each listed feature area and a simple step-by-start tutorial for each area. For solution-scoped quick starts that demonstrate the use of SQL Database in a complete solution based on real world scenarios, see [Azure SQL Database Solution Quick Starts](sql-database-solution-quick-starts.md).

## Using SQL Server Management Studio

In the following tutorials, you will learn about using SQL Server Management Studio to administer and query Azure SQL Database.


> [AZURE.IMPORTANT] It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).


| Tutorial  | Description  |
|---|---|---|
| [Connect to Azure SQL Database using a server-level principal login](sql-database-get-started-security.md#connect-to-azure-sql-database-using-a-server-level-principal-login)| In this tutorial, you learn how to connect to Azure SQL Database using a server-level principal login.|
| [Connect to Azure SQL Database as a user](sql-database-get-started-security.md#connect-to-azure-sql-database-as-a-user) | In this tutorial, you will learn how to connect to an Azure SQL database using a database-level user account.|
||||

## Elastic pools

In the following tutorials, you will learn about using [elastic pools](sql-database-elastic-pool.md) to manage the performance goals for multiple databases that have widely varying and unpredictable usage patterns.

| Tutorial  | Description  |
|---|---|---|
| [Create an elastic pool](sql-database-elastic-pool-create-portal.md) | In this tutorial, you learn how to create a scalable pool of Azure SQL databases. |
| [Monitor an elastic database](sql-database-elastic-pool-manage-portal.md#elastic-database-monitoring) | In this tutorial, you learn how to monitor an individual elastic database for potential trouble. |
| [Add an alert to a pool resource](sql-database-elastic-pool-manage-portal.md#add-an-alert-to-a-pool-resource) | In this tutorial, you learn how to add rules to resources that send email to people or alert strings to URL endpoints when the resource hits a utilization threshold that you set up. |
| [Move a database into an elastic pool](sql-database-elastic-pool-manage-portal.md#move-a-database-into-an-elastic-pool) | In this tutorial, you learn how to move a database into an elastic pool. |
| [Move a database out of an elastic pool](sql-database-elastic-pool-manage-portal.md#move-a-database-out-of-an-elastic-pool) | In this tutorial, you learn how to move a database out of an elastic pool. |
| [Change performance settings of a pool](sql-database-elastic-pool-manage-portal.md#change-performance-settings-of-a-pool) | In this tutorial, you learn how to adjust the performance and storage limits for a pool. |
||||

## Elastic database jobs

In the following tutorials, you will learn about using [elastic database jobs](sql-database-elastic-jobs-overview.md).

| Tutorial  | Description  |
|---|---|---|
| [Get started with Elastic Database tools](sql-database-elastic-scale-get-started.md) | In this tutorial, you learn how to use the capabilities of elastic database tools using a simple sharded application. |
| [Get started with Azure SQL Database elastic jobs](sql-database-elastic-jobs-getting-started.md)  | In this tutorial, you learn how to  how to create and manage jobs that manage a group of related databases.  | 
||||

## Elastic queries

In the following tutorials, you will learn about running [elastic queries](sql-database-elastic-query-overview.md). 

| Tutorial  | Description  |
|---|---|---|
| [Querying across a horizontally partitioned (sharded) database)](sql-database-elastic-query-getting-started.md) | In this tutorial, you learn how to create reports from all databases in a horizontally partitioned (sharded) database using [elastic query](sql-database-elastic-query-overview.md) |
| [Querying across a vertically partitioned database)](sql-database-elastic-query-getting-started-vertical.md#create-database-objects) | In this tutorial, you learn how to create reports from all databases in a vertically database using [elastic query](sql-database-elastic-query-overview.md) |
| [Migrate an existing database to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md)| In this tutorial, you learn to horizontally scale (shard) an Azure SQL database. |
||||

## Performance Optimization

In the following tutorials, you will learn about optimizing the [performance of single databases](sql-database-performance-guidance.md). For optimizing the performance of multiple databases, see [Elastic pools](#elastic-pools).

| Tutorial  | Description  |
|---|---|---|
| [Change the service tier and performance level of your database](sql-database-scale-up.md#change-the-service-tier-and-performance-level-of-your-database) | In this tutorial, you learn how to scale up or scale down the performance of an Azure SQL database using service tiers. |
| [SQL Database Advisor Query Performance Insight](sql-database-performance.md#performance-overview) | In this tutorial, you learn how to open and use SQL Database Advisor Query Performance Insight.|
| [SQL Database Advisor performance recommendations](sql-database-advisor.md#viewing-recommendations) | In this tutorial, you learn how to view and apply SQL Database Advisor performance recommendations. |
| [Review top CPU consuming queries](sql-database-query-performance.md#review-top-cpu-consuming-queries)| In this tutorial, you learn how to use SQL Database Advisor Query Performance Insight to review top CPU consuming queries.|
| [Viewing individual query details](sql-database-query-performance.md#viewing-individual-query-details)| In this tutorial, you learn how to use SQL Database Advisor Query Performance Insight to view individual query performance details.|
||||

## SQL Database Migration and Archive 

In the following tutorials, you will learn about [migrating an existing SQL Server database to Azure SQL Database](sql-database-cloud-migrate.md).

| Tutorial  | Description  |
|---|---|---|
| [Detecting Compatibility Issues Using SQL Server Data Tools for Visual Studio](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md#detecting-compatibility-issues-using-sql-server-data-tools-for-visual-studio) | In this tutorial, you learn how to use SQL Server Data Tools for Visual Studio to determine Azure SQL Database compatibility. |
| [Fixing Compatibility Issues Using SQL Server Data Tools for Visual Studio](sql-database-cloud-migrate-fix-compatibility-issues-ssdt#fixing-compatibility-issues-using-sql-server-data-tools-for-visual-studio) | In this tutorial, you learn how to use SQL Server Data Tools for Visual Studio to fix Azure SQL Database compatibility issues. |
| [Determine SQL Database compatibility using SqlPackage.exe](ql-database-cloud-migrate-determine-compatibility-sqlpackage.md#using-sqlpackageexe) | In this tutorial, you learn how to use the SQLPackage.exe command-line utility to determine Azure SQL Database compatibility.|
| [Determine SQL Database compatibility using SSMS](sql-database-cloud-migrate-determine-compatibility-ssms.md#using-sql-server-management-studio) |In this tutorial, you learn how to use SQL Server Management Studio to determine Azure SQL Database compatibility.|
| [Migrate SQL Server database to SQL Database using Deploy Database to Microsoft Azure Database Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md#use-the-deploy-database-to-microsoft-azure-database-wizard) | In this tutorial, you will learn how to migrate a compatible SQL Server database to Azure SQL Database using the Deploy Database to Microsoft Azure Database Wizard in SQL Server Management Studio.
| [Export a SQL Server database to a BACPAC file using SSMS](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md) | In this tutorial, you will learn how to export a compatible SQL Server database to a BACPAC file using the Export Data Tier Application Wizard in SQL Server Management Studio.|
| [Export a SQL Server database to a BACPAC file using SqlPackage](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md) | In this tutorial, you will learn how to export a compatible SQL Server database to a BACPAC file using the SQLPackage.exe command-line utility.|
| [Import a BACPAC file into Azure SQL Database using SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md) | In this tutorial, you will learn how to import a database into Azure SQL Database from a BACPAC file using the Export Data Tier Application Wizard in SQL Server Management Studio. |
| [Import a BACPAC file into Azure SQL Database using SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md#import-from-a-bacpac-file-into-azure-sql-database-using-sqlpackage) | In this tutorial, you will learn how to import a database into Azure SQL Database from a BACPAC file using the SQLPackage command-line utility. |
| [Import a BACPAC file into Azure SQL Database using the Azure portal](sql-database-import.md) | In this tutorial, you will learn how to import a database into Azure SQL Database from a BACPAC file that is stored in an Azure blob using the Azure Portal.|
| [Import a BACPAC file into Azure SQL Database using PowerShell](sql-database-import-powershell.md) | In this tutorial, you will learn how to import a database into Azure SQL Database from a BACPAC file using PowerShell.|
| [Archive an Azure SQL database using the Azure portal](sql-database-export.md#export-your-database) | In this tutorial, you learn how to archive an Azure SQL database to a BACPAC file using the Azure portal. |
| [Archive an Azure SQL database using PowerShell](sql-database-export-powershell.md) | In this tutorial, you learn how to archive an Azure SQL database to a BACPAC file using PowerShell. |
| [Copy an Azure SQL database using the Azure portal](sql-database-copy.md#copy-your-sql-database) | In this tutorial, you learn how to copy an Azure SQL database using the Azure portal. |
| [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell#copy-your-sql-database) | In this tutorial, you learn how to copy an Azure SQL database using PowerShell. |
| [Copy an Azure SQL database using Transact-SQL](sql-database-copy-transact-sql.md#copy-your-sql-database) | In this tutorial, you learn how to copy an Azure SQL database using Transact-SQL. |
||||

##Develop

In the following tutorials, you will learn about [SQL Database Development](sql-database-develop-overview.md) and using [connectivity libraries](sql-database-libraries.md).

| Tutorial  | Description  |
|---|---|---|
| [Connect to SQL Database by using .NET (C#)](sql-database-develop-dotnet-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using C#. |
| [Connect to SQL Database by using Java](sql-database-develop-java-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using Java. |
| [Connect to SQL Database by using Node.js](sql-database-develop-nodejs-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using Node.js. |
| [Connect to SQL Database by using PHP](sql-database-develop-php-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using PHP. |
| [Connect to SQL Database by using Python](sql-database-develop-python-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using Python. |
| [Connect to SQL Database by using Ruby](sql-database-develop-ruby-simple.md) | In this tutorial, you learn how to connect to an Azure SQL database using Ruby. |
||||
 
## Database Access

In the following tutorials, you will learn about [creating and managing logins and users](sql-database-manage-logins.md).

| Tutorial  | Description  |
|---|---|---|
| [Create an Azure SQL Database server-level firewall rule using the Azure portal](sql-database-configure-firewall-settings.md)  | In this tutorial, you learn how to configure a SQL Database server-level firewall using the Azure portal.  |
| [Create a database-level firewall rule using Transact-SQL](sql-database-configure-firewall-settings-tsql.md#database-level-firewall-rules) | In this tutorial, you will learn how to create a database-level firewall rule using Transact-SQL.|
| [Manage server-level firewall rules using Transact-SQL](sql-database-configure-firewall-settings-tsql.md#manage-server-level-firewall-rules-through-transact-sql) | In this tutorial, you will learn how to manage an Azure SQL Database server-level firewall using Transact-SQL.|
| [Manage server-level firewall rules using PowerShell](sql-database-configure-firewall-settings-powershell.md#manage-firewall-rules-using-powershell) | In this tutorial, you will learn how to manage an Azure SQL Database server-level firewall using PowerShell.|
| [Manage server-level firewall rules using the REST API](sql-database-configure-firewall-settings-rest.md#manage-firewall-rules-using-the-service-management-rest-api) | In this tutorial, you will learn how to manage an Azure SQL Database server-level firewall using the RESET API.|
| [Connect to Azure SQL Database using a server-level principal login](sql-database-get-started-security.md#connect-to-azure-sql-database-using-a-server-level-principal-login)| In this tutorial, you learn how to connect to Azure SQL Database using a server-level principal login.|
| [Granting database access to a login](sql-database-manage-logins.md#granting-database-access-to-a-login() | In this tutorial, you learn how to grant database access to a server-level login.|
| [Create new database user using SSMS](sql-database-get-started-security.md#create-new-database-user-using-ssms) | In this tutorial, you learn how to create a new database user in an existing database using SSMS.|
| [Grant new database user db_owner permissions](sql-database-get-started-security.md#grant-new-database-user-dbowner-permissions) | In this tutorial, you learn how to grant an existing database user db_owner permissions.|
| [Connect to Azure SQL Database as a user](sql-database-get-started-security.md#connect-to-azure-sql-database-as-a-user) | In this tutorial, you learn how to connect to an Azure SQL database using a database-level user account.|
||||


## Data Security

In the following tutorials, you will learn about [securing Azure SQL Database data](sql-database-security.md). 

| Tutorial  | Description  |
|---|---|---|
| [Enable threat detection for your database using the Azure portal](sql-database-threat-detection-get-started.md#set-up-threat-detection-for-your-database) | In this tutorial, you learn how to set up threat detection in the Azure portal for your database.|
| [Secure sensitive data uisng Always Encrypted ](sql-database-always-encrypted-azure-key-vault.md) | In this tutorial, you will use the Always Encrypted wizard to secure sensitive data in an Azure SQL database.|
| [Secure senstive data using transparent data encryption](https://msdn.microsoft.com/library/dn948096.aspx)| In this tutorial, you learn how to use transparent data encryption to secure senstive data.|
| [Encrypt a column of data](https://msdn.microsoft.com/library/ms179331.aspx)| In this tutorial, you learn how to encrypt a column of data using Transact-SQL.|
| [Set up dynamic data masking](sql-database-dynamic-data-masking-get-started.md#set-up-dynamic-data-masking-for-your-database-using-the-azure-portal)  | In this tutorial, you learn how to set up dynamic data masking for your Azure SQL database. |
||||

## Business Continuity and Query Scale-Out

In the following tutorials, you will learn about using [Geo-Restore and Active Geo-Replication](sql-database-business-continuity.md) to reccover from errors, for business continuity and for query scale-out.

| Tutorial  | Description  |
|---|---|---|
| [Restore an Azure SQL Database to a previous point in time with the Azure Portal](sql-database-point-in-time-restore-portal.md)| In this tutorial, you learn how to restore your database to an earlier point in time using the Azure portal.|
| [Restore an Azure SQL Database to a previous point in time with PowerShell](sql-database-point-in-time-restore-powershell.md) | In this tutorial, you learn how to restore your database to an earlier point in time using PowerShell|
| [Restore a deleted Azure SQL database using the Azure Portal](sql-database-restore-deleted-database-portal.md) | In this tutorial, you learn how to restore a deleted database using the Azure portal.|
| [Restore a deleted Azure SQL database using the PowerShell](sql-database-restore-deleted-database-powershell.md) | In this tutorial, you learn how to restore a deleted database using PowerShell.|
| [Configure Geo-Replication for Azure SQL Database using the Azure portal](sql-database-geo-replication-portal.md)| In this tutorial, you learn how to configure Active Geo-Replication using the Azure portal.|
| [Configure Geo-Replication for Azure SQL Database using PowerShell](sql-database-geo-replication-powershell.md)| In this tutorial, you learn how to configure Active Geo-Replication using PowerShell.|
| [Configure Geo-Replication for Azure SQL Database using Transact-SQL](sql-database-geo-replication-transact-sql.md)| In this tutorial, you learn how to configure Active Geo-Replication using Transact-SQL.|
| [Initiate a planned or unplanned failover for Azure SQL Database using the Azure portal](sql-database-geo-replication-failover-portal.md) | In this tutorial, you learn how to failover to a geo-replicated secondary replica using the Azure portal.|
| [Initiate a planned or unplanned failover for Azure SQL Database using PowerShell](sql-database-geo-replication-failover-powershell.md) | In this tutorial, you learn how to failover to a geo-replicated secondary replica using PowerShell.|
| [Initiate a planned or unplanned failover for Azure SQL Database using Transact-SQL](sql-database-geo-replication-failover-transact-sql.md) | In this tutorial, you learn how to failover to a geo-replicated secondary replica using Transact-SQL.|
||||

## Data Sync

In this tutorial, you will learn about [Data Sync](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf).

| Tutorial  | Description  |
|---|---|---| 
| [Getting Started with Azure SQL Data Sync (Preview)](sql-database-get-started-sql-data-sync.md)  | In this tutorial, you learn the fundamentals of Azure SQL Data Sync using the Azure Classic Portal. |
||||

## Next steps

[Explore Azure SQL Database Solution Quick Starts](sql-database-solution-quick-starts.md)
