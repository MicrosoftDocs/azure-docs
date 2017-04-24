---
title: Create custom VM images with the Azure PowerShell | Microsoft Docs
description: Tutorial - Create a custom VM image using the Azure PowerShell.
services: virtual-machines-windows
documentationcenter: virtual-machines
author: cynthn
manager: timlt
editor: tysonn
tags: azure-resource-manager

ms.assetid: 
ms.service: virtual-machines-windows
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 04/24/2017
ms.author: cynthn
---

# Create a custom image of an Azure VM using PowerShell

In this tutorial, you learn how to create your own custom image of an Azure virtual machine. Custom images are like marketplace images, but you create them yourself. Custom images can be used to boot strap configurations such as preloading applications, application configurations, and other OS configurations. When creating a custom image, the VM plus all attached disks are included in the image. 

The steps in this tutorial can be completed using the latest [Azure CLI 2.0](/cli/azure/install-azure-cli).

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-linux-cli-sample-create-vm-nginx.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

## Create an image

To create an image of a virtual machine, you need to prepare the VM by generalizing the VM, deallocating, and then marking the source VM as generalized in Azure.

### Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).



1. Connect to the virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to **%windir%\system32\sysprep**, and then run `sysprep.exe`.
3. In the **System Preparation Tool** dialog box, select **Enter System Out-of-Box Experience (OOBE)**, and make sure that the **Generalize** check box is selected.
4. In **Shutdown Options**, select **Shutdown**.
5. Click **OK**.
   
    ![Start Sysprep](./media/upload-generalized-managed/sysprepgeneral.png)
6. When Sysprep completes, it shuts down the virtual machine. Do not restart the VM.

### Deallocate and mark the VM as generalized

To create an image, the VM needs to be deallocated and marked as generalized in Azure.

Deallocated the VM using [Stop-AzureRmVM](/powershell/module/azurerm.compute/stop-azurermvm).

    ```powershell
	Stop-AzureRmVM -ResourceGroupName myResourceGroupImages -Name myVM -Force
	```
	
3. Set the status of the virtual machine to **Generalized** using [Set-AzureRmVm](/powershell/module/azurerm.compute/set-azurermvm). 
   
    ```powershell
    Set-AzureRmVM -ResourceGroupName myResourceGroupImages -Name myVM -Generalized
	```

	
### Create the image

Now you can create an image of the VM by using [New-AzureRmImageConfig](/powershell/module/azurerm.compute/new-azurermiamgeconfig) and [New-AzureRmImage](/powershell/module/azurerm.compute/new-azurermimage). The following example creates an image named `myImage` from a VM named `myVM`.

4. Get the virtual machine. 

    ```powershell
	$vm = Get-AzureRmVM -Name $vmName -ResourceGroupName myResourceGroupImages
	```

5. Create the image configuration.

    ```powershell
	$image = New-AzureRmImageConfig -Location $location -SourceVirtualMachineId $vm.ID 
	```
6. Create the image.

    ```powershell
    New-AzureRmImage -Image $image -ImageName $imageName -ResourceGroupName myResourceGroupImages
    ```	



To create an image, the VM needs to be deallocated. Deallocate the VM using [az vm deallocate](/cli//azure/vm#deallocate). 
   
```azurecli
az vm deallocate --resource-group myRGCaptureImage --name myVM
```

Finally, set the state of the VM as generalized with [az vm generalize](/cli//azure/vm#generalize).
   
```azurecli
az vm generalize --resource-group myResourceGroupImages --name myVM
```

### Capture the image

Now you can create an image of the VM by using [az image create](/cli//azure/image#create). The following example creates an image named `myImage` from a VM named `myVM`.
   
```azurecli
az image create --resource-group myResourceGroupImages --name myImage --source myVM
```
 
## Create a VM from an image

You can create a VM using an image with [az vm create](/cli/azure/vm#create). The following example creates a VM named `myVMfromImage` from the image named `myImage`.

```azurecli
az vm create --resource-group myResourceGroupImages --name myVMfromImage --image myImage --admin-username azureuser --generate-ssh-keys
```

## Next steps

In this tutorial, you have learned about creating custom VM images. Advance to the next tutorial to learn about how highly available virtual machines.

[Create highly available VMs](tutorial-availability-sets.md).

