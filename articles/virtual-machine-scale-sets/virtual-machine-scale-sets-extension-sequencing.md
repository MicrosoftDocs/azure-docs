---
title: Use extension sequencing with Azure virtual machine scale sets
description: Learn how to sequence extension provisioning when deploying multiple extensions on virtual machine scale sets.
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: extensions
ms.date: 01/30/2019
ms.reviewer: mimckitt
ms.custom: mimckitt

---
# Sequence extension provisioning in virtual machine scale sets
Azure virtual machine extensions provide capabilities such as post-deployment configuration and management, monitoring, security, and more. Production deployments typically use a combination of multiple extensions configured for the VM instances to achieve desired results.

When using multiple extensions on a virtual machine, it's important to ensure that extensions requiring the same OS resources aren't trying to acquire these resources at the same time. Some extensions also depend on other extensions to provide required configurations such as environment settings and secrets. Without the correct ordering and sequencing in place, dependent extension deployments can fail.

This article details how you can sequence extensions to be configured for the VM instances in virtual machine scale sets.

## Prerequisites
This article assumes that you're familiar with:
-	Azure virtual machine [extensions](../virtual-machines/extensions/overview.md)
-	[Modifying](virtual-machine-scale-sets-upgrade-scale-set.md) virtual machine scale sets

## When to use extension sequencing
Sequencing extensions in not mandatory for scale sets, and unless specified, extensions can be provisioned on a scale set instance in any order.

For example, if your scale set model has two extensions – ExtensionA and ExtensionB – specified in the model, then either of the following provisioning sequences may occur:
-	ExtensionA -> ExtensionB
-	ExtensionB -> ExtensionA

If your application requires Extension A to always be provisioned before Extension B, then you should use extension sequencing as described in this article. With extension sequencing, only one sequence will now occur:
-	ExtensionA - > ExtensionB

Any extensions not specified in a defined provisioning sequence can be provisioned at any time, including before, after, or during a defined sequence. Extension sequencing only specifies that a specific extension will be provisioned after another specific extension. It does not impact the provisioning of any other extension defined in the model.

For example, if your scale set model has three extensions – Extension A, Extension B and Extension C – specified in the model, and Extension C is set to be provisioned after Extension A, then either of the following provisioning sequences may occur:
-	ExtensionA -> ExtensionC -> ExtensionB
-	ExtensionB -> ExtensionA -> ExtensionC
-	ExtensionA -> ExtensionB -> ExtensionC

If you need to ensure that no other extension is provisioned while the defined extension sequence is executing, we recommend sequencing all extensions in your scale set model. In the above example, Extension B can be set to be provisioned after Extension C such that only one sequence can occur:
-	ExtensionA -> ExtensionC -> ExtensionB


## How to use extension sequencing
To sequence extension provisioning, you must update the extension definition in the scale set model to include the property "provisionAfterExtensions", which accepts an array of extension names. The extensions mentioned in the property array value must be fully defined in the scale set model.

### Template Deployment
The following example defines a template where the scale set has three extensions – ExtensionA, ExtensionB, and ExtensionC – such that extensions are provisioned in the order:
-	ExtensionA -> ExtensionB -> ExtensionC

```json
"virtualMachineProfile": {
  "extensionProfile": {
    "extensions": [
      {
        "name": "ExtensionA",
        "properties": {
          "publisher": "ExtensionA.Publisher",
          "settings": {},
          "typeHandlerVersion": "1.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionA"
        }
      },
      {
        "name": "ExtensionB",
        "properties": {
          "provisionAfterExtensions": [
            "ExtensionA"
          ],
          "publisher": "ExtensionB.Publisher",
          "settings": {},
          "typeHandlerVersion": "2.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionB"
        }
      }, 
      {
        "name": "ExtensionC",
        "properties": {
          "provisionAfterExtensions": [
            "ExtensionB"
          ],
          "publisher": "ExtensionC.Publisher",
          "settings": {},
          "typeHandlerVersion": "3.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionC"                   
        }
      }
    ]
  }
}
```

Since the property "provisionAfterExtensions" accepts an array of extension names, the above example can be modified such that ExtensionC is provisioned after ExtensionA and ExtensionB, but no ordering is required between ExtensionA and ExtensionB. The following template can be used to achieve this scenario:

```json
"virtualMachineProfile": {
  "extensionProfile": {
    "extensions": [
      {
        "name": "ExtensionA",
        "properties": {
          "publisher": "ExtensionA.Publisher",
          "settings": {},
          "typeHandlerVersion": "1.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionA"
        }
      },
      {
        "name": "ExtensionB",
        "properties": {
          "publisher": "ExtensionB.Publisher",
          "settings": {},
          "typeHandlerVersion": "2.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionB"
        }
      }, 
      {
        "name": "ExtensionC",
        "properties": {
          "provisionAfterExtensions": [
            "ExtensionA","ExtensionB"
          ],
          "publisher": "ExtensionC.Publisher",
          "settings": {},
          "typeHandlerVersion": "3.0",
          "autoUpgradeMinorVersion": true,
          "type": "ExtensionC"                   
        }
      }
    ]
  }
}
```

### REST API
The following example adds a new extension named ExtensionC to a scale set model. ExtensionC has dependencies on ExtensionA and ExtensionB, which have already been defined in the scale set model.

```
PUT on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/extensions/ExtensionC?api-version=2018-10-01`
```

```json
{ 
  "name": "ExtensionC",
  "properties": {
    "provisionAfterExtensions": [
      "ExtensionA","ExtensionB"
    ],
    "publisher": "ExtensionC.Publisher",
    "settings": {},
    "typeHandlerVersion": "3.0",
    "autoUpgradeMinorVersion": true,
    "type": "ExtensionC" 
  }                  
}
```

If ExtensionC was defined earlier in the scale set model and you now want to add its dependencies, you can execute a `PATCH` to edit the already deployed extension’s properties.

```
PATCH on `/subscriptions/subscription_id/resourceGroups/myResourceGroup/providers/Microsoft.Compute/virtualMachineScaleSets/myScaleSet/extensions/ExtensionC?api-version=2018-10-01`
```

```json
{ 
  "properties": {
    "provisionAfterExtensions": [
      "ExtensionA","ExtensionB"
    ]
  }                  
}
```
Changes to existing scale set instances are applied on the next [upgrade](virtual-machine-scale-sets-upgrade-scale-set.md#how-to-bring-vms-up-to-date-with-the-latest-scale-set-model).

### Azure PowerShell
Use the [Add-AzVmssExtension](/powershell/module/az.compute/add-azvmssextension) cmdlet to add the Application Health extension to the scale set model definition. Extension sequencing requires the use of Az PowerShell 1.2.0 or above.

The following example adds the [Application Health extension](virtual-machine-scale-sets-health-extension.md) to the `extensionProfile` in a scale set model of a Windows-based scale set. The Application Health extension will be provisioned after provisioning the [Custom Script Extension](../virtual-machines/extensions/custom-script-windows.md), already defined in the scale set.

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
  -ProvisionAfterExtension "CustomScriptExtension" `
  -AutoUpgradeMinorVersion $True

# Update the scale set
Update-AzVmss -ResourceGroupName $vmScaleSetResourceGroup `
  -Name $vmScaleSetName `
  -VirtualMachineScaleSet $vmScaleSet
```

### Azure CLI 2.0
Use [az vmss extension set](/cli/azure/vmss/extension#az-vmss-extension-set) to add the Application Health extension to the scale set model definition. Extension sequencing requires the use of Azure CLI 2.0.55 or above.

The following example adds the [Application Health extension](virtual-machine-scale-sets-health-extension.md) to the scale set model of a Windows-based scale set. The Application Health extension will be provisioned after provisioning the [Custom Script Extension](../virtual-machines/extensions/custom-script-windows.md), already defined in the scale set.

```azurecli-interactive
az vmss extension set \
  --name ApplicationHealthWindows \
  --publisher Microsoft.ManagedServices \
  --version 1.0 \
  --resource-group <myVMScaleSetResourceGroup> \
  --vmss-name <myVMScaleSet> \
  --provision-after-extensions CustomScriptExtension \
  --settings ./extension.json
```


## Troubleshoot

### Not able to add extension with dependencies?
1. Ensure that the extensions specified in provisionAfterExtensions are defined in the scale set model.
2. Ensure there are no circular dependencies being introduced. For example, the following sequence isn't allowed:
ExtensionA -> ExtensionB -> ExtensionC -> ExtensionA
3. Ensure that any extensions that you take dependencies on, have a "settings" property under extension "properties". For example, if ExtentionB needs to be provisioned after ExtensionA, then ExtensionA must have the "settings" field under ExtensionA "properties". You can specify an empty "settings" property if the extension does not mandate any required settings.

### Not able to remove extensions?
Ensure that the extensions being removed are not listed under provisionAfterExtensions for any other extensions.

## Next steps
Learn how to [deploy your application](virtual-machine-scale-sets-deploy-app.md) on virtual machine scale sets.
