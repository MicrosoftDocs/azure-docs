---
title: Delete or update a Standby Pool for Virtual Machine Scale Sets
description: Learn how to delete or update a Standby Pool for Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---


# Update or delete a Standby Pool


> [!IMPORTANT]
> Standby Pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


## Update a Standby Pool

### [Portal](#tab/portal)
To update an existing Standby Pool, navigate to Virtual Machine Scale set the Standby Pool is associated with. Under **Availability + scale** select **Standby pool**. Select the **Manage pool** option. This brings up a window where you can adjust the provisioning state and maximum ready capacity. The Standby Pool name can only be set during Standby Pool creation. 

:::image type="content" source="media/standby-pools/managed-standby-pool-after-vmss-create.png" alt-text="A screenshot of the Networking tab in the Azure portal during the Virtual Machine Scale Set creation process.":::


### [CLI](#tab/cli)
Update an existing Standby Pool using [az standby-vm-pool update](/cli/azure/standby-pool).

```azurecli-interactive
az standby-vm-pool update \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --vm-state "Deallocated" \
```
### [PowerShell](#tab/powershell)
Update an existing Standby Pool using [Update-AzStandbyPool](/cli/azure/standby-pool).

```azurepowershell-interactive
Update-AzStandbyPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapcity 20 `
   -VirtualMachineState "Deallocated" `
```

### [ARM Template](#tab/template)
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

### [REST API](#tab/rest)
Update an existing Standby Pool using the Microsoft.Standby Pool REST API.

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

### [Bicep](#tab/bicep)
```bicep
param location string = resourceGroup().location

resource standbyPool 'Microsoft.standbypool/standbyvirtualmachinepools@2023-12-01-preview' = {
    name: {StandbyPoolName}
    location: location
    properties: {
        maxReadyCapacity: 20
        virtualMachineState: 'Deallocated'
        attachedVirtualMachineScaleSetId: ['/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Compute/virtualMachineScaleSets/{ScaleSetName}]
        }
    } 
```


---


## Delete a Standby Pool

### [Portal](#tab/portal1)

To delete an existing Standby Pool, navigate to Virtual Machine Scale set the Standby Pool is associated with. Under **Availability + scale** select **Standby pool**. Select **Delete pool**. This brings up a window where you can confirm the delete action. 

:::image type="content" source="media/standby-pools/delete-standby-pool-portal.png" alt-text="A screenshot showing how to delete a Standby Pool in the portal.":::



### [CLI](#tab/cli1)
Delete an existing Standby Pool using [az standbypool delete]().

```azurecli-interactive
az standby-vm-pool delete --resource-group myResourceGroup --name myStandbyPool
```
### [PowerShell](#tab/powershell1)
Delete an existing Standby Pool using [Delete-AzStandbyPool]().

```azurepowershell-interactive
Delete-AzStandbyPool -ResourceGroup myResourceGroup -Name myStandbyPool 
```

### [REST API](#tab/rest1)
Delete an existing Standby Pool using Microsoft.Standby Pool REST API. 

```HTTP
DELETE https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-12-01-preview
```

---

## Next steps
Review the most [frequently asked questions](standby-pools-faq.md) about Standby Pools for Virtual Machine Scale Sets.