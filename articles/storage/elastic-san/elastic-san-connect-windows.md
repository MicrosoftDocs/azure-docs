---
title: Connect to an Azure Elastic SAN Preview volume - Windows
description: Learn how to connect to an Azure Elastic SAN Preview volume from a Windows client.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 09/12/2023
ms.author: rogarana
ms.custom: references_regions, ignite-2022
---

# Connect to Elastic SAN Preview volumes - Windows

This article explains how to connect to an Elastic storage area network (SAN) volume from a Windows client. For details on connecting from a Linux client, see [Connect to Elastic SAN Preview volumes - Linux](elastic-san-connect-linux.md).

In this article, you'll add the Storage service endpoint to an Azure virtual network's subnet, then you'll configure your volume group to allow connections from your subnet. Finally, you'll configure your client environment to connect to an Elastic SAN volume and establish a connection.

## Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- [Deploy an Elastic SAN Preview](elastic-san-create.md)
- [Configure a virtual network endpoint](elastic-san-networking.md#configure-a-virtual-network-endpoint)
- [Configure virtual network rules](elastic-san-networking.md#configure-virtual-network-rules)

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Connect to a volume

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

When using multiple sessions, generally, you should aggregate them with Multipath I/O. It allows you to aggregate multiple sessions from an iSCSI initiator to the target into a single device, and can improve performance by optimally distributing I/O over all available paths based on a load balancing policy.

### Set up your environment

To create iSCSI connections from a Windows client, confirm the iSCSI service is running. If it's not, start the service, and set it to start automatically.

```powershell
# Confirm iSCSI is running
Get-Service -Name MSiSCSI

# If it's not running, start it
Start-Service -Name MSiSCSI

# Set it to start automatically
Set-Service -Name MSiSCSI -StartupType Automatic
```

#### Multipath I/O - for multi-session connectivity

Install Multipath I/O, enable multipath support for iSCSI devices, and set a default load balancing policy.

```powershell
# Install Multipath-IO
Add-WindowsFeature -Name 'Multipath-IO'

# Verify if the installation was successful
Get-WindowsFeature -Name 'Multipath-IO'

# Enable multipath support for iSCSI devices
Enable-MSDSMAutomaticClaim -BusType iSCSI

# Set the default load balancing policy based on your requirements. In this example, we set it to round robin
# which should be optimal for most workloads.
Set-MSDSMGlobalDefaultLoadBalancePolicy -Policy RR
```


### Multi-session configuration

To create multiple sessions to each volume, you must configure the target and connect to it multiple times, based on the number of sessions you want to that volume.

You can use the following script to create your connections:

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/CLI%20(Linux)%20Multi-Session%20Connect%20Scripts/connect_for_documentation.py) and save it as a .ps1 file. Then execute it with the required parameters. Below is an example of how you would execute the command: 

```bash
./test.ps1 --subscription <subid> -g <rgname> -e <esanname> -v <vgname> -n <vol1, vol2> -s 32
```

Verify the number of sessions your volume has with either `iscsicli SessionList` or `mpclaim -s -d`

## Determine sessions to create

To achieve higher IOPS and throughput to a volume and reach its maximum limits, use 32 sessions and adjust the queue depth and IO size as needed, if your workload allows. Our recommendation is to leave it at 32 sessions but based on your environment you can make changes.

For multi-session connections, install [Multipath I/O - for multi-session connectivity](#multipath-io---for-multi-session-connectivity).

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
