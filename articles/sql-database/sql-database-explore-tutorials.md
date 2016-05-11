<properties
   pageTitle="Explore SQL Database Tutorials"
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
   ms.date="05/04/2016"
   ms.author="carlrab"/>
   
# Explore SQL Database Tutorials

The links below take you to an overview of each listed feature area and a quick start tutorial for each area.

## Elastic pools

In the following tutorials, you will learn about using [elastic pools](sql-database-elastic-pool.md) to manage the performance goals for multiple databases that have widely varying and unpredictable usage patterns.

| Tutorial  | Description  |
|---|---|---|
| [Create an elastic pool](sql-database-elastic-pool-create-portal.md) | In this tutorial, you learn how to create a scalable pool of Azure SQL databases. |
| [Monitor an elastic database](sql-database-elastic-pool-manage-portal.md#elastic-database-monitoring) | In this tutorial, you learn how to monitor an individual elastic database for potential trouble. |
| [Add an alert to a pool resource](https://azure.microsoft.com/en-us/documentation/articles/sql-database-elastic-pool-manage-portal.md#add-an-alert-to-a-pool-resource) | In this tutorial, you learn how to add rules to resources that send email to people or alert strings to URL endpoints when the resource hits a utilization threshold that you set up. |
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

## Elastic queries

In the following tutorials, you will learn about running [elastic queries](sql-database-elastic-query-overview.md). 

| Tutorial  | Description  |
|---|---|---|
| [Querying across a horizontally partitioned (sharded) database)](sql-database-elastic-query-getting-started.md) | In this tutorial, you learn how to create reports from all databases in a horizontally partitioned (sharded) database using [elastic query](sql-database-elastic-query-overview.md) |
| [Querying across a vertically partitioned database)](sql-database-elastic-query-getting-started-vertical.md#create-database-objects) | In this tutorial, you learn how to create reports from all databases in a vertically database using [elastic query](sql-database-elastic-query-overview.md) |
| [Migrate an existing database to scale-out](sql-database-elastic-convert-to-use-elastic-tools.md)| In this tutorial, you learn to horizontally scale (shard) an Azure SQL database. |

## Performance

In the following tutorials, you will learn about optimizing the [performance of single databases](sql-database-performance-guidance.md). For optimizing the performance of multiple databases, see [Elastic pools](#elastic-pools).

| Tutorial  | Description  |
|---|---|---|
| [Change the service tier and performance level of your database](sql-database-scale-up.md#change-the-service-tier-and-performance-level-of-your-database) | In this tutorial, you learn how to scale up or scale down the performance of an Azure SQL database using service tiers. |
| [Viewing and Applying SQL Database Advisor recommendations](sql-database-index-advisor.md#viewing-recommendations) | In this tutorial, you learn how to view and apply SQL Database Advisor performance recommendations. |

## Security

In the following tutorials, you will learn about [securing Azure SQL Database](sql-database-security.md) and its data.

| Tutorial  | Description  |
|---|---|---|
| [Configure an Azure SQL Database firewall ](sql-database-configure-firewall-settings.md)  | In this tutorial, you learn how to configure a SQL Database server-level firewall.  |
| [Create and Connect Using an Azure SQL Database user account](sql-database-get-started-security.md)  | In this tutorial, you log in as a server-level principal and learn how to create a contained user in a user database, grant that user dbo permissions in a user database and log in to a user database using a database user account.|
| [Enable Azure SQL Database Auditing](sql-database-auditing-get-started.md#set-up-threat-detection-for-your-database) | In this tutorial, you learn how to set up threat detection for your Azure SQL database. |
| [Set up dynamic data masking](sql-database-dynamic-data-masking-get-started.md#set-up-dynamic-data-masking-for-your-database-using-the-azure-portal)  | In this tutorial, you learn how to set up dynamic data masking for your Azure SQL database. |

## Data Sync

In this tutorial, you will learn about [Data Sync](http://download.microsoft.com/download/4/E/3/4E394315-A4CB-4C59-9696-B25215A19CEF/SQL_Data_Sync_Preview.pdf).

| Tutorial  | Description  |
|---|---|---| 
| [Getting Started with Azure SQL Data Sync (Preview)](sql-database-get-started-sql-data-sync.md)  | In this tutorial, you learn the fundamentals of Azure SQL Data Sync using the Azure Classic Portal. |