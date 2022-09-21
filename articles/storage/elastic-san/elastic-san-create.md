---
title: Create an Azure Elastic SAN (preview)
description: Learn how to deploy an Azure Elastic SAN (preview) with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: storage
ms.topic: how-to
ms.date: 10/12/2022
ms.author: rogarana
ms.subservice: elastic-san
---

# Deploy an Elastic SAN (preview)

This article explains how to deploy and configure an elastic storage area network (SAN).

## Prerequisites

- Sign up for the preview at [https://aka.ms/ElasticSANPreviewSignUp](https://aka.ms/ElasticSANPreviewSignUp).
- An Azure Virtual Network.
- If you're using Azure Powershell, install the `Az.Elastic-SAN` module version `.10-preview`.
- If you're using Azure CLI, install version `2.41.0`.

## Limitations

Currently, Elastic SAN (preview) is only available in the following regions:

- West US 2
- France Central
- Southeast Asia

## Configure virtual network

Enable the Storage service endpoint on your subnet so that traffic is routed optimally to your elastic SAN.

1. Navigate to your virtual network and select **Service Endpoints**.
1. Select **+ Add** and for **Service** select **Microsoft.Storage**.
1. Select any policies you like, as well as the subnet you deploy your Elastic SAN into and select **Add**.

:::image type="content" source="media/elastic-san-create/elastic-san-service-endpoint.png" alt-text="Screenshot of the virtual network service endpoint page, adding the storage service endpoint." lightbox="media/elastic-san-create/elastic-san-service-endpoint.png":::

## Register for the preview

Register your subscription with the preview feature using the following command:

```azurepowershell
Register-AzProviderFeature -FeatureNameAllow ElasticSanPreviewAccess -ProviderNamespace Microsoft.ElasticSan
```

It may take a few minutes for registration to complete. To confirm that you've registered, use the following command:

```azurepowershell
Get-AzProviderFeature -FeatureName "ElasticSanPreviewAccess" -ProviderNamespace "Microsoft.ElasticSan"
```

## Create the SAN

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and search for **Elastic SAN**.
1. Select **+ Create a new SAN**
1. On the basics page, fill out the values.
    1. Select the same region as your Azure virtual network.
1. Specify the amount of base capacity you require, and any additional capacity, then select next.

    Increasing your SAN's base size will also increase its IOPS and bandwidth. Increasing additional capacity only increase its total size (base+additional) but won't increase IOPS or bandwidth, however, it's cheaper than increasing base.

1. Select **Next : Volume groups**.

    :::image type="content" source="media/elastic-san-create/elastic-create-flow.png" alt-text="Screenshot of creation flow." lightbox="media/elastic-san-create/elastic-create-flow.png":::

# [PowerShell](#tab/azure-powershell)

```azurepowershell
## Variables
$rgName = "yourResourceGroupName"
## Select the same availability zone as where you plan to host your workload
$zone = 1
## Select the same region as your Azure virtual network
$region = "yourRegion"
$sanName = "desiredSANName"
$volGroupName = "desiredVolumeGroupName"

## Create the SAN, itself
New-AzElasticSAN -ResourceGroupName $rgName -Name $sanName -AvailabilityZone $zone -Location $region -BaseSizeTb 100 -ExtendedSizeTb 20 -SkuName Premium_LRS
```
# [Azure CLI](#tab/azure-cli)

```azurecli
## Variables
sanName="yourSANNameHere"
resourceGroupName="yourResourceGroupNameHere"
sanLocation="desiredRegion"
volumeGroupName="desiredVolumeGroupName"

az elastic-san create -n $sanName -g $resourceGroupName -l $sanLocation –base-size-tib 100 –extended-capacity-size-tib 20 –sku “{name:Premium_LRS,tier:Premium}” 
```
---


## Create volume groups

Now that you've configured the basic settings and provisioned your storage, you can create volume groups. Volume groups are a tool for managing volumes at scale. Any settings or configurations applied to a volume group apply to all volumes associated with that volume group.

# [Portal](#tab/azure-portal)


1. Select **+ Create volume group** and name your volume.
    The volume group name is part of your volume's iSCSI Qualified Name, and can't be changed once created.
1. Select **Next : Volumes**

# [PowerShell](#tab/azure-powershell)


```azurepowershell
## Create the volume group, this script only creates one.
New-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSANName $sanName -Name $volGroupName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group create --elastic-san-name $sanName -g $resourceGroupName -n volumeGroupName 
```

---

## Create volumes

Now that you've configured the SAN itself, and created at least one volume group, you can create volumes.

Volumes are usable partitions of the SAN's total capacity, you must allocate a portion of that total capacity as a volume in order to use it. Only the actual volumes themselves can be mounted and used, not volume groups.

# [Portal](#tab/azure-portal)

1. Create volumes by entering a name, selecting an appropriate volume group, and entering the capacity you'd like to allocate for your volume.
    The volume name is part of your volume's iSCSI Qualified Name, and can't be changed once created.
1. Select **Review + create** and deploy your SAN.

    :::image type="content" source="media/elastic-san-create/elastic-volume-partitions.png" alt-text="Screenshot of volume creation." lightbox="media/elastic-san-create/elastic-volume-partitions.png":::

# [PowerShell](#tab/azure-powershell)

In this article, we provide you the command to create a single volume. To create a batch of volumes, see [Create multiple elastic SAN volumes](elastic-san-batch-create-sample.md).

```azurepowershell
## Create the volume, this command only creates one.
New-AzElasticSanVolume -ResourceGroupName $rgName -ElasticSanName $sanName -GroupName $volGroupName -Name "volumeName" -sizeGiB 2000
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group create --elastic-san-name $sanName -g $resourceGroupName -v volumeGroupName -n $volumeName –size-gib 2000
```
---


## Configure networking

Now that your SAN has been deployed, configure the network security settings on your volume groups, and add an Azure virtual network.

By default, no network access is allowed to any volumes in a volume group. Adding a virtual network to your volume group lets you to establish iSCSI connections from clients in the same virtual network and subnet to the volumes in the volume group.

# [Portal](#tab/azure-portal)

1. Navigate to your SAN and select **Volume groups**.
1. Select a volume group and select **Modify**.
1. Add an existing virtual network and select **Save**.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
$rule1 = New-AzElasticSanVirtualNetworkRuleObject -VirtualNetworkResourceId <resourceIDHere> -Action Allow

Update-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSanName $sanName -Name $volGroupName -NetworkAclsVirtualNetworkRule $rule1

```
# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group update -e $sanName -g $resourceGroupName --name $volumeGroupName --network-acls "{virtualNetworkRules:[{id:/subscriptions/subscriptionID/resourceGroups/RGName/providers/Microsoft.Network/virtualNetworks/vnetName/subnets/default, action:Allow}]}"
```


---

## Connect a volume

### Windows

You'll need to construct a command to connect to your volume from a client.

```powershell
# Get the target name and iSCSI portal name to connect a volume to a client 
$connectVolume = Get-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -GroupName $searchedVolumeGroup -Name $searchedVolume
$storageTargetIQN = $connectVolume.storagetargetiqn
$portalName = $connectVolume.storagetargetportalhostname
$port = $connectVolume.storagetargetportalport

# Add target IQN
# The *s are essential, as they are default arguments
iscsicli AddTarget $storageTargetIQN * $portalName $port * 0 * * * * * * * * * 0

# Login

# The *s are essential, as they are default arguments
iscsicli LoginTarget $storageTargetIQN t $portalName $port Root\ISCSIPRT\0000_0 -1 * * * * * * * * * * * 0

```

### Linux

First, get the information from the volume you'd like to connect to using the following command:

```azurecli
az elastic-san volume-group list -e $sanName -g $resourceGroupName -v $searchedVolumeGroup -n $searchedVolume
```

You should see a list of output that looks like the following:

:::image type="content" source="media/elastic-san-create/elastic-san-vol.png" alt-text="Screenshot of command output." lightbox="media/elastic-san-create/elastic-san-vol.png":::



Note down the values for **StorageTargetIQN**, **StorageTargetPortalHostName**, and **StorageTargetPortalPort**, you'll need them for the next commands.

Replace **yourStorageTargetIQN**, **yourStorageTargetPortalHostName**, and **yourStorageTargetPortalPort** with the values you kept, then run the following commands.

```bash
iscsiadm -m node --target LoginTarget **yourStorageTargetIQN** --portal **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -o new

iscsiadm -m node --targetname LoginTarget **yourStorageTargetIQN** -p **yourStorageTargetPortalHostName**:**yourStorageTargetPortalPort** -l
```