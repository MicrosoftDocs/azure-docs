---
title: Azure Blob File System Introduction
description:  Introduction to Azure Blob File System
services: storage
documentationcenter: ''
author: jamesbak
manager: jahogg

ms.assetid: 
ms.service: storage
ms.workload: storage
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 06/01/2018
ms.author: jamesbak
---

# Introduction to Azure Blob File System

Azure Blob File System (BlobFS) adds file system directories and related security to [Azure Blob Storage](../blobs/storage-blobs-introduction.md) making it easy to connect analytics frameworks to a durable storage layer. In BlobFS, all the qualities of object storage remain while adding the advantages of a file system interface.

For instance, a common object store naming convention employs slashes in the name to mimic a hierarchical folder structure. This structure becomes real with BlobFS. Therefore, while in a directory, objects inherit the established permissions or can enforce object-level security.

Key features of BlobFS include:

- **Hadoop compatible access**: BlobFS allows you to manage and access data just as you would with a Hadoop Distributed File System (HDFS).
 
- **A superset of POSIX permissions**: The security model fully supports ACL and POSIX permissions along with some extra granularity specific to BlobFS. Settings may be configured through admin tools or through frameworks like Hive and Spark.

- **Concurrent and immediate data access**: Unlike other analytics solutions, BlobFS data does not need to move or transform data before you can run analytics tools. You can access data via traditional blob storage APIs, frameworks, and tools while immediately and concurrently accessing data through directories. 

- **Cost effective**: BlobFS features low-cost storage capacity and transactions. As data transitions through the data lifecycle, billing rates change keeping costs to a minimum.

- **Available in all regions**: BlobFS is available for Blob Storage accounts in all Azure regions.

- **Works with Blob Storage tools, frameworks, and apps**: BlobFS is able to interface with a wide array of tools, frameworks, and applications that exist today for Blob Storage.

- **Optimized protocol**: The `abfs` protocol is [optimized specifically]() for big data analytics.

## Designed for enterprise big data analytics

BlobFS is the foundational storage service for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabytes of throughput, BlobFS gives you an easy way to manage massive amounts of data. 

A fundamental feature of BlobFS is the introduction of the Hierarchical Namespace service (HNS) which organizes blobs into a hierarchy of directories. The HNS is designed to ensure no additional latency of scale limits emerge in the data pipeline. 

In the past, cloud-based analytics had to compromise in areas of performance, management, and security. BlobFS addresses each of these aspects in the following ways:

- **Performance** is optimized because you do not need to copy or transform data as a prerequisite for analysis.
 
- **Management** is easier because you can manipulate files through directories and subdirectories.

- **Security** is enforceable because you can define inheritable ACL and POSIX permissions on folders or individuals files.

### Scalability
Azure Blob File System and Azure Blob Storage are [scalable by design](../common/storage-scalability-targets.md). Each service is able to store and serve *many exabytes of data*. This amount of storage is available with throughput measured in gigabits per second (GBPS) at high levels of input/output operations per second (IOPS). Beyond just persistence, processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

### Cost effectiveness
The architecture of BlobFS saves you significant amounts of money. One of the many benefits of building BlobFS on top of Azure Blob Storage is the [low cost](https://azure.microsoft.com/pricing/details/storage) of storage capacity and cloud-based object storage transactions.  Unlike other cloud storage services, BlobFS enjoys several orders of magnitude of lower costs because data is not moved or transformed before performing analysis.

## Tailored for creating your data lake

The objective for an *Enterprise Data Lake (EDL)* is to refine vast amounts of raw data into fit-for-purpose data sets. In addition to a scalable and performant storage service, an EDL must also feature the following capabilities to realize this objective:

* **Universal Metadata Service:** This facility handles the assignment, management, and querying of metadata tags on any of the data in the EDL. ADFS provides XXXX which meets this requirement.

* **Universal Schema Catalog:** Data stored in an EDL flows through a process of ongoing refinement and enrichment by application of various analytics frameworks (eg. Hive and Spark). Many of the higher level analytics engines apply [Schema on Read] techniques that, while providing significant flexibility for semi-structured data, do eventually require a definition of the layout, or schema, of files. This schema information must be stored in a schema catalog.

    In order for this information to be leveraged by the full range of analytics engines available on the platform, the schema information must be able to be accessed in a variety of formats, ranging from the Hadoop-centric [Apache HCatalog](https://cwiki.apache.org/confluence/display/Hive/HCatalog) to those formats required by [SQL Data Warehouse](../../sql-data-warehouse/index.md) and [Analysis Services](../../analysis-services/index.md). 

    The Schema Catalog must also be available to be shared across all instances of analytics services used by an enterprise. To this end, the Schema Catalog is a stand-alone service.

* **Data Governance and Lineage:** TODO: Multiple drivers for this - GDPR, veracity & accuracy of data... 

* **Data Sharing:** TODO: Sharing of data both within & without the organization, without copying and retaining lifecycle control...

## Related concepts

The following articles describe some of the main concepts of BlobFS and detail how to store, access, manage, and gain insights from your data:

* [Hierarchical Namespace] 
* [Scalability and Performance] 
* [Benchmark Results]

## Next Steps

* [Create a ADFS account] 
* [Create an HDInsight cluster with ADFS] 
* [Use an ADFS account in Azure Databricks] 