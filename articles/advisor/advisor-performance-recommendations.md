---
title: Improve performance of Azure applications with Azure Advisor
description: Use Advisor to optimize the performance of your Azure deployments.
ms.topic: article
ms.date: 01/29/2019
---

# Improve performance of Azure applications with Azure Advisor

Azure Advisor performance recommendations help improve the speed and responsiveness of your business-critical applications. You can get performance recommendations from Advisor on the **Performance** tab of the Advisor dashboard.

## Reduce DNS time to live on your Traffic Manager profile to fail over to healthy endpoints faster

[Time to Live (TTL) settings](https://docs.microsoft.com/azure/traffic-manager/traffic-manager-performance-considerations) on your Traffic Manager profile allow you to specify how quickly to switch endpoints if a given endpoint stops responding to queries. Reducing the TTL values means that clients will be routed to functioning endpoints faster.

Azure Advisor identifies Traffic Manager profiles with a longer TTL configured and recommends configuring the TTL to either 20 seconds or 60 seconds depending on whether the profile is configured for [Fast Failover](https://azure.microsoft.com/roadmap/fast-failover-and-tcp-probing-in-azure-traffic-manager/).

## Improve database performance with SQL DB Advisor

Advisor provides you with a consistent, consolidated view of recommendations for all your Azure resources. It integrates with SQL Database Advisor to bring you recommendations for improving the performance of your database. SQL Database Advisor assesses the performance of your databases by analyzing your usage history. It then offers recommendations that are best suited for running the database’s typical workload.

> [!NOTE]
> To get recommendations, a database must have about a week of usage, and within that week there must be some consistent activity. SQL Database Advisor can optimize more easily for consistent query patterns than for random bursts of activity.

For more information about SQL Database Advisor, see [SQL Database Advisor](https://azure.microsoft.com/documentation/articles/sql-database-advisor/).

## Upgrade your Storage Client Library to the latest version for better reliability and performance

The latest version of Storage Client Library/ SDK contains fixes to issues reported by customers and proactively identified through our QA process. The latest version also carries reliability and performance optimization in addition to new features that can improve your overall experience using Azure Storage. Advisor provides you recommendations and steps to upgrade to latest version of SDK if you are on a stale version. The recommendations is for supported languages - C++ and .Net.

## Improve App Service performance and reliability

Azure Advisor integrates best practices recommendations for improving your App Services experience and discovering relevant platform capabilities. Examples of App Services recommendations are:
* Detection of instances where memory or CPU resources are exhausted by app runtimes with mitigation options.
* Detection of instances where collocating resources like web apps and databases can improve performance and lower cost.

For more information about App Services recommendations, see [Best Practices for Azure App Service](https://azure.microsoft.com/documentation/articles/app-service-best-practices/).

## Use Managed Disks to prevent disk I/O throttling

Advisor will identify virtual machines that belong to a storage account that is reaching its scalability target. This condition makes those VMs susceptible to I/O throttling. Advisor will recommend that they use Managed Disks to prevent performance degradation.

## Improve the performance and reliability of virtual machine disks by using Premium Storage

Advisor identifies virtual machines with standard disks that have a high volume of transactions on your storage account and recommends upgrading to premium disks. 

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines that run I/O-intensive workloads. Virtual machine disks that use premium storage accounts store data on solid-state drives (SSDs). For the best performance for your application, we recommend that you migrated any virtual machine disks requiring high IOPS to premium storage.

## Remove data skew on your SQL data warehouse table to increase query performance

Data skew can cause unnecessary data movement or resource bottlenecks when running your workload. Advisor will detect distribution data skew greater than 15% and recommend that you redistribute your data and revisit your table distribution key selections. To learn more about identifying and removing skew, see [troubleshooting skew](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-distribute#how-to-tell-if-your-distribution-column-is-a-good-choice).

## Create or update outdated table statistics on your SQL data warehouse table to increase query performance

Advisor identifies tables that do not have up-to-date [table statistics](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-tables-statistics) and recommends creating or updating table statistics. The SQL data warehouse query optimizer uses up-to-date statics to estimate the cardinality or number of rows in the query result that enables the query optimizer to create a high-quality query plan for fastest performance.

## Improve MySQL connection management

Advisor analysis helps indicate that your application connecting to MySQL server may not be managing connections efficiently. This may result in unnecessary resource consumption and overall higher application latency. To improve connection management, we recommend that you reduce the number of short-lived connections and eliminate unnecessary idle connections. This can be done by configuring a server side connection-pooler, such as ProxySQL.


## Scale up to optimize cache utilization on your SQL Data Warehouse tables to increase query performance

Azure Advisor detects if your SQL Data Warehouse has high cache used percentage and a low hit percentage. This condition indicates high cache eviction, which can impact the performance of your SQL Data Warehouse. Advisor suggests that you scale up your SQL Data Warehouse to ensure you allocate enough cache capacity for your workload.

## Convert SQL Data Warehouse tables to replicated tables to increase query performance

Advisor identifies tables that are not replicated tables but would benefit from converting and suggests that you convert these tables. Recommendations are based on the replicated table size, number of columns, table distribution type, and number of partitions of the SQL Data Warehouse table. Additional heuristics may be provided in the recommendation for context. To learn more about how this recommendation is determined, see [SQL Data Warehouse Recommendations](https://docs.microsoft.com/azure/sql-data-warehouse/sql-data-warehouse-concept-recommendations#replicate-tables). 

## Migrate your Storage Account to Azure Resource Manager to get all of the latest Azure features

Migrate your Storage Account deployment model to Azure Resource Manager (Resource Manager) to take advantage of template deployments, additional security options, and the ability to upgrade to a GPv2 account for utilization of Azure Storage's latest features. Advisor will identify any stand-alone storage accounts that are using the Classic deployment model and recommends migrating to the Resource Manager deployment model.

> [!NOTE]
> Classic alerts in Azure Monitor have been retired in August 2019. We recommended that you upgrade your classic storage account to use Resource Manager to retain alerting functionality with the new platform. For more information, see [Classic Alerts Retirement](https://docs.microsoft.com/azure/azure-monitor/platform/monitoring-classic-retirement#retirement-of-classic-monitoring-and-alerting-platform).

## Design your storage accounts to prevent hitting the maximum subscription limit

An Azure region can support a maximum of 250 storage accounts per subscription. Once the limit is reached, you will be unable to create any more storage accounts in that region/subscription combination. Advisor will check your subscriptions and surface recommendations for you to design for fewer storage accounts for any that are close to reaching the maximum limit.

## Consider increasing the size of your VNet Gateway SKU to adress high P2S use

Each gateway SKU can only support a specified count of concurrent P2S connections. If your connection count is close to your gateway limit, so additional connection attempts may fail. Increasing the size of your gateway will allow you to support more concurrent P2S users.Advisor provides recommendation and steps to take, for this.

## Consider increasing the size of your VNet Gateway SKU to address high CPU

Under high traffic load, the VPN gateway may drop packets due to high CPU. You should consider upgrading your VPN Gateway SKU since your VPN has consistently been running at.Increasing the size of your VPN gateway will ensure that connections aren't dropped due to high CPU. Advisor provdes recommendation to address this issue proactively. 

## Increase batch size when loading to maximize load throughput, data compression, and query performance

Advisor can detect that you can increase load performance and throughput by increasing the batch size when loading into your database. You could consider using the COPY statement. If you are unable to use the COPY statement, consider increasing the batch size when using loading utilities such as the SQLBulkCopy API or BCP - a good rule of thumb is a batch size between 100K to 1M rows. This will in increasing load throughput, data compression, and query performance.

## Co-locate the storage account within the same region to minimize latency when loading

Advisor can detect that you are loading from a region that is different from your SQL pool. You should consider loading from a storage account that is within the same region as your SQL pool to minimize latency when loading data. This will help minimize latency and increase load performance.

## Unsupported Kubernetes version is detected

Advisor can detect if an unsupported Kubernetes version is detected. The recommendation will help to ensure Kubernetes cluster runs with a supported version.

## Optimize the performance of your Azure MySQL, Azure PostgreSQL, and Azure MariaDB servers 

### Fix the CPU pressure of your Azure MySQL, Azure PostgreSQL, and Azure MariaDB servers with CPU bottlenecks
Very high utilization of the CPU over an extended period can cause slow query performance for your workload. Increasing the CPU size will help in optimizing the runtime of the database queries and improve overall performance. Azure Advisor will identify servers with a high CPU utilization that are likely running CPU constrained workloads and recommend scaling your compute.

### Reduce memory constraints on your Azure MySQL, Azure PostgreSQL, and Azure MariaDB servers or move to a memory optimized SKU
A low cache hit ratio can result in slower query performance and increased IOPS. This could be due to a bad query plan or running a memory intensive workload. Fixing the query plan or [increasing the memory](https://docs.microsoft.com/azure/postgresql/concepts-pricing-tiers) of the Azure Database for PostgreSQL database server, Azure MySQL database server, or Azure MariaDB server will help optimize the execution of the database workload. Azure Advisor identifies servers affected due to this high buffer pool churn and recommends either fixing the query plan, moving to a higher SKU with more memory, or increasing storage size to get more IOPS.

### Use a Azure MySQL or Azure PostgreSQL Read Replica to scale out reads for read intensive workloads
Azure Advisor leverages workload-based heuristics such as the ratio of reads to writes on the server over the past seven days to identify read-intensive workloads. Your Azure database for PostgreSQL resource or Azure database for MySQL resource with a very high read/writes ratio can result in CPU and/or memory contentions leading to slow query performance. Adding a [replica](https://docs.microsoft.com/azure/postgresql/howto-read-replicas-portal) will help in scaling out reads to the replica server, preventing CPU and/or memory constraints on the primary server. Advisor will identify servers with such high read-intensive workloads and recommend adding a [read replica](https://docs.microsoft.com/azure/postgresql/concepts-read-replicas) to offload some of the read workloads.


### Scale your Azure MySQL, Azure PostgreSQL, or Azure MariaDB server to a higher SKU to prevent connection constraints
Each new connection to your database server occupies some memory. The database server's performance degrades if connections to your server are failing because of an [upper limit](https://docs.microsoft.com/azure/postgresql/concepts-limits) in memory. Azure Advisor will identify servers running with many connection failures and recommend upgrading your server's connections limits to provide more memory to your server by scaling up compute or using Memory Optimized SKUs, which have more compute per core.

## Scale your Cache to a different size or SKU to improve Cache and application performance

Cache instances perform best when not running under high memory pressure, high server load, or high network bandwidth which may cause them to become unresponsive, experience data loss, or become unavailable. Advisor will identify Cache instances in these conditions and recommend either applying best practices to reduce the memory pressure, server load, or network bandwidth or scaling to a different size or SKU with more capacity.

## Add regions with traffic to your Azure Cosmos DB account

Advisor will detect Azure Cosmos DB accounts that have traffic from a region that is not currently configured and recommend adding that region. This will improve latency for requests coming from that region and will ensure availability in case of region outages. [Learn more about global data distribution with Azure Cosmos DB](https://aka.ms/cosmos/globaldistribution)

## Configure your Azure Cosmos DB indexing policy with customer included or excluded paths

Azure Advisor will identify Cosmos DB containers that are using the default indexing policy but could benefit from a custom indexing policy based on the workload pattern. The default indexing policy indexes all properties, but using a custom indexing policy with explicit included or excluded paths used in query filters can reduce the RUs and storage consumed for indexing. [Learn more about modifying index policies](https://aka.ms/cosmosdb/modify-index-policy)

## Configure your Azure Cosmos DB query page size (MaxItemCount) to -1 

Azure Advisor will identify Azure Cosmos DB containers that are using the query page size of 100 and recommend using  a page size of -1 for faster scans. [Learn more about Max Item Count](https://aka.ms/cosmosdb/sql-api-query-metrics-max-item-count)

## How to access Performance recommendations in Advisor

1. Sign in to the [Azure portal](https://portal.azure.com), and then open [Advisor](https://aka.ms/azureadvisordashboard).

2.	On the Advisor dashboard, click the **Performance** tab.

## Next steps

To learn more about Advisor recommendations, see:

* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor high availability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
