---
title: Create an Azure Compute Gallery for sharing resources
description: Learn how to create an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 03/25/2022
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli

---

# Create a gallery for storing and sharing resources


An [Azure Compute Gallery](./shared-image-galleries.md) (formerly known as Shared Image Gallery) simplifies sharing resources, like images and application packages, across your organization.  

The Azure Compute Gallery lets you share custom VM images and application packages with others in your organization, within or across regions, within an AAD tenant. Choose what you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group resources. 

The gallery is a top-level resource that provides full Azure role-based access control (Azure RBAC). 

## Create a private gallery

Allowed characters for gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes. Gallery names must be unique within your subscription. 

Choose an option below for creating your gallery:

### [Portal](#tab/portal)

The following example creates a gallery with the .

1. Sign in to the Azure portal at https://portal.azure.com.
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My gallery for testing.* and then click **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.

### [CLI](#tab/cli)

Create a gallery using [az sig create](/cli/azure/sig#az-sig-create). The following example creates a resource group named gallery named *myGalleryRG* in *East US*, and a gallery named *myGallery*.

```azurecli-interactive
az group create --name myGalleryRG --location eastus
az sig create --resource-group myGalleryRG --gallery-name myGallery
```


### [PowerShell](#tab/powershell)

Create a gallery using [New-AzGallery](/powershell/module/az.compute/new-azgallery). The following example creates a gallery named *myGallery* in the *myGalleryRG* resource group.

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


<a name=community></a>

## Create a community gallery (preview)

A [community gallery](azure-compute-gallery.md#community) is shared publicly with everyone. To create a community gallery, you create the gallery first, then enable it for sharing. The name of pubic instance of your gallery will be the prefix you provide, plus a unique GUID.

During the preview, make sure that you create your gallery, image definitions, and image versions in the same region in order to share your gallery publicly.

> [!IMPORTANT]
> Community Galleries is currently in public preview.
> This preview version is provided without a service-level agreement, and we don't recommend it for production workloads. Certain features might not be supported or might have constrained capabilities. 
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To publish to a community gallery, you need to register for the preview at [https://aka.ms/communitygallery-preview](https://aka.ms/communitygallery-preview). Creating VMs from the community gallery is open to all Azure users.

### Prerequisites

 Only the owner of a subscription, or a user or service principal with the `Compute Gallery Sharing Admin` role at the subscription or gallery level, can enable a gallery to go public to the community. To assign a role to a user, group, service principal or managed identity, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

### [CLI](#tab/cli2)

The `--public-name-prefix` value is used to create a name for the public version of your gallery. The `--public-name-prefix` will be the first part of the public name, and the last part will be a GUID, created by the platform, that is unique to your gallery.

```azurecli-interactive
location=westus
galleryName=contosoGallery
resourceGroup=myCGRG
publisherUri=https://www.contoso.com
publisherEmail=support@contoso.com
eulaLink=https://www.contoso.com/eula
prefix=ContosoImages

az group create --name $resourceGroup --location $location

az sig create \
   --gallery-name $galleryName \
   --permissions community \
   --resource-group $resourceGroup \
   --publisher-uri $publisherUri \
   --publisher-email $publisherEmail \
   --eula $eulaLink \
   --public-name-prefix $prefix
``` 

The output of this command will give you the public name for your community gallery in the `sharingProfile` section, under `publicNames`.

Once you are ready to make the gallery available to the public, enable the community gallery using [az sig share enable-community](/cli/azure/sig/share#az-sig-share-enable-community). Only a user in the `Owner` role definition can enable a gallery for community sharing.

```azurecli-interactive
az sig share enable-community \
   --gallery-name $galleryName \
   --resource-group $resourceGroup 
```


> [!IMPORTANT]
> If you are listed as the owner of your subscription, but you are having trouble sharing the gallery publicly, you may need to explicitly [add yourself as owner again](../role-based-access-control/role-assignments-portal-subscription-admin.md).

To go back to only RBAC based sharing, use the [az sig share reset](/cli/azure/sig/share#az-sig-share-reset) command.

To delete a gallery shared to community, you must first run `az sig share reset` to stop sharing, then delete the gallery.

### [REST](#tab/rest2)

```rest
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/myGalleryName?api-version=2021-10-01
```

Request Body
```json
{
  "location": "West US",
  "properties": {
    "description": "This is the gallery description.",
    "sharingProfile": {
      "permissions": "Community",
      "communityGalleryInfo": {
        "publisherUri": "uri",
        "publisherContact": "pir@microsoft.com",
        "eula": "eula",
        "publicNamePrefix": "PirPublic"
      }
    }
  }
}
```

To go live with community sharing, send the following POST request. As part of the request, include the property `operationType` with value `EnableCommunity`.  

```rest
POST 
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compu 
te/galleries/{galleryName}/share?api-version=2021-07-01 
{ 
  "operationType" : "EnableCommunity"
} 
```

### [Portal](#tab/portal2)

Making a community gallery available to all Azure users is a two-step process. First you create the gallery with community sharing enabled, when you are ready to make it public, you share the gallery.

1. Sign in to the Azure portal at https://portal.azure.com.
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My gallery for testing*. 
1. At the bottom of the page, select **Next: Sharing method**.
1. On the **Sharing** tab, select **RBAC + share to public community gallery**.
1. For **Community gallery prefix** type a prefix that will be appended to a GUID to create the unique name for your community gallery.
1. For **Publisher email** type a valid e-mail address that can be used to communicate with your about the gallery.
1. For **Publisher URL**, type the a URL for where people can go to get more information about the images in your community gallery.
1. For **EULA**, type the URL for your end user license agreement. XXXX License agreement and privacy statement.
1. When you are done, select **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.

To see the public name of your gallery, select **Sharing** in the left menu.

When you are ready to make the gallery public:

1. On the page for the gallery, select **Sharing** from the left menu.
1. Select **Share** from the top of the page.
1. When you are done, select **Save**.


> [!IMPORTANT]
> If you are listed as the owner of your subscription, but you are having trouble sharing the gallery publicly, you may need to explicitly [add yourself as owner again](../role-based-access-control/role-assignments-portal-subscription-admin.md).

---



## Next steps

- Create an [image definition and an image version](image-version.md).

- [Create a VM application](vm-applications-how-to.md) in your gallery.

- You can also create Azure Compute Gallery [create an Azure Compute Gallery](https://azure.microsoft.com/resources/templates/sig-create/) using a template.

- [Azure Image Builder](./image-builder-overview.md) can help automate image version creation, you can even use it to update and [create a new image version from an existing image version](./windows/image-builder-gallery-update-image-version.md). 
