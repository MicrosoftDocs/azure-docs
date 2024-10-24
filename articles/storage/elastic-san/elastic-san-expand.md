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

## Autoscale (Preview)

You can set up a policy to automatically scale up your SAN by specific increments until a specified maximum size. The capacity increments have a minimum of 1 TiB, and you can only set up an autoscale policy for additional capacity units. This means that your performance will not scale up with your storage. A sample autoscale policy would look like this:  
  
**If spare capacity (unused capacity) is less than X TiB of space, increase capacity by Y TiB, up-to a maximum of Z Tib.** 
  
Here X is the amount of storage capacity you require to be unused, Y is the increment by which you are increasing the capacity of the SAN (minimum increments of 1 TiB), and Z is the maximum capacity of the SAN. The policy will trigger when you have less than X TiB of unused space on your SAN. Space is consumed at the SAN level via provisioning volumes and taking snapshots, so if your usage exceeds the required value of unused space at the SAN level, the policy triggers and the SAN size increases by Y TiB. 
  
If you want to scale your SAN down, you will need to do it manually by following the process outlined earlier. Note that if you want to scale your SAN down and the amount by which you are scaling down your SAN is greater than the value of the unused capacity field set in the policy, the request will fail and you will have to edit or disable your policy to complete this action. For example, if you have a SAN of size 6 TiB and a policy that states that the spare/unused capacity should be 2 TiB, you cannot reduce the total size of the SAN by 4 TiB as according to the policy, there must be at least 2 TiB of unused capacity at all times.

# [PowerShell](#tab/azure-powershell)

```azurepowershell
# Define some variables.
autoscalePolicyEnforcement = "<Enabled or Disabled>" # Whether autoscale is enabled or disabled at the SAN level
unusedSizeTiB = "<UnusedSizeTiB>" # Unused capacity on the SAN
increaseCapacityUnit = "<IncreaseCapacityUnit>" # Amount by which the SAN will scale up if the policy is triggered
capacityUnitScaleUpLimit = "<CapacityUnitScaleUpLimit>" # Maximum capacity until which scale up operations will occur

Update-AzElasticSan -ResourceGroupName myresourcegroup -Name myelasticsan -AutoScalePolicyEnforcement $autoscalePolicyEnforcement -UnusedSizeTiB $unusedSizeTiB    -IncreaseCapacityUnitByTiB $increaseCapacityUnit -CapacityUnitScaleUpLimitTiB $capacityUnitScaleUpLimit  
```

# [Azure CLI](#tab/azure-cli)

```azurecli
# Define some variables.
autoscalePolicyEnforcement = "<Enabled or Disabled>" # Whether autoscale is enabled or disabled at the SAN level
unusedSizeTiB = "<UnusedSizeTiB>" # Unused capacity on the SAN
increaseCapacityUnit = "<IncreaseCapacityUnit>" # Amount by which the SAN will scale up if the policy is triggered
capacityUnitScaleUpLimit = "<CapacityUnitScaleUpLimit>" # Maximum capacity until which scale up operations will occur

az elastic-san update -n $sanName -g $resourceGroupName --auto-scale-policy-enforcement $autoscalePolicyEnforcement --unused-size-tib $unusedSizeTiB --increase-capacity-unit-by-tib $increaseCapacityUnit --capacity-unit-scale-up-limit-tib $capacityUnitScaleUpLimit 
```

---

## Resize a volume

Once you've expanded the size of your SAN, you can either create more volumes, or expand the size of an existing volume. You cannot decrease the size of your volumes.

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
