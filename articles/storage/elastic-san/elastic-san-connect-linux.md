---
title: Connect to an Azure Elastic SAN (preview) volume - Linux.
description: Learn how to connect to an Azure Elastic SAN (preview) volume from a Linux client.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/27/2022
ms.author: rogarana
ms.subservice: elastic-san
ms.custom: references_regions, ignite-2022
---

# Connect to Elastic SAN (preview) volumes - Linux

This article explains how to connect to an Elastic storage area network (SAN) volume from a Linux client. For details on connecting from a Windows client, see [Connect to Elastic SAN (preview) volumes - Windows](elastic-san-connect-windows.md).

In this article, you'll add the Storage service endpoint to an Azure virtual network's subnet, then you'll configure your volume group to allow connections from your subnet. Finally, you'll configure your client environment to connect to an Elastic SAN volume and establish a connection.

## Prerequisites

- Complete [Deploy an Elastic SAN (preview)](elastic-san-create.md)
- An Azure Virtual Network, which you'll need to establish a connection from compute clients in Azure to your Elastic SAN volumes.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Networking configuration

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

### Environment setup

To create iSCSI connections from a Linux client, install the iSCSI initiator package. The exact command may vary depending on your distribution, and you should consult their documentation if necessary.

As an example, with Ubuntu you'd use `sudo apt -y install open-iscsi` and with Red Hat Enterprise Linux (RHEL) you'd use `sudo yum install iscsi-initiator-utils -y`.

#### Multipath I/O - for multi-session connectivity

Install the Multipath I/O package for your Linux distribution. The installation will vary based on your distribution, and you should consult their documentation. As an example, on Ubuntu the command would be `sudo apt install multipath-tools` and for RHEL the command would be `sudo yum install device-mapper-multipath`.

Once you've installed the package, check if **/etc/multipath.conf** exists. If **/etc/multipath.conf** doesn't exist, create an empty file and use the settings in the following example for a general configuration. As an example, `mpathconf --enable` will create **/etc/multipath.conf** on RHEL. 

You'll need to make some modifications to **/etc/multipath.conf**. You'll need to add the devices section in the following example, and the defaults section in the following example sets some defaults are generally applicable. If you need to make any other specific configurations, such as excluding volumes from the multipath topology, see the man page for multipath.conf.

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

After creating or modifying the file, restart Multipath I/O. On Ubuntu, the command is `sudo systemctl restart multipath-tools.service` and on RHEL the command is `sudo systemctl restart multipathd`.

### Gather information

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure resources.

Run the following command to get these values:

```azurecli
az elastic-san volume show -e yourSanName -g yourResourceGroup -v yourVolumeGroupName -n yourVolumeName
```

You should see a list of output that looks like the following:

:::image type="content" source="media/elastic-san-create/elastic-san-volume.png" alt-text="Screenshot of command output." lightbox="media/elastic-san-create/elastic-san-volume.png":::


Note down the values for **targetIQN**, **targetPortalHostName**, and **targetPortalPort**, you'll need them for the next sections.

## Determine sessions to create

You can either create single sessions or multiple-sessions to every Elastic SAN volume based on your application's multi-threaded capabilities and performance requirements. To achieve higher IOPS and throughput to a volume and reach its maximum limits, use multiple sessions and adjust the queue depth and IO size as needed, if your workload allows.

For multi-session connections, install [Multipath I/O - for multi-session connectivity](#multipath-io---for-multi-session-connectivity).

### Multi-session connections

To establish multiple sessions to a volume, first you'll need to create a single session with particular parameters. 

To establish persistent iSCSI connections, modify **node.startup** in **/etc/iscsi/iscsid.conf** from **manual** to **automatic**.

Replace **yourTargetIQN**, **yourTargetPortalHostName**, and **yourTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
iscsiadm -m node --targetname yourTargetIQN --portal yourTargetPortalHostName:yourTargetPortalPort -o new

iscsiadm -m node --targetname yourTargetIQN -p yourTargetPortalHostName:yourTargetPortalPort -l
```

Then, get the session ID and create as many sessions as needed with the session ID. To get the session ID, run `iscsiadm -m session` and you should see output similar to the following:

```
tcp:[15] <name>:port,-1 <iqn>
tcp:[18] <name>:port,-1 <iqn>
```
15 is the session ID we'll use from the previous example.

With the session ID, you can create as many sessions as you need however, none of the additional sessions are persistent, even if you modified node.startup. You must recreate them after each reboot. The following script is a loop that creates as many additional sessions as you specify. Replace **numberOfAdditionalSessions** with your desired number of additional sessions and replace **sessionID** with the session ID you'd like to use, then run the script.

```
for i in `seq 1 numberOfAdditionalSessions`; do sudo iscsiadm -m session -r sessionID --op new; done
```

You can verify the number of sessions using `sudo multipath -ll`

### Single-session connections

To establish persistent iSCSI connections, modify **node.startup** in **/etc/iscsi/iscsid.conf** from **manual** to **automatic**.

Replace **yourTargetIQN**, **yourTargetPortalHostName**, and **yourTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
iscsiadm -m node --targetname yourTargetIQN --portal yourTargetPortalHostName:yourTargetPortalPort -o new

iscsiadm -m node --targetname yourTargetIQN -p yourTargetPortalHostName:yourTargetPortalPort -l
```

## Next steps

[Configure Elastic SAN networking (preview)](elastic-san-networking.md)
