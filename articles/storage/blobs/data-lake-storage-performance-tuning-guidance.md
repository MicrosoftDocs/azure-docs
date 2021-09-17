---
title: Optimize Azure Data Lake Storage Gen2 for performance | Microsoft Docs
description: Understand how to optimize Azure Data Lake Storage Gen2 for performance. Ingest data, structure your dataset, and more.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 09/17/2021
ms.author: normesta
ms.reviewer: stewu
---

# Optimize Azure Data Lake Storage Gen2 for performance

Azure Data Lake Storage Gen2 supports high-throughput for I/O intensive analytics and data movement. This article helps you to optimize for throughput and efficient data access. The overall performance of your analytics pipeline also depend on factors that are specific to the analytics engines. To find the best up-to-date guidance about how to optimize each analytic engine, see the documentation for each one that you intend to use with Azure Data Lake Storage Gen2 enabled Azure Storage account.

## Optimize data ingestion

When ingesting data from a source system, the source hardware, source network hardware, or network connectivity to your storage account can be the bottleneck.  

![Diagram that shows the factors to consider when ingesting data from a source system to Data Lake Storage Gen2.](./media/data-lake-storage-performance-tuning-guidance/bottleneck.png)

### Source hardware

Whether you are using on-premises machines or Virtual Machines (VMs) in Azure, make sure to carefully select the appropriate hardware. For disk hardware, consider using Solid State Drives (SSD) and pick disk hardware that has faster spindles. For network hardware, use the fastest Network Interface Controllers (NIC) as possible. On Azure, we recommend Azure D14 VMs which have the appropriately powerful disk and networking hardware.

### Network connectivity to the storage account

The network connectivity between your source data and your storage account can sometimes be the bottleneck. When your source data is on premise, consider using a dedicated link with [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). If your source data is in Azure, the performance is best when the data is in the same Azure region as your Data Lake Storage Gen2 enabled account.

### Configure data ingestion tools for maximum parallelization

To achieve the best performance, use all available throughput by performing as many reads and writes in parallel as possible.

![Data Lake Storage Gen2 performance](./media/data-lake-storage-performance-tuning-guidance/throughput.png)

The following table summarizes the key settings for several popular ingestion tools and provides in-depth performance tuning articles for them.  

| Tool               | Settings | More Details                                                                 |
|--------------------|------------------------------------------------------|------------------------------|
| DistCp            | -m (mapper)	| [Link](data-lake-storage-use-distcp.md#performance-considerations-while-using-distcp)                             |
| Azure Data Factory| parallelCopies	| [Link](../../data-factory/copy-activity-performance.md)                          |
| Sqoop           | fs.azure.block.size, -m (mapper)	|	[Link](/archive/blogs/shanyu/performance-tuning-for-hdinsight-storm-and-microsoft-azure-eventhubs)        |

Your account can scale to provide the necessary throughput for all analytics scenarios. By default, a Data Lake Storage Gen2 enabled account provides enough throughput in its default configuration to meet the needs of a broad category of use cases. If you run into the default limit, the account can be configured to provide more throughput by contacting [Azure Support](https://azure.microsoft.com/support/faq/).

## Use a large file size

Typically, analytics engines such as HDInsight and Azure Data Lake Analytics have a per-file overhead that involve tasks such as listing, checking access, and performing various metadata operations. If you store your data as many small files, this can negatively affect performance. In general, organize your data into larger sized files for better performance (256MB to 100GB in size). Some engines and applications might have trouble efficiently processing files that are greater than 100GB in size.

Sometimes, data pipelines have limited control over the raw data which has lots of small files. In general, we recommend that your system have some sort of process to aggregate small files into larger ones for use by downstream applications. If you're processing data in real-time, you can use a real time streaming engine (such as Azure Stream Analytics or Spark Streaming) together with a message broker (such as Event Hub or Apache Kafka) to store your data as larger files.

As your storing larger files, you might use this opportunity to store data in a read-optimized format such as Apache Parquet for downstream processing. Apache Parquet is an open source file format that is optimized for read heavy analytics pipelines. The columnar storage structure of Parquet lets you skip over non-relevant data. You're queries are much more efficient because only narrowly scope which data to send from storage to the analytics engine. Also, because similar data types (for a column) are stored together, Parquet lends itself well to efficient data compression and encoding schemes which lead to lower data storage costs. Services such as Azure Synapse Analytics, Azure Databricks and Azure Data Factory have native functionality that take advantage of Parquet file formats.

For more information about data formats, see [data format section of best practice article](data-lake-storage-best-practices.md).

## Organizing time series data in folders

For Hive workloads, partition pruning of time-series data can help some queries read only a subset of the data which improves performance.    

Those pipelines that ingest time-series data, often place their files with a very structured naming for files and folders. Below is a very common example we see for data that is structured by date:

*\DataSet\YYYY\MM\DD\datafile_YYYY_MM_DD.tsv*

Notice that the datetime information appears both as folders and in the filename.

For date and time, the following is a common pattern

*\DataSet\YYYY\MM\DD\HH\mm\datafile_YYYY_MM_DD_HH_mm.tsv*

Again, the choice you make with the folder and file organization should optimize for the larger file sizes and a reasonable number of files in each folder.

For other directory layout structure suggestions, see [Directory layout considerations](data-lake-storage-best-practices.md#directory-layout-considerations)

### Access data efficiently with Query Acceleration

Query acceleration enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the data that they require to perform a given operation. This reduces the time and processing power that is required to gain critical insights into stored data.

Query acceleration accepts filtering predicates and column projections which enable applications to filter rows and columns at the time that data is read from disk. Only the data that meets the conditions of a predicate are transferred over the network to the application. This reduces network latency and compute cost.

## See also

* [Overview of Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
* [Best practices for using Azure Data Lake Storage Gen2](data-lake-storage-best-practices.md)
