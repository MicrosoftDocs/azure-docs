---
title: Copy activity performance and scalability guide
description: Learn about key factors that affect the performance of data movement in Azure Data Factory when you use the copy activity.
services: data-factory
documentationcenter: ''
ms.author: jingwang
author: linda33wj
manager: shwang
ms.reviewer: douglasl
ms.service: data-factory
ms.workload: data-services
ms.topic: conceptual
ms.custom: seo-lt-2019
ms.date: 03/05/2020
---

# Copy activity performance and scalability guide

> [!div class="op_single_selector" title1="Select the version of Azure Data Factory that you're using:"]
> * [Version 1](v1/data-factory-copy-activity-performance.md)
> * [Current version](copy-activity-performance.md)

Whether you want to perform a large-scale data migration from data lake or enterprise data warehouse (EDW) to Azure, or you want to ingest data at scale from different sources into Azure for big data analytics, it is critical to achieve optimal performance and scalability.  Azure Data Factory provides a performant, resilient, and cost-effective mechanism to ingest data at scale, making it a great fit for data engineers looking to build highly performant and scalable data ingestion pipelines.

After reading this article, you will be able to answer the following questions:

- What level of performance and scalability can I achieve using ADF copy activity for data migration and data ingestion scenarios?

- What steps should I take to tune the performance of ADF copy activity?
- What ADF perf optimization knobs can I utilize to optimize performance for a single copy activity run?
- What other factors outside ADF to consider when optimizing copy performance?

> [!NOTE]
> If you aren't familiar with the copy activity in general, see the [copy activity overview](copy-activity-overview.md) before you read this article.

## Copy performance and scalability achievable using ADF

ADF offers a serverless architecture that allows parallelism at different levels, which allows developers to build pipelines to fully utilize your network bandwidth as well as storage IOPS and bandwidth to maximize data movement throughput for your environment.  This means the throughput you can achieve can be estimated by measuring the minimum throughput offered by the source data store, the destination data store, and network bandwidth in between the source and destination.  The table below calculates the copy duration based on data size and the bandwidth limit for your environment. 

| Data size / <br/> bandwidth | 50 Mbps    | 100 Mbps  | 500 Mbps  | 1 Gbps   | 5 Gbps   | 10 Gbps  | 50 Gbps   |
| --------------------------- | ---------- | --------- | --------- | -------- | -------- | -------- | --------- |
| **1 GB**                    | 2.7 min    | 1.4 min   | 0.3 min   | 0.1 min  | 0.03 min | 0.01 min | 0.0 min   |
| **10 GB**                   | 27.3 min   | 13.7 min  | 2.7 min   | 1.3 min  | 0.3 min  | 0.1 min  | 0.03 min  |
| **100 GB**                  | 4.6 hrs    | 2.3 hrs   | 0.5 hrs   | 0.2 hrs  | 0.05 hrs | 0.02 hrs | 0.0 hrs   |
| **1 TB**                    | 46.6 hrs   | 23.3 hrs  | 4.7 hrs   | 2.3 hrs  | 0.5 hrs  | 0.2 hrs  | 0.05 hrs  |
| **10 TB**                   | 19.4 days  | 9.7 days  | 1.9 days  | 0.9 days | 0.2 days | 0.1 days | 0.02 days |
| **100 TB**                  | 194.2 days | 97.1 days | 19.4 days | 9.7 days | 1.9 days | 1 days   | 0.2 days  |
| **1 PB**                    | 64.7 mo    | 32.4 mo   | 6.5 mo    | 3.2 mo   | 0.6 mo   | 0.3 mo   | 0.06 mo   |
| **10 PB**                   | 647.3 mo   | 323.6 mo  | 64.7 mo   | 31.6 mo  | 6.5 mo   | 3.2 mo   | 0.6 mo    |

ADF copy is scalable at different levels:

![how ADF copy scales](media/copy-activity-performance/adf-copy-scalability.png)

- ADF control flow can start multiple copy activities in parallel, for example using [For Each loop](control-flow-for-each-activity.md).
- A single copy activity can take advantage of scalable compute resources: when using Azure Integration Runtime, you can specify [up to 256 DIUs](#data-integration-units) for each copy activity in a serverless manner; when using self-hosted Integration Runtime, you can manually scale up the machine or scale out to multiple machines ([up to 4 nodes](create-self-hosted-integration-runtime.md#high-availability-and-scalability)), and a single copy activity will partition its file set across all nodes.
- A single copy activity reads from and writes to the data store using multiple threads [in parallel](#parallel-copy).

## Performance tuning steps

Take these steps to tune the performance of your Azure Data Factory service with the copy activity.

1. **Pick up a test dataset and establish a baseline.** During the development phase, test your pipeline by using the copy activity against a representative data sample. The dataset you choose should represent your typical data patterns (folder structure, file pattern, data schema, etc.), and is big enough to evaluate copy performance, for example it takes 10 minutes or beyond for copy activity to complete. Collect execution details and performance characteristics following [copy activity monitoring](copy-activity-monitoring.md).

2. **How to maximize performance of a single copy activity**:

   To start with, we recommend you to first maximize performance using a single copy activity.

   **If the copy activity is being executed on an Azure Integration Runtime:**

   Start with default values for [Data Integration Units (DIU)](#data-integration-units) and [parallel copy](#parallel-copy) settings.  Perform a performance test run, and take a note of the performance achieved as well as the actual values used for DIUs and parallel copies.  

   [Troubleshoot copy activity performance](copy-activity-performance-troubleshooting.md)

   Refer to [copy activity monitoring](copy-activity-monitoring.md) on how to collect run results and performance settings used.

   Now conduct additional performance test runs, each time doubling the value for DIU setting.  Alternatively, if you think the performance achieved using the default setting is far below your expectation, you can increase the DIU setting more drastically in the subsequent test run.

   Copy activity should scale almost perfectly linearly as you increase the DIU setting.  If by doubling the DIU setting you are not seeing the throughput double, two things could be happening:

   - The specific copy pattern you are running does not benefit from adding more DIUs.  Even though you had specified a larger DIU value, the actual DIU used remained the same, and therefore you are getting the same throughput as before.  If this is the case, maximize aggregate throughput by running multiple copies concurrently referring step 3.
   - By adding more DIUs (more horsepower) and thereby driving higher rate of data extraction, transfer, and loading, either the source data store, the network in between, or the destination data store has reached its bottleneck and possibly being throttled.  If this is the case, try contacting your data store administrator or your network administrator to raise the upper limit, or alternatively, reduce the DIU setting until throttling stops occurring.

   **If the copy activity is being executed on a self-hosted Integration Runtime:**

   We recommend that you use a dedicated machine separate from the server hosting the data store to host integration runtime.

   Start with default values for [parallel copy](#parallel-copy) setting and using a single node for the self-hosted IR.  Perform a performance test run and take a note of the performance achieved.

   If you would like to achieve higher throughput, you can either scale up or scale out the self-hosted IR:

   - If the CPU and available memory on the self-hosted IR node are not fully utilized, but the execution of concurrent jobs is reaching the limit, you should scale up by increasing the number of concurrent jobs that can run on a node.  See [here](create-self-hosted-integration-runtime.md#scale-up) for instructions.
   - If, on the other hand, the CPU is high on the self-hosted IR node or available memory is low, you can add a new node to help scale out the load across the multiple nodes.  See [here](create-self-hosted-integration-runtime.md#high-availability-and-scalability) for instructions.

   As you scale up or scale out the capacity of the self-hosted IR, repeat the performance test run to see if you are getting increasingly better throughput.  If throughput stops improving, most likely either the source data store, the network in between, or the destination data store has reached its bottleneck and is starting to get throttled. If this is the case, try contacting your data store administrator or your network administrator to raise the upper limit, or alternatively, go back to your previous scaling setting for the self-hosted IR. 

3. **How to maximize aggregate throughput by running multiple copies concurrently:**

   Now that you have maximized the performance of a single copy activity, if you have not yet achieved the throughput upper limits of your environment – network, source data store, and destination data store - you can run multiple copy activities in parallel using ADF control flow constructs such as [For Each loop](control-flow-for-each-activity.md).

5. **Expand the configuration to your entire dataset.** When you're satisfied with the execution results and performance, you can expand the definition and pipeline to cover your entire dataset.

## Troubleshoot copy activity performance



## Copy performance optimization features

Azure Data Factory provides the following performance optimization features:

- [Data Integration Units](#data-integration-units)
- [Parallel copy](#parallel-copy)
- [Staged copy](#staged-copy)
- [Self-hosted integration runtime scalability](create-self-hosted-integration-runtime.md#high-availability-and-scalability)

### Data Integration Units

A Data Integration Unit is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Azure Data Factory. Data Integration Unit only applies to [Azure integration runtime](concepts-integration-runtime.md#azure-integration-runtime), but not [self-hosted integration runtime](concepts-integration-runtime.md#self-hosted-integration-runtime). [Learn more](copy-activity-performance-features.md#data-integration-units).

### Parallel copy

You can use set parallel copy to indicate the parallelism that you want the copy activity to use. You can think of this property as the maximum number of threads within the copy activity that can read from your source or write to your sink data stores in parallel. [Learn more](copy-activity-performance-features.md#parallel-copy).

### Staged copy

When you copy data from a source data store to a sink data store, you might choose to use Blob storage as an interim staging store.  [Learn more](copy-activity-performance-features.md#staged-copy).

## References

Here are performance monitoring and tuning references for some of the supported data stores:

* Azure Blob storage: [Scalability and performance targets for Blob storage](../storage/blobs/scalability-targets.md) and [Performance and scalability checklist for Blob storage](../storage/blobs/storage-performance-checklist.md).
* Azure Table storage: [Scalability and performance targets for Table storage](../storage/tables/scalability-targets.md) and [Performance and scalability checklist for Table storage](../storage/tables/storage-performance-checklist.md).
* Azure SQL Database: You can [monitor the performance](../sql-database/sql-database-single-database-monitor.md) and check the Database Transaction Unit (DTU) percentage.
* Azure SQL Data Warehouse: Its capability is measured in Data Warehouse Units (DWUs). See [Manage compute power in Azure SQL Data Warehouse (Overview)](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md).
* Azure Cosmos DB: [Performance levels in Azure Cosmos DB](../cosmos-db/performance-levels.md).
* On-premises SQL Server: [Monitor and tune for performance](https://msdn.microsoft.com/library/ms189081.aspx).
* On-premises file server: [Performance tuning for file servers](https://msdn.microsoft.com/library/dn567661.aspx).

## Next steps
See the other copy activity articles:

- [Copy activity overview](copy-activity-overview.md)
- [Use Azure Data Factory to migrate data from your data lake or data warehouse to Azure](data-migration-guidance-overview.md)
- [Migrate data from Amazon S3 to Azure Storage](data-migration-guidance-s3-azure-storage.md)
