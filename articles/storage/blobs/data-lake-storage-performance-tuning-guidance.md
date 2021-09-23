---
title: Optimize Azure Data Lake Storage Gen2 for performance | Microsoft Docs
description: Understand how to optimize Azure Data Lake Storage Gen2 for performance. Ingest data, structure your dataset, and more.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 09/21/2021
ms.author: normesta
ms.reviewer: stewu
---

# Optimize Azure Data Lake Storage Gen2 for performance

Azure Data Lake Storage Gen2 supports high-throughput for I/O intensive analytics and data movement. This article helps you to optimize for throughput and efficient data access.

> [!NOTE]
> The overall performance of your analytics pipeline also depend on factors that are specific to the analytics engines. For the best up-to-date guidance on workload performance optimization, see the documentation for each system that you intend to use.

## Optimize data ingestion

When ingesting data from a source system, the source hardware, source network hardware, or the network connectivity to your storage account can be a bottleneck.

![Diagram that shows the factors to consider when ingesting data from a source system to Data Lake Storage Gen2.](./media/data-lake-storage-performance-tuning-guidance/bottleneck.png)

### Source hardware

Whether you are using on-premise machines or Virtual Machines (VMs) in Azure, make sure to carefully select the appropriate hardware. For disk hardware, consider using Solid State Drives (SSD) and pick disk hardware that has faster spindles. For network hardware, use the fastest Network Interface Controllers (NIC) as possible. On Azure, we recommend Azure D14 VMs, which have the appropriately powerful disk and networking hardware.

### Network connectivity to the storage account

The network connectivity between your source data and your storage account can sometimes be a bottleneck. When your source data is on premise, consider using a dedicated link with [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). If your source data is in Azure, the performance is best when the data is in the same Azure region as your Data Lake Storage Gen2 enabled account.

### Configure data ingestion tools for maximum parallelization

To achieve the best performance, use all available throughput by performing as many reads and writes in parallel as possible.

![Data Lake Storage Gen2 performance](./media/data-lake-storage-performance-tuning-guidance/throughput.png)

The following table summarizes the key settings for several popular ingestion tools.

| Tool               | Settings |
|--------------------|------------------------------------------------------|
| [DistCp](data-lake-storage-use-distcp.md#performance-considerations-while-using-distcp)             | -m (mapper)	|
| [Azure Data Factory](../../data-factory/copy-activity-performance.md) | parallelCopies	|
| [Sqoop](/archive/blogs/shanyu/performance-tuning-for-hdinsight-storm-and-microsoft-azure-eventhubs)          | fs.azure.block.size, -m (mapper)	|

Your account can scale to provide the necessary throughput for all analytics scenarios. By default, a Data Lake Storage Gen2 enabled account provides enough throughput in its default configuration to meet the needs of a broad category of use cases. If you run into the default limit, the account can be configured to provide more throughput by contacting [Azure Support](https://azure.microsoft.com/support/faq/).

## Structure your data set

When data is stored in a Data Lake Storage Gen2 enabled storage account, the file size, number of files, and folder structure have an impact on performance.  The following section describes best practices in these areas.

### File size

Typically, analytics engines such as HDInsight have a per-file overhead that involve tasks such as listing, checking access, and performing various metadata operations. If you store your data as many small files, this can negatively affect performance. In general, organize your data into larger sized files for better performance (256MB to 100GB in size). Some engines and applications might have trouble efficiently processing files that are greater than 100GB in size.

Sometimes, data pipelines have limited control over the raw data, which has lots of small files. In general, we recommend that your system have some sort of process to aggregate small files into larger ones for use by downstream applications. If you're processing data in real-time, you can use a real time streaming engine (such as [Azure Stream Analytics](../../stream-analytics/stream-analytics-introduction.md) or [Spark Streaming](https://databricks.com/glossary/what-is-spark-streaming)) together with a message broker (such as [Event Hub](../../event-hubs/event-hubs-about.md) or [Apache Kafka](https://kafka.apache.org/)) to store your data as larger files.

As you aggregate small files into larger ones, consider saving them in a read-optimized format such as [Apache Parquet](https://parquet.apache.org/) for downstream processing. Apache Parquet is an open source file format that is optimized for read heavy analytics pipelines. The columnar storage structure of Parquet lets you skip over non-relevant data. Your queries are much more efficient because they can narrowly scope which data to send from storage to the analytics engine. Also, because similar data types (for a column) are stored together, Parquet supports efficient data compression and encoding schemes that can lower data storage costs. Services such as [Azure Synapse Analytics](../../synapse-analytics/overview-what-is.md), [Azure Databricks](/azure/databricks/scenarios/what-is-azure-databricks) and [Azure Data Factory](../../data-factory/introduction.md) have native functionality that take advantage of Parquet file formats.

For more information about data formats, see [data format section of best practice article](data-lake-storage-best-practices.md).

### Organizing time series data in folders

For Hive workloads, partition pruning of time-series data can help some queries read only a subset of the data, which improves performance.

Those pipelines that ingest time-series data, often place their files with a very structured naming for files and folders. Below is a very common example we see for data that is structured by date:

*\DataSet\YYYY\MM\DD\datafile_YYYY_MM_DD.tsv*

Notice that the datetime information appears both as folders and in the filename.

For date and time, the following is a common pattern

*\DataSet\YYYY\MM\DD\HH\mm\datafile_YYYY_MM_DD_HH_mm.tsv*

Again, the choice you make with the folder and file organization should optimize for the larger file sizes and a reasonable number of files in each folder.

For other directory layout structure suggestions, see [Directory structure](data-lake-storage-best-practices.md#directory-layout-considerations)

### Access data efficiently with Query Acceleration

Query acceleration enables applications and analytics frameworks to dramatically optimize data processing by retrieving only the data that they require to perform a given operation. This reduces the time and processing power that is required to gain critical insights into stored data.

Query acceleration accepts filtering predicates and column projections which enable applications to filter rows and columns at the time that data is read from disk. Only the data that meets the conditions of a predicate are transferred over the network to the application. This reduces network latency and compute cost.

To learn more, see [Azure Data Lake Storage query acceleration](data-lake-storage-query-acceleration.md)

## Optimize I/O intensive jobs on Hadoop and Spark workloads on HDInsight

I/O intensive jobs spend most of their time doing I/O.  A common example is a copy job which does only read and write operations.  Other examples include data preparation jobs that read a lot of data, performs some data transformation, and then writes the data back to the store.  You can have a job that reads or writes as much as 100MB in a single operation, but a buffer of that size might compromise performance. To optimize the performances, try to keep the size of an I/O operation between 4MB and 16MB.

### I/O intensive jobs with HDInsight clusters

- **HDInsight versions.** For best performance, use the latest release of HDInsight.
- **Regions.** Place the Data Lake Storage Gen2 account in the same region as the HDInsight cluster.

An HDInsight cluster is composed of two head nodes and some worker nodes. Each worker node provides a specific number of cores and memory, which is determined by the VM-type.  When running a job, YARN is the resource negotiator that allocates the available memory and cores to create containers.  Each container runs the tasks needed to complete the job.  Containers run in parallel to process tasks quickly. Therefore, performance is improved by running as many parallel containers as possible.

There are three layers within an HDInsight cluster that can be tuned to increase the number of containers and use all available throughput.

- **Physical layer**
- **YARN layer**
- **Workload layer**

### Physical Layer

**Run cluster with more nodes and/or larger sized VMs.**  A larger cluster will enable you to run more YARN containers as shown in the picture below.

![Diagram that shows how a larger cluster will enable you to run more YARN containers.](./media/data-lake-storage-performance-tuning-guidance/VM.png)

**Use VMs with more network bandwidth.**  The amount of network bandwidth can be a bottleneck if there is less network bandwidth than Data Lake Storage Gen2 throughput.  Different VMs will have varying network bandwidth sizes.  Choose a VM-type that has the largest possible network bandwidth.

### YARN Layer

**Use smaller YARN containers.**  Reduce the size of each YARN container to create more containers with the same amount of resources.

![Diagram that shows the outcome when you reduce the size of each YARN container to create more containers.](./media/data-lake-storage-performance-tuning-guidance/small-containers.png)

Depending on your workload, there will always be a minimum YARN container size that is needed. If you pick too small a container, your jobs will run into out-of-memory issues. Typically YARN containers should be no smaller than 1GB. It's common to see 3GB YARN containers. For some workloads, you may need larger YARN containers.

**Increase cores per YARN container.**  Increase the number of cores allocated to each container to increase the number of parallel tasks that run in each container.  This works for applications like Spark which run multiple tasks per container.  For applications like Hive which run a single thread in each container, it is better to have more containers rather than more cores per container.

### Workload Layer

**Use all available containers.**  Set the number of tasks to be equal or larger than the number of available containers so that all resources are utilized.

![Diagram that shows the use of all the containers.](./media/data-lake-storage-performance-tuning-guidance/use-containers.png)

**Failed tasks are costly.** If each task has a large amount of data to process, then failure of a task results in an expensive retry.  Therefore, it is better to create more tasks, each of which processes a small amount of data.

In addition to the general guidelines above, each analytics system or framework has different parameters that you can tune for optimal performance. For the best up-to-date guidance on workload performance optimization, see the documentation for each system that you intend to use.

## See also

- [Best practices for using Azure Data Lake Storage Gen2](data-lake-storage-best-practices.md)
- [Overview of Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
