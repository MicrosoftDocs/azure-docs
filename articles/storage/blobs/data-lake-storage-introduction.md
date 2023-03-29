---
title: Azure Data Lake Storage Gen2 Introduction
titleSuffix: Azure Storage
description: Read an introduction to Azure Data Lake Storage Gen2. Learn key features. Review supported Blob storage features, Azure service integrations, and platforms.
author: normesta

ms.service: storage
ms.topic: overview
ms.date: 03/09/2023
ms.author: normesta
ms.reviewer: jamesbak
ms.subservice: data-lake-storage-gen2
---

# Introduction to Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on [Azure Blob Storage](storage-blobs-introduction.md).

Data Lake Storage Gen2 converges the capabilities of [Azure Data Lake Storage Gen1](../../data-lake-store/index.yml) with Azure Blob Storage. For example, Data Lake Storage Gen2 provides file system semantics, file-level security, and scale. Because these capabilities are built on Blob storage, you also get low-cost, tiered storage, with high availability/disaster recovery capabilities.

## Data lakes, Data Lake Storage, and Gen2

A _data lake_ is a single, centralized repository where you can store all your data, both structured and unstructured. A data lake enables your organization to quickly and more easily store, access, and analyze a wide variety of data in a single location. With a data lake, you don't need to conform your data to fit an existing structure. Instead, you can store your data in its raw or native format, usually as files or as binary large objects (blobs).

_Azure Data Lake Storage_ is a cloud-based, enterprise data lake solution. It's engineered to store massive amounts of data in any format, and to facilitate big data analytical workloads. You use it to capture data of any type and ingestion speed in a single location for easy access and analysis using various frameworks. 

_Azure Data Lake Storage Gen2_ refers to the current implementation of Azure's Data Lake Storage solution. The previous implementation, _Azure Data Lake Storage Gen1_, is scheduled to be retired on February 29, 2024. Unlike Data Lake Storage Gen1, Data Lake Storage Gen2 isn't a dedicated service or account type. Instead, it's implemented as a set of capabilities that you use with the Blob Storage service of your Azure Storage account. 

Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage Gen2 allows you to easily manage massive amounts of data.



## Data Lake Storage Gen2 capabilities

This section describes Data Lake Storage Gen2 capabilities. You can unlock these capabilities in your Azure Storage account by enabling the hierarchical namespace setting. 

> [!NOTE]
> The hierarchical namespace setting is *not* enabled by default. When you create a storage account, you can select the **Enable Hierarchical Namespace** checkbox. You can also enable hierarchical namespaces for existing account by selecting the **Data Lake Gen2 Migration** setting available in the Azure portal.  

#### Hadoop-compatible access

Azure Data Lake Storage Gen2 is primarily designed to work with Hadoop and all frameworks that use the Apache [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html) as their data access layer. Hadoop distributions include the [Azure Blob File System (ABFS)](data-lake-storage-abfs-driver.md) driver, which enables many applications and frameworks to access Azure Blob Storage data directly. The ABFS driver is [optimized specifically](data-lake-storage-abfs-driver.md) for big data analytics. The corresponding REST APIs are surfaced through the endpoint `dfs.core.windows.net`.

Data analysis frameworks that use HDFS as their data access layer can directly access Azure Data Lake Storage Gen2 data through ABFS. The Apache Spark analytics engine and the Presto SQL query engine are examples of such frameworks. See [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services).

#### Hierarchical directory structure

The [hierarchical namespace](data-lake-storage-namespace.md) is a key feature that enables Azure Data Lake Storage Gen2 to provide high-performance data access at object storage scale and price. You can use this feature to organize all the objects and files within your storage account into a hierarchy of directories and nested subdirectories. In other words, your Azure Data Lake Storage Gen2 data is organized in much the same way that files are organized on your computer.

Operations such as renaming or deleting a directory, become single atomic metadata operations on the directory. There's no need to enumerate and process all objects that share the name prefix of the directory.

#### Optimized cost and performance

Azure Data Lake Storage Gen2 is priced at Azure Blob Storage levels. It builds on Azure Blob Storage capabilities such as automated lifecycle policy management and object level tiering to manage big data storage costs. A hierarchical namespace provides the scalability and cost-effectiveness of object storage. 

Performance is optimized because you don't need to copy or transform data as a prerequisite for analysis. The hierarchical namespace capability of Azure Data Lake Storage allows for efficient access and navigation. This architecture means that data processing requires fewer computational resources, reducing both the speed and cost of accessing data.

#### Finer grain security model

The Azure Data Lake Storage Gen2 access control model supports both Azure role-based access control (RBAC) and Portable Operating System Interface for UNIX (POSIX) access control lists (ACLs). There are also a few extra security settings that are specific to Azure Data Lake Storage Gen2. You can set permissions either at the directory level or at the file level. All stored data is encrypted at rest by using either Microsoft-managed or customer-managed encryption keys.

#### Massive scalability

This amount of storage is available with throughput measured in gigabits per second (Gbps) at high levels of input/output operations per second (IOPS). Processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

Azure Data Lake Storage Gen2 offers massive storage and accepts numerous data types for analytics. It doesn't impose any limits on account sizes, file sizes, or the amount of data that can be stored in the data lake. Individual  files can have sizes that range from a few kilobytes (KBs) to a few petabytes (PBs). Processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

This design means that Azure Data Lake Storage Gen2 can easily and quickly scale up to meet the most demanding workloads. It can also just as easily scale back down when demand drops.


## One service, multiple concepts

Because Data Lake Storage Gen2 is built on top of Azure Blob Storage, multiple concepts can describe the same, shared things.

The following are the equivalent entities, as described by different concepts. Unless specified otherwise these entities are directly synonymous:

| Concept                                | Top Level Organization | Lower Level Organization                                            | Data Container |
|----------------------------------------|------------------------|---------------------------------------------------------------------|----------------|
| Blobs - General purpose object storage | Container              | Virtual directory (SDK only - doesn't provide atomic manipulation) | Blob           |
| Azure Data Lake Storage Gen2 - Analytics Storage          | Container            | Directory                                                           | File           |

## Supported Blob Storage features

Blob Storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](access-tiers-overview.md), and [Blob Storage lifecycle management policies](./lifecycle-management-overview.md) are available to your account. Most Blob Storage features are fully supported, but some features are supported only at the preview level or not yet supported.

To see how each Blob Storage feature is supported with Data Lake Storage Gen2, see [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md).

## Supported Azure service integrations

Data Lake Storage gen2 supports several Azure services. You can use them to ingest data, perform analytics, and create visual representations. For a list of supported Azure services, see [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md).

## Supported open source platforms

Several open source platforms support Data Lake Storage Gen2. For a complete list, see [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md).

## See also

- [Introduction to Azure Data Lake Storage Gen2 (Training module)](/training/modules/introduction-to-azure-data-lake-storage/)
- [Best practices for using Azure Data Lake Storage Gen2](data-lake-storage-best-practices.md)
- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)
