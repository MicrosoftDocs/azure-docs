---
title: Manage blob containers using the Azure Portal
titleSuffix: Azure Storage
description: Learn how to manage Azure storage containers using the Azure portal
services: storage
author: stevenmatthew

ms.service: storage
ms.topic: how-to
ms.date: 03/17/2022
ms.author: shaas
ms.subservice: blobs
---

# Manage blob containers using the Azure portal

Azure blob storage allows you to store large amounts of unstructured object data. You can use blob storage to gather or expose media, content, or application data to users. Because all blob data is stored within containers, you must create a storage container before you can begin to upload data. To learn more about blob storage, read the [Introduction to Azure Blob storage](storage-blobs-introduction.md).

In this how-to article, you learn to use the Azure portal to work with container objects.

## Prerequisites

To access Azure Storage, you'll need an Azure subscription. If you don't already have a subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

All access to Azure Storage takes place through a storage account. For this how-to, create a storage account using the [Azure portal](https://portal.azure.com/), Azure PowerShell, or Azure CLI. For help creating a storage account, see [Create a storage account](../articles/storage/common/storage-account-create.md).

## Create a container

To create a container in the Azure portal, follow these steps:

1. Navigate to a storage account in the [Azure portal](https://portal.azure.com). If the portal menu isn't visible, click the menu button to toggle its visibility.
:::image type="content" source="media/blob-containers-portal/menu-expand-sml.png" alt-text="Image of the Azure Portal homepage showing the location of the Menu button near the top left corner of the browser" lightbox="media/storage-account-create/menu-expand-lrg.png":::
1. In the left menu for the storage account, scroll to the **Data storage** section, then select **Containers**.
1. Select the **+ Container** button.
1. Type a name for your new container. The container name must be lowercase, must start with a letter or number, and can include only letters, numbers, and the dash (-) character. For more information about container and blob names, see [Naming and referencing containers, blobs, and metadata](/rest/api/storageservices/naming-and-referencing-containers--blobs--and-metadata).
1. Set the level of public access to the container. The default level is **Private (no anonymous access)**.
1. Select **Create** to create the container.
:::image type="content" source="media/blob-containers-portal/create-container-sml.png" alt-text="Screenshot showing how to create a container in the Azure portal" lightbox="media/storage-quickstart-blobs-portal/create-container-lrg.png":::
