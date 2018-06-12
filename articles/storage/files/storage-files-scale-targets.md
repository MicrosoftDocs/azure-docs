---
title: Azure Files scalability and performance targets | Microsoft Docs
description: Learn about the scalability and performance targets for Azure Files, including the capacity, request rate, and inbound and outbound bandwidth limits.
services: storage
documentationcenter: na
author: wmgries
manager: klaasl
editor: tamram
ms.service: storage
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: storage
ms.date: 10/17/2017
ms.author: wgries
---

# Azure Files scalability and performance targets
[Azure Files](storage-files-introduction.md) offers fully managed file shares in the cloud that are accessible via the industry standard SMB protocol. This article discusses the scalability and performance targets for Azure Files and Azure File Sync (Preview).

The scalability and performance targets listed here are high-end targets, but may be affected by other variables in your deployment. For example, the throughput for a file may also be limited by your available network bandwidth, not just the servers hosting the Azure Files service. We strongly recommend testing your usage pattern to determine whether the scalability and performance of Azure Files meet your requirements. We are also committed to increasing these limits over time. Please don't hesitate to give us feedback, either in the comments below or on the [Azure Files UserVoice](https://feedback.azure.com/forums/217298-storage/category/180670-files), about which limits you would like to see us increase.

## Azure storage account scale targets
The parent resource for an Azure File share is an Azure storage account. A storage account represents a pool of storage in Azure that can be used by multiple storage services, including Azure Files, to store data. Other services that store data in storage accounts are Azure Blob storage, Azure Queue storage, and Azure Table storage. The following targets apply all storage services storing data in a storage account:

[!INCLUDE [azure-storage-limits](../../../includes/azure-storage-limits.md)]

[!INCLUDE [azure-storage-limits-azure-resource-manager](../../../includes/azure-storage-limits-azure-resource-manager.md)]

> [!Important]  
> Storage account utilization from other storage services affects your Azure File shares in your storage account. For example, if you reach the maximum storage account capacity with Azure Blob storage, you will not be able to create new files on your Azure File share, even if your Azure File share is below the maximum share size.

## Azure Files scale targets
[!INCLUDE [storage-files-scale-targets](../../../includes/storage-files-scale-targets.md)]

## Azure File Sync scale targets
With Azure File Sync, we have tried as much as possible to design for limitless usage, however this is not always possible. The below table indicates the boundaries of our testing and which targets are actually hard limits:

[!INCLUDE [storage-sync-files-scale-targets](../../../includes/storage-sync-files-scale-targets.md)]

## See also
- [Planning for an Azure Files deployment](storage-files-planning.md)
- [Planning for an Azure File Sync deployment](storage-sync-files-planning.md)
- [Scalability and performance targets for other storage services](../common/storage-scalability-targets.md)