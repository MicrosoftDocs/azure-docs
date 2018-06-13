---
title: Azure Data Lake Storage Introduction
description:  Introduction to Azure Data Lake Storage
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

# Introduction to Azure Data Lake Storage Gen 2 (Preview)

Azure Data Lake Storage Gen 2 (Preview) adds file system directories and related security to [Azure Blob Storage](../blobs/storage-blobs-introduction.md) making it easy to connect analytics frameworks to a durable storage layer. In ADLS, all the qualities of object storage remain while adding the advantages of a file system interface.

For instance, a common object store naming convention employs slashes in the name to mimic a hierarchical folder structure. This structure becomes real with ADLS. Therefore, while in a directory, objects inherit the established permissions or can enforce object-level security.

## Designed for enterprise big data analytics

ADLS is the foundational storage service for building enterprise data lakes on Azure. Designed from the start to service multiple petabytes of information while sustaining hundreds of gigabytes of throughput, ADLS gives you an easy way to manage massive amounts of data. 

A fundamental feature of ADLS is the introduction of the Hierarchical Namespace service (HNS) which organizes blobs into a hierarchy of directories. The HNS is designed to ensure no additional latency of scale limits emerge in the data pipeline. 

In the past, cloud-based analytics had to compromise in areas of performance, management, and security. ADLS addresses each of these aspects in the following ways:

- **Performance** is optimized because you do not need to copy or transform data as a prerequisite for analysis.
 
- **Management** is easier because you can manipulate files through directories and subdirectories.

- **Security** is enforceable because you can define inheritable ACL and POSIX permissions on folders or individuals files.

- **Cost Effective** is made possible by leveraging the low-cost [Azure Blob Storage](../blobs/storage-blobs-introduction.md) and then adding key features to reduce analytics job latency, thus lowering even further the total cost of ownership for running big data analytics on Azure.

## Key features of ADLS

> [!NOTE]
> During the public preview of ADLS, some of the features listed below may vary in their availability. As new features and regions become available during the preview program, this information will be communicated via our dedicated Yammer group.  
> 
- **Hadoop compatible access**: ADLS allows you to manage and access data just as you would with a [Hadoop Distributed File System (HDFS)](http://hadoop.apache.org/docs/current/hadoop-project-dist/hadoop-hdfs/HdfsDesign.html). The new [ABFS driver](./storage-blobfs-abfs-driver.md) is available within Apache Hadoop environments to access data stored in ADLS.
 
- **A superset of POSIX permissions**: The security model fully supports ACL and POSIX permissions along with some extra granularity specific to ADLS. Settings may be configured through admin tools or through frameworks like Hive and Spark. 

    Authentication and identities are provided courtesy of integration with [Azure Active Directory](../../active-directory).

- **Multi-protocol and multi-model data access**: ADLS makes Azure Storage the first cloud-based **Multi-Modal** storage service as it provides both object store and file system interfaces to the _same_ data **at the same time**. This is achived by providing multiple protocol endpoints that are able to access the same data. 
    
    Unlike other analytics solutions, data stored in ADLS does not need to move or be transformed before you can run a variety of analytics tools. You can access data via traditional [Blob Storage APIs](../blobs/storage-blobs-introduction.md) (for example: ingest data via [Event Hubs Capture](../../event-hubs/event-hubs-capture-enable-through-portal.md)) and process that data using HDInsight or Azure Databricks at the same time. 

- **Cost effective**: ADLS features low-cost storage capacity and transactions. As data transitions through the data lifecycle, billing rates change keeping costs to a minimum via built-in features such as [Azure Blob Storage Lifecycle](../common/storage-lifecycle-managment-concepts.md).

- **Available in all regions**: ADLS is available for Blob Storage (StorageV2) accounts in all Azure regions. 

- **Works with Blob Storage tools, frameworks, and apps**: ADLS is able to interface with a wide array of tools, frameworks, and applications that exist today for Blob Storage. 

- **Optimized protocol**: The `abfs` protocol is [optimized specifically](./storage-blobfs-abfs-driver.md) for big data analytics.

## Scalability
Azure Data Lake Storage and Azure Blob Storage are [scalable by design](../common/storage-scalability-targets.md). Each service is able to store and serve *many exabytes of data*. This amount of storage is available with throughput measured in gigabits per second (GBPS) at high levels of input/output operations per second (IOPS). Beyond just persistence, processing is executed at near-constant per-request latencies that are measured at the service, account, and file levels.

## Cost effectiveness
The architecture of ADLS saves you significant amounts of money. One of the many benefits of building ADLS on top of Azure Blob Storage is the [low cost](https://azure.microsoft.com/pricing/details/storage) of storage capacity and cloud-based object storage transactions.  Unlike other cloud storage services, ADLS enjoys several orders of magnitude of lower costs because data is not moved or transformed before performing analysis.

Additionally, features such as the [Hierarchical Namespace Service](./storage-blobfs-namespace.md) significantly improve the overall performance of many analytics jobs. This improvement in performance means that you require less compute power to process the same amount of data, resulting in a lower total cost of ownership (TCO) for the end to end analytics job.

<!--- ## Tailored for creating your data lake

The objective for an *Enterprise Data Lake (EDL)* is to refine vast amounts of raw data into fit-for-purpose data sets. In addition to a scalable and performant storage service, an EDL must also feature the following capabilities to realize this objective, which will be provided on Azure in the future:

* **Universal Metadata Service:** This facility handles the assignment, management, and querying of metadata tags on any of the data in the EDL. ADFS provides XXXX which meets this requirement.

* **Universal Schema Catalog:** Data stored in an EDL flows through a process of ongoing refinement and enrichment by application of various analytics frameworks (eg. Hive and Spark). Many of the higher level analytics engines apply [Schema on Read](storage-adfs-schema-on-read.md) techniques that, while providing significant flexibility for semi-structured data, do eventually require a definition of the layout, or schema, of files. This schema information must be stored in a schema catalog.

    In order for this information to be leveraged by the full range of analytics engines available on the platform, the schema information must be able to be accessed in a variety of formats, ranging from the Hadoop-centric [Apache HCatalog](https://cwiki.apache.org/confluence/display/Hive/HCatalog) to those formats required by [SQL Data Warehouse](../../sql-data-warehouse/index.md) and [Analysis Services](../../analysis-services/index.md). 

    The Schema Catalog must also be available to be shared across all instances of analytics services used by an enterprise. To this end, the Schema Catalog is a stand-alone service.

* **Data Governance and Lineage:** TODO: Multiple drivers for this - GDPR, veracity & accuracy of data... 

* **Data Sharing:** TODO: Sharing of data both within & without the organization, without copying and retaining lifecycle control...
-->

## Related concepts

The following articles describe some of the main concepts of ADLS and detail how to store, access, manage, and gain insights from your data:

* [Hierarchical Namespace](./storage-blobfs-namespace.md)
* [Scalability and Performance](./storage-adfs-scalability-and-performance.md)
* [Benchmark Results](./storage-adfs-performance-benchmarks.md)

## Next Steps

* [Create a ADFS account](../common/storage-create-storage-account.md?toc=%2fazure%2fstorage%2fadfs%2ftoc.json)
* [Create an HDInsight cluster with ADFS](./storage-adfs-quickstart-hdinsight.md)
* [Use an ADFS account in Azure Databricks](./storage-adfs-quckstart-databricks.md)