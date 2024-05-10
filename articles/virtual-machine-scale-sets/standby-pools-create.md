---
title: Create a standby pool for Virtual Machine Scale Sets (Preview)
description: Learn how to create a standby pool to reduce scale-out latency with Virtual Machine Scale Sets.
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 04/22/2024
ms.reviewer: ju-shim
---


# Create a standby pool (Preview)
This article steps through creating a standby pool for Virtual Machine Scale Sets with Flexible Orchestration.

> [!IMPORTANT]
> Standby pools for Virtual Machine Scale Sets with Flexible Orchestration is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 

## Prerequisites
Before utilizing standby pools, complete the feature registration and configure role based access controls. 

### Feature Registration 
Register the standby pool resource provider and the standby pool preview feature with your subscription using Azure Cloud Shell. Registration can take up to 30 minutes to successfully show as registered. You can rerun the below commands to determine when the feature is successfully registered. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.StandbyPool

Register-AzProviderFeature -FeatureName StandbyVMPoolPreview -ProviderNamespace Microsoft.StandbyPool
```

Alternatively, you can register directly in the Azure portal. 
1) In the Azure portal, navigate to your subscriptions. 
2) Select the subscription you want to enable standby pools. 
3) Under settings, select **Resource providers**.
4) Search for **Microsoft.StandbyPool** and register the provider. 
5) Under settings, select **Preview features**.
6) Search for **Standby Virtual Machine Pool Preview** and register the feature.


### Role-based Access Control Permissions
To allow standby pools to create virtual machines, you need to assign the appropriate RBAC permissions.
 
1) In the Azure portal, navigate to your subscriptions. 
2) Select the subscription you want to adjust RBAC permissions. 
3) Select **Access Control (IAM)**.
4) Select Add -> **Add Role Assignment**.
5) Search for **Virtual Machine Contributor** and highlight it. Select **Next**. 
6) Click on **+ Select Members**.
7) Search for **Standby pool Resource Provider**.
8) Select the standby pool Resource Provider and select **Review + Assign**.
9) Repeat the above steps and for the **Network Contributor** role and the **Managed Identity Operator** role.  

If you're using images stored in Compute Gallery when deploying your scale set, also repeat the above steps for the **Compute Gallery Sharing Admin** role.

For more information on assigning roles, see [assign Azure roles using the Azure portal](../role-based-access-control/quickstart-assign-role-user-portal.md).

## Create a standby pool

### [Portal](#tab/portal)

1) Navigate to your Virtual Machine Scale Set
2) Under **Availability + scale** select **Standby pool**. 
3) Select **Manage pool**.
4) Provide a name for your pool, provisioning state and maximum ready capacity.
5) Select **Save**.

:::image type="content" source="media/standby-pools/enable-standby-pool-after-vmss-creation.png" alt-text="A screenshot showing how to enable a standby pool on an existing Virtual Machine Scale Set in the Azure portal.":::

You can also configure a standby pool during Virtual Machine Scale Set creation by navigating to the **Management** tab and checking the box to enable standby pools. 

:::image type="content" source="media/standby-pools/enable-standby-pool-during-vmss-create.png" alt-text="A screenshot showing how to enable a standby pool during the Virtual Machine Scale Set create experience in the portal.":::


### [CLI](#tab/cli)
Create a standby pool and associate it with an existing scale set using [az standby-vm-pool create](/cli/azure/standby-vm-pool).

```azurecli-interactive
az standby-vm-pool create \
   --resource-group myResourceGroup 
   --location eastus \
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --vm-state "Deallocated" \
   --vmss-id "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```
### [PowerShell](#tab/powershell)
Create a standby pool and associate it with an existing scale set using [New-AzStandbyVMPool](/powershell/module/az.standbypool/new-azstandbyvmpool).

```azurepowershell-interactive
New-AzStandbyVMPool `
   -ResourceGroup myResourceGroup `
   -Location eastus `
   -Name myStandbyPool `
   -MaxReadyCapacity 20 `
   -VMState "Deallocated" `
   -VMSSId "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```

### [ARM template](#tab/template)
Create a standby pool and associate it with an existing scale set. Create a template and deploy it using [az deployment group create](/cli/azure/deployment/group) or [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).


```json
{
    "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
    "contentVersion": "1.0.0.0",
    "parameters": {
        "location": {
           "type": "string",
           "defaultValue": "east us"    
        },
        "name": {
           "type": "string",
           "defaultValue": "myStandbyPool"
        },
        "maxReadyCapacity" : {
           "type": "int",
           "defaultValue": 10
        },
        "virtualMachineState" : {
           "type": "string",
           "defaultValue": "Deallocated"
        },
        "attachedVirtualMachineScaleSetId" : {
           "type": "string",
           "defaultValue": "/subscriptions/{subscriptionID}/resourceGroups/StandbyPools/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
        }
    },
    "resources": [ 
        {
            "type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
            "apiVersion": "2023-12-01-preview",
            "name": "[parameters('name')]",
            "location": "[parameters('location')]",
            "properties": {
               "elasticityProfile": {
                   "maxReadyCapacity": "[parameters('maxReadyCapacity')]" 
               },
               "virtualMachineState": "[parameters('virtualMachineState')]",
               "attachedVirtualMachineScaleSetId": "[parameters('attachedVirtualMachineScaleSetId')]"
            }
        }
    ]
   }

```


### [Bicep](#tab/bicep)
Create a standby pool and associate it with an existing scale set. Deploy the template using [az deployment group create](/cli/azure/deployment/group) or [New-AzResourceGroupDeployment](/powershell/module/az.resources/new-azresourcegroupdeployment).

```bicep
param location string = resourceGroup().location
param standbyPoolName string = 'myStandbyPool'
param maxReadyCapacity int = 20
@allowed([
  'Running'
  'Deallocated'
])
param vmState string = 'Deallocated'
param virtualMachineScaleSetId string = '/subscriptions/{subscriptionID}/resourceGroups/StandbyPools/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet}'

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

### [REST](#tab/rest)
Create a standby pool and associate it with an existing scale set using [Create or Update](/rest/api/standbypool/standby-virtual-machine-pools/create-or-update)

```HTTP
PUT https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/myStandbyPool?api-version=2023-12-01-preview
{
"type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
"name": "myStandbyPool",
"location": "east us",
"properties": {
	 "elasticityProfile": {
		 "maxReadyCapacity": 20
	 },
	  "virtualMachineState":"Deallocated",
	  "attachedVirtualMachineScaleSetId": "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
	  }
}
```

---

## Next steps

Learn how to [update and delete a standby pool](standby-pools-update-delete.md).
