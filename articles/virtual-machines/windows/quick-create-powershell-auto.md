---
title: Azure Quick Start - Create Windows VM PowerShell | Microsoft Docs
description: Quickly learn to create a Windows virtual machines with PowerShell
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
ms.date: 09/11/2017
ms.author: cynthn
ms.custom: mvc
---

# Create a Windows virtual machine with PowerShell

The Azure PowerShell module is used to create and manage Azure resources from the PowerShell command line or in scripts. This guide details using the preview of PowerShell in Azure Cloud Shell to create an Azure virtual machine running Windows Server 2016. Once deployment is complete, we connect to the server and install IIS.  

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.


[!INCLUDE [cloud-shell-powershell](../../../includes/cloud-shell-powershell.md)]

## Create the VM

Make sure that **PowerShell** preview is select in Cloud Shell.

We will be using a new cmdlet [New-AzVM](/powershell/module/azurerm.network/new-azvm) to create the VM with smart defaults that include using the Windows Server 2016 Datacenter image from the Azure Marketplace as the OS. 

In Azure Cloud Shell, type:

```powershell-interactive
New-AzVM
```

It will take a minute to create the VM. When it is finished, you should see something like:

XXXXXXXXXXXXXXX


## Connect to virtual machine

After the deployment has completed, create a remote desktop connection with the virtual machine.

Use the [Get-AzureRmPublicIpAddress](/powershell/module/azurerm.network/get-azurermpublicipaddress) command to return the public IP address of the virtual machine. Take note of this IP Address so you can connect to it with your browser to test web connectivity in a future step.

```powershell
Get-AzureRmPublicIpAddress -ResourceGroupName myResourceGroup | Select IpAddress
```

Use the following command to create a remote desktop session with the virtual machine. Replace the IP address with the *publicIPAddress* of your virtual machine. When prompted, enter the credentials used when creating the virtual machine.

```bash 
mstsc /v:<publicIpAddress>
```

## Install IIS via PowerShell

Now that you have logged in to the Azure VM, you can use a single line of PowerShell to install IIS and enable the local firewall rule to allow web traffic. Open a PowerShell prompt and run the following command:

```powershell
Install-WindowsFeature -name Web-Server -IncludeManagementTools
```

## View the IIS welcome page

With IIS installed and port 80 now open on your VM from the Internet, you can use a web browser of your choice to view the default IIS welcome page. Be sure to use the *publicIpAddress* you documented above to visit the default page. 

![IIS default site](./media/quick-create-powershell/default-iis-website.png) 

## Clean up resources

When no longer needed, you can use the [Remove-AzureRmResourceGroup](/powershell/module/azurerm.resources/remove-azurermresourcegroup) command to remove the resource group, VM, and all related resources.

```powershell
Remove-AzureRmResourceGroup -Name myResourceGroup
```

## Next steps

In this quick start, you’ve deployed a simple virtual machine, a network security group rule, and installed a web server. To learn more about Azure virtual machines, continue to the tutorial for Windows VMs.

> [!div class="nextstepaction"]
> [Azure Windows virtual machine tutorials](./tutorial-manage-vm.md)
