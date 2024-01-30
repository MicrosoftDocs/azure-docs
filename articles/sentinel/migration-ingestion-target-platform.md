---
title: "Microsoft Sentinel migration: Select a target Azure platform to host exported data | Microsoft Docs"
description: Select a target Azure platform to host the exported historical data 
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
---

# Select a target Azure platform to host the exported historical data 

One of the important decisions you make during your migration process is where to store your historical data. To make this decision, you need to understand and be able to compare the various target platforms. 

This article compares target platforms in terms of performance, cost, usability and management overhead.

> [!NOTE]
> The considerations in this table only apply to historical log migration, and don't apply in other scenarios, such as long-term retention.

|  |[Basic Logs/Archive](../azure-monitor/logs/basic-logs-configure.md)  |[Azure Data Explorer (ADX)](/azure/data-explorer/data-explorer-overview)  |[Azure Blob Storage](../storage/blobs/storage-blobs-overview.md) |[ADX + Azure Blob Storage](../azure-monitor/logs/azure-data-explorer-query-storage.md) |
|---------|---------|---------|---------|---------|
|**Capabilities**: |• Apply most of the existing Azure Monitor Logs experiences at a lower cost.<br>• Basic Logs are retained for eight days, and are then automatically transferred to the archive (according to the original retention period).<br>• Use [search jobs](../azure-monitor/logs/search-jobs.md) to search across petabytes of data and find specific events.<br>• For deep investigations on a specific time range, [restore data from the archive](../azure-monitor/logs/restore.md). The data is then available in the hot cache for further analytics. |• Both ADX and Microsoft Sentinel use the Kusto Query Language (KQL), allowing you to query, aggregate, or correlate data in both platforms. For example, you can run a KQL query from Microsoft Sentinel to [join data stored in ADX with data stored in Log Analytics](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md).<br>• With ADX, you have substantial control over the cluster size and configuration. For example, you can create a larger cluster to achieve higher ingestion throughput, or create a smaller cluster to control your costs. |• Blob storage is optimized for storing massive amounts of unstructured data.<br>• Offers competitive costs.<br>• Suitable for a scenario where your organization doesn't prioritize accessibility or performance, such as when there the organization must align with compliance or audit requirements. |• Data is stored in a blob storage, which is low in costs.<br>• You use ADX to query the data in KQL, allowing you to easily access the data. [Learn how to query Azure Monitor data with ADX](../azure-monitor/logs/azure-data-explorer-query-storage.md) |
|**Usability**:     |**Great**<br><br>The archive and search options are simple to use and accessible from the Microsoft Sentinel portal. However, the data isn't immediately available for queries. You need to perform a search to retrieve the data, which might take some time, depending on the amount of data being scanned and returned. |**Good**<br><br>Fairly easy to use in the context of Microsoft Sentinel. For example, you can use an Azure workbook to visualize data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using the [ADX proxy](../azure-monitor/logs/azure-monitor-data-explorer-proxy.md).  |**Poor**<br><br>With historical data migrations, you might have to deal with millions of files, and exploring the data becomes a challenge. |**Fair**<br><br>While using the `externaldata` operator is very challenging with large numbers of blobs to reference, using external ADX tables eliminates this issue. The external table definition understands the blob storage folder structure, and allows you to transparently query the data contained in many different blobs and folders. |
|**Management overhead**:     |**Fully managed**<br><br>The search and archive options are fully managed and don't add management overhead.    |**High**<br><br>ADX is external to Microsoft Sentinel, which requires monitoring and maintenance.        |**Low**<br><br>While this platform requires little maintenance, selecting this platform adds monitoring and configuration tasks, such as setting up lifecycle management. |**Medium**<br><br>With this option, you maintain and monitor ADX and Azure Blob Storage, both of which are external components to Microsoft Sentinel. While ADX can be shut down at times, consider the extra management overhead with this option. |
|**Performance**:     |**Medium**<br><br>You typically interact with basic logs within the archive using [search jobs](../azure-monitor/logs/search-jobs.md), which are suitable when you want to maintain access to the data, but don't need immediate access to the data.         |**High to low**<br><br>• The query performance of an ADX cluster depends on the number of nodes in the cluster, the cluster virtual machine SKU, data partitioning, and more.<br>• As you add nodes to the cluster, the performance improves, with added cost.<br>• If you use ADX, we recommend that you configure your cluster size to balance performance and cost. This configuration depends on your organization's needs, including how fast your migration needs to complete, how often the data is accessed, and the expected response time.         |**Low**<br><br>Offers two performance tiers: Premium or Standard. Although both tiers are an option for long-term storage, Standard is more cost-efficient. Learn about [performance and scalability limits](../storage/common/scalability-targets-standard-account.md). |**Low**<br><br>Because the data resides in the Blob Storage, the performance is limited by that platform. |
|**Cost**:     |**High**<br><br>The cost is composed of two components:<br>• **Ingestion cost**. Every GB of data ingested into Basic Logs is subject to Microsoft Sentinel and Azure Monitor Logs ingestion costs, which sum up to approximately $1/GB. See the [pricing details](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).<br>• **Archival cost**. The cost for data in the archive tier sums up to approximately $0.02/GB per month. See the [pricing details](https://azure.microsoft.com/pricing/details/monitor/).<br>In addition to these two cost components, if you need frequent access to the data, extra costs apply when you access data via search jobs.     |**High to low**<br><br>• Because ADX is a cluster of virtual machines, you're charged based on compute, storage and networking usage, plus an ADX markup (see the [pricing details](https://azure.microsoft.com/pricing/details/data-explorer/). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost will be.<br>• ADX also offers autoscaling capabilities to adapt to workload on demand. ADX can also benefit from Reserved Instance pricing. You can run your own cost calculations in the [Azure Pricing Calculator](https://azure.microsoft.com/pricing/calculator/).         |**Low**<br><br>With optimal setup, Azure Blob Storage has the lowest costs. For greater efficiency and cost savings, [Azure Storage lifecycle management](../storage/blobs/lifecycle-management-overview.md) can be used to automatically place older blobs into cheaper storage tiers. |**Low**<br><br>ADX only acts as a proxy in this case, so the cluster can be small. In addition, the cluster can be shut down when you don't need access to the data and only start it when data access is needed.. |
|**How to access data**:     |[Search jobs](search-jobs.md)      |Direct KQL queries         |[externaldata](/azure/data-explorer/kusto/query/externaldata-operator) |Modified KQL queries |
|**Scenario**:     |**Occasional access**<br><br>Relevant in scenarios where you don’t need to run heavy analytics or trigger analytics rules, and you only need to access the data occasionally.    |**Frequent access**<br><br>Relevant in scenarios where you need to access the data frequently, and need to control how the cluster is sized and configured.         |**Compliance/audit**<br><br>• Optimal for storing massive amounts of unstructured data.<br>• Relevant in scenarios where you don't need quick access to the data or high performance, such as for compliance or audit purposes. |**Occasional access**<br><br>Relevant in scenarios where you want to benefit from the low cost of Azure Blob Storage, and maintain relatively quick access to the data. |
|**Complexity**:     |Very low         |Medium         |Low |High         |
|**Readiness**:     |GA         |GA         |GA         |GA |

## General considerations 

Now that you know more about the available target platforms, review these main factors to finalize your decision. 

- [How will your organization use the ingested logs?](#use-of-ingested-logs)
- [How fast does the migration need to run?](#migration-speed)
- [What is the amount of data to ingest?](#amount-of-data)
- What are the estimated migration costs, during and after migration? See the [platform comparison](#select-a-target-azure-platform-to-host-the-exported-historical-data) to compare the costs. 

### Use of ingested logs 

Define how your organization will use the ingested logs to guide your selection of the ingestion platform.  

Consider these three general scenarios: 

- Your organization needs to keep the logs only for compliance or audit purposes. In this case, your organization will rarely access the data. Even if your organization accesses the data, high performance or ease of use aren't a priority.
- Your organization needs to retain the logs so that your teams can access the logs easily and fairly quickly.
- Your organization needs to retain the logs so that your teams can access the logs occasionally. Performance and ease of use are secondary. 

See the [platform comparison](#select-a-target-azure-platform-to-host-the-exported-historical-data) to understand which platform suits each of these scenarios. 

### Migration speed 

In some scenarios, you might need to meet a tight deadline, for example, your organization might need to urgently move from the previous SIEM due to a license expiration event. 

Review the components and factors that determine the speed of your migration.
- [Data source](#data-source)
- [Compute power](#compute-power)
- [Target platform](#target-platform)

#### Data source

The data source is typically a local file system or cloud storage, for example, S3. A server's storage performance depends on multiple factors, such as disk technology (SSD vs HDD), the nature of the IO requests, and the size of each request.

For example, Azure virtual machine performance ranges from 30 MB per second on smaller VM SKUs, to 20 GB per second for some of the storage-optimized SKUs using NVM Express (NVMe) disks. Learn how to [design your Azure VM for high storage performance](../virtual-machines/premium-storage-performance.md). You can also apply most concepts to on-premises servers. 

#### Compute power 

In some cases, even if your disk is capable of copying your data quickly, compute power is the bottleneck in the copy process. In these cases, you can choose one these scaling options: 

- **Scale vertically**. You increase the power of a single server by adding more CPUs, or increase the CPU speed.
- **Scale horizontally**. You add more servers, which increases the parallelism of the copy process.  

#### Target platform 

Each of the target platforms discussed in this section has a different performance profile.

- **Azure Monitor Basic logs**. By default, Basic logs can be pushed to Azure Monitor at a rate of approximately 1 GB per minute. This rate allows you to ingest approximately 1.5 TB per day or 43 TB per month.
- **Azure Data Explorer**. Ingestion performance varies, depending on the size of the cluster you provision, and the batching settings you apply. [Learn about ingestion best practices](/azure/data-explorer/kusto/management/ingestion-faq), including performance and monitoring. 
- **Azure Blob Storage**. The performance of an Azure Blob Storage account can greatly vary depending on the number and size of the files, job size, concurrency, and so in. [Learn how to optimize AzCopy performance with Azure Storage](/azure/data-explorer/kusto/management/ingestion-faq).  

### Amount of data

The amount of data is the main factor that affects the duration of the migration process. You should therefore consider how to set up your environment depending on your data set. 

To determine the minimum duration of the migration and where the bottleneck could be, consider the amount of data and the ingestion speed of the target platform. For example, you select a target platform that can ingest 1 GB per second, and you have to migrate 100 TB. In this case, your migration will take a minimum of 100,000 GB, multiplied by the 1 GB per second speed. Divide the result by 3600, which calculates to 27 hours. This calculation is correct if the rest of the components in the pipeline, such as the local disk, the network, and the virtual machines, can perform at a speed of 1 GB per second.

## Next steps

In this article, you learned how to map your migration rules from QRadar to Microsoft Sentinel. 

> [!div class="nextstepaction"]
> [Select a data ingestion tool](migration-ingestion-tool.md)
