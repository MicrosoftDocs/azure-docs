---
title: 'Azure Virtual Machine Scale Sets: Minimum Viable Scale Set | Microsoft Docs'
description: Learn to deploy a simple scaling application using an Azure Resource Manager template.
services: virtual-machine-scale-sets
documentationcenter: ''
author: rwike77
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: getting-started
ms.date: 2/14/2017
ms.author: ryanwi

---

# Deploy a scaling app using a template

[Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment) are a great way to deploy groups of related resources. This tutorial builds on [Deploy a simple scale set](virtual-machine-scale-sets-mvss-start.md) and describes how to deploy a simple autoscaling application on a scale set using an Azure Resource Manager template.

## Install new software on a scale set at deploy time
You can install new software on a platform image using a [VM Extension](../virtual-machines/virtual-machines-windows-extensions-features.md). A VM extension is a small application that provides post-deployment configuration and automation tasks on Azure virtual machines, such as deploying an app. Two different sample templates are provided in [Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) which show how to deploy an application onto a scale set using VM extensions.

### Python HTTP server on Linux
[Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) is a simple autoscaling application example running on a Linux scale set.  [Bottle](http://bottlepy.org/docs/dev/), a Python web framework, and a simple HTTP server are deployed on each VM in the scale set using a custom script VM extension. The scale set scales up when average CPU utilization across all VMs is greater than 60% and scales down when the average CPU utilization is less than 30%.

In addition to the scale set resource, the azuredeploy.json sample template also declares virtual network, public IP address, load balancer, and autoscale settings resources.  For more information on creating these resources in a template, see [Linux scale set with autoscale](virtual-machine-scale-sets-linux-autoscale.md).

The `extensionProfile` property of the `Microsoft.Compute/virtualMachineScaleSets` resource specifies a custom script extension. `fileUris` specifies the script(s) location. In thise case, two files: *workserver.py*, which defines a simple HTTP server, and *installserver.sh*, which installs Bottle and starts the HTTP server. `commandToExecute` specifies the command to run after the scale set has been deployed.

```json
          "extensionProfile": {
            "extensions": [
              {
                "name": "lapextension",
                "properties": {
                  "publisher": "Microsoft.Azure.Extensions",
                  "type": "CustomScript",
                  "typeHandlerVersion": "2.0",
                  "autoUpgradeMinorVersion": true,
                  "settings": {
                    "fileUris": [
                      "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/installserver.sh",
                      "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/workserver.py"
                    ],
                    "commandToExecute": "bash installserver.sh"
                  }
                }
              }
            ]
          }
```

### ASP.NET MVC application on Windows
[ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) is a simple ASP.NET MVC app running in IIS on Windows scale set.  IIS and the MVC app are deployed using the PowerShell desired state configuration (DSC) VM extension.  The scale set scales up (on VM instance at a time) when CPU utilization is greater than 50% for 5 minutes. 

In addition to the scale set resource, the azuredeploy.json sample template also declares virtual network, public IP address, load balancer, and autoscale settings resources.  For more information on creating these resources in a template, see [Windows scale set with autoscale](virtual-machine-scale-sets-windows-autoscale.md).

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
                  "forceUpdateTag": "[parameters('serviceDSCVMSSUpdateTagVersion')]",
                  "settings": {
                    "configuration": {
                      "url": "[concat(parameters('_artifactsLocation'), '/', variables('serviceDSCVMSSArchiveFolder'), '/', variables('serviceDSCVMSSArchiveFileName'))]",
                      "script": "serviceDSCVMSS.ps1",
                      "function": "Main"
                    },
                    "configurationArguments": {
                      "nodeName": "localhost",
                      "webDeployPackage": "[parameters('appServicePackage')]"
                    }
                  },
                  "protectedSettings": {
                    "configurationUrlSasToken": "[parameters('_artifactsLocationSasToken')]"
                  }
                }
              }
            ]
          }
```

## Deploy

## Next Steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]