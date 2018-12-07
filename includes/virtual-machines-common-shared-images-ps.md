---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/07/2018
 ms.author: cynthn
 ms.custom: include file
---


## Preview: Register the feature

Shared Image Galleries is in preview, but you need to register the feature before you can use it. To register the Shared Image Galleries feature:

```azurepowershell-interactive
Register-AzureRmProviderFeature `
   -FeatureName GalleryPreview `
   -ProviderNamespace Microsoft.Compute
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
```

## Find the managed image

See a list of images that are available in a resource group using [Get-AzureRmImage](/powershell/module/AzureRM.Compute/get-azurermimage). This example gets an image named *myImage* and assigns to the variable *$managedImage*.

```azurepowershell-interactive
$managedImage = Get-AzureRmImage -ImageName myImage -ResourceGroupName myResourceGroup
```

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. Create an image gallery using [New-AzureRmGallery](/powershell/module/AzureRM.Compute/new-azurermgallery). The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

```azurepowershell-interactive
$resourceGroup = New-AzureRMResourceGroup `
   -Name 'myGalleryRG' `
   -Location 'West Central US'	
   
$gallery = New-AzureRmGallery `
   -GalleryName 'myGallery' `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -Description 'Shared Image Gallery for my organization'	
```
   
## Create an image definition 

Create the gallery image definition using [New-AzureRmGalleryImageDefinition](/powershell/module/azurerm.compute/new-azurermgalleryimageversion). In this example, the gallery image is named *myGalleryImage*.

```azurepowershell-interactive
$galleryImage = New-AzureRmGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -Offer 'myOffer' `
   -OsState generalized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Sku 'mySKU'

```

##Create an image version

Create an image version from a managed image using [New-AzureRmGalleryImageVersion](/powershell/module/AzureRM.Compute/new-azurermgalleryimageversion) . In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters.


```azurepowershell-interactive
$imageVersion = New-AzureRmGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion (Name='West Central US';ReplicaCount=2), (Name='East US';ReplicaCount=2), (Name='West US';ReplicaCount=1)  `
   -Source $managedImage.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-01-01'
```


```azurepowershell-interactive

$region1 = @{Name='West US';ReplicaCount=1}
$region2 = @{Name='East US';ReplicaCount=2}
$region3 = @{Name='West Central US';ReplicaCount=2}
$targetRegions = @($region1,$region2,$region3)
$imageVersion = New-AzureRmGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $managedImage.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-01-01'
```

