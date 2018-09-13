---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/13/2018
 ms.author: cynthn
 ms.custom: include file
---

## Find the managed image

```azurepowershell-interactive
$managedImage = xxxx -Image $managedImageConfig -ImageName myManagedImage -ResourceGroupName myResourceGroup


## Preview: Register the feature

Shared Image Galleries is in preview, but you need to register the feature before you can use it. To register the Shared Image Galleries feature:

```azurepowershell-interactive
Register-AzureRmProviderFeature -FeatureName GalleryPreview -ProviderNamespace Microsoft.Compute
Register-AzureRmResourceProvider -ProviderNamespace Microsoft.Compute
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


