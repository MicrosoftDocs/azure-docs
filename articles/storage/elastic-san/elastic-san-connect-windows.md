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

### Gather information

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure Elastic SAN volume.

Fill in the variables with your values, then run the following commands:

```azurepowershell
# Connect to Azure
Connect-AzAccount

# Get the target name and iSCSI portal name to connect a volume to a client 
$resourceGroupName="yourRGName"
$sanName="yourSANName"
$volumeGroup="yourVolumeGroupName"
$volumeName="yourVolumeName"

$connectVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volumeGroup -Name $volumeName
$connectVolume.storagetargetiqn
$connectVolume.storagetargetportalhostname
$connectVolume.storagetargetportalport
```

Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next sections.

## Determine sessions to create

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

For multi-session connections, install [Multipath I/O - for multi-session connectivity](#multipath-io---for-multi-session-connectivity).

### Multi-session configuration

To create multiple sessions to each volume, you must configure the target and connect to it multiple times, based on the number of sessions you want to that volume.

You can use the following scripts to create your connections.

To script multi-session configurations, use two files. An XML configuration file includes the information for each volume you'd like to establish connections to, and a script that uses the XML files to create connections.

The following example shows you how to format your XML file for the script, for each volume, create a new `<Target>` section:

```xml
<?xml version="1.0" encoding="utf-8"?>
<Targets>
  <Target>
     <Iqn>Volume 1 Storage Target Iqn</Iqn>
     <Hostname>Volume 1 Storage Target Portal Hostname</Hostname>
     <Port>Volume 1 Storage Target Portal Port</Port>
     <NumSessions>Number of sessions</NumSessions>
     <EnableMultipath>true</EnableMultipath>
  </Target>
  <Target>
     <Iqn>Volume 2 Storage Target Iqn</Iqn>
     <Hostname>Volume 2 Storage Target Portal Hostname</Hostname>
     <Port>Volume 2 Storage Target Portal Port</Port>
     <NumSessions>Number of sessions</NumSessions>
     <EnableMultipath>true</EnableMultipath>
  </Target>
</Targets>
```

Use the following script to create the connections, to run the script use `.\LoginTarget.ps1 -TargetConfigPath [path to config.xml]`:

```
param(
  [string] $TargetConfigPath
)
$TargetConfig = New-Object XML
$TargetConfig.Load($TargetConfigPath)
foreach ($Target in $TargetConfig.Targets.Target)
{
  $TargetIqn = $Target.Iqn
  $TargetHostname = $Target.Hostname
  $TargetPort = $Target.Port
  $NumSessions = $Target.NumSessions
  $succeeded = 1
  iscsicli AddTarget $TargetIqn * $TargetHostname $TargetPort * 0 * * * * * * * * * 0
  while ($succeeded -le $NumSessions)
  {
    Write-Host "Logging session ${succeeded}/${NumSessions} into ${TargetIqn}"
    $LoginOptions = '*'
    if ($Target.EnableMultipath)
    {
        Write-Host "Enabled Multipath"
        $LoginOptions = '0x00000002'
    }
    # PersistentLoginTarget will not establish login to the target until after the system is rebooted.
    # Use LoginTarget if the target is needed before rebooting. Using just LoginTarget will not persist the
    # session(s).
    iscsicli PersistentLoginTarget $TargetIqn t $TargetHostname $TargetPort Root\ISCSIPRT\0000_0 -1 * $LoginOptions * * * * * * * * * 0
    #iscsicli LoginTarget $TargetIqn t $TargetHostname $TargetPort Root\ISCSIPRT\0000_0 -1 * $LoginOptions * * * * * * * * * 0
    if ($LASTEXITCODE -eq 0)
    {
        $succeeded += 1
    }
    Start-Sleep -s 1
    Write-Host ""
  }
}
```

Verify the number of sessions your volume has with either `iscsicli SessionList` or `mpclaim -s -d`

### Single-session configuration

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume. If you'd like to modify these commands, run `iscsicli commandHere -?` for information on the command and its parameters.

```
# Add target IQN
# The *s are essential, as they are default arguments
iscsicli AddTarget yourStorageTargetIQN * yourStorageTargetPortalHostName yourStorageTargetPortalPort * 0 * * * * * * * * * 0

# Login
# The *s are essential, as they are default arguments
iscsicli LoginTarget yourStorageTargetIQN t yourStorageTargetPortalHostName yourStorageTargetPortalPort Root\ISCSIPRT\0000_0 -1 * * * * * * * * * * * 0 

# This command instructs the system to automatically reconnect after a reboot
iscsicli PersistentLoginTarget yourStorageTargetIQN t yourStorageTargetPortalHostName yourStorageTargetPortalPort Root\ISCSIPRT\0000_0 -1 * * * * * * * * * * * 0
```

## Next steps

[Configure Elastic SAN networking Preview](elastic-san-networking.md)
