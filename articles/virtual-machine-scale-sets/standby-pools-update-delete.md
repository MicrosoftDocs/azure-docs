---
title: Delete or update a Standby Pool for Virtual Machine Scale Sets
description: Learn how to delete or update a Standby Pool for Virtual Machine Scale Sets
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

### [Portal](#tab/portal1)
To update the properties of an existing Standby Pool, navigate to the scale set that is associated with the Standby Pool you want to update. Under **Availability + scale** select **Standby Pool**. Select **Configuration Options** at the top of the screen. A window will pop up allowing you to update the Standby Pool configurations.  

:::image type="content" source="./media/standby-pools/update-standby-pool-1.png" alt-text="Image shows updating an existing Standby Pool.":::

### [CLI](#tab/cli1)
Update an existing Standby Pool using [az standbypool update]().

```azurecli-interactive
az standbypool update \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --virtual-machine-state "Deallocated" \
   --attached-scale-set "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```
### [PowerShell](#tab/powershell1)
Update an existing Standby Pool using [Update-AzStandbyPool]().

```azurepowershell-interactive
Update-AzStandbyPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapcity 20 `
   -VirtualMachineState "Deallocated" 
   -AttachedScaleSet "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```

### [ARM Template](#tab/template1)
```ARM
{
 "$schema": "https://schema.management.azure.com/schemas/2019-04-01/deploymentTemplate.json#",
 "contentVersion": "1.0.0.0",
 "parameters": {},
 "resources": [
     {
         "type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
         "apiVersion": "2023-06-01-preview",
         "name": "{StandbyPoolName}",
         "location": "{Location}",
         "properties": {
         "maxReadyCapacity": 20,
         "virtualMachineState": "Running",
         "attachedVirtualMachineScaleSetIds": []
         }
     }
 ]
}

```

### [REST API](#tab/rest1)
Update an existing Standby Pool using the Microsoft.Standby Pool REST API.

```HTTP
PUT https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-06-01-preview
{
    "type": "Microsoft.StandbyPool/standbyVirtualMachinePools",
    "name": "myStandbyPool",
    "location": "North Europe",
    "properties": {
        "maxReadyCapacity": 50,
        "virtualMachineState":"Deallocated",
        "attachedVirtualMachineScaleSetIds": [          
"/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachineScaleSets/{scaleSetName}"
        ]
    }
}
```
### [Terraform](#tab/terraform1)
```terraform
terraform {
     required_providers {
         azapi = {
             source = "Azure/azapi"
             version = "=0.1.0"
             }
     azurerm = {
         source = "hashicorp/azurerm"
         version = "=3.0.2"
         }
     }
}
provider "azapi" {
     default_location = "{Location}"
     skip_provider_registration = false
    }
provider "azurerm" {
     features {}
    }
resource "azapi_resource" "standbyVirtualMachinePool" {
     type = Microsoft.StandbyPool/standbyVirtualMachinePools@2023-06-01-preview
     parent_id = "/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/"
     name = "{StandbyPoolName}"
     location = "{Location}"
     body = jsonencode({
     properties = {
     maxReadyCapacity = 20
     virtualMachineState = "Running"
     attachedVirtualMachineScaleSetIds = ["/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Compute/virtualMachineScaleSets/{ScaleSetName}"]
         }
     })
 schema_validation_enabled = false
 ignore_missing_property = false
}
```

### [Bicep](#tab/bicep1)
```bicep
param location string = resourceGroup().location

resource standbyPool 'Microsoft.standbypool/standbyvirtualmachinepools@2023-06-01-preview' = {
    name: {StandbyPoolName}
    location: location
    properties: {
        maxReadyCapacity: 20
        virtualMachineState: 'Running'
        attachedVirtualMachineScaleSetIds: ['/subscriptions/{SubscriptionID}/resourceGroups/{ResourceGroup}/providers/Microsoft.Compute/virtualMachineScaleSets/{ScaleSetName}]
        }
    } 
```


---


## Delete a Standby Pool

### [Portal](#tab/portal2)
To delete an existing Standby Pool, navigate to the scale set that is associated with the Standby Pool you want to delete. Under **Availability + scale** select **Standby Pool**. Select **delete** at the top of the screen. This deletes the Standby Pool and all the instances inside of the pool.   

:::image type="content" source="./media/standby-pools/update-standby-pool-1.png" alt-text="Image shows deleting an existing Standby Pool.":::

### [CLI](#tab/cli2)
Delete an existing Standby Pool using [az standbypool delete]().

```azurecli-interactive
az standbypool delete --resource-group myResourceGroup --name myStandbyPool
```
### [PowerShell](#tab/powershell2)
Delete an existing Standby Pool using [Delete-AzStandbyPool]().

```azurepowershell-interactive
Delete-AzStandbyPool -ResourceGroup myResourceGroup -Name myStandbyPool 
```

### [REST API](#tab/rest2)
Delete an existing Standby Pool using Microsoft.Standby Pool REST API. 

```HTTP
Delete https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-06-01-preview
```

---

## Next steps
Review the most [frequently asked questions](standby-pools-faq.md) about Standby Pools for Virtual Machine Scale Sets.