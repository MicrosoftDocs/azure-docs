---
title: Tutorial - Create shared VM images with Azure PowerShell | Microsoft Docs
description: Learn how to use Azure PowerShell to create a shared virtual machine image in Azure
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
ms.date: 09/05/2018
ms.author: cynthn
ms.custom: 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Preview: Create a shared image gallery with Azure PowerShell

The Shared Image Gallery greatly simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations. The Shared Image Gallery lets to share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. The gallery is a top-level resource that provides full role-based access control (RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

In this tutorial, you create your own custom image of an Azure virtual machine and add the image to an image gallery for sharing. You learn how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a managed image
> * Create an image gallery
> * Create a shared image
> * Create a VM from a shared image
> * Delete a resources

## Overview

A managed image is a copy of either a full VM (including any attached data disks) or just the OS disk, depending on how you create the image. When you create a VM  from the image, the copy of the VHDs in the image are used to create the disks for the new VM. The managed image remains in storage and can be used over and over again to create new VMs.

If you have a large number of managed images that you need to maintain and would like to make them available throughout your company, you can use a shared image gallery as a repository that makes it easy to update and share your images. The charges for using a shared image gallery are just the costs for the storage used by the images, plus any network egress costs for replicating images from the source region to the published regions.


Shared images encompasses multiple resources:

| Resource | Description|
|----------|------------|
| **Managed image** | This is a baseline image that can be used alone or used to create multiple **shared image versions** in an image gallery.|
| **Gallery** | Like the public Azure Marketplace, an image **gallery** is a repository for managing and sharing images, but you control who has access within your company. The name of your gallery must be unique within your subscription. |
| **Gallery image** | Images are defined within a gallery and carry information about the image and requirements for using it internally. This includes whether the image is Windows or Linux, release notes, and minumum and maximum memory requirements. This type of image is a resource within the resource manager deployment model, but it isn't used directly for creating VMs. It is a definition of a type of image. |
| **Shared image version** | An **image version** is what you use to create a VM when using a gallery. You can have multiple versions of an image as needed for your environment. Like a managed image, when you use an **image version** to create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times. |



### Regional Support

Regional support for shared image alleries is limited, but will expand over time. For preview: 

| Create Gallery In  | Replicate Version To |
|--------------------|----------------------|
| West Central US    |South Central US|
|                    |East US|
|                    |East US 2|
|                    |West US|
|                    |West US 2|
|                    |Central US|
|                    |North Central US|
|                    |Canada Central|
|                    |Canada East|
|                    |North Europe|
|                    |West Europe|
|                    |South India|
|                    |Southeast Asia|



## Before you begin

The steps below detail how to take an existing VM and turn it into a re-usable custom image that you can use to create new VM instances.

To complete the example in this tutorial, you must have an existing virtual machine. If needed, this [script sample](../scripts/virtual-machines-windows-powershell-sample-create-vm.md) can create one for you. When working through the tutorial, replace the resource group and VM names where needed.

[!INCLUDE [cloud-shell-powershell.md](../../../includes/cloud-shell-powershell.md)]

If you choose to install and use the PowerShell locally, this tutorial requires the AzureRM module version 6.1.1 or later. Run `Get-Module -ListAvailable AzureRM` to find the version. If you need to upgrade, see [Install Azure PowerShell module](/powershell/azure/install-azurerm-ps).

## Prepare the VM

To create an image of a virtual machine, you need to prepare the VM by generalizing the VM, deallocating, and then marking the source VM as generalized in Azure.

### Generalize the Windows VM using Sysprep

Sysprep removes all your personal account information, among other things, and prepares the machine to be used as an image. For details about Sysprep, see [How to Use Sysprep: An Introduction](http://technet.microsoft.com/library/bb457073.aspx).


1. Connect to the virtual machine.
2. Open the Command Prompt window as an administrator. Change the directory to *%windir%\system32\sysprep*, and then run *sysprep.exe*.
3. In the **System Preparation Tool** dialog box, select *Enter System Out-of-Box Experience (OOBE)*, and make sure that the *Generalize* check box is selected.
4. In **Shutdown Options**, select *Shutdown* and then click **OK**.
5. When Sysprep completes, it shuts down the virtual machine. **Do not restart the VM**.

### Deallocate and mark the VM as generalized

To create an image, the VM needs to be deallocated and marked as generalized in Azure.

Deallocated the VM using [Stop-AzureRmVM](/powershell/module/azurerm.compute/stop-azurermvm).

```azurepowershell-interactive
Stop-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Force
```

Set the status of the virtual machine to `-Generalized` using [Set-AzureRmVm](/powershell/module/azurerm.compute/set-azurermvm). 
   
```azurepowershell-interactive
Set-AzureRmVM -ResourceGroupName myResourceGroup -Name myVM -Generalized
```


## Create the managed image

Now you can create an image of the VM by using [New-AzureRmImageConfig](/powershell/module/azurerm.compute/new-azurermimageconfig) and [New-AzureRmImage](/powershell/module/azurerm.compute/new-azurermimage). The following example creates an image named *myImage* from a VM named *myVM*.

Get the virtual machine. 

```azurepowershell-interactive
$vm = Get-AzureRmVM -Name myVM -ResourceGroupName myResourceGroup
```

Create the image configuration.

```azurepowershell-interactive
$managedImageConfig = New-AzureRmImageConfig -Location West Central US -SourceVirtualMachineId $vm.ID 
```

Create the image.

```azurepowershell-interactive
$managedImage = New-AzureRmImage -Image $managedImageConfig -ImageName myManagedImage -ResourceGroupName myResourceGroup
```	


## Create an image gallery

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. 

Create a new resource group for the gallery, a gallery configuration, and then create the gallery. In this example, the gallery is named *myGallery* and the resource group is *myGalleryRG*.

```azurepowershell-interactive
$resourceGroup = New-AzureRMResourceGroup `
   -Name myGalleryRG `
   -Location "West Central US"

$galleryConfig = New-AzureRmGalleryConfig `
   -Location $resourceGroup.Location `
   -Description "Shared image gallery for testing."

$gallery = New-AzureRmGallery `
   -GalleryName "myGallery" `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Gallery $galleryConfig
```



## Create a gallery image 

Create a configuration file for the gallery image and then create the image. In this example, the gallery image is named *myGalleryImage*.

```azurepowershell-interactive
$imageConfig = New-AzureRmGalleryImageConfig `
   -OsType Windows `
   -OsState Generalized `
   -Location $gallery.Location `
   -IdentifierPublisher "myPublisher" `
   -IdentifierOffer "myOffer" `
   -IdentifierSku "mySKU" 

$galleryImage = New-AzureRmGalleryImage `
   -GalleryImageName "myGalleryImage" `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -GalleryImage $imageConfig

```

##Create an image version

Create the first version of the image. In this example, the image version is *1.0.0* and it is replicated to both *West Central US* and *South Central US* datacenters.

```azurepowershell-interactive
$versionConfig = New-AzureRmGalleryImageVersionConfig `
   -Location $resourceGroup.Location `
   -Region "West Central US", "South Central US" `
   -Source $managedImage.Id.ToString() `
   -PublishingProfileEndOfLifeDate "2020-01-01"

$imageVersion = New-AzureRmGalleryImageVersion `
   -GalleryImageName $galleryImage.Name `
   -GalleryImageVersionName "1.0.0" `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -GalleryImageVersion $versionConfig
```
 
 
## Create VMs from an image

Now that you have an image, you can create one or more new VMs from the image. Creating a VM from a custom image is similar to creating a VM using a Marketplace image. When you use a Marketplace image, you have to provide the information about the image, image provider, offer, SKU, and version. Using the simplified parameter set for the [New-AzureRMVM]() cmdlet, you just need to provide the name of the custom image as long as it is in the same resource group. 

This example creates a VM named *myVMfromImage*, in the *myResourceGroup* in the *East US* datacenter.

```azurepowershell-interactive
New-AzureRmVm `
   -ResourceGroupName "myResourceGroup" `
   -Name "myVMfromImage" `
   -Image $imageVersion.Id `
   -Location "East US" `
   -VirtualNetworkName "myImageVnet" `
   -SubnetName "myImageSubnet" `
   -SecurityGroupName "myImageNSG" `
   -PublicIpAddressName "myImagePIP" `
   -OpenPorts 3389
```

## Image management 

Here are some examples of common management image tasks and how to complete them using PowerShell.

List all images by name.

```azurepowershell-interactive
$images = Find-AzureRMResource -ResourceType Microsoft.Compute/images 
$images.name
```

Delete an image. This example deletes the image named *myOldImage* from the *myResourceGroup*.

```azurepowershell-interactive
Remove-AzureRmImage `
    -ImageName myOldImage `
	-ResourceGroupName myResourceGroup
```

Get gallery resources.

```azurepowershell-interactive
Get-AzureRmGallery `
   -ResourceGroupName rgname `
   -GalleryName galname 
Get-AzureRmGalleryImage `
   -ResourceGroupName rgname `
   -GalleryName galname `
   -GalleryImageName imagename 
Get-AzureRmGalleryImageVersion `
   -ResourceGroupName rgname `
   -GalleryName galname `
   -GalleryImageName imagename `
   -GalleryImageVersionName '1.0.0' 
Get-AzureRmGalleryImageVersion `
   -ResourceGroupName rgname `
   -GalleryName galname `
   -GalleryImageName imagename `
   -GalleryImageVersionName '1.0.0' `
   -Expand ReplicationStatus  
```

List gallery resources.

```azurepowershell-interactive
Get-AzureRmGallery	 
Get-AzureRmGallery -ResourceGroupName myResourceGroup  
Get-AzureRmGalleryImage -ResourceGroupName myResourceGroup -GalleryName myGallery  
Get-AzureRmGalleryImageVersion -ResourceGroupName myResourceGroup -GalleryName myGallery -GalleryImageName myGalleryImage
```



## Next steps

In this tutorial, you created a custom VM image. You learned how to:

> [!div class="checklist"]
> * Deprovision and generalize VMs
> * Create a managed image
> * Create an image gallery
> * Create a shared image
> * Create a VM from a shared image
> * Delete a resources

Advance to the next tutorial to learn about how highly available virtual machines.

> [!div class="nextstepaction"]
> [Create highly available VMs](tutorial-availability-sets.md)


