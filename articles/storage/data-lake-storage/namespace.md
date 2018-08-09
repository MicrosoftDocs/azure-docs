---
title: Azure Data Lake Storage Gen2 Preview Hierarchical Namespace
description: Describes the concept of the hierarchical namespace for Azure Data Lake Storage Gen2 Preview
services: storage
author: jamesbak
ms.service: storage
ms.topic: article
ms.date: 06/27/2018
ms.author: jamesbak
ms.component: data-lake-storage-gen2
---

# Azure Data Lake Storage Gen2 Preview hierarchical namespace

A key mechanism that allows Azure Data Lake Storage Gen2 Preview to provide file system performance at object storage scale and prices is the addition of a **hierarchical namespace**. This allows the collection of objects/files within an account to be organized into a hierarchy of directories and nested subdirectories in the same way that the file system on your computer is organized. With the hierarchical namespace enabled, Data Lake Storage Gen2 provides the scalability and cost-effectiveness of object storage, with file system semantics that are familiar to analytics engines and frameworks.

## The benefits of the hierarchical namespace

> [!NOTE]
> During the public preview of Azure Data Lake Storage Gen2, some of the features listed below may vary in their availability. As new features and regions are released during the preview program, this information will be communicated via our dedicated Yammer group.  

The following benefits are associated with file systems that implement a hierarchical namespace over blob data:

- **Atomic Directory Manipulation:** Object stores approximate a directory hierarchy by adopting a convention of embedding slashes (/) in the object name to denote path segments. While this convention works for organizing objects, the convention provides no assistance for actions like moving, renaming or deleting directories. Without real directories, applications must process potentially millions of individual blobs to achieve directory-level tasks. By contrast, the hierarchical namespace processes these tasks by updating a single entry (the parent directory). 

    This dramatic optimization is especially significant for many big data analytics frameworks. Tools like Hive, Spark, etc. often write output to temporary locations and then rename the location at the conclusion of the job. Without the hierarchical namespace, this rename can often take longer than the analytics process itself. Lower job latency equals lower total cost of ownership (TCO) for analytics workloads.

- **Familiar Interface Style:** File systems are well understood by developers and users alike. There is no need to learn a new storage paradigm when you move to the cloud as the file system interface exposed by Data Lake Storage Gen2 is the same paradigm used by computers, large and small.

One of the reasons that object stores have not historically supported hierarchical namespaces is that hierarchical namespaces limited scale. However, the Data Lake Storage Gen2 hierarchical namespace scales linearly and does not degrade either the data capacity or performance.

## When to enable the hierarchical namespace

Turning on the hierarchical namespace is recommended for storage workloads that are designed for file systems that manipulate directories. This includes all workloads that are primarily for analytics processing. Datasets that require a high degree of organization will also benefit by enabling the hierarchical namespace.

The reasons for enabling the hierarchical namespace are determined by a TCO analysis. Generally speaking, improvements in workload latency due to storage acceleration will require compute resources for less time. Latency for many workloads may be improved due to atomic directory manipulation that is enabled by the hierarchical namespace. In many workloads, the compute resource represents > 85% of the total cost and so even a modest reduction in workload latency equates to a significant amount of TCO savings. Even in cases where enabling the hierarchical namespace increases storage costs, the TCO is still lowered due to reduced compute costs.

## When to disable the hierarchical namespace

Some object store workloads may not gain any benefit by enabling the hierarchical namespace. Examples of these workloads include backups, image storage, and other applications where object organization is stored separately from the objects themselves (*e.g.*, in a separate database).

> [!NOTE]
> With the preview release, if you enable the hierarchical namespace, there is no interoperability of data or operations between Blob and Data Lake Storage Gen2 REST APIs. This functionality will be added during preview.

## Next steps

- [Create a Storage account](./quickstart-create-account.md)