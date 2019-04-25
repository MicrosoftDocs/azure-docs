---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
services: storage
author: normesta
ms.subservice: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 02/28/2019
ms.author: normesta

---
# Known issues with Azure Data Lake Storage Gen2

This article contains known issues and temporary limitations with Data Lake Storage Gen2.

## SDK support for Data Lake Storage Gen2 accounts

There aren’t SDKs available that will work with Data Lake Storage Gen2 accounts.

## Blob storage APIs

Blob storage APIs aren't yet available to Data Lake Storage Gen2 accounts.

These APIs are disabled to prevent inadvertent data access issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

If you used these APIs to load data before they were disabled, and you have a production requirement to access that data, then please contact Microsoft Support with the following information:

* Subscription ID (the GUID, not the name)

* Storage account name(s)

* Whether you are actively impacted in production, and if so, for which storage accounts?

* Even if you are not actively impacted in production, tell us whether you need this data to be copied to another storage account for some reason, and if so, why?

Under these circumstances, we can restore access to the Blob API for a limited period of time so that you can copy this data into a storage account that doesn't have the hierarchical namespace feature enabled.

Unmanaged Virtual Machine (VM) disks depend upon the disabled Blob Storage APIs, so if you want to enable a hierarchical namespace on a storage account, consider placing unmanaged VM disks into a storage account that doesn't have the hierarchical namespace feature enabled.

## API interoperability

Blob Storage APIs and Azure Data Lake Gen2 APIs aren't interoperable with each other.

If you have tools, applications, services, or scripts that use Blob APIs, and you want to use them to work with all of the content that you upload to your account, then don't enable a hierarchical namespace on your Blob storage account until Blob APIs become interoperable with Azure Data Lake Gen2 APIs. Using a storage account without a hierarchical namespace means you then don't have access to Data Lake Storage Gen2 specific features, such as directory and file system access control lists.

## Azure Storage Explorer

To view or manage Data Lake Storage Gen2 accounts by using Azure Storage Explorer, you must have at least version `1.6.0` of the tool which is available as a [free download](https://azure.microsoft.com/features/storage-explorer/).

Note that the version of Storage Explorer that is embedded into the Azure portal does not currently support viewing or managing Data Lake Storage Gen2 accounts with the hierarchical namespace feature enabled.

## Blob viewing tool

Blob viewing tool on Azure portal has only limited support for Data Lake Storage Gen2.

## Third-party applications

Third-party applications might not support Data Lake Storage Gen2.

Support is at the discretion of each third-party application provider. Currently, Blob storage APIs and Data Lake Storage Gen2 APIs can't be used to manage the same content. As we work to enable that interoperability, it's possible that many third-party tools will automatically support Data Lake Storage Gen2.

## AzCopy support

AzCopy version 8 doesn’t support Data Lake Storage Gen2.

Instead, use the latest preview version of AzCopy ( [AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json) ) as it supports Data Lake Storage Gen2 endpoints.

## Azure Event Grid

[Azure Event Grid](https://azure.microsoft.com/services/event-grid/) doesn't receive events from Azure Data Lake Gen2 accounts because those accounts don't yet generate them.  

## Soft delete and snapshots

Soft delete and snapshots aren't available for Data Lake Storage Gen2 accounts.

All versioning features including [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob) and [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) aren't yet available for Storage accounts that have the hierarchical namespace feature enabled.

## Object level storage tiers

Object level storage tiers (Hot, Cold, and Archive) aren't yet available for Azure Data Lake Storage Gen 2 accounts, but they are available to Storage accounts that don't have the hierarchical namespace feature enabled.

## Azure Blob Storage lifecycle management policies

Azure Blob Storage lifecycle management policies aren't yet available for Data Lake Storage Gen2 accounts.

These policies are available to Storage accounts that don't have the hierarchical namespace feature enabled.

## Diagnostic logs

Diagnostic logs aren't available for Data Lake Storage Gen2 accounts.
