---
title: Tutorial - Use a custom VM image in a scale set with Azure PowerShell
description: Learn how to use Azure PowerShell to create a custom VM image that you can use to deploy a Virtual Machine Scale Set
author: cynthn
ms.service: virtual-machine-scale-sets
ms.subservice: shared-image-gallery
ms.topic: tutorial
ms.date: 12/16/2022
ms.author: cynthn
ms.reviewer: mimckitt 
ms.custom: devx-track-azurepowershell

---
# Tutorial: Create and use a custom image for Virtual Machine Scale Sets with Azure PowerShell
When you create a scale set, you specify an image to be used when the VM instances are deployed. To reduce the number of tasks after VM instances are deployed, you can use a custom VM image. This custom VM image includes any required application installs or configurations. Any VM instances created in the scale set use the custom VM image and are ready to serve your application traffic. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Azure Compute Gallery
> * Create an image definition
> * Create an image version
> * Create a scale-set from an image 
> * Share an image gallery

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Launch Azure Cloud Shell
The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.

## Create and configure a source VM
First, create a resource group with New-AzResourceGroup, then create a VM with New-AzVM. This VM is then used as the source for the image. The following example creates a VM named myVM in the resource group named myResourceGroup:

```azurepowershell-interactive
New-AzResourceGroup -Name 'myResourceGroup' -Location 'EastUS'

New-AzVm `
   -ResourceGroupName 'myResourceGroup' `
   -Name 'myVM' `
   -Location 'East US' `
   -VirtualNetworkName 'myVnet' `
   -SubnetName 'mySubnet' `
   -SecurityGroupName 'myNetworkSecurityGroup' `
   -PublicIpAddressName 'myPublicIpAddress' `
   -OpenPorts 80,3389
```

## Store the VM variable
You can see a list of VMs that are available in a resource group using [Get-AzVM](/powershell/module/az.compute/get-azvm). Once you know the VM name and what resource group, you can use `Get-AzVM` again to get the VM object and store it in a variable to use later. This example gets a VM named *myVM* from the "myResourceGroup" resource group and assigns it to the variable *$vm*. 

```azurepowershell-interactive
$sourceVM = Get-AzVM `
   -Name myVM `
   -ResourceGroupName myResourceGroup
```
## Create an image gallery 
An image gallery is the primary resource used for enabling image sharing. Allowed characters for gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes. Gallery names must be unique within your subscription. 

Create an image gallery using [New-AzGallery](/powershell/module/az.compute/new-azgallery). The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

```azurepowershell-interactive
$resourceGroup = New-AzResourceGroup `
   -Name 'myGalleryRG' `
   -Location 'EastUS'

$gallery = New-AzGallery `
   -GalleryName 'myGallery' `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -Description 'Azure Compute Gallery for my organization'	
```


## Create an image definition 
Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions).

Create the image definition using [New-AzGalleryImageDefinition](/powershell/module/az.compute/new-azgalleryimageversion). In this example, the gallery image is named *myGalleryImage* and is created for a specialized image. 

```azurepowershell-interactive
$galleryImage = New-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -OsState specialized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```

## Create an image version

Create an image version from a VM using [New-AzGalleryImageVersion](/powershell/module/az.compute/new-azgalleryimageversion). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the image version is *1.0.0* and it's replicated to both *East US* and *South Central US* datacenters. When choosing target regions for replication, you need to include the *source* region as a target for replication.

To create an image version from the VM, use `$vm.Id.ToString()` for the `-Source`.

```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='East US';ReplicaCount=2}
$targetRegions = @($region1,$region2)

New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name`
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $sourceVM.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2023-12-01'
```

It can take a while to replicate the image to all of the target regions.

## Create a scale set from the image
Now create a scale set with [New-AzVmss](/powershell/module/az.compute/new-azvmss) that uses the `-ImageName` parameter to define the custom VM image created in the previous step. To distribute traffic to the individual VM instances, a load balancer is also created. The load balancer includes rules to distribute traffic on TCP port 80, as well as allow remote desktop traffic on TCP port 3389 and PowerShell remoting on TCP port 5985. When prompted, provide your own desired administrative credentials for the VM instances in the scale set:

```azurepowershell-interactive
# Define variables for the scale set
$resourceGroupName = "myScaleSet"
$scaleSetName = "myScaleSet"
$location = "East US"

# Create a resource group
New-AzResourceGroup -ResourceGroupName $resourceGroupName -Location $location

# Create a configuration 
$vmssConfig = New-AzVmssConfig `
   -Location $location `
   -SkuCapacity 2 `
   -OrchestrationMode Flexible `
   -SkuName "Standard_D2s_v3"

# Reference the image version
Set-AzVmssStorageProfile $vmssConfig `
  -OsDiskCreateOption "FromImage" `
  -ImageReferenceId $galleryImage.Id

# Create the scale set 
New-AzVmss `
  -ResourceGroupName $resourceGroupName `
  -Name $scaleSetName `
  -VirtualMachineScaleSet $vmssConfig
```

It takes a few minutes to create and configure all the scale set resources and VMs.

## Share the gallery

We recommend that you share access at the image gallery level. Use an email address and the [Get-AzADUser](/powershell/module/az.resources/get-azaduser) cmdlet to get the object ID for the user, then use [New-AzRoleAssignment](/powershell/module/Az.Resources/New-AzRoleAssignment) to give them access to the gallery. Replace the example email, alinne_montes@contoso.com in this example, with your own information.

```azurepowershell-interactive
# Get the object ID for the user
$user = Get-AzADUser -StartsWith alinne_montes@contoso.com
# Grant access to the user for our gallery
New-AzRoleAssignment `
   -ObjectId $user.Id `
   -RoleDefinitionName Reader `
   -ResourceName $gallery.Name `
   -ResourceType Microsoft.Compute/galleries `
   -ResourceGroupName $resourceGroup.ResourceGroupName
```

## Clean up resources

When no longer needed, you can use the [Remove-AzResourceGroup](/powershell/module/az.resources/remove-azresourcegroup) cmdlet to remove the resource group, and all related resources:

```azurepowershell-interactive
# Delete the gallery 
Remove-AzResourceGroup -Name myGalleryRG

# Delete the scale set resource group
Remove-AzResourceGroup -Name myResoureceGroup
```

## Next steps
In this tutorial, you learned how to create and use a custom VM image for your scale sets with Azure PowerShell:

> [!div class="checklist"]
> * Create an Azure Compute Gallery
> * Create an image definition
> * Create an image version
> * Create a scale-set from an image 
> * Share an image gallery

Advance to the next tutorial to learn how to deploy applications to your scale set.

> [!div class="nextstepaction"]
> [Deploy applications to your scale sets](tutorial-install-apps-powershell.md)
