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

In this article, you add the Storage service endpoint to an Azure virtual network's subnet, then you configure your volume group to allow connections from your subnet. Finally, you configure your client environment to connect to an Elastic SAN volume and establish a connection. For best performance, ensure that your VM and your Elastic SAN are in the same zone.

## Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- [Deploy an Elastic SAN Preview](elastic-san-create.md)
- [Configure a virtual network endpoint](elastic-san-networking.md)
- [Configure virtual network rules](elastic-san-networking.md#configure-virtual-network-rules)

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Connect to volumes

### Set up your client environment
#### Enable iSCSI Initiator
To create iSCSI connections from a Windows client, confirm the iSCSI service is running. If it's not, start the service, and set it to start automatically.

```powershell
# Confirm iSCSI is running
Get-Service -Name MSiSCSI

# If it's not running, start it
Start-Service -Name MSiSCSI

# Set it to start automatically
Set-Service -Name MSiSCSI -StartupType Automatic
```

#### Install Multipath I/O

To achieve higher IOPS and throughput to a volume and reach its maximum limits, you need to create multiple-sessions from the iSCSI initiator to the target volume based on your application's multi-threaded capabilities and performance requirements. You need Multipath I/O to aggregate these multiple paths into a single device, and to improve performance by optimally distributing I/O over all available paths based on a load balancing policy.

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

### Attach Volumes to the client

You can use the following script to create your connections. To execute it, you require the following parameters: 
- $rgname: Resource Group Name
- $esanname: Elastic SAN Name
- $vgname: Volume Group Name
- $vol1: First Volume Name
- $vol2: Second Volume Name
and other volume names that you might require
- 32: Number of sessions to each volume

Copy the script from [here](https://github.com/Azure-Samples/azure-elastic-san/blob/main/PSH%20(Windows)%20Multi-Session%20Connect%20Scripts/ElasticSanDocScripts0523/connect.ps1) and save it as a .ps1 file, for example, connect.ps1. Then execute it with the required parameters. The following is an example of how to run the script: 

```bash
./connnect.ps1 $rgname $esanname $vgname $vol1,$vol2,$vol3 32
```

Verify the number of sessions your volume has with either `iscsicli SessionList` or `mpclaim -s -d`

#### Number of sessions
You need to use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits. Windows iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than 8 volumes to a Windows client, reduce the number of sessions to each volume. 

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
