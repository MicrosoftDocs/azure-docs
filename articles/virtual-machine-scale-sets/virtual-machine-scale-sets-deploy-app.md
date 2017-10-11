---
title: Deploy an application to an Azure virtual machine scale set | Microsoft Docs
description: Learn how to deploy applications to Linux and Windows virtual machine instances in a scale set
services: virtual-machine-scale-sets
documentationcenter: ''
author: iainfoulds
manager: jeconnoc
editor: ''
tags: azure-resource-manager

ms.assetid: f8892199-f2e2-4b82-988a-28ca8a7fd1eb
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/09/2017
ms.author: iainfou
---

# Deploy your application on virtual machine scale sets
To run applications on virtual machine (VM) instances in a scale set, you first need to to install the application components and required files. This article introduces ways to build a custom VM image for instances in a scale set, or automatically run install scripts on existing VM instances. You also learn how to manage application or OS updates across a scale set.


## Build a custom VM image
When you use one of the Azure platform images to create the instances in your scale set, no additional software is installed or configured. You can automate the install of these components, however that adds to the time it takes to provision VM instances to your scale sets. If you perform a lot of configuration on the VM instances, there is management overhead with those configuration scripts and tasks.

To reduce the configuration management and time to provision a VM, you can create a custom VM image that is ready to run your application as soon as an instance is provisioned in the scale set. The overall process to create a custom VM image for scale set instances are as follows:

1. To build a custom VM image for your scale set instances, you create and log in to a VM, then install and configure the application. You can use Packer to define and build a [Linux](../virtual-machines/linux/build-image-with-packer.md) or [Windows](../virtual-machines/windows/build-image-with-packer.md) VM image. Or, you can manually create and configure the VM:

    - Create a Linux VM with the [Azure CLI 2.0](../virtual-machines/linux/quick-create-cli.md), [Azure PowerShell](../virtual-machines/linux/quick-create-powershell.md), or the [portal](../virtual-machines/linux/quick-create-portal.md).
    - Create a Windows VM with the [Azure PowerShell](../virtual-machines/windows/quick-create-powershell.md), the [Azure CLI 2.0](../virtual-machines/windows/quick-create-cli.md), or the [portal](../virtual-machines/windows/quick-create-portal.md).
    - Log in to a [Linux](../virtual-machines/linux/mac-create-ssh-keys.md#use-the-ssh-key-pair) or [Windows](../virtual-machines/windows/connect-logon.md) VM.
    - Install and configure the applications and tools needed. If you need specific versions of a library or runtime, a custom VM image allows to define a version and 

2. Capture your VM with the [Azure CLI 2.0](../virtual-machines/linux/capture-image.md) or [Azure PowerShell](../virtual-machines/windows/capture-image.md). This step creates the custom VM image that is used to then deploy instances in a scale set.

3. [Create a scale set](virtual-machine-scale-sets-create.md) and specify the custom VM image created in the preceding steps.


## <a name="already-provisioned"></a>Install an app with the Custom Script Extension
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time.

The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API. 

For more information, see the [Custom Script Extension overview](../virtual-machines/windows/extensions-customscript.md).


### Use Azure PowerShell
PowerShell uses a hashtable to store the file to download and the command to execute. The following example:

- Gets information about a scale set with [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss)
- Downloads a script from GitHub - *https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate-iis.ps1*
- Sets the extension to run the install script - `powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1`
- Applies the extension to the VM instances with [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss)

The Custom Script Extension is applued to the *myScaleSet* VM instances in the resource group named *myResourceGroup*. Enter your own names as follows:

```powershell
# Define the script for your Custom Script Extension to run
$customConfig = @{
    "fileUris" = (,"https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate-iis.ps1");
    "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1"
}

# Get information about a scale set
$vmss = Get-AzureRmVmss `
                -ResourceGroupName "myResourceGroup" `
                -VMScaleSetName "myScaleSet"

# Use Custom Script Extension to install IIS and configure basic website
$vmss = Add-AzureRmVmssExtension `
    -VirtualMachineScaleSet $vmss `
    -Name "customScript" `
    -Publisher "Microsoft.Compute" `
    -Type "CustomScriptExtension" `
    -TypeHandlerVersion 1.8 `
    -Setting $customConfig

# Update the scale set and apply the Custom Script Extension to the VM instances
Update-AzureRmVmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet" `
    -VirtualMachineScaleSet $vmss
```

If the upgrade policy on your scale set is *manual*, update your VM instances with [Update-AzureRmVmssInstance](/powershell/module/azurerm.compute/update-azurermvmssinstance). This cmdlet applies the updated scale set configuration to the VM instances and installs your application.


### Use Azure CLI 2.0
To use the Custom Script Extension with the Azure CLI, you create a JSON file that defines what files to obtain and commands to execute. These JSON definitions can be re-used across scale set deployments to apply consistent application installs.

In your current shell, create a file named *customConfig.json* and paste the following configuration. For example, create the file in the Cloud Shell not on your local machine. You can use any editor you wish. Enter `sensible-editor cloudConfig.json` to create the file and see a list of available editors.

```json
{
  "fileUris": ["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate_nginx.sh"],
  "commandToExecute": "./automate_nginx.sh"
}
```

Apply the Custom Script Extension configuration to the VM instances in your scale set with [az vmss extension set](/cli/azure/vmss/extension#set). The following example applies the *customConfig.json* configuration to the *myScaleSet* VM instances in the resource group named *myResourceGroup*. Enter your own names as follows:

```azurecli
az vmss extension set \
    --publisher Microsoft.Azure.Extensions \
    --version 2.0 \
    --name CustomScript \
    --resource-group myResourceGroup \
    --vmss-name myScaleSet \
    --settings @customConfig.json
```

If the upgrade policy on your scale set is *manual*, update your VM instances with [az vmss update-instances](/cli/azure/vmss#update-instances). This cmdlet applies the updated scale set configuration to the VM instances and installs your application.


## Install an app to a Windows VM with PowerShell DSC
You can use PowerShell DSC to customize the scale set VM instances. The **DSC** extension published by **Microsoft.Powershell** deploys and runs the provided DSC configuration on each VM instance. A config file or variable tells the extension where *.zip* package is, and which _script-function_ combination to run.

PowerShell uses a hashtable for the settings. This example deploys a DSC package that installs IIS.

```powershell
# Setup extension configuration hashtable variable
$dscConfig = @{
  "wmfVersion" = "latest";
  "configuration" = @{
    "url" = "https://github.com/MicrosoftDocs/azure-cloud-services-files/raw/temp/dsc.zip";
    "script" = "configure-http.ps1";
    "function" = "WebsiteTest";
  };
}

# Add the extension to the config
Add-AzureRmVmssExtension `
    -VirtualMachineScaleSet $vmssConfig `
    -Publisher Microsoft.Powershell `
    -Type DSC `
    -TypeHandlerVersion 2.24 `
    -Name "dsc" `
    -Setting $dscConfig

# Send the new config to Azure
Update-AzureRmVmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet"  `
    -VirtualMachineScaleSet $vmssConfig
```


## Install an app to a Linux VM with cloud-init
[Cloud-init](https://cloudinit.readthedocs.io/latest/) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

For more information, see [Use cloud-init to customize Azure VMs](../virtual-machines/linux/using-cloud-init.md).

To create a scale set and use a cloud-init file, add the `--custom-data` parameter to the [az vmss create](/cli/azure/vmss#create) command and specify the name of a cloud-int file. The following example creates a scale set named *myScaleSet* in *myResourceGroup* and configures VM instances with a file named *cloud-init.txt*. Enter your own names as follows:

```azurecli
az vmss create \
  --resource-group myResourceGroup \
  --name myScaleSet \
  --image UbuntuLTS \
  --upgrade-policy-mode automatic \
  --custom-data cloud-init.txt \
  --admin-username azureuser \
  --generate-ssh-keys
```

## Deploy application updates
If you deployed your application through an extension, alter the extension definition in some way. This change causes the extension to be redeployed to all VM instances. Something **must** be changed about the extension, such as renaming a referenced file, otherwise, Azure does not see that the extension has changed.

If you baked the application into your own operating system image, use an automated deployment pipeline for application updates. Design your architecture to facilitate rapid swapping of a staged scale set into production. A good example of this approach is the [Azure Spinnaker driver work](https://github.com/spinnaker/deck/tree/master/app/scripts/modules/azure) - [http://www.spinnaker.io/](http://www.spinnaker.io/).

[Packer](https://www.packer.io/) and [Terraform](https://www.terraform.io/) support Azure Resource Manager, so you can also define your images "as code" and build them in Azure, then use the VHD in your scale set. However, doing so would become problematic for marketplace images, where extensions/custom scripts become more important since you don’t directly manipulate bits from marketplace.


## Deploy OS updates
Suppose you want to update your OS image while keeping the scale set running. PowerShell and the Azure CLI can update the VM images, one VM at a time. The [Upgrade a Scale Set](./virtual-machine-scale-sets-upgrade-scale-set.md) article also provides further information on what options are available to perform an operating system upgrade across a scale set.


## What happens when a scale set scales out?
When you add one or more VM instances to a scale set, the application is automatically installed. For example if the scale set has extensions defined, they run on a new VM each time it is created. If the scale set is based on a custom image, any new VM is a copy of the source custom image. If the scale set VM instances are container hosts, then you might have startup code to load the containers in a Custom Script Extension. Or, an extension might install an agent that registers with a cluster orchestrator, such as Azure Container Service.


## Next steps
You may want to review the [Scale Set Design Overview](virtual-machine-scale-sets-design-overview.md) article, which describes some of the limits imposed by scale sets.

* [Use PowerShell to manage your scale set.](virtual-machine-scale-sets-windows-manage.md)
* [Create a scale set template.](virtual-machine-scale-sets-mvss-start.md)
