---
title: Azure Data Lake Storage Gen2 Introduction
description: Provides an overview of Azure Data Lake Storage Gen2 
services: storage
author: normesta

ms.service: storage
ms.topic: conceptual
ms.date: 12/06/2018
ms.author: normesta
ms.reviewer: jamesbak
ms.subservice: data-lake-storage-gen2
---

# Introduction to Azure Data Lake Storage Gen2

‎Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on [Azure Blob
storage](storage-blobs-introduction.md). Data Lake Storage Gen2 is the result of converging the capabilities of our two existing storage services, Azure Blob storage and Azure Data Lake Storage Gen1. Features from [Azure Data Lake Storage Gen1](https://docs.microsoft.com/azure/data-lake-store/index), such as file system semantics, directory, and file level security and scale are combined with low-cost, tiered storage, high availability/disaster recovery capabilities from [Azure Blob storage](storage-blobs-introduction.md).

## Designed for enterprise big data analytics

Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage Gen2 allows you to easily manage massive amounts of data.

A fundamental part of Data Lake Storage Gen2 is the addition of a [hierarchical namespace](data-lake-storage-namespace.md) to Blob storage. The hierarchical namespace organizes objects/files into a hierarchy of directories for efficient data access. A common object store naming convention uses slashes in the name to mimic a hierarchical directory structure. This structure becomes real with Data Lake Storage Gen2. Operations such as renaming or deleting a directory become single atomic metadata operations on the directory rather than enumerating and processing all objects that share the name prefix of the directory.

In the past, cloud-based analytics had to compromise in areas of performance, management, and security. Data Lake Storage Gen2 addresses each of these aspects in the following ways:

-   **Performance** is optimized because you do not need to copy or transform data as a prerequisite for analysis. The hierarchical namespace greatly improves the performance of directory management operations, which improves overall job performance.

-   **Management** is easier because you can organize and manipulate files through directories and subdirectories.

-   **Security** is enforceable because you can define POSIX permissions on directories or individual files.

-   **Cost effectiveness** is made possible as Data Lake Storage Gen2 is built on top of the low-cost [Azure Blob storage](storage-blobs-introduction.md). The additional features further lower the total cost of ownership for running big data analytics on Azure.

## Key features of Data Lake Storage Gen2

-   **Hadoop compatible access**: Data Lake Storage Gen2 allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). The new [ABFS driver](data-lake-storage-abfs-driver.md) is available within all Apache Hadoop environments, including [Azure HDInsight](https://docs.microsoft.com/azure/hdinsight/index)*,* [Azure Databricks](https://docs.microsoft.com/azure/azure-databricks/index), and [SQL Data Warehouse](https://docs.microsoft.com/azure/sql-data-warehouse/) to access data stored in Data Lake Storage Gen2.

-   **A superset of POSIX permissions**: The security model for Data Lake Gen2 supports ACL and POSIX permissions along with some extra granularity specific to Data Lake Storage Gen2. Settings may be configured through Storage Explorer or through frameworks like Hive and Spark.

-   **Cost effective**: Data Lake Storage Gen2 offers low-cost storage capacity and transactions. As data transitions through its complete lifecycle, billing rates change keeping costs to a minimum via built-in features such as [Azure Blob storage lifecycle](storage-lifecycle-management-concepts.md).

-   **Optimized driver**: The ABFS driver is [optimized specifically](data-lake-storage-abfs-driver.md) for big data analytics. The corresponding REST APIs are surfaced through the endpoint `dfs.core.windows.net`.

### Scalability

Azure Storage is scalable by design whether you access via Data Lake Storage Gen2 or Blob storage interfaces. It is able to store and serve *many exabytes of data*. This amount of storage is available with throughput measured in gigabits per second (Gbps) at high levels of input/output operations per second (IOPS). Beyond just persistence, processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

### Cost effectiveness

One of the many benefits of building Data Lake Storage Gen2 on top of Azure Blob storage is the low cost of storage capacity and transactions. Unlike other cloud storage services, data stored in Data Lake Storage Gen2 is not required to be moved or transformed prior to performing analysis. For more information about pricing, see [Azure Storage pricing](https://azure.microsoft.com/pricing/details/storage).

Additionally, features such as the [hierarchical namespace](data-lake-storage-namespace.md) significantly improve the overall performance of many analytics jobs. This improvement in performance means that you require less compute power to process the same amount of data, resulting in a lower total cost of ownership (TCO) for the end-to-end analytics job.

### One service, multiple concepts

Data Lake Storage Gen2 is an additional capability for big data analytics, built on top of Azure Blob storage. While there are many benefits in leveraging existing platform components of Blobs to create and operate data lakes for analytics, it does lead to multiple concepts describing the same, shared things.

The following are the equivalent entities, as described by different concepts. Unless specified otherwise these entities are directly synonymous:

| Concept                                | Top Level Organization | Lower Level Organization                                            | Data Container |
|----------------------------------------|------------------------|---------------------------------------------------------------------|----------------|
| Blobs – General purpose object storage | Container              | Virtual directory (SDK only – does not provide atomic manipulation) | Blob           |
| ADLS Gen2 – Analytics Storage          | File system             | Directory                                                           | File           |

## Supported open source platforms

Several open source platforms support Data Lake Storage Gen2. Those platforms appear in the following table.

> [!NOTE]
> Only the versions that appear in this table are supported.

| Platform |  Supported Version(s) | More Information |
| --- | --- | --- |
| [HDInsight](https://azure.microsoft.com/services/hdinsight/) | 3.6+ | [What are the Apache Hadoop components and versions available with HDInsight?](https://docs.microsoft.com/azure/hdinsight/hdinsight-component-versioning?toc=%2Fen-us%2Fazure%2Fhdinsight%2Fstorm%2FTOC.json&bc=%2Fen-us%2Fazure%2Fbread%2Ftoc.json)
| [Hadoop](https://hadoop.apache.org/) | 3.2+ | [Apache Hadoop releases archive](https://hadoop.apache.org/release.html) |
| [Cloudera](https://www.cloudera.com/) | 6.1+ | [Cloudera Enterprise 6.x release notes](https://www.cloudera.com/documentation/enterprise/6/release-notes/topics/rg_cdh_6_release_notes.html) |
| [Azure Databricks](https://azure.microsoft.com/services/databricks/) | 5.1+ | [Databricks Runtime versions](https://docs.databricks.com/release-notes/runtime/databricks-runtime-ver.html) |
|[Hortonworks](https://hortonworks.com/)| 3.1.x++ | [Configuring cloud data access](https://docs.hortonworks.com/HDPDocuments/Cloudbreak/Cloudbreak-2.9.0/cloud-data-access/content/cb_configuring-access-to-adls2.html) |

## Next steps

The following articles describe some of the main concepts of Data Lake Storage Gen2 and detail how to store, access, manage, and gain insights from your data:

-   [Hierarchical namespace](data-lake-storage-namespace.md)
-   [Create a storage account](data-lake-storage-quickstart-create-account.md)
-   [Use a Data Lake Storage Gen2 account in Azure Databricks](data-lake-storage-quickstart-create-databricks-account.md)
