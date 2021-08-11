---
title: Create a Shared Image Gallery
description: Learn how to create a Shared Image Gallery in Azure
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 07/15/2021
ms.author: cynthn
ms.reviewer: akjosh
ms.custom: template-how-to 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Create a gallery for storing and sharing images


A [Shared Image Gallery](./shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap deployment tasks like preloading applications, application configurations, and other OS configurations. 

The Shared Image Gallery lets you share your custom VM images with others in your organization, within or across regions, within an AAD tenant. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group shared images. 

The gallery is a top-level resource that provides full Azure role-based access control (Azure RBAC). Images can be versioned, and you can choose to replicate each image version to a different set of Azure regions. The gallery only works with Managed Images.

The Shared Image Gallery feature has multiple resource types. 

[!INCLUDE [virtual-machines-shared-image-gallery-resources](./includes/virtual-machines-shared-image-gallery-resources.md)]

## Create a gallery

An image gallery is the primary resource used for enabling image sharing. Allowed characters for gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes. Gallery names must be unique within your subscription. 

Choose an option below for creating your gallery:

### [Portal](#tab/portal)

The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

1. Sign in to the Azure portal at https://portal.azure.com.
1. Use the type **Shared image gallery** in the search box and select **Shared image gallery** in the results.
1. In the **Shared image gallery** page, click **Add**.
1. On the **Create shared image gallery** page, select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My image gallery for testing.* and then click **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.

### [CLI](#tab/cli)

Create an image gallery using [az sig create](/cli/azure/sig#az_sig_create). The following example creates a resource group named gallery named *myGalleryRG* in *East US*, and a gallery named *myGallery*.

```azurecli-interactive
az group create --name myGalleryRG --location eastus
az sig create --resource-group myGalleryRG --gallery-name myGallery
```

### [PowerShell](#tab/powershell)

Create an image gallery using [New-AzGallery](/powershell/module/az.compute/new-azgallery). The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

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


### [REST](#tab/rest)

Use the [REST API](/rest/api/resources/resource-groups/create-or-update) to create a resource group.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourcegroups/{resourceGroupName}?api-version=2021-04-01

{
  "location": "eastus"
}
```

Use the [REST API](/rest/api/compute/galleries/create-or-update) to create a gallery.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/galleries/{galleryName}?api-version=2019-12-01

{
  "properties": {
    "description": "Shared Image Gallery for my organization"
  },
  "location": "eastus",
}
```
---

## Next steps

Create an [image definition and an image version](image-version.md).

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 

You can also create Shared Image Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in a Shared Image Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)