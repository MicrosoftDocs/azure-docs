---
title: Create an Azure Compute Gallery for sharing resources
description: Learn how to create an Azure Compute Gallery
author: cynthn
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 09/23/2021
ms.author: cynthn
ms.custom: template-how-to 

#Customer intent: As an IT administrator, I want to learn about how to create shared VM images to minimize the number of post-deployment configuration tasks.
---

# Create a gallery for storing and sharing resources


An [Azure Compute Gallery](./shared-image-galleries.md) simplifies sharing resources, like images and application packages, across your organization.  

The Azure Compute Gallery lets you share custom VM images and application packages with others in your organization, within or across regions, within an AAD tenant. Choose what you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group resources. 

The gallery is a top-level resource that provides full Azure role-based access control (Azure RBAC). 

## Create a gallery

Allowed characters for gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes. Gallery names must be unique within your subscription. 

Choose an option below for creating your gallery:

### [Portal](#tab/portal)

The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

1. Sign in to the Azure portal at https://portal.azure.com.
1. Use the type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
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
   -Description 'Azure Compute Gallery for my organization'	
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
    "description": "Azure Compute Gallery for my organization"
  },
  "location": "eastus",
}
```
---

## Next steps

Create an [image definition and an image version](image-version.md).

[Azure Image Builder (preview)](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 

You can also create Azure Compute Gallery resource using templates. There are several Azure Quickstart Templates available: 

- [Create a Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/)
- [Create an Image Definition in a Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-definition-create/)
- [Create an Image Version in a Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-image-version-create/)