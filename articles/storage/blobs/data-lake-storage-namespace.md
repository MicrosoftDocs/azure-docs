---
title: Azure Data Lake Storage Gen2 hierarchical namespace
titleSuffix: Azure Storage
description: Describes the concept of a hierarchical namespace for Azure Data Lake Storage Gen2
author: normesta

ms.service: azure-data-lake-storage
ms.topic: conceptual
ms.date: 03/09/2023
ms.author: normesta
ms.reviewer: jamesbak
---

# Azure Data Lake Storage Gen2 hierarchical namespace

A key mechanism that allows Azure Data Lake Storage Gen2 to provide file system performance at object storage scale and prices is the addition of a **hierarchical namespace**. This allows the collection of objects/files within an account to be organized into a hierarchy of directories and nested subdirectories in the same way that the file system on your computer is organized. With a hierarchical namespace enabled, a storage account becomes capable of providing the scalability and cost-effectiveness of object storage, with file system semantics that are familiar to analytics engines and frameworks.

## The benefits of a hierarchical namespace

The following benefits are associated with file systems that implement a hierarchical namespace over blob data:

- **Atomic directory manipulation:** Object stores approximate a directory hierarchy by adopting a convention of embedding slashes (/) in the object name to denote path segments. While this convention works for organizing objects, the convention provides no assistance for actions like moving, renaming or deleting directories. Without real directories, applications must process potentially millions of individual blobs to achieve directory-level tasks. By contrast, a hierarchical namespace processes these tasks by updating a single entry (the parent directory).

    This dramatic optimization is especially significant for many big data analytics frameworks. Tools like Hive, Spark, etc. often write output to temporary locations and then rename the location at the conclusion of the job. Without a hierarchical namespace, this rename can often take longer than the analytics process itself. Lower job latency equals lower total cost of ownership (TCO) for analytics workloads.

- **Familiar Interface Style:** File systems are well understood by developers and users alike. There is no need to learn a new storage paradigm when you move to the cloud as the file system interface exposed by Data Lake Storage Gen2 is the same paradigm used by computers, large and small.

One of the reasons that object stores haven't historically supported a hierarchical namespace is that a hierarchical namespace limits scale. However, the Data Lake Storage Gen2 hierarchical namespace scales linearly and does not degrade either the data capacity or performance.

## Deciding whether to enable a hierarchical namespace

After you've enabled a hierarchical namespace on your account, you can't revert it back to a flat namespace. Therefore, consider whether it makes sense to enable a hierarchical namespace based on the nature of your object store workloads. To evaluate the impact of enabling a hierarchical namespace on workloads, applications, costs, service integrations, tools, features, and documentation, see [Upgrading Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities](upgrade-to-data-lake-storage-gen2.md).

Some workloads might not gain any benefit by enabling a hierarchical namespace. Examples include backups, image storage, and other applications where object organization is stored separately from the objects themselves (for example: in a separate database).

Also, while support for Blob storage features and the Azure service ecosystem continues to grow, there are still some features and Azure services that are not yet supported in accounts that have a hierarchical namespace. See [Known Issues](data-lake-storage-known-issues.md).

In general, we recommend that you turn on a hierarchical namespace for storage workloads that are designed for file systems that manipulate directories. This includes all workloads that are primarily for analytics processing. Datasets that require a high degree of organization will also benefit by enabling a hierarchical namespace.

The reasons for enabling a hierarchical namespace are determined by a TCO analysis. Generally speaking, improvements in workload latency due to storage acceleration will require compute resources for less time. Latency for many workloads may be improved due to atomic directory manipulation that is enabled by a hierarchical namespace. In many workloads, the compute resource represents > 85% of the total cost and so even a modest reduction in workload latency equates to a significant amount of TCO savings. Even in cases where enabling a hierarchical namespace increases storage costs, the TCO is still lowered due to reduced compute costs.

To analyze differences in data storage prices, transaction prices, and storage capacity reservation pricing between accounts that have a flat hierarchical namespace versus a hierarchical namespace, see [Azure Data Lake Storage Gen2 pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/).

## Next steps

- Enable a hierarchical namespace when you create a new storage account. See [Create a storage account to use with Azure Data Lake Storage Gen2](create-data-lake-storage-account.md).
- Enable a hierarchical namespace on an existing storage account. See [Upgrade Azure Blob Storage with Azure Data Lake Storage Gen2 capabilities](upgrade-to-data-lake-storage-gen2-how-to.md).
