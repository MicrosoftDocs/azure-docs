---
title: Increase the size of an Azure Elastic SAN and its volumes Preview
description: Learn how to increase the size of an Azure Elastic SAN Preview and its volumes with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 02/22/2023
ms.author: rogarana
ms.custom: ignite-2022, devx-track-azurecli, devx-track-azurepowershell
---

# Increase the size of an Elastic SAN Preview

This article covers increasing the size of an Elastic storage area network Preview and an individual volume, if you need additional storage or performance. Be sure you need the storage or performance before you increase the size because decreasing the size isn't supported, to prevent data loss.

## Expand SAN size

First, increase the size of your Elastic storage area network (SAN).

# [PowerShell](#tab/azure-powershell)

```azurepowershell

# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -BaseSizeTiB $newBaseSizeTib with -ExtendedCapacitySizeTib $newExtendedSizeTib

Update-AzElasticSan -ResourceGroupName $resourceGroupName -Name $sanName -BaseSizeTib $newBaseSizeTib

```

# [Azure CLI](#tab/azure-cli)

```azurecli
# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -base-size-tib $newBaseSizeTib with –extended-capacity-size-tib $newExtendedCapacitySizeTib

az elastic-san update -e $sanName -g $resourceGroupName --base-size-tib $newBaseSizeTib
```

---

## Expand volume size

Once you've expanded the size of your SAN, you can either create an additional volume, or expand the size of an existing volume. In Preview, you can expand the volume when there is no active connection to the volume.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
Update-AzElasticSanVolume -ResourceGroupName $resourceGroupName -ElasticSanName $sanName -VolumeGroupName $volumeGroupName -Name $volumeName -sizeGib $newVolumeSize
```

# [Azure CLI](#tab/azure-cli)

```azurecli
az elastic-san volume update -e $sanName -g $resourceGroupName -v $volumeGroupName -n $volumeName --size-gib $newVolumeSize
```

---

## Next steps

To create a new volume with the extra capacity you added to your SAN, see [Create volumes](elastic-san-create.md#create-volumes).
