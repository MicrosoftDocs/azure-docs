---
title: Create a Standby Pool for Virtual Machine Scale Sets
description: Learn how to create a Standby Pool to reduce scale-out latency with Virtual Machine Scale Sets
author: mimckitt
ms.author: mimckitt
ms.service: virtual-machine-scale-sets
ms.topic: how-to
ms.date: 01/16/2024
ms.reviewer: ju-shim
---


# Create a Standby Pool


## Prerequisites

> [!IMPORTANT]
> Standby Pools for Virtual Machine Scale Sets are currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA). 


### Feature Registration 
Register the Standby Pool Resource Provider and the Standby Pool Preview Feature with your subscription using PowerShell in Azure Cloud Shell. Registration can take about 30 mins to take effect. You can rerun the below commands to determine when the feature has been successfully registered. 

```azurepowershell-interactive
Register-AzResourceProvider -ProviderNamespace Microsoft.StandbyPool

Register-AzProviderFeature -FeatureName StandbyVMPoolPreview -ProviderNamespace Microsoft.StandbyPool
```

### RBAC Permissions
In order for Standby Pools to successfully create Virtual Machines, you need to assign the appropriate RBAC roles. 
1) In the Azure Portal, navigate to your subscriptions. 
2) Select the subscription you want to adjust RBAC permissions. 
3) Select **Access Control (IAM)**.
4) Select Add -> **Add Role Assignment**.
5) Search for **Virtual Machine Contributor** and highlight it. Select **Next**. 
6) Click on **+ Select Members**.
7) Search for **Standby Pool Resource Provider** 
8) Select the Standby Pool Resource Provider and select **Review + Assign**.
9) Repeat the above steps and but in step 5, assign the **Network Contributor** role.  

If you're using a customized image in Compute Gallery, ensure to assign Standby Pool Resource Provider the **Compute Gallery Sharing Admin** permissions as well.

For more information on assigning roles, see [Assign Azure roles using the Azure portal](../role-based-access-control/role-assignments-portal.md)

## Create a Standby Pool

### [Portal](#tab/portal1)
A Standby Pool can be created as part of the Virtual Machine Scale Set creation process or created and attached to an existing scale set. 

During Virtual Machine Scale Set creation, navigate to the **Management** tab. Select **Add a Standby Pool**.

:::image type="content" source="./media/standby-pools/create-standby-pool-1.png" alt-text="Image shows selecting to create a Standby Pool during scale set creation.":::

Input the desired Max Ready Capacity and Virtual Machine State. 

:::image type="content" source="./media/standby-pools/create-standby-pool-2.png" alt-text="Image shows selecting the Standby Pool configuration options during scale set creation.":::

If you instead choose to create a Standby Pool on an existing Virtual Machine Scale set, navigate to the scale set you want to associate a Standby Pool with. Under **Availability + scale**, select **Standby Pool**. Select **Create Standby Pool** and input your desired configurations. 

:::image type="content" source="./media/standby-pools/create-standby-pool-3.png" alt-text="Image shows updating the Standby Pool configuration option.":::

 

### [CLI](#tab/cli1)
Create a Standby Pool and associate it with an existing scale set using [az standbypool create]().

```azurecli-interactive
az standbypool create \
   --resource-group myResourceGroup 
   --name myStandbyPool \
   --max-ready-capacity 20 \
   --virtual-machine-state "Deallocated" \
   --attached-scale-set "/subscriptions/{subscriptionID}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet"
```
### [PowerShell](#tab/powershell1)
Create a Standby Pool and associate it with an existing scale set using [Create-AzStandbyPool]().

```azurepowershell-interactive
Create-AzStandbyPool `
   -ResourceGroup myResourceGroup 
   -Name myStandbyPool `
   -MaxReadyCapacity 20 `
   -VirtualMachineState "Deallocated" `
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
Create a Standby Pool and associate it with an existing scale set using the Microsoft.StandbyPool REST command.
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
Create a Standby Pool and associate it with an existing Scale Set using Terraform. Include Standby Pool name, Location, Max Ready Capacity, Virtual Machine Running State and the scale set ID you want associated. 

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


## Next steps

Learn how to [update and delete a Standby Pool](standby-pools-update-delete.md)