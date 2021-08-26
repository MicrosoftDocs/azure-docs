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

This article shows how each storage account feature is supported in your account when you enable Data Lake Storage Gen2 or support for protocols. 

> [!NOTE]
> Data Lake Storage Gen2, and the Network File System (NFS) 3.0 protocol always require a storage account with a hierarchical namespace enabled.
 
## Standard general-purpose v2 accounts

| Storage feature | Data Lake Storage Gen2  | NFS 3.0 |
|---------------|-------------------|---|
| Access tier - archive | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Access tier - cold	| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| Access tier - hot | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Anonymous public access| ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png)|
| Azure Active Directory (AD) Security | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Azure Storage blob inventory | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Blob index tags |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Blob snapshots | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| Blob Storage APIs | ![Yes](../media/icons/yes-icon.png) |	![Yes](../media/icons/yes-icon.png) |
| Blob Storage Azure CLI commands |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Blob Storage events |	![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Blob storage PowerShell commands | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Blob versioning | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Blobfuse | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Change feed |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Custom domains | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Customer-managed account failover | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Customer-managed keys | ![Yes](../media/icons/yes-icon.png) |	![Yes](../media/icons/yes-icon.png) |
| Customer-provided keys for Azure Storage encryption |	![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Data redundancy options |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Encryption scopes | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Immutable storage | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Last access time tracking for lifecycle management | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Lifecycle management policies (delete blob) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Lifecycle management policies (tiering) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Logging in Azure Monitor | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Metrics in Azure Monitor | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Object replication for block blobs | ![No](../media/icons/no-icon.png) |	![No](../media/icons/no-icon.png) |
| Page blobs | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Point-in-time restore for block blobs | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Private endpoints | ![Yes](../media/icons/yes-icon.png) |	![Yes](../media/icons/yes-icon.png) |
| Soft delete for blobs | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| Soft delete for containers | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Static websites | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Storage Analytics logs (classic) | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Storage Analytics metrics (classic) |	![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup>    Feature is supported at the preview level.

## Premium block blob accounts

| Storage feature | Data Lake Storage Gen2  | NFS 3.0 |
|---------------|-------------------|---|
| Access tier - archive | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Access tier - cold | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Access tier - hot | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Anonymous public access | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Azure Active Directory (AD) Security | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Azure Storage blob inventory | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Blob index tags | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Blob snapshots | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| Blob storage APIs | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Blob storage Azure CLI commands | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Blob Storage events | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Blob storage PowerShell commands | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Blob versioning | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Blobfuse | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Change feed | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Custom domains | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Customer-managed account failover | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Customer-managed keys | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Customer-provided keys for Azure Storage encryption | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Data redundancy options | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Encryption scopes | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Immutable storage | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Last access time tracking for lifecycle management | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Lifecycle management policies (delete blob) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Lifecycle management policies (tiering) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Logging in Azure Monitor | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Metrics in Azure Monitor | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Object replication for block blobs | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Page blobs | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Point-in-time restore for block blobs | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Private endpoints | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Soft delete for blobs	| ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![No](../media/icons/no-icon.png) |
| Soft delete for containers | ![Yes](../media/icons/yes-icon.png) | ![No](../media/icons/no-icon.png) |
| Static websites | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Storage Analytics logs (classic) | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> | ![Yes](../media/icons/yes-icon.png)  <sup>1</sup> |
| Storage Analytics metrics (classic) | ![Yes](../media/icons/yes-icon.png) | ![Yes](../media/icons/yes-icon.png) |

<sup>1</sup>    Feature is supported at the preview level.

## See also