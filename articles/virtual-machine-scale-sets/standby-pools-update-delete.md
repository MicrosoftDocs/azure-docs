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

### [CLI](#tab/cli)
Update an existing Standby Pool using [az standbypool update]().

```azurecli-interactive
az standbypool update \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --virtual-machine-state "Deallocated" \
   --attached-scale-set "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```
### [PowerShell](#tab/powershell)
Update an existing Standby Pool using [Update-AzStandbyPool]().

```azurepowershell-interactive
Update-AzStandbyPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapcity 20 `
   -VirtualMachineState "Deallocated" `
   -AttachedScaleSet "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
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

### [REST API](#tab/rest)
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
### [Terraform](#tab/terraform)
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

### [Bicep](#tab/bicep)
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

### [CLI](#tab/cli)
Delete an existing Standby Pool using [az standbypool delete]().

```azurecli-interactive
az standbypool delete --resource-group myResourceGroup --name myStandbyPool
```
### [PowerShell](#tab/powershell)
Delete an existing Standby Pool using [Delete-AzStandbyPool]().

```azurepowershell-interactive
Delete-AzStandbyPool -ResourceGroup myResourceGroup -Name myStandbyPool 
```

### [REST API](#tab/rest)
Delete an existing Standby Pool using Microsoft.Standby Pool REST API. 

```HTTP
DELETE https://management.azure.com/subscriptions/{subscriptionID}/resourceGroups/{resourceGroupName}/providers/Microsoft.StandbyPool/standbyVirtualMachinePools/{standbyPoolName}?api-version=2023-06-01-preview
```

---

## Next steps
Review the most [frequently asked questions](standby-pools-faq.md) about Standby Pools for Virtual Machine Scale Sets.