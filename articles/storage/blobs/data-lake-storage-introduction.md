---
title: "Azure Data Lake Storage overview"
titleSuffix: Azure Storage
description: "Discover Azure Data Lake Storage capabilities for big data analytics. Learn key features, supported Blob Storage integrations, and how to get started."
author: normesta

ms.service: azure-data-lake-storage
ms.topic: overview
ms.date: 07/02/2026
ms.author: normesta
ms.reviewer: jamesbak
# Customer intent: As a data engineer, I want to understand the features and capabilities of Azure Data Lake Storage, so that I can efficiently store and analyze large volumes of structured and unstructured data for big data analytics.
---

# Introduction to Azure Data Lake Storage

Azure Data Lake Storage is a set of capabilities dedicated to big data analytics, built on [Azure Blob Storage](storage-blobs-introduction.md). This article introduces the key features, supported integrations, and architecture of Azure Data Lake Storage to help you evaluate it for your analytics workloads.

Azure Data Lake Storage builds on the capabilities pioneered by [Azure Data Lake Storage Gen1](../../data-lake-store/index.yml), combining them with Azure Blob Storage. For example, Data Lake Storage provides file system semantics, file-level security, and scale. Because these capabilities are built on Blob Storage, you also get low-cost, tiered storage, with high availability and disaster recovery capabilities.

Data Lake Storage makes Azure Storage the foundation for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabits of throughput, Data Lake Storage allows you to easily manage massive amounts of data.

## What is a data lake?

A _data lake_ is a single, centralized repository where you can store all your data, both structured and unstructured. A data lake enables your organization to quickly and more easily store, access, and analyze a wide variety of data in a single location. With a data lake, you don't need to conform your data to fit an existing structure. Instead, you can store your data in its raw or native format, usually as files or as binary large objects (blobs).

_Azure Data Lake Storage_ is a cloud-based, enterprise data lake solution. It's engineered to store massive amounts of data in any format, and to facilitate big data analytical workloads. Use it to capture data of any type and ingestion speed in a single location for easy access and analysis by using various frameworks. 

## Azure Data Lake Storage capabilities

Azure Data Lake Storage isn't a dedicated service or account type. Instead, it's implemented as a set of capabilities that you use with the Blob Storage service of your Azure Storage account. Unlock these capabilities by enabling the hierarchical namespace setting. 

Data Lake Storage includes the following capabilities.

- Hadoop-compatible access

- Hierarchical directory structure

- Optimized cost and performance

- Finer grain security model

- Massive scalability

### Hadoop-compatible access

Azure Data Lake Storage is primarily designed to work with Hadoop and all frameworks that use the Apache [Hadoop Distributed File System (HDFS)](https://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html) as their data access layer. Hadoop distributions include the [Azure Blob File System (ABFS)](data-lake-storage-abfs-driver.md) driver, which enables many applications and frameworks to access Azure Blob Storage data directly. The ABFS driver is [optimized specifically](data-lake-storage-abfs-driver.md) for big data analytics. The corresponding REST APIs are available through the endpoint `dfs.core.windows.net`.

Data analysis frameworks that use HDFS as their data access layer can directly access Azure Data Lake Storage data through ABFS. The Apache Spark analytics engine and the Presto SQL query engine are examples of such frameworks. 

For more information about supported services and platforms, see [Azure services that support Azure Data Lake Storage](data-lake-storage-supported-azure-services.md) and [Open source platforms that support Azure Data Lake Storage](data-lake-storage-supported-open-source-platforms.md).

### Hierarchical directory structure

The [hierarchical namespace](data-lake-storage-namespace.md) is a key feature that enables Azure Data Lake Storage to provide high-performance data access at object storage scale and price. Use this feature to organize all the objects and files within your storage account into a hierarchy of directories and nested subdirectories. In other words, your Azure Data Lake Storage data is organized in much the same way that files are organized on your computer.

Operations such as renaming or deleting a directory become single atomic metadata operations on the directory. There's no need to enumerate and process all objects that share the name prefix of the directory.

### Optimized cost and performance

Azure Data Lake Storage is priced at Azure Blob Storage levels. It builds on Azure Blob Storage capabilities such as automated lifecycle policy management and object-level tiering to manage big data storage costs.

Performance improves because you don't need to copy or transform data before analysis. The hierarchical namespace capability of Azure Data Lake Storage allows for efficient access and navigation. This architecture means that data processing requires fewer computational resources, reducing both the time and cost of accessing data.

### Finer grain security model

The Azure Data Lake Storage access control model supports both Azure role-based access control (Azure RBAC) and Portable Operating System Interface for UNIX (POSIX) access control lists (ACLs). There are also a few extra security settings that are specific to Azure Data Lake Storage. Set permissions at the directory or file level. Azure Data Lake Storage encrypts all data at rest by using either Microsoft-managed or customer-managed encryption keys.

### Massive scalability

Azure Data Lake Storage offers massive storage and accepts numerous data types for analytics. It doesn't impose any limits on account sizes, file sizes, or the amount of data that can be stored in the data lake. Individual files can have sizes that range from a few kilobytes (KBs) to hundreds of terabytes (TBs). Azure Data Lake Storage processes requests at near-constant per-request latencies measured at the service, account, and file levels.

This design means that Azure Data Lake Storage can easily and quickly scale up to meet the most demanding workloads. It can also just as easily scale back down when demand drops.

## Built on Azure Blob Storage

The data that you ingest persists as blobs in the storage account. The service that manages blobs is the Azure Blob Storage service. Data Lake Storage describes the capabilities or "enhancements" to this service that cater to the demands of big data analytic workloads. 

Because these capabilities are built on Blob Storage, features such as diagnostic logging, access tiers, and lifecycle management policies are available to your account. Most Blob Storage features are fully supported, but some features might be supported only at the preview level and there are a handful of them that aren't yet supported. For a complete list of support statements, see [Blob Storage feature support in Azure Storage accounts](storage-feature-support-in-storage-accounts.md). The status of each listed feature changes over time as support continues to expand. 

## Terminology: blobs, files, and containers

The Azure Blob Storage table of contents features two sections of content. The **Data Lake Storage** section of content provides best practices and guidance for using Data Lake Storage capabilities. The **Blob Storage** section of content provides guidance for account features not specific to Data Lake Storage. 

As you move between sections, you might notice some slight terminology differences. For example, content featured in the Blob Storage documentation uses the term _blob_ instead of _file_. Technically, the files that you ingest to your storage account become blobs in your account. Therefore, the term is correct. However, the term _blob_ can cause confusion if you're used to the term _file_. You also see the term _container_ used to refer to a _file system_. Consider these terms as synonymous. 

## See also

- [Introduction to Azure Data Lake Storage (Training module)](/training/modules/introduction-to-azure-data-lake-storage/)
- [Best practices for using Azure Data Lake Storage](data-lake-storage-best-practices.md)
- [Known issues with Azure Data Lake Storage](data-lake-storage-known-issues.md)
- [Multi-protocol access on Azure Data Lake Storage](data-lake-storage-multi-protocol-access.md)
