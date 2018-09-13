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




