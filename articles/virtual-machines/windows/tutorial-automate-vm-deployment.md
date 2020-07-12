---
title: Tutorial - Install applications on a Windows VM in Azure 
description: In this tutorial, you learn how to use the Custom Script Extension to run scripts and deploy applications to Windows virtual machines in Azure  
author: cynthn
ms.service: virtual-machines-windows
ms.topic: tutorial
ms.workload: infrastructure
ms.date: 11/29/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator or developer, I want learn about how to install applications on Windows VMs so that I can automate the process and reduce the risk of human error of manual configuration tasks.
---

# Tutorial - Deploy applications to a Windows virtual machine in Azure with the Custom Script Extension

To configure virtual machines (VMs) in a quick and consistent manner, you can use the [Custom Script Extension for Windows](extensions-customscript.md). In this tutorial you learn how to:

> [!div class="checklist"]
> * Use the Custom Script Extension to install IIS
> * Create a VM that uses the Custom Script Extension
> * View a running IIS site after the extension is applied

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Custom script extension overview
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time.

The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

You can use the Custom Script Extension with both Windows and Linux VMs.


## Create virtual machine
Set the administrator username and password for the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now you can create the VM with [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm). The following example creates a VM named *myVM* in the *EastUS* location. If they do not already exist, the resource group *myResourceGroupAutomate* and supporting network resources are created. To allow web traffic, the cmdlet also opens port *80*.

```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroupAutomate" `
    -Name "myVM" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -OpenPorts 80 `
    -Credential $cred
```

It takes a few minutes for the resources and VM to be created.


## Automate IIS install
Use [Set-AzVMExtension](https://docs.microsoft.com/powershell/module/az.compute/set-azvmextension) to install the Custom Script Extension. The extension runs `powershell Add-WindowsFeature Web-Server` to install the IIS webserver and then updates the *Default.htm* page to show the hostname of the VM:

```azurepowershell-interactive
Set-AzVMExtension -ResourceGroupName "myResourceGroupAutomate" `
    -ExtensionName "IIS" `
    -VMName "myVM" `
    -Location "EastUS" `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.8 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```


## Test web site
Obtain the public IP address of your load balancer with [Get-AzPublicIPAddress](https://docs.microsoft.com/powershell/module/az.network/get-azpublicipaddress). The following example obtains the IP address for *myPublicIPAddress* created earlier:

```azurepowershell-interactive
Get-AzPublicIPAddress `
    -ResourceGroupName "myResourceGroupAutomate" `
    -Name "myPublicIPAddress" | select IpAddress
```

You can then enter the public IP address in to a web browser. The website is displayed, including the hostname of the VM that the load balancer distributed traffic to as in the following example:

![Running IIS website](./media/tutorial-automate-vm-deployment/running-iis-website.png)


## Next steps

In this tutorial, you automated the IIS install on a VM. You learned how to:

> [!div class="checklist"]
> * Use the Custom Script Extension to install IIS
> * Create a VM that uses the Custom Script Extension
> * View a running IIS site after the extension is applied

Advance to the next tutorial to learn how to create custom VM images.

> [!div class="nextstepaction"]
> [Create custom VM images](./tutorial-custom-images.md)
