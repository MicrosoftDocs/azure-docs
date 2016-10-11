<properties
	pageTitle="All topics for SQL Database service | Microsoft Azure"
	description="Table of all topics for the Azure service named SQL Database that exist on http://azure.microsoft.com/documentation/articles/, Title and description."
	services="sql-database"
	documentationCenter=""
	authors="MightyPen"
	manager="jhubbard"
	editor="MightyPen"/>

<tags
	ms.service="sql-database"
	ms.workload="sql-database"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="10/05/2016"
	ms.author="genemi"/>


# All topics for Azure SQL Database service

This topic lists every topic that applies directly to the **SQL Database** service of Azure. You can search this webpage for keywords by using **Ctrl+F**, to find the topics of current interest.




## New

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 1 | [Daxko/CSI used Azure to accelerate its development cycle and to enhance its customer services and performance](sql-database-implementation-daxko.md) | Learn about how Daxko/CSI uses SQL Database to accelerate its development cycle and to enhance its customer services and performance |
| 2 | [Azure gives GEP global reach and greater efficiency](sql-database-implementation-gep.md) | Learn about how GEP uses SQL Database to reach more global customers and achieve greater efficiency |
| 3 | [With Azure, SnelStart has rapidly expanded its business services at a rate of 1,000 new Azure SQL Databases per month](sql-database-implementation-snelstart.md) | Learn about how SnelStart uses SQL Database to rapidly expanded its business services at a rate of 1,000 new Azure SQL Databases per month |
| 4 | [Umbraco uses Azure SQL Database to quickly provision and scale services for thousands of tenants in the cloud](sql-database-implementation-umbraco.md) | Learn about how Umbraco uses SQL Database to quickly provision and scale services for thousands of tenants in the cloud |
| 5 | [Manage Azure SQL Database with PowerShell](sql-database-manage-powershell.md) | Azure SQL Database management with PowerShell. |
| 6 | [SSMS support for Azure AD MFA with SQL Database and SQL Data Warehouse](sql-database-ssms-mfa-authentication.md) | Use Multi-Factored Authentication with SSMS for SQL Database and SQL Data Warehouse. |
| 7 | [Explaining Database Transaction Units (DTUs) and elastic Database Transaction Units (eDTUs)](sql-database-what-is-a-dtu.md) | Understanding what an Azure SQL Database transaction unit is. |


## Updated articles, SQL Database

This section lists articles which were updated recently, where the update was big or significant. For each updated article, a rough snippet of the added markdown text is displayed. The articles were updated within the date range of **2016-08-22** to **2016-10-05**.

| &nbsp; | Article | Updated text, snippet | Updated when |
| --: | :-- | :-- | :-- |
| 8 | [Manage Azure SQL Database with PowerShell](sql-database-command-line-tools.md) | Create a resource group for our SQL Database and related Azure resources with the  New-AzureRmResourceGroup (https://msdn.microsoft.com/library/azure/mt759837.aspx) cmdlet. * $resourceGroupName = "resourcegroup1" $resourceGroupLocation = "northcentralus" New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation * For more information, see  Using Azure PowerShell with Azure Resource Manager (../powershell-azure-resource-manager.md). For a sample script, see  Create a SQL database PowerShell script (sql-database-get-started-powershell.md create-a-sql-database-powershell-script). ** Create a SQL Database server** Create a SQL Database server with the  New-AzureRmSqlServer (https://msdn.microsoft.com/library/azure/mt603715.aspx) cmdlet. Replace *server1* with the name for your server. Server names must be unique across all Azure SQL Database servers. If the server name is already taken, you get an error. This command may take several minutes to complete. The resou | 2016-09-14 |
| 9 | [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell.md) |   SQL database source (the existing database to copy)  --  $sourceDbName = "db1"  $sourceDbServerName = "server1"  $sourceDbResourceGroupName = "rg1"  SQL database copy (the new db to be created)  --  $copyDbName = "db1_copy"  $copyDbServerName = "server2"  $copyDbResourceGroupName = "rg2"  Copy a database to the same server  --  New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyDatabaseName $copyDbName  Copy a database to a different server  --  New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyResourceGroupName $copyDbResourceGroupName -CopyServerName $copyDbServerName -CopyDatabaseName $copyDbName  Copy a database into an elastic database pool  --  $poolName = "pool1"  New-AzureRmSqlDatabaseCopy -ResourceGroupName $sourceDbResourceGroupName -ServerName $sourceDbServerName -DatabaseName $sourceDbName -CopyReso | 2016-09-08 |
| 10 | [Create an elastic database pool with C#](sql-database-elastic-pool-create-csharp.md) |   Console.WriteLine("Server firewall...");  FirewallRuleGetResponse fwr = CreateOrUpdateFirewallRule(_sqlMgmtClient, _resourceGroupName, _serverName, _firewallRuleName, _startIpAddress, _endIpAddress);  Console.WriteLine("Server firewall: " + fwr.FirewallRule.Id);  Console.WriteLine("Elastic pool...");  ElasticPoolCreateOrUpdateResponse epr = CreateOrUpdateElasticDatabasePool(_sqlMgmtClient, _resourceGroupName, _serverName, _poolName, _poolEdition, _poolDtus, _databaseMinDtus, _databaseMaxDtus);  Console.WriteLine("Elastic pool: " + epr.ElasticPool.Id);  Console.WriteLine("Database...");  DatabaseCreateOrUpdateResponse dbr = CreateOrUpdateDatabase(_sqlMgmtClient, _resourceGroupName, _serverName, _databaseName, _poolName);  Console.WriteLine("Database: " + dbr.Database.Id);  Console.WriteLine("Press any key to continue...");  Console.ReadKey();  }  static ResourceGroup CreateOrUpdateResourceGroup(ResourceManagementClient resourceMgmtClient, string subscriptionId, string resourceGroupNa | 2016-09-14 |
| 11 | [PowerShell script for identifying databases suitable for an elastic database pool](sql-database-elastic-pool-database-assessment-powershell.md) | ** For Elastic database pool candidates, we exclude master, and any databases that are already in a pool. You may add more databases to the excluded list below as needed** $ListOfDBs = Get-AzureRmSqlDatabase -ServerName $servername.Split('.') 0  -ResourceGroupName $ResourceGroupName  /  Where-Object {$_.DatabaseName -notin ("master") -and $_.CurrentServiceLevelObjectiveName -notin ("ElasticPool") -and $_.CurrentServiceObjectiveName -notin ("ElasticPool")} $outputConnectionString = "Data Source=$outputServerName;Integrated Security=false;Initial Catalog=$outputdatabaseName;User Id=$outputDBUsername;Password=$outputDBpassword" $destinationTableName = "resource_stats_output" ** Create a table in output database for metrics collection** $sql = " IF  NOT EXISTS (SELECT * FROM sys.objects WHERE object_id = OBJECT_ID(N'$($destinationTableName)') AND type in (N'U')) BEGIN Create Table $($destinationTableName) (database_name varchar(128), slo varchar(20), end_time datetime, avg_cpu float, avg_ | 2016-09-29 |
| 12 | [SQL Database tutorial: Create a SQL database in minutes by using the Azure portal](sql-database-get-started.md) |   ! New sql database 1 (./media/sql-database-get-started/sql-database-new-database-1.png) 3. Click **SQL Database** to open the SQL Database blade. The content on this blade varies depending on the number of your subscriptions and your existing objects (such as existing servers).  ! New sql database 2 (./media/sql-database-get-started/sql-database-new-database-2.png) 4. In the **Database name** text box, provide a name for your first database - such as "my-database". A green check mark indicates that you have provided a valid name.  ! New sql database 3 (./media/sql-database-get-started/sql-database-new-database-3.png) 5. If you have multiple subscriptions, select a subscription. 6. Under **Resource group**, click **Create new** and provide a name for your first resource group - such as "my-resource-group". A green check mark indicates that you have provided a valid name.  ! New sql database 4 (./media/sql-database-get-started/sql-database-new-database-4.png) 7. Under **Select source* | 2016-09-08 |
| 13 | [Try SQL Database: Use C# to create a SQL database with the SQL Database Library for .NET](sql-database-get-started-csharp.md) | ** Create a service principal to access resources** The following PowerShell script creates the Active Directory (AD) application and the service principal that we need to authenticate our C  app. The script outputs values we need for the preceding C  sample. For detailed information, see  Use Azure PowerShell to create a service principal to access resources (../resource-group-authenticate-service-principal.md).  Sign in to Azure.  Add-AzureRmAccount  If you have multiple subscriptions, uncomment and set to the subscription you want to work with.  $subscriptionId = "{xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx}"  Set-AzureRmContext -SubscriptionId $subscriptionId  Provide these values for your new AAD app.  $appName is the display name for your app, must be unique in your directory.  $uri does not need to be a real uri.  $secret is a password you create.  $appName = "{app-name}"  $uri = "http://{app-name}"  $secret = "{app-password}"  Create a AAD app  $azureAdApplication = New-AzureRmADApp | 2016-09-23 |
| 14 | [Managing Azure SQL Databases using the Azure portal](sql-database-manage-portal.md) | To view or update your database settings, click the desired setting on the SQL database blade: ! SQL database settings (./media/sql-database-manage-portal/settings.png) ** How do I find a SQL databases fully qualified server name?** To view your databases server name, click **Overview** on the **SQL database** blade and note the server name: ! SQL database settings (./media/sql-database-manage-portal/server-name.png) ** How do I manage firewall rules to control access to my SQL server and database?** To view, create, or update firewall rules, click **Set server firewall** on the **SQL database** blade. For details, see  Configure an Azure SQL Database server-level firewall rule using the Azure portal (sql-database-configure-firewall-settings.md). ! firewall rules (./media/sql-database-manage-portal/sql-database-firewall.png) ** How do I change my SQL database service tier or performance level?** To update the service tier or performance level of a SQL database, click **Pricing tier (s | 2016-09-20 |





## Get started

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 15 | [Builds Multi-tenant Apps with Azure SQL Database With Isolation and Efficiency](sql-database-build-multi-tenant-apps.md) | Learn how SQL Database builds multi-tenant apps |
| 16 | [Connect to SQL Database with SQL Server Management Studio and execute a sample T-SQL query](sql-database-connect-query-ssms.md) | Learn how to connect to SQL Database on Azure by using SQL Server Management Studio (SSMS). Then, run a sample query using Transact-SQL (T-SQL). |
| 17 | [Connect to SQL Database by using .NET (C#)](sql-database-develop-dotnet-simple.md) | Use the sample code in this quick start to build a modern application with C# and backed by a powerful relational database in the cloud with Azure SQL Database. |
| 18 | [Create a new elastic database pool with the Azure portal](sql-database-elastic-pool-create-portal.md) | How to add a scalable elastic database pool to your SQL database configuration for easier administration and resource sharing across many databases. |
| 19 | [Explore Azure SQL Database Tutorials](sql-database-explore-tutorials.md) | Learn about SQL Database features and capabilities |
| 20 | [SQL Database tutorial: Create a SQL database in minutes by using the Azure portal](sql-database-get-started.md) | Learn how to set up a SQL Database logical server, server firewall rule, SQL database, and sample data. Also, learn how to connect with client tools, configure users, and set up a database firewall rule. |
| 21 | [Azure SQL Database Secures and Protects](sql-database-helps-secures-and-protects.md) | Learn how SQL Database helps secure and protect |
| 22 | [Azure SQL Database Learns &amp; Adapts](sql-database-learn-and-adapt.md) | Learn how SQL Database learns and adapts |
| 23 | [Choose a cloud SQL Server option: Azure SQL (PaaS) Database or SQL Server on Azure VMs (IaaS)](sql-database-paas-vs-sql-server-iaas.md) | Learn which cloud SQL Server option fits your application: Azure SQL (PaaS) Database or SQL Server in the cloud on Azure Virtual Machines. |
| 24 | [Azure SQL Database Scales on the fly](sql-database-scale-on-the-fly.md) | Learn how SQL Database scales on the fly |
| 25 | [Explore Azure SQL Database Solution Quick Starts](sql-database-solution-quick-starts.md) | Learn about Azure SQL Database Solutions |
| 26 | [Azure SQL Database Works in your Environment](sql-database-works-in-your-environment.md) | Learn how SQL Database helps, secures and protects |



## Build an app

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 27 | [Troubleshoot, diagnose, and prevent SQL connection errors and transient errors for SQL Database](sql-database-connectivity-issues.md) | Learn how to troubleshoot, diagnose, and prevent a SQL connection error or transient error in Azure SQL Database.  |
| 28 | [Connect to a SQL Database with Visual Studio](sql-database-connect-query.md) | Write a program in C# to query and connect to SQL database. Info about IP addresses, connection strings, secure login, and free Visual Studio. |
| 29 | [Ports beyond 1433 for ADO.NET 4.5 and SQL Database V12](sql-database-develop-direct-route-ports-adonet-v12.md) | Client connections from ADO.NET to Azure SQL Database V12 sometimes bypass the proxy and interact directly with the database. Ports other than 1433 become important. |
| 30 | [SQL error codes for SQL Database client applications: Database connection error and other issues](sql-database-develop-error-messages.md) | Learn about SQL error codes for SQL Database client applications, such as common database connection errors, database copy issues, and general errors.  |
| 31 | [Connect to SQL Database by using PHP on Windows](sql-database-develop-php-simple.md) | Presents a sample PHP program that connects to Azure SQL Database from a Windows client, and provides links to the necessary software components needed by the client. |
| 32 | [Try SQL Database: Use C# to create a SQL database with the SQL Database Library for .NET](sql-database-get-started-csharp.md) | Try SQL Database for developing SQL and C# apps, and create an Azure SQL Database with C# using the SQL Database Library for .NET. |
| 33 | [Getting started with JSON features in Azure SQL Database](sql-database-json-features.md) | Azure SQL Database enables you to parse, query, and format data in JavaScript Object Notation (JSON) notation. |
| 34 | [Troubleshoot connection issues to Azure SQL Database](sql-database-troubleshoot-common-connection-issues.md) | Steps to identify and resolve common connection errors for Azure SQL Database. |
| 35 | [Error "Database on server is not currently available" when connecting to sql database](sql-database-troubleshoot-connection.md) | Troubleshoot the database on server is not currently available error when an application connects to SQL Database. |



## Develop

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 36 | [Get the required values for authenticating an application to access SQL Database from code](sql-database-client-id-keys.md) | Create a service principal for accessing SQL Database from code. |
| 37 | [Connect to SQL Database by using Java with JDBC on Windows](sql-database-develop-java-simple.md) | Presents a Java code sample you can use to connect to Azure SQL Database. The sample uses JDBC, and it runs on a Windows client computer. |
| 38 | [Connect to SQL Database by using Node.js](sql-database-develop-nodejs-simple.md) | Presents a Node.js code sample you can use to connect to Azure SQL Database. |
| 39 | [SQL Database Development Overview](sql-database-develop-overview.md) | Learn about available connectivity libraries and best practices for applications connecting to SQL Database. |
| 40 | [Connect to SQL Database by using Python](sql-database-develop-python-simple.md) | Presents a Python code sample you can use to connect to Azure SQL Database. |
| 41 | [Connect to SQL Database by using Ruby](sql-database-develop-ruby-simple.md) | Give a Ruby code sample you can run to connect to Azure SQL Database. |
| 42 | [Getting Started with Temporal Tables in Azure SQL Database](sql-database-temporal-tables.md) | Learn how to get started with using Temporal Tables in Azure SQL Database. |



## Performance and scale

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 43 | [SQL Database Advisor](sql-database-advisor.md) | The Azure SQL Database Advisor provides recommendations for your existing SQL Databases that can improve current query performance. |
| 44 | [SQL Database Advisor using the Azure portal](sql-database-advisor-portal.md) | You can use the Azure SQL Database Advisor in the Azure portal to review and implement recommendations for your existing SQL Databases that can improve current query performance. |
| 45 | [Azure SQL Database benchmark overview](sql-database-benchmark-overview.md) | This topic describes the Azure SQL Database Benchmark used in measuring the performance of Azure SQL Database. |
| 46 | [When should an elastic database pool be used?](sql-database-elastic-pool-guidance.md) | An elastic database pool is a collection of available resources that are shared by a group of elastic databases. This document provides guidance to help assess the suitability of using an elastic database pool for a group of databases. |
| 47 | [Get started with Elastic Database tools](sql-database-elastic-scale-get-started.md) | Basic explanation of elastic database tools feature of Azure SQL Database, including easy to run sample app. |
| 48 | [SQL Database FAQ](sql-database-faq.md) | Answers to common questions customers ask about cloud databases and Azure SQL Database, Microsoft's relational database management system (RDBMS) and database as a service in the cloud. |
| 49 | [Get started with In-Memory (Preview) in SQL Database](sql-database-in-memory.md) | SQL In-Memory technologies greatly improve the performance of transactional and analytics workloads. Learn how to take advantage of these technologies. |
| 50 | [Use In-Memory OLTP (preview) to improve your application performance in SQL Database](sql-database-in-memory-oltp-migration.md) | Adopt In-Memory OLTP to improve transactional performance in an existing SQL database. |
| 51 | [Monitor In-Memory OLTP Storage](sql-database-in-memory-oltp-monitoring.md) | Estimate and monitor XTP in-memory storage use, capacity; resolve capacity error 41823 |
| 52 | [Operating the Query Store in Azure SQL Database](sql-database-operate-query-store.md) | Learn how to operate the Query Store in Azure SQL Database |
| 53 | [SQL Database Performance Insight](sql-database-performance.md) | The Azure SQL Database provides performance tools to help you identify areas that can improve current query performance. |
| 54 | [Azure SQL Database and performance for single databases](sql-database-performance-guidance.md) | This article can help you determine which service tier to choose for your application. It also recommends ways to tune your application to get the most from Azure SQL Database. |
| 55 | [Azure SQL Database Query Performance Insight](sql-database-query-performance.md) | Query performance monitoring identifies the most CPU-consuming queries for an Azure SQL Database. |
| 56 | [Change the service tier and performance level (pricing tier) of a SQL database](sql-database-scale-up.md) | Change the service tier and performance level of an Azure SQL database shows how to scale your SQL database up or down. Changing the pricing tier of an Azure SQL database. |
| 57 | [Monitoring database performance in Azure SQL Database](sql-database-single-database-monitor.md) | Learn about the options for monitoring your database with Azure tools and dynamic management views. |
| 58 | [SQL Database performance tuning tips](sql-database-troubleshoot-performance.md) | Tips for performance tuning in Azure SQL Database through evaluation and improvement. |
| 59 | [How to use batching to improve SQL Database application performance](sql-database-use-batching-to-improve-performance.md) | The topic provides evidence that batching database operations greatly imroves the speed and scalability of your Azure SQL Database applications. Although these batching techniques work for any SQL Server database, the focus of the article is on Azure. |



## Tools for scaling out

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 60 | [Design patterns for multitenant SaaS applications and Azure SQL Database](sql-database-design-patterns-multi-tenancy-saas-applications.md) | This article discusses the requirements and common data architecture patterns of multitenant database applications running in a cloud environment need to consider and the various tradeoffs associated with these patterns. It also explains how Azure SQL Database, with its elastic pools and elastic tools, help address these requirements in a no-compromise fashion. |
| 61 | [Migrate existing databases to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md) | Convert sharded databases to use elastic database tools by creating a shard map manager |
| 62 | [Building scalable cloud databases](sql-database-elastic-database-client-library.md) | Build scalable .NET database apps with the elastic database client library |
| 63 | [Performance counters for shard map manager](sql-database-elastic-database-perf-counters.md) | ShardMapManager class and data dependent routing performance counters |
| 64 | [Adding a shard using Elastic Database tools](sql-database-elastic-scale-add-a-shard.md) | How to use Elastic Scale APIs to add new shards to a shard set. |
| 65 | [Deploy a split-merge service](sql-database-elastic-scale-configure-deploy-split-and-merge.md) | Splitting and Merging with elastic database tools |
| 66 | [Data dependent routing](sql-database-elastic-scale-data-dependent-routing.md) | How to use the ShardMapManager class in .NET apps for data-dependent routing, a feature of elastic databases for Azure SQL Database |
| 67 | [Elastic database tools FAQ](sql-database-elastic-scale-faq.md) | Frequently Asked Questions about Azure SQL Database Elastic Scale. |
| 68 | [Elastic Database tools glossary](sql-database-elastic-scale-glossary.md) | Explanation of terms used for elastic database tools |
| 69 | [Scaling out with Azure SQL Database](sql-database-elastic-scale-introduction.md) | Software as a Service (SaaS) developers can easily create elastic, scalable databases in the cloud using these tools |
| 70 | [Credentials used to access the Elastic Database client library](sql-database-elastic-scale-manage-credentials.md) | How to set the right level of credentials, admin to read-only, for elastic database apps |
| 71 | [Multi-shard querying](sql-database-elastic-scale-multishard-querying.md) | Run queries across shards using the elastic database client library. |
| 72 | [Moving data between scaled-out cloud databases](sql-database-elastic-scale-overview-split-and-merge.md) | Explains how to manipulate shards and move data via a self-hosted service using elastic database APIs. |
| 73 | [Scale out databases with the shard map manager](sql-database-elastic-scale-shard-map-management.md) | How to use the ShardMapManager, elastic database client library |
| 74 | [Split-merge security configuration](sql-database-elastic-scale-split-merge-security-configuration.md) | Set up x409 certificates for encryption |
| 75 | [Upgrade an app to use the latest elastic database client library](sql-database-elastic-scale-upgrade-client-library.md) | Upgrade apps and libraries using Nuget |
| 76 | [Elastic Database client library with Entity Framework](sql-database-elastic-scale-use-entity-framework-applications-visual-studio.md) | Use Elastic Database client library and Entity Framework for coding databases |
| 77 | [Using elastic database client library with Dapper](sql-database-elastic-scale-working-with-dapper.md) | Using elastic database client library with Dapper. |
| 78 | [Multi-tenant applications with elastic database tools and row-level security](sql-database-elastic-tools-multi-tenant-row-level-security.md) | Learn how to use elastic database tools together with row-level security to build an application with a highly scalable data tier on Azure SQL Database that supports multi-tenant shards. |



## Elastic jobs

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 79 | [Create and manage scaled out Azure SQL Databases using elastic jobs (preview)](sql-database-elastic-jobs-create-and-manage.md) | Walk through creation and management of an elastic database job. |
| 80 | [Getting started with Elastic Database jobs](sql-database-elastic-jobs-getting-started.md) | how to use elastic database jobs |
| 81 | [Managing scaled-out cloud databases](sql-database-elastic-jobs-overview.md) | Illustrates the elastic database job service |
| 82 | [Create and manage a SQL Database elastic database jobs using PowerShell (preview)](sql-database-elastic-jobs-powershell.md) | PowerShell used to manage Azure SQL Database pools |
| 83 | [Installing Elastic Database jobs overview](sql-database-elastic-jobs-service-installation.md) | Walk through installation of the elastic job feature. |
| 84 | [Uninstall Elastic Database jobs components](sql-database-elastic-jobs-uninstall.md) | How to uninstall the elastic database jobs tool |



## Elastic pools

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 85 | [What is an Azure elastic pool?](sql-database-elastic-pool.md) | Manage hundreds or thousands of databases using a pool. One price for a set of performance units can be distributed over the pool. Move databases in or out at will. |
| 86 | [Create an elastic database pool with C#](sql-database-elastic-pool-create-csharp.md) | Use C# database development techniques to create a scalable elastic database pool in Azure SQL Database so you can share resources across many databases. |
| 87 | [Create a new elastic database pool with PowerShell](sql-database-elastic-pool-create-powershell.md) | Learn how to use PowerShell to scale-out Azure SQL Database resources by creating a scalable elastic database pool to manage multiple databases. |
| 88 | [PowerShell script for identifying databases suitable for an elastic database pool](sql-database-elastic-pool-database-assessment-powershell.md) | An elastic database pool is a collection of available resources that are shared by a group of elastic databases. This document provides a Powershell script to help assess the suitability of using an elastic database pool for a group of databases. |
| 89 | [Monitor and manage an elastic database pool with C#](sql-database-elastic-pool-manage-csharp.md) | Use C# database development techniques to manage an Azure SQL Database elastic database pool. |
| 90 | [Monitor and manage an elastic database pool with the Azure portal](sql-database-elastic-pool-manage-portal.md) | Learn how to use the Azure portal and SQL Database's built-in intelligence to manage, monitor, and right-size a scalable elastic database pool to optimize database performance and manage cost. |
| 91 | [Monitor and manage an elastic database pool with PowerShell](sql-database-elastic-pool-manage-powershell.md) | Learn how to use PowerShell to manage an elastic database pool. |
| 92 | [Monitor and manage an elastic database pool with Transact-SQL](sql-database-elastic-pool-manage-tsql.md) | Use T-SQL to create an Azure SQL database in an elastic pool. Or use T-SQL to move the datbase in and out of pools. |
| 93 | [Elastic database pool billing and pricing information](sql-database-elastic-pool-price.md) | Pricing information specific to elastic database pools. |



## Elastic query

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 94 | [Report across scaled-out cloud databases (preview)](sql-database-elastic-query-getting-started.md) | how to use cross database database queries |
| 95 | [Get started with cross-database queries (vertical partitioning) (preview)](sql-database-elastic-query-getting-started-vertical.md) | how to use elastic database query with vertically partitioned databases |
| 96 | [Reporting across scaled-out cloud databases (preview)](sql-database-elastic-query-horizontal-partitioning.md) | how to set up elastic queries over horizontal partitions |
| 97 | [Azure SQL Database elastic database query overview (preview)](sql-database-elastic-query-overview.md) | Overview of the elastic query feature |
| 98 | [Query across cloud databases with different schemas (preview)](sql-database-elastic-query-vertical-partitioning.md) | how to set up cross-database queries over vertical partitions |



## Elastic transaction

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 99 | [Distributed transactions across cloud databases](sql-database-elastic-transactions-overview.md) | Overview of Elastic Database Transactions with Azure SQL Database |



## Backup and recovery

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 100 | [SQL Database backups](sql-database-automated-backups.md) | Learn about SQL Database built-in database backups that enable you to roll back an Azure SQL Database to a previous point in time or copy a database to a new database in an geographic region (up to 35 days). |
| 101 | [Overview of business continuity with Azure SQL Database](sql-database-business-continuity.md) | Learn how Azure SQL Database supports cloud business continuity and database recovery and helps keep mission-critical cloud applications running. |
| 102 | [How to restore a single table from an Azure SQL Database backup](sql-database-cloud-migrate-restore-single-table-azure-backup.md) | Learn how to restore a single table from Azure SQL Database backup. |
| 103 | [Design an application for cloud disaster recovery using Active Geo-Replication in SQL Database](sql-database-designing-cloud-solutions-for-disaster-recovery.md) | Learn how to design cloud disaster recovery solutions for business continuity planning using geo-replication for app data backup with Azure SQL Database. |
| 104 | [Restore an Azure SQL Database or failover to a secondary](sql-database-disaster-recovery.md) | Learn how to recover a database from a regional datacenter outage or failure with the Azure SQL Database Active Geo-Replication, and Geo-Restore capabilities. |
| 105 | [Performing Disaster Recovery Drill](sql-database-disaster-recovery-drills.md) | Learn guidance and best practices for using Azure SQL Database to perform disaster recovery drills that will help keep your mission critical business applications resilient to failures and outages. |
| 106 | [Disaster recovery strategies for applications using SQL Database Elastic Pool](sql-database-disaster-recovery-strategies-for-applications-with-elastic-pool.md) | Learn how to design your cloud solution for disaster recovery by choosing the right failover pattern. |
| 107 | [Using the RecoveryManager class to fix shard map problems](sql-database-elastic-database-recovery-manager.md) | Use the RecoveryManager class to solve problems with shard maps |
| 108 | [Import a BACPAC file to create an Azure SQL database](sql-database-import.md) | Create an Azure SQL database by importing an existing BACPAC file. |
| 109 | [Restore an Azure SQL Database to a previous point in time with the Azure Portal](sql-database-point-in-time-restore-portal.md) | Restore an Azure SQL Database to a previous point in time. |
| 110 | [Restore an Azure SQL Database to a previous point in time with PowerShell](sql-database-point-in-time-restore-powershell.md) | Restore an Azure SQL Database to a previous point in time |
| 111 | [Finalize your recovered Azure SQL Database](sql-database-recovered-finalize.md) | Point in Time Restore, Microsoft Azure SQL Database, restore database, recover database, Azure Classic Portal, Azure Classic Portal |
| 112 | [Recover an Azure SQL database using automated database backups](sql-database-recovery-using-backups.md) | Learn about Point-in-Time Restore, that enables you to roll back an Azure SQL Database to a previous point in time (up to 35 days). |
| 113 | [Restore a deleted Azure SQL database using the Azure Portal](sql-database-restore-deleted-database-portal.md) | Restore a deleted Azure SQL database (Azure Portal). |
| 114 | [Restore a deleted Azure SQL Database by using PowerShell](sql-database-restore-deleted-database-powershell.md) | Restore a deleted Azure SQL Database (PowerShell). |
| 115 | [Restore a database to a previous point in time, restore a deleted database, or recover from a data center outage](sql-database-troubleshoot-backup-and-restore.md) | Learn how to recover a cloud database from errors and outages using backups and replicas in Azure SQL Database. |



## Migrate

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 116 | [Export a SQL Server database to a BACPAC file using SqlPackage](sql-database-cloud-migrate-compatible-export-bacpac-sqlpackage.md) | Microsoft Azure SQL Database, database migration, export database, export BACPAC file, sqlpackage |
| 117 | [Export a SQL Server database to a BACPAC file using SQL Server Management Studio](sql-database-cloud-migrate-compatible-export-bacpac-ssms.md) | Microsoft Azure SQL Database, database migration, export database, export BACPAC file, Export Data Tier Application wizard |
| 118 | [Import to SQL Database from a BACPAC file using SqlPackage](sql-database-cloud-migrate-compatible-import-bacpac-sqlpackage.md) | Microsoft Azure SQL Database, database migration, import database, import BACPAC file, sqlpackage |
| 119 | [Import from BACPAC to SQL Database using SSMS](sql-database-cloud-migrate-compatible-import-bacpac-ssms.md) | Microsoft Azure SQL Database, database deploy, database migration, import database, export database, migration wizard |
| 120 | [Migrate SQL Server database to SQL Database using Deploy Database to Microsoft Azure Database Wizard](sql-database-cloud-migrate-compatible-using-ssms-migration-wizard.md) | Microsoft Azure SQL Database, database migration, Microsoft Azure Database Wizard |
| 121 | [Migrate SQL Server database to Azure SQL Database using transactional replication](sql-database-cloud-migrate-compatible-using-transactional-replication.md) | Microsoft Azure SQL Database, database migration, import database, transactional replication |
| 122 | [Determine SQL Database compatibility using SqlPackage.exe](sql-database-cloud-migrate-determine-compatibility-sqlpackage.md) | Microsoft Azure SQL Database, database migration, SQL Database compatibility, SqlPackage |
| 123 | [Use SQL Server Management Studio to Determine SQL Database compatibility before migration to Azure SQL Database](sql-database-cloud-migrate-determine-compatibility-ssms.md) | Microsoft Azure SQL Database, database migration, SQL Database compatibility, Export Data Tier Application Wizard |
| 124 | [Use SQL Azure Migration Wizard to Fix SQL Server database compatibility issues before migration to Azure SQL Database](sql-database-cloud-migrate-fix-compatibility-issues.md) | Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard |
| 125 | [Migrate a SQL Server Database to Azure SQL Database Using SQL Server Data Tools for Visual Studio](sql-database-cloud-migrate-fix-compatibility-issues-ssdt.md) | Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard, SSDT |
| 126 | [Fix SQL Server database compatibility issues using SQL Server Management Studio before migration to SQL Database](sql-database-cloud-migrate-fix-compatibility-issues-ssms.md) | Microsoft Azure SQL Database, database migration, compatibility, SQL Azure Migration Wizard |
| 127 | [Archive an Azure SQL database to a BACPAC file by using PowerShell](sql-database-export-powershell.md) | Archive an Azure SQL database to a BACPAC file by using PowerShell |
| 128 | [Import a BACPAC file to create an Azure SQL database by using PowerShell](sql-database-import-powershell.md) | Import a BACPAC file to create an Azure SQL database by using PowerShell |
| 129 | [Load data from CSV into Azure SQL Data Warehouse (flat files)](sql-database-load-from-csv-with-bcp.md) | For a small data size, uses bcp to import data into Azure SQL Database. |
| 130 | [Move databases between servers, between subscriptions, and in and out of Azure](sql-database-troubleshoot-moving-data.md) | Quick steps to copy, move, and migrate data and databases in Azure SQL Database. |



## Move data in and out

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 131 | [SQL Server database migration to SQL Database in the cloud](sql-database-cloud-migrate.md) | Learn how about on-premises SQL Server database migration to Azure SQL Database in the cloud. Use database migration tools to test compatibility prior to database migration. |
| 132 | [Copy an Azure SQL Database](sql-database-copy.md) | Create a copy of an Azure SQL database |
| 133 | [Archive an Azure SQL database to a BACPAC file using the Azure Portal](sql-database-export.md) | Archive an Azure SQL database to a BACPAC file  using the Azure Portal |



## Security

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 134 | [Connecting to SQL Database or SQL Data Warehouse By Using Azure Active Directory Authentication](sql-database-aad-authentication.md) | Learn how to connect to SQL Database by using Azure Active Directory Authentication. |
| 135 | [Always Encrypted: Protect sensitive data in SQL Database and store your encryption keys in the Windows certificate store](sql-database-always-encrypted.md) | Protect sensitive data in your SQL database in minutes. |
| 136 | [Always Encrypted: Protect sensitive data in SQL Database and store your encryption keys in Azure Key Vault](sql-database-always-encrypted-azure-key-vault.md) | Protect sensitive data in your SQL database in minutes. |
| 137 | [SQL Database -  Downlevel clients support and IP endpoint changes for Auditing](sql-database-auditing-and-dynamic-data-masking-downlevel-clients.md) | Learn about SQL Database downlevel clients support and IP endpoint changes for Auditing. |
| 138 | [Configure Azure SQL Database server-level firewall rules by using PowerShell](sql-database-configure-firewall-settings-powershell.md) | Learn how to configure the firewall for IP addresses that access Azure SQL databases. |
| 139 | [Configure Azure SQL Database server-level firewall rules using the REST API](sql-database-configure-firewall-settings-rest.md) | Learn how to configure the firewall for IP addresses that access Azure SQL databases. |
| 140 | [Configure Azure SQL Database server-level and database-level firewall rules using T-SQL](sql-database-configure-firewall-settings-tsql.md) | Learn how to configure the firewall for IP addresses that access Azure SQL databases. |
| 141 | [Get started with SQL Database Dynamic Data Masking (Azure Portal)](sql-database-dynamic-data-masking-get-started.md) | How to get started with SQL Database Dynamic Data Masking in the Azure Portal |
| 142 | [Get started with SQL Database Dynamic Data Masking (Azure Classic Portal)](sql-database-dynamic-data-masking-get-started-portal.md) | How to get started with SQL Database Dynamic Data Masking in the Azure Classic Portal |
| 143 | [Configure Azure SQL Database firewall rules \- overview](sql-database-firewall-configure.md) | Learn how to configure a SQL database firewall with server-level and database-level firewall rules to manage access. |
| 144 | [SQL Database tutorial: Create SQL database user accounts to access and manage a database](sql-database-get-started-security.md) | Learn how to create user accounts to access and to manage a database. |
| 145 | [SQL Database Authentication and Authorization: Granting Access](sql-database-manage-logins.md) | Learn about SQL Database security management, specifically how to manage database access and login security through the server-level principal account. |
| 146 | [Azure SQL Database security guidelines and limitations](sql-database-security-guidelines.md) | Learn about Microsoft Azure SQL Database guidelines and limitations related to security. |
| 147 | [Get started with SQL Database Threat Detection](sql-database-threat-detection-get-started.md) | How to get started with SQL Database Threat Detection in the Azure Portal |
| 148 | [How to perform common administrative tasks such as resetting admin password in Azure SQL Database](sql-database-troubleshoot-permissions.md) | Describes how to perform common administrative tasks in SQL Database. For example, resetting admin password, granting and removing access. |



## Manage your database

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 149 | [Get started with SQL database auditing](sql-database-auditing-get-started.md) | Get started with SQL database auditing |
| 150 | [Configure an Azure SQL Database server-level firewall rule using the Azure Portal](sql-database-configure-firewall-settings.md) | Learn how to configure the firewall for IP addresses that access Azure SQL server. |
| 151 | [Copy an Azure SQL Database using the Azure portal](sql-database-copy-portal.md) | Create a copy of an Azure SQL database |
| 152 | [Managing Azure SQL Databases using Azure Automation](sql-database-manage-automation.md) | Learn about how the Azure Automation service can be used to manage Azure SQL databases at scale. |
| 153 | [Overview: management tools for SQL Database](sql-database-manage-overview.md) | Compares tools and options for managing Azure SQL Database |
| 154 | [Monitoring Azure SQL Database using dynamic management views](sql-database-monitoring-with-dmvs.md) | Learn how to detect and diagnose common performance problems by using dynamic management views to monitor Microsoft Azure SQL Database. |
| 155 | [Securing your SQL Database](sql-database-security.md) | Learn about Azure SQL Database and SQL Server security, including the differences between the cloud and SQL Server on-premises when it comes to authentication, authorization, connection security, encryption, and compliance. |



## Extended Events

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 156 | [Event File target code for extended events in SQL Database](sql-database-xevent-code-event-file.md) | Provides PowerShell and Transact-SQL for a two-phase code sample that demonstrates the Event File target in an extended event on Azure SQL Database. Azure Storage is a required part of this scenario. |
| 157 | [Ring Buffer target code for extended events in SQL Database](sql-database-xevent-code-ring-buffer.md) | Provides a Transact-SQL code sample that is made easy and quick by use of the Ring Buffer target, in Azure SQL Database. |
| 158 | [Extended events in SQL Database](sql-database-xevent-db-diff-from-svr.md) | Describes extended events (XEvents) in Azure SQL Database, and how event sessions differ slightly from event sessions in Microsoft SQL Server. |



## Geo replication

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 159 | [Initiate a planned or unplanned failover for Azure SQL Database with the Azure portal](sql-database-geo-replication-failover-portal.md) | Initiate a planned or unplanned failover for Azure SQL Database using the Azure portal |
| 160 | [Initiate a planned or unplanned failover for Azure SQL Database with PowerShell](sql-database-geo-replication-failover-powershell.md) | Initiate a planned or unplanned failover for Azure SQL Database using PowerShell |
| 161 | [Initiate a planned or unplanned failover for Azure SQL Database with Transact-SQL](sql-database-geo-replication-failover-transact-sql.md) | Initiate a planned or unplanned failover for Azure SQL Database using Transact-SQL |
| 162 | [Overview: SQL Database Active Geo-Replication](sql-database-geo-replication-overview.md) | Active Geo-Replication enables you to setup 4 replicas of your database in any of the Azure datacenters. |
| 163 | [Configure Geo-Replication for Azure SQL Database with the Azure portal](sql-database-geo-replication-portal.md) | Configure Geo-Replication for Azure SQL Database using the Azure portal |
| 164 | [Configure Geo-Replication for Azure SQL Database with PowerShell](sql-database-geo-replication-powershell.md) | Configure Active Geo-replication for Azure SQL Database using PowerShell |
| 165 | [How to manage Azure SQL Database security after disaster recovery](sql-database-geo-replication-security-config.md) | This topic explains security considerations for managing security after a database restore or a failover. |
| 166 | [Configure Geo-Replication for Azure SQL Database with Transact-SQL](sql-database-geo-replication-transact-sql.md) | Configure Geo-Replication for Azure SQL Database using Transact-SQL |
| 167 | [Geo-Restore an Azure SQL Database from a geo-redundant backup using the Azure Portal](sql-database-geo-restore-portal.md) | Geo-Restore an Azure SQL Database from a geo-redundant backup (Azure Portal). |
| 168 | [Restore an Azure SQL Database from a geo-redundant backup by using PowerShell](sql-database-geo-restore-powershell.md) | Restore an Azure SQL Database into a new server from a geo-redundant backup |



## Upgrade

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 169 | [Improved query performance with compatibility Level 130 in Azure SQL Database](sql-database-compatibility-level-query-performance-130.md) | Steps and tools for determining which compatibility level is best for your database on Azure SQL Database or Microsoft SQL Server |
| 170 | [Managing rolling upgrades of cloud applications using SQL Database Active Geo-Replication](sql-database-manage-application-rolling-upgrade.md) | Learn how to use Azure SQL Database geo-replication to support online upgrades of your cloud application. |
| 171 | [Upgrade to Azure SQL Database V12 using the Azure portal](sql-database-upgrade-server-portal.md) | Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases, and how to upgrade a V11 server migrating its databases directly into an elastic database pool using the Azure portal. |
| 172 | [Upgrade to Azure SQL Database V12 using PowerShell](sql-database-upgrade-server-powershell.md) | Explains how to upgrade to Azure SQL Database V12 including how to upgrade Web and Business databases, and how to upgrade a V11 server migrating its databases directly into an elastic database pool using PowerShell. |
| 173 | [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md) | Describes the preparations and limitations involved in upgrading to version V12 of Azure SQL Database. |
| 174 | [What's new in SQL Database V12](sql-database-v12-whats-new.md) | Describes why business systems that are using Azure SQL Database in the cloud will benefit by upgrading to version V12 now. |
| 175 | [Web and Business Edition sunset FAQ](sql-database-web-business-sunset-faq.md) | Find out when the Azure SQL Web and Business databases will be retired and learn about the features and functionality of the new service tiers. |



## Tools

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 176 | [Manage Azure SQL Database with PowerShell](sql-database-command-line-tools.md) | Azure SQL Database management with PowerShell. |
| 177 | [SQL Database tutorial: Connect Excel to an Azure SQL database and create a report](sql-database-connect-excel.md) | Learn how to connect Microsoft Excel to Azure SQL database in the cloud. Import data into Excel for reporting and data exploration. |
| 178 | [Create a SQL database and perform common database setup tasks with PowerShell cmdlets](sql-database-get-started-powershell.md) | Learn now to create a SQL database with PowerShell. Common database setup tasks can be managed through PowerShell cmdlets. |
| 179 | [Getting Started with Azure SQL Data Sync (Preview)](sql-database-get-started-sql-data-sync.md) | This tutorial helps you get started with the Azure SQL Data Sync (Preview). |
| 180 | [Managing Azure SQL Database using SQL Server Management Studio](sql-database-manage-azure-ssms.md) | Learn how to use SQL Server Management Studio to manage SQL Database servers and databases. |
| 181 | [Managing Azure SQL Databases using the Azure portal](sql-database-manage-portal.md) | Learn how to use the Azure Portal to manage a relational database in the cloud using the Azure Portal. |
| 182 | [Change the service tier and performance level (pricing tier) of a SQL database with PowerShell](sql-database-scale-up-powershell.md) | Change the service tier and performance level of an Azure SQL database shows how to scale your SQL database up or down with PowerShell. Changing the pricing tier of an Azure SQL database with PowerShell. |
| 183 | [Use SQL Server Management Studio in Azure RemoteApp to connect to SQL Database](sql-database-ssms-remoteapp.md) | Use this tutorial to learn how to use SQL Server Management Studio in Azure RemoteApp for security and performance when connecting to SQL Database |



## Reference

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 184 | [Connection libraries for SQL Database and SQL Server](sql-database-libraries.md) | Lists the minimum version number for each driver that client programs can use to connect to Azure SQL Database or to Microsoft SQL Server. A link is provided for version information about drivers that are released by the community rather than by Microsoft. |
| 185 | [Azure SQL Database resource limits](sql-database-resource-limits.md) | This page describes some common resource limits for Azure SQL Database. |
| 186 | [Azure SQL Database Transact-SQL differences](sql-database-transact-sql-information.md) | Transact-SQL statements that are less than fully supported in Azure SQL Database |



## Miscellaneous

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 187 | [Copy an Azure SQL database using PowerShell](sql-database-copy-powershell.md) | Create copy of an Azure SQL database using PowerShell |
| 188 | [Copy an Azure SQL database using Transact-SQL](sql-database-copy-transact-sql.md) | Create copy of an Azure SQL database using Transact-SQL |
| 189 | [Azure SQL Database General Limitations and Guidelines](sql-database-general-limitations.md) | This page describes some general limitations for Azure SQL Database as well as areas of interoperability and support. |
| 190 | [SQL Database pricing tier recommendations](sql-database-service-tier-advisor.md) | When changing pricing tiers in the Azure portal, pricing tier recommendations are provided that recommend the tier that is best suited for running an existing Azure SQL Database’s workload. Pricing tiers describe the service tier and performance level of a SQL database. |


&nbsp;

<hr/>

<a name="extras_append"></a>

## Extras

<a name="extra_related_articles"></a>

### Related articles from other Azure services

- [Back up your Azure App Services app in Azure](../app-service-web/web-sites-backup.md)

<a name="extra_documentation_tools"></a>

### Documentation tools

- [Updates announced for Azure SQL Database](http://azure.microsoft.com/updates/?service=sql-database)

- [Search all the documentation types of Microsoft Azure, with filters](http://azure.microsoft.com/search/documentation/)

<a name="extra_learning_path_graphics"></a>

### Learning path graphics

- [Learning Path graphics for all Microsoft Azure services](http://azure.microsoft.com/documentation/learning-paths/)

- [Learning Path: Learn Azure SQL Database](http://azure.microsoft.com/documentation/learning-paths/sql-database-training-learn-sql-database/)

- [Learning Path: SQL Database elastic scale](http://azure.microsoft.com/documentation/learning-paths/sql-database-elastic-scale/)


<!--
AzIxAA.ExtraAppend.sql-database.txt
C:\_MainW\VS15\AzureIndexAllArticles\AzureIndexAllArticles\In-Out\In\

This bullet link is improperly disallowed by publishing automation due to presence of string 'docuXXmentation/arXXticles':
- [Search SQL Database documentation, with filters](http://azure.microsoft.com/docuXXmentation/arXXticles/?service=sql-database)
-->


