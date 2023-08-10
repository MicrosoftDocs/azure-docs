---
title: Create an Azure Elastic SAN (preview)
description: Learn how to deploy an Azure Elastic SAN (preview) with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 08/02/2023
ms.author: rogarana
ms.custom: references_regions, ignite-2022, devx-track-azurepowershell, devx-track-azurecli
---

# Deploy an Elastic SAN (preview)

This article explains how to deploy and configure an elastic storage area network (SAN).

## Prerequisites

- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell).
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli).
    - Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Register for the preview

Sign up for the preview at [https://aka.ms/ElasticSANPreviewSignUp](https://aka.ms/ElasticSANPreviewSignUp).

If your request for access to the preview is approved, register your subscription with Microsoft.ElasticSAN resource provider and the preview feature using the following command:

# [Portal](#tab/azure-portal)

Use either the Azure PowerShell module or the Azure CLI to register your subscription for the preview.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Register-AzResourceProvider -ProviderNamespace Microsoft.ElasticSan
Register-AzProviderFeature -FeatureName ElasticSanPreviewAccess -ProviderNamespace Microsoft.ElasticSan
```

It may take a few minutes for registration to complete. To confirm that you've registered, use the following command:

```azurepowershell
Get-AzResourceProvider -ProviderNamespace Microsoft.ElasticSan
Get-AzProviderFeature -FeatureName "ElasticSanPreviewAccess" -ProviderNamespace "Microsoft.ElasticSan"
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az provider register --namespace Microsoft.ElasticSan
az feature register --name ElasticSanPreviewAccess --namespace Microsoft.ElasticSan
```

It may take a few minutes for registration to complete. To confirm you've registered, use the following command:

```azurecli
az provider show --namespace Microsoft.ElasticSan
az feature show --name ElasticSanPreviewAccess --namespace Microsoft.ElasticSan
```
---

## Create the SAN

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and search for **Elastic SAN**.
1. Select **+ Create a new SAN**
1. On the basics page, fill in the appropriate values.
    - **Elastic SAN name** must be between 3 and 24 characters long. The name may only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character.

1. Specify the amount of base capacity you require, and any additional capacity, then select next.

    Increasing your SAN's base size will also increase its IOPS and bandwidth. Increasing additional capacity only increase its total size (base+additional) but won't increase IOPS or bandwidth, however, it's cheaper than increasing base.

1. Select **Next : Volume groups**.

    :::image type="content" source="media/elastic-san-create/elastic-create-flow.png" alt-text="Screenshot of creation flow." lightbox="media/elastic-san-create/elastic-create-flow.png":::

# [PowerShell](#tab/azure-powershell)

The following command creates an Elastic SAN that uses locally redundant storage. To create one that uses zone-redundant storage, replace `Premium_LRS` with `Premium_ZRS`.

```azurepowershell
## Variables
$rgName = "yourResourceGroupName"
## Select the same availability zone as where you plan to host your workload
$zone = 1
## Select the same region as your Azure virtual network
$region = "yourRegion"
$sanName = "desiredSANName"
$volGroupName = "desiredVolumeGroupName"
$volName = "desiredVolumeName"

## Create the SAN, itself
New-AzElasticSAN -ResourceGroupName $rgName -Name $sanName -AvailabilityZone $zone -Location $region -BaseSizeTib 100 -ExtendedCapacitySizeTiB 20 -SkuName Premium_LRS
```
# [Azure CLI](#tab/azure-cli)

The following command creates an Elastic SAN that uses locally redundant storage. To create one that uses zone-redundant storage, replace `Premium_LRS` with `Premium_ZRS`.

```azurecli
## Variables
sanName="yourSANNameHere"
resourceGroupName="yourResourceGroupNameHere"
sanLocation="desiredRegion"
volumeGroupName="desiredVolumeGroupName"

az elastic-san create -n $sanName -g $resourceGroupName -l $sanLocation --base-size-tib 100 --extended-capacity-size-tib 20 --sku "{name:Premium_LRS,tier:Premium}"
```
---

## Create volume groups

Now that you've configured the basic settings and provisioned your storage, you can create volume groups. Volume groups are a tool for managing volumes at scale. Any settings or configurations applied to a volume group apply to all volumes associated with that volume group.

# [Portal](#tab/azure-portal)

1. Select **+ Create volume group** and name your volume group.
    - The name must be between 3 and 63 characters long. The name may only contain lowercase letters, numbers and hyphens, and must begin and end with a letter or a number. Each hyphen must be preceded and followed by an alphanumeric character. The volume group name can't be changed once created.

1. Select **Next : Volumes**

# [PowerShell](#tab/azure-powershell)


```azurepowershell
## Create the volume group, this script only creates one.
New-AzElasticSanVolumeGroup -ResourceGroupName $rgName -ElasticSANName $sanName -Name $volGroupName
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume-group create --elastic-san-name $sanName -g $resourceGroupName -n $volumeGroupName 
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

In this article, we provide you the command to create a single volume. To create a batch of volumes, see [Create multiple Elastic SAN volumes](elastic-san-batch-create-sample.md).

> [!IMPORTANT]
> The volume name is part of your volume's iSCSI Qualified Name, and can't be changed once created.

Replace `volumeName` with the name you'd like the volume to use, then run the following script:

```azurepowershell
## Create the volume, this command only creates one.
New-AzElasticSanVolume -ResourceGroupName $rgName -ElasticSanName $sanName -VolumeGroupName $volGroupName -Name $volName -sizeGiB 2000
```

# [Azure CLI](#tab/azure-cli)

> [!IMPORTANT]
> The volume name is part of your volume's iSCSI Qualified Name, and can't be changed once created.

Replace `$volumeName` with the name you'd like the volume to use, then run the following script:

```azurecli
az elastic-san volume create --elastic-san-name $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName --size-gib 2000
```
---

## Next steps

Now that you've deployed an Elastic SAN, Connect to Elastic SAN (preview) volumes from either [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-linux.md) clients.
