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


## <a name="already-provisioned"></a>Deploy apps to scale set instances
You can install and configure applications with [VM Extensions](../virtual-machines/windows/extensions-features.md). You can use VM extensions to run PowerShell or bash scripts on the VM instances, or copy application files. These scripts and application files can then be executed locally on the VM instance to install and configure the application as needed.


## Install an app with the Custom Script Extension
The Custom Script extension runs a script on each VM instance in the scale set. A config file or variable indicates which files are downloaded to the VM, and then what command runs. You could use this to run an installer, a script, a batch file, any executable for example.

> [!IMPORTANT]
> Use the `-ProtectedSetting` switch for any settings that may contain sensitive information.


### Azure PowerShell
PowerShell uses a hashtable for the settings. This example configures the custom script extension to run a PowerShell script that installs IIS.

```powershell
# Setup extension configuration hashtable variable
$customConfig = @{
  "fileUris" = @("https://raw.githubusercontent.com/MicrosoftDocs/azure-cloud-services-files/temp/install-iis.ps1");
  "commandToExecute" = "PowerShell -ExecutionPolicy Unrestricted .\install-iis.ps1 >> `"%TEMP%\StartupLog.txt`" 2>&1";
};

# Add the extension to the config
Add-AzureRmVmssExtension `
    -VirtualMachineScaleSet $vmssConfig `
    -Publisher Microsoft.Compute `
    -Type CustomScriptExtension `
    -TypeHandlerVersion 1.8 `
    -Name "customscript" `
    -Setting $customConfig

# Send the new config to Azure
Update-AzureRmVmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet" `
    -VirtualMachineScaleSet $vmssConfig
```


### Azure CLI 2.0
Save the following json file as _settings.json_.

```json
{
  "fileUris": [
    "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/installserver.sh",
    "https://raw.githubusercontent.com/Azure/azure-quickstart-templates/master/201-vmss-bottle-autoscale/workserver.py"
  ],
  "commandToExecute": "bash installserver.sh"
}
```

Use the Azure CLI to add this extension to an existing scale set. Each VM instance in the scale set automatically runs the extension.

```azurecli
az vmss extension set --publisher Microsoft.Azure.Extensions --version 2.0 --name CustomScript --resource-group myResourceGroup --vmss-name myScaleSet --settings @settings.json
```


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
Cloud-Init is used when the scale set is created. First, create a local file named _cloud-init.txt_ and add your configuration to it. For example, see [this gist](https://gist.github.com/Thraka/27bd66b1fb79e11904fb62b7de08a8a6#file-cloud-init-txt)

Use the Azure CLI to create a scale set. The `--custom-data` field accepts the file name of a cloud-init script.

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
