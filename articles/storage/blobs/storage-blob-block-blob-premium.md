---
title: Premium block blob storage scenarios — Azure Storage
description: Description goes here.
author: normesta

ms.author: normesta
ms.date: 06/28/2021
ms.service: storage
ms.subservice: blobs
ms.topic: conceptual
ms.reviewer: clausjor
---

# Premium block blob storage scenarios

Premium performance accounts store data in SSDs. SSDs store data on instantly accessible memory chips and therefore offer faster file transfers and overall snappier performance than HDDs. HDDs can only access data faster the closer it is from the read/write heads, while all parts of the SSD can be accessed at once. Due to these characteristics, customers across various domains and use cases have found tremendous value in using premium accounts. Here are a few examples on when you should also consider using Premium accounts.

## Some sub heading goes here

Customers use Premium Blobs or Premium tier for ADLS for two reasons primarily:

1.	Performance - they have scenarios that require low and consistent latencies and/or have high IOPs requirements
Even as we see transaction volumes rising, achieving low latency remains critical in a variety of industries and across various application classes. Highly interactive and real-time applications for instance need data to be written or read as quickly as possible. In interactive editing or multi-player online gaming applications, real time updates are needed to maintain a quality experience. In the financial services sector, a fraction of a second could be the difference between making or losing massive sums of money.

2.	Cost – their workloads are transaction heavy and so premium is more economical
Transactions costs for premium accounts are about a third of corresponding hot tier prices. As a result, if the workload is transaction heavy, premium tends to be cheaper along with being more performant.
As a rule of thumb, we recommend that customers use Premium ADLS if their scenario involves analytics.

## Interactive analytics and queries

In almost every industry, there is a need for customers to query and analyze their data interactively. Data scientists, analysts and developers can derive time-sensitive insights faster by running queries on data stored in an account that uses the premium performance tier. Executives can load their dashboards much more quickly when the backing storage is a premium account as against a standard account. Premium accounts provide more consistent latencies meaning that there is much more reliability in terms of even the worst latencies - standard accounts may have higher tail latencies and so for scenarios that are latency sensitive, these may not always work. 

One of our customers use Presto and Spark to produce insights from hive tables. Their use case involves being able to analyze telemetry data from millions of devices in a quick fashion to understand usage of their product better as well as make product release decisions. They scale storage and compute independently to allow for petabyte scale data and point access to their data. Storage in SQL DBs is expensive. To reduce cost, and increase queryable surface area, they use ADLS Premium tier for storage and computation in Presto and Spark - so rarely accessed data has all the power of compute that frequently accessed data has. To close the gap between SQL's subsecond performance and Presto IOPs to external storage, consistency and speed is critical, especially when dealing with small ORC files. The premium tier for ADLS has repeatedly demonstrated a 3X performance improvement vs the standard tier for the customers’ scenario. The snappiness is enough that queries execute fast enough to feel local to the compute machine. When drilling into data is fast, the data scientist is immersed in an investigation. There is no waiting - an increase in the quantity of insights can lead to faster and better decision making.

A second example is a customer that has a requirement to store and query logs from their security solution with low latency. The logs are produced via Databricks processing and stored in Premium ADLS which serves as the storage for Azure Data Explorer, where they allow their end customers to perform queries and search. The main driver for them was cost/performance (interactive query & speed) & stability. The customer also uses an LCM Delete Action policy set to a few days and so that helps with costs (i.e. data is not kept forever but deleted once the need is satisfied). 

## Data processing pipelines

Data processing pipelines are prevalent in every industry thinkable. Raw data from multiple sources needs to be cleansed and processed so that it becomes useful for downstream consumption, dashboarding, decision making. etc. In some scenarios, the speed of processing is a secondary consideration. However, this is not always the case. For example, customers in the financial services industry usually have a need to process data reliably and in the quickest way possible for select use cases. A common use case amongst such customers involves security and fraud detection. For these use cases, customers have a need to process inputs from various sources and detect potential security risks for their customers and take swift action. 

As an example, a customer use case involves landing data from various sources into multiple storage accounts. They then move some of this data to a Premium ADLS account from where the processing application very frequently reads newly arriving data. Their reason for choosing a Premium ADLS account as the source for their processing application was faster and more consistent directory listing calls in the premium tier vs the standard tier. The reliability and speed of these calls was important to ensure that newly arriving data was made available to downstream processing systems as quickly as possible. And this in turn enables them to catch and act upon potential security risks promptly.
     
## Internet of Things (IoT)

IoT has not only become a huge part of our daily lives whether it is tracking car movements, controlling lights, or health monitoring, it also has very important industrial applications. Customers today use IoT for enabling their smart factory projects, for improving agricultural output, on oil rigs for predictive maintenance and so on. Premium accounts have also proved to be of significant value in such scenarios.
 
As an example, a customer in the mining industry uses Premium ADLS along with HDI (Hbase) for time series sensor data from multiple mining equipment types, with a very taxing load profile. Premium ADLS has helped satisfy their high-sample rate ingest needs, is used for dashboarding consumption via Grafana, and as a read source for python analytics. High-concurrency and scalability as a result of using Premium ADLS with HDI was key to solving the customers’ needs. HDI with ADLS has provided a cost-effective implementation of HBase.

In general, high ingestion capabilities of Premium accounts help enable IoT scenarios that involves a large number of small writes (in the tens of thousands per second).  

## Machine Learning

We've seen Machine learning adoption increase rapidly in recent years. AI and ML applications exist in almost all industries today and drive a wide variety of use cases. In most cases, ML training requires processing large amounts of data which in turn may require long training times. And this means running compute machines for longer. With the help of Premium ADLS, and its ability to offer low latency IO, these training times and by inference the time to keep compute machines running can be reduced. Compute costs are usually a much larger percentage of a customers’ bill compared to storage costs and any optimizations here can have a huge positive impact on overall costs.

One example of a common ML scenario involves data processing pipelines deployed in spark clusters where customers run ML training and inference and use Premium ADLS to store spark tables (parquet files) and checkpoints. Spark checkpoints can create a huge number of nested files and folders. Customers can benefit from the low latency offered by Premium ADLS for directory listing operations.

Taking another example, a customer in the semiconductor industry has a use case that intersects IoT and ML. IoT devices attached to machines in the manufacturing plant take images of semiconductor wafers produced and send it to Premium ADLS. Using deep learning inference, the system can inform the on-premise machines if there is an issue with the production and if an action needs to be taken. Reliable and fast loading and processing of images is a requirement that Premium ADLS comes in handy for. 

## Fast Hydration

In certain scenarios, customers need the ability to hydrate or bring up their environments as quickly as possible. In industries such as banking, certain requlatory requirements may require customers to tear down their environments on a regular basis and bring them back up from scratch. To do this, customers need a way to store data required for hydration in a storage that offers fast data load times. One such customer uses Premium Blobs to store a copy of their MongoDB instance each week. To perform hydration after tear-down and get the system back online quickly again, the latest copy is read and loaded into the instance. For audit purposes, previous copies are maintained in cloud storage for a certain time.

## Near real-time streaming analytics

For certain use cases, large amounts of data need to be ingested, lightly processed, and made available to downstream systems for interactive analytics in near real-time. Premium Blobs and Premium ADLS are perfectly suited for such scenarios.

For example, customers in the Media and Entertainment industry, while broadcasting an event and based on viewership, tend to occasionally generate a large number of logs and telemetry data in a short amount of time. Let’s look at a real-world example. A customer that relies on multiple CDN partners for streaming uses Premium Blob storage and the data processed in Azure Data Explorer (ADX) to make near real-time decisions about which CDN partners to allocate traffic to and understand viewer experience. Data needs to be available for querying a few seconds after it was ingested. All the telemetry being uploaded to Premium blobs is transformed in ADX, where it can be stored in a familiar format that operators and executives can quickly and reliably query.

Premium Blob storage accounts provide the increased throughput, IOPs and performance for handling higher volume blob operations with low latency for both ingress, egress, and transaction load. Data is uploaded into multiple Premium Blob storage accounts, each connected to an Event Grid and Event Hub resource. ADX retrieves the data from Blob storage, performs any required transformations to normalize the data (e.g., decompressing zip files, converting from JSON to CSV, etc.) at which point it is made available for query through ADX and dashboards displayed in Grafana. Grafana dashboards are targeted at multiple audiences such as operators and executives. The customer retains their original logs in premium storage or copies them to a standard storage account where they can be stored in the hot or cool access tier for long-term retention and future analysis.

## Interactive editing applications

In applications where multiple users may be editing the same content, speed of updates becomes critical for a smooth user experience. 
As an example, a customer that offers a video editing software uses Premium Blobs to ensure that its users have a seamless collaborative experience where updates made by other users are immediately visible. This experience lets users focus on the task at hand rather than waiting for content updates to happen. This is made possible by the low and consistent latencies offered by Premium Blobs.

## Data visualization software

Like interactive editing applications, customers working with visualization software can be much more productive and effective if the rendering time if quick. 
One of our customers in the mapping industry uses a mapping editor to detect issues with maps based on data from heat maps generated from customer GPS data. The editing software needs a way to quickly perform key looks-ups to render small sections of a map for overlap purposes. They were previously using HDI with HBase backed by standard storage. However, keeping large clusters running all the time led to increasing costs. The customer then decided to move away from this architecture and instead use Premium Blobs for fast key looks-ups using REST APIs to render tiles corresponding to GPS coordinates for overlap purposes. Premium Blobs was able to provide them a cost-effective solution. In addition, Premium Blobs provided predictable latency which standard blobs could not. 

## E-commerce businesses

Customers running ecommerce businesses often need to support not only their customer facing stores but also provide data warehousing and analytics solutions to internal teams. 

One such customer utilizes Premium Blobs for its data warehousing and analytics use case. Their catalog team maintains a data warehousing application for various kinds of data pertaining to an item such as offers, pricing, ship methods, suppliers, inventory, logistics, etc. Information here is queried, scanned, extracted and mined for multiple use cases. The team runs analytics on this data to provide various merchandising teams with relevant insights and information. The customer used standard blobs previously but switched over to premium blobs to satisfy their low latency requirements. 


## Next steps

Evaluate hot, cool, and archive in GPv2 and Blob storage accounts.

- [Learn about rehydrating blob data from the archive tier](archive-rehydrate-overview.md)
- [Evaluate usage of your current storage accounts by enabling Azure Storage metrics](./monitor-blob-storage.md)
- [Check hot, cool, and archive pricing in Blob storage and GPv2 accounts by region](https://azure.microsoft.com/pricing/details/storage/)
- [Check data transfers pricing](https://azure.microsoft.com/pricing/details/data-transfers/)
