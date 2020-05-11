---
title: Using Desired State Configuration With Virtual Machine Scale Sets
description: Using Virtual Machine Scale Sets with the Azure Desired State Configuration Extension to configure virtual machines.
author: zjalexander
tags: azure-service-management,azure-resource-manager
ms.assetid: c8f047b5-0e6c-4ef3-8a47-f1b284d32942
ms.service: virtual-machine-scale-sets
ms.topic: conceptual
ms.tgt_pltfrm: vm-windows
ms.date: 04/05/2017
ms.author: zachal

---
# Using Virtual Machine Scale Sets with the Azure DSC Extension
[Virtual Machine Scale Sets](virtual-machine-scale-sets-overview.md) can be used with the [Azure Desired State Configuration (DSC)](../virtual-machines/windows/extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json) extension handler. Virtual machine scale sets provide a way to deploy and manage large numbers of virtual machines, and can elastically scale in and out in response to load. DSC is used to configure the VMs as they come online so they are running the production software.

## Differences between deploying to Virtual Machines and Virtual Machine Scale Sets
The underlying template structure for a virtual machine scale set is slightly different from a single VM. Specifically, a single VM deploys extensions under the "virtualMachines" node. There is an entry of type "extensions" where DSC is added to the template

```
"resources": [
          {
              "name": "Microsoft.Powershell.DSC",
              "type": "extensions",
              "location": "[resourceGroup().location]",
              "apiVersion": "2015-06-15",
              "dependsOn": [
                  "[concat('Microsoft.Compute/virtualMachines/', variables('vmName'))]"
              ],
              "tags": {
                  "displayName": "dscExtension"
              },
              "properties": {
                  "publisher": "Microsoft.Powershell",
                  "type": "DSC",
                  "typeHandlerVersion": "2.20",
                  "autoUpgradeMinorVersion": false,
                  "forceUpdateTag": "[parameters('dscExtensionUpdateTagVersion')]",
                  "settings": {
                      "configuration": {
                          "url": "[concat(parameters('_artifactsLocation'), '/', variables('dscExtensionArchiveFolder'), '/', variables('dscExtensionArchiveFileName'))]",
                          "script": "DscExtension.ps1",
                          "function": "Main"
                      },
                      "configurationArguments": {
                          "nodeName": "[variables('vmName')]"
                      }
                  },
                  "protectedSettings": {
                      "configurationUrlSasToken": "[parameters('_artifactsLocationSasToken')]"
                  }
              }
          }
      ]
```

A virtual machine scale set node has a "properties" section with the "VirtualMachineProfile", "extensionProfile" attribute. DSC is added under "extensions"

```
"extensionProfile": {
            "extensions": [
                {
                    "name": "Microsoft.Powershell.DSC",
                    "properties": {
                        "publisher": "Microsoft.Powershell",
                        "type": "DSC",
                        "typeHandlerVersion": "2.20",
                        "autoUpgradeMinorVersion": false,
                        "forceUpdateTag": "[parameters('DscExtensionUpdateTagVersion')]",
                        "settings": {
                            "configuration": {
                                "url": "[concat(parameters('_artifactsLocation'), '/', variables('DscExtensionArchiveFolder'), '/', variables('DscExtensionArchiveFileName'))]",
                                "script": "DscExtension.ps1",
                                "function": "Main"
                            },
                            "configurationArguments": {
                                "nodeName": "localhost"
                            }
                        },
                        "protectedSettings": {
                            "configurationUrlSasToken": "[parameters('_artifactsLocationSasToken')]"
                        }
                    }
                }
            ]
```

## Behavior for a Virtual Machine Scale Set
The behavior for a virtual machine scale set is identical to the behavior for a single VM. When a new VM is created, it is automatically provisioned with the DSC extension. If a newer version of the WMF is required by the extension, the VM reboots before coming online. Once it is online, it downloads the DSC configuration .zip and provision it on the VM. More details can be found in [the Azure DSC Extension Overview](../virtual-machines/windows/extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

## Next steps
Examine the [Azure Resource Manager template for the DSC extension](../virtual-machines/windows/extensions-dsc-template.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

Learn how the [DSC extension securely handles credentials](../virtual-machines/windows/extensions-dsc-credentials.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

For more information on the Azure DSC extension handler, see [Introduction to the Azure Desired State Configuration extension handler](../virtual-machines/windows/extensions-dsc-overview.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json). 

For more information about PowerShell DSC, [visit the PowerShell documentation center](/powershell/scripting/dsc/overview/overview). 

