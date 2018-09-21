---
title: Quickstart - Create a Windows virtual machine scale set with an Azure template | Microsoft Docs
description: Learn how to quickly create a Windows virtual machine scale with an Azure Resource Manager template that deploys a sample app and configures autoscale rules
services: virtual-machine-scale-sets
documentationcenter: ''
author: cynthn
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: quickstart
ms.custom: mvc
ms.date: 03/27/18
ms.author: cynthn

---

# Quickstart: Create a Windows virtual machine scale set with an Azure template
A virtual machine scale set allows you to deploy and manage a set of identical, auto-scaling virtual machines. You can scale the number of VMs in the scale set manually, or define rules to autoscale based on resource usage like CPU, memory demand, or network traffic. An Azure load balancer then distributes traffic to the VM instances in the scale set. In this quickstart, you create a virtual machine scale set and deploy a sample application with an Azure Resource Manager template.

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [cloud-shell-powershell.md](../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.5.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.


## Define a scale set in a template
Azure Resource Manager templates let you deploy groups of related resources. Templates are written in JavaScript Object Notation (JSON) and define the entire Azure infrastructure environment for your application. In a single template, you can create the virtual machine scale set, install applications, and configure autoscale rules. With the use of variables and parameters, this template can be reused to update existing, or create additional, scale sets. You can deploy templates through the Azure portal, Azure CLI, or Azure PowerShell, or from continuous integration / continuous delivery (CI/CD) pipelines.

For more information on templates, see [Azure Resource Manager overview](https://docs.microsoft.com/azure/azure-resource-manager/resource-group-overview#template-deployment)

A template defines the configuration for each resource type. A virtual machine scale set resource type is similar to an individual VM. The core parts of the virtual machine scale set resource type are:

| Property                     | Description of property                                  | Example template value                    |
|------------------------------|----------------------------------------------------------|-------------------------------------------|
| type                         | Azure resource type to create                            | Microsoft.Compute/virtualMachineScaleSets |
| name                         | The scale set name                                       | myScaleSet                                |
| location                     | The location to create the scale set                     | East US                                   |
| sku.name                     | The VM size for each scale set instance                  | Standard_A1                               |
| sku.capacity                 | The number of VM instances to initially create           | 2                                         |
| upgradePolicy.mode           | VM instance upgrade mode when changes occur              | Automatic                                 |
| imageReference               | The platform or custom image to use for the VM instances | Microsoft Windows Server 2016 Datacenter  |
| osProfile.computerNamePrefix | The name prefix for each VM instance                     | myvmss                                    |
| osProfile.adminUsername      | The username for each VM instance                        | azureuser                                 |
| osProfile.adminPassword      | The password for each VM instance                        | P@ssw0rd!                                 |

 The following example shows the core scale set resource definition. To customize a scale set template, you can change the VM size or initial capacity, or use a different platform or a custom image.

```json
{
  "type": "Microsoft.Compute/virtualMachineScaleSets",
  "name": "myScaleSet",
  "location": "East US",
  "apiVersion": "2017-12-01",
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
          "publisher": "MicrosoftWindowsServer",
          "offer": "WindowsServer",
          "sku": "2016-Datacenter",
          "version": "latest"
        }
      },
      "osProfile": {
        "computerNamePrefix": "myvmss",
        "adminUsername": "azureuser",
        "adminPassword": "P@ssw0rd!"
      }
    }
  }
}
```

 To keep the sample short, the virtual network interface card (NIC) configuration is not shown. Additional components, such as a load balancer, are also not shown. A complete scale set template is shown [at the end of this article](#deploy-the-template).


## Add a sample application
To test your scale set, install a basic web application. When you deploy a scale set, VM extensions can provide post-deployment configuration and automation tasks, such as installing an app. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time. To apply an extension to your scale set, you add the *extensionProfile* section to the preceding resource example. The extension profile typically defines the following properties:

- Extension type
- Extension publisher
- Extension version
- Location of configuration or install scripts
- Commands to execute on the VM instances

The [ASP.NET application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) sample template uses the PowerShell DSC extension to install an ASP.NET MVC app that runs in IIS. 

An install script is downloaded from GitHub, as defined in *url*. The extension then runs *InstallIIS* from the *IISInstall.ps1* script, as defined in *function* and *Script*. The ASP.NET app itself is provided as a Web Deploy package, which is also downloaded from GitHub, as defined in *WebDeployPackagePath*:

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
You can deploy the [ASP.NET MVC application on Windows](https://github.com/Azure/azure-quickstart-templates/tree/master/201-vmss-windows-webapp-dsc-autoscale) template with the following **Deploy to Azure** button. This button opens the Azure portal, loads the complete template, and prompts for a few parameters such as a scale set name, instance count, and admin credentials.

[![Deploy template to Azure](media/virtual-machine-scale-sets-create-template/deploy-button.png)](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2FAzure%2Fazure-quickstart-templates%2Fmaster%2F201-vmss-windows-webapp-dsc-autoscale%2Fazuredeploy.json)

You can also use Azure PowerShell to install the ASP.NET application on Windows with [New-AzureRmResourceGroupDeployment](/powershell/module/azurerm.resources/new-azurermresourcegroupdeployment) as follows:

```azurepowershell-interactive
# Create a resource group
New-AzureRmResourceGroup -Name myResourceGroup -Location EastUS

# Deploy template into resource group
New-AzureRmResourceGroupDeployment `
    -ResourceGroupName myResourceGroup `
    -TemplateFile https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-windows-webapp-dsc-autoscale/azuredeploy.json

# Update the scale set and apply the extension
Update-AzureRmVmss `
    -ResourceGroupName myResourceGroup `
    -VmScaleSetName myVMSS `
    -VirtualMachineScaleSet $vmssConfig
```

Answer the prompts to provide a scale set name and admin credentials for the VM instances. It can take 10-15 minutes for the scale set to be created and apply the extension to configure the app.


## Test your scale set
To see your scale set in action, access the sample web application in a web browser. Obtain the public IP address of your load balancer with [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) as follows:

```azurepowershell-interactive
Get-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup | Select IpAddress
```

Enter the public IP address of the load balancer in to a web browser in the format *http://publicIpAddress/MyApp*. The load balancer distributes traffic to one of your VM instances, as shown in the following example:

![Running IIS site](./media/virtual-machine-scale-sets-create-powershell/running-iis-site.png)


## Clean up resources
When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) to remove the resource group, scale set. The `-Force` parameter confirms that you wish to delete the resources without an additional prompt to do so. The `-AsJob` parameter returns control to the prompt without waiting for the operation to complete.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name "myResourceGroup" -Force -AsJob
```


## Next steps
In this quickstart, you created a Windows scale set with an Azure template and used the PowerShell DSC extension to install a basic ASP.NET app on the VM instances. To learn more, continue to the tutorial for how to create and manage Azure virtual machine scale sets.

> [!div class="nextstepaction"]
> [Create and manage Azure virtual machine scale sets](tutorial-create-and-manage-powershell.md)
