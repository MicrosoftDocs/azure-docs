---
title: Azure Data Lake Storage Hierarchical Namespace Service
description:  Describes the concept of the hierarchical namespace for ADLS
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

# Azure Data Lake Storage Hierarchical Namespace Service

A key mechanism that allows Azure Data Lake Storage (ADLS) to provide file system performance at object storage scale and prices is the introduction of the **Hierarchical Namespace Service (HNS)**. The HNS allows the collection of blobs within an account to be organized into a hierarchy of directories and nested subdirectories in the same way that the file system on your computer is organized. With the HNS enabled, ADLS provides the scalability, cost-effectiveness, and availability that you expect from a cloud storage service. The HNS provides an access model that is familiar to all users of a computer - and more importantly, familiar to all of the analytics engines and frameworks that are designed to expect file system semantics.

## The benefits of the Hierarchical Namespace Service

> [!NOTE]
> During the public preview of ADLS, some of the features listed below may vary in their availability. As new features and regions are released during the preview program, this information will be communicated via our dedicated Yammer group.  
> 

The following benefits are associated with file systems that implement a hierarchical namespace over blob data:

- **Atomic Directory Manipulation:** Most object stores approximate a directory hierarchy by adopting a convention of embedding slashes (/) in the object name to denote path segments. While this convention works satisfactorily for organizing objects, the convention provides no assistance for actions like moving, renaming or deleting directories. Without real directories, applications must process potentially millions of individual blobs to achieve directly-level tasks. By contrast, the HNS processes these tasks by updating a single entry (the parent directory). 

    This dramatic optimization is especially significant for many big data analytics frameworks. Tools like Hive, Spark, etc. often write output to temporary locations and then rename the location at the conclusion of the job. Without the HNS, this rename can often take longer than the analytics process itself. Lower job latency equals lower total cost of ownership (TCO) for analytics workloads.

- **POSIX-Compliant Object-Level Access Control Lists (ACLs):** Enabling the HNS on your account provides a platform to implement [POSIX-compliant ACLs](./storage-blobfs-security-guide.md). ACLs rely on the ability to set default permissions on parent directories and any files or subdirectories created within that directory will 'inherit' those permissions. This is only possible with a strong hierarchical structure. Many applications, including almost all well-known analytics frameworks, are designed to support POSIX-compliant ACLs so that shared storage spaces may be partitioned and secured appropriately as per the enterprise's requirements.

- **Familiar Interface Style:** File systems are well-understood by developers and users alike. There is no need to learn a new storage paradigm when you move to the cloud as the file system interface exposed by ADLS is the same paradigm used by computers, large and small.

One of the reasons that object stores have not historically supported hierarchical namespaces is that it limited scale. However, the ADLS HNS scales linearly and does not degrade either scale or performance.

## When should you enable the Hierarchical Namespace?

Turning on HNS is recommended for storage workloads that are designed for file systems that manipulate directories. This includes all workloads that are primarily for analytics processing. Datasets that require a high degree of organization will also benefit by enabling HNS.

Additionally, if you require fine-grained access control of files contained within a shared account you must enable HNS to gain this ability.

The reasons for enabling HNS are determined by a TCO analysis. Generally speaking, improvements in workload latency due to storage acceleration will require compute resources for less time. Latency for many workloads may be improved due to atomic directory manipulation that is enabled by HNS. In many workloads, the compute resource represents > 85% of the total cost and so even a modest reduction in workload latency equates to a significant amount of TCO savings. Even in cases where enabling HNS increases storage costs, the TCO is still lowered due to reduced compute costs.

## When should you disable the Hierarchical Namespace?

There are a number of 'classic' object store workloads that will most likely not gain any benefit by enabling HNS. Examples of these workloads are; backups, image storage and other applications where object organization is stored separately to the objects themselves (eg. in a separate database).

> [!NOTE]
> Even though you may have the HNS enabled on your account, data stored in ADLS is still fully interoperable with the Azure Storage Blobs interface.

## Next Steps

- [Introduction to Azure Blob File System](./storage-blobfs-introduction.md)

- [Create a storage account](./storage-adls-create-account.md)