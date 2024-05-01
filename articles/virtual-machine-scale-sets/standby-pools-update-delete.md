---
title: Delete or update a standby pool for Virtual Machine Scale Sets
description: Learn how to delete or update a standby pool for Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/22/2024
ms.reviewer: ju-shim
---


# Update or delete a standby pool (Preview)


> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


## Update a standby pool

You can update the state of the instances and the max ready capacity of your standby pool at any time. The standby pool name can only be set during standby pool creation. 

### [Portal](#tab/portal-1)
1) Navigate to Virtual Machine Scale set the standby pool is associated with. 
2) Under **Availability + scale** select **Standby pool**. 
3) Select **Manage pool**. 
4) Update the configuration and save any changes.  

:::image type="content" source="media/standby-pools/managed-standby-pool-after-vmss-create.png" alt-text="A screenshot of the Networking tab in the Azure portal during the Virtual Machine Scale Set creation process.":::


### [CLI](#tab/cli-1)
Update an existing standby pool using [az standby-vm-pool update](/cli/azure/standby-pool).

```azurecli-interactive
az standby-vm-pool update \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --vm-state "Deallocated" \
```
### [PowerShell](#tab/powershell-1)
Update an existing standby pool using [Update-AzStandbyVMPool](/powershell/module/az.standbypool/update-azstandbyvmpool).

```azurepowershell-interactive
Update-AzStandbyVMPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapcity 20 `
   -VMState "Deallocated" `
```

### [ARM template](#tab/template-1)
```ARM
{
 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
 "contentVersion": "1.0.0.0",
 "parameters": {},
 "resources": [
     {
         "type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
         "apiVersion": "2023-12-01-preview",
         "name": "{StandbyPoolName}",
         "location": "{Location}",
         "properties": {
         "maxReadyCapacity": 20,
         "virtualMachineState": "Deallocated",
         "attachedVirtualMachineScaleSetId": ["/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Compute/virtualMachineScaleSets/{ScaleSetName}"]
         }
     }
 ]
}

```

### [REST](#tab/rest)
Update an existing standby pool using [Create or Update](/rest/api/standbypool/standby-virtual-machine-pools/create-or-update).

```HTTP
PUT https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-12-01-preview
{
"type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
"name": "{standbyPoolName}",
"location": "{location}",
"properties": {
	 "elasticityProfile": {
		 "maxReadyCapacity": 20
	 },
	  "virtualMachineState":"Deallocated",
	  "attachedVirtualMachineScaleSetId": "/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{scaleSetName}"
	  }
}
```

### [Bicep](#tab/bicep-1)
Update an existing standby pool deployment. Deploy the updated template using [az deployment group create](/cli/azure/deployment/group) or [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).

```bicep
param location string = resourceGroup().location
param standbyPoolName string = '{standbyPoolName}'
param maxReadyCapacity int = {maxReadyCapacityCount}
@allowed([
  'Running'
  'Deallocated'
])
param vmState string = '{vmState}'
param virtualMachineScaleSetId string = '{vmssId}'

resource standbyPool 'Microsoft.standbypool/standbyvirtualmachinepools@2023-12-01-preview' = {
  name: standbyPoolName
  location: location
  properties: {
     elasticityProfile: {
      maxReadyCapacity: maxReadyCapacity
    }
    virtualMachineState: vmState
    attachedVirtualMachineScaleSetId: virtualMachineScaleSetId
  }
}
```


---


## Delete a standby pool

### [Portal](#tab/portal-2)

1) Navigate to Virtual Machine Scale set the standby pool is associated with. 
2) Under **Availability + scale** select **Standby pool**. 
3) Select **Delete pool**. 
4) Select **Delete**. 

:::image type="content" source="media/standby-pools/delete-standby-pool-portal.png" alt-text="A screenshot showing how to delete a standby pool in the portal.":::



### [CLI](#tab/cli-2)
Delete an existing standby pool using [az standbypool delete](/cli/azure/standby-pool).

```azurecli-interactive
az standby-vm-pool delete --resource-group myResourceGroup --name myStandbyPool
```
### [PowerShell](#tab/powershell-2)
Delete an existing standby pool using [Remove-AzStandbyVMPool](/powershell/module/az.standbypool/remove-azstandbyvmpool).

```azurepowershell-interactive
Remove-AzStandbyVMPool -ResourceGroup myResourceGroup -Name myStandbyPool -Nowait
```

### [REST](#tab/rest-2)
Delete an existing standby pool using [Delete](/rest/api/standbypool/standby-virtual-machine-pools/delete).

```HTTP
DELETE https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-12-01-preview
```

---

## Next steps
Review the most [frequently asked questions](standby-pools-faq.md) about standby pools for Virtual Machine Scale Sets.
