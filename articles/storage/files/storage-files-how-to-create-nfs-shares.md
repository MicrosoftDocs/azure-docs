---
title: Create an NFS Azure file share
description: Learn how to create an Azure file share that can be mounted using the Network File System protocol.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 09/09/2020
ms.author: rogarana
ms.subservice: files
---

# How to create an NFS share

Azure file shares are fully managed file shares that live in the cloud. They can be accessed using either the Server Message Block protocol or the Network File System (NFS) protocol. This article covers creating a file share that uses the NFS protocol. For more information on both protocols, see [Azure file share protocols](storage-files-compare-protocols.md).

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- Create a [FileStorage account](storage-how-to-create-premium-fileshare.md).

> [!IMPORTANT]
> Since encryption-in-transit is not currently available with NFS shares, we recommend disabling your storage account's public endpoint and configuring private endpoints, to ensure your data is secure and only accessible via your network.

- Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

## Create an NFS share

Now that you have created a FileStorage account and configured the networking, you can create an NFS file share. The process is similar to creating an SMB share, you select **NFS** instead of **SMB** when creating the share.

1. Navigate to your storage account and select **File shares**.
1. Select **+ File share** to create a new file share.
1. Name your file share, select a provisioned capacity.
1. For **Protocol** select **NFS (preview)**.
1. For **Root Squash** make a selection.
1. Select **Create**.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/create-nfs-file-share.png" alt-text="Screenshot of file share creation blade":::

## Next steps

Now that you've created an NFS share, to use it you have to mount it to your VM. For details, see [How to mount an NFS share](storage-files-how-to-mount-nfs-shares.md).