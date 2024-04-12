---
title: Create a standby pool for Virtual Machine Scale Sets
description: Learn how to create a standby pool to reduce scale-out latency with Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/03/2024
ms.reviewer: ju-shim
---


# Create a standby pool
This article steps through creating a standby pool for Virtual Machine Scale Sets with Flexible Orchestration.

## Prerequisites

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


### Feature Registration 
Register the standby pool resource provider and the standby pool preview feature with your subscription using PowerShell in Azure Cloud Shell. Registration can take up to 30 mins success show as registered. You can rerun the below commands to determine when the feature is successfully registered. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.StandbyPool

Register-AzProviderFeature -FeatureName StandbyVMPoolPreview -ProviderNamespace Microsoft.StandbyPool
```

### Role-based Access Control Permissions
In order for standby pools to successfully create Virtual Machines, you need to assign the appropriate RBAC roles. 
1) In the Azure portal, navigate to your subscriptions. 
2) Select the subscription you want to adjust RBAC permissions. 
3) Select **Access Control (IAM)**.
4) Select Add -> **Add Role Assignment**.
5) Search for **Virtual Machine Contributor** and highlight it. Select **Next**. 
6) Click on **+ Select Members**.
7) Search for **Standby pool Resource Provider** 
8) Select the standby pool Resource Provider and select **Review + Assign**.
9) Repeat the above steps and for the **Network Contributor** role and the **Managed Identity Operator** role.  

If you're using a customized image in Compute Gallery, ensure to assign standby pool Resource Provider the **Compute Gallery Sharing Admin** permissions as well.

For more information on assigning roles, see [assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md).

## Create a standby pool

### [Portal](#tab/portal)

To set up a standby pool for an existing Virtual Machine Scale Set, navigate to Virtual Machine Scale Set and under **Availability + scale** select **Standby pool**. Select the **Managed pool** option and input the name you would like your pool to be associated with, the provisioning state of the VMs and the maximum ready capacity. Select **Save**. 

:::image type="content" source="media/standby-pools/enable-standby-pool-after-vmss-creation.png" alt-text="A screenshot showing how to enable a standby pool on an existing Virtual Machine Scale Set in the Azure portal.":::

You can also configure a standby pool during Virtual Machine Scale Set creation by navigating to the **Management** tab and checking the box to enable standby pools. 

:::image type="content" source="media/standby-pools/enable-standby-pool-during-vmss-create.png" alt-text="A screenshot showing how to enable a standby pool during the Virtual Machine Scale Set create experience in the portal.":::


### [CLI](#tab/cli)
Create a standby pool and associate it with an existing scale set using [az standby-vm-pool create](/cli/azure/standby-pool).

```azurecli-interactive
az standby-vm-pool create \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --vm-state "Deallocated" \
   --vmss-id "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```
### [PowerShell](#tab/powershell)
Create a standby pool and associate it with an existing scale set using [Create-AzStandbyPool](/cli/azure/standby-pool).

```azurepowershell-interactive
New-AzStandbyVMPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapacity 20 `
   -VMState "Deallocated" `
   -VMSSId "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```

### [ARM template](#tab/template)

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
Create a standby pool and associate it with an existing scale set using the Microsoft.StandbyPool REST command.
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

## Next steps

Learn how to [update and delete a standby pool](standby-pools-update-delete.md).
