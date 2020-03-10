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
ms.date: 10/24/2019
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

1. **Pick up a test dataset and establish a baseline.** During the development phase, test your pipeline by using the copy activity against a representative data sample. The dataset you choose should represent your typical data patterns (folder structure, file pattern, data schema, etc.), and is big enough to evaluate copy performance, for example it takes 10 minutes or beyond for copy activity to complete. Collect execution details and performance characteristics following [copy activity monitoring](copy-activity-overview.md#monitoring).

2. **How to maximize performance of a single copy activity**:

   To start with, we recommend you to first maximize performance using a single copy activity.

   **If the copy activity is being executed on an Azure Integration Runtime:**

   Start with default values for [Data Integration Units (DIU)](#data-integration-units) and [parallel copy](#parallel-copy) settings.  Perform a performance test run, and take a note of the performance achieved as well as the actual values used for DIUs and parallel copies.  Refer to [copy activity monitoring](copy-activity-overview.md#monitoring) on how to collect run results and performance settings used.

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

4. **Performance tuning tips and optimization features.** In some cases, when you run a copy activity in Azure Data Factory, you see a "Performance tuning tips" message on top of the [copy activity monitoring](copy-activity-overview.md#monitor-visually), as shown in the following example. The message tells you the bottleneck that was identified for the given copy run. It also guides you on what to change to boost copy throughput. The performance tuning tips currently provide suggestions like:

   - Use PolyBase when you copy data into Azure SQL Data Warehouse.
   - Increase Azure Cosmos DB Request Units or Azure SQL Database DTUs (Database Throughput Units) when the resource on the data store side is the bottleneck.
   - Remove the unnecessary staged copy.

   The performance tuning rules will be gradually enriched as well.

   **Example: Copy into Azure SQL Database with performance tuning tips**

   In this sample, during a copy run, Azure Data Factory notices the sink Azure SQL Database reaches high DTU utilization, which slows down the write operations. The suggestion is to increase the Azure SQL Database tier with more DTUs. 

   ![Copy monitoring with performance tuning tips](media/copy-activity-overview/copy-monitoring-with-performance-tuning-tips.png)

   In addition, the following are some performance optimization features you should be aware of:

   - [Parallel copy](#parallel-copy)
   - [Data Integration Units](#data-integration-units)
   - [Staged copy](#staged-copy)
   - [Self-hosted integration runtime scalability](concepts-integration-runtime.md#self-hosted-integration-runtime)

5. **Expand the configuration to your entire dataset.** When you're satisfied with the execution results and performance, you can expand the definition and pipeline to cover your entire dataset.

## Copy performance optimization features

Azure Data Factory provides the following performance optimization features:

- [Parallel copy](#parallel-copy)
- [Data Integration Units](#data-integration-units)
- [Staged copy](#staged-copy)

### Data Integration Units

A Data Integration Unit is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Azure Data Factory. Data Integration Unit only applies to [Azure integration runtime](concepts-integration-runtime.md#azure-integration-runtime), but not [self-hosted integration runtime](concepts-integration-runtime.md#self-hosted-integration-runtime).

You will be charged **# of used DIUs \* copy duration \* unit price/DIU-hour**. See the current prices [here](https://azure.microsoft.com/pricing/details/data-factory/data-pipeline/). Local currency and separate discounting may apply per subscription type.

The allowed DIUs to empower a copy activity run is **between 2 and 256**. If not specified or you choose “Auto” on the UI, Data Factory dynamically apply the optimal DIU setting based on your source-sink pair and data pattern. The following table lists the default DIUs used in different copy scenarios:

| Copy scenario | Default DIUs determined by service |
|:--- |:--- |
| Copy data between file-based stores | Between 4 and 32 depending on the number and size of the files |
| Copy data to Azure SQL Database or Azure Cosmos DB |Between 4 and 16 depending on the sink Azure SQL Database's or Cosmos DB's tier (number of DTUs/RUs) |
| All the other copy scenarios | 4 |

To override this default, specify a value for the **dataIntegrationUnits** property as follows. The *actual number of DIUs* that the copy operation uses at run time is equal to or less than the configured value, depending on your data pattern.

You can see the DIUs used for each copy run in the copy activity output when you monitor an activity run. For more information, see [Copy activity monitoring](copy-activity-overview.md#monitoring).

> [!NOTE]
> Setting of DIUs larger than four currently applies only when you copy multiple files from Azure Blob/ADLS Gen1/ADLS Gen2/Amazon S3/Google Cloud Storage/cloud FTP/cloud SFTP or from partition-option-enabled cloud relational data store (including [Oracle](connector-oracle.md#oracle-as-source)/[Netezza](connector-netezza.md#netezza-as-source)/[Teradata](connector-teradata.md#teradata-as-source)) to any other cloud data stores.

**Example:**

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "dataIntegrationUnits": 32
        }
    }
]
```

### Parallel copy

You can use the **parallelCopies** property to indicate the parallelism that you want the copy activity to use. You can think of this property as the maximum number of threads within the copy activity that can read from your source or write to your sink data stores in parallel.

For each copy activity run, Azure Data Factory determines the number of parallel copies to use to copy data from the source data store and to the destination data store. The default number of parallel copies that it uses depends on the type of source and sink that you use.

| Copy scenario | Default parallel copy count determined by service |
| --- | --- |
| Copy data between file-based stores |Depends on the size of the files and the number of DIUs used to copy data between two cloud data stores, or the physical configuration of the self-hosted integration runtime machine. |
| Copy from relational data store with partition option enabled (including [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source))|4 |
| Copy data from any source store to Azure Table storage |4 |
| All other copy scenarios |1 |

> [!TIP]
> When you copy data between file-based stores, the default behavior usually gives you the best throughput. The default behavior is auto-determined based on your source file pattern.

To control the load on machines that host your data stores, or to tune copy performance, you can override the default value and specify a value for the **parallelCopies** property. The value must be an integer greater than or equal to 1. At run time, for the best performance, the copy activity uses a value that is less than or equal to the value that you set.

**Points to note:**

- When you copy data between file-based stores, **parallelCopies** determines the parallelism at the file level. The chunking within a single file happens underneath automatically and transparently. It's designed to use the best suitable chunk size for a given source data store type to load data in parallel and orthogonal to **parallelCopies**. The actual number of parallel copies the data movement service uses for the copy operation at run time is no more than the number of files you have. If the copy behavior is **mergeFile**, the copy activity can't take advantage of file-level parallelism.
- When you copy data from stores that are not file-based (except [Oracle](connector-oracle.md#oracle-as-source), [Netezza](connector-netezza.md#netezza-as-source), [Teradata](connector-teradata.md#teradata-as-source), [SAP Table](connector-sap-table.md#sap-table-as-source), and [SAP Open Hub](connector-sap-business-warehouse-open-hub.md#sap-bw-open-hub-as-source) connector as source with data partitioning enabled) to stores that are file-based, the data movement service ignores the **parallelCopies** property. Even if parallelism is specified, it's not applied in this case.
- The **parallelCopies** property is orthogonal to **dataIntegrationUnits**. The former is counted across all the Data Integration Units.
- When you specify a value for the **parallelCopies** property, consider the load increase on your source and sink data stores. Also consider the load increase to the self-hosted integration runtime if the copy activity is empowered by it, for example, for hybrid copy. This load increase happens especially when you have multiple activities or concurrent runs of the same activities that run against the same data store. If you notice that either the data store or the self-hosted integration runtime is overwhelmed with the load, decrease the **parallelCopies** value to relieve the load.

**Example:**

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "parallelCopies": 32
        }
    }
]
```

### Staged copy

When you copy data from a source data store to a sink data store, you might choose to use Blob storage as an interim staging store. Staging is especially useful in the following cases:

- **You want to ingest data from various data stores into SQL Data Warehouse via PolyBase.** SQL Data Warehouse uses PolyBase as a high-throughput mechanism to load a large amount of data into SQL Data Warehouse. The source data must be in Blob storage or Azure Data Lake Store, and it must meet additional criteria. When you load data from a data store other than Blob storage or Azure Data Lake Store, you can activate data copying via interim staging Blob storage. In that case, Azure Data Factory performs the required data transformations to ensure that it meets the requirements of PolyBase. Then it uses PolyBase to load data into SQL Data Warehouse efficiently. For more information, see [Use PolyBase to load data into Azure SQL Data Warehouse](connector-azure-sql-data-warehouse.md#use-polybase-to-load-data-into-azure-sql-data-warehouse).
- **Sometimes it takes a while to perform a hybrid data movement (that is, to copy from an on-premises data store to a cloud data store) over a slow network connection.** To improve performance, you can use staged copy to compress the data on-premises so that it takes less time to move data to the staging data store in the cloud. Then you can decompress the data in the staging store before you load into the destination data store.
- **You don't want to open ports other than port 80 and port 443 in your firewall because of corporate IT policies.** For example, when you copy data from an on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink, you need to activate outbound TCP communication on port 1433 for both the Windows firewall and your corporate firewall. In this scenario, staged copy can take advantage of the self-hosted integration runtime to first copy data to a Blob storage staging instance over HTTP or HTTPS on port 443. Then it can load the data into SQL Database or SQL Data Warehouse from Blob storage staging. In this flow, you don't need to enable port 1433.

#### How staged copy works

When you activate the staging feature, first the data is copied from the source data store to the staging Blob storage (bring your own). Next, the data is copied from the staging data store to the sink data store. Azure Data Factory automatically manages the two-stage flow for you. Azure Data Factory also cleans up temporary data from the staging storage after the data movement is complete.

![Staged copy](media/copy-activity-performance/staged-copy.png)

When you activate data movement by using a staging store, you can specify whether you want the data to be compressed before you move data from the source data store to an interim or staging data store and then decompressed before you move data from an interim or staging data store to the sink data store.

Currently, you can't copy data between two data stores that are connected via different Self-hosted IRs, neither with nor without staged copy. For such scenario, you can configure two explicitly chained copy activity to copy from source to staging then from staging to sink.

#### Configuration

Configure the **enableStaging** setting in the copy activity to specify whether you want the data to be staged in Blob storage before you load it into a destination data store. When you set **enableStaging** to `TRUE`, specify the additional properties listed in the following table. You also need to create an Azure Storage or Storage shared access signature-linked service for staging if you don’t have one.

| Property | Description | Default value | Required |
| --- | --- | --- | --- |
| enableStaging |Specify whether you want to copy data via an interim staging store. |False |No |
| linkedServiceName |Specify the name of an [AzureStorage](connector-azure-blob-storage.md#linked-service-properties) linked service, which refers to the instance of Storage that you use as an interim staging store. <br/><br/> You can't use Storage with a shared access signature to load data into SQL Data Warehouse via PolyBase. You can use it in all other scenarios. |N/A |Yes, when **enableStaging** is set to TRUE |
| path |Specify the Blob storage path that you want to contain the staged data. If you don't provide a path, the service creates a container to store temporary data. <br/><br/> Specify a path only if you use Storage with a shared access signature, or you require temporary data to be in a specific location. |N/A |No |
| enableCompression |Specifies whether data should be compressed before it's copied to the destination. This setting reduces the volume of data being transferred. |False |No |

>[!NOTE]
> If you use staged copy with compression enabled, the service principal or MSI authentication for staging blob linked service isn't supported.

Here's a sample definition of a copy activity with the properties that are described in the preceding table:

```json
"activities":[
    {
        "name": "Sample copy activity",
        "type": "Copy",
        "inputs": [...],
        "outputs": [...],
        "typeProperties": {
            "source": {
                "type": "SqlSource",
            },
            "sink": {
                "type": "SqlSink"
            },
            "enableStaging": true,
            "stagingSettings": {
                "linkedServiceName": {
                    "referenceName": "MyStagingBlob",
                    "type": "LinkedServiceReference"
                },
                "path": "stagingcontainer/path",
                "enableCompression": true
            }
        }
    }
]
```

#### Staged copy billing impact

You're charged based on two steps: copy duration and copy type.

* When you use staging during a cloud copy, which is copying data from a cloud data store to another cloud data store, both stages empowered by Azure integration runtime, you're charged the [sum of copy duration for step 1 and step 2] x [cloud copy unit price].
* When you use staging during a hybrid copy, which is copying data from an on-premises data store to a cloud data store, one stage empowered by a self-hosted integration runtime, you're charged for [hybrid copy duration] x [hybrid copy unit price] + [cloud copy duration] x [cloud copy unit price].

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
