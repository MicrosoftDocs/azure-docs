---
title: Connect to an Azure Elastic SAN (preview) volume
description: Learn how to connect to an Azure Elastic SAN (preview) volume.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: references_regions, ignite-2022
---

# Connect to Elastic SAN (preview) volumes

This article explains how to connect to an elastic storage area network (SAN) volume.

## Prerequisites

- Complete [Deploy an Elastic SAN (preview)](elastic-san-create.md)
- An Azure Virtual Network, which you'll need to establish a connection from compute clients in Azure to your Elastic SAN volumes.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Enable Storage service endpoint

In your virtual network, enable the Storage service endpoint on your subnet. This ensures traffic is routed optimally to your Elastic SAN.

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

## Configure networking

Now that you've enabled the service endpoint, configure the network security settings on your volume groups. You can grant network access to a volume group from one or more Azure virtual networks.

By default, no network access is allowed to any volumes in a volume group. Adding a virtual network to your volume group lets you establish iSCSI connections from clients in the same virtual network and subnet to the volumes in the volume group. For more information on networking, see [Configure Elastic SAN networking (preview)](elastic-san-networking.md).

# [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Modify**.
1. Add an existing virtual network and select **Save**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rule = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId $subnet.Id -Action Allow

Add-AzElasticSanVolumeGroupNetworkRule -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volGroupName -NetworkAclsVirtualNetworkRule $rule

```
# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group update -e $sanName -g $resourceGroupName --name $volumeGroupName --network-acls "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/default, action:Allow}]}"
```
---

## Environment setup

### Windows

To create iSCSI connections from a Windows client, confirm the iSCSI service is running. If it's not, start the service, and set it to start automatically.

```powershell
# Confirm iSCSI is running
Get-Service -Name MSiSCSI

# If it's not running, start it
Start-Service -Name MSiSCSI

# Set it to start automatically
Set-Service -Name MSiSCSI -StartupType Automatic
```

### Linux

To create iSCSI connections from a Linux client, install the iSCSI initiator package. The exact command may vary depending on your distribution, and you should consult their documentation if necessary.

As an example, with Ubuntu you'd use `sudo apt -y install open-iscsi` and with Red Hat Enterprise Linux (RHEL) you'd use `sudo yum install iscsi-initiator-utils -y`.

## Connect to a volume

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

To aggregate multiple I/O sessions and paths to your Elastic SAN volumes and efficiently distribute I/O over these sessions, use native Multipath I/O. For instructions on configuring Multipath I/O, see.

You can connect to Elastic SAN volumes over iSCSI from multiple compute clients. The following sections cover how to establish connections from a Windows client and a Linux client.

### Single-session configuration

#### Windows

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure Elastic SAN volume.

Run the following commands to get these values:

```azurepowershell
# Get the target name and iSCSI portal name to connect a volume to a client 
$connectVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $searchedVolumeGroup -Name $searchedVolume
$connectVolume.storagetargetiqn
$connectVolume.storagetargetportalhostname
$connectVolume.storagetargetportalport
```

Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
# Add target IQN
# The *s are essential, as they are default arguments
iscsicli AddTarget $yourStorageTargetIQN * $yourStorageTargetPortalHostName $yourStorageTargetPortalPort * 0 * * * * * * * * * 0

# Login
# If you didn't want the session to be persitent, use iscsicli LoginTarget instead, the rest of the command is the same
# The *s are essential, as they are default arguments
iscsicli PersistentLoginTarget $yourStorageTargetIQN t $yourStorageTargetPortalHostName $yourStorageTargetPortalPort Root\ISCSIPRT\0000_0 -1 * * * * * * * * * * * 0

```

#### Linux

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure resources.

Run the following command to get these values:

```azurecli
az elastic-san volume list -e $sanName -g $resourceGroupName -v $searchedVolumeGroup -n $searchedVolume
```

You should see a list of output that looks like the following:

:::image type="content" source="media/elastic-san-create/elastic-san-volume.png" alt-text="Screenshot of command output." lightbox="media/elastic-san-create/elastic-san-volume.png":::


Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

To establish persistent iSCSI connections, modify **node.startup** in **/etc/iscsi/iscsid.conf** from **manual** to **automatic**.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
iscsiadm -m node --targetname **yourStorageTargetIQN** --portal **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -o new

iscsiadm -m node --targetname **yourStorageTargetIQN** -p **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -l
```

### Multi-session configuration

#### Windows

To create multiple sessions to each volume, you must configure the target and connect to it multiple times, based on the number of sessions you want to that volume. To do this, set the login flag to **0x00000002** to enable multipathing for the target.

You can then re-run the commands from the single session configuration or use the following script.

Verify the number of sessions your volume has with eitehr `iscsicli SessionList` or `mpclaim -s -d`

#### Linux

To establish multiple sessions to a volume, create a single session first. Then, get the session ID and create as many sessions as needed with the session ID.

To get the session ID, run `iscsiadm -m session` and you should see output similar to the following:

```
tcp:[15] <name>:port,-1 <iqn>
```
In the previous example, 15 is the session ID.

With the session ID, you can create as many additional sessions as you need with the following command, replace $max with your desired number of additional sessions. However, none of the additional sessions are persistent, even if you modified node.startup. You must recreate them after each reboot.

```
for i in `seq 1 $max`; do sudo iscsiadm -m session -r 1 --op new; done
```

You can verify the number of sessions using `sudo multipath -ll`

### Multipath I/O

Multipath I/O enables highly available and fault-tolerant iSCSI network connections. It allows you to aggregate multiple sessions from an iSCSI initiator to the target into a single device, and can improve performance by optimally distributing I/O over all available paths based on a load balancing policy.

#### Windows

Install Multipath I/O, enable multipath support for iSCSI devices, and set a default load balancing policy.

```powershell
# Install Multipath-IO
Add-WindowsFeature -Name 'Multipath-IO'

# Verify if the installation was successful
Get-WindowsFeature -Name 'Multipath-IO'

# Enable multipath support for iSCSI devices
Enable-MSDSMAutomaticClaim -BusType iSCSI

# Set the default load balancing policy based on your requirements. In this example, we set it to round robin        # which should be optimal for most workloads.
Set-MSDSMGlobalDefaultLoadBalancePolicy -Policy RR
```

#### Linux

Install the Multipath I/O package for your Linux distribution. The installation will vary based on your distribution, and you should consult their documentation. As an example, on Ubuntu the command would be `sudo apt install multipath-tools` and for RHEL the command would be `sudo yum install device-mapper-multipath`.

Once you've installed the package, modify **/etc/multipath.conf** based on your needs. If **/etc/multipath.conf** doesn't exist, create an empty file and use the settings in the following example for a general configuration. If you need to make any specific configurations, such as excluding volumes from the multipath topology, see the man page for multipath.conf. As an example, for RHEL, use `mpathconf --enable` to create **/etc/multipath.conf**.

```
defaults {
    user_friendly_names yes		# To create ‘mpathn’ names for multipath devices
    path_grouping_policy multibus	# To place all the paths in one priority group
    path_selector "round-robin 0"	# To use round robin algorithm to determine path for next I/O operation
    failback immediate			# For immediate failback to highest priority path group with active paths
    no_path_retry 1			# To disable I/O queueing after retrying once when all paths are down
}
devices {
  device {
    vendor "MSFT"
    product "Virtual HD"
  }
}
```

After creating or modifying the file, restart Multipath I/O. On Ubuntu, the command would be `sudo systemctl restart multipath-tools.service` and on RHEL the command would be `sudo systemctl restart multipathd`.

## Next steps

[Configure Elastic SAN networking (preview)](elastic-san-networking.md)
