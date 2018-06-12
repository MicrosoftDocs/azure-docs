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
ms.date: 10/13/2017
ms.author: iainfou
---

# Deploy your application on virtual machine scale sets
To run applications on virtual machine (VM) instances in a scale set, you first need to install the application components and required files. This article introduces ways to build a custom VM image for instances in a scale set, or automatically run install scripts on existing VM instances. You also learn how to manage application or OS updates across a scale set.


## Build a custom VM image
When you use one of the Azure platform images to create the instances in your scale set, no additional software is installed or configured. You can automate the install of these components, however that adds to the time it takes to provision VM instances to your scale sets. If you apply many configuration changes to the VM instances, there is management overhead with those configuration scripts and tasks.

To reduce the configuration management and time to provision a VM, you can create a custom VM image that is ready to run your application as soon as an instance is provisioned in the scale set. The overall process to create a custom VM image for scale set instances are as follows:

1. To build a custom VM image for your scale set instances, you create and log in to a VM, then install and configure the application. You can use Packer to define and build a [Linux](../virtual-machines/linux/build-image-with-packer.md) or [Windows](../virtual-machines/windows/build-image-with-packer.md) VM image. Or, you can manually create and configure the VM:

    - Create a Linux VM with the [Azure CLI 2.0](../virtual-machines/linux/quick-create-cli.md), [Azure PowerShell](../virtual-machines/linux/quick-create-powershell.md), or the [portal](../virtual-machines/linux/quick-create-portal.md).
    - Create a Windows VM with the [Azure PowerShell](../virtual-machines/windows/quick-create-powershell.md), the [Azure CLI 2.0](../virtual-machines/windows/quick-create-cli.md), or the [portal](../virtual-machines/windows/quick-create-portal.md).
    - Log in to a [Linux](../virtual-machines/linux/mac-create-ssh-keys.md#use-the-ssh-key-pair) or [Windows](../virtual-machines/windows/connect-logon.md) VM.
    - Install and configure the applications and tools needed. If you need specific versions of a library or runtime, a custom VM image allows you to define a version and 

2. Capture your VM with the [Azure CLI 2.0](../virtual-machines/linux/capture-image.md) or [Azure PowerShell](../virtual-machines/windows/capture-image.md). This step creates the custom VM image that is used to then deploy instances in a scale set.

3. [Create a scale set](virtual-machine-scale-sets-create.md) and specify the custom VM image created in the preceding steps.


## <a name="already-provisioned"></a>Install an app with the Custom Script Extension
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time.

The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API. 

For more information, see the [Custom Script Extension overview](../virtual-machines/windows/extensions-customscript.md).


### Use Azure PowerShell
PowerShell uses a hashtable to store the file to download and the command to execute. The following example:

- Instructs the VM instances to download a script from GitHub - *https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate-iis.ps1*
- Sets the extension to run an install script - `powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1`
- Gets information about a scale set with [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss)
- Applies the extension to the VM instances with [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss)

The Custom Script Extension is applied to the *myScaleSet* VM instances in the resource group named *myResourceGroup*. Enter your own names as follows:

```powershell
# Define the script for your Custom Script Extension to run
$customConfig = @{
    "fileUris" = (,"https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate-iis.ps1");
    "commandToExecute" = "powershell -ExecutionPolicy Unrestricted -File automate-iis.ps1"
}

# Get information about the scale set
$vmss = Get-AzureRmVmss `
                -ResourceGroupName "myResourceGroup" `
                -VMScaleSetName "myScaleSet"

# Add the Custom Script Extension to install IIS and configure basic website
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
To use the Custom Script Extension with the Azure CLI, you create a JSON file that defines what files to obtain and commands to execute. These JSON definitions can be reused across scale set deployments to apply consistent application installs.

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
[PowerShell Desired State Configuration (DSC)](https://msdn.microsoft.com/en-us/powershell/dsc/overview) is a management platform to define the configuration of target machines. DSC configurations define what to install on a machine and how to configure the host. A Local Configuration Manager (LCM) engine runs on each target node that processes requested actions based on pushed configurations.

The PowerShell DSC extension lets you customize VM instances in a scale set with PowerShell. The following example:

- Instructs the VM instances to download a DSC package from GitHub  - *https://github.com/iainfoulds/azure-samples/raw/master/dsc.zip*
- Sets the extension to run an install script - `configure-http.ps1`
- Gets information about a scale set with [Get-AzureRmVmss](/powershell/module/azurerm.compute/get-azurermvmss)
- Applies the extension to the VM instances with [Update-AzureRmVmss](/powershell/module/azurerm.compute/update-azurermvmss)

The DSC extension is applied to the *myScaleSet* VM instances in the resource group named *myResourceGroup*. Enter your own names as follows:

```powershell
# Define the script for your Desired Configuration to download and run
$dscConfig = @{
  "wmfVersion" = "latest";
  "configuration" = @{
    "url" = "https://github.com/iainfoulds/azure-samples/raw/master/dsc.zip";
    "script" = "configure-http.ps1";
    "function" = "WebsiteTest";
  };
}

# Get information about the scale set
$vmss = Get-AzureRmVmss `
                -ResourceGroupName "myResourceGroup" `
                -VMScaleSetName "myScaleSet"

# Add the Desired State Configuration extension to install IIS and configure basic website
$vmss = Add-AzureRmVmssExtension `
    -VirtualMachineScaleSet $vmss `
    -Publisher Microsoft.Powershell `
    -Type DSC `
    -TypeHandlerVersion 2.24 `
    -Name "DSC" `
    -Setting $dscConfig

# Update the scale set and apply the Desired State Configuration extension to the VM instances
Update-AzureRmVmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet"  `
    -VirtualMachineScaleSet $vmss
```

If the upgrade policy on your scale set is *manual*, update your VM instances with [Update-AzureRmVmssInstance](/powershell/module/azurerm.compute/update-azurermvmssinstance). This cmdlet applies the updated scale set configuration to the VM instances and installs your application.


## Install an app to a Linux VM with cloud-init
[Cloud-init](https://cloudinit.readthedocs.io/latest/) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

For more information, including an example *cloud-init.txt* file, see [Use cloud-init to customize Azure VMs](../virtual-machines/linux/using-cloud-init.md).

To create a scale set and use a cloud-init file, add the `--custom-data` parameter to the [az vmss create](/cli/azure/vmss#create) command and specify the name of a cloud-init file. The following example creates a scale set named *myScaleSet* in *myResourceGroup* and configures VM instances with a file named *cloud-init.txt*. Enter your own names as follows:

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


## Install applications as a set scales out
Scale sets allow you to increase the number of VM instances that run your application. This scale out process can be started manually, or automatically based on metrics such as CPU or memory usage.

If you applied a Custom Script Extension to the scale set, the application is installed to each new VM instance. If the scale set is based on a custom image with the application pre-installed, each new VM instance is deployed in a usable state. 

If the scale set VM instances are container hosts, you can use the Custom Script Extension to pull and run the need container images. The Custom Script extension could also register the new VM instance with an orchestrator, such as Azure Container Service.


## Deploy application updates
If you update your application code, libraries, or packages, you can push the latest application state to VM instances in a scale set. If you use the Custom Script Extension, updates to your application and not automatically deployed. Change the Custom Script configuration, such as to point to an install script that has an updated version name. In a previous example, the Custom Script Extension uses a script named *automate_nginx.sh* as follows:

```json
{
  "fileUris": ["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate_nginx.sh"],
  "commandToExecute": "./automate_nginx.sh"
}
```

Any updates you make to your application are not exposed to the Custom Script Extension unless that install script changes. One approach is to include a version number that increments with your application releases. The Custom Script extension could now reference *automate_nginx_v2.sh* as follows:

```json
{
  "fileUris": ["https://raw.githubusercontent.com/iainfoulds/azure-samples/master/automate_nginx_v2.sh"],
  "commandToExecute": "./automate_nginx_v2.sh"
}
```

The Custom Script Extension now runs against the VM instances to apply the latest application updates.


### Install applications with OS updates
When new OS releases are available, you can use or build a new custom image and [deploy OS upgrades](virtual-machine-scale-sets-upgrade-scale-set.md) to a scale set. Each VM instance is upgraded to the latest image that you specify. You can use a custom image with the application pre-installed, the Custom Script Extension, or PowerShell DSC to have your application automatically available as you perform the upgrade. You may need to plan for application maintenance as you perform this process to ensure that there are no version compatibility issues.

If you use a custom VM image with the application pre-installed, you could integrate the application updates with a deployment pipeline to build the new images and deploy OS upgrades across the scale set. This approach allows the pipeline to pick up the latest application builds, create and validate a VM image, then upgrade the VM instances in the scale set. To run a deployment pipeline that builds and deploys application updates across custom VM images, you could use [Visual Studio Team Services](https://www.visualstudio.com/team-services/), [Spinnaker](https://www.spinnaker.io/), or [Jenkins](https://jenkins.io/).


## Next steps
As you build and deploy applications to your scale sets, you can review the [Scale Set Design Overview](virtual-machine-scale-sets-design-overview.md). For more information on how to manage your scale set, see [Use PowerShell to manage your scale set](virtual-machine-scale-sets-windows-manage.md).
