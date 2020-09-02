---
title: Mount an Azure NFS file share
description: How to mount a network file system share
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 09/02/2020
ms.author: rogarana
ms.subservice: files
---

# How to create an NFS share

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

You must have already created a virtual machine and a virtual network.

- [Create an NFS share](storage-files-how-to-create-nfs-shares.md).

> [!IMPORTANT]
> Since encryption-in-transit is not currently available with NFS shares, we recommend disabling your storage account's public endpoint and configuring private endpoints, to ensure your data is secure and only accessible via your network.

- Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

## Disable secure transfer

1. Sign in to the Azure portal and access the storage account containing the NFS share you created.
1. Select **Configuration**.
1. For **Secure transfer required** select **Disabled**.
1. Select **Save**.

    :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/storage-account-disable-secure-transfer.png" alt-text="Screenshot of storage account configuration screen with secure transfer disabled.":::

## Mount an NFS share

1. Once the file share is created, select the share and select **Connect from Linux**.
1. Enter the mount path you'd like to use, then copy the script.
1. Remote into your VM and use the provided mounting script.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/mount-nfs-file-share-script.png" alt-text="Screenshot of file share connect blade":::

You have now mounted your NFS share to your VM.

## Next steps

