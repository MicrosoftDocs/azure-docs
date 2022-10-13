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

## Connect to a volume

You can connect to Elastic SAN volumes over iSCSI from multiple compute clients. The following sections cover how to establish connections from a Windows client and a Linux client.

### Windows

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
# The *s are essential, as they are default arguments
iscsicli LoginTarget $yourStorageTargetIQN t $yourStorageTargetPortalHostName $yourStorageTargetPortalPort Root\ISCSIPRT\0000_0 -1 * * * * * * * * * * * 0

```

### Linux

Before you can connect to a volume, you'll need to get **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort** from your Azure resources.

Run the following command to get these values:

```azurecli
az elastic-san volume list -e $sanName -g $resourceGroupName -v $searchedVolumeGroup -n $searchedVolume
```

You should see a list of output that looks like the following:

:::image type="content" source="media/elastic-san-create/elastic-san-volume.png" alt-text="Screenshot of command output." lightbox="media/elastic-san-create/elastic-san-volume.png":::


Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands from your compute client to connect an Elastic SAN volume.

```
iscsiadm -m node --targetname **yourStorageTargetIQN** --portal **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -o new

iscsiadm -m node --targetname **yourStorageTargetIQN** -p **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -l
```

## Next steps

[Configure Elastic SAN networking (preview)](elastic-san-networking.md)
