---
title: Premium block blob storage accounts
titleSuffix: Azure Storage
description: Achieve lower and consistent latencies for Azure Storage workloads that require fast and consistent response times.
author: akashdubey-ms

ms.author: akashdubey
ms.date: 10/14/2021
ms.service: azure-blob-storage
ms.topic: conceptual

---

# Premium block blob storage accounts

Premium block blob storage accounts make data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives. File transfer is much faster because data is stored on instantly accessible memory chips. All parts of a drive accessible at once. By contrast, the performance of a hard disk drive (HDD) depends on the proximity of data to the read/write heads.

## High performance workloads

Premium block blob storage accounts are ideal for workloads that require fast and consistent response times and/or have a high number of input output operations per second (IOP). Example workloads include:

- **Interactive workloads**. Highly interactive and real-time applications must write data quickly. E-commerce and mapping applications often require instant updates and user feedback. For example, in an e-commerce application, less frequently viewed items are likely not cached. However, they must be instantly displayed to the customer on demand. Interactive editing or multi-player online gaming applications maintain a quality experience by providing real-time updates.

- **IoT/ streaming analytics**. In an IoT scenario, lots of smaller write operations might be pushed to the cloud every second. Large amounts of data might be taken in, aggregated for analysis purposes, and then deleted almost immediately. The high ingestion capabilities of premium block blob storage make it efficient for this type of workload.

- **Artificial intelligence/machine learning (AI/ML)**. AI/ML deals with the consumption and processing of different data types like visuals, speech, and text. This high-performance computing type of workload deals with large amounts of data that requires rapid response and efficient ingestion times for data analysis.

## Cost effectiveness

Premium block blob storage accounts have a higher storage cost but a lower transaction cost as compared to standard general-purpose v2 accounts. If your applications and workloads execute a large number of transactions, premium block blob storage can be cost-effective, especially if the workload is write-heavy.

In most cases, workloads executing more than 35 to 40 transactions per second per terabyte (TPS/TB) are good candidates for this type of account. For example, if your workload executes 500 million read operations and 100 million write operations in a month, then you can calculate the TPS/TB as follows:

- Write transactions per second = 100,000,000 / (30 x 24 x 60 x 60) = **39** (_rounded to the nearest whole number_)

- Read transactions per second = 500,000,000 / (30 x 24 x 60 x 60) = **193** (_rounded to the nearest whole number_)

- Total transactions per second = **193** + **39** = **232**

- Assuming your account had **5TB** data on average, then TPS/TB would be **230 / 5** = **46**.

> [!NOTE]
> Prices differ per operation and per region. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to compare pricing between standard and premium performance tiers.

The following table demonstrates the cost-effectiveness of premium block blob storage accounts. The numbers in this table are based on an Azure Data Lake Storage Gen2 enabled premium block blob storage account (also referred to as the [premium tier for Azure Data Lake Storage](premium-tier-for-data-lake-storage.md)). Each column represents the number of transactions in a month. Each row represents the percentage of transactions that are read transactions. Each cell in the table shows the percentage of cost reduction associated with a read transaction percentage and the number of transactions executed.

For example, assuming that your account is in the East US 2 region, the number of transactions with your account exceeds 90M, and 70% of those transactions are read transactions, premium block blob storage accounts are more cost-effective.

> [!div class="mx-imgBorder"]
> ![Performance table](./media/storage-blob-performance-tiers/premium-performance-data-lake-storage-cost-analysis-table.png)

> [!NOTE]
> If you prefer to evaluate cost effectiveness based on the number of transactions per second for each TB of data, you can use the column headings that appear at the bottom of the table.

## Premium scenarios

This section contains real-world examples of how some of our Azure Storage partners use premium block blob storage. Some of them also enable Azure Data Lake Storage Gen2 which introduces a hierarchical file structure that can further enhance transaction performance in certain scenarios.

> [!TIP]
> If you have an analytics use case, we highly recommend that you use Azure Data Lake Storage Gen2 along with a premium block blob storage account.

This section contains the following examples:

- [Premium block blob storage accounts](#premium-block-blob-storage-accounts)
  - [High performance workloads](#high-performance-workloads)
  - [Cost effectiveness](#cost-effectiveness)
  - [Premium scenarios](#premium-scenarios)
    - [Fast data hydration](#fast-data-hydration)
    - [Interactive editing applications](#interactive-editing-applications)
    - [Data visualization software](#data-visualization-software)
    - [E-commerce businesses](#e-commerce-businesses)
    - [Interactive analytics](#interactive-analytics)
    - [Data processing pipelines](#data-processing-pipelines)
    - [Internet of Things (IoT)](#internet-of-things-iot)
    - [Machine Learning](#machine-learning)
    - [Real-time streaming analytics](#real-time-streaming-analytics)
  - [Getting started with premium](#getting-started-with-premium)
    - [Check for Blob Storage feature compatibility](#check-for-blob-storage-feature-compatibility)
    - [Create a new Storage account](#create-a-new-storage-account)
  - [See also](#see-also)

### Fast data hydration

Premium block blob storage can help you *hydrate* or bring up your environment quickly. In industries such as banking, certain regulatory requirements might require companies to regularly tear down their environments, and then bring them back up from scratch. The data used to hydrate their environment must load quickly.

Some of our partners store a copy of their MongoDB instance each week to a premium block blob storage account. The system is then torn down. To get the system back online quickly again, the latest copy of the MongoDB instance is read and loaded. For audit purposes, previous copies are maintained in cloud storage for a period of time.

### Interactive editing applications

In applications where multiple users edit the same content, the speed of updates becomes critical for a smooth user experience.

Some of our partners develop video editing software. Any update that a user makes to a video is immediately visible to other users. Users can focus on their tasks instead of waiting for content updates to appear. The low latencies associated with premium block blob storage helps to create this seamless and collaborative experience.

### Data visualization software

Users can be far more productive with data visualization software if rendering time is quick.

We've seen companies in the mapping industry use mapping editors to detect issues with maps. These editors use data that is generated from customer Global Positioning System (GPS) data. To create map overlaps, the editing software renders small sections of a map by quickly performing key lookups.

In one case, before using premium block blob storage, a partner used HBase clusters backed by standard general-purpose v2 storage. However, it became expensive to keep large clusters running all of the time. This partner decided to move away from this architecture, and instead used premium block blob storage for fast key lookups. To create overlaps, they used REST APIs to render tiles corresponding to GPS coordinates. The premium block blob storage account provided them with a cost-effective solution, and latencies were far more predictable.

### E-commerce businesses

In addition to supporting their customer facing stores, e-commerce businesses might also provide data warehousing and analytics solutions to internal teams. We've seen partners use premium block blob storage accounts to support the low latency requirements by these data warehousing and analytics solutions. In one case, a catalog team maintains a data warehousing application for data that pertains to offers, pricing, ship methods, suppliers, inventory, and logistics. Information is queried, scanned, extracted, and mined for multiple use cases. The team runs analytics on this data to provide various merchandising teams with relevant insights and information.

### Interactive analytics

In almost every industry, there is a need for enterprises to query and analyze their data interactively.

Data scientists, analysts, and developers can derive time-sensitive insights faster by running queries on data that is stored in a premium block blob storage account. Executives can load their dashboards much more quickly when the data that appears in those dashboards comes from a premium block blob storage account instead of a standard general-purpose v2 account.

In one scenario, analysts needed to analyze telemetry data from millions of devices quickly to better understand how their products are used, and to make product release decisions. Storing data in SQL databases is expensive. To reduce cost, and to increase queryable surface area, they used an Azure Data Lake Storage Gen2 enabled premium block blob storage account and performed computation in Presto and Spark to produce insights from hive tables. This way, even rarely accessed data has all of the same power of compute as frequently accessed data.

To close the gap between SQL's subsecond performance and Presto's input output operations per second (IOPs) to external storage, consistency and speed are critical, especially when dealing with small optimized row columnar (ORC) files. A premium block blob storage account when used with Data Lake Storage Gen2, has repeatedly demonstrated a 3X performance improvement over a standard general-purpose v2 account in this scenario. Queries executed fast enough to feel local to the compute machine.

In another case, a partner stores and queries logs that are generated from their security solution. The logs are generated by using Databricks, and then and stored in a Data Lake Storage Gen2 enabled premium block blob storage account. End users query and search this data by using Azure Data Explorer. They chose this type of account to increase stability and increase the performance of interactive queries. They also set the life cycle management `Delete Action` policy to a few days, which helps to reduce costs. This policy prevents them from keeping the data forever. Instead, data is deleted once it is no longer needed.

### Data processing pipelines

In almost every industry, there is a need for enterprises to process data. Raw data from multiple sources needs to be cleansed and processed so that it becomes useful for downstream consumption in tools such as data dashboards that help users make decisions.

While speed of processing is not always the top concern when processing data, some industries require it. For example, companies in the financial services industry often need to process data reliably and in the quickest way possible. To detect fraud, those companies must process inputs from various sources, identify risks to their customers, and take swift action.

In some cases, we've seen partners use multiple standard storage accounts to store data from various sources. Some of this data is then moved to a Data Lake Storage enabled premium block blob storage account where a data processing application frequently reads newly arriving data. Directory listing calls in this account were much faster and performed much more consistently than they would otherwise perform in a standard general-purpose v2 account. The speed and consistency offered by the account ensured that new data was always made available to downstream processing systems as quickly as possible. This helped them catch and act upon potential security risks promptly.

### Internet of Things (IoT)

IoT has become a significant part of our daily lives. IoT is used to track car movements, control lights, and monitor our health. It also has industrial applications. For example, companies use IoT to enable their smart factory projects, improve agricultural output, and on oil rigs for predictive maintenance. Premium block blob storage accounts add significant value to these scenarios.

We have partners in the mining industry. They use a Data Lake Storage Gen2 enable premium block blob storage account along with HDInsight (Hbase) to ingest time series sensor data from multiple mining equipment types, with a very taxing load profile. Premium block blob storage has helped to satisfy their need for high sample rate ingestion. It's also cost effective, because premium block blob storage is cost optimized for workloads that perform a large number of write transactions, and this workload generates a large number of small write transactions (in the tens of thousands per second).

### Machine Learning

In many cases, a lot of data has to be processed to train a machine learning model. To complete this processing, compute machines must run for a long time. Compared to storage costs, compute costs usually account for a much larger percentage of your bill, so reducing the amount of time that your compute machines run can lead to significant savings. The low latency that you get by using premium block blob storage can significantly reduce this time and your bill.

We have partners that deploy data processing pipelines to spark clusters where they run machine learning training and inference. They store spark tables (parquet files) and checkpoints to a premium block blob storage account. Spark checkpoints can create a huge number of nested files and folders. Their directory listing operations are fast because they combined the low latency of a premium block blob storage account with the hierarchical data structure made available with Data Lake Storage Gen2.

We also have partners in the semiconductor industry with use cases that intersect IoT and machine learning. IoT devices attached to machines in the manufacturing plant take images of semiconductor wafers and send those to their account. Using deep learning inference, the system can inform the on-premises machines if there is an issue with the production and if an action needs to be taken. They mush be able to load and process images quickly and reliably. Using Data Lake Storage Gen2 enabled premium block blob storage account helps to make this possible.

### Real-time streaming analytics

To support interactive analytics in near real time, a system must ingest and process large amounts of data, and then make that data available to downstream systems. Using a Data Lake Storage Gen2 enabled premium block blob storage account is perfect for these types of scenarios.

Companies in the media and entertainment industry can generate a large number of logs and telemetry data in a short amount of time as they broadcast an event. Some of our partners rely on multiple content delivery network (CDN) partners for streaming. They must make near real-time decisions about which CDN partners to allocate traffic to. Therefore, data needs to be available for querying a few seconds after it is ingested. To facilitate this quick decision making, they use data stored within premium block blob storage, and process that data in Azure Data Explorer (ADX). All of the telemetry that is uploaded to storage is transformed in ADX, where it can be stored in a familiar format that operators and executives can query quickly and reliably.

Data is uploaded into multiple premium performance Blob Storage accounts. Each account is connected to an Event Grid and Event Hub resource. ADX retrieves the data from Blob Storage, performs any required transformations to normalize the data (For example: decompressing zip files or converting from JSON to CSV). Then, the data is made available for query through ADX and dashboards displayed in Grafana. Grafana dashboards are used by operators, executives, and other users. The customer retains their original logs in premium performance storage, or they copy them to a general-purpose v2 storage account where they can be stored in the hot or cool access tier for long-term retention and future analysis.

## Getting started with premium

First, check to make sure your favorite Blob Storage features are compatible with premium block blob storage accounts, then create the account.

>[!NOTE]
> You can't convert an existing standard general-purpose v2 storage account to a premium block blob storage account. To migrate to a premium block blob storage account, you must create a premium block blob storage account, and migrate the data to the new account.

### Check for Blob Storage feature compatibility

Some Blob Storage features aren't yet supported or have partial support in premium block blob storage accounts. Before choosing premium, review the [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md) article to determine whether the features that you intend to use are fully supported in your account. Feature support is always expanding so make sure to periodically review this article for updates.

### Create a new Storage account

To create a premium block blob storage account, make sure to choose the **Premium** performance option and the **Block blobs** account type as you create the account.

> [!div class="mx-imgBorder"]
> ![Create blockblobstorageacount](./media/storage-blob-block-blob-premium/create-block-blob-storage-account.png)

> [!NOTE]
> Some Blob Storage features aren't yet supported or have partial support in premium block blob storage accounts. Before choosing premium, review the [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md) article to determine whether the features that you intend to use are fully supported in your account. Feature support is always expanding so make sure to periodically review this article for updates.

If your storage account is going to be used for analytics, we highly recommend that you use Azure Data Lake Storage Gen2 along with a premium block blob storage account. To unlock Azure Data Lake Storage Gen2 capabilities, enable the **Hierarchical namespace** setting in the **Advanced** tab of the **Create storage account** page.

The following image shows this setting in the **Create storage account** page.

> [!div class="mx-imgBorder"]
> ![Hierarchical namespace setting](./media/create-data-lake-storage-account/hierarchical-namespace-feature.png)

For complete guidance, see [Create a storage account](../common/storage-account-create.md) account.



## See also

- [Storage account overview](../common/storage-account-overview.md)
- [Introduction to Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
- [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md)
- [Premium tier for Azure Data Lake Storage](premium-tier-for-data-lake-storage.md)
