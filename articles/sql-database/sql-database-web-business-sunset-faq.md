<properties 
   pageTitle="Azure SQL Database Web and Business Edition sunset FAQ | Microsoft Azure"
   description="Find out when the Azure SQL Web and Business databases will be retired and learn about the features and functionality of the new service tiers."
   services="sql-database"
   documentationCenter="na"
   authors="stevestein"
   manager="jeffreyg"
   editor="monicar" />
<tags 
   ms.service="sql-database"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="data-management"
   ms.date="09/29/2015"
   ms.author="sstein" />

# Web and Business Edition sunset FAQ

Azure SQL Web and Business databases will be retired September 2015. The Basic, Standard, and Premium service tiers replace the retiring Web and Business databases.

## Why does the Azure Management Portal show my Web and Business edition databases as Retired?

Because Web and Business edition databases will not be available after September 2015, the management portal labels Web and Business databases as Retired. Web and Business databases can still be provisioned and managed as usual, but the Retired label is a reminder that it is best to use the Basic, Standard, or Premium service tiers for new databases. The retired label also provides a reminder that any Web and Business databases should be upgraded to Standard, Basic, or Premium before September 2015. For detailed information on upgrading existing Web or Business databases to the new service tiers, see [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md).

## Which new service tier is the best choice to upgrade my existing Web or Business database to?

Selecting an appropriate new service tier and performance level for your existing Web or Business database depends on the specific feature and performance requirements for your application. For detailed information to assist you in selecting an appropriate new service tier, see [Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md).

## Why is Microsoft introducing new service tiers?

Based on customer feedback, Azure SQL Database is introducing new service tiers to help customers more easily support relational database workloads. The new tiers are designed to deliver predictable performance across a spectrum of seven levels for light-weight to heavy-weight transactional application demands. Additionally, the new tiers offer a range of business continuity features, a stronger uptime SLA, larger database sizes for less money, and an improved billing experience.

## Where can I learn more about the new service tiers?

For detailed information about the new service tiers and performance model, see [Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx). For detailed pricing information for the new service tiers, see [SQL Database pricing](http://azure.microsoft.com/pricing/details/sql-database/).

## How do I provision a Basic, Standard, or Premium database?

You provision Basic, Standard, and Premium databases using the [Management Portal or programmatically](https://msdn.microsoft.com/library/azure/ff394116.aspx). You can also upgrade or downgrade any database between any service tier on the database scale tab, including upgrading and downgrading between Web and Business and the new service tiers. If you need additional quota, please call customer support.

## What does this mean for the future of Web and Business databases?

Azure SQL Database Web and Business will be retired September 2015. You can evaluate Basic, Standard, and Premium which replaces Web and Business. There is no change to your use of Web and Business today. Customers deployed on Web and Business today can continue to use those service tiers as-is via the Management Portal or programmatically through APIs. This includes application patterns which require regular create/delete activity. You can transition to the new tiers at your own pace until the retirement date.

## What features or functionality will not be available in Basic, Standard, and Premium?

The Federations feature will be retired with Web and Business editions. Customers who need to scale-out their databases are encouraged to instead use or migrate to [[Elastic database tools](sql-database-elastic-scale-get-started.md) for Azure SQL Database](http://azure.microsoft.com/documentation/articles/sql-database-elastic-scale-get-started/), which simplifies building and managing an application that uses sharding. A .NET client library allows applications to define how data is mapped to shards and routes OLTP requests to appropriate databases. To support management operations that reconfigure how data is distributed among shards, an Azure cloud service template is included that you can host in your own Azure subscription. In addition to [Elastic database tools](sql-database-elastic-scale-get-started.md), Microsoft will continue to create and publish [custom sharding patterns and practices guidance](https://msdn.microsoft.com/library/azure/dn764977.aspx) based on learnings from deep customer engagements. New customers who need scale out functionality should check out [Elastic database tools](sql-database-elastic-scale-get-started.md) and/or contact Microsoft Support to evaluate their options.

Microsoft is also changing the database copy experience with Premium databases. Previously as premium database quota was limited, CREATE DATABASE … AS A COPY OF in T-SQL created a Suspended Premium database without reserved resources, which was charged at the same rate as a Business database. As premium quota is now more freely available, Suspended Premium is no longer supported. Database copies will now be created with the same edition and performance level as the source and will be billed accordingly. Customers can choose to downgrade copied databases to a different service tier or performance level to reduce their cost if desired. Existing Suspended Premium databases will be converted to Business edition as part of this release. It is anticipated that the introduction of point in time restore will reduce the need to make backup copies of databases.

## How does Basic, Standard, and Premium improve my billing experience?

Basic, Standard, and Premium Azure SQL Databases are billed by the hour, and you have the ability to scale each database up or down 4 times within a 24 hour period. You are billed at a fixed rate based on the highest service tier and performance level you choose for each hour. Additionally, performance levels (example: Basic, S1, and P2) are broken out in the bill to make it easier to see the number of database days/hours you incurred in a single month for each performance level. Web and Business databases continue to be billed using Database Units based on the database size. Please visit the [SQL Database pricing page](http://azure.microsoft.com/pricing/details/sql-database/) to learn more about the pricing and differences between the new service tiers.

## Can I get support from Microsoft during the Basic, Standard, and Premium previews?

Yes! Customers with paid [Azure Support plans](http://azure.microsoft.com/support/plans/) can now get Microsoft support for the SQL Database previews.

## See also

[Azure SQL Database Service Tiers and Performance Levels](https://msdn.microsoft.com/library/azure/dn741336.aspx)

[Azure SQL Database](https://msdn.microsoft.com/library/azure/ee336279.aspx)

[Service Tiers (Editions)](https://msdn.microsoft.com/library/azure/dn741340.aspx)

[Upgrade SQL Database Web/Business Databases to New Service Tiers](sql-database-upgrade-new-service-tiers.md)