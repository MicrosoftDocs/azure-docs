---
 title: Managed shared image gallery resources using PowerShell
 description: Examples of how to list, update and delete shared image gallery resources using Azure PowerShell.
 services: virtual-machines
 author: cynthn
 ms.service: virtual-machines
 ms.subservice: imaging
 ms.topic: include
 ms.date: 11/07/2018
 ms.author: cynthn
 ms.custom: include file
---

# Manage shared image gallery resources

This article shows you how to use PowerShell cmdlets to manage resources in your Shared Image Gallery.


## List

List all galleries by name.	

```azurepowershell-interactive	
$galleries = Get-AzResource -ResourceType Microsoft.Compute/galleries	
$galleries.Name	
```	

List all image definitions by name.	

```azurepowershell-interactive	
$imageDefinitions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images	
$imageDefinitions.Name	
```	

List all image versions by name.	

```azurepowershell-interactive	
$imageVersions = Get-AzResource -ResourceType Microsoft.Compute/galleries/images/versions	
$imageVersions.Name	
```	

Delete an image version. This example deletes the image version named *1.0.0*.	

```azurepowershell-interactive	
Remove-AzGalleryImageVersion `	
   -GalleryImageDefinitionName myImageDefinition `	
   -GalleryName myGallery `	
   -Name 1.0.0 `	
   -ResourceGroupName myGalleryRG	
```	


[!INCLUDE [virtual-machines-common-shared-images-update-delete-ps](../../includes/virtual-machines-common-shared-images-update-delete-ps.md)]







