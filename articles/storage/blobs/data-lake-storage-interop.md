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
> Blob interoperability with ADLS Gen2 is in public preview, and is available only in the **West US 2** and **West Central US** regions. To see a list of limitations, see [Known issues](data-lake-storage-known-issues.md). To enroll in the preview, see [this page](http://aka.ms/blobinteropsignup).

## Access to the Blob storage features and the entire ecosystem

Until recently, you might have had to maintain separate storage solutions for object storage and analytics storage. That's because ADLS Gen2 had limited ecosystem support and limited access to Blob service features such as diagnostic logging. A fragmented storage solution is hard to maintain becaus you have to move data between accounts to accomplish various scenarios. 

Blob interoperability with ADLS Gen2 resolves that inefficiency by giving you full ecosystem support and access to Blob storage features so that you don't have to move data back and forth between accounts to accomplish scenarios.  

### Access to the entire ecosystem of applications, tools and services

If you enroll in the preview of Blob interoperability with ADLS Gen2, you can work with all of your data by using the entire ecosystem of tools, applications, and services. This includes Azure services such as [Azure Stream Analytics](https://docs.microsoft.com/azure/stream-analytics/stream-analytics-introduction), [IOT Hub](https://docs.microsoft.com/azure/iot-hub/), [Power BI](data-lake-storage-use-power-bi.md), and many others. 

This also includes third party tools and applications. If you directly build and maintain applications that call Blob APIs, you can point them to accounts that have a hierarchical namespace without having to modify them. They work as is because Blob APIs can now operate on data in those accounts.

> [!NOTE]
> To see a list of limitations, see [Known issues](data-lake-storage-known-issues.md)

### Access to all Blob storage features

Blob storage features such as [diagnostic logging](../common/storage-analytics-logging.md), [access tiers](storage-blob-storage-tiers.md), and [Blob storage lifecycle management policies](storage-lifecycle-management-concepts) now work with accounts that have a hierarchical namespace. Therefore, you can enable hierarchical namespaces on your blob storage accounts without loosing access to these important features. 

> [!NOTE]
> To see a list of limitations, see [Known issues](data-lake-storage-known-issues.md)

## How interoperability works

Blob APIs and ADLS Gen2 APIs can operate on the same data in storage accounts that have a hierarchical namespace. To accomplish this, ADLS Gen2 routes Blob APIs through the hierarchical namespace so you get the benefits of first class directory operations and POSIX compliant access control lists (ACLs). 

![Interop conceptual](./media/data-lake-storage-interop/interop-concept.png) 

Existing tools and applications that use the Blob API gain these benefits automatically. Developers won't have to modify them. ADLS Gen2 consistently applies directory and file-level ACLs regardless of the protocol that tools and applications use to access the data.   

## Next steps

See [Known issues](data-lake-storage-known-issues.md)




