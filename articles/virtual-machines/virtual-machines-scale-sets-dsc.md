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
   ms.date="08/29/2016"
   ms.author="zachal"/>

## Using Virtual Machine Scale Sets with the Azure DSC Extension

[Virtual Machine Scale Sets (VMSS)](virtual-machines-windows-vmss-powershell-creating.md) can be used with the [Azure Desired State Configuration (DSC)](virtual-machines-windows-extensions-dsc-overview.md) extension handler. VMSS is used to configure the deployment of virtual machines to meet load. DSC is used to configure the VMs as they come online so they are running the production software.

### Differences Between Deploying to VM and VMSS

The underlying template structure for VMSS is slightly different from a single VM. Specifically, a single VM deploys extensions under the "virtualMachines" node. There is an entry of type "extensions" where DSC is added to the template
```json
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
```json

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

### Behavior for VMSS

The behavior for VMSS is identical to the behavior for a single VM. When a new VM is created, it is automatically provisioned with the DSC extension. If a newer version of the WMF is required by the extension, the VM reboots before coming online. Once it is online, it downloads the DSC configuration .zip and provision it on the VM. More details can be found in [the Azure DSC Extension Overview](virtual-machines-windows-extensions-dsc-overview.md).

