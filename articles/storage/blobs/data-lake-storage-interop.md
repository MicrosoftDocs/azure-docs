---
title: Blob interoperability | Microsoft Docs
description: Some sort of description goes here.
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Blob and Azure Data Lake Storage Gen2 interoperability

Blob APIs are now interoperable with Data Lake Storage Gen2. This means that you can use BLOB and Data Lake Storage Gen2 APIs to interoperate on the same data, and you can point existing tools and applications that use Blob APIs to accounts that have a hierarchical namespace enabled on them. 

Interoperability also unlocks Blob storage features such as diagnostic logs to accounts that have a hierarchical namespace. This article describes interoperability, and the Blob features that it makes available.

> [!NOTE]
> Blob and Azure Data Lake Storage Gen2 interoperability is currently in public preview and is available only in the **West US 2** and **West Central US** regions.

## Separate storage accounts are cumbersome 

Until now, you've had to use different storage accounts to store data in the cloud. For example, you might use object storage to backup and archive data, and analytics storage to process and analyze it. 

This can be hard to maintain for many reasons. For example, you have to move data between accounts to accomplish various scenarios. Developers have to maintain separate applications for each type of storage because of protocol differences. Ecosystem providers have to create a separate connector for each type of storage, and because these connectors are difficult to build, you have to wait longer to get a full and rich ecosystem. 

## A single storage solution for every scenario

A true data lake enables you to use multiple data access methods on all types of data including unstructured, semi-structured, and structured data. Blob and Data Lake Storage Gen2 interoperability fulfills this goal and moves your account closer to a true data lake. 

Blob and Data Lake Storage Gen2 interoperability eliminates the need to maintain multiple forms of storage. Now, you can have one central storage solution with multiple data access points to shared data sets so that tools and data applications can interact with data in their most natural way. Interoperability enables your data lake to benefit from the tools and frameworks that have been built for a wide variety of ecosystems.

## How it works

Blob APIs and Data Lake Storage Gen2 APIs can interoperate on the same data in storage accounts that have a hierarchical namespace.  

Blob APIs are routed through the hierarchical namespace so you get the benefits of first class directory operations and POSIX compliant access control lists (ACLs). 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. Directory and file-level ACLs are consistently applied regardless of which protocol tools and applications uses to access the data.

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png)    

## Features now available to Data Lake Storage Gen2

Interoperability unlocks several features to accounts that have a hierarchical namespace. The following table describes them.

| Feature     | More information    |
|--------|-----------|
| **Diagnostic logs** | Use diagnostic logs to audit operations on your data and to detect and troubleshoot errors. Both Version 1.0 and Version 2.0 logs are supported. <br>see [Azure Storage analytics logging](../common/storage-analytics-logging.md)|
| **SDKs** | Use Java, .NET, and Python SDKs to perform all of your management and data plane operations. Custom applications that target blob storage now work with storage accounts that have a hierarchical namespace. <br>See these articles:<br><li>[Use .NET with Azure Data Lake Storage Gen2](storage-dot-net-how-to-use-blobs.md)<li>[Use Java with Azure Data Lake Storage Gen2](storage-java-how-to-use-blobs.md) <li>[Use Python with Azure Data Lake Storage Gen2](storage-python-how-to-use-blobs.md)|
| **Powershell support** | Use Powershell cmdlets to interact with your data.<br>See [Use PowerShell with Azure Data Lake Storage Gen2](data-lake-storage-powershell.md)|
| **Access tiers** | Use cool and archive access tiers to optimize for cost and performance. As data use declines, move it into the cool access tier to save costs without sacrificing performance. The cool access tier provides you with the same level of performance as the hot access tier, but at a lower cost in cases where data is accessed less often.  You can access that data for a slightly higher transaction cost, or move that data back into the hot access tier if your data becomes more frequently accessed. The Archive tier gives you a long term storage solution for your analytics data at a significantly reduced rate.  This way, you can store your analytics data until you need to use it.<br> See [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
| **Lifecycle management policies** | Use lifecycle management policies to automatically transition data to different access tiers based on rules that you define. <br> See [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts)|
| **Change notifications** | Put something here.|
| **Azure service ecosystem** | Use these Azure services with accounts that have a hierarchical namespace: <br><li> Azure Stream Analytics<li>IOT Hub Capture<li>Event Hubs Capture<li>Data Box<li>Power BI|
| **Partner Ecosystem** | Third party providers and partners that have existing Blob connectors can use those same connectors to work with accounts that have a hierarchical namespace. |

## Next steps

See [Known issues](data-lake-storage-known-issues.md)




