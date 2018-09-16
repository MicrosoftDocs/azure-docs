---
title: Azure Data Lake Storage Gen2 Preview Introduction
description: Provides an overview of Azure Data Lake Storage Gen2 Preview
services: storage
author: jamesbak
ms.service: storage
ms.topic: article
ms.date: 06/27/2018
ms.author: jamesbak
ms.component: data-lake-storage-gen2
---

# Introduction to Azure Data Lake Storage Gen2 Preview

Azure Data Lake Storage Gen2 Preview is a set of capabilities dedicated to big data analytics, built on top of [Azure Blob storage](../blobs/storage-blobs-introduction.md). It allows you to interface with your data using both file system and object storage paradigms. This makes Data Lake Storage Gen2 the only cloud-based multi-modal storage service, allowing you to extract analytics value from all of your data.

Data Lake Storage Gen2 features all qualities that are required for the full lifecycle of analytics data. This results from converging the capabilities of our two existing storage services. Features from [Azure Data Lake Storage Gen1](../../data-lake-store/index.md), such as file system semantics, file-level security and scale are combined with low-cost, tiered storage, high availability/disaster recovery capabilities and a large SDK/tooling ecosystem from [Azure Blob storage](../blobs/storage-blobs-introduction.md). In Data Lake Storage Gen2, all the qualities of object storage remain while adding the advantages of a file system interface optimized for analytics workloads.

## Designed for enterprise big data analytics

Data Lake Storage Gen2 is the foundational storage service for building enterprise data lakes (EDL) on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage Gen2 gives you an easy way to manage massive amounts of data.

A fundamental feature of Data Lake Storage Gen2 is the addition of a [hierarchical namespace](./namespace.md) to the Blob storage service which organizes objects/files into a hierarchy of directories for performant data access. The hierarchical namespace also enables Data Lake Storage Gen2 to support both object store and file system paradigms at the same time. For instance, a common object store naming convention uses slashes in the name to mimic a hierarchical folder structure. This structure becomes real with Data Lake Storage Gen2. Operations such as renaming or deleting a directory become single atomic metadata operations on the directory rather than enumerating and processing all objects that share the name prefix of the directory.

In the past, cloud-based analytics had to compromise in areas of performance, management, and security. Data Lake Storage Gen2 addresses each of these aspects in the following ways:

- **Performance** is optimized because you do not need to copy or transform data as a prerequisite for analysis. The hierarchical namespace greatly improves the performance of directory management operations which improves overall job performance.

- **Management** is easier because you can organize and manipulate files through directories and subdirectories.

- **Security** is enforceable because you can define POSIX permissions on folders or individuals files.

- **Cost effectiveness** is made possible as Data Lake Storage Gen2 is built on top of the low-cost [Azure Blob storage](../blobs/storage-blobs-introduction.md). The additional features further lower the total cost of ownership for running big data analytics on Azure.

## Key features of Data Lake Storage Gen2

> [!NOTE]
> During the public preview of Data Lake Storage Gen2, some of the features listed below may vary in their availability. As new features and regions are released during the preview program, this information will be communicated.
> [Sign up](https://aka.ms/adlsgen2signup) to the public preview of Data Lake Storage Gen2.  

- **Hadoop compatible access**: Data Lake Storage Gen2 allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). The new [ABFS driver](./abfs-driver.md) is available within all Apache Hadoop environments, including [Azure HDInsight](../../hdinsight/index.yml) and [Azure Databricks](../../azure-databricks/index.yml) to access data stored in Data Lake Storage Gen2.

- **A superset of POSIX permissions**: The security model for Data Lake Gen2 fully supports ACL and POSIX permissions along with some extra granularity specific to Data Lake Storage Gen2. Settings may be configured through admin tools or through frameworks like Hive and Spark.

- **Cost effective**: Data Lake Storage Gen2 features low-cost storage capacity and transactions. As data transitions through its complete lifecycle, billing rates change keeping costs to a minimum via built-in features such as [Azure Blob storage lifecycle](../common/storage-lifecycle-managment-concepts.md).

- **Works with Blob storage tools, frameworks, and apps**: Data Lake Storage Gen2 continues to work with a wide array of tools, frameworks, and applications that exist today for Blob storage.

- **Optimized driver**: The `abfs` driver is [optimized specifically](./abfs-driver.md) for big data analytics. The corresponding REST APIs are surfaced through the `dfs` endpoint, `dfs.core.windows.net`.

## Scalability

Azure Storage is scalable by design whether you access via Data Lake Storage Gen2 or Blob storage interfaces. It is able to store and serve *many exabytes of data*. This amount of storage is available with throughput measured in gigabits per second (Gbps) at high levels of input/output operations per second (IOPS). Beyond just persistence, processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

## Cost effectiveness

One of the many benefits of building Data Lake Storage Gen2 on top of Azure Blob storage is the [low-cost](https://azure.microsoft.com/pricing/details/storage) of storage capacity and transactions. Unlike other cloud storage services, Data Lake Storage Gen2 lowers costs because data is not required to be moved or transformed prior to performing analysis.

Additionally, features such as the [hierarchical namespace](./namespace.md) significantly improve the overall performance of many analytics jobs. This improvement in performance means that you require less compute power to process the same amount of data, resulting in a lower total cost of ownership (TCO) for the end-to-end analytics job.

## Next steps

The following articles describe some of the main concepts of Data Lake Storage Gen2 and detail how to store, access, manage, and gain insights from your data:

* [Hierarchical namespace](./namespace.md)
* [Create a storage account](./quickstart-create-account.md)
* [Create an HDInsight cluster with Azure Data Lake Storage Gen2](./quickstart-create-connect-hdi-cluster.md)
* [Use an Azure Data Lake Storage Gen2 account in Azure Databricks](./quickstart-create-databricks-account.md) 