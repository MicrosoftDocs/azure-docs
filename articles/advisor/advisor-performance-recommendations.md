---
title: Improve performance of Azure apps with Advisor
description: Use performance recommendations in Azure Advisor to improve the speed and responsiveness of your business-critical applications.
ms.topic: article
ms.custom: devx-track-arm-template
ms.date: 07/29/2020
---

# Improve the performance of Azure applications by using Azure Advisor

The performance recommendations in Azure Advisor can help improve the speed and responsiveness of your business-critical applications. You can get performance recommendations from Advisor on the **Performance** tab of the Advisor dashboard.

## Reduce DNS time-to-live on your Traffic Manager profile to fail over to healthy endpoints faster

You can use [time-to-live (TTL) settings](../traffic-manager/traffic-manager-performance-considerations.md) on your Azure Traffic Manager profile to specify how quickly to switch endpoints if a given endpoint stops responding to queries. If you reduce the TTL values, clients will be routed to functioning endpoints faster.

Azure Advisor identifies Traffic Manager profiles that have a longer TTL configured. It recommends configuring the TTL to either 20 seconds or 60 seconds, depending on whether the profile is configured for [Fast Failover](https://azure.microsoft.com/roadmap/fast-failover-and-tcp-probing-in-azure-traffic-manager/).

## Improve database performance by using SQL Database Advisor (temporarily disabled)

Azure Advisor provides a consistent, consolidated view of recommendations for all your Azure resources. It integrates with SQL Database Advisor to bring you recommendations for improving the performance of your databases. SQL Database Advisor assesses the performance of your databases by analyzing your usage history. It then offers recommendations that are best suited for running the database's typical workload.

> [!NOTE]
> Before you can get recommendations, your database needs to be in use for about a week, and within that week there needs to be some consistent activity. SQL Database Advisor can optimize more easily for consistent query patterns than for random bursts of activity.

For more information, see [SQL Database Advisor](/azure/azure-sql/database/database-advisor-implement-performance-recommendations).

## Upgrade your Storage client library to the latest version for better reliability and performance

The latest version of the Storage client library SDK contains fixes to problems reported by customers and proactively identified through our QA process. The latest version also carries reliability and performance optimization together with new features that can improve your overall experience with using Azure Storage. Advisor provides recommendations and steps needed to upgrade to the latest version of the SDK if you're using a stale version. The recommendations are for supported languages: C++ and .NET.

## Improve App Service performance and reliability

Azure Advisor integrates recommendations for improving your App Service experience and discovering relevant platform capabilities. Examples of App Service recommendations are:
* Detection of instances where memory or CPU resources are exhausted by app runtimes, with mitigation options.
* Detection of instances where co-locating resources like web apps and databases can improve performance and reduce cost.

For more information, see [Best practices for Azure App Service](../app-service/app-service-best-practices.md).

## Use managed disks to prevent disk I/O throttling

Advisor identifies virtual machines that belong to a storage account that's reaching its scalability target. This condition makes those VMs susceptible to I/O throttling. Advisor will recommend that they use managed disks to prevent performance degradation.

## Improve the performance and reliability of virtual machine disks by using Premium Storage

Advisor identifies virtual machines with standard disks that have a high volume of transactions on your storage account. It recommends upgrading to premium disks. 

Azure Premium Storage delivers high-performance, low-latency disk support for virtual machines that run I/O-intensive workloads. Virtual machine disks that use Premium Storage accounts store data on solid-state drives (SSDs). For the best performance for your application, we recommend that you migrate any virtual machine disks that require high IOPS to Premium Storage.

## Remove data skew on your Azure Synapse Analytics tables to increase query performance

Data skew can cause unnecessary data movement or resource bottlenecks when you run your workload. Advisor detects distribution data skew of greater than 15%. It recommends that you redistribute your data and revisit your table distribution key selections. To learn more about identifying and removing skew, see [troubleshooting skew](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-distribute.md#how-to-tell-if-your-distribution-is-a-good-choice).

## Create or update outdated table statistics in your Azure Synapse Analytics tables to increase query performance

Advisor identifies tables that don't have up-to-date [table statistics](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-tables-statistics.md) and recommends creating or updating the statistics. The query optimizer in Azure Synapse Analytics uses up-to-date statistics to estimate the cardinality or number of rows in query results. These estimates enable the query optimizer to create a query plan to provide the fastest performance.

## Improve MySQL connection management

Advisor analysis can indicate that your application connecting to a MySQL server might not be managing connections efficiently. This condition could lead to unnecessary resource consumption and overall higher application latency. To improve connection management, we recommend that you reduce the number of short-lived connections and eliminate unnecessary idle connections. You can make these improvements by configuring a server-side connection pooler, like ProxySQL.


## Scale up to optimize cache utilization on your Azure Synapse Analytics tables to increase query performance

Azure Advisor detects whether your Azure Synapse Analytics tables have a high cache-used percentage and a low hit percentage. This condition indicates high cache eviction, which can affect the performance of your Azure Synapse Analytics instance. Advisor recommends that you scale up your Azure Synapse Analytics instance to ensure you allocate enough cache capacity for your workload.

## Convert Azure Synapse Analytics tables to replicated tables to increase query performance

Advisor identifies tables that aren't replicated tables but that would benefit from conversion. It suggests that you convert these tables. Recommendations are based on:
- The size of the replicated table. 
- The number of columns. 
- The table distribution type. 
- The number of partitions on the Azure Synapse Analytics table. 

Additional heuristics might be provided in the recommendation for context. To learn more about how this recommendation is determined, see [Azure Synapse Analytics recommendations](../synapse-analytics/sql-data-warehouse/sql-data-warehouse-concept-recommendations.md#replicate-tables). 

## Migrate your storage account to Azure Resource Manager to get the latest Azure features

Migrate your storage account deployment model to Azure Resource Manager to take advantage of:
- Template deployments.
- Additional security options.
- The ability to upgrade to a GPv2 account so you can use the latest Azure Storage features. 

Advisor identifies any stand-alone storage accounts that are using the classic deployment model and recommends migrating to the Resource Manager deployment model.

> [!NOTE]
> Classic alerts in Azure Monitor were retired in August 2019. We recommended that you upgrade your classic storage account to use Resource Manager to retain alerting functionality with the new platform. For more information, see [classic alerts retirement](/previous-versions/azure/azure-monitor/alerts/monitoring-classic-retirement#retirement-of-classic-monitoring-and-alerting-platform).

## Design your storage accounts to prevent reaching the maximum subscription limit

An Azure region supports a maximum of 250 storage accounts per subscription. After this limit is reached, you won't be able to create storage accounts in that region/subscription combination. Advisor checks your subscriptions and provides recommendations for you to design for fewer storage accounts for any subscription/region that's close to reaching the maximum limit.

## Consider increasing the size of your VPN Gateway SKU to address high P2S use

Each Azure VPN Gateway SKU can support only a specified number of concurrent P2S connections. If your connection count is close to your gateway limit, additional connection attempts might fail. If you increase the size of your gateway, you'll be able to support more concurrent P2S users. Advisor provides recommendations and instructions for increasing the size of your gateway.

## Consider increasing the size of your VPN Gateway SKU to address high CPU

Under high traffic load, your VPN gateway might drop packets because of high CPU. Consider upgrading your VPN Gateway SKU. Increasing the size of your VPN gateway will ensure that connections aren't dropped because of high CPU. Advisor provides recommendations to proactively address this problem. 

## Increase batch size when loading to maximize load throughput, data compression, and query performance

Advisor detects whether you can increase load performance and throughput by increasing the batch size when loading into your database. You could consider using the COPY statement. If you can't use the COPY statement, consider increasing the batch size when you use loading utilities like the SQLBulkCopy API or BCP. A good general rule is to use a batch size that's between 100 thousand and 1 million rows. Increasing batch size will increase load throughput, data compression, and query performance.

## Co-locate the storage account in the same region to minimize latency when loading

Advisor detects whether you're loading from a region that's different from your dedicated SQL pool. Consider loading from a storage account that's in the same region as your dedicated SQL pool to minimize latency when loading data. This change will help minimize latency and increase load performance.

## Use a supported Kubernetes version

Advisor detects unsupported versions of Kubernetes.

## Optimize the performance of your Azure Database for MySQL, Azure Database for PostgreSQL, and Azure Database for MariaDB servers

### Fix the CPU pressure of your Azure Database for MySQL, Azure Database for PostgreSQL, and Azure Database for MariaDB servers with CPU bottlenecks
High utilization of the CPU over an extended period can cause slow query performance for your workload. Increasing the CPU size will help to optimize the runtime of the database queries and improve overall performance. Advisor identifies servers with a high CPU utilization that are likely running CPU-constrained workloads and recommends scaling your compute.

### Reduce memory constraints on your Azure Database for MySQL, Azure Database for PostgreSQL, and Azure Database for MariaDB servers, or move to a Memory Optimized SKU
A low cache hit ratio can result in slower query performance and increased IOPS. This condition could be caused by a bad query plan or a memory-intensive workload. Fixing the query plan or [increasing the memory](../postgresql/concepts-pricing-tiers.md) of the Azure Database for PostgreSQL, Azure Database for MySQL, or Azure Database for MariaDB server will help optimize the execution of the database workload. Azure Advisor identifies servers affected by this high buffer pool churn. It recommends that you take one of these actions: 
- Fix the query plan
- Move to an SKU that has more memory 
- Increase storage size to get more IOPS.

### Use an Azure Database for MySQL or Azure Database for PostgreSQL read replica to scale out reads for read-intensive workloads
Advisor uses workload-based heuristics like the ratio of reads to writes on the server over the past seven days to identify read-intensive workloads. An Azure Database for PostgreSQL or Azure Database for MySQL resource with a high read/write ratio can result in CPU or memory contentions and lead to slow query performance. Adding a [replica](../postgresql/howto-read-replicas-portal.md) will help to scale out reads to the replica server and prevent CPU or memory constraints on the primary server. Advisor identifies servers with read-intensive workloads and recommends that you add a [read replica](../postgresql/concepts-read-replicas.md) to offload some of the read workloads.


### Scale your Azure Database for MySQL, Azure Database for PostgreSQL, or Azure Database for MariaDB server to a higher SKU to prevent connection constraints
Each new connection to your database server occupies memory. The database server's performance degrades if connections to your server are failing because of an [upper limit](../postgresql/concepts-limits.md) in memory. Azure Advisor identifies servers running with many connection failures. It recommends upgrading your server's connection limits to provide more memory to your server by taking one of these actions:
- Scale up compute. 
- Use Memory Optimized SKUs, which have more compute per core.

## Scale your cache to a different size or SKU to improve cache and application performance

Cache instances perform best when they're not running under high memory pressure, high server load, or high network bandwidth. These conditions can cause them to become unresponsive, experience data loss, or become unavailable. Advisor identifies cache instances in these conditions. It recommends that you take one of these actions:
- Apply best practices to reduce the memory pressure, server load, or network bandwidth.
- Scale to a different size or SKU that has more capacity.

## Add regions with traffic to your Azure Cosmos DB account

Advisor detects Azure Cosmos DB accounts that have traffic from a region that isn't currently configured. It recommends adding that region. Doing so improves latency for requests coming from that region and ensures availability in case of region outages. [Learn more about global data distribution with Azure Cosmos DB.](../cosmos-db/distribute-data-globally.md)

## Configure your Azure Cosmos DB indexing policy by using custom included or excluded paths

Advisor identifies Azure Cosmos DB containers that are using the default indexing policy but could benefit from a custom indexing policy. This determination is based on the workload pattern. The default indexing policy indexes all properties. A custom indexing policy with explicit included or excluded paths used in query filters can reduce the RUs and storage consumed for indexing. [Learn more about modifying index policies.](../cosmos-db/index-policy.md)

## Set your Azure Cosmos DB query page size (MaxItemCount) to -1 

Azure Advisor identifies Azure Cosmos DB containers that are using a query page size of 100. It recommends using a page size of -1 for faster scans. [Learn more about MaxItemCount.](../cosmos-db/sql-api-query-metrics.md)

## Consider using Accelerated Writes feature in your HBase cluster to improve cluster performance
Azure Advisor analyses the system logs in the past 7 days and identifies if your cluster has encountered the following scenarios:
1. High WAL sync time latency 
2. High write request count (at least 3 one-hour windows of over 1000 avg_write_requests/second/node)

These conditions are indicators that your cluster is suffering from high write latencies. This could be due to heavy workload performed on your cluster.To improve the performance of your cluster, you may want to consider utilizing the Accelerated Writes feature provided by Azure HDInsight HBase. The Accelerated Writes feature for HDInsight Apache HBase clusters attaches premium SSD-managed disks to every RegionServer (worker node) instead of using cloud storage. As a result, provides low write-latency and better resiliency for your applications. 
To read more on this feature, [learn more](../hdinsight/hbase/apache-hbase-accelerated-writes.md#how-to-enable-accelerated-writes-for-hbase-in-hdinsight)

## Review Azure Data Explorer table cache-period (policy) for better performance (Preview)
This recommendation surfaces Azure Data Explorer tables which have a high number of queries that look back beyond the configured cache period (policy) (You will see the top 10 tables by query percentage that access out-of-cache data). The recommended action to improve the cluster's performance: Limit queries on this table to the minimal necessary time range (within the defined policy). Alternatively, if data from the entire time range is required, increase the cache period to the recommended value.

## Improve performance by optimizing MySQL temporary-table sizing
Advisor analysis indicates that your MySQL server may be incurring unnecessary I/O overhead due to low temporary-table parameter settings. This may result in unnecessary disk-based transactions and reduced performance. We recommend that you increase the 'tmp_table_size' and 'max_heap_table_size' parameter values to reduce the number of disk-based transactions. [Learn more](https://aka.ms/azure_mysql_tmp_table)

## Distribute data in server group to distribute workload among nodes
Advisor identifies the server groups where the data has not been distributed but stays on the coordinator. Based on this, Advisor recommends that for full Hyperscale (Citus) benefits distribute data on worker nodes for your server groups. This will improve query performance by utilizing resource of each node in the server group. [Learn more](https://go.microsoft.com/fwlink/?linkid=2135201) 

## Improve user experience and connectivity by deploying VMs closer to Azure Virtual Desktop deployment location
We have determined that your VMs are located in a region different or far from where your users are connecting from, using Azure Virtual Desktop. This may lead to prolonged connection response times and will impact overall user experience on Azure Virtual Desktop. When creating VMs for your host pools, you should attempt to use a region closer to the user. Having close proximity ensures continuing satisfaction with the Azure Virtual Desktop service and a better overall quality of experience. [Learn more about connection latency here](../virtual-desktop/connection-latency.md).

## Upgrade to the latest version of the Immersive Reader SDK
We have identified resources under this subscription using outdated versions of the Immersive Reader SDK. Using the latest version of the Immersive Reader SDK provides you with updated security, performance and an expanded set of features for customizing and enhancing your integration experience.
Learn more about [Immersive reader SDK](../ai-services/immersive-reader/index.yml).

## Improve VM performance by changing the maximum session limit

Advisor detects that you have a host pool that has depth first set as the load balancing algorithm, and that host pool's max session limit is greater than or equal to 999999. Depth first load balancing uses the max session limit to determine the maximum number of users that can have concurrent sessions on a single session host. If the max session limit is too high, all user sessions will be directed to the same session host, and this will cause performance and reliability issues. Therefore, when setting a host pool to have depth first load balancing, you must set an appropriate max session limit according to the configuration of your deployment and capacity of your VMs. 

To learn more about load balancing in Azure Virtual Desktop, see [Host pool load-balancing algorithms](../virtual-desktop/host-pool-load-balancing.md).

## Upgrade to the latest version of the Azure Communication Services SDKs

Advisor has identified resources under this subscription using outdated versions of specific Azure Communication Services SDKs. Using the latest version of the Azure Communication Services SDK provides you with updated security, performance and an expanded set of features for customizing and enhancing your communication experiences.
Learn more about [Azure Communication Services](../communication-services/overview.md) and the [integration with Azure Advisor](../communication-services/concepts/advisor-overview.md).

## How to access performance recommendations in Advisor

1. Sign in to the [Azure portal](https://portal.azure.com), and then open [Advisor](https://aka.ms/azureadvisordashboard).

2.    On the Advisor dashboard, select the **Performance** tab.

## Next steps

To learn more about Advisor recommendations, see:

* [Introduction to Advisor](advisor-overview.md)
* [Get started with Advisor](advisor-get-started.md)
* [Advisor score](azure-advisor-score.md)
* [Advisor cost recommendations](advisor-cost-recommendations.md)
* [Advisor reliability recommendations](advisor-high-availability-recommendations.md)
* [Advisor security recommendations](advisor-security-recommendations.md)
* [Advisor operational excellence recommendations](advisor-operational-excellence-recommendations.md)
* [Advisor REST API](/rest/api/advisor/)
