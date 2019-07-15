---
title: Tutorial - Create custom VM images with Azure PowerShell | Microsoft Docs
description: In this tutorial, you learn how to use Azure PowerShell to create a custom virtual machine image in Azure
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: gwallace
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: tutorial
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 11/30/2018
ms.author: cynthn
ms.custom: mvc

#Customer intent: As an IT administrator, I want to learn about how to create custom VM images to minimize the number of post-deployment configuration tasks.
---

# Tutorial: Create a custom image of an Azure VM with Azure PowerShell

Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap deployments and ensure consistency across multiple VMs. In this tutorial, you create your own custom image of an Azure virtual machine using PowerShell. You learn how to:

> [!div class="checklist"]
> * Sysprep and generalize VMs
> * Create a custom image
> * Create a VM from a custom image
> * List all the images in your subscription
> * Delete an image

## Before you begin

The steps below detail how to take an existing VM and turn it into a re-usable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Prepare VM

To create an image of a virtual machine, you need to prepare the source VM by generalizing it, deallocating, and then marking it as generalized with Azure.

### Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](https://technet.microsoft.com/library/bb457073.aspx).


1. Connect to the virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to *%windir%\system32\sysprep*, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown** and then click **OK**.
5. When Sysprep completes, it shuts down the virtual machine. **Do not restart the VM**.

### Deallocate and mark the VM as generalized

To create an image, the VM needs to be deallocated and marked as generalized in Azure.

Deallocate the VM using [Stop-AzVM](https://docs.microsoft.com/powershell/module/az.compute/stop-azvm).

```azurepowershell-interactive
Stop-AzVM `
   -ResourceGroupName myResourceGroup `
   -Name myVM -Force
```

Set the status of the virtual machine to `-Generalized` using [Set-AzVm](https://docs.microsoft.com/powershell/module/az.compute/set-azvm). 
   
```azurepowershell-interactive
Set-AzVM `
   -ResourceGroupName myResourceGroup `
   -Name myVM -Generalized
```


## Create the image

Now you can create an image of the VM by using [New-AzImageConfig](https://docs.microsoft.com/powershell/module/az.compute/new-azimageconfig) and [New-AzImage](https://docs.microsoft.com/powershell/module/az.compute/new-azimage). The following example creates an image named *myImage* from a VM named *myVM*.

Get the virtual machine. 

```azurepowershell-interactive
$vm = Get-AzVM `
   -Name myVM `
   -ResourceGroupName myResourceGroup
```

Create the image configuration.

```azurepowershell-interactive
$image = New-AzImageConfig `
   -Location EastUS `
   -SourceVirtualMachineId $vm.ID 
```

Create the image.

```azurepowershell-interactive
New-AzImage `
   -Image $image `
   -ImageName myImage `
   -ResourceGroupName myResourceGroup
```	

 
## Create VMs from the image

Now that you have an image, you can create one or more new VMs from the image. Creating a VM from a custom image is similar to creating a VM using a Marketplace image. When you use a Marketplace image, you have to provide the information about the image, image provider, offer, SKU, and version. Using the simplified parameter set for the [New-AzVM](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) cmdlet, you just need to provide the name of the custom image as long as it is in the same resource group. 

This example creates a VM named *myVMfromImage* from the *myImage* image, in *myResourceGroup*.


```azurepowershell-interactive
New-AzVm `
    -ResourceGroupName "myResourceGroup" `
    -Name "myVMfromImage" `
	-ImageName "myImage" `
    -Location "East US" `
    -VirtualNetworkName "myImageVnet" `
    -SubnetName "myImageSubnet" `
    -SecurityGroupName "myImageNSG" `
    -PublicIpAddressName "myImagePIP" `
    -OpenPorts 3389
```

## Image management 

Here are some examples of common managed image tasks and how to complete them using PowerShell.

List all images by name.

```azurepowershell-interactive
$images = Get-AzResource -ResourceType Microsoft.Compute/images 
$images.name
```

Delete an image. This example deletes the image named *myImage* from the *myResourceGroup*.

```azurepowershell-interactive
Remove-AzImage `
    -ImageName myImage `
	-ResourceGroupName myResourceGroup
```

## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Sysprep and generalize VMs
> * Create a custom image
> * Create a VM from a custom image
> * List all the images in your subscription
> * Delete an image

Advance to the next tutorial to learn about how to create highly available virtual machines.

> [!div class="nextstepaction"]
> [Create highly available VMs](tutorial-availability-sets.md)



