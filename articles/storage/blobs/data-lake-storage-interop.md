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

You can use existing blob storage features with Data Lake Storage Gen2. This means that features such as Create, Read, Update, and Delete (CRUD) operations, and diagnostic logs with blob storage accounts that have a hierarchical namespace. 

The enables you to easily bring together your Blob applications while leveraging the performance and features of Data Lake Storage.  

> [!NOTE]
> Blob and Azure Data Lake Storage Gen2 interoperability is currently in public preview and is available only in the **West US 2** and **West Central US** regions.

## Single storage account for all scenarios

To store data in the cloud, you've typically had to use different types of storage based on each use case. For example, you might have used object storage to backup and archive data, and analytics storage to process and analyze data. This can be hard to maintain for many reasons. First, you have to move data between accounts. Developers have to build and maintain separate applications for each type of storage because of protocol differences. Ecosystem providers have to build a different connector for each type of storage, and because these connectors take a lot of work to build, you have to wait for an extended period of time before you can get a full and rich ecosystem. A true data lake enables you to use multiple data access methods on all types of data including unstructured, semi-structured, and structured data. Blob and Data Lake Storage Gen2 interoperability fulfills this goal.

Blob and Data Lake Storage Gen2 interoperability enables you to have one central storage solution, and eliminates the need to maintain multiple forms of storage. It provides multiple data access points to shared data sets so that tools and data applications can interact with data in their most natural way.  This also allows your data lake to benefit from the tools and frameworks that have been built for a wide variety of ecosystems.       
 
If you enable the hierarchical namespace feature on your blob storage account, you can use either Blob or Data Lake Storage Gen2 APIs on your data. Blob APIs are routed through the hierarchical namespace so you get the benefits of first-class directory operations and POSIX-compliant access control lists (ACLs). Existing tools and applications that use the Blob API gain these benefits without any modification. Directory and file-level ACLs are consistently applied regardless of which protocol is used to access the data.

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png)    

## Features that are enabled

In the public preview of Blob and Data Lake Storage Gen2 interoperability, these features are enabled for storage accounts that have a hierarchical namespace.

> [!div class="checklist"]
> * Diagnostic logs
> * SDKs
> * Powershell support
> * Access tiers
> * Lifecycle management policies
> * Change notifications
> * Azure Ecosystem

### Diagnostic logs

Use diagnostic logs to audit operations on your data and to detect and troubleshoot errors. Both Version 1.0 and Version 2.0 logs are supported. 

### SDKs

Use Java, .NET, and Python SDKs to perform all of your management and data plane operations. Custom applications that target blob storage now work with storage accounts that have a hierarchical namespace. 

### Powershell support

Use Powershell cmdlets to interact with your data.  

### Access tiers

Use cool and archive access tiers to optimize for cost and performance. As data use declines, move it into the cool access tier to save costs without sacrificing performance. The cool access tier provides you with the same level of performance as the hot access tier, but at a lower cost in cases where data is accessed less often.  You can access that data for a slightly higher transaction cost, or move that data back into the hot access tier if your data becomes more frequently accessed. The Archive tier gives you a long term storage solution for your analytics data at a significantly reduced rate.  This way, you can store your analytics data until you need to use it.         

### Lifecycle management policies 

Use lifecycle management policies to automatically transition data to different access tiers based on rules that you define.  

### Change notifications

Something here.

### Azure Ecosystem 

Use these Azure services with accounts that have a hierarchical namespace:

> [!div class="checklist"]
> * Azure Stream Analytics
> * IOT Hub Capture
> * Event Hubs Capture
> * Data Box
> * Power BI

### Partner Ecosystem

Third party providers and partners that have existing Blob connectors can use those same connectors to work with accounts that have a hierarchical namespace. 



