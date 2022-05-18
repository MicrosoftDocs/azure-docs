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

|  |[Basic Logs](#azure-monitor-basic-logs)  |[Azure Data Explorer (ADX)](#azure-data-explorer)  |ADX + Azure Blob Storage  |Azure Blob Storage |
|---------|---------|---------|---------|---------|
|Usability     |**Great**<br><br>The archive and search options reside in Microsoft Sentinel, simplifying access to these options. |**Good**<br><br>Fairly easy to use in the context of Microsoft Sentinel. For example, you can use an Azure workbook to visualize data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using the [ADX proxy](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).  |**Fair**<br><br>While using the `externaldata` operator is very challenging with large numbers of blobs to reference, using external ADX tables eliminates this issue. The external table definition understands the blob storage folder structure, and allows you to transparently query the data contained in many different blobs and folders.     |**Poor**<br><br>With historical data migrations, you might have to deal with millions of files, and exploring the data becomes a challenge. |
|Management overhead     |**Fully managed**<br><br>The search and archive options are managed by Microsoft, so these options do not add management overhead.         |**High**<br><br>ADX is external to Microsoft Sentinel, which requires monitoring and maintenance.        |**Medium**<br><br>With this option, you maintain and monitor ADX and Azure Blob Storage, both of which are external components to Microsoft Sentinel. While ADX can be shut down at times, we recommend to consider the additional management with this option.          |
|Performance     |**Medium**<br><br>You typically interact with basic logs within the archive using [search jobs](/azure/azure-monitor/logs/search-jobs), which are suitable when you want to maintain access to the data, but do not need immediate access to the data.         |**High to low**<br><br>- The query performance of an ADX cluster depend on multiple factors, including the number of nodes in the cluster, the cluster virtual machine SKU, data partitioning, and more.<br>- As you add nodes to the cluster, the performance increases, together with the cost.<br>- If you use ADX, we recommend that you configure your cluster size to balance performance and cost. This depends on your organizations needs, including how fast your migration needs to complete, how often the data is accessed, and the expected response time.         |**Low**<br><br>Because Blob Storage resides at the same location as the data, you can expect the same performance as with Azure Blob Storage.         |
|Cost     |**Highest**<br><br>The cost is comprised of two components: - **Ingestion cost**: Every GB of data ingested into Basic Logs is subject to Microsoft Sentinel and Azure Monitor Logs ingestion costs, which sum up to approximately $1/GB. See the [pricing details](https://azure.microsoft.com/pricing/details/microsoft-sentinel/).<br> - **Archival cost**: This is the cost for data in the archive tier, and sums up to approximately $0.02/GB per month. See the [pricing details](https://azure.microsoft.com/pricing/details/monitor/).         |**High to low**<br><br>- Because ADX is a cluster of virtual machines, you are charged based on compute, storage and networking usage, plus an ADX markup (see the [pricing details](https://azure.microsoft.com/pricing/details/data-explorer/). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost.<br>- ADX also offers autoscaling capabilities to adapt to workload on demand. On top of this, ADX can benefit from Reserved Instance pricing. You can run your own cost calculations in the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/).         |**Low**<br><br>The cluster size does not affect the cost, because ADX only acts as a proxy. In addition, you need to run the cluster only when you need quick and simple access to the data.         |
|How to access data     |**Search jobs**         |**Direct KQL queries**         |**Modified KQL data**         |
|Scenario     |**Occasional access**         |**Frequent access**         |**Occasional access**         |
|Complexity     |**Very low**         |**Medium**         |**High**         |
|Readiness     |**Public Preview**         |**GA**         |**GA**         |


## Azure Monitor Basic Logs

The Azure Monitor [Basic Logs](/azure/azure-monitor/logs/basic-logs-configure) plan is suitable for high-volume verbose logs with very low security value, in a scenario where you don’t need to run heavy analytics or trigger analytics rules. With Basic Logs, you can use most of the existing Azure Monitor Logs experiences at a lower cost. 

Here are a few main features and capabilities of Basic Logs:

- Basic Logs are retained for 8 days, and are then automatically transferred to the archive. The logs are retained in the archive according to the original retention period. 
- You can use a [search job](/azure/azure-monitor/logs/search-jobs) to easily search across petabytes of data and find specific events. 
- If you need to run a deep investigation on a specific time range, you can [restore data from the archive](/azure/azure-monitor/logs/restore), which makes the selected data available in the hot cache for further analytics.  

You can evaluate Basic Logs according to the following criteria: 

- **Performance**: You typically interact with basic logs within the archive using search jobs. Search jobs are asynchronous queries that import records into a new search table in your workspace, which you can use for further analytics. Search jobs use parallel processing and can run for up to 24 hours across extremely large datasets. This is suitable when dealing with historical data, where you typically want to maintain access to the data, but do not need the data to be ready immediately.
- **Costs**: The cost of Basic Logs is comprised of two components:
    - **Ingestion cost**: Every GB of data ingested into Basic Logs is subject to Microsoft Sentinel and Azure Monitor Logs ingestion costs, which sum up to approximately $1/GB. See the [pricing details](https://azure.microsoft.com/en-us/pricing/details/microsoft-sentinel/.
    - **Archival cost**: This is the cost for data in the archive tier, and sums up to approximately $0.02/GB per month. See the [pricing details](https://azure.microsoft.com/en-us/pricing/details/monitor/).
- **Usability**: The archive and search options reside in Microsoft Sentinel, simplifying access to these options.
- **Management overhead**: The search and archive options are managed by Microsoft, so these options do not add management overhead. 

To conclude, if you select Basic Logs, you benefit from [competitive ingestion costs](https://azure.microsoft.com/en-us/pricing/details/monitor/), easily search across your data and restore data as needed. In addition, you use Basic Logs as part of your Microsoft Sentinel experience, with no additional maintenance for infrastructure or services, and no management overhead. 

## Azure Data Explorer

Azure Data Explorer (ADX) is a big data analytics platform that is highly optimized for all types of logs and telemetry data analytics. 

Here are some main ADX features and capabilities:
- Because both ADX and Microsoft Sentinel both use the Kusto Query Language (KQL), you can use the same queries in both ADX and Microsoft Sentinel, and even aggregate or correlate data in both platforms. For example, you can run a KQL query from Microsoft Sentinel to [join data stored in ADX with data stored in Log Analytics](/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy).
- With ADX, you have substantial control over how the cluster is sized and configured. For example, you can create a larger cluster to achieve higher ingestion throughput, or create a smaller cluster to control your costs. 

You can evaluate ADX according to the following criteria: 

- **Performance**: Multiple factors contribute to the ingestion and query performance of an ADX cluster, including the number of nodes in the cluster, the cluster virtual machine SKU, data partitioning, and more. As you add nodes to the cluster, the performance increases, together with the cost. If you use ADX, we recommend that you configure your cluster size to balance performance and cost. This depends on your organizations need, including how fast your migration needs to complete, how often the data is accessed, and the expected response time. 
- **Costs**: Because ADX comprises a cluster of virtual machines, you are charged based on compute, storage and networking usage, plus an ADX markup (see the [pricing details](https://azure.microsoft.com/en-us/pricing/details/data-explorer/). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost. ADX also offers autoscaling capabilities to adapt to workload on demand. On top of this, ADX can benefit from Reserved Instance pricing. You can run your own cost calculations in the [Azure Pricing Calculator](https://azure.microsoft.com/en-us/pricing/calculator/).  
- **Usability**: ADX is fairly easy to use in the context of Microsoft Sentinel. For example, you can use an Azure workbook to visualize data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using the [ADX proxy](https://docs.microsoft.com/en-us/azure/azure-monitor/logs/azure-monitor-data-explorer-proxy) feature, which also allows you to correlate data from both platforms.  
- **Management overhead**: ADX is external to Microsoft Sentinel, which adds some management overhead and requires monitoring and maintenance. 

## Azure Blob Storage

Azure Blob Storage is optimal for storing massive amounts of unstructured data. In the context of historical data migration, Azure Blob Storage offers very competitive costs. Consider this platform in a scenario where you do not need simple accessibility to the data or high performance, for example, if your migration is driven by compliance or audit requirements. 

Performance: Azure Blob Storage offers two performance tiers: Premium or Standard. Although both tiers are an option for long-term storage, Standard is generally chosen due to greater cost savings. Here you can see the different performance and scalability limits for storage accounts and here the specifics about blob storage. 

Costs: Blob storage is the cheapest of the options presented in this article if the right setup is implemented. In this article you can see all the details on how blob is charged and the different optimizations that can be done. It’s important to call out the ability to implement automatic lifecycle of the data so older blobs move into cheaper access tiers. 

Usability: usability is the biggest concern when choosing Azure Blob as your long-term storage option. In historical data migrations you will probably end up with millions of files, which makes it more challenging to explore the data, being the externaldata operator in KQL the recommended option. You can see more details about the usage of this operator in this blog post. 

Accessing the data stored in Blob Storage can be more difficult when working in Sentinel. For this, you need to use externaldata operator, which requires you to specify the URL for every blob that needs to be accessed. This can become quite cumbersome if frequent access is required. Some examples on how to use this command in the Microsoft Sentinel context can be found here. 


Management overhead: Blob storage requires very little maintenance although it will add additional monitoring and configuration tasks like setting up lifecycle management. 

## Azure Blob Storage + Azure Data Explorer

This option is explained in this article in detail. The idea is that the data is stored in blob storage, but we use ADX to query the data (using external tables), as it allows us to use KQL commands.  

This architecture allows you to benefit from the low cost of blob storage, while keeping an easy way to access the data. Obviously, the performance would be limited to the one from Blob storage. 

Performance: As Blob Storage is where the data resides, you can expect the same performance as with Blob Storage without ADX in the mix. 

Costs: In this architecture, ADX plays a very important role, but the good news is that the size of the cluster doesn’t matter because ADX only acts as a proxy. On top of that, the cluster doesn’t need to be running all the time, but only when easy access to the data is needed.  

Usability: usability is the biggest concern when choosing Azure Blob as the target platform to store historical logs. This is mainly because using externaldata operator makes it very challenging when you have a big number of blobs to reference. Using ADX to query the data, we eliminate that burden using external tables in ADX. The external table definition understands the folder structure in the blob storage account and allows us to query the data contained in many different blobs and folders transparently. 

Management overhead: In this option you have to maintain and monitor two external components to Microsoft Sentinel (ADX + Blob storage). Although this is minimized by the fact that ADX can be shut down at times, still should be considered as additional management to take place. 

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