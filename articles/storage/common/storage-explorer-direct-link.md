---
title: Azure Storage Explorer direct link
description: Documentation of Azure Storage Explorer direct link
services: storage
author: JasonYeMSFT
ms.service: azure-storage
ms.subservice: storage-common-concepts
ms.topic: article
ms.date: 02/24/2021
ms.author: chuye
---

# Azure Storage Explorer direct link

On Windows and macOS, Storage Explorer supports URIs with the `storageexplorer://` protocol. These URIs are referred to as direct links. A direct link points to an Azure Storage resource in Storage Explorer. Following a direct link will open Storage Explorer and navigate to the resource it points to. This article describes how direct links work and how you can use them.

## How direct links work

Storage Explorer uses the tree view to visualize resources in Azure. A direct link contains the hierarchical information for the linked resource node in the tree. When a direct link is followed, Storage Explorer opens and receives the parameters in the direct link. Storage Explorer then uses these parameters to navigate to the linked resource in the tree view.

> [!IMPORTANT]
> You must be signed in and have the necessary permissions to access the linked resource for a direct link to work.

## Parameters

A Storage Explorer direct link always starts with protocol `storageexplorer://`. The following table explains each of the possible parameters in a direct link.

Parameter | Description
:---------| :---------
`v`         | Version of the direct link protocol.
`accountid` | The Azure Resource Manager resource ID of the storage account for the linked resource. If the linked resource is a storage account, this ID will be the Azure Resource Manager resource ID of that storage account. Otherwise, this ID will be the Azure Resource Manager resource ID of the storage account the linked resource belongs to.
`resourcetype` | Optional. Only used when the linked resource is a blob container, a file share, a queue, or a table. Must be either one of "Azure.BlobContainer", "Azure.FileShare", "Azure.Queue", "Azure.Table".
`resourcename` | Optional. Only used when the linked resource is a blob container, a file share, a queue, or a table. The name of the linked resource.

Here is an example direct link to a blob container. 
`storageexplorer://v=1&accountid=/subscriptions/the_subscription_id/resourceGroups/the_resource_group_name/providers/Microsoft.Storage/storageAccounts/the_storage_account_name&subscriptionid=the_subscription_id&resourcetype=Azure.BlobContainer&resourcename=the_blob_container_name`

## Get a direct link from Storage Explorer

You can use Storage Explorer to get a direct link for a resource. Open the context menu of the node for the resource in the tree view. Then use the "Copy Direct Link" action to copy its direct link to the clipboard.

## Direct link limitations

Direct links are only supported for resources under subscription nodes. Additionally, only the following resource types are supported:

- Storage Accounts
- Blob Containers
- Queues
- File Shares
- Tables
