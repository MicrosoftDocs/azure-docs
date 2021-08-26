---
title: 'Feature support: Azure Data Lake Storage Gen2 & protocols'
description: Put a description here.
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 06/30/2021
ms.author: normesta
---

# Azure Storage features available when Azure Data Lake Storage Gen2 or protocols are enabled

This article shows how each Storage account feature is supported in your account and the impact on support when you enable Data Lake Storage Gen2 or support for protocols. 

> [!NOTE]
> Data Lake Storage Gen2, and the Network File System (NFS) 3.0 protocol always require a storage account with a hierarchical namespace enabled.
 
## Standard general-purpose v2 accounts


|Storage feature |Data Lake Storage Gen2  |NFS 3.0 |
|---------------|-------------------|---|
|Hot access tier|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|
|Cool access tier|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|
|Events|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)  <sup>1</sup>|
|Metrics (Classic)|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|!
|Metrics in Azure Monitor|![Yes](../media/icons/yes-icon.png)|![No](../media/icons/no-icon.png)|
|Blob storage Azure CLI commands|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|

<sup>2</sup>    Feature is supported at the preview level.

## Premium block blob accounts


|Storage feature |Data Lake Storage Gen2 |NFS 3.0 |
|---------------|-------------------|---|
|Hot access tier|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|
|Cool access tier|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|
|Events|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)  <sup>1</sup>|
|Metrics (Classic)|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|!
|Metrics in Azure Monitor|![Yes](../media/icons/yes-icon.png)|![No](../media/icons/no-icon.png)|
|Blob storage Azure CLI commands|![Yes](../media/icons/yes-icon.png)|![Yes](../media/icons/yes-icon.png)|

<sup>2</sup>    Feature is supported at the preview level.

## See also