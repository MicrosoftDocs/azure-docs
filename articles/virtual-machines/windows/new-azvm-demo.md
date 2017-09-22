---
title: Create Windows VM using New-AzVM cmdlet in Azure Cloud Shell| Microsoft Docs
description: Quickly learn to create Windows virtual machines with the New-AzVMcmdlet in Azure Cloud Shell.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: hero-article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 09/21/2017
ms.author: cynthn
ROBOTS: NOINDEX

---

# Create a Windows virtual machine with the New-AzVM (Preview) in Cloud Shell 

The New-AzVM (Preview) cmdlet is a simplified way of creating a new VM using PowerShell. This guide details how to use PowerShell in Azure Cloud Shell, with the New-AzVM cmdlet preinstalled, to create a new Azure virtual machine running Windows Server 2016. Once deployment is complete, we connect to the server using RDP.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-powershell](../../../includes/cloud-shell-powershell.md)]

## Create the VM

You can use the **New-AzVM** cmdlet to create a VM with smart defaults that include using the Windows Server 2016 Datacenter image from the Azure Marketplace. You can use New-AzVM alone and it will use default values for the resource names. In this example, we set the **-Name** parameter as *myVM*. The cmdlet creates all the required resources using *myVM* as the prefix for the resource name. 

Make sure that **PowerShell** is selected in Cloud Shell and type:

```azurepowershell-interactive
New-AzVm -Name myVM
```

You are asked to create a username and password for the VM, which will be used when you connect to the VM later in this topic. The password must be 12-123 characters long and meet three out of the four following complexity requirements: one lower case character, one upper case character, one number, and one special character.

It takes a minute to create the VM and the associated resources. When finished, you can see all of the resources that were created using the [Find-AzureRmResource](/powershell/module/azurerm.resources/find-azurermresource) cmdlet.

```azurepowershell-interactive
Find-AzureRmResource `
	-ResourceGroupNameEquals myVMResourceGroup | Format-Table Name
```

## Connect to the VM

After the deployment has completed, create a remote desktop connection with the virtual machine.

Use the [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) command to return the public IP address of the virtual machine. Take note of this IP Address.

```azurepowershell-interactive
Get-AzureRmPublicIpAddress `
	-ResourceGroupName myVMResourceGroup | Select IpAddress
```

On your local machine, open a cmd prompt and use the **mstsc** command to start an remote desktop session with your new VM. Replace the &lt;publicIPAddress&gt; with the IP address of your virtual machine. When prompted, enter the username and password you gave your VM when it was created.

```
mstsc /v:<publicIpAddress>
```

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, VM, and all related resources.

```azurepowershell-interactive
Remove-AzureRmResourceGroup -Name myVMResourceGroup
```

## Next steps

In this topic, you’ve deployed a simple virtual machine using New-AzVM and then connected to it over RDP. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
