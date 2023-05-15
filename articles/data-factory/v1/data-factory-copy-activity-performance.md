---
title: Copy Activity performance and tuning guide 
description: Learn about key factors that affect the performance of data movement in Azure Data Factory when you use Copy Activity.
author: jianleishen
ms.service: data-factory
ms.subservice: v1
ms.topic: conceptual
ms.date: 04/12/2023
ms.author: jianleishen
robots: noindex
---
# Copy Activity performance and tuning guide

> [!div class="op_single_selector" title1="Select the version of Data Factory service you are using:"]
> * [Version 1](data-factory-copy-activity-performance.md)
> * [Version 2 (current version)](../copy-activity-performance.md)

> [!NOTE]
> This article applies to version 1 of Data Factory. If you are using the current version of the Data Factory service, see [Copy activity performance and tuning guide for Data Factory](../copy-activity-performance.md).

Azure Data Factory Copy Activity delivers a first-class secure, reliable, and high-performance data loading solution. It enables you to copy tens of terabytes of data every day across a rich variety of cloud and on-premises data stores. Blazing-fast data loading performance is key to ensure you can focus on the core "big data" problem: building advanced analytics solutions and getting deep insights from all that data.

Azure provides a set of enterprise-grade data storage and data warehouse solutions, and Copy Activity offers a highly optimized data loading experience that is easy to configure and set up. With just a single copy activity, you can achieve:

* Loading data into **Azure Synapse Analytics** at **1.2 GBps**. For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics under 15 minutes with Azure Data Factory](data-factory-load-sql-data-warehouse.md).
* Loading data into **Azure Blob storage** at **1.0 GBps**
* Loading data into **Azure Data Lake Store** at **1.0 GBps**

This article describes:

* [Performance reference numbers](#performance-reference) for supported source and sink data stores to help you plan your project;
* Features that can boost the copy throughput in different scenarios, including [cloud data movement units](#cloud-data-movement-units), [parallel copy](#parallel-copy), and [staged Copy](#staged-copy);
* [Performance tuning guidance](#performance-tuning-steps) on how to tune the performance and the key factors that can impact copy performance.

> [!NOTE]
> If you are not familiar with Copy Activity in general, see [Move data by using Copy Activity](data-factory-data-movement-activities.md) before reading this article.
>

## Performance reference

As a reference, below table shows the copy throughput number in MBps for the given source and sink pairs based on in-house testing. For comparison, it also demonstrates how different settings of [cloud data movement units](#cloud-data-movement-units) or [Data Management Gateway scalability](data-factory-data-management-gateway-high-availability-scalability.md) (multiple gateway nodes) can help on copy performance.

:::image type="content" source="./media/data-factory-copy-activity-performance/CopyPerfRef.png" alt-text="Performance matrix":::

>[!IMPORTANT]
>In Azure Data Factory version 1, the minimal cloud data movement units for cloud-to-cloud copy is two. If not specified, see default data movement units being used in [cloud data movement units](#cloud-data-movement-units).

**Points to note:**
* Throughput is calculated by using the following formula: [size of data read from source]/[Copy Activity run duration].
* The performance reference numbers in the table were measured using [TPC-H](http://www.tpc.org/tpch/) data set in a single copy activity run.
* In Azure data stores, the source and sink are in the same Azure region.
* For hybrid copy between on-premises and cloud data stores, each gateway node was running on a machine that was separate from the on-premises data store with below specification. When a single activity was running on gateway, the copy operation consumed only a small portion of the test machine's CPU, memory, or network bandwidth. Learn more from [consideration for Data Management Gateway](#considerations-for-data-management-gateway).
    <table>
    <tr>
        <td>CPU</td>
        <td>32 cores 2.20 GHz Intel Xeon E5-2660 v2</td>
    </tr>
    <tr>
        <td>Memory</td>
        <td>128 GB</td>
    </tr>
    <tr>
        <td>Network</td>
        <td>Internet interface: 10 Gbps; intranet interface: 40 Gbps</td>
    </tr>
    </table>


> [!TIP]
> You can achieve higher throughput by leveraging more data movement units (DMUs) than the default maximum DMUs, which is 32 for a cloud-to-cloud copy activity run. For example, with 100 DMUs, you can achieve copying data from Azure Blob into Azure Data Lake Store at **1.0GBps**. See the [Cloud data movement units](#cloud-data-movement-units) section for details about this feature and the supported scenario. Contact [Azure support](https://azure.microsoft.com/support/) to request more DMUs.

## Parallel copy
You can read data from the source or write data to the destination **in parallel within a Copy Activity run**. This feature enhances the throughput of a copy operation and reduces the time it takes to move data.

This setting is different from the **concurrency** property in the activity definition. The **concurrency** property determines the number of **concurrent Copy Activity runs** to process data from different activity windows (1 AM to 2 AM, 2 AM to 3 AM, 3 AM to 4 AM, and so on). This capability is helpful when you perform a historical load. The parallel copy capability applies to a **single activity run**.

Let's look at a sample scenario. In the following example, multiple slices from the past need to be processed. Data Factory runs an instance of Copy Activity (an activity run) for each slice:

* The data slice from the first activity window (1 AM to 2 AM) ==> Activity run 1
* The data slice from the second activity window (2 AM to 3 AM) ==> Activity run 2
* The data slice from the second activity window (3 AM to 4 AM) ==> Activity run 3

And so on.

In this example, when the **concurrency** value is set to 2, **Activity run 1** and **Activity run 2** copy data from two activity windows **concurrently** to improve data movement performance. However, if multiple files are associated with Activity run 1, the data movement service copies files from the source to the destination one file at a time.

### Cloud data movement units
A **cloud data movement unit (DMU)** is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Data Factory. DMU is applicable for cloud-to-cloud copy operations, but not in a hybrid copy.

**The minimal cloud data movement units to empower Copy Activity run is two.** If not specified, the following table lists the default DMUs used in different copy scenarios:

| Copy scenario | Default DMUs determined by service |
|:--- |:--- |
| Copy data between file-based stores | Between 4 and 16 depending on the number and size of the files. |
| All other copy scenarios | 4 |

To override this default, specify a value for the **cloudDataMovementUnits** property as follows. The **allowed values** for the **cloudDataMovementUnits** property are 2, 4, 8, 16, 32. The **actual number of cloud DMUs** that the copy operation uses at run time is equal to or less than the configured value, depending on your data pattern. For information about the level of performance gain you might get when you configure more units for a specific copy source and sink, see the [performance reference](#performance-reference).

```json
"activities":[
    {
        "name": "Sample copy activity",
        "description": "",
        "type": "Copy",
        "inputs": [{ "name": "InputDataset" }],
        "outputs": [{ "name": "OutputDataset" }],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "cloudDataMovementUnits": 32
        }
    }
]
```

> [!NOTE]
> If you need more cloud DMUs for a higher throughput, contact [Azure support](https://azure.microsoft.com/support/). Setting of 8 and above currently works only when you **copy multiple files from Blob storage/Data Lake Store/Amazon S3/cloud FTP/cloud SFTP to Blob storage/Data Lake Store/Azure SQL Database**.
>

### parallelCopies
You can use the **parallelCopies** property to indicate the parallelism that you want Copy Activity to use. You can think of this property as the maximum number of threads within Copy Activity that can read from your source or write to your sink data stores in parallel.

For each Copy Activity run, Data Factory determines the number of parallel copies to use to copy data from the source data store and to the destination data store. The default number of parallel copies that it uses depends on the type of source and sink that you are using.

| Source and sink | Default parallel copy count determined by service |
| --- | --- |
| Copy data between file-based stores (Blob storage; Data Lake Store; Amazon S3; an on-premises file system; an on-premises HDFS) |Between 1 and 32. Depends on the size of the files and the number of cloud data movement units (DMUs) used to copy data between two cloud data stores, or the physical configuration of the Gateway machine used for a hybrid copy (to copy data to or from an on-premises data store). |
| Copy data from **any source data store to Azure Table storage** |4 |
| All other source and sink pairs |1 |

Usually, the default behavior should give you the best throughput. However, to control the load on machines that host your data stores, or to tune copy performance, you may choose to override the default value and specify a value for the **parallelCopies** property. The value must be between 1 and 32 (both inclusive). At run time, for the best performance, Copy Activity uses a value that is less than or equal to the value that you set.

```json
"activities":[
    {
        "name": "Sample copy activity",
        "description": "",
        "type": "Copy",
        "inputs": [{ "name": "InputDataset" }],
        "outputs": [{ "name": "OutputDataset" }],
        "typeProperties": {
            "source": {
                "type": "BlobSource",
            },
            "sink": {
                "type": "AzureDataLakeStoreSink"
            },
            "parallelCopies": 8
        }
    }
]
```
Points to note:

* When you copy data between file-based stores, the **parallelCopies** determine the parallelism at the file level. The chunking within a single file would happen underneath automatically and transparently, and it's designed to use the best suitable chunk size for a given source data store type to load data in parallel and orthogonal to parallelCopies. The actual number of parallel copies the data movement service uses for the copy operation at run time is no more than the number of files you have. If the copy behavior is **mergeFile**, Copy Activity cannot take advantage of file-level parallelism.
* When you specify a value for the **parallelCopies** property, consider the load increase on your source and sink data stores, and to gateway if it is a hybrid copy. This happens especially when you have multiple activities or concurrent runs of the same activities that run against the same data store. If you notice that either the data store or Gateway is overwhelmed with the load, decrease the **parallelCopies** value to relieve the load.
* When you copy data from stores that are not file-based to stores that are file-based, the data movement service ignores the **parallelCopies** property. Even if parallelism is specified, it's not applied in this case.

> [!NOTE]
> You must use Data Management Gateway version 1.11 or later to use the **parallelCopies** feature when you do a hybrid copy.
>
>

To better use these two properties, and to enhance your data movement throughput, see the sample use cases. You don't need to configure **parallelCopies** to take advantage of the default behavior. If you do configure and **parallelCopies** is too small, multiple cloud DMUs might not be fully utilized.

### Billing impact
It's **important** to remember that you are charged based on the total time of the copy operation. If a copy job used to take one hour with one cloud unit and now it takes 15 minutes with four cloud units, the overall bill remains almost the same. For example, you use four cloud units. The first cloud unit spends 10 minutes, the second one, 10 minutes, the third one, 5 minutes, and the fourth one, 5 minutes, all in one Copy Activity run. You are charged for the total copy (data movement) time, which is 10 + 10 + 5 + 5 = 30 minutes. Using **parallelCopies** does not affect billing.

## Staged copy
When you copy data from a source data store to a sink data store, you might choose to use Blob storage as an interim staging store. Staging is especially useful in the following cases:

1. **You want to ingest data from various data stores into Azure Synapse Analytics via PolyBase**. Azure Synapse Analytics uses PolyBase as a high-throughput mechanism to load a large amount of data into Azure Synapse Analytics. However, the source data must be in Blob storage, and it must meet additional criteria. When you load data from a data store other than Blob storage, you can activate data copying via interim staging Blob storage. In that case, Data Factory performs the required data transformations to ensure that it meets the requirements of PolyBase. Then it uses PolyBase to load data into Azure Synapse Analytics. For more details, see [Use PolyBase to load data into Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md#use-polybase-to-load-data-into-azure-synapse-analytics). For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics under 15 minutes with Azure Data Factory](data-factory-load-sql-data-warehouse.md).
2. **Sometimes it takes a while to perform a hybrid data movement (that is, to copy between an on-premises data store and a cloud data store) over a slow network connection**. To improve performance, you can compress the data on-premises so that it takes less time to move data to the staging data store in the cloud. Then you can decompress the data in the staging store before you load it into the destination data store.
3. **You don't want to open ports other than port 80 and port 443 in your firewall, because of corporate IT policies**. For example, when you copy data from an on-premises data store to an Azure SQL Database sink or an Azure Synapse Analytics sink, you need to activate outbound TCP communication on port 1433 for both the Windows firewall and your corporate firewall. In this scenario, take advantage of the gateway to first copy data to a Blob storage staging instance over HTTP or HTTPS on port 443. Then, load the data into SQL Database or Azure Synapse Analytics from Blob storage staging. In this flow, you don't need to enable port 1433.

### How staged copy works
When you activate the staging feature, first the data is copied from the source data store to the staging data store (bring your own). Next, the data is copied from the staging data store to the sink data store. Data Factory automatically manages the two-stage flow for you. Data Factory also cleans up temporary data from the staging storage after the data movement is complete.

In the cloud copy scenario (both source and sink data stores are in the cloud), gateway is not used. The Data Factory service performs the copy operations.

:::image type="content" source="media/data-factory-copy-activity-performance/staged-copy-cloud-scenario.png" alt-text="Staged copy: Cloud scenario":::

In the hybrid copy scenario (source is on-premises and sink is in the cloud), the gateway moves data from the source data store to a staging data store. Data Factory service moves data from the staging data store to the sink data store. Copying data from a cloud data store to an on-premises data store via staging also is supported with the reversed flow.

:::image type="content" source="media/data-factory-copy-activity-performance/staged-copy-hybrid-scenario.png" alt-text="Staged copy: Hybrid scenario":::

When you activate data movement by using a staging store, you can specify whether you want the data to be compressed before moving data from the source data store to an interim or staging data store, and then decompressed before moving data from an interim or staging data store to the sink data store.

Currently, you can't copy data between two on-premises data stores by using a staging store. We expect this option to be available soon.

### Configuration
Configure the **enableStaging** setting in Copy Activity to specify whether you want the data to be staged in Blob storage before you load it into a destination data store. When you set **enableStaging** to TRUE, specify the additional properties listed in the next table. If you don't have one, you also need to create an Azure Storage or Storage shared access signature-linked service for staging.

| Property | Description | Default value | Required |
| --- | --- | --- | --- |
| **enableStaging** |Specify whether you want to copy data via an interim staging store. |False |No |
| **linkedServiceName** |Specify the name of an [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service) or [AzureStorageSas](data-factory-azure-blob-connector.md#azure-storage-sas-linked-service) linked service, which refers to the instance of Storage that you use as an interim staging store. <br/><br/> You cannot use Storage with a shared access signature to load data into Azure Synapse Analytics via PolyBase. You can use it in all other scenarios. |N/A |Yes, when **enableStaging** is set to TRUE |
| **path** |Specify the Blob storage path that you want to contain the staged data. If you do not provide a path, the service creates a container to store temporary data. <br/><br/> Specify a path only if you use Storage with a shared access signature, or you require temporary data to be in a specific location. |N/A |No |
| **enableCompression** |Specifies whether data should be compressed before it is copied to the destination. This setting reduces the volume of data being transferred. |False |No |

Here's a sample definition of Copy Activity with the properties that are described in the preceding table:

```json
"activities":[
{
    "name": "Sample copy activity",
    "type": "Copy",
    "inputs": [{ "name": "OnpremisesSQLServerInput" }],
    "outputs": [{ "name": "AzureSQLDBOutput" }],
    "typeProperties": {
        "source": {
            "type": "SqlSource",
        },
        "sink": {
            "type": "SqlSink"
        },
        "enableStaging": true,
        "stagingSettings": {
            "linkedServiceName": "MyStagingBlob",
            "path": "stagingcontainer/path",
            "enableCompression": true
        }
    }
}
]
```

### Billing impact
You are charged based on two steps: copy duration and copy type.

* When you use staging during a cloud copy (copying data from a cloud data store to another cloud data store), you are charged the [sum of copy duration for step 1 and step 2] x [cloud copy unit price].
* When you use staging during a hybrid copy (copying data from an on-premises data store to a cloud data store), you are charged for [hybrid copy duration] x [hybrid copy unit price] + [cloud copy duration] x [cloud copy unit price].

## Performance tuning steps
We suggest that you take these steps to tune the performance of your Data Factory service with Copy Activity:

1. **Establish a baseline**. During the development phase, test your pipeline by using Copy Activity against a representative data sample. You can use the Data Factory [slicing model](data-factory-scheduling-and-execution.md) to limit the amount of data you work with.

   Collect execution time and performance characteristics by using the **Monitoring and Management App**. Choose **Monitor & Manage** on your Data Factory home page. In the tree view, choose the **output dataset**. In the **Activity Windows** list, choose the Copy Activity run. **Activity Windows** lists the Copy Activity duration and the size of the data that's copied. The throughput is listed in **Activity Window Explorer**. To learn more about the app, see [Monitor and manage Azure Data Factory pipelines by using the Monitoring and Management App](data-factory-monitor-manage-app.md).

   :::image type="content" source="./media/data-factory-copy-activity-performance/mmapp-activity-run-details.png" alt-text="Activity run details":::

   Later in the article, you can compare the performance and configuration of your scenario to Copy Activity's [performance reference](#performance-reference) from our tests.
2. **Diagnose and optimize performance**. If the performance you observe doesn't meet your expectations, you need to identify performance bottlenecks. Then, optimize performance to remove or reduce the effect of bottlenecks. A full description of performance diagnosis is beyond the scope of this article, but here are some common considerations:

   * Performance features:
     * [Parallel copy](#parallel-copy)
     * [Cloud data movement units](#cloud-data-movement-units)
     * [Staged copy](#staged-copy)
     * [Data Management Gateway scalability](data-factory-data-management-gateway-high-availability-scalability.md)
   * [Data Management Gateway](#considerations-for-data-management-gateway)
   * [Source](#considerations-for-the-source)
   * [Sink](#considerations-for-the-sink)
   * [Serialization and deserialization](#considerations-for-serialization-and-deserialization)
   * [Compression](#considerations-for-compression)
   * [Column mapping](#considerations-for-column-mapping)
   * [Other considerations](#other-considerations)
3. **Expand the configuration to your entire data set**. When you're satisfied with the execution results and performance, you can expand the definition and pipeline active period to cover your entire data set.

## Considerations for Data Management Gateway
**Gateway setup**: We recommend that you use a dedicated machine to host Data Management Gateway. See [Considerations for using Data Management Gateway](data-factory-data-management-gateway.md#considerations-for-using-gateway).

**Gateway monitoring and scale-up/out**: A single logical gateway with one or more gateway nodes can serve multiple Copy Activity runs at the same time concurrently. You can view near-real time snapshot of resource utilization (CPU, memory, network(in/out), etc.) on a gateway machine as well as the number of concurrent jobs running versus limit in the Azure portal, see [Monitor gateway in the portal](data-factory-data-management-gateway.md#monitor-gateway-in-the-portal). If you have heavy need on hybrid data movement either with large number of concurrent copy activity runs or with large volume of data to copy, consider to [scale up or scale out gateway](data-factory-data-management-gateway-high-availability-scalability.md#scale-considerations) so as to better utilize your resource or to provision more resource to empower copy.

## Considerations for the source
### General
Be sure that the underlying data store is not overwhelmed by other workloads that are running on or against it.

For Microsoft data stores, see [monitoring and tuning topics](#performance-reference) that are specific to data stores, and help you understand data store performance characteristics, minimize response times, and maximize throughput.

If you copy data from Blob storage to Azure Synapse Analytics, consider using **PolyBase** to boost performance. See [Use PolyBase to load data into Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md#use-polybase-to-load-data-into-azure-synapse-analytics) for details. For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics under 15 minutes with Azure Data Factory](data-factory-load-sql-data-warehouse.md).

### File-based data stores
*(Includes Blob storage, Data Lake Store, Amazon S3, on-premises file systems, and on-premises HDFS)*

* **Average file size and file count**: Copy Activity transfers data one file at a time. With the same amount of data to be moved, the overall throughput is lower if the data consists of many small files rather than a few large files due to the bootstrap phase for each file. Therefore, if possible, combine small files into larger files to gain higher throughput.
* **File format and compression**: For more ways to improve performance, see the [Considerations for serialization and deserialization](#considerations-for-serialization-and-deserialization) and [Considerations for compression](#considerations-for-compression) sections.
* For the **on-premises file system** scenario, in which **Data Management Gateway** is required, see the [Considerations for Data Management Gateway](#considerations-for-data-management-gateway) section.

### Relational data stores
*(Includes SQL Database; Azure Synapse Analytics; Amazon Redshift; SQL Server databases; and Oracle, MySQL, DB2, Teradata, Sybase, and PostgreSQL databases, etc.)*

* **Data pattern**: Your table schema affects copy throughput. A large row size gives you a better performance than small row size, to copy the same amount of data. The reason is that the database can more efficiently retrieve fewer batches of data that contain fewer rows.
* **Query or stored procedure**: Optimize the logic of the query or stored procedure you specify in the Copy Activity source to fetch data more efficiently.
* For **on-premises relational databases**, such as SQL Server and Oracle, which require the use of **Data Management Gateway**, see the Considerations for Data Management Gateway section.

## Considerations for the sink
### General
Be sure that the underlying data store is not overwhelmed by other workloads that are running on or against it.

For Microsoft data stores, refer to [monitoring and tuning topics](#performance-reference) that are specific to data stores. These topics can help you understand data store performance characteristics and how to minimize response times and maximize throughput.

If you are copying data from **Blob storage** to **Azure Synapse Analytics**, consider using **PolyBase** to boost performance. See [Use PolyBase to load data into Azure Synapse Analytics](data-factory-azure-sql-data-warehouse-connector.md#use-polybase-to-load-data-into-azure-synapse-analytics) for details. For a walkthrough with a use case, see [Load 1 TB into Azure Synapse Analytics under 15 minutes with Azure Data Factory](data-factory-load-sql-data-warehouse.md).

### File-based data stores
*(Includes Blob storage, Data Lake Store, Amazon S3, on-premises file systems, and on-premises HDFS)*

* **Copy behavior**: If you copy data from a different file-based data store, Copy Activity has three options via the **copyBehavior** property. It preserves hierarchy, flattens hierarchy, or merges files. Either preserving or flattening hierarchy has little or no performance overhead, but merging files causes performance overhead to increase.
* **File format and compression**: See the [Considerations for serialization and deserialization](#considerations-for-serialization-and-deserialization) and [Considerations for compression](#considerations-for-compression) sections for more ways to improve performance.
* **Blob storage**: Currently, Blob storage supports only block blobs for optimized data transfer and throughput.
* For **on-premises file systems** scenarios that require the use of **Data Management Gateway**, see the [Considerations for Data Management Gateway](#considerations-for-data-management-gateway) section.

### Relational data stores
*(Includes SQL Database, Azure Synapse Analytics, SQL Server databases, and Oracle databases)*

* **Copy behavior**: Depending on the properties you've set for **sqlSink**, Copy Activity writes data to the destination database in different ways.
  * By default, the data movement service uses the Bulk Copy API to insert data in append mode, which provides the best performance.
  * If you configure a stored procedure in the sink, the database applies the data one row at a time instead of as a bulk load. Performance drops significantly. If your data set is large, when applicable, consider switching to using the **sqlWriterCleanupScript** property.
  * If you configure the **sqlWriterCleanupScript** property for each Copy Activity run, the service triggers the script, and then you use the Bulk Copy API to insert the data. For example, to overwrite the entire table with the latest data, you can specify a script to first delete all records before bulk-loading the new data from the source.
* **Data pattern and batch size**:
  * Your table schema affects copy throughput. To copy the same amount of data, a large row size gives you better performance than a small row size because the database can more efficiently commit fewer batches of data.
  * Copy Activity inserts data in a series of batches. You can set the number of rows in a batch by using the **writeBatchSize** property. If your data has small rows, you can set the **writeBatchSize** property with a higher value to benefit from lower batch overhead and higher throughput. If the row size of your data is large, be careful when you increase **writeBatchSize**. A high value might lead to a copy failure caused by overloading the database.
* For **on-premises relational databases** like SQL Server and Oracle, which require the use of **Data Management Gateway**, see the [Considerations for Data Management Gateway](#considerations-for-data-management-gateway) section.

### NoSQL stores
*(Includes Table storage and Azure Cosmos DB )*

* For **Table storage**:
  * **Partition**: Writing data to interleaved partitions dramatically degrades performance. Sort your source data by partition key so that the data is inserted efficiently into one partition after another, or adjust the logic to write the data to a single partition.
* For **Azure Cosmos DB**:
  * **Batch size**: The **writeBatchSize** property sets the number of parallel requests to the Azure Cosmos DB service to create documents. You can expect better performance when you increase **writeBatchSize** because more parallel requests are sent to Azure Cosmos DB. However, watch for throttling when you write to Azure Cosmos DB (the error message is "Request rate is large"). Various factors can cause throttling, including document size, the number of terms in the documents, and the target collection's indexing policy. To achieve higher copy throughput, consider using a better collection, for example, S3.

## Considerations for serialization and deserialization
Serialization and deserialization can occur when your input data set or output data set is a file. See [Supported file and compression formats](data-factory-supported-file-and-compression-formats.md) with details on supported file formats by Copy Activity.

**Copy behavior**:

* Copying files between file-based data stores:
  * When input and output data sets both have the same or no file format settings, the data movement service executes a binary copy without any serialization or deserialization. You see a higher throughput compared to the scenario, in which the source and sink file format settings are different from each other.
  * When input and output data sets both are in text format and only the encoding type is different, the data movement service only does encoding conversion. It doesn't do any serialization and deserialization, which causes some performance overhead compared to a binary copy.
  * When input and output data sets both have different file formats or different configurations, like delimiters, the data movement service deserializes source data to stream, transform, and then serialize it into the output format you indicated. This operation results in a much more significant performance overhead compared to other scenarios.
* When you copy files to/from a data store that is not file-based (for example, from a file-based store to a relational store), the serialization or deserialization step is required. This step results in significant performance overhead.

**File format**: The file format you choose might affect copy performance. For example, Avro is a compact binary format that stores metadata with data. It has broad support in the Hadoop ecosystem for processing and querying. However, Avro is more expensive for serialization and deserialization, which results in lower copy throughput compared to text format. Make your choice of file format throughout the processing flow holistically. Start with what form the data is stored in, source data stores or to be extracted from external systems; the best format for storage, analytical processing, and querying; and in what format the data should be exported into data marts for reporting and visualization tools. Sometimes a file format that is suboptimal for read and write performance might be a good choice when you consider the overall analytical process.

## Considerations for compression
When your input or output data set is a file, you can set Copy Activity to perform compression or decompression as it writes data to the destination. When you choose compression, you make a tradeoff between input/output (I/O) and CPU. Compressing the data costs extra in compute resources. But in return, it reduces network I/O and storage. Depending on your data, you may see a boost in overall copy throughput.

**Codec**: Copy Activity supports gzip, bzip2, and Deflate compression types. Azure HDInsight can consume all three types for processing. Each compression codec has advantages. For example, bzip2 has the lowest copy throughput, but you get the best Hive query performance with bzip2 because you can split it for processing. Gzip is the most balanced option, and it is used the most often. Choose the codec that best suits your end-to-end scenario.

**Level**: You can choose from two options for each compression codec: fastest compressed and optimally compressed. The fastest compressed option compresses the data as quickly as possible, even if the resulting file is not optimally compressed. The optimally compressed option spends more time on compression and yields a minimal amount of data. You can test both options to see which provides better overall performance in your case.

**A consideration**: To copy a large amount of data between an on-premises store and the cloud, consider using interim blob storage with compression. Using interim storage is helpful when the bandwidth of your corporate network and your Azure services is the limiting factor, and you want the input data set and output data set both to be in uncompressed form. More specifically, you can break a single copy activity into two copy activities. The first copy activity copies from the source to an interim or staging blob in compressed form. The second copy activity copies the compressed data from staging, and then decompresses while it writes to the sink.

## Considerations for column mapping
You can set the **columnMappings** property in Copy Activity to map all or a subset of the input columns to the output columns. After the data movement service reads the data from the source, it needs to perform column mapping on the data before it writes the data to the sink. This extra processing reduces copy throughput.

If your source data store is queryable, for example, if it's a relational store like SQL Database or SQL Server, or if it's a NoSQL store like Table storage or Azure Cosmos DB, consider pushing the column filtering and reordering logic to the **query** property instead of using column mapping. This way, the projection occurs while the data movement service reads data from the source data store, where it is much more efficient.

## Other considerations
If the size of data you want to copy is large, you can adjust your business logic to further partition the data using the slicing mechanism in Data Factory. Then, schedule Copy Activity to run more frequently to reduce the data size for each Copy Activity run.

Be cautious about the number of data sets and copy activities requiring Data Factory to connector to the same data store at the same time. Many concurrent copy jobs might throttle a data store and lead to degraded performance, copy job internal retries, and in some cases, execution failures.

## Sample scenario: Copy from a SQL Server database to Blob storage
**Scenario**: A pipeline is built to copy data from a SQL Server database to Blob storage in CSV format. To make the copy job faster, the CSV files should be compressed into bzip2 format.

**Test and analysis**: The throughput of Copy Activity is less than 2 MBps, which is much slower than the performance benchmark.

**Performance analysis and tuning**:
To troubleshoot the performance issue, let's look at how the data is processed and moved.

1. **Read data**: Gateway opens a connection to SQL Server and sends the query. SQL Server responds by sending the data stream to Gateway via the intranet.
2. **Serialize and compress data**: Gateway serializes the data stream to CSV format, and compresses the data to a bzip2 stream.
3. **Write data**: Gateway uploads the bzip2 stream to Blob storage via the Internet.

As you can see, the data is being processed and moved in a streaming sequential manner: SQL Server > LAN > Gateway > WAN > Blob storage. **The overall performance is gated by the minimum throughput across the pipeline**.

:::image type="content" source="./media/data-factory-copy-activity-performance/case-study-pic-1.png" alt-text="Data flow":::

One or more of the following factors might cause the performance bottleneck:

* **Source**: SQL Server itself has low throughput because of heavy loads.
* **Data Management Gateway**:
  * **LAN**: Gateway is located far from the SQL Server computer and has a low-bandwidth connection.
  * **Gateway**: Gateway has reached its load limitations to perform the following operations:
    * **Serialization**: Serializing the data stream to CSV format has slow throughput.
    * **Compression**: You chose a slow compression codec (for example, bzip2, which is 2.8 MBps with Core i7).
  * **WAN**: The bandwidth between the corporate network and your Azure services is low (for example, T1 = 1,544 kbps; T2 = 6,312 kbps).
* **Sink**: Blob storage has low throughput. (This scenario is unlikely because its SLA guarantees a minimum of 60 MBps.)

In this case, bzip2 data compression might be slowing down the entire pipeline. Switching to a gzip compression codec might ease this bottleneck.

## Sample scenarios: Use parallel copy
**Scenario I:** Copy 1,000 1-MB files from the on-premises file system to Blob storage.

**Analysis and performance tuning**: For an example, if you have installed gateway on a quad core machine, Data Factory uses 16 parallel copies to move files from the file system to Blob storage concurrently. This parallel execution should result in high throughput. You also can explicitly specify the parallel copies count. When you copy many small files, parallel copies dramatically help throughput by using resources more effectively.

:::image type="content" source="./media/data-factory-copy-activity-performance/scenario-1.png" alt-text="Scenario 1":::

**Scenario II**: Copy 20 blobs of 500 MB each from Blob storage to Data Lake Store Analytics, and then tune performance.

**Analysis and performance tuning**: In this scenario, Data Factory copies the data from Blob storage to Data Lake Store by using single-copy (**parallelCopies** set to 1) and single-cloud data movement units. The throughput you observe will be close to that described in the [performance reference section](#performance-reference).

:::image type="content" source="./media/data-factory-copy-activity-performance/scenario-2.png" alt-text="Scenario 2":::

**Scenario III**: Individual file size is greater than dozens of MBs and total volume is large.

**Analysis and performance turning**: Increasing **parallelCopies** doesn't result in better copy performance because of the resource limitations of a single-cloud DMU. Instead, you should specify more cloud DMUs to get more resources to perform the data movement. Do not specify a value for the **parallelCopies** property. Data Factory handles the parallelism for you. In this case, if you set **cloudDataMovementUnits** to 4, a throughput of about four times occurs.

:::image type="content" source="./media/data-factory-copy-activity-performance/scenario-3.png" alt-text="Scenario 3":::

## Reference
Here are performance monitoring and tuning references for some of the supported data stores:

* Azure Blob storage: [Scalability and performance targets for Blob storage](../../storage/blobs/scalability-targets.md) and [Performance and scalability checklist for Blob storage](../../storage/blobs/storage-performance-checklist.md).
* Azure Table storage: [Scalability and performance targets for Table storage](../../storage/tables/scalability-targets.md) and [Performance and scalability checklist for Table storage](../../storage/tables/storage-performance-checklist.md).
* Azure SQL Database: You can [monitor the performance](/azure/azure-sql/database/monitor-tune-overview) and check the database transaction unit (DTU) percentage
* Azure Synapse Analytics: Its capability is measured in data warehouse units (DWUs); see [Manage compute power in Azure Synapse Analytics (Overview)](../../synapse-analytics/sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md)
* Azure Cosmos DB: [Performance levels in Azure Cosmos DB](../../cosmos-db/performance-levels.md)
* On-premises SQL Server: [Monitor and tune for performance](/sql/relational-databases/performance/monitor-and-tune-for-performance)
* On-premises file server: [Performance tuning for file servers](/previous-versions//dn567661(v=vs.85))