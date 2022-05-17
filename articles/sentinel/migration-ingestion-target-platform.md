---
title: TBD | Microsoft Docs
description: TBD
author: limwainstein
ms.author: lwainstein
ms.topic: how-to
ms.date: 05/03/2022
ms.custom: ignite-fall-2021
---

# Select a target Azure platform to host the exported data 

In this section, we explain the different ways available to transfer the data to the selected target platform. In the next section, we will go into details on how the end-to-end process works for several SIEM vendors.

What data is needed to support your use cases? [JS] "uses case" in SIEM world is equivalent to detection. You would not use historical data for detections. I guess this point is about what data needs to be migrated from old SIEM?
Do all your current data sources provide valuable data? [JS] I think this is the same as previous point
Are there visibility gaps in your current SIEM? [JS] This wouldn't influence your historical data migration, but rather the addition of new data sources in the new SIEM
For each data source, do you need to migrate raw logs (which might be costly), or do enriched alerts have enough context for your key use cases? [JS] This question goes back to the first one, what data needs to be migrated and why
What’s your target storage for the data? [JS] I'm good with this
What storage tool do you want to use? [JS] "Storage tool" is not the right term. Should be migration tool or data transfer tool

One of the important decisions you’ll have to make, already in the design phase, is the final destination of your historical data. Making that decision involves several considerations and requires some understanding of the various alternatives. We will start reviewing the different options in terms of target platform for the logs. For each target platform, we will discuss Performance, Cost, Usability and Management overhead. 

## Azure Monitor Basic Logs/Archive 

Azure Monitor Logs offers the option to ingest data in two different plans: Analytics and Basic Logs. 

Basic logs plan is tailored to high-volume verbose logs with very low security value, where you don’t need to run heavy analytics or trigger analytics rules on. With Basic Logs, you can use most of the existing Azure Monitor Logs experiences at a lower cost, making them a great candidate to be the destination of your historical logs. 

Basic logs are retained for 8 days and then automatically transferred into Archive tier (for as long as the original retention was set). To query logs in the archive tier, you can use the Search feature to easily search across petabytes of data to find specific events in your historical logs. 

In cases where you need to run a deep investigation on a specific time range, you also have the option to restore data sitting in archive. The restore operation brings the data back into hot cache for full fledge analytics.  

Performance: We will focus on the performance of logs stored in archive as this is how you would normally interact with logs ingested as Basic. As explained above, this access is done through Search jobs. These jobs are asynchronous queries that fetch records into a new search table within your workspace for further analytics. The search job uses parallel processing and can run for hours (up to 24 hours) across extremely large datasets. Therefore, it fits the typical needs for historical data, where access needs to be maintained but where readiness of the data doesn’t need to be immediate. 

Costs: There are two main cost components in Basic logs: ingestion cost and archival cost. Every GB of data ingested into Basic logs is subject to ingestion costs into Microsoft Sentinel and Azure Monitor Logs which sum up to around $1/GB (see pricing details here). The second cost component is archival, which is incurred by data in the archive tier and is around $0.02/GB per month (see all pricing details here under Log Data Archive).   

Usability: Using Basic Logs, Archive and Search is the simplest of all the options as all these features live within Microsoft Sentinel. 

Management overhead: Search and Archive don’t add any management overhead as they are fully managed by Microsoft. 

In summary, Basic logs offers a very solid option as the destination of historical data as it provides competitive ingestion costs (see prices), while making it very easy to search across the data and restore it if needed. Also, Basic logs are integrated in the Microsoft Sentinel experience with no additional infrastructure or services to maintain and no management overhead. 

## Azure Data Explorer

Azure Data Explorer (ADX) is a big data analytics platform that is highly optimized for all types of logs and telemetry data analytics. ADX uses Kusto Query Language (KQL) as the query language, which is what we also use in Microsoft Sentinel. This is a great benefit as we can use the same queries in both, and even aggregate/correlate data stored across both. For example, from Microsoft Sentinel we can run a query that joins data stored in ADX with data stored in Log Analytics; see more about this feature here. 

From an infrastructure perspective, ADX is basically a cluster of virtual machines and as such is charged based on compute, storage and networking costs, plus an ADX markup (visit the pricing page for details). Therefore, the more nodes you add to your cluster and the more data you store, the higher the cost.  

ADX offers great flexibility as you have great control over how the cluster is sized and configured. For example, you can choose to create a bigger cluster to achieve higher ingestion throughput or create it smaller to control your costs. 

Performance: multiple factors contribute to ingestion and query performance of an ADX cluster: number of nodes in the cluster, cluster VM SKU, data partitioning, etc. As you add more nodes to the cluster, the performance will increase, but also the cost. You need to carefully size the cluster to find the sweet spot between performance and cost that works for your organization. This sweet spot will vary from one organization to another, highly dependent on how fast your migration needs to complete, how often the data is accessed and how quickly a response is expected. 

Costs: As explained earlier, ADX can be tuned to offer the desired performance. It also offers autoscaling capabilities to adapt to workload on demand. On top of this, ADX can benefit from Reserved Instance pricing. You can run your own cost calculations in the Azure Pricing Calculator.  

Usability: ADX is quite easy to use in the context of Microsoft Sentinel. You can for example have an Azure Workbook that visualizes data spread across both Microsoft Sentinel and ADX. You can also query ADX data from the Microsoft Sentinel portal using ADX proxy feature, which also allows correlating data from both datastores.  

Management overhead: ADX adds some management overhead to your solution as you will have a platform that is external to Microsoft Sentinel and needs to be monitored and maintained. 

## Azure Blob Storage

Blob storage is optimized for storing massive amounts of unstructured data. In the context of historical data migration, Blob storage offers very competitive costs and should be considered in situations where you don’t need great accessibility to the data or high performance. This normally happens in cases where the main driver for migration is compliance or audit requirements. 

Accessing the data stored in Blob Storage can be more difficult when working in Sentinel. For this, you need to use externaldata operator, which requires you to specify the URL for every blob that needs to be accessed. This can become quite cumbersome if frequent access is required. Some examples on how to use this command in the Microsoft Sentinel context can be found here. 

Performance: Azure Blob Storage offers two performance tiers: Premium or Standard. Although both tiers are an option for long-term storage, Standard is generally chosen due to greater cost savings. Here you can see the different performance and scalability limits for storage accounts and here the specifics about blob storage. 

Costs: Blob storage is the cheapest of the options presented in this article if the right setup is implemented. In this article you can see all the details on how blob is charged and the different optimizations that can be done. It’s important to call out the ability to implement automatic lifecycle of the data so older blobs move into cheaper access tiers. 

Usability: usability is the biggest concern when choosing Azure Blob as your long-term storage option. In historical data migrations you will probably end up with millions of files, which makes it more challenging to explore the data, being the externaldata operator in KQL the recommended option. You can see more details about the usage of this operator in this blog post. 

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