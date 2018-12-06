---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Learn about the limitations and known issues with Azure Data Lake Storage Gen2
services: storage
author: normesta

ms.component: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 12/05/2018
ms.author: normesta

---
# Known issues with Azure Data Lake Storage Gen2

This article contains known issues and temporary limitations with Azure Data Lake Storage Gen2.

## API interoperability

Blob Storage APIs and Azure Data Lake Gen2 APIs aren't interoperable with each other.

If you need to use the same tool to work with all of the content that you upload to your account, then don't enable hierarchical namespaces on your Blob storage account until these APIs become interoperable with each other. Using a storage account without the hierarchical namespace means you then don't have access to Data Lake Storage Gen2 specific features, such as directory and filesystem access control lists.

## Blob storage APIs

Blob storage APIs aren't yet available to Azure Data Lake Storage Gen 2 accounts.

These APIs are disabled to prevent inadvertent data access issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

Unmanaged Virtual Machine (VM) disks depend upon these APIs, so if you want to enable hierarchical namespaces on a storage account, consider placing unmanaged VM disks into a storage account that doesn't have hierarchical namespaces enabled.

## Azure Storage Explorer

To view or manage Data Lake Storage Gen2 accounts by using Azure Storage Explorer, you must have at least version `1.6.0` of the tool which is available as a [free download](https://azure.microsoft.com/features/storage-explorer/).

Note that the version of Storage Explorer that is embedded into the Azure Portal does not currently support viewing or managing Data Lake Storage Gen2 accounts with hierarchical namespaces enabled.

## Blob viewing tool

Blob viewing tool on Azure portal has only limited support for Azure Data Lake Storage Gen2.

## Third-party applications

Third-party applications might not support Azure Data Lake Storage Gen2.

Support is at the discretion of each third-party application provider. Currently, Blob storage APIs and Azure Data Lake Storage Gen2 APIs can't be used to manage the same content. As we work to enable that interoperability, it's possible that many third-party tools will automatically support Azure Data Lake Storage Gen2.

## AzCopy support

AzCopy version 8 doesn’t support Azure Data Lake Storage Gen2.

Instead, use the latest preview version of AzCopy ( [AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json) ) as it supports Azure Data Lake Storage Gen2 endpoints.

## OAuth authentication

Services such as Azure Databricks, HDInsight, and Azure Data Factory don't yet integrate with Azure Active Directory (Azure AD) OAuth bearer token authentication.

## Azure Event Grid

[Azure Event Grid](https://azure.microsoft.com/services/event-grid/) doesn't receive events from Azure Data Lake Gen2 accounts because those accounts don't yet generate them.  

## Soft delete and snapshots

Soft delete and snapshots aren't available for Azure Data Lake Storage Gen2 accounts.

All versioning features including [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob) and [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) aren't yet available for Storage accounts that have hierarchical namespaces enabled.

## Object level storage tiers

Object level storage tiers (Hot, Cold, and Archive) aren't yet available for Azure Data Lake Storage Gen 2 accounts, but they are available to Storage accounts that don't have hierarchical spaces enabled.

## Azure Blob Storage lifecycle management (Preview) policies

Azure Blob Storage lifecycle management (Preview) policies aren't yet available for Azure Data Lake Storage Gen2 accounts.

These policies are available to Storage accounts that don't have hierarchical spaces enabled.

## Diagnostic logs

Diagnostic logs aren't available for Azure Data Lake Storage Gen2 accounts.

To request diagnostic logs, contact Azure Support. Provide them with your account name and the period of time for which you require logs.
