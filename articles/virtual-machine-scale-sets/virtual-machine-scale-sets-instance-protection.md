---
title: Instance Protection for Azure virtual machine scale set instances
description: Learn how to protect Azure virtual machine scale set instances from scale-in and scale-set operations.
author: avirishuv
ms.author: avverma
ms.topic: conceptual
ms.service: virtual-machine-scale-sets
ms.subservice: instance-protection
ms.date: 02/26/2020
ms.reviewer: jushiman
ms.custom: avverma

---
# Instance Protection for Azure virtual machine scale set instances

Azure virtual machine scale sets enable better elasticity for your workloads through [Autoscale](virtual-machine-scale-sets-autoscale-overview.md), so you can configure when your infrastructure scales-out and when it scales-in. Scale sets also enable you to centrally manage, configure, and update a large number of VMs through different [upgrade policy](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) settings. You can configure an update on the scale set model and the new configuration is applied automatically to every scale set instance if you've set the upgrade policy to Automatic or Rolling.

As your application processes traffic, there can be situations where you want specific instances to be treated differently from the rest of the scale set instance. For example, certain instances in the scale set could be performing long-running operations, and you don't want these instances to be scaled-in until the operations complete. You might also have specialized a few instances in the scale set to perform additional or different tasks than the other members of the scale set. You require these 'special' VMs not to be modified with the other instances in the scale set. Instance protection provides the additional controls to enable these and other scenarios for your application.

This article describes how you can apply and use the different instance protection capabilities with scale set instances.

## Types of instance protection
Scale sets provide two types of instance protection capabilities:

-	**Protect from scale-in**
    - Enabled through **protectFromScaleIn** property on the scale set instance
    - Protects instance from Autoscale initiated scale-in
    - User-initiated instance operations (including instance delete) are **not blocked**
    - Operations initiated on the scale set (upgrade, reimage, deallocate, etc.) are **not blocked**

-	**Protect from scale set actions**
    - Enabled through **protectFromScaleSetActions** property on the scale set instance
    - Protects instance from Autoscale initiated scale-in
    - Protects instance from operations initiated on the scale set (such as upgrade, reimage, deallocate, etc.)
    - User-initiated instance operations (including instance delete) are **not blocked**
    - Delete of the full scale set is **not blocked**

## Protect from scale-in
Instance protection can be applied to scale set instances after the instances are created. Protection is applied and modified only on the [instance model](virtual-machine-scale-sets-upgrade-scale-set.md#the-scale-set-vm-model-view) and not on the [scale set model](virtual-machine-scale-sets-upgrade-scale-set.md#the-scale-set-model).

There are multiple ways of applying scale-in protection on your scale set instances as detailed in the examples below.

### Azure portal

You can apply scale-in protection through the Azure portal to an instance in the scale set. You cannot adjust more than one instance at a time. Repeat the steps for each instance you want to protect.
 
1. Go to an existing virtual machine scale set.
1. Select **Instances** from the menu on the left, under **Settings**.
1. Select the name of the instance you want to protect.
1. Select the **Protection Policy** tab.
1. In the **Protection Policy** blade, select the **Protect from scale-in** option.
1. Select **Save**. 

### REST API

The following example applies scale-in protection to an instance in the scale set.

```
PUT on `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vmScaleSetName}/virtualMachines/{instance-id}?api-version=2019-03-01`
```

```json
{
  "properties": {
    "protectionPolicy": {
      "protectFromScaleIn": true
    }
  }        
}

```

> [!NOTE]
>Instance protection is only supported with API version 2019-03-01 and above

### Azure PowerShell

Use the [Update-AzVmssVM](/powershell/module/az.compute/update-azvmssvm) cmdlet to apply scale-in protection to your scale set instance.

The following example applies scale-in protection to an instance in the scale set having instance ID 0.

```azurepowershell-interactive
Update-AzVmssVM `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myVMScaleSet" `
  -InstanceId 0 `
  -ProtectFromScaleIn $true
```

### Azure CLI 2.0

Use [az vmss update](/cli/azure/vmss#az_vmss_update) to apply scale-in protection to your scale set instance.

The following example applies scale-in protection to an instance in the scale set having instance ID 0.

```azurecli-interactive
az vmss update \  
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --instance-id 0 \
  --protect-from-scale-in true
```

## Protect from scale set actions
Instance protection can be applied to scale set instances after the instances are created. Protection is applied and modified only on the [instance model](virtual-machine-scale-sets-upgrade-scale-set.md#the-scale-set-vm-model-view) and not on the [scale set model](virtual-machine-scale-sets-upgrade-scale-set.md#the-scale-set-model).

Protecting an instance from scale set actions also protects the instance from Autoscale initiated scale-in.

There are multiple ways of applying scale set actions protection on your scale set instances as detailed in the examples below.

### Azure portal

You can apply protection from scale set actions through the Azure portal to an instance in the scale set. You cannot adjust more than one instance at a time. Repeat the steps for each instance you want to protect.
 
1. Go to an existing virtual machine scale set.
1. Select **Instances** from the menu on the left, under **Settings**.
1. Select the name of the instance you want to protect.
1. Select the **Protection Policy** tab.
1. In the **Protection Policy** blade, select the **Protect from scale set actions** option.
1. Select **Save**. 

### REST API

The following example applies protection from scale set actions to an instance in the scale set.

```
PUT on `/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{vMScaleSetName}/virtualMachines/{instance-id}?api-version=2019-03-01`
```

```json
{
  "properties": {
    "protectionPolicy": {
      "protectFromScaleIn": true,
      "protectFromScaleSetActions": true
    }
  }        
}

```

> [!NOTE]
>Instance protection is only supported with API version 2019-03-01 and above.</br>
Protecting an instance from scale set actions also protects the instance from Autoscale initiated scale-in. You can't specify "protectFromScaleIn": false when setting "protectFromScaleSetActions": true

### Azure PowerShell

Use the [Update-AzVmssVM](/powershell/module/az.compute/update-azvmssvm) cmdlet to apply protection from scale set actions to your scale set instance.

The following example applies protection from scale set actions to an instance in the scale set having instance ID 0.

```azurepowershell-interactive
Update-AzVmssVM `
  -ResourceGroupName "myResourceGroup" `
  -VMScaleSetName "myVMScaleSet" `
  -InstanceId 0 `
  -ProtectFromScaleIn $true `
  -ProtectFromScaleSetAction $true
```

### Azure CLI 2.0

Use [az vmss update](/cli/azure/vmss#az_vmss_update) to apply protection from scale set actions to your scale set instance.

The following example applies protection from scale set actions to an instance in the scale set having instance ID 0.

```azurecli-interactive
az vmss update \  
  --resource-group <myResourceGroup> \
  --name <myVMScaleSet> \
  --instance-id 0 \
  --protect-from-scale-in true \
  --protect-from-scale-set-actions true
```

## Troubleshoot
### No protectionPolicy on scale set model
Instance protection is only applicable on scale set instances and not on the scale set model.

### No protectionPolicy on scale set instance model
By default, protection policy is not applied to an instance when it is created.

You can apply instance protection to scale set instances after the instances are created.

### Not able to apply instance protection
Instance protection is only supported with API version 2019-03-01 and above. Check the API version being used and update as required. You might also need to update your PowerShell or CLI to the latest version.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
