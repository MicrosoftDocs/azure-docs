---
title: Getting Started with Temporal Tables in Azure SQL Database | Microsoft Docs
description: Learn how to get started with using Temporal Tables in Azure SQL Database.
services: sql-database
ms.service: sql-database
ms.subservice: development
ms.custom:
ms.devlang: 
ms.topic: conceptual
author: bonova
ms.author: bonova
ms.reviewer: carlrab
manager: craigg
ms.date: 06/26/2019
---
# Getting Started with Temporal Tables in Azure SQL Database

Temporal Tables are a new programmability feature of Azure SQL Database that allows you to track and analyze the full history of changes in your data, without the need for custom coding. Temporal Tables keep data closely related to time context so that stored facts can be interpreted as valid only within the specific period. This property of Temporal Tables allows for efficient time-based analysis and getting insights from data evolution.

## Temporal Scenario

This article illustrates the steps to utilize Temporal Tables in an application scenario. Suppose that you want to track user activity on a new website that is being developed from scratch or on an existing website that you want to extend with user activity analytics. In this simplified example, we assume that the number of visited web pages during a period of time is an indicator that needs to be captured and monitored in the website database that is hosted on Azure SQL Database. The goal of the historical analysis of user activity is to get inputs to redesign website and provide better experience for the visitors.

The database model for this scenario is very simple - user activity metric is represented with a single integer field, **PageVisited**, and is captured along with basic information on the user profile. Additionally, for time-based analysis, you would keep a series of rows for each user, where every row represents the number of pages a particular user visited within a specific period of time.

![Schema](./media/sql-database-temporal-tables/AzureTemporal1.png)

Fortunately, you do not need to put any effort in your app to maintain this activity information. With Temporal Tables, this process is automated - giving you full flexibility during website design and more time to focus on the data analysis itself. The only thing you have to do is to ensure that **WebSiteInfo** table is configured as [temporal system-versioned](https://msdn.microsoft.com/library/dn935015.aspx#Anchor_0). The exact steps to utilize Temporal Tables in this scenario are described below.

## Step 1: Configure tables as temporal
Depending on whether you are starting new development or upgrading existing application, you will either create temporal tables or modify existing ones by adding temporal attributes. In general case, your scenario can be a mix of these two options. Perform these action using [SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx) (SSMS), [SQL Server Data Tools](https://msdn.microsoft.com/library/mt204009.aspx) (SSDT) or any other Transact-SQL development tool.

> [!IMPORTANT]
> It is recommended that you always use the latest version of Management Studio to remain synchronized with updates to Microsoft Azure and SQL Database. [Update SQL Server Management Studio](https://msdn.microsoft.com/library/mt238290.aspx).
> 
> 

### Create new table
Use context menu item “New System-Versioned Table” in SSMS Object Explorer to open the query editor with a temporal table template script and then use “Specify Values for Template Parameters” (Ctrl+Shift+M) to populate the template:

![SSMSNewTable](./media/sql-database-temporal-tables/AzureTemporal2.png)

In SSDT, choose “Temporal Table (System-Versioned)” template when adding new items to the database project. That will open table designer and enable you to easily specify the table layout:

![SSDTNewTable](./media/sql-database-temporal-tables/AzureTemporal3.png)

You can also create temporal table by specifying the Transact-SQL statements directly, as shown in the example below. Note that the mandatory elements of every temporal table are the PERIOD definition and the SYSTEM_VERSIONING clause with a reference to another user table that will store historical row versions:

```
CREATE TABLE WebsiteUserInfo 
(  
    [UserID] int NOT NULL PRIMARY KEY CLUSTERED 
  , [UserName] nvarchar(100) NOT NULL
  , [PagesVisited] int NOT NULL 
  , [ValidFrom] datetime2 (0) GENERATED ALWAYS AS ROW START
  , [ValidTo] datetime2 (0) GENERATED ALWAYS AS ROW END
  , PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo)
 )  
 WITH (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.WebsiteUserInfoHistory));
```

When you create system-versioned temporal table, the accompanying history table with the default configuration is automatically created. The default history table contains a clustered B-tree index on the period columns (end, start) with page compression enabled. This configuration is optimal for the majority of scenarios in which temporal tables are used, especially for [data auditing](https://msdn.microsoft.com/library/mt631669.aspx#Anchor_0). 

In this particular case, we aim to perform time-based trend analysis over a longer data history and with bigger data sets, so the storage choice for the history table is a clustered columnstore index. A clustered columnstore provides very good compression and performance for analytical queries. Temporal Tables give you the flexibility to configure indexes on the current and temporal tables completely independently. 

> [!NOTE]
> Columnstore indexes are available in the Premium tier and in the Standard tier, S3 and above.
>

The following script shows how default index on history table can be changed to the clustered columnstore:

```
CREATE CLUSTERED COLUMNSTORE INDEX IX_WebsiteUserInfoHistory
ON dbo.WebsiteUserInfoHistory
WITH (DROP_EXISTING = ON); 
```

Temporal Tables are represented in the Object Explorer with the specific icon for easier identification, while its history table is displayed as a child node.

![AlterTable](./media/sql-database-temporal-tables/AzureTemporal4.png)

### Alter existing table to temporal
Let’s cover the alternative scenario in which the WebsiteUserInfo table already exists, but was not designed to keep a history of changes. In this case, you can simply extend the existing table to become temporal, as shown in the following example:

```
ALTER TABLE WebsiteUserInfo 
ADD 
    ValidFrom datetime2 (0) GENERATED ALWAYS AS ROW START HIDDEN  
        constraint DF_ValidFrom DEFAULT DATEADD(SECOND, -1, SYSUTCDATETIME())
    , ValidTo datetime2 (0)  GENERATED ALWAYS AS ROW END HIDDEN   
        constraint DF_ValidTo DEFAULT '9999.12.31 23:59:59.99'
    , PERIOD FOR SYSTEM_TIME (ValidFrom, ValidTo); 

ALTER TABLE WebsiteUserInfo  
SET (SYSTEM_VERSIONING = ON (HISTORY_TABLE = dbo.WebsiteUserInfoHistory));
GO

CREATE CLUSTERED COLUMNSTORE INDEX IX_WebsiteUserInfoHistory
ON dbo.WebsiteUserInfoHistory
WITH (DROP_EXISTING = ON); 
```

## Step 2: Run your workload regularly
The main advantage of Temporal Tables is that you do not need to change or adjust your website in any way to perform change tracking. Once created, Temporal Tables transparently persist previous row versions every time you perform modifications on your data. 

In order to leverage automatic change tracking for this particular scenario, let’s just update column **PagesVisited** every time a user ends their session on the website:

```
UPDATE WebsiteUserInfo  SET [PagesVisited] = 5 
WHERE [UserID] = 1;
```

It is important to notice that the update query doesn’t need to know the exact time when the actual operation occurred nor how historical data will be preserved for future analysis. Both aspects are automatically handled by the Azure SQL Database. The following diagram illustrates how history data is being generated on every update.

![TemporalArchitecture](./media/sql-database-temporal-tables/AzureTemporal5.png)

## Step 3: Perform historical data analysis
Now when temporal system-versioning is enabled, historical data analysis is just one query away from you. In this article, we will provide a few examples that address common analysis scenarios - to learn all details, explore various options introduced with the [FOR SYSTEM_TIME](https://msdn.microsoft.com/library/dn935015.aspx#Anchor_3) clause.

To see the top 10 users ordered by the number of visited web pages as of an hour ago, run this query:

```
DECLARE @hourAgo datetime2 = DATEADD(HOUR, -1, SYSUTCDATETIME());
SELECT TOP 10 * FROM dbo.WebsiteUserInfo FOR SYSTEM_TIME AS OF @hourAgo
ORDER BY PagesVisited DESC
```

You can easily modify this query to analyze the site visits as of a day ago, a month ago or at any point in the past you wish.

To perform basic statistical analysis for the previous day, use the following example:

```
DECLARE @twoDaysAgo datetime2 = DATEADD(DAY, -2, SYSUTCDATETIME());
DECLARE @aDayAgo datetime2 = DATEADD(DAY, -1, SYSUTCDATETIME());

SELECT UserID, SUM (PagesVisited) as TotalVisitedPages, AVG (PagesVisited) as AverageVisitedPages,
MAX (PagesVisited) AS MaxVisitedPages, MIN (PagesVisited) AS MinVisitedPages,
STDEV (PagesVisited) as StDevViistedPages
FROM dbo.WebsiteUserInfo 
FOR SYSTEM_TIME BETWEEN @twoDaysAgo AND @aDayAgo
GROUP BY UserId
```

To search for activities of a specific user, within a period of time, use the CONTAINED IN clause:

```
DECLARE @hourAgo datetime2 = DATEADD(HOUR, -1, SYSUTCDATETIME());
DECLARE @twoHoursAgo datetime2 = DATEADD(HOUR, -2, SYSUTCDATETIME());
SELECT * FROM dbo.WebsiteUserInfo 
FOR SYSTEM_TIME CONTAINED IN (@twoHoursAgo, @hourAgo)
WHERE [UserID] = 1;
```

Graphic visualization is especially convenient for temporal queries as you can show trends and usage patterns in an intuitive way very easily:

![TemporalGraph](./media/sql-database-temporal-tables/AzureTemporal6.png)

## Evolving table schema
Typically, you will need to change the temporal table schema while you are doing app development. For that, simply run regular ALTER TABLE statements and Azure SQL Database will appropriately propagate changes to the history table. The following script shows how you can add additional attribute for tracking:

```
/*Add new column for tracking source IP address*/
ALTER TABLE dbo.WebsiteUserInfo 
ADD  [IPAddress] varchar(128) NOT NULL CONSTRAINT DF_Address DEFAULT 'N/A';
```

Similarly, you can change column definition while your workload is active:

```
/*Increase the length of name column*/
ALTER TABLE dbo.WebsiteUserInfo 
    ALTER COLUMN  UserName nvarchar(256) NOT NULL;
```

Finally, you can remove a column that you do not need anymore.

```
/*Drop unnecessary column */
ALTER TABLE dbo.WebsiteUserInfo 
    DROP COLUMN TemporaryColumn; 
```

Alternatively, use latest [SSDT](https://msdn.microsoft.com/library/mt204009.aspx) to change temporal table schema while you are connected to the database (online mode) or as part of the database project (offline mode).

## Controlling retention of historical data
With system-versioned temporal tables, the history table may increase the database size more than regular tables. A large and ever-growing history table can become an issue both due to pure storage costs as well as imposing a performance tax on temporal querying. Hence, developing a data retention policy for managing data in the history table is an important aspect of planning and managing the lifecycle of every temporal table. With Azure SQL Database, you have the following approaches for managing historical data in the temporal table:

* [Table Partitioning](https://msdn.microsoft.com/library/mt637341.aspx#Anchor_2)
* [Custom Cleanup Script](https://msdn.microsoft.com/library/mt637341.aspx#Anchor_3)

## Next steps

- For more information on Temporal Tables, see check out [Temporal Tables](https://docs.microsoft.com/sql/relational-databases/tables/temporal-tables).
- Visit Channel 9 to hear a [real customer temporal implementation success story](https://channel9.msdn.com/Blogs/jsturtevant/Azure-SQL-Temporal-Tables-with-RockStep-Solutions) and watch a [live temporal demonstration](https://channel9.msdn.com/Shows/Data-Exposed/Temporal-in-SQL-Server-2016).

