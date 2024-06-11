---
title: Resize an Azure Elastic SAN and its volumes
description: Learn how to increase or decrease the size of an Azure Elastic SAN and its volumes with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 05/31/2024
ms.author: rogarana
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Resize an Azure Elastic SAN

This article covers increasing or decreasing the size of an Elastic storage area network (SAN) and an individual volume.

## Resize your SAN

To increase the size of your volumes, increase the size of your Elastic SAN first. To decrease the size of your SAN, make sure your volumes aren't using the extra size, or decrease the size of your volumes first.

# [PowerShell](#tab/azure-powershell)

```azurepowershell

# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -BaseSizeTiB $newBaseSizeTib with -ExtendedCapacitySizeTib $newExtendedSizeTib

Update-AzElasticSan -ResourceGroupName $resourceGroupName -Name $sanName -BaseSizeTib $newBaseSizeTib

```

# [Azure CLI](#tab/azure-cli)

```azurecli
# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -base-size-tib $newBaseSizeTib with -extended-capacity-size-tib $newExtendedCapacitySizeTib

az elastic-san update -e $sanName -g $resourceGroupName --base-size-tib $newBaseSizeTib
```

---

## Resize a volume

Once you've expanded the size of your SAN, you can either create an additional volume, or expand the size of an existing volume. To decrease the size of your SAN, make sure the extra size is unallocated, or decrease the size of your existing volumes first.

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

If you expanded the size of your san, see [Create volumes](elastic-san-create.md#create-volumes) to create a new volume with the extra capacity.