---
title: Troubleshoot NFS file shares - Azure Files
description: Troubleshoot issues with NFS Azure file shares.
author: khdownie
ms.service: storage
ms.topic: troubleshooting
ms.date: 02/21/2023
ms.author: kendownie
ms.subservice: files
ms.custom: references_regions, devx-track-azurepowershell
---

# Troubleshoot NFS Azure file shares

This article lists common issues related to NFS Azure file shares and provides potential causes and workarounds.

> [!IMPORTANT]
> The content of this article only applies to NFS shares. To troubleshoot SMB issues in Linux, see [Troubleshoot Azure Files problems in Linux (SMB)](files-troubleshoot-linux-smb.md). NFS Azure file shares aren't supported for Windows.

## Applies to
| File share type | SMB | NFS |
|-|:-:|:-:|
| Standard file shares (GPv2), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Standard file shares (GPv2), GRS/GZRS | ![No](../media/icons/no-icon.png) | ![No](../media/icons/no-icon.png) |
| Premium file shares (FileStorage), LRS/ZRS | ![No](../media/icons/no-icon.png) | ![Yes](../media/icons/yes-icon.png) |

## chgrp "filename" failed: Invalid argument (22)

### Cause 1: idmapping isn't disabled
Because Azure Files disallows alphanumeric UID/GID, you must disable idmapping.

### Cause 2: idmapping was disabled, but got re-enabled after encountering bad file/dir name
Even if you correctly disable idmapping, it can be automatically re-enabled in some cases. For example, when Azure Files encounters a bad file name, it sends back an error. Upon seeing this error code, an NFS 4.1 Linux client decides to re-enable idmapping, and sends future requests with alphanumeric UID/GID. For a list of unsupported characters on Azure Files, see this [article](/rest/api/storageservices/naming-and-referencing-shares--directories--files--and-metadata). Colon is one of the unsupported characters.

### Workaround
Make sure you've disabled idmapping and that nothing is re-enabling it. Then perform the following steps:

- Unmount the share
- Disable idmapping with 
```bash
sudo echo Y > /sys/module/nfs/parameters/nfs4_disable_idmapping
```
- Mount the share back
- If running rsync, run rsync with the "—numeric-ids" argument from a directory that doesn't have a bad dir/file name.

## Unable to create an NFS share

### Cause 1: Unsupported storage account settings

NFS is only available on storage accounts with the following configuration:

- Tier - Premium
- Account Kind - FileStorage
- Regions - [List of supported regions](storage-files-how-to-create-nfs-shares.md?tabs=azure-portal#regional-availability)

#### Solution

Follow the instructions in [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

## Can't connect to or mount an NFS Azure file share

### Cause 1: Request originates from a client in an untrusted network/untrusted IP

Unlike SMB, NFS doesn't have user-based authentication. The authentication for a share is based on your network security rule configuration. To ensure that clients only establish secure connections to your NFS share, you must use either the service endpoint or private endpoints. To access shares from on-premises in addition to private endpoints, you must set up a VPN or ExpressRoute connection. IPs added to the storage account's allowlist for the firewall are ignored. You must use one of the following methods to set up access to an NFS share:


- [Service endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access)
    - Accessed by the public endpoint.
    - Only available in the same region.
    - You can't use VNet peering for share access.
    - You must add each virtual network or subnet individually to the allowlist.
    - For on-premises access, you can use service endpoints with ExpressRoute, point-to-site, and site-to-site VPNs. We recommend using a private endpoint because it's more secure.

The following diagram depicts connectivity using public endpoints.

:::image type="content" source="media/files-troubleshoot-linux-nfs/connectivity-using-public-endpoints.jpg" alt-text="Diagram of public endpoint connectivity." lightbox="media/files-troubleshoot-linux-nfs/connectivity-using-public-endpoints.jpg":::

- [Private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint)
    - Access is more secure than the service endpoint.
    - Access to NFS share via private link is available from within and outside the storage account's Azure region (cross-region, on-premises).
    - Virtual network peering with virtual networks hosted in the private endpoint give the NFS share access to the clients in peered virtual networks.
    - You can use private endpoints with ExpressRoute, point-to-site VPNs, and site-to-site VPNs.

:::image type="content" source="media/files-troubleshoot-linux-nfs/connectivity-using-private-endpoints.jpg" alt-text="Diagram of private endpoint connectivity." lightbox="media/files-troubleshoot-linux-nfs/connectivity-using-private-endpoints.jpg":::

### Cause 2: Secure transfer required is enabled

NFS Azure file shares don't currently support double encryption. Azure provides a layer of encryption for all data in transit between Azure datacenters using MACSec. You can only access NFS shares from trusted virtual networks and over VPN tunnels. No extra transport layer encryption is available on NFS shares.

#### Solution

Disable **secure transfer required** in your storage account's configuration blade.

:::image type="content" source="media/storage-files-how-to-mount-nfs-shares/disable-secure-transfer.png" alt-text="Screenshot of storage account configuration blade, disabling secure transfer required.":::

### Cause 3: nfs-utils, nfs-client or nfs-common package isn't installed
Before running the `mount` command, install the nfs-utils, nfs-client or the nfs-common package.

To check if the NFS package is installed, run:

# [RHEL](#tab/RHEL) 

Same commands on this section apply for CentOS and Oracle Linux.

```bash
sudo rpm -qa | grep nfs-utils
``` 
# [SLES](#tab/SLES) 

```bash
sudo rpm -qa | grep nfs-client
``` 
# [Ubuntu](#tab/Ubuntu)

Same commands on this section apply for Debian.
 
```bash
sudo dpkg -l | grep nfs-common
``` 
---

#### Solution

If the package isn't installed, install the package using your distro-specific command.

# [RHEL](#tab/RHEL) 

Same commands on this section apply for CentOS and Oracle Linux.

Os Version 7.X

```bash
sudo yum install nfs-utils
```
OS Version 8.X or 9.X

```bash
sudo dnf install nfs-utils
```

# [SLES](#tab/SLES)

```bash
sudo zypper install nfs-client
```

# [Ubuntu](#tab/Ubuntu)

Same commands on this section apply for Debian.

```bash
sudo apt update
sudo apt install nfs-common
```
---

### Cause 4: Firewall blocking port 2049

The NFS protocol communicates to its server over port 2049. Make sure that this port is open to the storage account (the NFS server).

#### Solution

Verify that port 2049 is open on your client by running the following command. If the port isn't open, open it.

```bash
sudo nc -zv <storageaccountnamehere>.file.core.windows.net 2049
```

## ls hangs for large directory enumeration on some kernels

### Cause: A bug was introduced in Linux kernel v5.11 and was fixed in v5.12.5.
Some kernel versions have a bug that causes directory listings to result in an endless READDIR sequence. Small directories where all entries can be shipped in one call don't have this problem.
The bug was introduced in Linux kernel v5.11 and was fixed in v5.12.5. So anything in between has the bug. RHEL 8.4 has this kernel version.

#### Workaround: Downgrade or upgrade the kernel
Downgrading or upgrading the kernel to anything outside the affected kernel should resolve the issue.

## Need help?
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.

## See also
- [Troubleshoot Azure Files](files-troubleshoot.md)
- [Troubleshoot Azure Files performance](files-troubleshoot-performance.md)
- [Troubleshoot Azure Files connectivity (SMB)](files-troubleshoot-smb-connectivity.md)
- [Troubleshoot Azure Files authentication and authorization (SMB)](files-troubleshoot-smb-authentication.md)
- [Troubleshoot Azure Files general SMB issues on Linux](files-troubleshoot-linux-smb.md)
