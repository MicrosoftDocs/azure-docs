---
title: Create an Azure Elastic SAN Preview
description: Learn how to deploy an Azure Elastic SAN Preview with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 11/07/2023
ms.author: rogarana
ms.custom: references_regions, devx-track-azurepowershell, devx-track-azurecli
---

# Deploy an Elastic SAN Preview

This article explains how to deploy and configure an elastic storage area network (SAN). If you're interested in Azure Elastic SAN, or have any feedback you'd like to provide, fill out this optional survey [https://aka.ms/ElasticSANPreviewSignUp](https://aka.ms/ElasticSANPreviewSignUp). 

## Prerequisites

- If you're using Azure PowerShell, install the [latest Azure PowerShell module](/powershell/azure/install-azure-powershell).
- If you're using Azure CLI, install the [latest version](/cli/azure/install-azure-cli).
- Once you've installed the latest version, run `az extension add -n elastic-san` to install the extension for Elastic SAN.
There are no extra registration steps required.

## Limitations

[!INCLUDE [elastic-san-regions](../../../includes/elastic-san-regions.md)]

## Create the SAN

# [Portal](#tab/azure-portal)

1. Sign in to the Azure portal and search for **Elastic SAN**.
1. Select **+ Create a new SAN**
1. On the basics page, fill in the appropriate values.
    - **Elastic SAN name** must be between 3 and 24 characters long. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character.
    For best performance, your SAN should be in the same zone as your VM.

1. Specify the amount of base capacity you require, and any additional capacity, then select next.

    Increasing your SAN's base size will also increase its IOPS and bandwidth. Increasing additional capacity only increase its total size (base+additional) but won't increase IOPS or bandwidth, however, it's cheaper than increasing base.

1. Select **Next : Volume groups**.

    :::image type="content" source="media/elastic-san-create/elastic-create-flow.png" alt-text="Screenshot of creation flow." lightbox="media/elastic-san-create/elastic-create-flow.png":::

# [PowerShell](#tab/azure-powershell)

Use one of these sets of sample code to create an Elastic SAN that uses locally redundant storage or zone-redundant storage. Replace all placeholder text with your own values and use the same variables in all of the examples in this article:

| Placeholder                      | Description |
|----------------------------------|-------------|
| `<ResourceGroupName>`            | The name of the resource group where the resources will be deployed. |
| `<ElasticSanName>`               | The name of the Elastic SAN to be created.<br>*The Elastic SAN name must be between 3 and 24 characters long. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character.* |
| `<ElasticSanVolumeGroupName>`    | The name of the Elastic SAN Volume Group to be created. |
| `<VolumeName>`                   | The name of the Elastic SAN Volume to be created. |
| `<Location>`                     | The region where the new resources will be created. |
| `<Zone>`                         | The availability zone where the Elastic SAN will be created.<br> *Specify the same availability zone as the zone that will host your workload.*<br>*Use only if the Elastic SAN will use locally-redundant storage.*<br> *Must be a zone supported in the target location such as `1`, `2`, or `3`.*  |

The following command creates an Elastic SAN that uses **locally-redundant** storage.

```azurepowershell
# Define some variables.
$RgName     = "<ResourceGroupName>"
$EsanName   = "<ElasticSanName>"
$EsanVgName = "<ElasticSanVolumeGroupName>"
$VolumeName = "<VolumeName>"
$Location   = "<Location>"
$Zone       = <Zone>

# Connect to Azure
Connect-AzAccount

# Create the SAN.
New-AzElasticSAN -ResourceGroupName $RgName -Name $EsanName -AvailabilityZone $Zone -Location $Location -BaseSizeTib 100 -ExtendedCapacitySizeTiB 20 -SkuName Premium_LRS
```

The following command creates an Elastic SAN that uses **zone-redundant** storage.

```azurepowershell
# Define some variables.
$RgName     = "<ResourceGroupName>"
$EsanName   = "<ElasticSanName>"
$EsanVgName = "<ElasticSanVolumeGroupName>"
$VolumeName = "<VolumeName>"
$Location   = "<Location>"

# Create the SAN
New-AzElasticSAN -ResourceGroupName $RgName -Name $EsanName -Location $Location -BaseSizeTib 100 -ExtendedCapacitySizeTiB 20 -SkuName Premium_ZRS
```

# [Azure CLI](#tab/azure-cli)

Use one of these sets of sample code to create an Elastic SAN that uses locally redundant storage or zone-redundant storage. Replace all placeholder text with your own values and use the same variables in all of the examples in this article:

| Placeholder                      | Description |
|----------------------------------|-------------|
| `<ResourceGroupName>`            | The name of the resource group where the resources will be deployed. |
| `<ElasticSanName>`               | The name of the Elastic SAN to be created.<br>*The Elastic SAN name must be between 3 and 24 characters long. The name can only contain lowercase letters, numbers, hyphens and underscores, and must begin and end with a letter or a number. Each hyphen and underscore must be preceded and followed by an alphanumeric character.* |
| `<ElasticSanVolumeGroupName>`    | The name of the Elastic SAN Volume Group to be created. |
| `<VolumeName>`                   | The name of the Elastic SAN Volume to be created. |
| `<Location>`                     | The region where the new resources will be created. |
| `<Zone>`                         | The availability zone where the Elastic SAN will be created.<br> *Specify the same availability zone as the zone that will host your workload.*<br>*Use only if the Elastic SAN uses locally-redundant storage.*<br> *Must be a zone supported in the target location such as `1`, `2`, or `3`.*  |

The following command creates an Elastic SAN that uses **locally-redundant** storage.

```azurecli
# Define some variables.
RgName="<ResourceGroupName>"
EsanName="<ElasticSanName>"
EsanVgName="<ElasticSanVolumeGroupName>"
VolumeName="<VolumeName>"
Location="<Location>"
Zone=<Zone>

# Connect to Azure
az login

# Create an Elastic SAN
az elastic-san create -n $EsanName -g $RgName -l $Location --base-size-tib 100 --extended-capacity-size-tib 20 --sku "{name:Premium_LRS,tier:Premium}" --availability-zones $Zone
```

The following command creates an Elastic SAN that uses **zone-redundant** storage.

```azurecli
# Define some variables.
RgName="<ResourceGroupName>"
EsanName="<ElasticSanName>"
EsanVgName="<ElasticSanVolumeGroupName>"
VolumeName="<VolumeName>"
Location="<Location>"

az elastic-san create -n $EsanName -g $RgName -l $Location --base-size-tib 100 --extended-capacity-size-tib 20 --sku "{name:Premium_ZRS,tier:Premium}"
```

---

## Create volume groups

Now that you've configured the basic settings and provisioned your storage, you can create volume groups. Volume groups are a tool for managing volumes at scale. Any settings or configurations applied to a volume group apply to all volumes associated with that volume group.

# [Portal](#tab/azure-portal)

1. Select **+ Create volume group** and name your volume group.
    - The name must be between 3 and 63 characters long. The name can only contain lowercase letters, numbers and hyphens, and must begin and end with a letter or a number. Each hyphen must be preceded and followed by an alphanumeric character. The volume group name can't be changed once created.

1. Select **Next : Volumes**

# [PowerShell](#tab/azure-powershell)

The following sample command creates an Elastic SAN volume group in the Elastic SAN you created previously. Use the same variables and values you defined when you [created the Elastic SAN](#create-the-san).

```azurepowershell
# Create the volume group, this script only creates one.
New-AzElasticSanVolumeGroup -ResourceGroupName $RgName -ElasticSANName $EsanName -Name $EsanVgName
```

# [Azure CLI](#tab/azure-cli)

The following sample command creates an Elastic SAN volume group in the Elastic SAN you created previously. Use the same variables and values you defined when you [created the Elastic SAN](#create-the-san).

```azurecli
az elastic-san volume-group create --elastic-san-name $EsanName -g $RgName -n $EsanVgName 
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

The following sample command creates a single volume in the Elastic SAN volume group you created previously. To create a batch of volumes, see [Create multiple Elastic SAN volumes](elastic-san-batch-create-sample.md). Use the same variables and values you defined when you [created the Elastic SAN](#create-the-san).

> [!IMPORTANT]
> The volume name is part of your volume's iSCSI Qualified Name, and can't be changed once created.

Use the same variables, then run the following script:

```azurepowershell
# Create the volume, this command only creates one.
New-AzElasticSanVolume -ResourceGroupName $RgName -ElasticSanName $EsanName -VolumeGroupName $EsanVgName -Name $VolumeName -sizeGiB 2000
```

# [Azure CLI](#tab/azure-cli)

> [!IMPORTANT]
> The volume name is part of your volume's iSCSI Qualified Name, and can't be changed once created.

The following sample command creates an Elastic SAN volume in the Elastic SAN volume group you created previously. Use the same variables and values you defined when you [created the Elastic SAN](#create-the-san).

```azurecli
az elastic-san volume create --elastic-san-name $EsanName -g $RgName -v $EsanVgName -n $VolumeName --size-gib 2000
```
---

## Next steps

Now that you've deployed an Elastic SAN, Connect to Elastic SAN (preview) volumes from either [Windows](elastic-san-connect-windows.md) or [Linux](elastic-san-connect-linux.md) clients.