---
title: Troubleshoot Azure NFS file share problems - Azure Files
description: Troubleshoot Azure NFS file share problems.
author: jeffpatt24
ms.service: storage
ms.topic: troubleshooting
ms.date: 09/15/2020
ms.author: jeffpatt
ms.subservice: files
ms.custom: references_regions
---

# Troubleshoot Azure NFS file shares

This article lists some common problems related to Azure NFS file shares. It provides potential causes and workarounds when these problems are encountered.

## Unable to create an NFS share

### Cause 1: Subscription is not enabled

Your subscription may not have been registered for the Azure Files NFS preview. You will need to run a few additional commandlets from either Cloud Shell or a local terminal to enable the feature.

> [!NOTE]
> You may have to wait up to 30 minutes for the registration to complete.


#### Solution

Use the following script to register the feature and resource provider, replace `<yourSubscriptionIDHere>` before running the script:

```azurepowershell
Connect-AzAccount

#If your identity is associated with more than one subscription, set an active subscription
$context = Get-AzSubscription -SubscriptionId <yourSubscriptionIDHere>
Set-AzContext $context

Register-AzProviderFeature -FeatureName AllowNfsFileShares - ProviderNamespace Microsoft.Storage

Register-AzResourceProvider -ProviderNamespace Microsoft.Storage
```

### Cause 2: Unsupported storage account settings

NFS is only available on storage accounts with the following configuration:

- Tier - Premium
- Account Kind - FileStorage
- Redundancy - LRS
- Regions - East US, East US 2, UK South, SouthEast Asia

#### Solution

Follow the instructions in our article: [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

### Cause 3: The storage account was created prior to registration completing

In order for a storage account to use the feature, it must be created once the subscription has completed registration for NFS. It may take up to 30 minutes for registration to complete.

#### Solution

Once registration completes, follow the instructions in our article: [How to create an NFS share](storage-files-how-to-create-nfs-shares.md).

## Cannot connect to or mount an Azure NFS file share

### Cause 1: Request originates from a client in an untrusted network/untrusted IP

Unlike SMB, NFS does not have user-based authentication. The authentication for a share is based on your network security rule configuration. Due to this, to ensure only secure connections are established to your NFS share, you must use either the service endpoint or private endpoints. To access shares from on-premises in addition to private endpoints, you must set up VPN or ExpressRoute. IPs added to the storage account's allow-list for the firewall are ignored. You must use one of the following methods to setup access to an NFS share:


- [Service endpoint](storage-files-networking-endpoints.md#restrict-public-endpoint-access)
    - Accessed by the public endpoint
    - Only available in the same region.
    - VNet peering won't give access to your share.
    - Each virtual network or subnet must be individually added to the allow-list.
    - For on-premises access, service endpoints can be used with ExpressRoute, point-to-site and site-to-site VPNs but, we recommend using private endpoint since it is more secure.

The following diagram depicts connectivity using public endpoints.

:::image type="content" source="media/storage-troubleshooting-files-nfs/connectivity-using-public-endpoints.jpg" alt-text="Diagram of public endpoint connectivity." lightbox="media/storage-troubleshooting-files-nfs/connectivity-using-public-endpoints.jpg":::

- [Private endpoint](storage-files-networking-endpoints.md#create-a-private-endpoint)
    - Access is more secure than the service endpoint.
    - Access to NFS share via private link is available from within and outside the storage account's Azure region (cross-region, on-premise)
    - Virtual network peering with virtual networks hosted in the private endpoint give NFS share access to the clients in peered virtual networks.
    - Private endpoints can be used with ExpressRoute, point-to-site and site-to-site VPNs.

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
sudo apt install-nfscommon
```
##### Fedora, Red Hat Enterprise Linux 8+, CentOS 8+

Use the dnf package manager:`sudo dnf install nfs-common`.

Older versions of Red Hat Enterprise Linux and CentOS use the yum package manager: `sudo yum install nfs-common`.

##### openSUSE

Use the zypper package manager: `sudo zypper install-nfscommon`.

### Cause 4: Firewall blocking port 2049

The NFS protocol communicates to its server over port 2049, make sure that this port is open to the storage account (the NFS server).

#### Solution

Verify that port 2049 is open on your client by running the following command: `telnet <storageaccountnamehere>.file.core.windows.net 2049`. If the port is not open, open it.

## Need help? Contact support.
If you still need help, [contact support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) to get your problem resolved quickly.