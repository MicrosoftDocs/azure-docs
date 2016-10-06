<properties
	pageTitle="All topics for SQL Data Warehouse service | Microsoft Azure"
	description="Table of all topics for the Azure service named SQL Data Warehouse that exist on http://azure.microsoft.com/documentation/articles/, Title and description."
	services="sql-data-warehouse"
	documentationCenter=""
	authors="barbkess"
	manager="jhubbard"
	editor=""/>

<tags
	ms.service="sql-data-warehouse"
	ms.workload="sql-data-warehouse"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/21/2016"
	ms.author="barbkess"/>


# All topics for Azure SQL Data Warehouse service

This topic lists every topic that applies directly to the **SQL Data Warehouse** service of Azure. You can search this webpage for keywords by using **Ctrl+F**, to find the topics of current interest.



## Updated articles

This section lists articles which were updated recently, where the update was big or significant. For each updated article, a rough snippet of the added markdown text is displayed. The articles were updated within the date range of **2016-07-26** to **2016-08-21**.

| &nbsp; | Article | Updated text, snippet |
| --: | :-- | :-- |
| 1 | [Concurrency and workload management in SQL Data Warehouse](sql-data-warehouse-develop-concurrency.md) | ** Queries which honor concurrency limits** Most queries are governed by resource classes. These queries must fit inside both the concurrent query and concurrency slot thresholds. An end user cannot choose to exclude a query from the concurrency slot model. To reiterate, the following statements do **honor** resource classes: / INSERT-SELECT / UPDATE / DELETE / SELECT (when querying user tables) / ALTER INDEX REBUILD / ALTER INDEX REORGANIZE / ALTER TABLE REBUILD / CREATE INDEX / CREATE CLUSTERED COLUMNSTORE INDEX / CREATE TABLE AS SELECT (CTAS) / Data loading / Data movement operations conducted by the Data Movement Service (DMS) ** Query exceptions to concurrency limits**  |
| 2 | [Migration to Premium Storage Details](sql-data-warehouse-migrate-to-premium-storage.md) | With the change to Premium Storage, we have also increased the number of database blob files in the underlying architecture of your Data Warehouse.  If you encounter any performance issues, we recommend that you rebuild your Clustered Columnstore Indexes using the script below.  This will force some of your existing data to the additional blobs.  If you take no action, the data will naturally redistribute over time as you load more data into your Data Warehouse tables. **Pre-requisites:** 1.	Data Warehouse should run with 1,000 DWUs or higher (see  scale compute power   ) 2.	User executing the script should be in the  mediumrc role    or higher 	1.	To add a user to this role, execute the following: 		1.	````EXEC sp_addrolemember 'xlargerc', 'MyUser'```` ````sql /------------------------------------------------------------------------------ /- Step 1: Create Table to control Index Rebuild /- Run as user in mediumrc or higher /------------------------------------------------------------ |





## Get started

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 3 | [Authentication to Azure SQL Data Warehouse](sql-data-warehouse-authentication.md) | Azure Active Directory (AAD) and SQL Server authentication to Azure SQL Data Warehouse. |
| 4 | [Best practices for Azure SQL Data Warehouse](sql-data-warehouse-best-practices.md) | Recommendations and best practices you should know as you develop solutions for Azure SQL Data Warehouse. These will help you be successful. |
| 5 | [Drivers for Azure SQL Data Warehouse](sql-data-warehouse-connection-strings.md) | Connection strings and drivers for SQL Data Warehouse |
| 6 | [Connect to Azure SQL Data Warehouse](sql-data-warehouse-connect-overview.md) | Connection overview for connecting to Azure SQL Data Warehouse |
| 7 | [Analyze data with Azure Machine Learning](sql-data-warehouse-get-started-analyze-with-azure-machine-learning.md) | Use Azure Machine Learning to build a predictive machine learning model based on data stored in Azure SQL Data Warehouse. |
| 8 | [Query Azure SQL Data Warehouse (sqlcmd)](sql-data-warehouse-get-started-connect-sqlcmd.md) | Querying Azure SQL Data Warehouse with the sqlcmd Command-line Utility. |
| 9 | [Create a SQL Data Warehouse database by using Transact-SQL (TSQL)](sql-data-warehouse-get-started-create-database-tsql.md) | Learn how to create an Azure SQL Data Warehouse with TSQL |
| 10 | [How to create a support ticket for SQL Data Warehouse](sql-data-warehouse-get-started-create-support-ticket.md) | How to create a support ticket in Azure SQL Data Warehouse. |
| 11 | [Load Data with Azure Data Factory](sql-data-warehouse-get-started-load-with-azure-data-factory.md) | Learn to load data with Azure Data Factory |
| 12 | [Load data with PolyBase in SQL Data Warehouse](sql-data-warehouse-get-started-load-with-polybase.md) | Learn what PolyBase is and how to use it for data warehousing scenarios. |
| 13 | [Create an Azure SQL Data Warehouse](sql-data-warehouse-get-started-provision.md) | Learn how to create an Azure SQL Data Warehouse in the Azure portal |
| 14 | [Create SQL Data Warehouse using PowerShell](sql-data-warehouse-get-started-provision-powershell.md) | Create SQL Data Warehouse by using PowerShell |
| 15 | [Visualize data with Power BI](sql-data-warehouse-get-started-visualize-with-power-bi.md) | Visualize SQL Data Warehouse data with Power BI |
| 16 | [Query Azure SQL Data Warehouse (Visual Studio)](sql-data-warehouse-query-visual-studio.md) | Query SQL Data Warehouse with Visual Studio. |



## Develop

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 17 | [Optimizing transactions for SQL Data Warehouse](sql-data-warehouse-develop-best-practices-transactions.md) | Best Practice guidance on writing efficient transaction updates in Azure SQL Data Warehouse |
| 18 | [Concurrency and workload management in SQL Data Warehouse](sql-data-warehouse-develop-concurrency.md) | Understand concurrency and workload management in Azure SQL Data Warehouse for developing solutions. |
| 19 | [Create Table As Select (CTAS) in SQL Data Warehouse](sql-data-warehouse-develop-ctas.md) | Tips for coding with the create table as select (CTAS) statement in Azure SQL Data Warehouse for developing solutions. |
| 20 | [Dynamic SQL in SQL Data Warehouse](sql-data-warehouse-develop-dynamic-sql.md) | Tips for using dynamic SQL in Azure SQL Data Warehouse for developing solutions. |
| 21 | [Group by options in SQL Data Warehouse](sql-data-warehouse-develop-group-by-options.md) | Tips for implementing group by options in Azure SQL Data Warehouse for developing solutions. |
| 22 | [Use labels to instrument queries in SQL Data Warehouse](sql-data-warehouse-develop-label.md) | Tips for using labels to instrument queries in Azure SQL Data Warehouse for developing solutions. |
| 23 | [Loops in SQL Data Warehouse](sql-data-warehouse-develop-loops.md) | Tips for Transact-SQL loops and replacing cursors in Azure SQL Data Warehouse for developing solutions. |
| 24 | [Stored procedures in SQL Data Warehouse](sql-data-warehouse-develop-stored-procedures.md) | Tips for implementing stored procedures in Azure SQL Data Warehouse for developing solutions. |
| 25 | [Transactions in SQL Data Warehouse](sql-data-warehouse-develop-transactions.md) | Tips for implementing transactions in Azure SQL Data Warehouse for developing solutions. |
| 26 | [User-defined schemas in SQL Data Warehouse](sql-data-warehouse-develop-user-defined-schemas.md) | Tips for using Transact-SQL schemas in Azure SQL Data Warehouse for developing solutions. |
| 27 | [Assign variables in SQL Data Warehouse](sql-data-warehouse-develop-variable-assignment.md) | Tips for assigning Transact-SQL variables in Azure SQL Data Warehouse for developing solutions. |
| 28 | [Views in SQL Data Warehouse](sql-data-warehouse-develop-views.md) | Tips for using Transact-SQL views in Azure SQL Data Warehouse for developing solutions. |
| 29 | [Design decisions and coding techniques for SQL Data Warehouse](sql-data-warehouse-overview-develop.md) | Development concepts, design decisions, recommendations and coding techniques for SQL Data Warehouse. |



## Manage

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 30 | [Manage compute power in Azure SQL Data Warehouse (Overview)](sql-data-warehouse-manage-compute-overview.md) | Performance scale out capabilities in Azure SQL Data Warehouse. Scale out by adjusting DWUs or pause and resume compute resources to save costs. |
| 31 | [Manage compute power in Azure SQL Data Warehouse (Azure portal)](sql-data-warehouse-manage-compute-portal.md) | Azure portal tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 32 | [Manage compute power in Azure SQL Data Warehouse (PowerShell)](sql-data-warehouse-manage-compute-powershell.md) | PowerShell tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 33 | [Manage compute power in Azure SQL Data Warehouse (REST)](sql-data-warehouse-manage-compute-rest-api.md) | PowerShell tasks to manage compute power. Scale compute resources by adjusting DWUs. Or, pause and resume compute resources to save costs. |
| 34 | [Manage compute power in Azure SQL Data Warehouse (T-SQL)](sql-data-warehouse-manage-compute-tsql.md) | Transact-SQL (T-SQL) tasks to scale-out performance by adjusting DWUs. Save costs by scaling back during non-peak times. |
| 35 | [Monitor your workload using DMVs](sql-data-warehouse-manage-monitor.md) | Learn how to monitor your workload using DMVs. |
| 36 | [Manage databases in Azure SQL Data Warehouse](sql-data-warehouse-overview-manage.md) | Overview of managing SQL Data Warehouse databases. Includes management tools, DWUs and scale-out performance, troubleshooting query performance, establishing good security policies, and restoring a database from data corruption or from a regional outage. |
| 37 | [Monitor user queries in Azure SQL Data Warehouse](sql-data-warehouse-overview-manage-user-queries.md) | Overview of the considerations, best practices, and tasks for monitoring user queries in Azure SQL Data Warehouse |
| 38 | [Restore an Azure SQL Data Warehouse (Overview)](sql-data-warehouse-restore-database-overview.md) | Overview of the database restore options for recovering a database in Azure SQL Data Warehouse. |
| 39 | [Restore an Azure SQL Data Warehouse (Portal)](sql-data-warehouse-restore-database-portal.md) | Azure portal tasks for restoring an Azure SQL Data Warehouse. |
| 40 | [Restore an Azure SQL Data Warehouse (PowerShell)](sql-data-warehouse-restore-database-powershell.md) | PowerShell tasks for restoring an Azure SQL Data Warehouse. |
| 41 | [Restore an Azure SQL Data Warehouse (REST API)](sql-data-warehouse-restore-database-rest-api.md) | REST API tasks for restoring an Azure SQL Data Warehouse. |



## Tables and indexes

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 42 | [Data types for tables in SQL Data Warehouse](sql-data-warehouse-tables-data-types.md) | Getting started with data types for Azure SQL Data Warehouse tables. |
| 43 | [Distributing tables in SQL Data Warehouse](sql-data-warehouse-tables-distribute.md) | Getting started with distributing tables in Azure SQL Data Warehouse. |
| 44 | [Indexing tables in SQL Data Warehouse](sql-data-warehouse-tables-index.md) | Getting started with table indexing in Azure SQL Data Warehouse. |
| 45 | [Overview of tables in SQL Data Warehouse](sql-data-warehouse-tables-overview.md) | Getting started with Azure SQL Data Warehouse Tables. |
| 46 | [Partitioning tables in SQL Data Warehouse](sql-data-warehouse-tables-partition.md) | Getting started with table partitioning in Azure SQL Data Warehouse. |
| 47 | [Managing statistics on tables in SQL Data Warehouse](sql-data-warehouse-tables-statistics.md) | Getting started with statistics on tables in Azure SQL Data Warehouse. |
| 48 | [Temporary tables in SQL Data Warehouse](sql-data-warehouse-tables-temporary.md) | Getting started with temporary tables in Azure SQL Data Warehouse. |



## Integrate

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 49 | [Use Azure Data Factory with SQL Data Warehouse](sql-data-warehouse-integrate-azure-data-factory.md) | Tips for using Azure Data Factory (ADF) with Azure SQL Data Warehouse for developing solutions. |
| 50 | [Use Azure Machine Learning with SQL Data Warehouse](sql-data-warehouse-integrate-azure-machine-learning.md) | Tutorial for using Azure Machine Learning with Azure SQL Data Warehouse for developing solutions. |
| 51 | [Use Azure Stream Analytics with SQL Data Warehouse](sql-data-warehouse-integrate-azure-stream-analytics.md) | Tips for using Azure Stream Analytics with Azure SQL Data Warehouse for developing solutions. |
| 52 | [Use Power BI with SQL Data Warehouse](sql-data-warehouse-integrate-power-bi.md) | Tips for using Power BI with Azure SQL Data Warehouse for developing solutions. |
| 53 | [Leverage other services with SQL Data Warehouse](sql-data-warehouse-overview-integrate.md) | Tools and partners with solutions that integrate with SQL Data Warehouse.  |



## Load

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 54 | [Load data from Azure blob storage into Azure SQL Data Warehouse (Azure Data Factory)](sql-data-warehouse-load-from-azure-blob-storage-with-data-factory.md) | Learn to load data with Azure Data Factory |
| 55 | [Load data from Azure blob storage into SQL Data Warehouse (PolyBase)](sql-data-warehouse-load-from-azure-blob-storage-with-polybase.md) | Learn how to use PolyBase to load data from Azure blob storage into SQL Data Warehouse. Load a few tables from public data into the Contoso Retail Data Warehouse schema. |
| 56 | [Load data from SQL Server into Azure SQL Data Warehouse (AZCopy)](sql-data-warehouse-load-from-sql-server-with-azcopy.md) | Uses bcp to export data from SQL Server to flat files, AZCopy to import data to Azure blob storage, and PolyBase to ingest the data into Azure SQL Data Warehouse. |
| 57 | [Load data from SQL Server into Azure SQL Data Warehouse (flat files)](sql-data-warehouse-load-from-sql-server-with-bcp.md) | For a small data size, uses bcp to export data from SQL Server to flat files and import the data directly into Azure SQL Data Warehouse. |
| 58 | [Load data from SQL Server into Azure SQL Data Warehouse (SSIS)](sql-data-warehouse-load-from-sql-server-with-integration-services.md) | Shows you how to create a SQL Server Integration Services (SSIS) package to move data from a wide variety of data sources to SQL Data Warehouse. |
| 59 | [Load data with PolyBase in SQL Data Warehouse](sql-data-warehouse-load-from-sql-server-with-polybase.md) | Uses bcp to export data from SQL Server to flat files, AZCopy to import data to Azure blob storage, and PolyBase to ingest the data into Azure SQL Data Warehouse. |
| 60 | [Guide for using PolyBase in SQL Data Warehouse](sql-data-warehouse-load-polybase-guide.md) | Guidelines and recommendations for using PolyBase in SQL Data Warehouse scenarios. |
| 61 | [Load sample data into SQL Data Warehouse](sql-data-warehouse-load-sample-databases.md) | Load sample data into SQL Data Warehouse |
| 62 | [Load data with bcp](sql-data-warehouse-load-with-bcp.md) | Learn what bcp is and how to use it for data warehousing scenarios. |
| 63 | [Load data into Azure SQL Data Warehouse](sql-data-warehouse-overview-load.md) | Learn the common scenarios for data loading into SQL Data Warehouse. These include using PolyBase, Azure blob storage, flat files, and disk shipping. You can also use third-party tools. |



## Migrate

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 64 | [Migrate your SQL code to SQL Data Warehouse](sql-data-warehouse-migrate-code.md) | Tips for migrating your SQL code to Azure SQL Data Warehouse for developing solutions. |
| 65 | [Migrate Your Data](sql-data-warehouse-migrate-data.md) | Tips for migrating your data to Azure SQL Data Warehouse for developing solutions. |
| 66 | [Data Warehouse Migration Utility (Preview)](sql-data-warehouse-migrate-migration-utility.md) | Migrate to SQL Data Warehouse. |
| 67 | [Migrate your schema to SQL Data Warehouse](sql-data-warehouse-migrate-schema.md) | Tips for migrating your schema to Azure SQL Data Warehouse for developing solutions. |
| 68 | [Migrate your solution to SQL Data Warehouse](sql-data-warehouse-overview-migrate.md) | Migration guidance for bringing your solution to Azure SQL Data Warehouse platform. |



## Partners

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 69 | [SQL Data Warehouse business intelligence partners](sql-data-warehouse-partner-business-intelligence.md) | Lists of third-party business intelligence partners with solutions that support SQL Data Warehouse. |
| 70 | [SQL Data Warehouse data integration partners](sql-data-warehouse-partner-data-integration.md) | Lists of third-party partners with data integration solutions that support Azure SQL Data Warehouse. |
| 71 | [SQL Data Warehouse data management partners](sql-data-warehouse-partner-data-management.md) | Lists of third-party data management partners with solutions that support SQL Data Warehouse. |



## Reference

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 72 | [Reference topics for SQL Data Warehouse](sql-data-warehouse-overview-reference.md) | Reference content links for SQL Data Warehouse. |
| 73 | [PowerShell cmdlets and REST APIs for SQL Data Warehouse](sql-data-warehouse-reference-powershell-cmdlets.md) | Find the top PowerShell cmdlets for Azure SQL Data Warehouse including how to pause and resume a database. |
| 74 | [Language elements](sql-data-warehouse-reference-tsql-language-elements.md) | List of links to reference content for the Transact-SQL language elements used for SQL Data Warehouse. |
| 75 | [Transact-SQL topics](sql-data-warehouse-reference-tsql-statements.md) | Links to reference content for the Transact-SQL topics used by SQL Data Warehouse. |
| 76 | [System views](sql-data-warehouse-reference-tsql-system-views.md) | Links to system views content for SQL Data Warehouse. |



## Security

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 77 | [SQL Data Warehouse -  Downlevel clients support for auditing and Dynamic Data Masking](sql-data-warehouse-auditing-downlevel-clients.md) | Learn about SQL Data Warehouse downlevel clients support for data auditing |
| 78 | [Auditing in Azure SQL Data Warehouse](sql-data-warehouse-auditing-overview.md) | Get started with auditing in Azure SQL Data Warehouse |
| 79 | [Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse](sql-data-warehouse-encryption-tde.md) | Get started with Transparent Data Encryption (TDE) in SQL Data Warehouse |
| 80 | [Get started with Transparent Data Encryption (TDE)](sql-data-warehouse-encryption-tde-tsql.md) | Get started with SQL Data Warehouse Transparent Data Encryption (TDE) TSQL |
| 81 | [Secure a database in SQL Data Warehouse](sql-data-warehouse-overview-manage-security.md) | Tips for securing a database in Azure SQL Data Warehouse for developing solutions. |



## Miscellaneous

| &nbsp; | Title | Description |
| --: | :-- | :-- |
| 82 | [Install Visual Studio 2015 and SSDT for SQL Data Warehouse](sql-data-warehouse-install-visual-studio.md) | Install Visual Studio and SQL Server Development Tools (SSDT) for Azure SQL Data Warehouse |
| 83 | [Migration to Premium Storage Details](sql-data-warehouse-migrate-to-premium-storage.md) | Instructions for migrating an existing SQL Data Warehouse to premium storage |
| 84 | [Get started with threat detection](sql-data-warehouse-security-threat-detection.md) | How to get started with Threat Detection |
| 85 | [SQL Data Warehouse capacity limits](sql-data-warehouse-service-capacity-limits.md) | Maximum values for connections, databases, tables and queries for SQL Data Warehouse. |
| 86 | [Troubleshooting Azure SQL Data Warehouse](sql-data-warehouse-troubleshoot.md) | Troubleshooting Azure SQL Data Warehouse. |

