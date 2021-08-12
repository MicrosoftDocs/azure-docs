---
title: Troubleshoot Azure NFS file share problems - Azure Files
description: Troubleshoot Azure NFS file share problems.
author: jeffpatt24
ms.service: storage
ms.topic: troubleshooting
ms.date: 09/15/2020
ms.author: jeffpatt
ms.subservice: files
ms.custom: references_regions, devx-track-azurepowershell
---

# Troubleshoot Azure NFS file share problems

This article lists some common problems related to Azure NFS file shares (preview). It provides potential causes and workarounds when these problems are encountered. Also, this article also covers known issues in public preview.

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
Check that idmapping is disabled and nothing is re-enabling it, then perform the following:

- Unmount the share
- Disable id-mapping with # echo Y > /sys/module/nfs/parameters/nfs4_disable_idmapping
- Mount the share back
- If running rsync, run rsync with “—numeric-ids” argument from directory which do not have any bad dir/file name.

## Unable to create an NFS share

### Cause 1: Subscription is not enabled

Your subscription may not have been registered for the Azure Files NFS preview. You will need to run a few more commandlets from either Cloud Shell or a local terminal to enable the feature.

> [!NOTE]
> You may have to wait up to 30 minutes for the registration to complete.


#### Solution

Use the following script to register the feature and resource provider, replace `<yourSubscriptionIDHere>` before running the script:

```azurepowershell
Connect-AzAccount

#If your identity is associated with more than one subscription, set an active subscription
$context = Get-AzSubscription -SubscriptionId <yourSubscriptionIDHere>
Set-AzContext $context

Register-AzProviderFeature -FeatureName AllowNfsFileShares -ProviderNamespace Microsoft.Storage

Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

### Cause 2: Unsupported storage account settings

NFS is only available on storage accounts with the following configuration:

- Tier - Premium
- Account Kind - FileStorage
- Regions - [List of supported regions](./storage-files-how-to-create-nfs-shares.md?tabs=azure-portal#regional-availability)

#### Solution

Follow the instructions in our article: [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

### Cause 3: The storage account was created prior to registration completing

In order for a storage account to use the feature, it must be created once the subscription has completed registration for NFS. It may take up to 30 minutes for registration to complete.

#### Solution

Once registration completes, follow the instructions in our article: [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

## Cannot connect to or mount an Azure NFS file share

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
    - Access to NFS share via private link is available from within and outside the storage account's Azure region (cross-region, on-premise)
    - Virtual network peering with virtual networks hosted in the private endpoint give NFS share access to the clients in peered virtual networks.
    - Private endpoints can be used with ExpressRoute, point-to-site, and site-to-site VPNs.

:::image type="content" source="media/storage-troubleshooting-files-nfs/connectivity-using-private-endpoints.jpg" alt-text="Diagram of private endpoint connectivity." lightbox="media/storage-troubleshooting-files-nfs/connectivity-using-private-endpoints.jpg":::

### Cause 2: Secure transfer required is enabled

Double encryption is not supported for NFS shares yet. Azure provides a layer of encryption for all data in transit between Azure datacenters using MACSec. NFS shares can only be accessed from trusted virtual networks and over VPN tunnels. No additional transport layer encryption is available on NFS shares.

#### Solution

Disable secure transfer required in your storage account's configuration blade.

:::image type="content" source="media/storage-files-how-to-mount-nfs-shares/storage-account-disable-secure-transfer.png" alt-text="Screenshot of storage account configuration blade, disabling secure transfer required.":::

### Cause 3: nfs-common package is not installed
Before running the mount command, install the package by running the distro-specific command from below.

To check if the NFS package is installed, run: `rpm qa | grep nfs-utils`

#### Solution

If the package is not installed, install the package on your distribution.

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

Verify that port 2049 is open on your client by running the following command: `telnet <storageaccountnamehere>.file.core.windows.net 2049`. If the port is not open, open it.

## ls (list files) command shows incorrect/inconsistent results

### Cause: Inconsistency between cached values and server file metadata values when the file handle is open
Sometimes the "list files" or "df" or "find" command displays a non-zero size as expected and in the very next list files command instead shows size 0 or an old time stamp. This is a known issue due to inconsistent caching of file metadata values while the file is open. You may use one of the following workarounds to resolve this:

#### Workaround 1: For fetching file size, use wc -c instead of ls -l
Using wc -c will always fetch the latest value from the server and won't have any inconsistency.

#### Workaround 2: Use "noac" mount flag
Remount the file system using the "noac" flag with your mount command. This will always fetch all the metadata values from the server. There may be some minor perf overhead for all metadata operations if this workaround is used.


## Unable to mount an NFS share that is restored back from soft-deleted state
There is a known issue during preview where NFS shares gets soft deleted despite the platform not fully supporting it. These shares will routinely get deleted upon its expiration. You can also early-delete them by "undelete share + disable soft-delete + delete share" flow. However, if you try to recover and use the shares, you will get access denied or permission denied or NFS I/O error on the client.

## ls –la throws I/O error

### Cause: A known bug that has been fixed in newer Linux Kernel
On older kernels, NFS4ERR_NOT_SAME causes the client to stop enumerating (instead of restarting for the directory). Newer kernels would be unblocked right away, unfortunately, for distros like SUSE, there is no patch for SUSE Enterprise Linux Server 12 or 15 that would bring the kernel-up-to-date to this fix.  The patch is available in kernel 5.12+.  The patch for the client-side fix is described here [PATCH v3 15/17 NFS: Handle NFS4ERR_NOT_SAME and NFSERR_BADCOOKIE from readdir calls](https://www.spinics.net/lists/linux-nfs/msg80096.html).

#### Workaround: Use latest kernel workaround while the fix reaches the region hosting your storage account
The patch is available in kernel 5.12+.

## df and find command shows inconsistent results on clients other than where the writes happen
This is a known issue. Microsoft is actively working to resolve it.

## Application fails with error "Underlying file changed by an external force" when using exclusive OPEN 
This is a known issue. Microsoft is actively working to resolve it.

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.
