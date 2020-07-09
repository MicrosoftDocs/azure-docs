---
title: Deploy an application to an Azure virtual machine scale set
description: Learn how to deploy applications to Linux and Windows virtual machine instances in a scale set
author: ju-shim
ms.author: jushiman
ms.topic: how-to
ms.service: virtual-machine-scale-sets
ms.subservice: management
ms.date: 05/29/2018
ms.reviewer: avverma
ms.custom: avverma

---

# Deploy your application on virtual machine scale sets

To run applications on virtual machine (VM) instances in a scale set, you first need to install the application components and required files. This article introduces ways to build a custom VM image for instances in a scale set, or automatically run install scripts on existing VM instances. You also learn how to manage application or OS updates across a scale set.


## Build a custom VM image
When you use one of the Azure platform images to create the instances in your scale set, no additional software is installed or configured. You can automate the install of these components, however that adds to the time it takes to provision VM instances to your scale sets. If you apply many configuration changes to the VM instances, there is management overhead with those configuration scripts and tasks.

To reduce the configuration management and time to provision a VM, you can create a custom VM image that is ready to run your application as soon as an instance is provisioned in the scale set. For more information on how to create and use a custom VM image with a scale set, see the following tutorials:

- [Azure CLI](tutorial-use-custom-image-cli.md)
- [Azure PowerShell](tutorial-use-custom-image-powershell.md)


## <a name="already-provisioned"></a>Install an app with the Custom Script Extension
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run-time. For more information on how to install an app with a Custom Script Extension, see the following tutorials:

- [Azure CLI](tutorial-install-apps-cli.md)
- [Azure PowerShell](tutorial-install-apps-powershell.md)
- [Azure Resource Manager template](tutorial-install-apps-template.md)


## Install an app to a Windows VM with PowerShell DSC
[PowerShell Desired State Configuration (DSC)](/powershell/scripting/dsc/overview/overview) is a management platform to define the configuration of target machines. DSC configurations define what to install on a machine and how to configure the host. A Local Configuration Manager (LCM) engine runs on each target node that processes requested actions based on pushed configurations.

The PowerShell DSC extension lets you customize VM instances in a scale set with PowerShell. The following example:

- Instructs the VM instances to download a DSC package from GitHub - *https://github.com/Azure-Samples/compute-automation-configurations/raw/master/dsc.zip*
- Sets the extension to run an install script - `configure-http.ps1`
- Gets information about a scale set with [Get-AzVmss](/powershell/module/az.compute/get-azvmss)
- Applies the extension to the VM instances with [Update-AzVmss](/powershell/module/az.compute/update-azvmss)

The DSC extension is applied to the *myScaleSet* VM instances in the resource group named *myResourceGroup*. Enter your own names as follows:

```powershell
# Define the script for your Desired Configuration to download and run
$dscConfig = @{
  "wmfVersion" = "latest";
  "configuration" = @{
    "url" = "https://github.com/Azure-Samples/compute-automation-configurations/raw/master/dsc.zip";
    "script" = "configure-http.ps1";
    "function" = "WebsiteTest";
  };
}

# Get information about the scale set
$vmss = Get-AzVmss `
                -ResourceGroupName "myResourceGroup" `
                -VMScaleSetName "myScaleSet"

# Add the Desired State Configuration extension to install IIS and configure basic website
$vmss = Add-AzVmssExtension `
    -VirtualMachineScaleSet $vmss `
    -Publisher Microsoft.Powershell `
    -Type DSC `
    -TypeHandlerVersion 2.24 `
    -Name "DSC" `
    -Setting $dscConfig

# Update the scale set and apply the Desired State Configuration extension to the VM instances
Update-AzVmss `
    -ResourceGroupName "myResourceGroup" `
    -Name "myScaleSet"  `
    -VirtualMachineScaleSet $vmss
```

If the upgrade policy on your scale set is *manual*, update your VM instances with [Update-AzVmssInstance](/powershell/module/az.compute/update-azvmssinstance). This cmdlet applies the updated scale set configuration to the VM instances and installs your application.


## Install an app to a Linux VM with cloud-init
[Cloud-init](https://cloudinit.readthedocs.io/en/latest/index.html) is a widely used approach to customize a Linux VM as it boots for the first time. You can use cloud-init to install packages and write files, or to configure users and security. As cloud-init runs during the initial boot process, there are no additional steps or required agents to apply your configuration.

Cloud-init also works across distributions. For example, you don't use **apt-get install** or **yum install** to install a package. Instead you can define a list of packages to install. Cloud-init automatically uses the native package management tool for the distro you select.

For more information, including an example *cloud-init.txt* file, see [Use cloud-init to customize Azure VMs](../virtual-machines/linux/using-cloud-init.md).

To create a scale set and use a cloud-init file, add the `--custom-data` parameter to the [az vmss create](/cli/azure/vmss) command and specify the name of a cloud-init file. The following example creates a scale set named *myScaleSet* in *myResourceGroup* and configures VM instances with a file named *cloud-init.txt*. Enter your own names as follows:

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


### Install applications with OS updates
When new OS releases are available, you can use or build a new custom image and [deploy OS upgrades](virtual-machine-scale-sets-upgrade-scale-set.md) to a scale set. Each VM instance is upgraded to the latest image that you specify. You can use a custom image with the application pre-installed, the Custom Script Extension, or PowerShell DSC to have your application automatically available as you perform the upgrade. You may need to plan for application maintenance as you perform this process to ensure that there are no version compatibility issues.

If you use a custom VM image with the application pre-installed, you could integrate the application updates with a deployment pipeline to build the new images and deploy OS upgrades across the scale set. This approach allows the pipeline to pick up the latest application builds, create and validate a VM image, then upgrade the VM instances in the scale set. To run a deployment pipeline that builds and deploys application updates across custom VM images, you could [create a Packer image and deploy with Azure DevOps Services](/azure/devops/pipelines/apps/cd/azure/deploy-azure-scaleset), or use another platform such as [Spinnaker](https://www.spinnaker.io/) or [Jenkins](https://jenkins.io/).


## Next steps
As you build and deploy applications to your scale sets, you can review the [Scale Set Design Overview](virtual-machine-scale-sets-design-overview.md). For more information on how to manage your scale set, see [Use PowerShell to manage your scale set](virtual-machine-scale-sets-windows-manage.md).
