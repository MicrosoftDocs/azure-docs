---
title: Blob interoperability | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with Data Lake Storage Gen2.
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Blob and Azure Data Lake Storage Gen2 interoperability

Blob APIs and Data Lake Storage Gen2 APIs can interoperate on the same data. This also means that tools and applications that call Blob APIs, as well as Blob storage features, such as diagnostic logs, can work with accounts that have a hierarchical namespace.

> [!NOTE]
> Blob and Azure Data Lake Storage Gen2 interoperability is currently in public preview and is available only in the **West US 2** and **West Central US** regions.

## The cost of maintaining separate storage solutions 

Until now, you've had to use different storage accounts to store data in the cloud, for example, object storage to backup and archive data, and analytics storage to process and analyze it. 

This can be hard to maintain for many reasons. For example, you have to move data between accounts to accomplish various scenarios. Developers have to maintain separate applications for each type of storage because of protocol differences. Ecosystem providers have to create a separate connector for each type of storage, and because these connectors are difficult to build, you have to wait longer to get a full and rich ecosystem. 

## A single storage solution for every scenario

A true data lake enables you to access all types of data including unstructured, semi-structured, and structured data by using multiple data access methods. Blob and Data Lake Storage Gen2 interoperability fulfills this goal, and moves your account closer to a true data lake. It eliminates the need to maintain multiple forms of storage. You can have one central storage solution with multiple data access points to shared data sets so that tools and data applications can interact with data in their most natural way. Your data lake can benefit from the tools and frameworks that have been built for a wide variety of ecosystems.

## How interoperability works

Blob APIs and Data Lake Storage Gen2 APIs can interoperate on the same data in storage accounts that have a hierarchical namespace.  

Blob APIs are routed through the hierarchical namespace so you get the benefits of first class directory operations and POSIX compliant access control lists (ACLs). 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. Directory and file-level ACLs are consistently applied regardless of which protocol tools and applications uses to access the data.

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png)    

## Features now available to Data Lake Storage Gen2

Interoperability unlocks several features to accounts that have a hierarchical namespace. The following table describes which features are available in the current public preview.

| Feature     | More information    |
|--------|-----------|
| **Diagnostic logs** | Use diagnostic logs to audit operations on your data and to detect and troubleshoot errors. Both version 1.0 and version 2.0 logs are supported. <br><br>To learn more, see [Azure Storage analytics logging](../common/storage-analytics-logging.md)|
| **SDKs** | Use Java, .NET, and Python SDKs to perform all of your management and data plane operations. Custom applications that target blob storage now work with storage accounts that have a hierarchical namespace. <br><br>To learn more, see any of these articles:<br><br><li>[Use .NET with Azure Data Lake Storage Gen2](storage-dot-net-how-to-use-blobs.md)<li>[Use Java with Azure Data Lake Storage Gen2](storage-java-how-to-use-blobs.md) <li>[Use Python with Azure Data Lake Storage Gen2](storage-python-how-to-use-blobs.md)|
| **Powershell support** | Use Powershell cmdlets to interact with your data.<br><br>To learn more, see [Use PowerShell with Azure Data Lake Storage Gen2](data-lake-storage-powershell.md)|
| **Access tiers** | Use cool and archive access tiers to optimize for cost and performance. As data use declines, move it into the cool access tier to save costs without sacrificing performance. The cool access tier provides you with the same level of performance as the hot access tier, but at a lower cost in cases where data is accessed less often.  You can access that data for a slightly higher transaction cost, or move that data back into the hot access tier if your data becomes more frequently accessed. The Archive tier gives you a long term storage solution for your analytics data at a significantly reduced rate.  This way, you can store your analytics data until you need to use it.<br><br> To learn more, see [Azure Blob storage: hot, cool, and archive access tiers](storage-blob-storage-tiers.md)|
| **Lifecycle management policies** | Use lifecycle management policies to automatically transition data to different access tiers based on rules that you define. <br><br> To learn more, see [Manage the Azure Blob storage lifecycle](storage-lifecycle-management-concepts)|
| **Change notifications** | Put something here.|
| **Azure service ecosystem** | Use these Azure services with accounts that have a hierarchical namespace: <br><br><li> Azure Stream Analytics<li>IOT Hub Capture<li>Event Hubs Capture<li>Data Box<li>Power BI|
| **Partner Ecosystem** | Third party providers and partners that have existing Blob connectors can use those same connectors to work with accounts that have a hierarchical namespace. |

## Next steps

See [Known issues](data-lake-storage-known-issues.md)




