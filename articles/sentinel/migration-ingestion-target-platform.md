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
|**Usability**:     |**Great**<br><br>The archive and search options reside in Microsoft Sentinel, simplifying access to these options. |**Good**<br><br>Fairly easy to use in the context of Microsoft Sentinel. For example, you can use an Azure workbook to visualize data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using the [ADX proxy](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).  |**Fair**<br><br>While using the `externaldata` operator is very challenging with large numbers of blobs to reference, using external ADX tables eliminates this issue. The external table definition understands the blob storage folder structure, and allows you to transparently query the data contained in many different blobs and folders.     |**Poor**<br><br>With historical data migrations, you might have to deal with millions of files, and exploring the data becomes a challenge. |
|**Management overhead**:     |**Fully managed**<br><br>The search and archive options are managed by Microsoft, so these options do not add management overhead.         |**High**<br><br>ADX is external to Microsoft Sentinel, which requires monitoring and maintenance.        |**Medium**<br><br>With this option, you maintain and monitor ADX and Azure Blob Storage, both of which are external components to Microsoft Sentinel. While ADX can be shut down at times, we recommend to consider the additional management with this option.          |**Low**<br><br>While this platform requires very little maintenance, selecting this platform adds monitoring and configuration tasks, such as setting up lifecycle management. |
|**Performance**:     |**Medium**<br><br>You typically interact with basic logs within the archive using [search jobs](/azure/azure-monitor/logs/search-jobs), which are suitable when you want to maintain access to the data, but do not need immediate access to the data.         |**High to low**<br><br>- The query performance of an ADX cluster depend on multiple factors, including the number of nodes in the cluster, the cluster virtual machine SKU, data partitioning, and more.<br>- As you add nodes to the cluster, the performance increases, together with the cost.<br>- If you use ADX, we recommend that you configure your cluster size to balance performance and cost. This depends on your organizations needs, including how fast your migration needs to complete, how often the data is accessed, and the expected response time.         |**Low**<br><br>Because Blob Storage resides at the same location as the data, you can expect the same performance as with Azure Blob Storage.         |**Low**<br><br>offers two performance tiers: Premium or Standard. Although both tiers are an option for long-term storage, Standard is more cost-efficient. Learn about performance and scalability limits. |
|**Cost**:     |**Highest**<br><br>The cost is comprised of two components: - **Ingestion cost**: Every GB of data ingested into Basic Logs is subject to Microsoft Sentinel and Azure Monitor Logs ingestion costs, which sum up to approximately $1/GB. See the [pricing details](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).<br> - **Archival cost**: This is the cost for data in the archive tier, and sums up to approximately $0.02/GB per month. See the [pricing details](https://azure.microsoft.com/pricing/details/monitor/).         |**High to low**<br><br>- Because ADX is a cluster of virtual machines, you are charged based on compute, storage and networking usage, plus an ADX markup (see the [pricing details](https://azure.microsoft.com/pricing/details/data-explorer/). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost.<br>- ADX also offers autoscaling capabilities to adapt to workload on demand. On top of this, ADX can benefit from Reserved Instance pricing. You can run your own cost calculations in the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/).         |**Low**<br><br>The cluster size does not affect the cost, because ADX only acts as a proxy. In addition, you need to run the cluster only when you need quick and simple access to the data.         |**Low**<br><br>With optimal setup, this is the option with the lowest costs. In addition, the data works in an automatic lifecycle, so older blobs move into lower-cost access tiers. |
|How to access data     |**Search jobs**         |**Direct KQL queries**         |**Modified KQL data**         |**externaldata** |
|Scenario     |**Occasional access**<br><br>Relevant in scenarios where you don’t need to run heavy analytics or trigger analytics rules.    |**Frequent access**         |**Occasional access**         |**Compliance/audit**<br><br>- Optimal for storing massive amounts of unstructured data.<br>- Relevant in scenarios where you do not need quick access to the data or high performance, such as for compliance or audits. |
|**Complexity**:     |**Very low**         |**Medium**         |**High**         |**Low** |
|**Readiness**:     |**Public Preview**         |**GA**         |**GA**         |**GA** |

## General considerations 

Now that we know more about the possible target platforms, let’s review what additional factors should be considered. There are three main factors that will drive your decision: 

What will be the use of the migrated logs? 

How fast does the migration need to run? 

Migration costs during and after the migration 

Use of migrated logs 

Understanding how the migrated logs will be used is of vital importance, as it will narrow down the options. 

In general, there are three main scenarios: 

Need to keep the logs just for compliance or audit purposes: in this case, the data will rarely be accessed, and even if it needs to be accessed, we don’t need good performance or ease of use. 

Need to keep the logs so teams can access them frequently with decent performance and ease of use. 

Need to keep the logs so teams can access them occasionally and performance and ease of use are secondary 

At the end of this section, we provide a table that summarizes which platform fits with each of these scenarios. 

Migration speed 

How fast the migration needs to happen is also an important factor to take into account. In some situations, we have a tight deadline for the migration to finish as there might be a license expiration event that is forcing us to evacuate the previous SIEM platform. 

The speed of migration is determined by the different components that are part of it: 

Data source, normally a local filesystem or cloud storage (e.g. S3) 

Compute power copying and sending the data 

Target platform ingestion performance 

Amount of data 

Data source: storage performance on a server depends on multiple factors, like disk technology (SSD vs HDD), nature of the IO requests and the size of each request.  

Taking Azure VMs as an example, performance can go from around 30MB/sec on smaller VM SKUs, up to 20GB/sec for some of the storage optimized SKUs with NVMe disks. If this article you can see how you can design your Azure VM for high storage performance: Azure Premium Storage: Design for high performance - Azure Virtual Machines | Microsoft Docs, but most of the concepts can be also applied if your server is on premises. 

Compute power: sometimes, even if your disk is capable of copying the data at a great speed, compute power is the bottleneck in the copy process.  In those cases, there are two options, scale vertically or horizontally. Scaling vertically means increasing the power of a single server by adding more CPUs or increasing the speed of them, whereas scaling horizontally means adding more servers that can increase the parallelism of the copy process.  

Target platform: Each of the target platforms discussed above has a different performance profile.  

Azure Monitor Basic logs: By default, Basic logs can be pushed to Azure Monitor at a rate of approximately 1GB/minute. This would allow you to migrate around 1.5TB per day or 43TB per month. 

Azure Data Explorer: Ingestion performance can greatly vary depending on the size of the cluster you provision, and the batching settings applied. In this article you can see a discussion on best practices around ingestion including performance and monitoring. 

Storage: Performance of storage account can also greatly vary depending on the number and size of the files, job size, concurrency, etc. In this article you can see how to optimize the performance of AzCopy with Azure Storage.  

Amount of data: obviously, the more data you need to migrate, the longer the process will be if we keep the rest of the pipeline unchanged. That is why it is especially important that you consider how to set up your environment depending on the dataset at hand. Taking into account the amount of data and the ingestion speed of the target platform, you should be able to determine the minimum duration of the migration and where the bottleneck could be. For example, if we have a target platform that can ingest 1 GB/second, and we have to migrate 100 TB, the minimum migration time will be 100000 GB / 1 GB/sec / 3600 sec/hour » 27 hours. This is obviously if the rest of the components in the pipeline can perform at the same speed (1GB/sec), so other components like the local disk, the network and the VM should be able to sustain it. 

Costs 

We have already discussed costs for each of the different alternatives and this is also summarized in the table below.  

Summary table 

Based on these three factors, we can map out the corresponding recommended platforms: 

[Add table]