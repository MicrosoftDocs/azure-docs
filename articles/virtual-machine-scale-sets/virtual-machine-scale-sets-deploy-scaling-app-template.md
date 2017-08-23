---
title: Deploy an app on an Azure virtual machine scale set | Microsoft Docs
description: Learn to deploy a simple autoscaling application on a virtual machine scale set using an Azure Resource Manager template.
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
ms.topic: get-started-article
ms.date: 4/4/2017
ms.author: ryanwi

---

# Deploy an autoscaling app using a template

[Azure Resource Manager templates](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment) are a great way to deploy groups of related resources. This tutorial builds on [Deploy a simple scale set](virtual-machine-scale-sets-mvss-start.md) and describes how to deploy a simple autoscaling application on a scale set using an Azure Resource Manager template.  You can also set up autoscaling using PowerShell, CLI, or the portal. For more information, see [Autoscale overview](virtual-machine-scale-sets-autoscale-overview.md).

## Two quickstart templates
When you deploy a scale set you can install new software on a platform image using a [VM Extension](../virtual-machines/virtual-machines-windows-extensions-features.md). A VM extension is a small application that provides post-deployment configuration and automation tasks on Azure virtual machines, such as deploying an app. Two different sample templates are provided in [Azure/azure-quickstart-templates](https://github.com/Azure/azure-quickstart-templates) which show how to deploy an autoscaling application onto a scale set using VM extensions.

### Python HTTP server on Linux
The [Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) sample template deploys a simple autoscaling application running on a Linux scale set.  [Bottle](http://bottlepy.org/docs/dev/), a Python web framework, and a simple HTTP server are deployed on each VM in the scale set using a custom script VM extension. The scale set scales up when average CPU utilization across all VMs is greater than 60% and scales down when the average CPU utilization is less than 30%.

In addition to the scale set resource, the *azuredeploy.json* sample template also declares virtual network, public IP address, load balancer, and autoscale settings resources.  For more information on creating these resources in a template, see [Linux scale set with autoscale](virtual-machine-scale-sets-linux-autoscale.md).

In the *azuredeploy.json* template, the `extensionProfile` property of the `Microsoft.Compute/virtualMachineScaleSets` resource specifies a custom script extension. `fileUris` specifies the script(s) location. In this case, two files: *workserver.py*, which defines a simple HTTP server, and *installserver.sh*, which installs Bottle and starts the HTTP server. `commandToExecute` specifies the command to run after the scale set has been deployed.

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
The [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) sample template deploys a simple ASP.NET MVC app running in IIS on Windows scale set.  IIS and the MVC app are deployed using the [PowerShell desired state configuration (DSC)](virtual-machine-scale-sets-dsc.md) VM extension.  The scale set scales up (on VM instance at a time) when CPU utilization is greater than 50% for 5 minutes. 

In addition to the scale set resource, the *azuredeploy.json* sample template also declares virtual network, public IP address, load balancer, and autoscale settings resources. This template also demonstrates application upgrade.  For more information on creating these resources in a template, see [Windows scale set with autoscale](virtual-machine-scale-sets-windows-autoscale.md).

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
                  "forceUpdateTag": "[parameters('powershelldscUpdateTagVersion')]",
                  "settings": {
                    "configuration": {
                      "url": "[variables('powershelldscZipFullPath')]",
                      "script": "IISInstall.ps1",
                      "function": "InstallIIS"
                    },
                    "configurationArguments": {
                      "nodeName": "localhost",
                      "WebDeployPackagePath": "[variables('webDeployPackageFullPath')]"
                    }
                  }
                }
              }
            ]
          }
```

## Deploy the template
The simplest way to deploy the [Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) or [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) template is to use the **Deploy to Azure** button found in the in the readme files in GitHub.  You can also use PowerShell or Azure CLI to deploy the sample templates.

### PowerShell
Copy the [Python HTTP server on Linux](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-bottle-autoscale) or [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) files from the GitHub repo to a folder on your local computer.  Open the *azuredeploy.parameters.json* file and update the default values of the `vmssName`, `adminUsername`, and `adminPassword` parameters. Save the following PowerShell script to *deploy.ps1* in the sample folder as the *azuredeploy.json* template. To deploy the sample template run the *deploy.ps1* script from a PowerShell command window.

```powershell
param(
 [Parameter(Mandatory=$True)]
 [string]
 $subscriptionId,

 [Parameter(Mandatory=$True)]
 [string]
 $resourceGroupName,

 [string]
 $resourceGroupLocation,

 [Parameter(Mandatory=$True)]
 [string]
 $deploymentName,

 [string]
 $templateFilePath = "azuredeploy.json",

 [string]
 $parametersFilePath = "azuredeploy.parameters.json"
)

<#
.SYNOPSIS
    Registers RPs
#>
Function RegisterRP {
    Param(
        [string]$ResourceProviderNamespace
    )

    Write-Host "Registering resource provider '$ResourceProviderNamespace'";
    Register-AzureRmResourceProvider -ProviderNamespace $ResourceProviderNamespace;
}

#******************************************************************************
# Script body
# Execution begins here
#******************************************************************************
$ErrorActionPreference = "Stop"

# sign in
Write-Host "Logging in...";
Login-AzureRmAccount;

# select subscription
Write-Host "Selecting subscription '$subscriptionId'";
Select-AzureRmSubscription -SubscriptionID $subscriptionId;

# Register RPs
$resourceProviders = @("microsoft.resources");
if($resourceProviders.length) {
    Write-Host "Registering resource providers"
    foreach($resourceProvider in $resourceProviders) {
        RegisterRP($resourceProvider);
    }
}

#Create or check for existing resource group
$resourceGroup = Get-AzureRmResourceGroup -Name $resourceGroupName -ErrorAction SilentlyContinue
if(!$resourceGroup)
{
    Write-Host "Resource group '$resourceGroupName' does not exist. To create a new resource group, please enter a location.";
    if(!$resourceGroupLocation) {
        $resourceGroupLocation = Read-Host "resourceGroupLocation";
    }
    Write-Host "Creating resource group '$resourceGroupName' in location '$resourceGroupLocation'";
    New-AzureRmResourceGroup -Name $resourceGroupName -Location $resourceGroupLocation
}
else{
    Write-Host "Using existing resource group '$resourceGroupName'";
}

# Start the deployment
Write-Host "Starting deployment...";
if(Test-Path $parametersFilePath) {
    New-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath -TemplateParameterFile $parametersFilePath;
} else {
    New-AzureRmResourceGroupDeployment -ResourceGroupName $resourceGroupName -TemplateFile $templateFilePath;
}
```

## Next steps

[!INCLUDE [mvss-next-steps-include](../../includes/mvss-next-steps.md)]
