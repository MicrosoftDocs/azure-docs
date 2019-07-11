---
title: Blob interoperability with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with Data Lake Storage Gen2.
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Blob interoperability with Azure Data Lake Storage Gen2

Blob APIs and Data Lake Storage Gen2 APIs can interoperate on the same data. This means that tools and applications that call Blob APIs, as well as Blob storage features, such as diagnostic logs, can work with accounts that have a hierarchical namespace.

> [!NOTE]
> Blob interoperability with Azure Data Lake Storage Gen2 is currently in public preview and is available only in the **West US 2** and **West Central US** regions.

## The cost of maintaining separate storage solutions 

Until now, you've had to use different storage accounts to store data in the cloud, for example, object storage to backup and archive data, and analytics storage to process and analyze it. 

This can be hard to maintain for many reasons. For example, you have to move data between accounts to accomplish various scenarios. Developers have to maintain separate applications for each type of storage because of protocol differences. Ecosystem providers have to create a separate connector for each type of storage, and because these connectors are difficult to build, you have to wait longer to get a full and rich ecosystem. 

## A single storage solution for every scenario

A true data lake enables you to access all types of data including unstructured, semi-structured, and structured data by using multiple data access methods. Blob interoperability with Azure Data Lake Storage Gen2 fulfills this goal, and moves your account closer to a true data lake. It eliminates the need to maintain multiple forms of storage. You can have one central storage solution with multiple data access points to shared data sets so that tools and data applications can interact with data in their most natural way. Your data lake can benefit from the tools and frameworks that have been built for a wide variety of ecosystems.

## How interoperability works

Blob APIs and Data Lake Storage Gen2 APIs can interoperate on the same data in storage accounts that have a hierarchical namespace.  

Blob APIs are routed through the hierarchical namespace so you get the benefits of first class directory operations and POSIX compliant access control lists (ACLs). 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. Directory and file-level ACLs are consistently applied regardless of which protocol tools and applications uses to access the data.

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png)    


## Next steps

See [Known issues](data-lake-storage-known-issues.md)




