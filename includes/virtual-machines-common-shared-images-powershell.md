---
 title: include file
 description: include file
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 12/10/2018
 ms.author: cynthn
 ms.custom: include file
---


## Launch Azure Cloud Shell

The Azure Cloud Shell is a free interactive shell that you can use to run the steps in this article. It has common Azure tools preinstalled and configured to use with your account. 

To open the Cloud Shell, just select **Try it** from the upper right corner of a code block. You can also launch Cloud Shell in a separate browser tab by going to [https://shell.azure.com/powershell](https://shell.azure.com/powershell). Select **Copy** to copy the blocks of code, paste it into the Cloud Shell, and press enter to run it.


## Preview: Register the feature

Shared Image Galleries is in preview, but you need to register the feature before you can use it. To register the Shared Image Galleries feature:

```azurepowershell-interactive
Register-AzProviderFeature `
   -FeatureName GalleryPreview `
   -ProviderNamespace Microsoft.Compute
Register-AzResourceProvider -ProviderNamespace Microsoft.Compute
```

## Get the managed image

You can see a list of images that are available in a resource group using [Get-AzImage](https://docs.microsoft.com/powershell/module/az.compute/get-azimage). Once you know the image name and what resource group it is in, you can use `Get-AzImage` again to get the image object and store it in a variable to use later. This example gets an image named *myImage* from the "myResourceGroup" resource group and assigns it to the variable *$managedImage*. 

```azurepowershell-interactive
$managedImage = Get-AzImage `
   -ImageName myImage `
   -ResourceGroupName myResourceGroup
```

## Create an image gallery 

An image gallery is the primary resource used for enabling image sharing. Gallery names must be unique within your subscription. Create an image gallery using [New-AzGallery](https://docs.microsoft.com/powershell/module/az.compute/new-azgallery). The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

```azurepowershell-interactive
$resourceGroup = New-AzResourceGroup `
   -Name 'myGalleryRG' `
   -Location 'West Central US'	
$gallery = New-AzGallery `
   -GalleryName 'myGallery' `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -Description 'Shared Image Gallery for my organization'	
```
   
## Create an image definition 

Create the gallery image definition using [New-AzGalleryImageDefinition](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion). In this example, the gallery image is named *myGalleryImage*.

```azurepowershell-interactive
$galleryImage = New-AzGalleryImageDefinition `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $gallery.Location `
   -Name 'myImageDefinition' `
   -OsState generalized `
   -OsType Windows `
   -Publisher 'myPublisher' `
   -Offer 'myOffer' `
   -Sku 'mySKU'
```
### Using publisher, offer and SKU 
For customers planning on implementing shared images, **in an upcoming release**, you'll be able to use your personally defined **-Publisher**, **-Offer** and **-Sku** values to find and specify an image definition, then create a VM using latest image version from the matching image definition. For example, here are three image definitions and their values:

|Image Definition|Publisher|Offer|Sku|
|---|---|---|---|
|myImage1|myPublisher|myOffer|mySku|
|myImage2|myPublisher|standardOffer|mySku|
|myImage3|Testing|standardOffer|testSku|

All three of these have unique sets of values. You can have image versions that share one or two, but not all three values. **In an upcoming release**, you will be able to combine these values in order to request the latest version of a specific image. **This doesn't work in the current release**, but will be available in the future. When released, using the following syntax should be used to set the source image as *myImage1* from the table above.

```powershell
$vmConfig = Set-AzVMSourceImage `
   -VM $vmConfig `
   -PublisherName myPublisher `
   -Offer myOffer `
   -Skus mySku 
```

This is similar to how you can currently specify use publisher, offer and SKU for [Azure Marketplace images](../articles/virtual-machines/windows/cli-ps-findimage.md) to get the latest version of a Marketplace image. With this in mind, each image definition needs to have a unique set of these values.  

## Create an image version

Create an image version from a managed image using [New-AzGalleryImageVersion](https://docs.microsoft.com/powershell/module/az.compute/new-azgalleryimageversion) . In this example, the image version is *1.0.0* and it's replicated to both *West Central US* and *South Central US* datacenters.


```azurepowershell-interactive
$region1 = @{Name='South Central US';ReplicaCount=1}
$region2 = @{Name='West Central US';ReplicaCount=2}
$targetRegions = @($region1,$region2)
$job = $imageVersion = New-AzGalleryImageVersion `
   -GalleryImageDefinitionName $galleryImage.Name `
   -GalleryImageVersionName '1.0.0' `
   -GalleryName $gallery.Name `
   -ResourceGroupName $resourceGroup.ResourceGroupName `
   -Location $resourceGroup.Location `
   -TargetRegion $targetRegions  `
   -Source $managedImage.Id.ToString() `
   -PublishingProfileEndOfLifeDate '2020-01-01' `
   -asJob 
```

It can take a while to replicate the image to all of the target regions, so we have created a job so we can track the progress. To see the progress of the job, type `$job.State`.

```azurepowershell-interactive
$job.State
```

