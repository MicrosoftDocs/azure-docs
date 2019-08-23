---
title: Create VM from a managed image in Azure | Microsoft Docs
description: Create a Windows virtual machine from a generalized managed image using Azure PowerShell or the Azure portal, in the Resource Manager deployment model.
services: virtual-machines-windows
documentationcenter: ''
author: cynthn
manager: gwallace
editor: ''
tags: azure-resource-manager

ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: article
ms.date: 09/17/2018
ms.author: cynthn

---
# Create a VM from a managed image

You can create multiple virtual machines (VMs) from an Azure managed VM image using the Azure portal or PowerShell. A managed VM image contains the information necessary to create a VM, including the OS and data disks. The virtual hard disks (VHDs) that make up the image, including both the OS disks and any data disks, are stored as managed disks. 

Before creating a new VM, you'll need to [create a managed VM image](capture-image-resource.md) to use as the source image and grant read access on the image to any user who should have access to the image. 


## Use the portal

1. Open the [Azure portal](https://portal.azure.com).
2. On the left menu, select **All resources**. You can sort the resources by **Type** to easily find your images.
3. Select the image you want to use from the list. The image **Overview** page opens.
4. Select **Create VM** from the menu.
5. Enter the virtual machine information. The user name and password entered here will be used to log in to the virtual machine. When complete, select **OK**. You can create the new VM in an existing resource group, or choose **Create new** to create a new resource group to store the VM.
6. Select a size for the VM. To see more sizes, select **View all** or change the **Supported disk type** filter. 
7. Under **Settings**, make changes as necessary and select **OK**. 
8. On the summary page, you should see your image name listed as a **Private image**. Select **Ok** to start the virtual machine deployment.


## Use PowerShell

You can use PowerShell to create a VM from an image by using the simplified parameter set for the [New-AzVm](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) cmdlet. The image needs to be in the same resource group where you'll create the VM.

[!INCLUDE [updated-for-az.md](../../../includes/updated-for-az.md)]

The simplified parameter set for [New-AzVm](https://docs.microsoft.com/powershell/module/az.compute/new-azvm) only requires that you provide a name, resource group, and image name to create a VM from an image. New-AzVm will use the value of the **-Name** parameter as the name of all of the resources that it creates automatically. In this example, we provide more detailed names for each of the resources but let the cmdlet create them automatically. You can also create resources beforehand, such as the virtual network, and pass the resource name into the cmdlet. New-AzVm will use the existing resources if it can find them by their name.

The following example creates a VM named *myVMFromImage*, in the *myResourceGroup* resource group, from the image named *myImage*. 


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



## Next steps
[Create and manage Windows VMs with the Azure PowerShell module](tutorial-manage-vm.md?toc=%2fazure%2fvirtual-machines%2fwindows%2ftoc.json)

