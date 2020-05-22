---
title: Tutorial - High availability for Windows VMs in Azure 
description: In this tutorial, you learn how to use Azure PowerShell to deploy highly available virtual machines in Availability Sets
services: virtual-machines-windows
author: cynthn
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.topic: tutorial
ms.date: 11/30/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about high availability in Azure so that I can deploy a highly-available and redundant infrastructure.
---

# Tutorial: Create and deploy highly available virtual machines with Azure PowerShell

In this tutorial, you learn how to increase the availability and reliability of your Virtual Machines (VMs) using Availability Sets. Availability Sets make sure the VMs you deploy on Azure are distributed across multiple, isolated hardware nodes, in a cluster. 

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create an availability set
> * Create a VM in an availability set
> * Check available VM sizes
> * Check Azure Advisor


## Availability set overview

An Availability Set is a logical grouping capability for isolating VM resources from each other when they're deployed. Azure makes sure that the VMs you place within an Availability Set run across multiple physical servers, compute racks, storage units, and network switches. If a hardware or software failure happens, only a subset of your VMs are impacted and your overall solution stays operational. Availability Sets are essential for building reliable cloud solutions.

Let’s consider a typical VM-based solution where you might have four front-end web servers and 2 back-end VMs. With Azure, you’d want to define two availability sets before you deploy your VMs: one for the web tier and one for the back tier. When you create a new VM, you specify the availability set as a parameter. Azure makes sure the VMs are isolated across multiple physical hardware resources. If the physical hardware that one of your servers is running on has a problem, you know the other instances of your servers will keep running because they're on different hardware.

Use Availability Sets when you want to deploy reliable VM-based solutions in Azure.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create an availability set

The hardware in a location is divided in to multiple update domains and fault domains. An **update domain** is a group of VMs and underlying physical hardware that can be rebooted at the same time. VMs in the same **fault domain** share common storage as well as a common power source and network switch.  

You can create an availability set using [New-AzAvailabilitySet](https://docs.microsoft.com/powershell/module/az.compute/new-azavailabilityset). In this example, the number of both update and fault domains is *2* and the availability set is named *myAvailabilitySet*.

Create a resource group.

```azurepowershell-interactive
New-AzResourceGroup `
   -Name myResourceGroupAvailability `
   -Location EastUS
```

Create a managed availability set using [New-AzAvailabilitySet](https://docs.microsoft.com/powershell/module/az.compute/new-azavailabilityset) with the `-sku aligned` parameter.

```azurepowershell-interactive
New-AzAvailabilitySet `
   -Location "EastUS" `
   -Name "myAvailabilitySet" `
   -ResourceGroupName "myResourceGroupAvailability" `
   -Sku aligned `
   -PlatformFaultDomainCount 2 `
   -PlatformUpdateDomainCount 2
```

## Create VMs inside an availability set
VMs must be created within the availability set to make sure they're correctly distributed across the hardware. You can't add an existing VM to an availability set after it's created. 


When you create a VM with [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm), you use the `-AvailabilitySetName` parameter to specify the name of the availability set.

First, set an administrator username and password for the VM with [Get-Credential](https://msdn.microsoft.com/powershell/reference/5.1/microsoft.powershell.security/Get-Credential):

```azurepowershell-interactive
$cred = Get-Credential
```

Now create two VMs with [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) in the availability set.

```azurepowershell-interactive
for ($i=1; $i -le 2; $i++)
{
    New-AzVm `
        -ResourceGroupName "myResourceGroupAvailability" `
        -Name "myVM$i" `
        -Location "East US" `
        -VirtualNetworkName "myVnet" `
        -SubnetName "mySubnet" `
        -SecurityGroupName "myNetworkSecurityGroup" `
        -PublicIpAddressName "myPublicIpAddress$i" `
        -AvailabilitySetName "myAvailabilitySet" `
        -Credential $cred
}
```

It takes a few minutes to create and configure both VMs. When finished, you have two virtual machines distributed across the underlying hardware. 

If you look at the availability set in the portal by going to **Resource Groups** > **myResourceGroupAvailability** > **myAvailabilitySet**, you should see how the VMs are distributed across the two fault and update domains.

![Availability set in the portal](./media/tutorial-availability-sets/fd-ud.png)

## Check for available VM sizes 

When you create a VM inside a availability set, you need to know what VM sizes are available on the hardware. Use [Get-AzVMSize](https://docs.microsoft.com/powershell/module/az.compute/get-azvmsize) command to get all available sizes for virtual machines that you can deploy in the availability set.

```azurepowershell-interactive
Get-AzVMSize `
   -ResourceGroupName "myResourceGroupAvailability" `
   -AvailabilitySetName "myAvailabilitySet"
```

## Check Azure Advisor 

You can also use Azure Advisor to get more information on how to improve the availability of your VMs. Azure Advisor analyzes your configuration and usage telemetry, then recommends solutions that can help you improve the cost effectiveness, performance, availability, and security of your Azure resources.

Sign in to the [Azure portal](https://portal.azure.com), select **All services**, and type **Advisor**. The Advisor dashboard shows personalized recommendations for the selected subscription. For more information, see [Get started with Azure Advisor](../../advisor/advisor-get-started.md).


## Next steps

In this tutorial, you learned how to:

> [!div class="checklist"]
> * Create an availability set
> * Create a VM in an availability set
> * Check available VM sizes
> * Check Azure Advisor

Advance to the next tutorial to learn about virtual machine scale sets.

> [!div class="nextstepaction"]
> [Create a VM scale set](tutorial-create-vmss.md)


