<properties 
	pageTitle="Shard Elasticity" 
	description="Explains concepts and gives examples behind shard elasticity, the ability to scale out Azure SQL databases easily." 
	services="sql-database" 
	documentationCenter="" 
	manager="jeffreyg" 
	authors="sidneyh" 
	editor=""/>

<tags 
	ms.service="sql-database" 
	ms.workload="sql-database" 
	ms.tgt_pltfrm="na" 
	ms.devlang="na" 
	ms.topic="article" 
	ms.date="04/17/2015" 
	ms.author="sidneyh"/>

# Shard elasticity 

**Shard elasticity** enables application developers to dynamically grow and shrink database resources according to need, enabling one to optimize the performance of their applications, and also to minimize costs. The combination of the **elastic database tools** for Azure SQL Database along with the [Basic, Standard, and Premium service tiers](http://msdn.microsoft.com/library/azure/dn741340.aspx) provides very compelling elasticity scenarios.  Elastic database tools enable horizontal scaling - a design pattern in which databases (also [known as "shards”](sql-database-elastic-scale-glossary.md)) are added or removed from a shard set to grow or shrink capacity. Similarly, the SQL Database service tiers provide **vertical scaling** capabilities in that a single database's resources can scale up or down to appropriately match demand.  Together, the vertical scaling of a single shard and the horizontal scaling of many shards, affords application developers a very flexible environment that can scale to meet performance, capacity and cost-optimization needs.

With the newly introduced **elastic database pools** capability, vertical scaling is even simpler to achieve.   Pools allow an individual database’s resource consumption to grow or shrink *automatically* within a budget shared among the entire pool. For applications that choose not to take advantage of elastic database pools, this article will describe other techniques for implementing policy-based mechanics for managing vertical scaling, as well as some common scenarios for automating horizontal scaling operations.

## Horizontal scaling example: concert spike

A canonical scenario for horizontal scaling is an application that processes transactions for concert tickets. Under normal customer volume, the application uses minimal database resources to handle purchase transactions.  However, when tickets go on sale for a popular concert, a single database cannot handle the large spike in customer demand. 

To process the dramatic increase in transactions, the application scales horizontally. The application can now distribute the transaction load across many shards. When the additional resources are no longer needed, the database tier shrinks back for normal usage. Here horizontal scaling enables an application to scale-out to match customer demand and scale-in when the resources are no longer needed.   

## Vertical scaling example: telemetry

A canonical scenario for vertical scaling is an application that uses a **shard set** to store operational telemetry. In this scenario, it is better to co-locate all telemetry data for a single day on a single shard. In this application, data for the current day is ingested into a shard and a new shard is provisioned for subsequent days. The operational data can then be aged and queried as appropriate. 

To ingest telemetry data at high loads, it is better to employ a higher service tier. In other words, a Premium database is better than a Basic database. Once the database reaches its capacity, it switches from ingestion to analysis and reporting. For that, the Standard tier's performance is equal to the task. Thus one can vertically scale down the service tier on shards (other than the most recently created one) in order to fit the lower performance requirements for older data. 

Vertical scaling can also be used to increase the performance of a single database in order to achieve increased performance. An example is a tax filing application. At filing time, it is better to keep a single customer’s data all on the same database and increase the performance of that shard. Depending on the application, vertically scaling up and down resources is advantageous to optimize for both cost and performance requirements. 

Together, both horizontal and vertical scaling of the database tier are at the core of application scalability and shard elasticity. 

This document provides the context for shard elasticity scenarios as well as references to example implementations of both vertical and horizontal scaling. 

## Mechanics of shard elasticity 

Vertical and horizontal scaling is a function of three basic components: 

1. **Telemetry**
2. **Rule**
3. **Action**   

## Telemetry

**Data-driven elasticity** is at the heart of an elastic scale application. Depending on the performance requirements, use telemetry to make data-driven decisions on whether to scale vertically or horizontally.  

#### Telemetry data sources
In the context of Azure SQL DB, there are a handful of key sources that can be leveraged as data sources for shard elasticity. 

1. **Performance telemetry** is exposed in five-minute durations in the **sys.resource_stats** view 
2. Hourly **database capacity telemetry** is exposed via the **sys.resource_usage** view.  

One can analyze the performance resources usage by querying the master DB using the following query where ‘Shard_20140623’ is the name of the targeted database. 

    SELECT TOP 10 *  
    FROM sys.resource_stats  
    WHERE database_name = 'Shard_20140623'  
    ORDER BY start_time DESC 

**Performance telemetry** can be summarized over a period of time (seven days in the query below) in order to remove transient behaviors. 

    SELECT  
    avg(avg_cpu_percent) AS 'Average CPU Utilization In Percent', 
        max(avg_cpu_percent) AS 'Maximum CPU Utilization In Percent', 
        avg(avg_physical_data_read_percent) AS 'Average Physical Data Read Utilization In Percent', 
        max(avg_physical_data_read_percent) AS 'Maximum Physical Data Read Utilization In Percent', 
        avg(avg_log_write_percent) AS 'Average Log Write Utilization In Percent', 
        max(avg_log_write_percent) AS 'Maximum Log Write Utilization In Percent', 
        avg(active_session_count) AS 'Average # of Sessions', 
        max(active_session_count) AS 'Maximum # of Sessions', 
        avg(active_worker_count) AS 'Average # of Workers', 
        max(active_worker_count) AS 'Maximum # of Workers' 
    FROM sys.resource_stats  
    WHERE database_name = ' Shard_20140623' AND start_time > DATEADD(day, -7, GETDATE()); 

**Database capacity** can be measured with a similar query against the **sys.resource_usage** view. The max of the **storage_in_megabytes** column yields the current size of the database. Such telemetry is useful for horizontally scaling an application when a particular shard reaches its capacity. 

    SELECT TOP 10 * 
    FROM [sys].[resource_usage] 
    WHERE database_name = 'Shard_20140623'  
    ORDER BY time DESC 

As data is ingested into a particular shard, it is useful to project forward a day and determine if the shard has sufficient capacity to handle the coming workload. While not a true implementation of linear regression, the following query returns the maximum delta in database capacity between two consecutive days.  Such telemetry can then be applied to a rule that would then result in an action (or non-action) being taken. 

    WITH MaxDatabaseDailySize AS( 
        SELECT 
            ROW_NUMBER() OVER (ORDER BY convert(date, [time]) DESC) as [Order], 
            CONVERT(date,[time]) as [date],  
            MAX(storage_in_megabytes) as [MaxSizeDay] 
        FROM [sys].[resource_usage] 
        WHERE  
            database_name = 'Shard_20140623' 
        GROUP BY CONVERT(date,[time]) 
        ) 
    
    SELECT 
        MAX(ISNULL(Size.[MaxSizeDay] - PreviousDaySize.[MaxSizeDay], 0)) 
    FROM  
        MaxDatabaseDailySize Size INNER JOIN 
        MaxDatabaseDailySize PreviousDaySize ON Size.[order]+1 = PreviousDaySize.[order] 
    WHERE 
        Size.[order] < 8 

## Rule  

The rule is the decision engine that determines whether or not an action is taken. Some rules are very straightforward and some are much more complicated. As shown in the code snippet below, a capacity-focused rule can be configured so that when a shard reaches $SafetyMargin, e.g., 80%, of its maximum capacity, a new shard is provisioned.

    # Determine if the current DB size plus the maximum daily delta size is greater than the threshold 
    if( ($CurrentDbSizeMb + $MaxDbDeltaMb) -gt ($MaxDbSizeMb * $SafetyMargin))  
    {#provision new shard} 

Given the data sources above, a number of rules can be formulated in order to accomplish numerous shard elasticity scenarios. 

## Action  

Based on the outcome of the rule, the action (or non-action) is the result. The two most common actions are:

* The increase or decrease of the service tier or performance level of the shard 
* The addition or removal of a shard from a shard set.

Note that in both horizontal and vertical scaling solutions, the result of an action is not immediate. When scaling vertically, for example, the issuing of the ALTER DATABASE command to increase the service tier of a Basic database to a Premium database takes a variable amount of time. The duration is largely dependent on the size of the database (for more information please see [Change Service Tiers and Performance Levels](http://msdn.microsoft.com/library/azure/dn369872.aspx). Similarly, the allocation or provisioning of a new shard is not instantaneous either. Thus, for both vertical and horizontal scaling, applications should take into account the non-zero time for altering or provisioning a new database.  

## Example shard elasticity scenario 

The example depicted in the figure below highlights two elastic scale scenarios: 
1. horizontal scaling of a shard map 
2. vertical scaling of an individual shard.  

![Operationl Data Ingestion][1]

To horizontally scale, a rule (based on date or database size) is used to provision a new shard and register it with the shard map, thus growing the database tier horizontally. Secondly, to scale vertically, a second rule is implemented in which any shard that is older than one day is downgraded from Premium Edition to a Standard or Basic Edition. 

Consider the telemetry scenario again: the application shards by date. It collects telemetry data continuously, requiring a high performance edition at loading time, but lower performance as the data ages. The current day’s data [Tnow] is written to a high performance database (Premium). Once the clock strikes midnight, the previous day’s shard (now [T-1]) is no longer be used for ingestion. The current data is ingested by the current [Tnow]. In advance of the next day, a new shard must be provisioned and registered with the shard map ([T+1]).  

This can be done by either provisioning a new shard in advance of every new day or by provisioning a new shard when the current shard ([Tnow]) nears its maximum capacity. Using either of these methods preserves the data locality for all telemetry written for a particular day. Per-hour sharding could also be applied for finer granularity. Once a new shard is provisioned, and because [T-1] is used for querying and reporting, it is desirable to reduce the performance level of the database reduce costs. As the content in DBs age, the performance tier can be further reduced and/or the content of the DBs can be archived to Azure Storage or deleted depending on the application. 

## Executing shard elasticity scenarios  

To facilitate the actual implementation of both horizontal and vertical scaling scenarios, a number of [Shard elasticity example scripts](http://go.microsoft.com/?linkid=9862617) have been created and posted on Script Center. Written to run in the Azure Automation service, these PowerShell runbooks provide a number of methods that interact with the elastic database client library and Azure SQL Database.  Building upon, or extracting from these code samples, one can craft the necessary scripts in order to automate the horizontal, vertical or both scaling scenarios for their application. 

[AZURE.INCLUDE [elastic-scale-include](../includes/elastic-scale-include.md)]

<!--Image references-->
[1]: ./media/sql-database-elastic-scale-elasticity/data-ingestion.png

<!--anchors-->
[Telemetry]:#telemetry
[Rule]:#rule
[Action]:#action
