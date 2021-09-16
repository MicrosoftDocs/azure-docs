---
title: Optimize Azure Data Lake Storage Gen2 for performance | Microsoft Docs
description: Understand how to optimize Azure Data Lake Storage Gen2 for performance. Ingest data, structure your dataset, and more.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: how-to
ms.date: 11/18/2019
ms.author: normesta
ms.reviewer: stewu
---

# Optimize Azure Data Lake Storage Gen2 for performance

Azure Data Lake Storage Gen2 supports high-throughput for I/O intensive analytics and data movement.  In Data Lake Storage Gen2, using all available throughput – the amount of data that can be read or written per second – is important to get the best performance.  This is achieved by performing as many reads and writes in parallel as possible.

![Data Lake Storage Gen2 performance](./media/data-lake-storage-performance-tuning-guidance/throughput.png)

Data Lake Storage Gen2 can scale to provide the necessary throughput for all analytics scenarios. By default, a Data Lake Storage Gen2 account provides enough throughput in its default configuration to meet the needs of a broad category of use cases. For the cases where customers run into the default limit, the Data Lake Storage Gen2 account can be configured to provide more throughput by contacting [Azure Support](https://azure.microsoft.com/support/faq/).

## Data ingestion

When ingesting data from a source system to Data Lake Storage Gen2, it is important to consider that the source hardware, source network hardware, or network connectivity to Data Lake Storage Gen2 can be the bottleneck.  

![Diagram that shows the factors to consider when ingesting data from a source system to Data Lake Storage Gen2.](./media/data-lake-storage-performance-tuning-guidance/bottleneck.png)

It is important to ensure that the data movement is not affected by these factors.

### Source hardware

Whether you are using on-premises machines or VMs in Azure, you should carefully select the appropriate hardware. For Source Disk Hardware, prefer SSDs to HDDs and pick disk hardware with faster spindles. For Source Network Hardware, use the fastest NICs possible.  On Azure, we recommend Azure D14 VMs which have the appropriately powerful disk and networking hardware.

### Network connectivity to Data Lake Storage Gen2

The network connectivity between your source data and Data Lake Storage Gen2 can sometimes be the bottleneck. When your source data is On-Premises, consider using a dedicated link with [Azure ExpressRoute](https://azure.microsoft.com/services/expressroute/). If your source data is in Azure, the performance will be best when the data is in the same Azure region as the Data Lake Storage Gen2 account.

### Configure data ingestion tools for maximum parallelization

Once you have addressed the source hardware and network connectivity bottlenecks above, you are ready to configure your ingestion tools. The following table summarizes the key settings for several popular ingestion tools and provides in-depth performance tuning articles for them.  To learn more about which tool to use for your scenario, visit this [article](data-lake-storage-data-scenarios.md).

| Tool               | Settings | More Details                                                                 |
|--------------------|------------------------------------------------------|------------------------------|
| DistCp            | -m (mapper)	| [Link](data-lake-storage-use-distcp.md#performance-considerations-while-using-distcp)                             |
| Azure Data Factory| parallelCopies	| [Link](../../data-factory/copy-activity-performance.md)                          |
| Sqoop           | fs.azure.block.size, -m (mapper)	|	[Link](/archive/blogs/shanyu/performance-tuning-for-hdinsight-storm-and-microsoft-azure-eventhubs)        |

## Structure your data set

When data is stored in Data Lake Storage Gen2, the file size, number of files, and folder structure have an impact on performance.  The following section describes best practices in these areas.  

### File size

Typically, analytics engines such as HDInsight and Azure Data Lake Analytics have a per-file overhead. If you store your data as many small files, this can negatively affect performance. In general, organize your data into larger sized files for better performance (256MB to 100GB in size). Some engines and applications might have trouble efficiently processing files that are greater than 100GB in size.

Sometimes, data pipelines have limited control over the raw data which has lots of small files. In general, we recommend that your system have some sort of process to aggregate small files into larger ones for use by downstream applications.

### Organizing time series data in folders

For Hive workloads, partition pruning of time-series data can help some queries read only a subset of the data which improves performance.    

Those pipelines that ingest time-series data, often place their files with a very structured naming for files and folders. Below is a very common example we see for data that is structured by date:

*\DataSet\YYYY\MM\DD\datafile_YYYY_MM_DD.tsv*

Notice that the datetime information appears both as folders and in the filename.

For date and time, the following is a common pattern

*\DataSet\YYYY\MM\DD\HH\mm\datafile_YYYY_MM_DD_HH_mm.tsv*

Again, the choice you make with the folder and file organization should optimize for the larger file sizes and a reasonable number of files in each folder.

## Section for optimizing workloads

Give some very generic advice and then link to HDInsight, DataBricks, Synapse and other services for optimization guidance.

## See also
* [Overview of Azure Data Lake Storage Gen2](data-lake-storage-introduction.md)
