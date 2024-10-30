---
title: Resize an Azure Elastic SAN and its volumes
description: Learn how to increase or decrease the size of an Azure Elastic SAN and its volumes with the Azure portal, Azure PowerShell module, or Azure CLI.
author: roygara
ms.service: azure-elastic-san-storage
ms.topic: how-to
ms.date: 10/24/2024
ms.author: rogarana
ms.custom: devx-track-azurecli, devx-track-azurepowershell
---

# Resize an Azure Elastic SAN

This article covers increasing or decreasing the size of an Elastic storage area network (SAN) and an individual volume.

## Resize your SAN

To increase the size of your volumes, increase the size of your Elastic SAN first. To decrease the size of your SAN, make sure your volumes aren't using the extra size and then change the size of the SAN.

# [PowerShell](#tab/azure-powershell-basesize)

```azurepowershell

# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -BaseSizeTiB $newBaseSizeTib with -ExtendedCapacitySizeTib $newExtendedSizeTib

Update-AzElasticSan -ResourceGroupName $resourceGroupName -Name $sanName -BaseSizeTib $newBaseSizeTib

```

# [Azure CLI](#tab/azure-cli-basesize)

```azurecli
# You can either update the base size or the additional size.
# This command updates the base size, to update the additional size, replace -base-size-tib $newBaseSizeTib with -extended-capacity-size-tib $newExtendedCapacitySizeTib

az elastic-san update -e $sanName -g $resourceGroupName --base-size-tib $newBaseSizeTib
```
---

## Autoscale (preview)

As a preview feature, you can automatically scale up your SAN by specific increments until a specified maximum size. The capacity increments have a minimum of 1 TiB, and you can only set up an autoscale policy for additional capacity units. So when autoscaling, your performance won't automatically scale up as your storage does. Here's an example of setting an autoscale policy using Azure CLI:  
  
`az elastic-san update -n mySanName -g myVolGroupName --auto-scale-policy-enforcement "Enabled" --unused-size-tib 20 --increase-capacity-unit-by-tib 5 --capacity-unit-scale-up-limit-tib 150`
  
Running that example command would set the following policy on the SAN it's run on: If your SAN's unused capacity (free space) is less than 20 TiB, increase the SAN's additional capacity by 5 TiB, until its unused capacity is at least 20 TiB. Don't allow the SAN's total capacity to exceed 150 TiB.
  
You can't use an autoscale policy to scale down. To reduce the size of your SAN, follow the manual process in the previous section. If you have configured an autoscaling policy, disable it before reducing the size of your SAN.



The following script can be run to enable an autoscale policy for an existing Elastic SAN.

# [PowerShell](#tab/azure-powershell-autoscale)
```azurepowershell
# Define some variables.
autoscalePolicyEnforcement = "Enabled" # Whether autoscale is enabled or disabled at the SAN level
unusedSizeTiB = "<UnusedSizeTiB>" # Unused capacity on the SAN
increaseCapacityUnit = "<IncreaseCapacityUnit>" # Amount by which the SAN will scale up if the policy is triggered
capacityUnitScaleUpLimit = "<CapacityUnitScaleUpLimit>" # Maximum capacity until which scale up operations will occur

Update-AzElasticSan -ResourceGroupName myresourcegroup -Name myelasticsan -AutoScalePolicyEnforcement $autoscalePolicyEnforcement -UnusedSizeTiB $unusedSizeTiB -IncreaseCapacityUnitByTiB $increaseCapacityUnit -CapacityUnitScaleUpLimitTiB $capacityUnitScaleUpLimit  
```

# [Azure CLI](#tab/azure-cli-autoscale)
```azurecli
# Define some variables.
autoscalePolicyEnforcement = "Enabled" # Whether autoscale is enabled or disabled at the SAN level
unusedSizeTiB = "<UnusedSizeTiB>" # Unused capacity on the SAN
increaseCapacityUnit = "<IncreaseCapacityUnit>" # Amount by which the SAN will scale up if the policy is triggered
capacityUnitScaleUpLimit = "<CapacityUnitScaleUpLimit>" # Maximum capacity until which scale up operations will occur

az elastic-san update -n $sanName -g $resourceGroupName --auto-scale-policy-enforcement $autoscalePolicyEnforcement --unused-size-tib $unusedSizeTiB --increase-capacity-unit-by-tib $increaseCapacityUnit --capacity-unit-scale-up-limit-tib $capacityUnitScaleUpLimit 
```

---

## Resize a volume

Once you expand the size of your SAN, you can either create more volumes, or expand the size of an existing volume. You can't decrease the size of your volumes.

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

If you expanded the size of your SAN, see [Create volumes](elastic-san-create.md#create-volumes) to create a new volume with the extra capacity.
