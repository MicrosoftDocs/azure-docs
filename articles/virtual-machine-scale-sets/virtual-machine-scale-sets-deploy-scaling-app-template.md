---
title: Create a Virtual Machine Scale Set with an Azure template | Microsoft Docs
description: Learn how to quickly create a virtual machine scale with an Azure Resource Manager template
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: get-started-article
ms.date: 11/16/2017
ms.author: iainfou

---

# Create a Virtual Machine Scale Set with the Azure CLI 2.0
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on resource usage such as CPU, memory demand, or network traffic. In this getting started article, you create a virtual machine scale set with an Azure Resource Manager template. You can also create a scale set with the [Azure CLI 2.0](virtual-machine-scale-sets-create-cli.md), [Azure PowerShell](virtual-machine-scale-sets-create-powershell.md), or the [Azure portal](virtual-machine-scale-sets-portal-create.md).


## Overview of templates
[Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment) are a great way to deploy groups of related resources. This tutorial builds on [Deploy a simple scale set](virtual-machine-scale-sets-mvss-start.md) and describes how to deploy a simple autoscaling application on a scale set using an Azure Resource Manager template.  You can also set up autoscaling using PowerShell, CLI, or the portal. For more information, see [Autoscale overview](virtual-machine-scale-sets-autoscale-overview.md).


## Define a scale set

```json
"type": "Microsoft.Compute/virtualMachineScaleSets",
"name": "myScaleSet",
"location": "East US",
"apiVersion": "2016-04-30-preview",
"sku": {
  "name": "Standard_A1",
  "capacity": "2"
},
"properties": {
  "upgradePolicy": {
    "mode": "Automatic"
  },
  "virtualMachineProfile": {
    "storageProfile": {
      "osDisk": {
        "caching": "ReadWrite",
        "createOption": "FromImage"
      },
      "imageReference":  {
        "publisher": "Canonical",
        "offer": "UbuntuServer",
        "sku": "16.04-LTS",
        "version": "latest"
      }
    },
    "osProfile": {
      "computerNamePrefix": "myvmss",
      "adminUsername": "azureuser",
      "adminPassword": "P@ssw0rd!"
    },
```


## Install an application
When you deploy a scale set, you can install new software with [VM extensions](../virtual-machines/virtual-machines-windows-extensions-features.md). A VM extension is a small application that provides post-deployment configuration and automation tasks on Azure virtual machines, such as deploying an app. Two different sample templates are provided in [Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) which show how to deploy an autoscaling application onto a scale set using VM extensions.

### Python HTTP server on Linux
The [Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) sample template deploys a simple autoscaling application running on a Linux scale set.  [Bottle](http://bottlepy.org/docs/dev/), a Python web framework, and a simple HTTP server are deployed on each VM in the scale set using a custom script VM extension. The scale set scales up when average CPU utilization across all VMs is greater than 60% and scales down when the average CPU utilization is less than 30%.

In the *azuredeploy.json* template, the `extensionProfile` property of the `Microsoft.Compute/virtualMachineScaleSets` resource specifies a custom script extension. `fileUris` specifies the script(s) location. In this case, two files: *workserver.py*, which defines a simple HTTP server, and *installserver.sh*, which installs Bottle and starts the HTTP server. `commandToExecute` specifies the command to run after the scale set has been deployed.

```json
"extensionProfile": {
  "extensions": [
    {
      "name": "AppInstall",
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
The [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) sample template deploys a simple ASP.NET MVC app running in IIS on Windows scale set.  IIS and the MVC app are deployed using the [PowerShell desired state configuration (DSC)](virtual-machine-scale-sets-dsc.md) VM extension.  The scale set scales up (on VM instance at a time) when CPU utilization is greater than 50% for 5 minutes. 

In the *azuredeploy.json* template, the `extensionProfile` property of the `Microsoft.Compute/virtualMachineScaleSets` resource specifies a [desired state configuration (DSC)](virtual-machine-scale-sets-dsc.md) extension which installs IIS and a default web app from a WebDeploy package.  The *IISInstall.ps1* script installs IIS on the virtual machine and is found in the *DSC* folder.  The MVC web app is found in the *WebDeploy* folder.  The paths to the install script and the web app are defined in the `powershelldscZip` and `webDeployPackage` parameters in the *azuredeploy.parameters.json* file. 

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
        "forceUpdateTag": "1.0",
        "settings": {
          "configuration": {
            "url": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-windows-webapp-dsc-autoscale/DSC/IISInstall.ps1.zip",
            "script": "IISInstall.ps1",
            "function": "InstallIIS"
          },
          "configurationArguments": {
            "nodeName": "localhost",
            "WebDeployPackagePath": "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-windows-webapp-dsc-autoscale/WebDeploy/DefaultASPWebApp.v1.0.zip"
          }
        }
      }
    }
  ]
}
```

## Deploy the template
The simplest way to deploy the [Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) or [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) template is to use the **Deploy to Azure** button found in the readme files in GitHub.  You can also use PowerShell or Azure CLI to deploy the sample templates.

### Azure CLI 2.0

```azurecli-interactive
# Create a resource group
az group create --name myResourceGroup --location EastUS

# Deploy template into resource group
az group deployment create \
    --resource-group myResourceGroup \
    --template-uri https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/azuredeploy.json
```

### Azure PowerShell

```azurepowershell-interactive
# Create a resource group
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS

# Deploy template into resource group
New-AzureRmResourceGroupDeployment `
    -ResourceGroupName $myResourceGroup `
    -TemplateFile $templateFilePath https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-windows-webapp-dsc-autoscale/azuredeploy.json
```

## Next steps
