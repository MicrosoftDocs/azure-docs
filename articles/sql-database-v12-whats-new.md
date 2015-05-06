<properties 
	pageTitle="What's new in SQL Database V12" 
	description="Describes the latest features that have been added to Azure SQL Database for V12, but only up to April 2015." 
	services="sql-database" 
	documentationCenter="" 
	authors="MightyPen" 
	manager="jeffreyg" 
	editor=""/>


<tags 
	ms.service="sql-database" 
	ms.workload="data-management" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="05/05/2015" 
	ms.author="genemi"/>


# What's new in SQL Database V12


Azure SQL Database version V12 ([at preview in some regions](sql-database-v12-whats-new.md#V12AzureSqlDbPreviewGaTable)) now provides nearly complete compatibility with the Microsoft SQL Server engine. The recent enhancements help to streamline SQL Server application migrations to SQL Database, and they help your system robustly process heavier database workloads.


[Sign up](https://portal.azure.com) for SQL Database to then [get started](sql-database-get-started.md) with this new generation on Microsoft Azure. You first need a subscription to Microsoft Azure. You can sign up for a [free Azure trial](http://azure.microsoft.com/pricing/free-trial) and review [pricing](http://azure.microsoft.com/pricing/details/sql-database) information.


Your path to planning and upgrading your earlier version databases to V12 starts at [Plan and prepare to upgrade to SQL Database V12](sql-database-v12-plan-prepare-upgrade.md).


## Highlights


- **Azure preview portal** is [available](http://portal.azure.com/) to create SQL Database databases and servers at version V12, or optionally at the earlier version. In the Azure preview portal you specify your SQL Database database, and then proceed to specify a SQL Database server to host it.
 - As of April 2015, the [older Azure portal](http://manage.windowsazure.com/) is still supported also.


- **Choose a version** of SQL Database server when you use the Azure preview portal to create a new database. The default is V12, but you can choose the earlier version of the SQL Database server.


- **Security** enjoys the new feature of [users in contained databases](sql-database-v12-whats-new.md#UsersInContainedDatabases). Two other features are [row-level security](sql-database-v12-whats-new.md#RowLevelSecurity) and [dynamic data masking](sql-database-v12-whats-new.md#DynamicDataMasking), although these are still at preview and are not yet at GA.


- **Easier management** of large databases to support heavier workloads with parallel queries (Premium only), [table partitioning](http://msdn.microsoft.com/library/ms187802.aspx), [online indexing](http://msdn.microsoft.com/library/ms188388.aspx), worry-free large index rebuilds with 2GB size limit removed, and more options on the [ALTER DATABASE](http://msdn.microsoft.com/library/bb522682.aspx) command.


- **Support for key programmability functions** to drive more robust application design with [CLR integration](http://msdn.microsoft.com/library/ms189524.aspx), Transact-SQL [window functions](http://msdn.microsoft.com/library/ms189461.aspx), [XML indexes](http://msdn.microsoft.com/library/bb934097.aspx), and [change tracking](http://msdn.microsoft.com/library/bb933875.aspx) for data.


- **Breakthrough performance** with support for in-memory [columnstore index](http://msdn.microsoft.com/library/gg492153.aspx) queries (Premium tier only) for data mart and smaller analytic workloads.


- **Monitoring and troubleshooting** are improved with visibility into over 100 new table views in an expanded set of Database Management Views ([DMVs](http://msdn.microsoft.com/library/ms188754.aspx))


- **New S3 performance level in the Standard tier:** offers more [pricing](sql-database-upgrade-new-service-tiers.md) flexibility between Standard and Premium. S3 will deliver more DTUs (database throughput units) and all the features available in the Standard tier.


## V12 enhancements: Expanded database management


| Feature | Description |
| :--- | :--- |
| . | ***April 2015:*** |
| TDE | Transparent Data Encryption (preview) helps protect against malicious activity by performing real-time encryption and decryption of the database, associated backups, and transaction log files at rest. TDE does not require changes to your application.<br/><br/>For details see:<br/>- [Transparent Data Encryption with Azure SQL Database](http://msdn.microsoft.com/library/dn948096.aspx) - step-by-step instructions.<br/>- [Transparent Data Encryption (TDE)](http://msdn.microsoft.com/library/bb934049.aspx) - general description. |
| Transact-SQL certificates, keys, and cryptographic functions | Certificates, symmetric keys, and asymmetric keys can now be created in Azure SQL Database V12. Most cryptographic functions are now supported.<br/><br/>For more information, see:<br/>- [CREATE CERTIFICATE (Transact-SQL)](http://msdn.microsoft.com/library/ms187798.aspx)<br/>- [CREATE SYMMETRIC KEY (Transact-SQL)](http://msdn.microsoft.com/library/ms188357.aspx)<br/>- [CREATE ASYMMETRIC KEY (Transact-SQL)](http://msdn.microsoft.com/library/ms174430.aspx)<br/>- [Cryptographic Functions (Transact-SQL)](http://msdn.microsoft.com/library/ms173744.aspx) |
| SQL Database elastic pool | Simple tasks become complicated when you scale to thousands of databases, and that's the downside of explosive growth. SaaS developers spend countless hours writing complex logic to handle schema changes and other administrative operations as the business grows.<br/><br/>With [elastic databases](sql-database-elastic-pool.md), life becomes easier. You take a script, submit it as a job, and Azure SQL Database does the rest. |
| Pricing tier recommendations and the STA | When moving your database from Web or Business editions to one of the new Basic, Standard, or Premium service tiers, you can now get pricing tier recommendations directly from the Azure preview portal.<br/><br/>The Azure SQL Database service analyzes the performance and feature requirements for existing databases. The [Service Tier Advisor (STA)](sql-database-service-tier-advisor.md) reads the performance data to recommend the optimal service tier for your database. |
| DMV permissions | For several dynamic management views (DMVs), their execution previously required the VIEW SERVER STATE permission. Now in Azure SQL Database V12, in many cases the DMVs can be executed by the SQL Database administrator account in databases that are at the Basic or Standard service tier.<br/><br/>On the Premium tier, access to the DMVs can be granted to additional users by using the VIEW DATABASE STATE permission in the database.<br/><br/>For details see the Permissions section for a given individual [DMV](http://msdn.microsoft.com/library/ms188754.aspx). |
| DBCC SQLPERF | The [DBCC SQLPERF](http://msdn.microsoft.com/library/ms189768.aspx) command is now available in Azure SQL Database V12. The *reset wait* and *latch statistics* options are not supported on SQL Database V12. |
| . | ***December 2014:*** |
| <a name="UsersInContainedDatabases" id="UsersInContainedDatabases"></a>Users contained in databases | You can now create users in your database without having a corresponding login in the master database. These are called *contained users*. This makes it much simpler to move your database to another server. The connection code in your client applications is the same whether you use contained database users or not.<br/><br/>Use of this feature is an excellent way to benefit from higher guaranteed service level agreements.<br/><br/>We generally encourage you to consider using this feature. However, you might have specific scenarios that make the traditional *login+user* pair the better choice for you at this time.<br/><br/>For more information, see:<br/>- [Azure SQL Database Security Guidelines and Limitations](http://msdn.microsoft.com/library/azure/ff394108.aspx)<br/>- [Managing Databases and Logins in Azure SQL Database](http://msdn.microsoft.com/library/azure/ee336235.aspx)<br/>- [Contained Databases](http://msdn.microsoft.com/library/azure/ff929071.aspx) |
| Table partitioning | Previous limitations on [table partitioning](http://msdn.microsoft.com/library/ms190787.aspx) are eliminated. |
| Larger transactions | With V12 you are no longer limited to a maximum of 2 GB of data modifications in a single transaction. <br/><br/> One benefit is that rebuilding a large index is no longer limited by 2 GB transaction size limit. For general information, see [Azure SQL Database Resource Limits](http://msdn.microsoft.com/library/azure/dn338081.aspx). |
| Online index build and rebuild | Before V12, Azure SQL Database generally supported the (ONLINE=ON) clause of the [ALTER INDEX](http://msdn.microsoft.com/library/ms188388.aspx) command, but this was not supported for indexes on a BLOB type column. Now V12 does support (ONLINE=ON) even for indexes on BLOB columns.<br/><br/> The ONLINE feature enables queries to benefit from an index even while the index is being rebuilt. |
| CHECKPOINT support | With V12 you can issue the Transact-SQL [CHECKPOINT](http://msdn.microsoft.com/library/ms188748.aspx) command for your database. |
| ALTER TABLE enhancement | Allows many alter column actions to be performed while the table remains available. For more information, see [ALTER TABLE (Transact-SQL)](http://msdn.microsoft.com/library/ms190273.aspx) |
| TRUNCATE TABLE enhancement | Allows truncation of specific partitions. For more information, see [TRUNCATE TABLE (Transact-SQL)](http://msdn.microsoft.com/library/ms177570.aspx). |
| More options on ALTER DATABASE | V12 supports more of the options that are available on the [ALTER DATABASE](http://msdn.microsoft.com/library/ms174269.aspx) command. <br/><br/> For more information, see [Azure SQL Database Transact-SQL Reference](http://msdn.microsoft.com/library/azure/ee336281.aspx). |
| More DBCC commands | Several more [DBCC](http://msdn.microsoft.com/library/ms188796.aspx) commands are now available in V12. For details see [Azure SQL Database Transact-SQL Reference](http://msdn.microsoft.com/library/azure/ee336281.aspx). |


## Programming and application support


| Feature | Description |
| :--- | :--- |
| . | ***April 2015:*** |
| Full-Text Search preview | [Full-Text Search (FTS)](http://msdn.microsoft.com/library/ms142571.aspx) enables you to query character-based columns in ways that are more powerful than the LIKE operator. For example:<br/><br/>- FREETEXT: Searches for phrases that match the *meaning* of your search phrase, even when the exact wording does not match.<br/>- CONTAINS: Searches for cell values that contain your two search terms in close *physical proximity* to each other.<br/><br/>**NOTE:** This feature is at the preview status, and has not yet been announced for general availability for production use. The range of FTS preview functionality is a subset of the FTS range in Microsoft SQL Server. |
| . | ***February 2015:*** |
| <a name="DynamicDataMasking" id="DynamicDataMasking"></a> Dynamic data masking preview | When a rowset is generated from a query, an established data masking policy can replace parts of the data with 'X' characters to overlay and protect sensitive information. After the masking operation completes, the modified rowset is sent to the client.<br/><br/>One example use might be to mask all but the last few digits of a credit card number.<br/><br/>**NOTE:** This feature is at the preview status, and has not yet been announced for general availability for production use.<br/><br/>For detailed information, see [Get started with Azure SQL Database Dynamic Data Masking](sql-database-dynamic-data-masking-get-started.md). |
| . | ***January 2015:*** |
| <a name="RowLevelSecurity" id="RowLevelSecurity"></a> Row-level security (RLS) preview | The new [CREATE SECURITY POLICY](http://msdn.microsoft.com/library/dn765135.aspx) command in Transact-SQL enables you to implement RLS. RLS causes the database server to add conditions which filter out some data rows before a rowset is returned to the caller.<br/><br/>In the industry, RLS is sometimes also called fine-grained access control.<br/><br/>**NOTE:** This feature is at the preview status, and has not yet been announced for general availability for production use.<br/><br/>For a code example and more, see [Row-Level Security Preview](http://msdn.microsoft.com/library/7221fa4e-ca4a-4d5c-9f93-1b8a4af7b9e8.aspx). |
| . | ***December 2014:*** |
| Window functions in Transact-SQL queries | The ANSI window functions are access with the [OVER clause](http://msdn.microsoft.com/library/ms189461.aspx). <br/><br/> Itzik Ben-Gan has an excellent [blog post](http://sqlmag.com/sql-server-2012/how-use-microsoft-sql-server-2012s-window-functions-part-1) that further explains window functions and the OVER clause. |
| .NET CLR integration | The CLR (common language runtime) of the .NET Framework is integrated into V12. <br/><br/> Only SAFE assemblies that are fully compiled to binary code are supported. For details see [CLR Integration Programming Model Restrictions](http://msdn.microsoft.com/library/ms403273.aspx). <br/><br/> You can find information about this feature in the following topics: <br/> * [Introduction to SQL Server CLR Integration](http://msdn.microsoft.com/library/ms254498.aspx) <br/> * [CREATE ASSEMBLY (Transact-SQL)](http://msdn.microsoft.com/library/ms189524.aspx). |
| Change tracking for data | Change tracking for data can now be configured at the database or table level. <br/><br/> For information about change tracking, see [About Change Tracking (SQL Server)](http://msdn.microsoft.com/library/bb933875.aspx). |
| XML indexes | V12 enables you use the Transact-SQL commands [CREATE XML INDEX](http://msdn.microsoft.com/library/bb934097.aspx) and [CREATE SELECTIVE XML INDEX](http://msdn.microsoft.com/library/jj670104.aspx). |
| Table as a heap | V12 enables you to create a table that has no clustered index. <br/><br/> This feature is especially helpful for its support of the Transact-SQL [SELECT...INTO](http://msdn.microsoft.com/library/ms188029.aspx) command which creates a table from a query result. |
| Application roles | For security and permissions control, V12 enables you to issue [GRANT](http://msdn.microsoft.com/library/ms187965.aspx) - [DENY](http://msdn.microsoft.com/library/ms188338.aspx) - [REVOKE](http://msdn.microsoft.com/library/ms187728.aspx) commands against [application roles](http://msdn.microsoft.com/library/ms190998.aspx). |


## Better customer insights


| Feature | Description |
| :--- | :--- |
| . | ***December 2014:*** |
| DMVs (dynamic management views) | Several DMVs are added in V12. For details see [Azure SQL Database Transact-SQL Reference](http://msdn.microsoft.com/library/azure/ee336281.aspx). |
| Change tracking | V12 fully supports change tracking. <br/><br/> For details of this feature see [Enable and Disable Change Tracking (SQL Server)](http://msdn.microsoft.com/library/bb964713.aspx). |
| Columnstore indexes | A columnstore index improves system performance for data warehouses when an indexed column contains repetitions of the same value. The [columnstore index compresses](http://msdn.microsoft.com/library/gg492088.aspx) the duplicate values to reduce the number of physical rows that must be accessed during queries. |


## Performance improvements at the Premium service tier


These performance enhancements apply to the P2 and P3 levels within the Premium service tier.


| Feature | Description |
| :--- | :--- |
| . | ***December 2014:*** |
| Parallel processing for queries | V12 provides a higher degree of parallelism for queries that can benefit from it. |
| Briefer I/O latency | V12 has significantly briefer latency for input/output operations. |
| Increased IOPS | V12 can process a larger quantity of input/output per second (IOPS). |
| Log rate | V12 can log more data changes per second. |


## V12 to become API default beginning August 1, 2015  


| Feature | Description |
| :--- | :--- |
| . | ***August 2015:*** |
| Create server using REST or PowerShell |  When you create a server without specifying a server version, the default version will change from V11 to V12.<br/><br/>This aligns with the [Azure preview portal](http://portal.azure.com). |
| Create database using Transact-SQL, [REST](http://msdn.microsoft.com/library/azure/gg715283.aspx), or [PowerShell](http://msdn.microsoft.com/library/azure/dn806332.aspx) | On V11 servers, when you create a new database without specifying an edition or service objective, the default service objective will be [S0](http://azure.microsoft.com/pricing/details/sql-database/) instead of Web-and-Business. This aligns with V12 servers in the Azure preview portal. |


## Summary of enhancements


V12 elevates our SQL Database close to full feature compatibility with our SQL Server product. V12 focuses on the most popular features, and on programmability support. This makes your development more efficient and more enjoyable.  It is now even easier to move your SQL database applications to the cloud.


And at the Premium tier V12 brings major performance improvements. Some applications will see extreme gains in query speed. Applications with heavy workloads will see reliably robust throughput.


## <a name="V12AzureSqlDbPreviewGaTable"></a>V12 general availability (GA) status per region


> [AZURE.NOTE]
> [Pricing](http://azure.microsoft.com/pricing/details/sql-database/) during the preview has been at a discount. Pricing returns to the GA level for all regions on Tuesday, March 31, 2015.


| Azure region | Current release<br/>status of V12 | Date of promotion<br/>to GA |
| :--- | :--- | :--- |
| South Central US | General Availability (GA) | February 9th, 2015 |
| Central US | General Availability (GA) | February 9th, 2015 |
| North Central US | General Availability (GA) | February 9th, 2015 |
| West US | General Availability (GA) | February 9th, 2015 |
| East US | General Availability (GA) | February 9th, 2015 |
| East US 2 | General Availability (GA) | February 9th, 2015 |
| East Asia | General Availability (GA) | February 24th, 2015 |
| Southeast Asia | General Availability (GA) | February 24th, 2015 |
| Japan West | General Availability (GA) | February 24th, 2015 |
| Japan East | General Availability (GA) | February 24th, 2015 |
| North Europe | General Availability (GA) | January 29th, 2015 |
| West Europe | General Availability (GA) | January 29th, 2015 |
| Brazil South | General Availability (GA) | April 21st, 2015 |
| Australia East | Preview | Second quarter 2015, estimated |
| Australia Southeast | Preview | Second quarter 2015, estimated |


For any region that has reached GA, all new subscriptions and their subsequent databases use the V12 service architecture and therefore have access to the latest features. The present article lists the new features brought by V12.


For any region that is in preview and is not yet at GA, you must [activate the option to use V12 databases](sql-database-v12-sign-up.md).


At GA, if you have pre-V12 servers and databases, you can elect to upgrade (or move) your databases to the V12 service architecture. Then you can use the new features for production. V12 databases must be at the basic, standard, or premium [pricing tier](sql-database-upgrade-new-service-tiers.md).


## How to proceed


You can learn how to upgrade your databases from Azure SQL Database V11 to V12 at [Plan and Prepare to Upgrade to Azure SQL Database V12](sql-database-v12-plan-prepare-upgrade.md).


Version numbers like V12 refer to the value returned by the following Transact-SQL statement:<br/>
**SELECT @@version;**


- 11.0.9228.18 *(V11)*
- 12.0.2000.8 *(or a bit higher, V12)*


For the latest pricing details about V12 see [SQL Database Pricing](http://azure.microsoft.com/pricing/details/sql-database/).


## Cautions for the V12 upgrade


There are important things to know about limitations during and after an upgrade of your V11 database to V12. You can read the details at this link to a [midpoint](sql-database-v12-plan-prepare-upgrade.md#limitations) in the *Plan and prepare to upgrade to SQL Database V12* topic.


## Other sources of latest news


This *what's new* topic for Azure SQL Database V12 will be finalized and no longer updated, probably after April 30th 2015. Information about new features and other announcements is shifting to the announcements link that follows:


- [Announcements](http://azure.microsoft.com/updates/?service=sql-database) for Azure SQL Database on our **Service Updates** webpage.
 - You might want to click the **RSS** icon on the webpage, when the Services control is set to *SQL Database*.
- Follow us on Twitter: @SQLSchedCentral.


[V12 general availability (GA) status per region]:#V12AzureSqlDbPreviewGaTable

