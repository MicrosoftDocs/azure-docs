---
title: Mount an NFS Azure file share on Linux
description: Learn how to mount a Network File System (NFS) Azure file share on Linux, including configuring network security and mount options.
author: khdownie
ms.service: azure-file-storage
ms.custom: linux-related-content, references_regions
ms.topic: how-to
ms.date: 07/02/2025
ms.author: kendownie
# Customer intent: As a Linux system administrator, I want to mount an NFS Azure file share, so that I can securely access and manage data stored in Azure from my Linux environment.
---

# Mount NFS Azure file shares on Linux

Azure file shares can be mounted in Linux distributions using either the Server Message Block (SMB) protocol or the Network File System (NFS) protocol. This article is focused on mounting with NFS. For details on mounting SMB file shares, see [Use Azure Files with Linux](storage-how-to-use-files-linux.md). For details on each of the available protocols, see [Azure file share protocols](storage-files-planning.md#available-protocols).

## Applies to
| Management model | Billing model | Media tier | Redundancy | SMB | NFS |
|-|-|-|-|:-:|:-:|
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | Geo (GRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v2 | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Provisioned v1 | SSD (premium) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Local (LRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Zone (ZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | Geo (GRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Microsoft.Storage | Pay-as-you-go | HDD (standard) | GeoZone (GZRS) | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |

## Support

[!INCLUDE [files-nfs-limitations](../../../includes/files-nfs-limitations.md)]

## Regional availability

NFS file shares are supported in all the same regions that support SSD file shares. See [Azure Files redundancy support for SSD file shares](./redundancy-premium-file-shares.md).

## Step 1: Configure network security

NFS file shares can only be accessed from trusted networks. Currently, the only way to secure the data in your storage account is by using a virtual network and other network security settings. Any other tools used to secure data, including account key authorization, Microsoft Entra security, and access control lists (ACLs) can't be used to authorize an NFSv4.1 request.

> [!IMPORTANT]
> The NFSv4.1 protocol runs on port 2049. If you're connecting from an on-premises network, make sure that your client allows outgoing communication through port 2049. If you grant access to specific VNets, make sure that any network security groups associated with those VNets don't contain security rules that block incoming communication through port 2049.

### Create a private endpoint or service endpoint

To use NFS Azure file shares, you must either [create a private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint) (recommended) or [restrict access to your public endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access).

### Enable hybrid access through VPN or ExpressRoute (optional)

To enable hybrid access to an NFS Azure file share, use one of the following networking solutions:

- [Configure a Point-to-Site (P2S) VPN](storage-files-configure-p2s-vpn-linux.md).
- [Configure a Site-to-Site (S2S) VPN](storage-files-configure-s2s-vpn.md).
- Configure [ExpressRoute](../../expressroute/expressroute-introduction.md).

## Step 2: Mount an NFS Azure file share

You can mount the share using the AZNFS mount helper in Azure portal, or you can use the native NFS mount commands in CLI. You can also create a record in the **/etc/fstab** file to automatically mount the share every time the Linux server or VM boots.

You can use the `nconnect` Linux mount option to improve performance for NFS Azure file shares at scale. For more information, see [Improve NFS Azure file share performance](nfs-performance.md#nfs-nconnect).

### Mount an NFS share using the Azure portal (Recommended)

1. Once the file share is created, select the share and then select **Connect from Linux**.
2. Enter the mount path you'd like to use, then copy the script and run it on your client. Azure portal offers a step-by-step, ready-to-use installation script tailored to your selected Linux distribution for installing the AZNFS mount helper package and to securely mount the share using [Encyption in Transit](encryption-in-transit-for-nfs-shares.md). Only the required mount options are included in the script, but you can add other [recommended mount options](#mount-options).

   :::image type="content" source="media/storage-files-how-to-mount-nfs-shares/mount-file-share.png" alt-text="Screenshot showing how to connect to an N F S file share from Linux using a provided mounting script." lightbox="media/storage-files-how-to-mount-nfs-shares/mount-file-share.png" border="true":::

The NFS file share is now mounted.

### Mount an NFS share using the NFS client mount in command line

Alternatively, you can also mount the Azure file share using NFS client mount in command line. Select the tab below for your Linux distribution to see the commands you need to run. Be sure to replace `<YourStorageAccountName>` and `<FileShareName>` with your information.

# [Ubuntu/Debian](#tab/Ubuntu)
```bash
sudo apt-get -y update
sudo apt-get install nfs-common
 
/mount/<YourStorageAccountName>/<FileShareName>
 
sudo mkdir -p /mount/<YourStorageAccountName>/<FileShareName>
sudo mount -t nfs <YourStorageAccountName>.file.core.windows.net:/<YourStorageAccountName>/<FileShareName> /mount/<YourStorageAccountName>/<FileShareName> -o vers=4,minorversion=1,sec=sys,nconnect=4
```

# [RHEL/CentOS](#tab/RHEL)
```bash
sudo yum update
sudo yum install nfs-utils
 
/mount/<YourStorageAccountName>/<FileShareName>
 
sudo mkdir -p /mount/<YourStorageAccountName>/<FileShareName>
sudo mount -t nfs <YourStorageAccountName>.file.core.windows.net:/<YourStorageAccountName>/<FileShareName> /mount/<YourStorageAccountName>/<FileShareName> -o vers=4,minorversion=1,sec=sys,nconnect=4
```

### [SUSE](#tab/SUSE)
```bash
sudo zypper update
sudo zypper -n install nfs-client
 
/mount/<YourStorageAccountName>/<FileShareName>
 
sudo mkdir -p /mount/<YourStorageAccountName>/<FileShareName>
sudo mount -t nfs <YourStorageAccountName>.core.windows.net:/<YourStorageAccountName>/<FileShareName> /mount/<YourStorageAccountName>/<FileShareName> -o vers=4,minorversion=1,sec=sys,nconnect=4
```
---

### Mount an NFS share using /etc/fstab

If you want the NFS file share to automatically mount every time the Linux server or VM boots, create a record in the **/etc/fstab** file for your Azure file share. Replace `YourStorageAccountName` and `FileShareName` with your information.

```bash
<YourStorageAccountName>.file.core.windows.net:/<YourStorageAccountName>/<FileShareName> /media/<YourStorageAccountName>/<FileShareName> nfs vers=4,minorversion=1,_netdev,nofail,sec=sys 0 0
```

For more information, enter the command `man fstab` from the Linux command line.

### Mount options

The following mount options are recommended or required when mounting NFS Azure file shares.

| **Mount option** | **Recommended value** | **Description** |
|******************|***********************|*****************|
| `vers` | 4 | Required. Specifies which version of the NFS protocol to use. Azure Files only supports NFSv4.1. |
| `minorversion` | 1 | Required. Specifies the minor version of the NFS protocol. Some Linux distros don't recognize minor versions on the `vers` parameter. So instead of `vers=4.1`, use `vers=4,minorversion=1`. |
| `sec` | sys | Required. Specifies the type of security to use when authenticating an NFS connection. Setting `sec=sys` uses the local UNIX UIDs and GIDs that use AUTH_SYS to authenticate NFS operations. |
| `rsize` | 1048576 | Recommended. Sets the maximum number of bytes to be transferred in a single NFS read operation. Specifying the maximum level of 1,048,576 bytes usually results in the best performance. |
| `wsize` | 1048576 | Recommended. Sets the maximum number of bytes to be transferred in a single NFS write operation. Specifying the maximum level of 1,048,576 bytes usually results in the best performance. |
| `noresvport` | n/a | Recommended for kernels below 5.18. Tells the NFS client to use a nonprivileged source port when communicating with an NFS server for the mount point. Using the `noresvport` mount option helps ensure that your NFS share has uninterrupted availability after a reconnection. Using this option is recommended for achieving high availability. |
| `actimeo` | 30-60 | Recommended. Specifying `actimeo` sets all of `acregmin`, `acregmax`, `acdirmin`, and `acdirmax` to the same value. Using a value lower than 30 seconds can cause performance degradation because attribute caches for files and directories expire too quickly. We recommend setting `actimeo` between 30 and 60 seconds. |
| `nconnect` | 4 | Recommended. Nconnect increases performance by using multiple TCP connections between the client and your NFS share. We recommend configuring the mount options with the optimal setting of nconnect=4. Currently, there are no gains beyond four channels for the Azure Files implementation of nconnect. |
| `clean` | n/a | A non-TLS mount might fail if a prior TLS mount to the same server ended abruptly, leaving stale entries. To resolve this issue, remount the share using the `clean` option, which immediately clears any stale entries. This applies only for AZNFS mount. |

## Step 3: Validate connectivity

If your mount fails, it's possible that your private endpoint wasn't set up correctly or isn't accessible. For details on confirming connectivity, see [Verify connectivity](storage-files-networking-endpoints.md#verify-connectivity).

## NFS file share snapshots

Customers using NFS Azure file shares can take file share snapshots. This capability allows users to roll back entire file systems or recover files that were accidentally deleted or corrupted. See [Use share snapshots with Azure Files](storage-snapshots-files.md#nfs-file-share-snapshots).

## Next step

- If you experience any issues, see [Troubleshoot NFS Azure file shares](/troubleshoot/azure/azure-storage/files-troubleshoot-linux-nfs?toc=/azure/storage/files/toc.json).
