---
title: Premium performance tier for Azure block blob storage
description: Achieve lower and consistent latencies for Azure Storage workloads that require fast and consistent response times.
author: normesta

ms.author: normesta
ms.date: 10/11/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual

---

# Premium performance tier for Azure block blob storage

The premium performance tier makes data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives.

This tier is ideal for workloads that require fast and consistent response times and/or require a high number of input output operations per second (IOP). Storage costs are higher, but transaction costs are lower. This means that if your workloads execute a large number of transactions, this tier can be economical. 

The premium performance tier is available for block blob, page blob, and file shares. This article focuses on premium performance tier in a block blob storage account. 

## Performance characteristics

Data is stored on instantly accessible memory chips and that makes file transfer much faster. This type of storage makes all parts of a drive accessible at once. By contrast, the performance of a hard disk drive (HDD) depends on the proximity of data to the read/write heads. 

Low latency is critical to various industries and to various types of applications. Highly interactive and real-time applications that must write data quickly. Interactive editing or multi-player online gaming applications maintain a quality experience by providing real-time updates. In the financial services sector, a fraction of a second could be the difference between making or losing massive sums of money.

## Cost effectiveness
  
The premium performance tier has a higher storage cost but a lower transaction cost as compared to the standard performance tier. If your applications and workloads execute a large number of transactions, the premium performance tier can be cost-effective, especially if the workload is write-heavy.

In most cases, workloads executing more than 35 to 40 transactions per second per terabyte (TPS/TB) are good candidates for this performance tier. For example, if your workload executes 500 million read operations and 100 million write operations in a month, then you can calculate the TPS/TB as follows: 

- Write transactions per second = 100,000,000 / (30 x 24 x 60 x 60) = **39** (_rounded to the nearest whole number_) 

- Read transactions per second = 500,000,000 / (30 x 24 x 60 x 60) = **193** (_rounded to the nearest whole number_)

- Total transactions per second = **193** + **39** = **232** 

- Assuming your account had **5TB** data on average, then TPS/TB would be **230 / 5** = **46**. 

> [!NOTE]
> Prices differ per operation and per region. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to compare pricing between standard and premium performance tiers. 

The following table demonstrates the cost-effectiveness of the premium performance tier. The numbers in this table are based on a Azure Data Lake Storage Gen2 enabled storage account. Each column represents the number of transactions in a month. Each row represents the percentage of transactions that are read transactions. Each cell in the table shows the percentage of cost reduction associated with a read transaction percentage and the number of transactions executed.

For example, assuming that your account is in the East US 2 region, the number of transactions with your account exceeds 90M, and 70% of those transactions are read transactions, the premium performance tier is more cost-effective.

> [!div class="mx-imgBorder"]
> ![Performance table](./media/storage-blob-performance-tiers/premium-performance-data-lake-storage-cost-analysis-table.png)

> [!NOTE]
> If you prefer to evaluate cost effectiveness based on the number of transactions per second for each TB of data, you can use the column headings that appear at the bottom of the table.

## Premium scenarios

This section highlights the following real-world examples of how Azure Storage customers use the premium performance tier. 

- [Fast data hydration](#fast-data-hydration)
- [Interactive editing applications](#interactive-editing-applications)
- [Data visualization software](#data-visualization-software)
- [E-commerce businesses](#e-commerce-businesses)
- [Interactive analytics](#interactive-analytics)
- [Data processing pipelines](#data-processing-pipelines)
- [Internet of Things (IoT)](#internet-of-things-iot)
- [Machine Learning](#machine-learning)
- [Real-time streaming analytics](#real-time-streaming-analytics)

### Fast data hydration

The premium performance tier can help you *hydrate* or bring up your environment quickly. In industries such as banking, certain regulatory requirements might require companies regularly tear down their environments, and then bring them back up from scratch. The data used to hydrate their environment must load quickly. 

One of our customers stores a copy of their MongoDB instance each week to an account that uses the premium performance tier. The system is then torn down. To get the system back online quickly again, the latest copy of the MangoDB instance is read and loaded. For audit purposes, previous copies are maintained in cloud storage for a period of time.

### Interactive editing applications

In applications where multiple users edit the same content, the speed of updates becomes critical for a smooth user experience. 

One of our customers develops video editing software. Any update that a user makes is immediately visible to other users. Users can focus on their tasks instead of waiting for content updates to appear. The low latencies associated with the premium performance tier helps to create this seamless and collaborative experience.  

### Data visualization software

Data analysts can be far more productive with data visualization software if rendering time is quick. 
 
One of our customers is in the mapping industry. They use a mapping editor to detect issues with maps. The editor uses data that is generated from customer Global Positioning System (GPS) data. To create map overlaps, the editing software renders small sections of a map by quickly performing key looks-ups. 

Before using the premium performance tier, they used HDInsight with HBase backed by storage that used the standard performance tier. However, it became expensive to keep large clusters running all of the time. This customer decided to move away from this architecture, and instead use the premium performance tier for fast key looks-ups. To create overlaps, the customer used REST APIs to render tiles corresponding to GPS coordinates. The premium performance tier provided them with a cost-effective solution, and latencies were far more predictable.

### E-commerce businesses

In addition to supporting their customer facing stories, e-commerce businesses also provide data warehousing and analytics solutions to internal teams. One of our customers uses the premium performance tier to support the low latency requirements by these data warehousing and analytics solutions. Their catalog team maintains a data warehousing application for data that pertains to offers, pricing, ship methods, suppliers, inventory, and logistics. Information is queried, scanned, extracted, and mined for multiple use cases. The team runs analytics on this data to provide various merchandising teams with relevant insights and information. 

### Interactive analytics

In almost every industry, there is a need for enterprises to query and analyze their data interactively. 

Data scientists, analysts, and developers can derive time-sensitive insights faster by running queries on data that is stored in an account that uses the premium performance tier. Executives can load their dashboards much more quickly when the data that appears in those dashboards come from a storage account that uses the premium performance tier instead of the standard performance tier. 

One of our customers uses Presto and Spark to produce insights from hive tables. They must analyze telemetry data from millions of devices quickly to better understand how their products are used, and to make product release decisions. They scale storage and compute independently to allow for petabyte scale data and point access to their data. 

Storing data in SQL databases is expensive. To reduce cost, and to increase queryable surface area, they use an Azure Data Lake Storage Gen2 enabled account that uses the premium performance tier and perform computation in Presto and Spark. This way, even rarely accessed data has all of the power of compute that frequently accessed data has. 

To close the gap between SQL's subsecond performance and Presto input output operations per second (IOPs) to external storage, consistency and speed are critical, especially when dealing with small optimized row columnar (ORC) files. The premium performance tier when used in a Data Lake Storage Gen2 enabled account, has repeatedly demonstrated a 3X performance improvement over the standard performance tier in this scenario. Queries executed fast enough to feel local to the compute machine. 

Another customer stores and queries logs that are generated from their security solution. The logs are generated by using Databricks, and then and stored in a Data Lake Storage Gen2 enabled account that uses the premium performance tier. End users query and search this data by using Azure Data Explorer. This customer chose this tier to reduce cost, increase stability, and increase the performance of interactive queries. The customer also sets the life cycle management `Delete Action` policy to a few days, which helps to reduce costs. This policy prevents them from keeping the data forever. Instead, data is deleted once it is no longer needed. 

### Data processing pipelines

In almost every industry, there is a need for enterprises to process data. Raw data from multiple sources needs to be cleansed and processed so that it becomes useful for downstream consumption in things like data dashboards that help users make decisions. 

While speed of processing is not always the top concern when processing data, some industries require it. For example, companies in the financial services industry often need to process data reliably and in the quickest way possible. To detect fraud, those companies must process inputs from various sources, identify risks to their customers, and take swift action. 

One of our customers uses multiple storage accounts to stores data from various sources. They then move some of this data to a Data Lake Storage enabled storage account that uses the premium performance tier where a data processing application frequently reads newly arriving data. Directory listing calls in this account were much faster and performed much more consistently than they would otherwise perform in an account that uses the standard performance tier. This speed ensured that newly arrived data was made available to downstream processing systems as quickly as possible. This helped them to catch and then act upon potential security risks promptly.
     
### Internet of Things (IoT)

IoT has become a significant part of our daily lives. IoT is used to track car movements, control lights, and monitor our health. It also has industrial applications. For example, companies use IoT to enable their smart factory projects, improve agricultural output, and on oil rigs for predictive maintenance. The premium performance tier adds significant value to these scenarios.
 
One of our customers is in the mining industry. They use a Data Lake Storage Gen2 enable account and the premium performance tier along with HDInsight (Hbase) to ingest time series sensor data from multiple mining equipment types, with a very taxing load profile. The premium performance tier has helped to satisfy their need to for high sample rate ingestion. It's also very cost effective, because the premium performance tier is cost optimized for workloads that produce a large number of write transactions, and this workload generates a large number of small write transactions (in the tens of thousands per second).  

### Machine Learning

In many cases, a lot of data has to be processed to train a machine learning model. To complete this processing, compute machines must run for a long time. Compared to storage costs, compute costs usually account for a much larger percentage of your bill, so it makes a lot of sense to reduce the amount of time that your compute machines run. The low latency that you get by using the premium performance tier can significantly reduce this time and your bill.

One of our customers deploys data processing pipelines to spark clusters where they run machine learning training and inference. They store spark tables (parquet files) and checkpoints to a storage account that uses the premium performance tier. Spark checkpoints can create a huge number of nested files and folders. Their directory listing operations are fast because they combined the low latency of the premium performance tier with the hierarchical data structure made available with Data Lake Storage Gen2. 

Another customer in the semiconductor industry has a use case that intersects IoT and machine learning. IoT devices attached to machines in the manufacturing plant take images of semiconductor wafers and send those to their account. Using deep learning inference, the system can inform the on-premise machines if there is an issue with the production and if an action needs to be taken. They mush be able to load and process images quickly and reliably. Using the premium performance tier  with a Data Lake Storage Gen2 enabled account helps to make this possible. 

### Real-time streaming analytics

To support interactive analytics in near real time, a system must ingest and process large amounts of data, and then make that data available to downstream systems. Using a Data Lake Storage Gen2 account along with the premium performance tier is perfect for these types of scenarios.

Companies in the media and entertainment industry can generate a large number of logs and telemetry data in a short amount of time as they broadcast an event. One of our customers relies on multiple content delivery network (CDN) partners for streaming. They must make near real-time decisions about which CDN partners to allocate traffic to. Therefore, data needs to be available for querying a few seconds after it is ingested. To facilitate this quick decision making, they use data stored with the premium performance tier, and process that data in Azure Data Explorer (ADX). All of the telemetry that is uploaded to storage is transformed in ADX, where it can be stored in a familiar format that operators and executives can query quickly and reliably.

Data is uploaded into multiple premium performance Blob Storage accounts. Each account is connected to an Event Grid and Event Hub resource. ADX retrieves the data from Blob Storage, performs any required transformations to normalize the data (For example: decompressing zip files or converting from JSON to CSV). Then, the data is made available for query through ADX and dashboards displayed in Grafana. Grafana dashboards are used by operators, executives, and other users. The customer retains their original logs in premium performance storage, or they copy them to a storage account that uses the standard performance tier where they can be stored in the hot or cool access tier for long-term retention and future analysis.

## See also

- [Performance tiers for block blob storage](storage-blob-performance-tiers.md)
- [Storage account overview](../common/storage-account-overview.md)
- [Introduction to Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
- [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md)
