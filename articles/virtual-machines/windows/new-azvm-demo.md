---
title: Create Windows VM using simplified New-AzureRMVM cmdlet in Azure Cloud Shell| Microsoft Docs
description: Quickly learn to create Windows virtual machines with the simplified New-AzureRMVM cmdlet in Azure Cloud Shell.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: jeconnoc
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 12/12/2017
ms.author: cynthn
ROBOTS: NOINDEX

---

# Create a Windows virtual machine with the simplified New-AzureRMVM cmdlet in Cloud Shell 

The [New-AzureRMVM](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermvm?view=azurermps-6.8.1) cmdlet has added a simplified set of parameters for creating a new VM using PowerShell. This topic shows you how to use PowerShell in Azure Cloud Shell, with the latest version of the New-AzureVM cmdlet preinstalled, to create a new VM. We will use a simplified parameter set that automatically creates all the necessary resources using smart defaults. 

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-powershell](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the Azure PowerShell module version 5.1.1 or later. Run ` Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps). If you are running PowerShell locally, you also need to run `Connect-AzureRmAccount` to create a connection with Azure.

## Create the VM

You can use the [New-AzureRMVM](https://docs.microsoft.com/powershell/module/azurerm.compute/new-azurermvm?view=azurermps-6.8.1) cmdlet to create a VM with smart defaults that include using the Windows Server 2016 Datacenter image from the Azure Marketplace. You can use New-AzureRMVM with just the **-Name** parameter and it will use that value for all of the resource names. In this example, we set the **-Name** parameter as *myVM*. 

Make sure that **PowerShell** is selected in Cloud Shell and type:

```azurepowershell-interactive
New-AzureRMVm -Name myVM
```

You are asked to create a username and password for the VM, which will be used when you connect to the VM later in this topic. The password must be 12-123 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character.

It takes a minute to create the VM and the associated resources. When finished, you can see all of the resources that were created using the [Get-AzureRmResource](/powershell/module/azurerm.resources/get-azurermresource) cmdlet.

```azurepowershell-interactive
Get-AzureRmResource `
	-ResourceGroupName myVMResourceGroup | Format-Table Name
```

## Connect to the VM

After the deployment has completed, create a remote desktop connection with the virtual machine.

Use the [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) command to return the public IP address of the virtual machine. Take note of this IP Address.

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
	-ResourceGroupName myVMResourceGroup | Select IpAddress
```

On your local machine, open a cmd prompt and use the **mstsc** command to start a remote desktop session with your new VM. Replace the &lt;publicIPAddress&gt; with the IP address of your virtual machine. When prompted, enter the username and password you gave your VM when it was created.

```
mstsc /v:<publicIpAddress>
```
## Specify different resource names

You can also provide more descriptive names for the resources, and still have them created automatically. Here is an example where we have named multiple resources for the new VM, including a new resource group.

```azurepowershell-interactive
New-AzureRmVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVM" `
    -Location "East US" `
    -VirtualNetworkName "myVnet" `
    -SubnetName "mySubnet" `
    -SecurityGroupName "myNetworkSecurityGroup" `
    -PublicIpAddressName "myPublicIpAddress" `
    -OpenPorts 3389
```

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myVM
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this topic, you’ve deployed a simple virtual machine using New-AzVM and then connected to it over RDP. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
