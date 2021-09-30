---
title: Premium performance tier for Azure block blob storage
description: Description goes here.
author: normesta

ms.author: normesta
ms.date: 06/28/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: clausjor
---

# Premium performance tier for Azure block blob storage

The premium performance tier makes data available via high-performance hardware. Data is stored on solid-state drives (SSDs) which are optimized for low latency. SSDs provide higher throughput compared to traditional hard drives.

This tier is ideal for workloads that require fast and consistent response times and/or require a high number of input output operations per second (IOP). Storage costs are higher, but transaction costs are lower. This means that if your workloads execute a large number of transactions, this tier can be very economical. 

## Performance characteristics

Storage accounts that use the premium performance tier store data on solid-state drives (SSDs). Data is stored on instantly accessible memory chips and that makes file transfers much faster. This type of storage makes all parts of a drive accessible at once. By contrast, the performance of a hard disk drives (HDD) depends on the proximity of data to the read/write heads. 

Low latency remains critical in a variety of industries and across various types of applications. For example, low latency is important to highly interactive and real-time applications that must write data quickly. Interactive editing or multi-player online gaming applications maintain a quality experience by providing real time updates. In the financial services sector, a fraction of a second could be the difference between making or losing massive sums of money.

Later in this article, you'll find real-world examples of Azure Storage customers that used the premium performance tier in their solutions. Some of these customers have enabled Azure Data Lake Storage Gen2 in addition to the premium performance tier. Data Lake Storage Gen2 introduces a hierarchical file structure that can further enhance transaction performance in certain scenarios.

## Cost effectiveness
  
The premium performance tier has a higher storage cost but a lower transaction cost as compared to the standard performance tier. If your applications and workloads execute a large number of transactions, the premium performance tier can be cost-effective, especially if the workload is write-heavy.

In most cases, workloads executing more than 35 to 40 transactions per second per terabyte (TPS/TB) are good candidates for this performance tier. For example, if your workload executes 500 million read operations and 100 million write operations in a month, then you can calculate the TPS/TB as follows: 

- Write transactions per second = 100,000,000 / (30 x 24 x 60 x 60) = **39** (_rounded to the nearest whole number_) 

- Read transactions per second = 500,000,000 / (30 x 24 x 60 x 60) = **193** (_rounded to the nearest whole number_)

- Total transactions per second = **193** + **39** = **232** 

- Assuming your account had **5TB** data on average, then TPS/TB would be **230 / 5** = **46**. 

> [!NOTE]
> Prices differ per operation and per region. Use the [Azure pricing calculator](https://azure.microsoft.com/pricing/calculator/) to compare pricing between standard and premium performance tiers. 

The following table demonstrates the cost-effectiveness of the premium performance tier. This table is based on an account a Azure Data Lake Storage Gen2 enabled storage account (an account that has a hierarchical namespace). Each column represents the number of transactions in a month. Each row represents the percentage of transactions that are read transactions. Each cell in the table shows the percentage of cost reduction associated with a read transaction percentage and the number of transactions executed.

For example, assuming that your account is in the East US 2 region, the number of transactions with your account exceeds 90M, and 70% of those transactions are read transactions, the premium performance tier is more cost-effective.

> [!div class="mx-imgBorder"]
> ![Performance table](./media/storage-blob-performance-tiers/premium-performance-data-lake-storage-cost-analysis-table.png)

> [!NOTE]
> If you prefer to evaluate cost effectiveness based on the number of transactions per second for each TB of data, you can use the column headings that appear at the bottom of the table.

## Fast Hydration

In certain scenarios, customers need the ability to hydrate or bring up their environments as quickly as possible. In industries such as banking, certain requlatory requirements may require customers to tear down their environments on a regular basis and bring them back up from scratch. To do this, customers need a way to store data required for hydration in a storage that offers fast data load times. One such customer uses Premium Blobs to store a copy of their MongoDB instance each week. To perform hydration after tear-down and get the system back online quickly again, the latest copy is read and loaded into the instance. For audit purposes, previous copies are maintained in cloud storage for a certain time.

## Interactive editing applications

In applications where multiple users may be editing the same content, speed of updates becomes critical for a smooth user experience. 
As an example, a customer that offers a video editing software uses Premium Blobs to ensure that its users have a seamless collaborative experience where updates made by other users are immediately visible. This experience lets users focus on the task at hand rather than waiting for content updates to happen. This is made possible by the low and consistent latencies offered by Premium Blobs.

## Data visualization software

Like interactive editing applications, customers working with visualization software can be much more productive and effective if the rendering time if quick. 
One of our customers in the mapping industry uses a mapping editor to detect issues with maps based on data from heat maps generated from customer GPS data. The editing software needs a way to quickly perform key looks-ups to render small sections of a map for overlap purposes. They were previously using HDI with HBase backed by standard storage. However, keeping large clusters running all the time led to increasing costs. The customer then decided to move away from this architecture and instead use Premium Blobs for fast key looks-ups using REST APIs to render tiles corresponding to GPS coordinates for overlap purposes. Premium Blobs was able to provide them a cost-effective solution. In addition, Premium Blobs provided predictable latency which standard blobs could not. 

## E-commerce businesses

Customers running ecommerce businesses often need to support not only their customer facing stores but also provide data warehousing and analytics solutions to internal teams. 

One such customer utilizes Premium Blobs for its data warehousing and analytics use case. Their catalog team maintains a data warehousing application for various kinds of data pertaining to an item such as offers, pricing, ship methods, suppliers, inventory, logistics, etc. Information here is queried, scanned, extracted and mined for multiple use cases. The team runs analytics on this data to provide various merchandising teams with relevant insights and information. The customer used standard blobs previously but switched over to premium blobs to satisfy their low latency requirements. 

## Interactive analytics and queries

In almost every industry, there is a need for enterprises to query and analyze their data interactively. Data scientists, analysts and developers can derive time-sensitive insights faster by running queries on data that is stored in an account that uses the premium performance tier. Executives can load their dashboards much more quickly when the data that appears in those dashboards come from a storage account that uses the premium performance tier instead of the standard performance tier. The premium performance tier makes sense in scenarios that are latency sensitive because this tier provides more consistent latencies, whereas the standard performance tier has higher tail latencies. 

One of our customers uses Presto and Spark to produce insights from hive tables. They must analyze telemetry data from millions of devices quickly to better understand how their products are used, and to make product release decisions. They scale storage and compute independently to allow for petabyte scale data and point access to their data. Storing data in SQL databases is expensive. 

To reduce cost, and to increase queryable surface area, they use an [Azure Data Lake Storage Gen2](create-data-lake-storage-account.md) enabled account that uses the premium performance tier and perform computation in Presto and Spark. This way, even rarely accessed data has all of the power of compute that frequently accessed data has. To close the gap between SQL's sub-second performance and Presto input output operations per second (IOPs) to external storage, consistency and speed is critical, especially when dealing with small optimized row columnar (ORC) files. The premium performance tier when used in an Data Lake Storage Gen2 enabled account, has repeatedly demonstrated a 3X performance improvement over the standard performance tier in this scenario. Queries executed fast enough to feel local to the compute machine. 

Another customer stores and queries logs that are generated from their security solution. The logs are generated by using Databricks, and then and stored in a Data Lake Storage Gen2 enabled account that uses the premium performance tier. End users query and search this data by using Azure Data Explorer. This customer chose this tier to reduce cost, increase stability, and increase the performance of interactive queries. The customer also sets the life cycle management `Delete Action` policy to a few days which helps to reduce costs. This policy prevents them from keeping the data forever. Instead, data is deleted once it is no longer needed. 

## Data processing pipelines

In almost every industry, there is a need for enterprises to process data. Raw data from multiple sources needs to be cleansed and processed so that it becomes useful for downstream consumption in things like data dashboards that help users make decisions. While speed of processing is not always the top concern when processing data, some industries require it. For example, companies in the financial services industry often need to process data reliably and in the quickest way possible. To detect fraud, those companies must process inputs from various sources, identify risks to their customers, and take swift action. 

One of our customers uses multiple storage accounts to stores data from various sources. They then move some of this data to a Data Lake Storage enabled storage account that uses the premium performance tier where a data processing application frequently reads newly arriving data. Directory listing calls in this account were much faster and performed much more consistently than they would otherwise perform in an account that uses the standard performance tier. This speed ensured that newly arrived data was made available to downstream processing systems as quickly as possible. This helped them to catch and then act upon potential security risks promptly.
     
## Internet of Things (IoT)

IoT has become a big part of our daily lives. IoT is used to track car movements, control lights, and monitor our health. It also has industrial applications. For example, companies use IoT to enable their smart factory projects, improve agricultural output, and on oil rigs for predictive maintenance. The premium performance tier adds significant value to these scenarios.
 
One of our customers is in the mining industry. They use a Data Lake Storage Gen2 enable account and the premium performance tier along with HD Insight (Hbase) to ingest time series sensor data from multiple mining equipment types, with a very taxing load profile. The premium performance tier has helped to satisfy their need to for high sample rate ingestion. It's also very cost effective, because the premium performance tier is cost optimized for workloads that produce a large number of write transactions, and this workload generates a large number of small write transactions (in the tens of thousands per second).  

## Machine Learning

The adoption of machine learning has increased rapidly in recent years. Artificial intelligence and machine learning applications exist in many industries today and drive a wide variety of use cases. In most cases, a lot of data has to be processed to train a model. This takes time so compute machines must run for longer periods of time. This time can be significantly reduced by using a Data Lake Storage Gen2 enabled storage account along with the premium performance tier.  This can dramatically reduce costs because compute costs usually account for a much larger percentage of a your bill as compared to storage costs. 

One example of a common ML scenario involves data processing pipelines deployed in spark clusters where customers run ML training and inference and use Premium ADLS to store spark tables (parquet files) and checkpoints. Spark checkpoints can create a huge number of nested files and folders. Customers can benefit from the low latency offered by Premium ADLS for directory listing operations.

Taking another example, a customer in the semiconductor industry has a use case that intersects IoT and ML. IoT devices attached to machines in the manufacturing plant take images of semiconductor wafers produced and send it to Premium ADLS. Using deep learning inference, the system can inform the on-premise machines if there is an issue with the production and if an action needs to be taken. Reliable and fast loading and processing of images is a requirement that Premium ADLS comes in handy for. 

## Near real-time streaming analytics

For certain use cases, large amounts of data need to be ingested, lightly processed, and made available to downstream systems for interactive analytics in near real-time. Premium Blobs and Premium ADLS are perfectly suited for such scenarios.

For example, customers in the Media and Entertainment industry, while broadcasting an event and based on viewership, tend to occasionally generate a large number of logs and telemetry data in a short amount of time. Let’s look at a real-world example. A customer that relies on multiple CDN partners for streaming uses Premium Blob storage and the data processed in Azure Data Explorer (ADX) to make near real-time decisions about which CDN partners to allocate traffic to and understand viewer experience. Data needs to be available for querying a few seconds after it was ingested. All the telemetry being uploaded to Premium blobs is transformed in ADX, where it can be stored in a familiar format that operators and executives can quickly and reliably query.

Premium Blob storage accounts provide the increased throughput, IOPs and performance for handling higher volume blob operations with low latency for both ingress, egress, and transaction load. Data is uploaded into multiple Premium Blob storage accounts, each connected to an Event Grid and Event Hub resource. ADX retrieves the data from Blob storage, performs any required transformations to normalize the data (e.g., decompressing zip files, converting from JSON to CSV, etc.) at which point it is made available for query through ADX and dashboards displayed in Grafana. Grafana dashboards are targeted at multiple audiences such as operators and executives. The customer retains their original logs in premium storage or copies them to a standard storage account where they can be stored in the hot or cool access tier for long-term retention and future analysis.

## Next steps

Evaluate hot, cool, and archive in GPv2 and Blob storage accounts.

- [Learn about rehydrating blob data from the archive tier](archive-rehydrate-overview.md)
- [Evaluate usage of your current storage accounts by enabling Azure Storage metrics](./monitor-blob-storage.md)
- [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
- [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
