---
title: Azure Data Lake Storage Gen2 Introduction
titleSuffix: Azure Storage
description: Read an introduction to Azure Data Lake Storage Gen2. Learn key features. Review supported Blob storage features, Azure service integrations, and platforms.
author: normesta

ms.service: azure-data-lake-storage
ms.topic: overview
ms.date: 03/29/2023
ms.author: normesta
ms.reviewer: jamesbak
---

# Introduction to Azure Data Lake Storage Gen2

Azure Data Lake Storage Gen2 is a set of capabilities dedicated to big data analytics, built on [Azure Blob Storage](storage-blobs-introduction.md).

Data Lake Storage Gen2 converges the capabilities of [Azure Data Lake Storage Gen1](../../data-lake-store/index.yml) with Azure Blob Storage. For example, Data Lake Storage Gen2 provides file system semantics, file-level security, and scale. Because these capabilities are built on Blob storage, you also get low-cost, tiered storage, with high availability/disaster recovery capabilities.

Data Lake Storage Gen2 makes Azure Storage the foundation for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage Gen2 allows you to easily manage massive amounts of data.

## What is a Data Lake?

A _data lake_ is a single, centralized repository where you can store all your data, both structured and unstructured. A data lake enables your organization to quickly and more easily store, access, and analyze a wide variety of data in a single location. With a data lake, you don't need to conform your data to fit an existing structure. Instead, you can store your data in its raw or native format, usually as files or as binary large objects (blobs).

_Azure Data Lake Storage_ is a cloud-based, enterprise data lake solution. It's engineered to store massive amounts of data in any format, and to facilitate big data analytical workloads. You use it to capture data of any type and ingestion speed in a single location for easy access and analysis using various frameworks. 

## Data Lake Storage Gen2

_Azure Data Lake Storage Gen2_ refers to the current implementation of Azure's Data Lake Storage solution. The previous implementation, _Azure Data Lake Storage Gen1_ will be retired on February 29, 2024. 

Unlike Data Lake Storage Gen1, Data Lake Storage Gen2 isn't a dedicated service or account type. Instead, it's implemented as a set of capabilities that you use with the Blob Storage service of your Azure Storage account. You can unlock these capabilities by enabling the hierarchical namespace setting. 

Data Lake Storage Gen2 includes the following capabilities.

&#x2713;&nbsp;&nbsp; Hadoop-compatible access

&#x2713;&nbsp;&nbsp; Hierarchical directory structure

&#x2713;&nbsp;&nbsp; Optimized cost and performance

&#x2713;&nbsp;&nbsp; Finer grain security model

&#x2713;&nbsp;&nbsp; Massive scalability

#### Hadoop-compatible access

Azure Data Lake Storage Gen2 is primarily designed to work with Hadoop and all frameworks that use the Apache [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html) as their data access layer. Hadoop distributions include the [Azure Blob File System (ABFS)](data-lake-storage-abfs-driver.md) driver, which enables many applications and frameworks to access Azure Blob Storage data directly. The ABFS driver is [optimized specifically](data-lake-storage-abfs-driver.md) for big data analytics. The corresponding REST APIs are surfaced through the endpoint `dfs.core.windows.net`.

Data analysis frameworks that use HDFS as their data access layer can directly access Azure Data Lake Storage Gen2 data through ABFS. The Apache Spark analytics engine and the Presto SQL query engine are examples of such frameworks. 

For more information about supported services and platforms, see [Azure services that support Azure Data Lake Storage Gen2](data-lake-storage-supported-azure-services.md) and [Open source platforms that support Azure Data Lake Storage Gen2](data-lake-storage-supported-open-source-platforms.md).

#### Hierarchical directory structure

The [hierarchical namespace](data-lake-storage-namespace.md) is a key feature that enables Azure Data Lake Storage Gen2 to provide high-performance data access at object storage scale and price. You can use this feature to organize all the objects and files within your storage account into a hierarchy of directories and nested subdirectories. In other words, your Azure Data Lake Storage Gen2 data is organized in much the same way that files are organized on your computer.

Operations such as renaming or deleting a directory, become single atomic metadata operations on the directory. There's no need to enumerate and process all objects that share the name prefix of the directory.

#### Optimized cost and performance

Azure Data Lake Storage Gen2 is priced at Azure Blob Storage levels. It builds on Azure Blob Storage capabilities such as automated lifecycle policy management and object level tiering to manage big data storage costs.

Performance is optimized because you don't need to copy or transform data as a prerequisite for analysis. The hierarchical namespace capability of Azure Data Lake Storage allows for efficient access and navigation. This architecture means that data processing requires fewer computational resources, reducing both the speed and cost of accessing data.

#### Finer grain security model

The Azure Data Lake Storage Gen2 access control model supports both Azure role-based access control (Azure RBAC) and Portable Operating System Interface for UNIX (POSIX) access control lists (ACLs). There are also a few extra security settings that are specific to Azure Data Lake Storage Gen2. You can set permissions either at the directory level or at the file level. All stored data is encrypted at rest by using either Microsoft-managed or customer-managed encryption keys.

#### Massive scalability

Azure Data Lake Storage Gen2 offers massive storage and accepts numerous data types for analytics. It doesn't impose any limits on account sizes, file sizes, or the amount of data that can be stored in the data lake. Individual  files can have sizes that range from a few kilobytes (KBs) to a few petabytes (PBs). Processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

This design means that Azure Data Lake Storage Gen2 can easily and quickly scale up to meet the most demanding workloads. It can also just as easily scale back down when demand drops.

## Built on Azure Blob Storage

The data that you ingest persist as blobs in the storage account. The service that manages blobs is the Azure Blob Storage service. Data Lake Storage Gen2 describes the capabilities or "enhancements" to this service that caters to the demands of big data analytic workloads. 

Because these capabilities are built on Blob Storage, features such as diagnostic logging, access tiers, and lifecycle management policies are available to your account. Most Blob Storage features are fully supported, but some features might be supported only at the preview level and there are a handful of them that aren't yet supported. For a complete list of support statements, see [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md). The status of each listed feature will change over time as support continues to expand. 

## Documentation and terminology

The Azure Blob Storage table of contents features two sections of content. The **Data Lake Storage Gen2** section of content provides best practices and guidance for using Data Lake Storage Gen2 capabilities. The **Blob Storage** section of content provides guidance for account features not specific to Data Lake Storage Gen2. 

As you move between sections, you might notice some slight terminology differences. For example, content featured in the Blob Storage documentation, will use the term _blob_ instead of _file_. Technically, the files that you ingest to your storage account become blobs in your account. Therefore, the term is correct. However, the term _blob_ can cause confusion if you're used to the term _file_. You'll also see the term _container_ used to refer to a _file system_. Consider these terms as synonymous. 

## See also

- [Introduction to Azure Data Lake Storage Gen2 (Training module)](/training/modules/introduction-to-azure-data-lake-storage/)
- [Best practices for using Azure Data Lake Storage Gen2](data-lake-storage-best-practices.md)
- [Known issues with Azure Data Lake Storage Gen2](data-lake-storage-known-issues.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)
