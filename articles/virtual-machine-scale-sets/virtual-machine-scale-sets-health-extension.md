---
title: Use Application Health extension with Azure virtual machine scale sets | Microsoft Docs
description: Learn how to use the Application Health extension to monitor the health of your applications deployed on virtual machine scale sets.
services: virtual-machine-scale-sets
documentationcenter: ''
author: mayanknayar
manager: drewm
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 01/30/2019
ms.author: manayar

---
# Using Application Health extension with virtual machine scale sets
Monitoring your application health is an important signal for managing and upgrading your deployment. Azure virtual machine scale sets provide support for [rolling upgrades](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model) including [automatic OS-image upgrades](virtual-machine-scale-sets-automatic-upgrade.md), which rely on health monitoring of the individual instances to upgrade your deployment.

This article describes how you can use the Application Health extension to monitor the health of your applications deployed on virtual machine scale sets.

## Prerequisites
This article assumes that you are familiar with:
-	Azure virtual machine [extensions](../virtual-machines/extensions/overview.md)
-	[Modifying](virtual-machine-scale-sets-upgrade-scale-set.md) virtual machine scale sets

## When to use the Application Health extension
The Application Health extension is deployed inside a virtual machine scale set instance and reports on VM health from inside the scale set instance. You can configure the extension to probe on an application endpoint and update the status of the application on that instance. This instance status is checked by Azure to determine whether an instance is eligible for upgrade operations.

As the extension reports health from within a VM, the extension can be used in situations where external probes such as Application Health Probes (that utilize custom Azure Load Balancer [probes](../load-balancer/load-balancer-custom-probe-overview.md)) can’t be used.

## Extension schema

The following JSON shows the schema for the Application Health extension. The extension requires at a minimum either a "tcp" or "http" request with an associated port or request path respectively.

```json
{
  "type": "extensions",
  "name": "HealthExtension",
  "apiVersion": "2018-10-01",
  "location": "<location>",  
  "properties": {
    "publisher": "Microsoft.ManagedServices",
    "type": "< ApplicationHealthLinux or ApplicationHealthWindows>",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "<protocol>",
      "port": "<port>",
      "requestPath": "</requestPath>"
    }
  }
}  
```

### Property values

| Name | Value / Example | Data Type
| ---- | ---- | ---- 
| apiVersion | `2018-10-01` | date |
| publisher | `Microsoft.ManagedServices` | string |
| type | `ApplicationHealthLinux` (Linux), `ApplicationHealthWindows` (Windows) | string |
| typeHandlerVersion | `1.0` | int |

### Settings

| Name | Value / Example | Data Type
| ---- | ---- | ----
| protocol | `http` or `tcp` | string |
| port | Optional when protocol is `http`, mandatory when protocol is `tcp` | int |
| requestPath | Mandatory when protocol is `http`, not allowed when protocol is `tcp` | string |

## Deploy the Application Health extension
There are multiple ways of deploying the Application Health extension to your scale sets as detailed in the examples below.

### REST API

The following example adds the Application Health extension (with name myHealthExtension) to the extensionProfile in the scale set model of a Windows-based scale set.

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/extensions/myHealthExtension?api-version=2018-10-01`
```

```json
{
  "name": "myHealthExtension",
  "properties": {
    "publisher": " Microsoft.ManagedServices",
    "type": "< ApplicationHealthWindows>",
    "autoUpgradeMinorVersion": true,
    "typeHandlerVersion": "1.0",
    "settings": {
      "protocol": "<protocol>",
      "port": "<port>",
      "requestPath": "</requestPath>"
    }
  }
}
```
Use `PATCH` to edit an already deployed extension.

### Azure PowerShell

Use the [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) cmdlet to add the Application Health extension to the scale set model definition.

The following example adds the Application Health extension to the `extensionProfile` in the scale set model of a Windows-based scale set. The example uses the new Az PowerShell module.

```azurepowershell-interactive
# Define the scale set variables
$vmScaleSetName = "myVMScaleSet"
$vmScaleSetResourceGroup = "myVMScaleSetResourceGroup"

# Define the Application Health extension properties
$publicConfig = @{"protocol" = "http"; "port" = 80; "requestPath" = "/healthEndpoint"};
$extensionName = "myHealthExtension"
$extensionType = "ApplicationHealthWindows"
$publisher = "Microsoft.ManagedServices"

# Get the scale set object
$vmScaleSet = Get-AzVmss `
  -ResourceGroupName $vmScaleSetResourceGroup `
  -VMScaleSetName $vmScaleSetName

# Add the Application Health extension to the scale set model
Add-AzVmssExtension -VirtualMachineScaleSet $vmScaleSet `
  -Name $extensionName `
  -Publisher $publisher `
  -Setting $publicConfig `
  -Type $extensionType `
  -TypeHandlerVersion "1.0" `
  -AutoUpgradeMinorVersion $True

# Update the scale set
Update-AzVmss -ResourceGroupName $vmScaleSetResourceGroup `
  -Name $vmScaleSetName `
  -VirtualMachineScaleSet $vmScaleSet
```


### Azure CLI 2.0

Use [az vmss extension set](/cli/azure/vmss/extension#az-vmss-extension-set) to add the Application Health extension to the scale set model definition.

The following example adds the Application Health extension to the scale set model of a Windows-based scale set.

```azurecli-interactive
az vmss extension set \
  --name ApplicationHealthWindows \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --resource-group <myVMScaleSetResourceGroup> \
  --vmss-name <myVMScaleSet> \
  --settings ./extension.json
```


## Troubleshoot
Extension execution output is logged to files found in the following directories:

```Windows
C:\WindowsAzure\Logs\Plugins\Microsoft.ManagedServices.ApplicationHealthWindows\<version>\
```

```Linux
/var/lib/waagent/apphealth
```

The logs also periodically capture the application health status.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
