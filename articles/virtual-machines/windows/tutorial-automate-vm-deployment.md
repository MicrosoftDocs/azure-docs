---
title: Tutorial - Install applications on a Windows VM in Azure | Microsoft Docs
description: In this tutorial, you learn how to use the Custom Script Extension to run scripts and deploy applications to Windows virtual machines in Azure  
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 02/09/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator or developer, I want learn about how to install applications on Windows VMs so that I can automate the process and reduce the risk of human error of manual configuration tasks.
---

# Tutorial - Deploy applications to a Windows virtual machine in Azure with the Custom Script Extension

To configure virtual machines (VMs) in a quick and consistent manner, some form of automation is typically desired. A common approach to customize a Windows VM is to use [Custom Script Extension for Windows](extensions-customscript.md). In this tutorial you learn how to:

> [!div class="checklist"]
> * Use the Custom Script Extension to install IIS
> * Create a VM that uses the Custom Script Extension
> * View a running IIS site after the extension is applied

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.7.0 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.


## Custom script extension overview
The Custom Script Extension downloads and executes scripts on Azure VMs. This extension is useful for post deployment configuration, software installation, or any other configuration / management task. Scripts can be downloaded from Azure storage or GitHub, or provided to the Azure portal at extension run time.

The Custom Script extension integrates with Azure Resource Manager templates, and can also be run using the Azure CLI, PowerShell, Azure portal, or the Azure Virtual Machine REST API.

You can use the Custom Script Extension with both Windows and Linux VMs.


## Create virtual machine
First, set an administrator username and password for the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now you can create the VM with [New-AzureRmVM](/powershell/module/azurerm.compute/new-azurermvm). The following example creates a VM named *myVM* in the *EastUS* location. If they do not already exist, the resource group *myResourceGroupAutomate* and supporting network resources are created. To allow web traffic, the cmdlet also opens port *80*.

```azurepowershell-interactive
New-AzureRmVm `
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
Use [Set-AzureRmVMExtension](/powershell/module/azurerm.compute/set-azurermvmextension) to install the Custom Script Extension. The extension runs `powershell Add-WindowsFeature Web-Server` to install the IIS webserver and then updates the *Default.htm* page to show the hostname of the VM:

```azurepowershell-interactive
Set-AzureRmVMExtension -ResourceGroupName "myResourceGroupAutomate" `
    -ExtensionName "IIS" `
    -VMName "myVM" `
    -Location "EastUS" `
    -Publisher Microsoft.Compute `
    -ExtensionType CustomScriptExtension `
    -TypeHandlerVersion 1.8 `
    -SettingString '{"commandToExecute":"powershell Add-WindowsFeature Web-Server; powershell Add-Content -Path \"C:\\inetpub\\wwwroot\\Default.htm\" -Value $($env:computername)"}'
```


## Test web site
Obtain the public IP address of your load balancer with [Get-AzureRmPublicIPAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress). The following example obtains the IP address for *myPublicIPAddress* created earlier:

```azurepowershell-interactive
Get-AzureRmPublicIPAddress `
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
