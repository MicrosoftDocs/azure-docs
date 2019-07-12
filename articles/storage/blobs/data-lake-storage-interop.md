---
title: Blob interoperability with ADLS Gen2 | Microsoft Docs
description: Use Blob APIs and applications that use Blob APIs with ADLS Gen2.
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 04/26/2019
ms.author: normesta

---
# Blob interoperability with ADLS Gen2

Blob APIs now work with accounts that have a hierarchical namespace. This unlocks the entire ecosystem of tools, applications, and services as well as all Blob storage features to accounts that have a hierarchical namespace. 

> [!NOTE]
> Blob interoperability with ADLS Gen2 is in public preview, and is available only in the **West US 2** and **West Central US** regions. <br><br>To enroll in the preview, see [this page](aka.ms/blobinteropsignup). <br><br>Not all Blob features are enabled in accounts that have a hierarchical namespace. To see a list of limitations, see [Known issues](data-lake-storage-known-issues.md).

## One storage solution: All data can be considered analytics data

Until recently, you might have had to maintain separate storage solutions for object storage and analytics storage. That's because ADLS Gen2 had limited ecosystem support and limited access to Blob service features such as diagnostic logging. 

A fragmented storage solution is hard to maintain for many reasons. For example, you have to move data between accounts to accomplish various scenarios. Developers have to maintain separate applications for each type of storage because of API differences. Ecosystem providers have to create a separate connector for each type of storage which can cause delays in support.  

Blob interoperability with ADLS Gen2 resolves these inefficiencies by giving you full ecosystem support and access to Blob storage features. 

### Access to the entire ecosystem of applications, tools and services

If you enroll in the preview of Blob interoperability with ADLS Gen2, you can work with all of your data by using the entire ecosystem of tools, applications, and services. This includes Azure services such as [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction), [IOT Hub](https://docs.microsoft.com/azure/iot-hub/), [Power BI](data-lake-storage-use-power-bi.md), and many others. 

This also includes third party tools and applications. If you directly build and maintain applications that call Blob APIs, you can point them to accounts that have a hierarchical namespace without having to modify them. They work as is because Blob APIs can now operate on data in those accounts.

> [!NOTE]
> To see a list of features not yet enabled by Blob interoperability with ADLS Gen2, see [Known issues](data-lake-storage-known-issues.md).

### Access to all Blob storage features

Blob storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob storage lifecycle management policies](storage-lifecycle-management-concepts) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your blob storage accounts without loosing access to these important features. 

> [!NOTE]
> To see a list of features not yet enabled by Blob interoperability with ADLS Gen2, see [Known issues](data-lake-storage-known-issues.md). 

## How interoperability works

Blob APIs and ADLS Gen2 APIs can operate on the same data in storage accounts that have a hierarchical namespace. To accomplish this, ADLS Gen2 routes Blob APIs through the hierarchical namespace so you get the benefits of first class directory operations and POSIX compliant access control lists (ACLs). 

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png) 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. ADLS Gen2 consistently applies directory and file-level ACLs regardless of the protocol that tools and applications use to access the data.   

## Next steps

See [Known issues](data-lake-storage-known-issues.md)




