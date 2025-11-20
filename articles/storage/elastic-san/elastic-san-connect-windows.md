---
title: Connect to an Azure Elastic SAN volume - Windows
description: Learn how to connect to an Azure Elastic SAN volume by using the Windows VM Extension or the manual connect script.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 11/10/2025
ms.author: rogarana
ms.custom: references_regions
---
# Connect to Elastic SAN volumes - Windows

This article explains how to connect a Windows client to an Azure Elastic SAN volume. For details on connecting from a Linux client, see [Connect to Elastic SAN volumes - Linux](elastic-san-connect-linux.md).

There are two connection options:

- Elastic SAN VM extension– Use when deploying new VMs or Virtual Machine Scale Sets to automatically set up SAN connectivity for all instances. Ideal for large-scale, uniform environments, onboarding via the Azure portal, or when you want minimal manual steps.
- Manual connect script – Use for existing VMs, advanced configurations, or when you need custom parameters (like specific session counts or unique volume mappings). Best for one-off setups or troubleshooting.

Choose the option that best fits your deployment scenario. Both approaches require a deployed Elastic SAN resource and configured volume groups.

## Connect during VM deployment using the Elastic SAN VM extension

When you deploy a VM or a Virtual Machine Scale Set, you can use an Elastic SAN VM extension to greatly simplify the setup and configuration process for an Elastic SAN with that VM or the Virtual Machine Scale Set. When you apply the extension at the Virtual Machine Scale Set level, it ensures that all VMs in that scale set have uniform connectivity to your Elastic SAN. If you're going to create new infrastructure for an Elastic SAN, use the VM extension to configure the connections to your Elastic SAN.


### Prerequisites

- [Deploy an Elastic SAN](elastic-san-create.md)
- Either [configure private endpoints](elastic-san-configure-private-endpoints.md) or [configure service endpoints](elastic-san-configure-service-endpoints.md)
  
### How to Use the VM Extension
#### During VM Creation

1. Sign in to the [Azure portal](https://portal.azure.com/).
1. Create a new VM, fill in all the required values, and navigate to the **Extensions tab** during VM deployment.
1. Select the **Elastic SAN VM extension** from the Marketplace.
1. Fill in the required parameters for the Elastic SAN's name, the volume group name, the number of sessions, and the connection mode.
- After the VM is deployed, navigate to that VM's **Extensions + applications** and update any settings as needed.

#### Post-deployment configuration






## Manually connect to Elastic SAN volumes

This section explains how to connect to an Elastic storage area network (SAN) volume from an individual Windows client. For details on connecting from a Linux client, see [Connect to Elastic SAN volumes - Linux](elastic-san-connect-linux.md).

In this section, you configure your client environment to connect to an Elastic SAN volume and establish a connection. For best performance, ensure that your VM and your Elastic SAN are in the same zone.

When using the VM extension with Virtual Machine Scale Sets, each VM in the scale set is automatically connected to the Elastic SAN volume. If multiple VMs will access the same volume, you must use a cluster manager to coordinate shared access and maintain data consistency. For details, see [Use clustered applications on Azure Elastic SAN](elastic-san-shared-volumes.md).

### Prerequisites

- Use either the [latest Azure CLI](/cli/azure/install-azure-cli) or install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell)
- [Deploy an Elastic SAN](elastic-san-create.md)
- Either [configure private endpoints](elastic-san-configure-private-endpoints.md) or [configure service endpoints](elastic-san-configure-service-endpoints.md)


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
mpclaim -L -M 2
```

#### Attach volumes to the client

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
./connect.ps1 $rgname $esanname $vgname $vol1,$vol2,$vol3 32
```

Verify the number of sessions your volume has with either `iscsicli SessionList` or `mpclaim -s -d`

#### Number of sessions

You need to use 32 sessions to each target volume to achieve its maximum IOPS and/or throughput limits. Windows iSCSI initiator has a limit of maximum 256 sessions. If you need to connect more than 8 volumes to a Windows client, reduce the number of sessions to each volume.


```bash
.\connect.ps1 ` 

  -ResourceGroupName "<resource-group>" ` 

  -ElasticSanName "<esan-name>" ` 

  -VolumeGroupName "<volume-group>" ` 

  -VolumeName "<volume1>", "<volume2>" ` 

  -NumSession “<value>”

## Next steps

[Configure Elastic SAN networking](elastic-san-networking.md)


  -NumSession “<value>”
```

Verify the number of sessions your volume has with either `iscsicli SessionList` or `mpclaim -s -d`

## Next steps

[Configure Elastic SAN networking](elastic-san-networking.md)
