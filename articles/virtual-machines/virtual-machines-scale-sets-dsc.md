<properties
   pageTitle="Using Desired State Configuration With Virtual Machine Scale Sets | Microsoft Azure"
   description="Using Virtual Machine Scale Sets with the Azure DSC Extension"
   services="virtual-machines-windows"
   documentationCenter=""
   authors="zjalexander"
   manager="timlt"
   editor=""
   tags="azure-service-management,azure-resource-manager"
   keywords=""/>

<tags
   ms.service="virtual-machines-scale-sets"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="vm-windows"
   ms.workload="na"
   ms.date="09/15/2016"
   ms.author="zachal"/>

# Using Virtual Machine Scale Sets with the Azure DSC Extension

[Virtual Machine Scale Sets (VMSS)](../virtual-machine-scale-sets/virtual-machine-scale-sets-overview.md) can be used with the [Azure Desired State Configuration (DSC)](virtual-machines-windows-extensions-dsc-overview.md) extension handler. VMSS provides a way to deploy and manage large numbers of virtual machines, and can elastically scale in and out in response to load. DSC is used to configure the VMs as they come online so they are running the production software.

## Differences Between Deploying to VM and VMSS

The underlying template structure for VMSS is slightly different from a single VM. Specifically, a single VM deploys extensions under the "virtualMachines" node. There is an entry of type "extensions" where DSC is added to the template

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
                          "script": "dscExtension.ps1",
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

A VMSS node has a "properties" section with the "VirtualMachineProfile", "extensionProfile" attribute. DSC is added under "extensions"

```
"extensionProfile": {
            "extensions": [
                {
                    "name": "Microsoft.Powershell.DSC",
                    "properties": {
                        "publisher": "Microsoft.Powershell",
                        "type": "DSC",
                        "typeHandlerVersion": "2.9",
                        "autoUpgradeMinorVersion": true,
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

## Behavior for VMSS

The behavior for VMSS is identical to the behavior for a single VM. When a new VM is created, it is automatically provisioned with the DSC extension. If a newer version of the WMF is required by the extension, the VM reboots before coming online. Once it is online, it downloads the DSC configuration .zip and provision it on the VM. More details can be found in [the Azure DSC Extension Overview](virtual-machines-windows-extensions-dsc-overview.md).

## Next steps ##
Examine the [Azure Resource Manager template for the DSC extension](virtual-machines-windows-extensions-dsc-template.md
).

Learn how the [DSC extension securely handles credentials](virtual-machines-windows-extensions-dsc-credentials.md). 

For more information on the Azure DSC extension handler, see [Introduction to the Azure Desired State Configuration extension handler](virtual-machines-windows-extensions-dsc-overview.md). 

For more information about PowerShell DSC, [visit the PowerShell documentation center](https://msdn.microsoft.com/powershell/dsc/overview). 


