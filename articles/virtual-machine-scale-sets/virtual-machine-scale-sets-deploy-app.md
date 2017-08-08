---
title: Deploy an app on virtual machine scale sets
description: Use extensions to depoy an app on Azure Virtual Machine Scale Sets.
services: virtual-machine-scale-sets
documentationcenter: ''
author: thraka
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: f8892199-f2e2-4b82-988a-28ca8a7fd1eb
ms.service: virtual-machine-scale-sets
ms.workload: na
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 05/26/2017
ms.author: adegeo
---

# Deploy your application on virtual machine scale sets

This article describes different ways of how to install software at the time the scale set is provisioned.

You may want to review the [Scale Set Design Overview](virtual-machine-scale-sets-design-overview.md) article, which describes some of the limits imposed by virtual machine scale sets.

## Capture and reuse an image

You can use a virtual machine you have in Azure to prepare a base-image for your scale set. This process creates a managed disk in your storage account, which you can reference as the base image for your scale set. 

Do the following steps:

1. Create an Azure Virtual Machine
   * [Linux][linux-vm-create]
   * [Windows][windows-vm-create]

2. Remote into the virtual machine and customize the system to your liking.

   If you want, you can install your application now. However, know that by installing your application now, you may make upgrading your application more complicated because you may need to remove it first. Instead, you can use this step to install any prerequisites your application may need, like a specific runtime or operating system feature.

3. Follow the "capture a machine" tutorial for either [Linux][linux-vm-capture] or [Windows][windows-vm-capture].

4. Create a [Virtual Machine Scale Set][vmss-create] with the image URI you captured in the previous step.

For more information about disks, see [Managed Disks Overview](../storage/storage-managed-disks-overview.md) and [Use Attached Data Disks](virtual-machine-scale-sets-attached-disks.md).

## Install when the scale set is provisioned

Virtual machine extensions can be applied to a virtual machine scale set. With a virtual machine extension, you can customize the virtual machines in a scale set as a whole group. For more information about extensions, see [Virtual Machine Extensions](../virtual-machines/windows/extensions-features.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json).

There are three main extensions you can use, depending on if your operating system is Linux-based or Windows-based.

### Windows

For a Windows-based operating system, use either the **Custom Script v1.8** extension, or the **PowerShell DSC** extension.

#### Custom Script

The Custom Script extension runs a script on each virtual machine instance in the scale set. A config file or variable indicates which files are downloaded to the virtual machine, and then what command runs. You could use this to run an installer, a script, a batch file, any executable for example.

PowerShell uses a hashtable for the settings. This example configures the custom script extension to run a PowerShell script that installs IIS.

```powershell
# Setup extension configuration hashtable variable
$customConfig = @{
  "fileUris" = @("https://raw.githubusercontent.com/MicrosoftDocs/azure-cloud-services-files/temp/install-iis.ps1");
  "commandToExecute" = "PowerShell -ExecutionPolicy Unrestricted .\install-iis.ps1 >> `"%TEMP%\StartupLog.txt`" 2>&1";
};

# Add the extension to the config
Add-AzureRmVmssExtension -VirtualMachineScaleSet $vmssConfig -Publisher Microsoft.Compute -Type CustomScriptExtension -TypeHandlerVersion 1.8 -Name "customscript1" -Setting $customConfig

# Send the new config to Azure
Update-AzureRmVmss -ResourceGroupName $rg -Name "MyVmssTest143"  -VirtualMachineScaleSet $vmssConfig
```

>[!IMPORTANT]
>Use the `-ProtectedSetting` switch for any settings that may contain sensitive information.

---------


Azure CLI uses a json file for the settings. This example configures the custom script extension to run a PowerShell script that installs IIS. Save the following json file as _settings.json_.

```json
{
  "fileUris": [
    "https://raw.githubusercontent.com/MicrosoftDocs/azure-cloud-services-files/temp/install-iis.ps1"
  ],
  "commandToExecute": "PowerShell -ExecutionPolicy Unrestricted .\install-iis.ps1 >> \"%TEMP%\StartupLog.txt\" 2>&1"
}
```

Then, run this Azure CLI command.

```azurecli
az vmss extension set --publisher Microsoft.Compute --version 1.8 --name CustomScriptExtension --resource-group myResourceGroup --vmss-name myScaleSet --settings @settings.json
```

>[!IMPORTANT]
>Use the `--protected-settings` switch for any settings that may contain sensitive information.

### PowerShell DSC

You can use PowerShell DSC to customize the scale set vm instances. The **DSC** extension published by **Microsoft.Powershell** deploys and runs the provided DSC configuration on each virtual machine instance. A config file or variable tells the extension where *.zip* package is, and which _script-function_ combination to run.

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
Add-AzureRmVmssExtension -VirtualMachineScaleSet $vmssConfig -Publisher Microsoft.Powershell -Type DSC -TypeHandlerVersion 2.24 -Name "dsc1" -Setting $dscConfig

# Send the new config to Azure
Update-AzureRmVmss -ResourceGroupName $rg -Name "myscaleset1"  -VirtualMachineScaleSet $vmssConfig
```

>[!IMPORTANT]
>Use the `-ProtectedSetting` switch for any settings that may contain sensitive information.

-----------

Azure CLI uses a json for the settings. This example deploys a DSC package that installs IIS. Save the following json file as _settings.json_.

```json
{
  "wmfVersion": "latest",
  "configuration": {
    "url": "https://github.com/MicrosoftDocs/azure-cloud-services-files/raw/temp/dsc.zip",
    "script": "configure-http.ps1",
    "function": "WebsiteTest"
  }
}
```

Then, run this Azure CLI command.

```azurecli
az vmss extension set --publisher Microsoft.Powershell --version 2.24 --name DSC --resource-group myResourceGroup --vmss-name myScaleSet --settings @settings.json
```

>[!IMPORTANT]
>Use the `--protected-settings` switch for any settings that may contain sensitive information.

### Linux

Linux can use either the **Custom Script v2.0** extension or use **cloud-init** during creation.

Custom script is a simple extension that downloads files to the virtual machine instances, and runs a command.

#### Custom Script

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

Use the Azure CLI to add this extension to an existing virtual machine scale set. Each virtual machine in the scale set automatically runs the extension.

```azurecli
az vmss extension set --publisher Microsoft.Azure.Extensions --version 2.0 --name CustomScript --resource-group myResourceGroup --vmss-name myScaleSet --settings @settings.json
```

>[!IMPORTANT]
>Use the `--protected-settings` switch for any settings that may contain sensitive information.

#### Cloud-Init

Cloud-Init is used when the scale set is created. First, create a local file named _cloud-init.txt_ and add your configuration to it. For example, see [this gist](https://gist.github.com/Thraka/27bd66b1fb79e11904fb62b7de08a8a6#file-cloud-init-txt)

Use the Azure CLI to create a scale set. The `--custom-data` field accepts the file name of a cloud-init script.

```azurecli
az vmss create \
  --resource-group myResourceGroupScaleSet \
  --name myScaleSet \
  --image Canonical:UbuntuServer:14.04.4-LTS:latest \
  --upgrade-policy-mode automatic \
  --custom-data cloud-init.txt \
  --admin-username azureuser \
  --generate-ssh-keys      
```

## How do I manage application updates?

If you deployed your application through an extension, alter the extension definition in some way. This change causes the extension to be redeployed to all virtual machine instances. Something **must** be changed about the extension, such as renaming a referenced file, otherwise, Azure does not see that the extension has changed.

If you baked the application into your own operating system image, use an automated deployment pipeline for application updates. Design your architecture to facilitate rapid swapping of a staged scale set into production. A good example of this approach is the [Azure Spinnaker driver work](https://github.com/spinnaker/deck/tree/master/app/scripts/modules/azure) - [http://www.spinnaker.io/](http://www.spinnaker.io/).

[Packer](https://www.packer.io/) and [Terraform](https://www.terraform.io/) support Azure Resource Manager, so you can also define your images "as code" and build them in Azure, then use the VHD in your scale set. However, doing so would become problematic for marketplace images, where extensions/custom scripts become more important since you don’t directly manipulate bits from marketplace.

## What happens when a scale set scales out?
When you add one or more virtual machines to a scale set, the application is automatically installed. For example if the scale set has extensions defined, they run on a new virtual machine each time it is created. If the scale set is based on a custom image, any new virtual machine is a copy of the source custom image. If the scale set virtual machines are container hosts, then you might have startup code to load the containers in a Custom Script Extension. Or, an extension might install an agent that registers with a cluster orchestrator, such as Azure Container Service.


## How do you roll out an OS update across update domains?
Suppose you want to update your OS image while keeping the virtual machine scale set running. PowerShell and the Azure CLI can update the virtual machine images, one virtual machine at a time. The [Upgrade a Virtual Machine Scale Set](./virtual-machine-scale-sets-upgrade-scale-set.md) article also provides further information on what options are available to perform an operating system upgrade across a virtual machine scale set.

## Next steps

* [Use PowerShell to manage your scale set.](virtual-machine-scale-sets-windows-manage.md)
* [Create a scale set template.](virtual-machine-scale-sets-mvss-start.md)


[linux-vm-create]: ../virtual-machines/linux/tutorial-manage-vm.md
[windows-vm-create]: ../virtual-machines/windows/tutorial-manage-vm.md
[linux-vm-capture]: ../virtual-machines/linux/capture-image.md
[windows-vm-capture]: ../virtual-machines/windows/capture-image.md 
[vmss-create]: virtual-machine-scale-sets-create.md

