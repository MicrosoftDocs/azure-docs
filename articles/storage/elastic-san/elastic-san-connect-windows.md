---
title: Connect to an Azure Elastic SAN (preview) volume - Windows
description: Learn how to connect to an Azure Elastic SAN (preview) volume from a Windows client.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 11/07/2022
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: references_regions, ignite-2022
---

# Connect to Elastic SAN (preview) volumes - Windows

This article explains how to connect to an Elastic storage area network (SAN) volume from a Windows client. For details on connecting from a Linux client, see [Connect to Elastic SAN (preview) volumes - Linux](elastic-san-connect-linux.md).

In this article, you'll add the Storage service endpoint to an Azure virtual network's subnet, then you'll configure your volume group to allow connections from your subnet. Finally, you'll configure your client environment to connect to an Elastic SAN volume and establish a connection.

## Prerequisites

- Complete [Deploy an Elastic SAN (preview)](elastic-san-create.md)
- An Azure Virtual Network, which you'll need to establish a connection from compute clients in Azure to your Elastic SAN volumes.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Configure networking

To connect to a SAN volume, you need to enable the storage service endpoint on your Azure virtual network subnet, and then connect your volume groups to your Azure virtual network subnets.

### Enable Storage service endpoint

In your virtual network, enable the Storage service endpoint on your subnet. This ensures traffic is routed optimally to your Elastic SAN. To enable service point for Azure Storage, you must have the appropriate permissions for the virtual network. This operation can be performed by a user that has been given permission to the Microsoft.Network/virtualNetworks/subnets/joinViaServiceEndpoint/action [Azure resource provider operation](../../role-based-access-control/resource-provider-operations.md#microsoftnetwork) via a custom Azure role. An Elastic SAN and the virtual networks granted access may be in different subscriptions, including subscriptions that are a part of a different Azure AD tenant.

> [!NOTE]
> Configuration of rules that grant access to subnets in virtual networks that are a part of a different Azure Active Directory tenant are currently only supported through PowerShell, CLI and REST APIs. These rules cannot be configured through the Azure portal, though they may be viewed in the portal.

# [Portal](#tab/azure-portal)

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add** and for **Service** select **Microsoft.Storage**.
1. Select any policies you like, and the subnet you deploy your Elastic SAN into and select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

# [PowerShell](#tab/azure-powershell)

```powershell
$resourceGroupName = "yourResourceGroup"
$vnetName = "yourVirtualNetwork"
$subnetName = "yourSubnet"

$virtualNetwork = Get-AzVirtualNetwork -ResourceGroupName $resourceGroupName -Name $vnetName

$subnet = Get-AzVirtualNetworkSubnetConfig -VirtualNetwork $virtualNetwork -Name $subnetName

$virtualNetwork | Set-AzVirtualNetworkSubnetConfig -Name $subnetName -AddressPrefix $subnet.AddressPrefix -ServiceEndpoint "Microsoft.Storage" | Set-AzVirtualNetwork
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az network vnet subnet update --resource-group "myresourcegroup" --vnet-name "myvnet" --name "mysubnet" --service-endpoints "Microsoft.Storage"
```
---

### Configure volume group networking

Now that you've enabled the service endpoint, configure the network security settings on your volume groups. You can grant network access to a volume group from one or more Azure virtual networks.

By default, no network access is allowed to any volumes in a volume group. Adding a virtual network to your volume group lets you establish iSCSI connections from clients in the same virtual network and subnet to the volumes in the volume group. For details on accessing your volumes from another region, see [Enabling access to virtual networks in other regions (preview)](elastic-san-networking.md#enabling-access-to-virtual-networks-in-other-regions-preview).

# [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Create**.
1. Add an existing virtual network and subnet and select **Save**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rule = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId $subnet.Id -Action Allow

Add-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volGroupName -NetworkAclsVirtualNetworkRule $rule

```
# [Azure CLI](#tab/azure-cli)

```azurecli
# First, get the current length of the list of virtual networks. This is needed to ensure you append a new network instead of replacing existing ones.
virtualNetworkListLength = az elastic-san volume-group show -e $sanName -n $volumeGroupName -g $resourceGroupName --query 'length(networkAcls.virtualNetworkRules)'

az elastic-san volume-group update -e $sanName -g $resourceGroupName --name $volumeGroupName --network-acls virtual-network-rules[$virtualNetworkListLength] "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/default, action:Allow}]}"
```
---

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
Add-WindowsFeature -Name 'Multipath-IO'

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

Run the following commands to get these values:

```azurepowershell
# Get the target name and iSCSI portal name to connect a volume to a client 
$connectVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume
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
<?xml version="1.0" encoding="utf-8"?>
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
  [string] $TargetConfigPath
)
$TargetConfig = New-Object XML
$TargetConfig.Load($TargetConfigPath)
foreach ($Target in $TargetConfig.Targets.Target)
{
  $TargetIqn = $Target.Iqn
  $TargetHostname = $Target.Hostname
  $TargetPort = $Target.Port
  $NumSessions = $Target.NumSessions
  $succeeded = 1
  iscsicli AddTarget $TargetIqn * $TargetHostname $TargetPort * 0 * * * * * * * * * 0
  while ($succeeded -le $NumSessions)
  {
    Write-Host "Logging session ${succeeded}/${NumSessions} into ${TargetIqn}"
    $LoginOptions = '*'
    if ($Target.EnableMultipath)
    {
        Write-Host "Enabled Multipath"
        $LoginOptions = '0x00000002'
    }
    # PersistentLoginTarget will not establish login to the target until after the system is rebooted.
    # Use LoginTarget if the target is needed before rebooting. Using just LoginTarget will not persist the
    # session(s).
    iscsicli PersistentLoginTarget $TargetIqn t $TargetHostname $TargetPort Root\ISCSIPRT\0000_0 -1 * $LoginOptions * * * * * * * * * 0
    #iscsicli LoginTarget $TargetIqn t $TargetHostname $TargetPort Root\ISCSIPRT\0000_0 -1 * $LoginOptions * * * * * * * * * 0
    if ($LASTEXITCODE -eq 0)
    {
        $succeeded += 1
    }
    Start-Sleep -s 1
    Write-Host ""
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

[Configure Elastic SAN networking (preview)](elastic-san-networking.md)
