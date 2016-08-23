<properties
	pageTitle="Copy Activity performance and tuning guide | Microsoft Azure"
	description="Learn about key factors that affect the performance of data movement in Azure Data Factory when you use Copy Activity."
	services="data-factory"
	documentationCenter=""
	authors="spelluru"
	manager="jhubbard"
	editor="monicar"/>

<tags
	ms.service="data-factory"
	ms.workload="data-services"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="08/09/2016"
	ms.author="spelluru"/>


# Copy Activity performance and tuning guide
This article describes key factors that affect the performance of data movement when you use the Copy Activity feature of Azure Data Factory. It also lists the performance that we observed in our own testing, and discusses various ways to optimize the performance of Copy Activity.

By using Copy Activity, you can get high data movement throughput:

- Ingest 1 TB of data into Azure Blob storage from an on-premises file system and Blob storage in under three hours (at 100 MBps)
- Ingest 1 TB of data into Azure Data Lake Store from an on-premises file system and Azure Blob storage in under three hours (at 100 MBps)
- Ingest 1 TB of data into Azure SQL Data Warehouse from Blob storage in under three hours (at 100 MBps)

Read on to learn more about the performance of Copy Activity and for tuning tips to further improve it.

> [AZURE.NOTE] If you are not familiar with Copy Activity in general, before reading this article, see [Data Movement Activities](data-factory-data-movement-activities.md).

## Performance tuning steps
We suggest you take these steps to tune the performance of your Data Factory service with Copy Activity:

1.	**Establish a baseline**. During the development phase, test your pipeline by using Copy Activity against a representative data sample. You can use the Data Factory [slicing model](data-factory-scheduling-and-execution.md#time-series-datasets-and-data-slices) to limit the amount of data you work with.

	Collect execution time and performance characteristics by using the **Monitoring and Management App**. Choose **Monitor & Manage** on your Data Factory home page, and then choose the **output dataset** in the tree view. Choose the copy activity run in the **Activity Windows** list. You should see the Copy Activity duration in the **Activity Windows** list, and the size of the data that is copied. The throughput is listed in the **Activity Window Explorer** window. See [Monitor and manage Azure Data Factory pipelines by using the Monitoring and Management App](data-factory-monitor-manage-app.md) to learn more about the app.

	![Activity run details](./media/data-factory-copy-activity-performance/mmapp-activity-run-details.png)

	Later in the article, you can compare the performance and configuration of your scenario to Copy Activity’s [performance reference](#performance-reference) from our tests.
2. **Diagnose and optimize performance**. If the performance you observe doesn't meet your expectations, you need to identify performance bottlenecks, and then optimize performance to remove or reduce the effect of bottlenecks. A full description of performance diagnosis is beyond the scope of this article, but here are a few common considerations:
	- [Source](#considerations-on-source)
	- [Sink](#considerations-on-sink)
	- [Serialization and deserialization](#considerations-on-serializationdeserialization)
	- [Compression](#considerations-on-compression)
	- [Column mapping](#considerations-on-column-mapping)
	- [Data Management Gateway](#considerations-on-data-management-gateway)
	- [Other considerations](#other-considerations)
	- [Parallel copy](#parallel-copy)
	- [Cloud data movement units](#cloud-data-movement-units)    

3. **Expand the configuration to your entire data set**. When you're satisfied with the execution results and performance, you can expand the definition and pipeline active period to cover your entire data set.

## Performance reference
> [AZURE.IMPORTANT] **Disclaimer**: Use the data that we discuss in the next few sections only for guidance and high-level planning. The data is based on the assumption that bandwidth, hardware, configuration, and so on, are among the best in their class. The data movement throughput that you observe is affected by a range of variables. Refer to the sections later in the article to learn about how you might tune performance and achieve better performance for your data movement. We will update this data when performance-boosting improvements and features are added.

![Performance matrix](./media/data-factory-copy-activity-performance/CopyPerfRef.png)

Points to note:

- Throughput is calculated by using the following formula: [size of data read from source]/[Copy Activity run duration].
- We used the [TPC-H](http://www.tpc.org/tpch/) data set to calculate numbers in the preceding table.
- In Azure data stores, the source and sink are in the same Azure region.
- **cloudDataMovementUnits** is set to 1 and **parallelCopies** is not specified.
- For hybrid (on-premises to cloud, or cloud to on-premises) data movement, a single instance of Data Management Gateway ran on a machine that was separate from the on-premises data store. The configuration is listed in the next table. When a single activity was running on the gateway, the copy operation consumed only a small portion of the test machine's CPU or memory resource and a small portion of its network bandwidth.
	<table>
	<tr>
		<td>CPU</td>
		<td>32 Cores 2.20 GHz Intel Xeon® E5-2660 v2</td>
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

## Parallel copy
You can read data from the source or write data to the destination **in parallel within a Copy Activity run**. This enhances the throughput of a copy operation and reduces the time it takes to move data.

This setting is different from the **concurrency** property in the activity definition. The **concurrency** property determines the number of **concurrent Copy Activity runs** needed to process data from different activity windows (1 AM to 2 AM, 2 AM to 3 AM, 3 AM to 4 AM, and so on). This capability is helpful when you perform a historical load. The parallel copy capability applies to a **single activity run**.

Let's look at a sample scenario. In the following example, multiple slices from the past need to be processed. Data Factory runs an instance of Copy Activity (an activity run) for each slice:

- The data slice from the first activity window (1 AM to 2 AM) ==> Activity run 1
- The data slice from the second activity window (2 AM to 3 AM) ==> Activity run 2
- The data slice from the second activity window (3 AM to 4 AM) ==> Activity run 3

And so on.

In this example, when the **concurrency** value is set to 2, **Activity run 1** and **Activity run 2** copy data from two activity windows **concurrently** to improve data movement performance. However, if multiple files are associated with Activity run 1, files are copied from the source to the destination one file at a time.

### parallelCopies
You can use the **parallelCopies** property to indicate the parallelism that you want Copy Activity to use. You can think of this property as the maximum number of threads within Copy Activity that can read from your source or write to your sink data stores in parallel.

For each Copy Activity run, Data Factory determines the number of parallel copies to use to copy data from the source data store and to the destination data store. The default number of parallel copies that it uses depends on the type of source and sink that you are using.  

Source and sink |	Default parallel copy count determined by service
------------- | -------------------------------------------------
Copy data between file-based stores (Blob storage; Data Lake Store; an on-premises file system; an on-premises Hadoop Distributed File System, or HDFS) | Between 1 and 32, based on the size of the files and the number of cloud data movement units (DMUs) used to copy data between two cloud data stores, or on the physical configuration of the gateway machine you use for a hybrid copy (to copy data to or from an on-premises data store).
Copy data from **any source data store to Azure Table storage** | 4
All other source and sink pairs | 1

In most cases, the default behavior should give you the best throughput. However, to control the load on the machines that host your data stores, or to tune copy performance, you might choose to override the default value and specify a value for the **parallelCopies** property. The value must be between 1 and 32 (both inclusive). At run time, for the best performance, Copy Activity uses a value that is less than or equal to the value that you set.

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

Points to note:

- When you copy data between file-based stores, parallelism happens at the file level. There's no chunking within a single file. The actual number of parallel copies the data movement service uses for the copy operation at run time is not more than the number of files you have. If the copy behavior is **mergeFile**, Copy Activity cannot take advantage of parallelism.
- When you specify a value for the **parallelCopies** property, consider the load increase to your source and sink data stores, and to the gateway if it is a hybrid copy. This is especially true when you have multiple activities or concurrent runs of the same activities that run against the same data store. If you notice that either the data store or the gateway is overwhelmed with the load, decrease the **parallelCopies** value to relieve the load.
- When you copy data from stores that are not file-based to stores that are file-based, the data movement service ignores the **parallelCopies** property. Even if parallelism is specified, it's not applied in this case.

> [AZURE.NOTE] You must use Data Management Gateway version 1.11 or later to use the **parallelCopies** feature when you do a hybrid copy.

### Cloud data movement units
A cloud data movement unit (DMU) is a measure that represents the power (a combination of CPU, memory, and network resource allocation) of a single unit in Data Factory. A DMU can apply to a cloud-to-cloud copy operation, but not to a hybrid copy. By default, Data Factory uses a single-cloud DMU to perform a single Copy Activity run. You can override this default by specifying a value for the **cloudDataMovementUnits** property. Currently, the **cloudDataMovementUnits** setting is supported *only* for copying data between two instances of Blob storage or from an instance of Blob storage to an instance of Azure Data Lake Store. It takes effect when you copy multiple files that individually are greater than or equal to 16 MB.

If you need to copy multiple relatively large files, a high **parallelCopies** value might not improve performance because of the resource limitations of a single-cloud DMU. In this case, you might want to use more cloud DMUs to copy huge amounts of data with high throughput. To specify the number of cloud DMUs you want Copy Activity to use, set a value for the **cloudDataMovementUnits** property, like this:

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
	            "cloudDataMovementUnits": 4
	        }
	    }
	]

The **allowed values** for the **cloudDataMovementUnits** property are 1 (default), 2, 4, and 8. If you need more cloud DMUs for a higher throughput, contact [Azure support](https://azure.microsoft.com/blog/2014/06/04/azure-limits-quotas-increase-requests/). The **actual number of cloud DMUs** the copy operation uses at run time is equal to or less than the configured value, depending on the number of files you want to copy from the source, and which meet the size criteria.

> [AZURE.NOTE] The **parallelCopies** property value should be greater than or equal to **cloudDataMovementUnits** if it is specified. When **cloudDataMovementUnits** is greater than 1, parallel data movement is spread across **cloudDataMovementUnits** for that Copy Activity run, and this boosts throughput.

When you copy multiple large files with **cloudDataMovementUnits** configured as 2, 4, and 8, the performance can reach 2x (two times), 4x, and 7x the number of reference numbers mentioned in the performance reference section.

To better take advantage of these two properties and to enhance your data movement throughput, refer to [sample use cases](#case-study---parallel-copy).   

It's important to remember that you are charged based on the total time of the copy operation. If a copy job used to take one hour with one cloud unit and now it takes 15 minutes with four cloud units, the overall bill will be almost the same. For example, if you are using four cloud units and the first cloud unit spends 10 minutes, the second one spends 10 minutes, the third one spends 5 minutes, and the fourth one spends 5 minutes all in one Copy Activity run, you are charged for the total copy (data movement) time, which is 10 + 10 + 5 + 5 = 30 minutes. Using **parallelCopies** does not affect billing.

## Staged copy
When you copy data from a source data store to a sink data store, you might choose to use Blob storage as an interim staging store. This staging capability is especially useful in the following cases:

-	**Sometimes it takes a while to perform a hybrid data movement (that is, to copy from an on-premises data store to a cloud data store, or vice versa) over a slow network connection**. To improve performance, you can compress the data on-premises so that it takes less time to move data to the staging data store in the cloud. You could then decompress the data in the staging store before you load it into the destination data store.
2.	**You don't want to open ports other than 80 and 443 in your firewall, because of IT policies**. For example, when you copy data from an on-premises data store to an Azure SQL Database sink or an Azure SQL Data Warehouse sink, you need to activate outbound TCP communication on port 1433 for both the Windows firewall and your corporate firewall. In that scenario, you can take advantage of Data Management Gateway to first copy data to a Blob storage staging instance, which happens over HTTP or HTTPS, on port 443. Then, load the data into an SQL Database or SQL Data Warehouse from Blob storage staging. In this flow, you don't need to enable port 1433.
3.	**You ingest data from various data stores into SQL Data Warehouse via PolyBase**. SQL Data Warehouse uses PolyBase as a high-throughput mechanism to load a large amount of data into SQL Data Warehouse. However, the source data must be in Blob storage, and it must meet additional criteria. When you load data from a data store other than Blob storage, you can activate data copying via interim staging Blob storage. In that case, Data Factory performs the required data transformations to ensure that it meets the requirements of PolyBase. Then it uses PolyBase to load data into SQL Data Warehouse. See [Use PolyBase to load data into Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md#use-polybase-to-load-data-into-azure-sql-data-warehouse) for more details and for samples.

### How staged copy works
When you activate the staging feature, first, the data is copied from the source data store to the staging data store (bring your own). Then, the data is copied from the staging data store to the sink data store. Data Factory automatically manages the two-stage flow for you. Data Factory also cleans up temporary data from the staging storage after the data movement is complete.

In the **cloud copy scenario**, where both source and sink data stores are in the cloud and don't use Data Management Gateway, Data Factory does the copy operations.

![Staged copy: Cloud scenario](media/data-factory-copy-activity-performance/staged-copy-cloud-scenario.png)

In the hybrid copy scenario, where the source is on-premises and the sink is in the cloud, Data Management Gateway moves data from the source data store to a staging data store. Data Factory also moves data from the staging data store to the sink data store. Copying data from a cloud data store to an on-premises data store via staging also is supported with reversed flow.

![Staged copy: Hybrid scenario](media/data-factory-copy-activity-performance/staged-copy-hybrid-scenario.png)

When you activate data movement by using a staging store, you can specify whether you want the data to be compressed before moving data from the source data store to an interim or staging data store, and then decompressed before moving data from an interim or staging data store to the sink data store.

Currently, you can't copy data between two on-premises data stores by using a staging store. We expect this option to be available soon.

### Configuration
You can configure the **enableStaging** setting on Copy Activity to specify whether you want the data to be staged in Blob storage before you load it into a destination data store. When you set **enableStaging** to TRUE, you need to specify the additional properties listed in the next table. If you don’t have one, you also need to create an Azure Storage or Storage shared access signature-linked service for staging.

Property | Description | Default value | Required
--------- | ----------- | ------------ | --------
**enableStaging** | Specify whether you want to copy data via an interim staging store. | False | No
**linkedServiceName** | Specify the name of an [AzureStorage](data-factory-azure-blob-connector.md#azure-storage-linked-service) or [AzureStorageSas](data-factory-azure-blob-connector.md#azure-storage-sas-linked-service) linked service, which refers to the instance of Storage that you'll use as an interim staging store. <br/><br/> You cannot use Storage with a shared access signature to load data into SQL Data Warehouse via PolyBase. You can use it in all other scenarios. | N/A | Yes, when **enableStaging** is set to TRUE.
**path** | Specify the Blob storage path that you want to contain the staged data. If you do not provide a path, the service creates a container to store temporary data. <br/><br/> You need to specify a path only if you use Storage with a shared access signature, or you require temporary data to be in a specific location. | N/A | No
**enableCompression** | Specify whether data should be compressed when it is moved from a source data store to a sink data store, to reduce the volume of data being transferred. | False | No

Here's a sample definition of Copy Activity, with the properties described in the table:

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


### Billing impact
You are charged based on the two stages of copy duration and copy type, respectively. This means that:

- When you use staging during a cloud copy (copying data from a cloud data store to another cloud data store, for example, from Data Lake Store to SQL Data Warehouse), you are charged the [sum of copy duration for step 1 and step 2] x [cloud copy unit price].
- When you use staging during a hybrid copy (copying data from an on-premises data store to a cloud data store, for example, from an on-premises SQL Server database to SQL Data Warehouse), you are charged for [hybrid copy duration] x [hybrid copy unit price] + [cloud copy duration] x [cloud copy unit price].


## Considerations for the source
### General
Be sure that the underlying data store is not overwhelmed by other workloads that are running on or against it. This includes but is not limited to Copy Activity.

For Microsoft data stores, refer to [monitoring and tuning topics](#appendix-data-store-performance-tuning-reference) that are specific to data stores, and which can help you understand data store performance characteristics, minimize response times, and maximize throughput.

If you copy data from Blob storage to SQL Data Warehouse, consider using **PolyBase** to boost performance. See [Use PolyBase to load data into Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md###use-polybase-to-load-data-into-azure-sql-data-warehouse) for details.


### File-based data stores
*(Includes Blob storage, Data Lake Store, and on-premises file systems)*

- **Average file size and file count**: Copy Activity transfers data one file at a time. With the same amount of data to be moved, the overall throughput is lower if the data consists of a large number of small files rather than a small number of larger files because of the bootstrap phase for each file. Therefore, if possible, combine small files into larger files to gain higher throughput.
- **File format and compression**: See the [considerations for serialization and deserialization](#considerations-on-serializationdeserialization) and [considerations for compression](#considerations-on-compression) sections for more ways to improve performance.
- For the **on-premises file system** scenario, in which **Data Management Gateway** is required, see the [Considerations for Gateway](#considerations-on-data-management-gateway) section.

### Relational data stores
*(Includes SQL databases, SQL Data Warehouse, SQL Server databases, Oracle, MySQL, DB2, Teradata, Sybase, and PostgreSQL databases)*

- **Data pattern**: Your table schema affects copy throughput. A large row size gives you a better performance than small row size, to copy the same amount of data, because the database can more efficiently retrieve fewer batches of data that contain fewer rows.
- **Query or stored procedure**: Optimize the logic of the query or stored procedure you specify in the Copy Activity source to fetch data more efficiently.
- For **on-premises relational databases**, such as SQL Server and Oracle, which require the use of **Data Management Gateway**, see the [Considerations for Gateway](#considerations-on-data-management-gateway) section.

## Considerations for the sink

### General
Be sure that the underlying data store is not overwhelmed by other workloads that are running on or against it. This includes but is not limited to Copy Activity.  

For Microsoft data stores, refer to [monitoring and tuning topics](#appendix-data-store-performance-tuning-reference) that are specific to data stores. These topics can help you understand data store performance characteristics and how to minimize response times and maximize throughput.

If you are copying data from **Blob storage** to **SQL Data Warehouse**, consider using **PolyBase** to boost performance. See [Use PolyBase to load data into Azure SQL Data Warehouse](data-factory-azure-sql-data-warehouse-connector.md###use-polybase-to-load-data-into-azure-sql-data-warehouse) for details.


### File-based data stores
*(Includes Blob storage, Data Lake Store, and on-premises file systems)*

- **Copy behavior**: If you copy data from a different file-based data store, Copy Activity has three options via the **copyBehavior** property. It preserves hierarchy, flattens hierarchy, or merges files. Either preserving or flattening hierarchy has little or no performance overhead, but merging files causes it to increase.
- **File format and compression**: See the [considerations for serialization and deserialization](#considerations-on-serializationdeserialization) and [considerations for compression](#considerations-on-compression) sections for more ways to improve performance.
- **Blob storage** currently supports only block blobs for optimized data transfer and throughput.
- For **on-premises file systems** scenarios that require the use of **Data Management Gateway**, see the [Considerations for Gateway](#considerations-on-data-management-gateway) section.

### Relational data stores
*(Includes SQL Database, SQL Data Warehouse, and SQL Server databases)*

- **Copy behavior**: Depending on the properties you've set for **sqlSink**, Copy Activity writes data to the destination database in different ways.
	- By default, the data movement service uses the Bulk Copy API to insert data in append mode, which provides the best performance.
	- If you configure a stored procedure in the sink, the database applies the data one row at a time instead of as a bulk load. Performance drops significantly. If the size of your data is large, when applicable, consider switching to using the **sqlWriterCleanupScript** property.
	- If you configure the **sqlWriterCleanupScript** property for each Copy Activity run, the service triggers the script and then you use the Bulk Copy API to insert the data. For example, to overwrite the whole table with the latest data, you can specify a script to first delete all records before bulk-loading the new data from the source.
- **Data pattern and batch size**:
	- Your table schema affects copy throughput. To copy the same amount of data, a large row size gives you better performance than a small row size because the database can more efficiently commit fewer batches of data.
	- Copy Activity inserts data in a series of batches. You can set the number of rows in a batch by using the **writeBatchSize** property. If your data has small rows, you can set the **writeBatchSize** property with a higher value to benefit from lower batch overhead and higher throughput. If the row size of your data is large, be careful when you increase **writeBatchSize**. A high value might lead to a copy failure caused by overloading of the database.
- For **on-premises relational databases** like SQL Server and Oracle, which require the use of **Data Management Gateway**, see the [Considerations for Gateway](#considerations-on-data-management-gateway) section.


### NoSQL stores
*(Including Azure Table and Azure DocumentDB)*

- For **Azure Table**:
	- **Partition**: Writing data to interleaved partitions dramatically degrades performance. You can order your source data by partition key so that the data is inserted efficiently into partition after partition, or you can adjust the logic to write the data to a single partition.
- For **Azure DocumentDB**:
	- **Batch size**: The **writeBatchSize** property sets the number of parallel requests to the DocumentDB service to create documents. You can expect better performance when you increase **writeBatchSize** because more parallel requests are sent to DocumentDB. However, watch for throttling when you write to DocumentDB (the error message is "Request rate is large"). Various factors can cause throttling, including document size, the number of terms in the documents, and the target collection's indexing policy. To achieve higher copy throughput, consider using a better collection, for example, S3.

## Considerations for serialization and deserialization
Serialization and deserialization can occur when your input data set or output data set is a file. Currently, Copy Activity supports Avro and Text (for example, CSV and TSV) data formats.

**Copy behaviors**:
- Copying files between file-based data stores:
	- When input and output data sets both have the same or no file format settings, the data movement service executes a binary copy without any serialization or deserialization. You'll see a higher throughput compared to the scenario in which the source and sink file format settings are different from each other.
	- When input and output data sets both are in text format and only the encoding type is different, the data movement service only does encoding conversion. It doesn't do any serialization and deserialization, which causes some performance overhead compared to a binary copy.
	- When input and output data sets both have different file formats or different configurations, like delimiters, the data movement service deserializes the source data to stream, transform, and then serialize it into the output format you've indicated. This results in a much more significant performance overhead compared to other scenarios.
- When you copy files to and from a data store that is not file-based (for example, from a file-based store to a relational store), the serialization or deserialization step is required. This results in significant performance overhead.

**File format**: The file format you choose might affect copy performance. For example, Avro is a compact binary format that stores metadata with data. It has broad support in the Hadoop ecosystem for processing and querying. However, Avro is more expensive for serialization and deserialization, which results in lower copy throughput compared to text format. You should make your choice of file format throughout the processing flow holistically, starting from what form the data is stored in; source, data stores, or to be extracted from external systems; the best format for storage; analytical processing and querying; and in what format you will export the data into data marts for reporting and visualization tools. Sometimes a file format that is suboptimal for read and write performance might be a good choice when you consider the overall analytical process.

## Considerations for compression
When your input or output data set is a file, you can set Copy Activity to perform compression or decompression as it writes data to the destination. When you choose compression, you make a tradeoff between input/output (I/O) and CPU. Compressing the data costs extra in compute resources, but in return, it reduces network I/O and storage, which, depending on your data, could give you a boost in overall copy throughput.

**Codec**: Copy Activity supports gzip, bzip2, and Deflate compression types. Azure HDInsight can consume all three types for processing. Each compression codec has advantages. For example, bzip2 has the lowest copy throughput, but you get the best Hive query performance with bzip2 because you can split it for processing. Gzip is the most balanced option, and it is used the most often. Choose the codec that best suits your end-to-end scenario.

**Level**: You can choose from two options for each compression codec: fastest compressed and optimally compressed. The fastest compressed option compresses the data as quickly as possible, even if the resulting file is not optimally compressed. The optimally compressed option spends more time on compression and yields a minimal amount of data. You can test both options to see which provides better overall performance in your case.

**A consideration**: To copy a large amount of data between an on-premises store and the cloud, consider using interim Blob storage with compression. This is helpful when the bandwidth of your corporate network and Azure services is the limiting factor and you want the input data set and output data set both to be in uncompressed form. More specifically, you can break a single copy activity into two copy activities. The first copy activity copies from the source to an interim or staging blob in compressed form. The second copy activity copies the compressed data from staging, and then decompresses while it writes to the sink.

## Considerations for column mapping
You can set the **columnMappings** property in Copy Activity to map all or a subset of the input columns to the output columns. After it reads the data from the source, the data movement service needs to perform column mapping on the data before it writes the data to the sink. This extra processing reduces copy throughput.

If your source data store is queryable, for example, if it's a relational store like Azure SQL Database or SQL Server, or if it's a NoSQL store like Azure Table or Azure DocumentDB, consider pushing the column filtering and reordering logic to the **query** property instead of using column mapping. The projection then occurs while the data movement service reads data from the source data store, and is much more efficient.

## Considerations for Data Management Gateway
For Gateway setup recommendations, see [Considerations for using Data Management Gateway](data-factory-move-data-between-onprem-and-cloud.md#Considerations-for-using-Data-Management-Gateway).

**Gateway machine environment**: We recommend that you use a dedicated machine to host Data Management Gateway. Use tools like PerfMon to examine CPU, memory, and bandwidth use during a copy operation on your Gateway machine. Switch to a more powerful machine if CPU, memory, or network bandwidth becomes a bottleneck.

**Concurrent Copy Activity runs**: A single instance of Data Management Gateway can serve multiple Copy Activity runs at the same time. Gateway can execute a number of copy jobs concurrently. The maximum number of concurrent jobs is calculated based on the Gateway machine’s hardware configuration. Additional copy jobs are queued until they are picked up by gateway or until another job times out. To avoid resource contention on the Gateway machine, you can stage your Copy Activity schedule to reduce the number of copy jobs in the queue at a time, or consider splitting the load onto multiple Gateway machines.


## Other considerations
If the size of data you want to copy is very large, you can adjust your business logic to further partition the data using slicing mechanism in Data Factory, and then schedule Copy Activity to run more frequently to reduce the data size for each Copy Activity run.

Be cautious about the number of data sets and copy activities reaching out to the same data store at the same time. A large number of concurrent copy jobs can throttle a data store and lead to degraded performance, copy job internal retries, and in some cases, execution failures.

## Case Study: Copy from on-premises SQL Server to Blob storage
**Scenario**: A pipeline is built to copy data from an on-premises SQL Server to Blob storage in CSV format. To make the copy job faster, it's specified that the CSV files should be compressed in bzip2 format.

**Test and analysis**: The throughput of Copy Activity is less than 2 MBps, which is much slower than the performance benchmark.

**Performance analysis and tuning**:
To troubleshoot the performance issue, let’s look at how the data is processed and moved:

1.	**Read data**: Gateway opens a connection to SQL Server and sends the query. SQL Server responds by sending the data stream to Gateway via the intranet.
2.	**Serialize and compress data**: Gateway serializes the data stream to CSV format, and compresses the data to a bzip2 stream.
3.	**Write data**: Gateway uploads the bzip2 stream to Blob storage via the Internet.

As you can see, the data is being processed and moved in a streaming sequential manner: SQL Server > LAN > Gateway > WAN > Blob storage. **The overall performance is gated by the minimum throughput across the pipeline**.

![Data flow](./media/data-factory-copy-activity-performance/case-study-pic-1.png)

One or more of the following factors might cause the performance bottleneck:

-	**Source**: SQL Server itself has low throughput because of heavy loads
-	**Data Management Gateway**:
	-	**LAN**: Gateway is located far from the SQL Server machine and has a low-bandwidth connection
	-	**Gateway**: Gateway has reached its load limitations to perform the following:
		-	**Serialization**: Serializing the data stream to CSV format has slow throughput
		-	**Compression**: You chose a slow compression codec (for example, bzip2, which is 2.8 MBps with Core i7)
	-	**WAN**: The bandwidth between the corporate network and Azure services is low (for example, T1 = 1,544 kbps; T2 = 6,312 kbps)
-	**Sink**: Azure Blob has low throughput (this is unlikely because its SLA guarantees a minimum of 60 MBps).

In this case, bzip2 data compression might be slowing down the entire pipeline. Switching to a gzip compression codec might ease this bottleneck.


## Case study: Parallel copy  

**Scenario I:** Copy 1,000 1-MB files from the on-premises file system to Blob storage.

**Analysis and performance tuning**: For example, if you have installed Data Management Gateway on a quad core machine, Data Factory uses 16 parallel copies to move files from the file system to Blob storage concurrently. This should result in high throughput. You also can explicitly specify the parallel copies count. When you copy a large number of small files, parallel copies dramatically help throughput by using resources more effectively.

![Scenario 1](./media/data-factory-copy-activity-performance/scenario-1.png)

**Scenario II**: Copy 20 blobs of 500 MB each from Blob storage to Data Lake Store Analytics, and then tune performance.

**Analysis and performance tuning**: In this scenario, Data Factory copies the data from Blob storage to Data Lake Store by using single-copy (**parallelCopies** set to 1) and single-cloud data movement units. The throughput you observe will be close to that described in the [performance reference section](#performance-reference).   

![Scenario 2](./media/data-factory-copy-activity-performance/scenario-2.png)

When individual file size is greater than dozens of MBs and total volume is large, increasing **parallelCopies** doesn't result in better copy performance because of the resource limitations of a single-cloud DMU. Instead, you should specify more cloud DMUs to get more resources to perform the data movement. Do not specify a value for the **parallelCopies** property. Data Factory handles the parallelism for you. In this case, if you specify **cloudDataMovementUnits** as 4, a throughput of about four times occurs.

![Scenario 3](./media/data-factory-copy-activity-performance/scenario-3.png)

## Reference
Here are some performance monitoring and tuning references for a few of the supported data stores:

- Azure Storage (including Blob storage and Azure Table): [Azure Storage scalability targets](../storage/storage-scalability-targets.md) and [Azure Storage performance and scalability checklist](../storage//storage-performance-checklist.md).
- Azure SQL Database: You can [monitor the performance](../sql-database/sql-database-service-tiers.md#monitoring-performance) and check the database transaction unit (DTU) percentage.
- Azure SQL Data Warehouse: Its capability is measured in data warehouse units (DWUs). See [Elastic performance and scale with SQL Data Warehouse](../sql-data-warehouse/sql-data-warehouse-manage-compute-overview.md).
- Azure DocumentDB: [Performance level in DocumentDB](../documentdb/documentdb-performance-levels.md).
- On-premises SQL Server: [Monitor and tune for performance](https://msdn.microsoft.com/library/ms189081.aspx).
- On-premises file server: [Performance tuning for file servers](https://msdn.microsoft.com/library/dn567661.aspx).
