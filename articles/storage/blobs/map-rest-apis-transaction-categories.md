---
title: Map each REST operation to a price - Azure Blob Storage
description: Learn how to plan for and manage costs for Azure Blob Storage by using cost analysis in Azure portal.
services: storage
author: normesta
ms.service: azure-blob-storage
ms.topic: conceptual
ms.date: 09/06/2023
ms.author: normesta
ms.custom: subject-cost-optimization
---

# Map each REST operation to a price category

Put an opening paragraph here.

Clients make a request by using a REST operation from the Blob Storage REST API or the Data Lake Storage Gen2 REST API. Requests that originate from custom applications that use an Azure Storage client library or from tools such as Azure Storage Explorer and AzCopy arrive to the service in the form of a REST operation from either of these APIs. Each request incurs a cost per transaction. Each type of transaction is billed at a different rate. Use these tables as a guide.

## Transaction category of each Blob Storage REST operation

The following table maps each Blob Storage REST API operation to a transaction category that appears in the [Azure Blob Storage pricing](https://azure.microsoft.com/pricing/details/storage/blobs/) page.

| Operation                                                                            | Transaction category      |
|--------------------------------------------------------------------------------------|---------------------------|
| [List Containers](/rest/api/storageservices/list-containers2)                        | List and create container |
| [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties) | Other                     |

## Transaction category of each Data Lake Storage Gen2 REST operation

The following table maps each Blob Storage REST API operation to a transaction category that appears in the [Azure Data Lake Storage pricing](https://azure.microsoft.com/pricing/details/storage/data-lake/) page.

| Operation                                                                            | Transaction category      |
|--------------------------------------------------------------------------------------|---------------------------|
| [List Containers](/rest/api/storageservices/list-containers2)                        | List and create container |
| [Set Blob Service Properties](/rest/api/storageservices/set-blob-service-properties) | Other                     |

## See also

- [Plan and manage costs for Azure Blob Storage](../common/storage-plan-manage-costs.md)
