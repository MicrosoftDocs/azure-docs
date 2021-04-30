---
title: Mount an Azure NFS file share - Azure Files
description: Learn how to mount a Network File System share.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 04/15/2021
ms.author: rogarana
ms.subservice: files
ms.custom: references_regions
---

# How to mount an NFS file share

[Azure Files](storage-files-introduction.md) is Microsoft's easy to use cloud file system. Azure file shares can be mounted in Linux distributions using either the Server Message Block protocol (SMB) or the Network File System (NFS) protocol. This article is focused on mounting with NFS, for details on mounting with SMB, see [Use Azure Files with Linux](storage-how-to-use-files-linux.md). For details on each of the available protocols, see [Azure file share protocols](storage-files-compare-protocols.md).

## Limitations

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- [Create an NFS share](storage-files-how-to-create-nfs-shares.md).

    > [!IMPORTANT]
    > NFS shares can only be accessed from trusted networks. Connections to your NFS share must originate from one of the following sources:

- Use one of the following networking solutions:
    - Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

## Disable secure transfer

1. Sign in to the Azure portal and access the storage account containing the NFS share you created.
1. Select **Configuration**.
1. Select **Disabled** for **Secure transfer required**.
1. Select **Save**.

    :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/storage-account-disable-secure-transfer.png" alt-text="Screenshot of storage account configuration screen with secure transfer disabled.":::

## Mount an NFS share

1. Once the file share is created, select the share and select **Connect from Linux**.
1. Enter the mount path you'd like to use, then copy the script.
1. Connect to your client and use the provided mounting script.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/mount-nfs-file-share-script.png" alt-text="Screenshot of file share connect blade.":::

You have now mounted your NFS share.

### Validate connectivity

If your mount failed, it's possible that your private endpoint was not setup correctly or is inaccessible. For details on confirming connectivity, see the [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity) section of the networking endpoints article.

## Next steps

- Learn more about Azure Files with our article, [Planning for an Azure Files deployment](storage-files-planning.md).
- If you experience any issues, see [Troubleshoot Azure NFS file shares](storage-troubleshooting-files-nfs.md).