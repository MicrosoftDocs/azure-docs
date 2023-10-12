---
title: Azure Data Lake Storage Gen1 overview in HDInsight
description: Overview of Data Lake Storage Gen1 in HDInsight.
ms.service: hdinsight
ms.topic: conceptual
ms.custom: seoapr2020
ms.date: 06/08/2023
---

# Azure Data Lake Storage Gen1 overview in HDInsight

Azure Data Lake Storage Gen1 is an enterprise-wide hyperscale repository for big data analytic workloads. Using Azure Data Lake, you can capture data of any size, type, and ingestion speed. And in one place for operational and exploratory analytics.

Access Data Lake Storage Gen1 from Hadoop (available with an HDInsight cluster) by using the WebHDFS-compatible REST APIs. Data Lake Storage Gen1 is designed to enable analytics on the stored data and is tuned for performance in data analytics scenarios. Gen1 includes the capabilities that are essential for real-world enterprise use cases. These capabilities include security, manageability, adaptability, reliability, and availability.

For more information on Azure Data Lake Storage Gen1, see the detailed [Overview of Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-overview.md).

The key capabilities of Data Lake Storage Gen1 include the following.

## Compatibility with Hadoop

Data Lake Storage Gen1 is an Apache Hadoop file system  compatible with HDFS and Hadoop environment.  HDInsight applications or services that use the WebHDFS API can easily integrate with Data Lake Storage Gen1. Data Lake Storage Gen1 also exposes a WebHDFS-compatible REST interface for applications.

Data stored in Data Lake Storage Gen1 can be easily analyzed using Hadoop analytic frameworks. Frameworks such as MapReduce or Hive. Azure HDInsight clusters can be provisioned and configured to directly access data stored in Data Lake Storage Gen1.

## Unlimited storage, petabyte files

Data Lake Storage Gen1 provides unlimited storage and is suitable for storing different kinds of data for analytics. It doesn't impose limits on account sizes, or file sizes. Or the amount of data that can be stored in a data lake. Individual files range in size from kilobytes to petabytes, making Data Lake Storage Gen1 a great choice to store any type of data. Data is stored durably by making multiple copies. And there are no limits on how long the data can be stored in the data lake.

## Performance tuning for big data analytics

Data Lake Storage Gen1 is designed for analytic systems. Systems that require massive throughput to query and analyze large amounts of data. The data lake spreads parts of a file over several individual storage servers. When you're analyzing data, this setup improves the read throughput when the file is read in parallel.

## Readiness for enterprise: Highly available and secure

Data Lake Storage Gen1 provides industry-standard availability and reliability. Data assets are stored durably: redundant copies guard against unexpected failures. Enterprises can use Data Lake Storage Gen1 in their solutions as an important part of their existing data platform.

Data Lake Storage Gen1 also provides enterprise-grade security for stored data. For more information, see [Securing data in Azure Data Lake Storage Gen1](#data-security-in-data-lake-storage-gen1).

## Flexible data structures

Data Lake Storage Gen1 can store any data in its native format, as is, without requiring prior transformations. Data Lake Storage Gen1 doesn't require a schema to be defined before the data is loaded. The individual analytic framework interprets the data and defines a schema at the time of the analysis. Data Lake Storage Gen1 can handle structured data. And semistructured, and unstructured data.

Data Lake Storage Gen1 containers for data are essentially folders and files. You operate on the stored data by using SDKs, the Azure portal, and Azure PowerShell. Data put into the store with these interfaces and containers, can store any data type. Data Lake Storage Gen1 doesn't do any special handling of data based on the type of data.

## Data security in Data Lake Storage Gen1

Data Lake Storage Gen1 uses Azure Active Directory for authentication and uses access control lists (ACLs) to manage access to your data.

| **Feature** | **Description** |
| --- | --- |
| Authentication |Data Lake Storage Gen1 integrates with Azure Active Directory (Azure AD) for identity and access management for all the data stored in Data Lake Storage Gen1. Because of the integration, Data Lake Storage Gen1 benefits from all Azure AD features. These features include: multifactor authentication, Conditional Access, and Azure role-based access control. Also, application usage monitoring, security monitoring and alerting, and so on. Data Lake Storage Gen1 supports the OAuth 2.0 protocol for authentication within the REST interface. See [Authentication within Azure Data Lake Storage Gen1 using Azure Active Directory](../data-lake-store/data-lakes-store-authentication-using-azure-active-directory.md)|
| Access control |Data Lake Storage Gen1 provides access control by supporting POSIX-style permissions that are exposed by the WebHDFS protocol. ACLs can be enabled on the root folder, on subfolders, and on individual files. For more information on how ACLs work in the context of Data Lake Storage Gen1, see [Access control in Data Lake Storage Gen1](../data-lake-store/data-lake-store-access-control.md). |
| Encryption |Data Lake Storage Gen1 also provides encryption for data that is stored in the account. You specify the encryption settings while creating a Data Lake Storage Gen1 account. You can choose to have your data encrypted or opt for no encryption. For more information, see [Encryption in Data Lake Storage Gen1](../data-lake-store/data-lake-store-encryption.md). For instructions on how to provide an encryption-related configuration, see [Get started with Azure Data Lake Storage Gen1 using the Azure portal](../data-lake-store/data-lake-store-get-started-portal.md). |

To learn more about securing data in Data Lake Storage Gen1, see [Securing data stored in Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-secure-data.md).

## Applications that are compatible with Data Lake Storage Gen1

Data Lake Storage Gen1 is compatible with most open-source components in the Hadoop environment. It also integrates nicely with other Azure services.  Follow the links below to learn more about how Data Lake Storage Gen1 can be used both with open-source components and other Azure services.

* See [Open-source big data applications that work with Azure Data Lake Storage Gen1](../data-lake-store/data-lake-store-compatible-oss-other-applications.md).
* See [Integrating Azure Data Lake Storage Gen1 with other Azure services](../data-lake-store/data-lake-store-integrate-with-other-services.md) to understand how to use Data Lake Storage Gen1 with other Azure services to enable a wider range of scenarios.
* See [Using Azure Data Lake Storage Gen1 for big data requirements](../data-lake-store/data-lake-store-data-scenarios.md).

## Data Lake Storage Gen1 file system (adl://)

In Hadoop environments, you can access Data Lake Storage Gen1 through the new file system, the AzureDataLakeFilesystem (adl://). The performance of applications and services that use `adl://` can be optimized in ways that aren't currently available in WebHDFS. As a result, you get the flexibility to either avail the best performance by using the recommended adl://. Or maintain existing code by continuing to use the WebHDFS API directly. Azure HDInsight takes full advantage of the AzureDataLakeFilesystem to provide the best performance on Data Lake Storage Gen1.

Access your data in Data Lake Storage Gen1 by using the following URI:

`adl://<data_lake_storage_gen1_name>.azuredatalakestore.net`

For more information on how to access the data in Data Lake Storage Gen1, see [Actions available on the stored data](../data-lake-store/data-lake-store-get-started-portal.md#properties).

## Next steps

* [Introduction to Azure Data Lake Storage Gen2](../storage/blobs/data-lake-storage-introduction.md)
* [Introduction to Azure Storage](../storage/common/storage-introduction.md)
* [Azure Data Lake Storage Gen2 overview](./overview-data-lake-storage-gen2.md)
