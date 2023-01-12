---
title: Troubleshoot NFS file share problems - Azure Files
description: Troubleshoot NFS Azure file share problems.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 05/25/2022
ms.author: kendownie
ms.subservice: files
ms.custom: references_regions, devx-track-azurepowershell
---

# Troubleshoot NFS Azure file share problems

This article lists some common problems and known issues related to NFS Azure file shares. It provides potential causes and workarounds when these problems are encountered.

> [!IMPORTANT]
> NFS Azure file shares are not supported for Windows clients.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## chgrp "filename" failed: Invalid argument (22)

### Cause 1: idmapping is not disabled
Azure Files disallows alphanumeric UID/GID. So idmapping must be disabled. 

### Cause 2: idmapping was disabled, but got re-enabled after encountering bad file/dir name
Even if idmapping has been correctly disabled, the settings for disabling idmapping gets overridden in some cases. For example, when the Azure Files encounters a bad file name, it sends back an error. Upon seeing this particular error code, NFS v 4.1 Linux client decides to re-enable idmapping and the future requests are sent again with alphanumeric UID/GID. For a list of unsupported characters on Azure Files, see this [article](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata). Colon is one of the unsupported characters. 

### Workaround
Check that idmapping is disabled and nothing is re-enabling it, then perform the following steps:

- Unmount the share
- Disable idmapping with # echo Y > /sys/module/nfs/parameters/nfs4_disable_idmapping
- Mount the share back
- If running rsync, run rsync with the "—numeric-ids" argument from a directory that does not have a bad dir/file name.

## Unable to create an NFS share

### Cause 1: Unsupported storage account settings

NFS is only available on storage accounts with the following configuration:

- Tier - Premium
- Account Kind - FileStorage
- Regions - [List of supported regions](./storage-files-how-to-create-nfs-shares.md?tabs=azure-portal#regional-availability)

#### Solution

Follow the instructions in our article: [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

## Cannot connect to or mount an NFS Azure file share

### Cause 1: Request originates from a client in an untrusted network/untrusted IP

Unlike SMB, NFS does not have user-based authentication. The authentication for a share is based on your network security rule configuration. Due to this, to ensure only secure connections are established to your NFS share, you must use either the service endpoint or private endpoints. To access shares from on-premises in addition to private endpoints, you must set up VPN or ExpressRoute. IPs added to the storage account's allowlist for the firewall are ignored. You must use one of the following methods to set up access to an NFS share:


- [Service endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access)
    - Accessed by the public endpoint
    - Only available in the same region.
    - VNet peering won't give access to your share.
    - Each virtual network or subnet must be individually added to the allowlist.
    - For on-premises access, service endpoints can be used with ExpressRoute, point-to-site, and site-to-site VPNs but, we recommend using private endpoint since it is more secure.

The following diagram depicts connectivity using public endpoints.

:::image type="content" source="media/storage-troubleshooting-files-nfs/connectivity-using-public-endpoints.jpg" alt-text="Diagram of public endpoint connectivity." lightbox="media/storage-troubleshooting-files-nfs/connectivity-using-public-endpoints.jpg":::

- [Private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint)
    - Access is more secure than the service endpoint.
    - Access to NFS share via private link is available from within and outside the storage account's Azure region (cross-region, on-premises)
    - Virtual network peering with virtual networks hosted in the private endpoint give NFS share access to the clients in peered virtual networks.
    - Private endpoints can be used with ExpressRoute, point-to-site, and site-to-site VPNs.

:::image type="content" source="media/storage-troubleshooting-files-nfs/connectivity-using-private-endpoints.jpg" alt-text="Diagram of private endpoint connectivity." lightbox="media/storage-troubleshooting-files-nfs/connectivity-using-private-endpoints.jpg":::

### Cause 2: Secure transfer required is enabled

Double encryption isn't supported for NFS shares yet. Azure provides a layer of encryption for all data in transit between Azure datacenters using MACSec. NFS shares can only be accessed from trusted virtual networks and over VPN tunnels. No additional transport layer encryption is available on NFS shares.

#### Solution

Disable secure transfer required in your storage account's configuration blade.

:::image type="content" source="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png" alt-text="Screenshot of storage account configuration blade, disabling secure transfer required.":::

### Cause 3: nfs-common package is not installed
Before running the mount command, install the package by running the distro-specific command from below.

To check if the NFS package is installed, run: `rpm qa | grep nfs-utils`

#### Solution

If the package isn't installed, install the package on your distribution.

##### Ubuntu or Debian

```
sudo apt update
sudo apt install nfs-common
```
##### Fedora, Red Hat Enterprise Linux 8+, CentOS 8+

Use the dnf package manager:`sudo dnf install nfs-utils`.

Older versions of Red Hat Enterprise Linux and CentOS use the yum package manager: `sudo yum install nfs-common`.

##### openSUSE

Use the zypper package manager: `sudo zypper install-nfscommon`.

### Cause 4: Firewall blocking port 2049

The NFS protocol communicates to its server over port 2049, make sure that this port is open to the storage account (the NFS server).

#### Solution

Verify that port 2049 is open on your client by running the following command: `telnet <storageaccountnamehere>.file.core.windows.net 2049`. If the port isn't open, open it.

## ls hangs for large directory enumeration on some kernels

### Cause: A bug was introduced in Linux kernel v5.11 and was fixed in v5.12.5.  
Some kernel versions have a bug that causes directory listings to result in an endless READDIR sequence. Very small directories where all entries can be shipped in one call won't have the problem.
The bug was introduced in Linux kernel v5.11 and was fixed in v5.12.5. So anything in between has the bug. RHEL 8.4 is known to have this kernel version.

#### Workaround: Downgrading or upgrading the kernel
Downgrading or upgrading the kernel to anything outside the affected kernel will resolve the issue

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
