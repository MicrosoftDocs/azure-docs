---
title: Select a target Azure platform to host the exported historical data | Microsoft Docs
description: Select a target Azure platform to host the exported historical data 
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Select a target Azure platform to host the exported historical data 

One of the important decisions you make during your migration process regards the destination of your historical data. To make this decision, you need to understand and be able to compare the various alternatives. 

This article reviews a set of Azure platforms you can use for your historical logs, and compares them in terms of performance, cost, usability and management overhead.

|  |[Basic Logs](/azure/azure-monitor/logs/basic-logs-configure)  |[Azure Data Explorer (ADX)](#azure-data-explorer)  |ADX + Azure Blob Storage  |Azure Blob Storage |
|---------|---------|---------|---------|---------|
|**Features/benefits**: |- Leverage most of the existing Azure Monitor Logs experiences at a lower cost.<br>- Basic Logs are retained for 8 days, and are then automatically transferred to the archive (according to the original retention period).<br>- Use [search jobs](/azure/azure-monitor/logs/search-jobs) to search across petabytes of data and find specific events.<br>- For deep investigations on a specific time range, [restore data from the archive](/azure/azure-monitor/logs/restore). The data is then available in the hot cache for further analytics. |- Both ADX and Microsoft Sentinel use the Kusto Query Language (KQL), allowing you to query, aggregate, or correlate data in both platforms. For example, you can run a KQL query from Microsoft Sentinel to [join data stored in ADX with data stored in Log Analytics](/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).<br>- With ADX, you have substantial control over the cluster size and configuration. For example, you can create a larger cluster to achieve higher ingestion throughput, or create a smaller cluster to control your costs. |- Data is stored in a blob storage, which is low in costs.<br> - You use ADX to query the data in KQL, allowing you to easily access the data. [Learn how to query Azure Monitor data with ADX](/azure/azure-monitor/logs/azure-data-explorer-query-storage) |  
|**Usability**:     |**Great**<br><br>The archive and search options are simple to use and accessible from the Microsoft Sentinel portal. However, the data is not immediately available for queries. You need to perform a search to retrieve the data, which might take some time, depending on the amount of data being scanned and returned. |**Good**<br><br>Fairly easy to use in the context of Microsoft Sentinel. For example, you can use an Azure workbook to visualize data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using the [ADX proxy](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).  |**Fair**<br><br>While using the `externaldata` operator is very challenging with large numbers of blobs to reference, using external ADX tables eliminates this issue. The external table definition understands the blob storage folder structure, and allows you to transparently query the data contained in many different blobs and folders.     |**Poor**<br><br>With historical data migrations, you might have to deal with millions of files, and exploring the data becomes a challenge. |
|**Management overhead**:     |**Fully managed**<br><br>The search and archive options are fully managed and do not add management overhead.    |**High**<br><br>ADX is external to Microsoft Sentinel, which requires monitoring and maintenance.        |**Medium**<br><br>With this option, you maintain and monitor ADX and Azure Blob Storage, both of which are external components to Microsoft Sentinel. While ADX can be shut down at times, we recommend to consider the additional management with this option.          |**Low**<br><br>While this platform requires very little maintenance, selecting this platform adds monitoring and configuration tasks, such as setting up lifecycle management. |
|**Performance**:     |**Medium**<br><br>You typically interact with basic logs within the archive using [search jobs](/azure/azure-monitor/logs/search-jobs), which are suitable when you want to maintain access to the data, but do not need immediate access to the data.         |**High to low**<br><br>- The query performance of an ADX cluster depend on multiple factors, including the number of nodes in the cluster, the cluster virtual machine SKU, data partitioning, and more.<br>- As you add nodes to the cluster, the performance improves, together with the cost.<br>- If you use ADX, we recommend that you configure your cluster size to balance performance and cost. This depends on your organizations needs, including how fast your migration needs to complete, how often the data is accessed, and the expected response time.         |**Low**<br><br>Because Blob Storage resides at the same location as the data, you can expect the same performance as with Azure Blob Storage.         |**Low**<br><br>offers two performance tiers: Premium or Standard. Although both tiers are an option for long-term storage, Standard is more cost-efficient. Learn about performance and scalability limits. |
|**Cost**:     |**Highest**<br><br>The cost is comprised of two components: - **Ingestion cost**: Every GB of data ingested into Basic Logs is subject to Microsoft Sentinel and Azure Monitor Logs ingestion costs, which sum up to approximately $1/GB. See the [pricing details](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).<br> - **Archival cost**: This is the cost for data in the archive tier, and sums up to approximately $0.02/GB per month. See the [pricing details](https://azure.microsoft.com/pricing/details/monitor/).<br>In addition to these two cost components, if you need frequent access to the data, take into account additional costs when you access data via search jobs.     |**High to low**<br><br>- Because ADX is a cluster of virtual machines, you are charged based on compute, storage and networking usage, plus an ADX markup (see the [pricing details](https://azure.microsoft.com/pricing/details/data-explorer/). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost.<br>- ADX also offers autoscaling capabilities to adapt to workload on demand. On top of this, ADX can benefit from Reserved Instance pricing. You can run your own cost calculations in the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/).         |**Low**<br><br>The cluster size does not affect the cost, because ADX only acts as a proxy. In addition, you need to run the cluster only when you need quick and simple access to the data.         |**Low**<br><br>With optimal setup, this is the option with the lowest costs. In addition, the data works in an automatic lifecycle, so older blobs move into lower-cost access tiers. |
|How to access data     |**Search jobs**         |**Direct KQL queries**         |**Modified KQL data**         |**externaldata** |
|Scenario     |**Occasional access**<br><br>Relevant in scenarios where you don’t need to run heavy analytics or trigger analytics rules.    |**Frequent access**         |**Occasional access**         |**Compliance/audit**<br><br>- Optimal for storing massive amounts of unstructured data.<br>- Relevant in scenarios where you do not need quick access to the data or high performance, such as for compliance or audits. |
|**Complexity**:     |**Very low**         |**Medium**         |**High**         |**Low** |
|**Readiness**:     |**Public Preview**         |**GA**         |**GA**         |**GA** |

## General considerations 

Now that you know more about the available target platforms, review these main factors to finalize your decision. 

- [How will your organization use the ingested logs?](#use-of-ingested-logs)
- [How fast does the migration need to run?](#migration-speed)
- [What is the amount of data to ingest?](#amount-of-data)
- What are the estimated migration costs, during and after migration? See the [platform comparison](#select-a-target-azure-platform-to-host-the-exported-historical-data) to compare the costs. 

##### Use of ingested logs 

Define how your organization will use the ingested logs to guide your selection of the ingestion platform.  

Consider these three general scenarios: 

- Your organization needs to keep the logs only for compliance or audit purposes. In this case, your organization will rarely access the data. Even if your organization accesses the data, high performance or ease of use are not a priority.
- Your organization needs to retain the logs so that your teams can access the logs easily and fairly quickly.
- Your organization needs to retain the logs so that your teams can access the logs occasionally. Performance and ease of use are secondary. 

See the [platform comparison](#select-a-target-azure-platform-to-host-the-exported-historical-data) to understand which platform suits each of these scenarios. 

#### Migration speed 

In some scenarios, you might need to meet a tight deadline, for example, your organization might need to urgently move from the previous SIEM due to a license expiration event. 

Review the components and factors that determine the speed of your migration.
- [Data source](#data-source)
- [Compute power](#compute-power)
- [Target platform](#target-platform)

##### Data source

The data source is typically a local filesystem or cloud storage, for example, S3. A server's storage performance depends on multiple factors, such as disk technology (SSD vs HDD), the nature of the IO requests, and the size of each request.

For example, Azure virtual machine performance ranges from 30MB per second on smaller VM SKUs, to 20GB per second for some of the storage-optimized SKUs using NVM Express (NVMe) disks. Learn how to [design your Azure VM for high storage performance](/azure/virtual-machines/premium-storage-performance). Most concepts can also be applied to premises servers. 

#### Compute power 

In some cases, even if your disk is capable of copying your data quickly, compute power is the bottleneck in the copy process. In these cases, you can choose one these scaling options: 

- Scale vertically: You increase the power of a single server by adding more CPUs, or increasing the CPU speed
- Scale horizontally: Add more servers that can increase the parallelism of the copy process.  

##### Target platform 

Each of the target platforms discussed in this section has a different performance profile.

- **Azure Monitor Basic logs**: By default, Basic logs can be pushed to Azure Monitor at a rate of approximately 1GB per minute. This allows you to ingest approximately 1.5TB per day or 43TB per month.
- **Azure Data Explorer**: Ingestion performance varies, depending on the size of the cluster you provision, and the batching settings you apply. [Learn about ingestion best practices](/azure/data-explorer/kusto/management/ingestion-faq), including performance and monitoring. 

Performance of your storage account can also greatly vary depending on the number and size of the files, job size, concurrency, and so in. [Learn how to optimize AzCopy performance with Azure Storage](https://docs.microsoft.com/azure/data-explorer/kusto/management/ingestion-faq).  

#### Amount of data

The amount of data is the main factor that affects the duration of the migration process, if you do not change the rest of your pipeline. You should therefore consider how to set up your environment depending on your data set. 

To determine the minimum duration of the migration and where the bottleneck could be, consider the amount of data and the ingestion speed of the target platform. For example, if you select a target platform that can ingest 1 GB per second, and you have to migrate 100 TB, your migration will take a minimum of 100000 GB, multiplied by the 1 GB per second speed. Divide the result by 3600, which calculates to 27 hours. This is correct if the rest of the components in the pipeline, such as the local disk, the network, and the virtual machines, can perform at a speed of 1 GB per second.