---
title: Mount an NFS Azure file share on Linux
description: Learn how to mount a Network File System (NFS) Azure file share on Linux.
author: khdownie
ms.service: storage
ms.topic: how-to
ms.date: 10/17/2022
ms.author: kendownie
ms.subservice: files
ms.custom: references_regions
---

# Mount NFS Azure file share on Linux

Azure file shares can be mounted in Linux distributions using either the Server Message Block (SMB) protocol or the Network File System (NFS) protocol. This article is focused on mounting with NFS. For details on mounting SMB Azure file shares, see [Use Azure Files with Linux](storage-how-to-use-files-linux.md). For details on each of the available protocols, see [Azure file share protocols](storage-files-planning.md#available-protocols).

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- [Create an NFS share](storage-files-how-to-create-nfs-shares.md).
- Open port 2049 on the client you want to mount your NFS share to.

    > [!IMPORTANT]
    > NFS shares can only be accessed from trusted networks. Connections to your NFS share must originate from one of the following sources:
- Use one of the following networking solutions:
    - Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

## Disable secure transfer

1. Sign in to the [Azure portal](https://portal.azure.com/) and access the storage account containing the NFS share you created.
1. Select **Configuration**.
1. Select **Disabled** for **Secure transfer required**.
1. Select **Save**.

    :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png" alt-text="Screenshot of storage account configuration screen with secure transfer disabled." lightbox="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png":::

## Mount an NFS share

1. Once the file share is created, select the share and select **Connect from Linux**.
1. Enter the mount path you'd like to use, then copy the script.
1. Connect to your client and use the provided mounting script.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/mount-nfs-file-share-script.png" alt-text="Screenshot of file share connect blade.":::

You have now mounted your NFS share.

### Validate connectivity

If your mount failed, it's possible that your private endpoint was not set up correctly or is inaccessible. For details on confirming connectivity, see the [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity) section of the networking endpoints article.

## Next steps

- Learn more about Azure Files with [Planning for an Azure Files deployment](storage-files-planning.md).
- If you experience any issues, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).
