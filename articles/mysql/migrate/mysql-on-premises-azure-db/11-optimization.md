---
title: "Migrate MySQL on-premises to Azure Database for MySQL: Optimization"
description: "In addition to the audit and activity logs, server performance can also be monitored with Azure Metrics."
ms.service: mysql
ms.subservice: migration-guide
ms.topic: how-to
author: rothja 
ms.author: jroth
ms.reviewer: maghan
ms.custom:
ms.date: 06/21/2021
---

# Migrate MySQL on-premises to Azure Database for MySQL: Optimization

[!INCLUDE[applies-to-mysql-single-flexible-server](../../includes/applies-to-mysql-single-flexible-server.md)]

## Prerequisites

[Post migration management](10-post-migration-management.md)

## Monitoring hardware and query performance

In addition to the audit and activity logs, the server performance can also be monitored with [Azure Metrics.](../../../azure-monitor/essentials/data-platform-metrics.md) Azure metrics are provided in a one-minute frequency and alerts can be configured from them. For more information, reference [Monitoring in Azure Database for MySQL](../../concepts-monitoring.md) for specifics on what kind of metrics that can be monitored.

As previously mentioned, monitoring metrics such as the cpu\_percent or memory\_percent can be important when deciding to upgrade the database tier. Consistently high values could indicate a tier upgrade is necessary.

Additionally, if cpu and memory don't seem to be the issue, administrators can explore database-based options such as indexing and query modifications for poor performing queries.

To find poor performing queries, run the following:

```
AzureDiagnostics
| where ResourceProvider == "MICROSOFT.DBFORMYSQL"
| where Category == 'MySqlSlowLogs'
| project TimeGenerated, LogicalServerName\_s, 
event\_class\_s, start\_time\_t , q uery\_time\_d, 
sql\_text\_s| top 5 by query\_time\_d desc
```

## Query Performance Insight

In addition to the basic server monitoring aspects, Azure provides tools to monitor application query performance. Correcting or improving queries can lead to significant increases in the query throughput. Use the [Query Performance Insight tool](../../concepts-query-performance-insight.md) to analyze the longest running queries and determine if it's possible to cache those items if they're deterministic within a set period, or modify the queries to increase their performance.

The `slow\_query\_log` can be set to show slow queries in the MySQL log files (default is OFF). The `long\_query\_time` server parameter can alert users for long query times (default is 10 sec).

## Upgrading the tier

The Azure portal can be used to scale between from `General Purpose` and `Memory Optimized`. If a `Basic` tier is chosen, there is no option to upgrade the tier to `General Purpose` or `Memory Optimized` later. However, it's possible to utilize other techniques to perform a migration/upgrade to a new Azure Database for MySQL instance.

For an example of a script that migrates from basic to another server tier, reference [Upgrade from Basic to General Purpose or Memory Optimized tiers in Azure Database for MySQL.](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/upgrade-from-basic-to-general-purpose-or-memory-optimized-tiers/ba-p/830404)

## Scale the server

Within the tier, it's possible to scale cores and memory to the minimum and maximum limits allowed in that tier. If monitoring shows a continual maxing out of CPU or memory, follow the steps to [scale-up to meet your demand. ](https://techcommunity.microsoft.com/t5/azure-database-for-mysql/upgrade-from-basic-to-general-purpose-or-memory-optimized-tiers/ba-p/830404)

## Moving regions

Moving a database to a different Azure region depends on the approach and architecture. Depending on the approach, it could cause system downtime.

The recommended process is the same as utilizing read replicas for maintenance failover. However, compared to the planned maintenance method mentioned above, the speed to failover is much faster when a failover layer has been implemented in the application. The application should only be down for a few moments during the read replica failover process. More details are covered in the Business Continuity and Disaster Recovery section.

## WWI scenario

WWI business and application users expressed a high level of excitement regarding the ability to scale the database on-demand. They were also interested in using the Query Performance Insight to determine if long running queries performance needed to be addressed.

They opted to utilize a read replica server for any potential failover or read-only needed scenarios.

The migration team, working with the Azure engineers, set up KQL queries to monitor for any potential issues with the MySQL server performance. The KQY queries were set up with alerts to email event issues to the database and conference team.

They elected to monitor any potential issues for now and implement Azure Automation run books at a later time, if needed, to improve operational efficiency.

## Optimization checklist

  - Monitor for slow queries.

  - Periodically review the Performance Insight dashboard.

  - Utilize monitoring to drive tier upgrades and scale decisions.

  - Consider moving regions of the users or application needs change.  


## Next steps

> [!div class="nextstepaction"]
> [Business Continuity and Disaster Recovery (BCDR)](./12-business-continuity-and-disaster-recovery.md)