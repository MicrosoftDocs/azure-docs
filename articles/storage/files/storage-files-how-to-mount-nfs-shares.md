---
title: Mount an NFS Azure file share on Linux
description: Learn how to mount a Network File System (NFS) Azure file share on Linux.
author: khdownie
ms.service: azure-file-storage
ms.topic: how-to
ms.date: 02/06/2023
ms.author: kendownie
ms.custom: references_regions
---

# Mount NFS Azure file share on Linux

Azure file shares can be mounted in Linux distributions using either the Server Message Block (SMB) protocol or the Network File System (NFS) protocol. This article is focused on mounting with NFS. For details on mounting SMB Azure file shares, see [Use Azure Files with Linux](storage-how-to-use-files-linux.md). For details on each of the available protocols, see [Azure file share protocols](storage-files-planning.md#available-protocols).

## Support

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

### Regional availability

[!INCLUDE [files-nfs-regional-availability](../../../includes/files-nfs-regional-availability.md)]

## Prerequisites

- [Create an NFS share](storage-files-how-to-create-nfs-shares.md).
- Open port 2049 on the client you want to mount your NFS share to.

    > [!IMPORTANT]
    > NFS shares can only be accessed from trusted networks.

- Either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).
- To enable hybrid access to an NFS Azure file share, use one of the following networking solutions:
    - [Configure a Point-to-Site (P2S) VPN on Linux for use with Azure Files](storage-files-configure-p2s-vpn-linux.md).
    - [Configure a Site-to-Site VPN for use with Azure Files](storage-files-configure-s2s-vpn.md).
    - Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

## Disable secure transfer

1. Sign in to the [Azure portal](https://portal.azure.com/) and access the storage account containing the NFS share you created.
1. Select **Configuration**.
1. Select **Disabled** for **Secure transfer required**.
1. Select **Save**.

    :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png" alt-text="Screenshot of storage account configuration screen with secure transfer disabled." lightbox="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png":::

## Mount an NFS share using the Azure portal

> [!NOTE]
> You can use the `nconnect` Linux mount option to improve performance for NFS Azure file shares at scale. For more information, see [Improve NFS Azure file share performance](nfs-performance.md).

1. Once the file share is created, select the share and select **Connect from Linux**.
1. Enter the mount path you'd like to use, then copy the script.
1. Connect to your client and use the provided mounting script.

    :::image type="content" source="media/storage-files-how-to-create-mount-nfs-shares/mount-nfs-file-share-script.png" alt-text="Screenshot of file share connect blade.":::

You have now mounted your NFS share.

## Mount an NFS share using /etc/fstab

If you want the NFS file share to automatically mount every time the Linux server or VM boots, create a record in the **/etc/fstab** file for your Azure file share. Replace `YourStorageAccountName` and `FileShareName` with your information.

```bash
<YourStorageAccountName>.file.core.windows.net:/<YourStorageAccountName>/<FileShareName> /mount/<YourStorageAccountName>/<FileShareName> nfs vers=4,minorversion=1,sec=sys 0 0
```

For more information, enter the command `man fstab` from the Linux command line.

### Validate connectivity

If your mount failed, it's possible that your private endpoint wasn't set up correctly or isn't accessible. For details on confirming connectivity, see [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity).

## Next steps

- Learn more about Azure Files with [Planning for an Azure Files deployment](storage-files-planning.md).
- If you experience any issues, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json).
