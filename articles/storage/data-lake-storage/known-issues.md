---
title: Known issues with Azure Data Lake Storage Gen2 | Microsoft Docs
description: Need description here.
services: storage
author: normesta
manager: twooley
ms.component: data-lake-storage-gen2
ms.service: storage
ms.topic: conceptual
ms.date: 11/26/2018
ms.author: normesta

---
# Known issues with Azure Data Lake Storage Gen2

This article contains known issues and temporary limitations with Azure Data Lake Storage Gen2.

## API interoperability

Blob Storage APIs and Azure Data Lake Gen2 APIs aren't interoperable with each other.

Content that you upload by using Blob storage APIs, or by using features that call Blob storage APIs, won't be accessible to any code or features that call Azure Data Lake Gen2 APIs and the other way around.

If you want to use the same tool to work with all of the content that you upload to your account, then don't enable hierarchical namespaces on your Blob storage account until these APIs become interoperable with each other. Using a storage account without the hierarchical namespace means you then don't have access to Data Lake Storage Gen2 specific features, such as directory and filesystem access control lists.

## Blob storage APIs

Blob storage APIs aren't yet available to Azure Data Lake Storage Gen 2 accounts.

If you enable hierarchical namespaces on your storage account, then all Blob API operations for that storage account are disabled. These APIs have been disabled to prevent inadvertent data access issues that could arise because Blob Storage APIs aren't yet interoperable with Azure Data Lake Gen2 APIs.

Unmanaged Virtual Machine (VM) disks depend upon these API operations, so if you want to enable hierarchical namespaces on a storage account, consider placing unmanaged VM disks into a storage account that doesn't have hierarchical namespaces enabled.

To restore Blob API operations, just disable hierarchical namespace on the storage account.

## Azure Storage Explorer

Azure Storage Explorer has only limited support for Azure Data Lake Storage Gen2.

Some features in Storage Explorer don't yet work with Azure Data Lake Storage Gen2 file systems. These limitations apply to both the [stand-alone version](https://azure.microsoft.com/features/storage-explorer/) of Azure Storage Explorer as well as the version that appears in the Azure portal.

## Blob viewing tool

Blob viewing tool on Azure portal has only limited support for Azure Data Lake Storage Gen2

## Third-party applications

Third-party applications might not support Azure Data Lake Storage Gen2.

Support for Azure Data Lake Gen2 is at the discretion of each third-party application provider. Currently, Blob storage APIs and Azure Data Lake Storage Gen2 APIs can't be used to manage the same content. As we work to enable that interoperability, it's possible that many third-party tools will automatically support Azure Data Lake Storage Gen2.

## AzCopy support

AzCopy version 8 doesn’t support Azure Data Lake Storage Gen2.

Instead, use the latest preview version of AzCopy ( [AzCopy v10](https://docs.microsoft.com/azure/storage/common/storage-use-azcopy-v10?toc=%2fazure%2fstorage%2ftables%2ftoc.json) ). AzCopy V10 supports Azure Data Lake Storage Gen2 endpoints.

## OAuth authentication

Services such as Azure Databricks, HDInsight, and Azure Data Factory don't yet integrate with Azure Active Directory (Azure AD) OAuth bearer token authentication.

## Access control lists (ACL)

Directory and file-level access control lists (ACL) are difficult to manage. There's no UI-based tool that you can use to get and set those access control lists.

## Azure Event Grid

Azure Event Grid doesn't receive events from Azure Data Lake Gen2 accounts. Azure Data Lake Gen 2 accounts don't yet generate events so you can't use the [Azure Event Grid](https://azure.microsoft.com/services/event-grid/) to handle them.

## Role-based access control

Role-based access control can't be applied to Azure Data Lake Storage Gen2.

You can't apply Role-based access control to file system objects in an Azure Data Lake Storage Gen2 account.

## SQL Data Warehouse PolyBase

SQL Data Warehouse PolyBase can't access Storage accounts that have Storage firewalls enabled. 

When Storage Firewalls are enabled on an Azure Storage account, SQL Data Warehouse [Polybase](https://docs.microsoft.com/sql/relational-databases/polybase/polybase-guide?view=sql-server-2017) can't access those accounts.

## Soft delete and snapshots

Soft delete and snapshots aren't available for Azure Data Lake Storage Gen2 accounts.

All versioning features including [snapshots](https://docs.microsoft.com/rest/api/storageservices/creating-a-snapshot-of-a-blob) and [soft delete](https://docs.microsoft.com/azure/storage/blobs/storage-blob-soft-delete) aren't yet available for Storage accounts that have hierarchical namespaces enabled.

## Object level storage tiers

Object level storage tiers (Hot, Cold, and Archive) aren't yet available for Azure Data Lake Storage Gen 2 accounts, but they are available to Storage accounts that don't have hierarchical spaces enabled.

## Azure Blob Storage lifecycle management (Preview) policies

Azure Blob Storage lifecycle management (Preview) policies aren't yet available for Azure Data Lake Storage Gen2 accounts.

These policies are available to Storage accounts don't have hierarchical spaces enabled.

## Diagnostic logs

Diagnostic logs aren't available for Azure Data Lake Storage Gen2 accounts.

To request diagnostic logs, contact Azure Support. Provide them with your account name and the period of time for which you require logs.
