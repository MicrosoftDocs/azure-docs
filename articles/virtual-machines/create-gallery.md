---
title: Create an Azure Compute Gallery for sharing resources
description: Learn how to create an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 03/23/2023
ms.author: saraic
ms.reviewer: cynthn, mattmcinnes
ms.custom: template-how-to, devx-track-azurecli 
ms.devlang: azurecli

---

# Create a gallery for storing and sharing resources


An [Azure Compute Gallery](./shared-image-galleries.md) (formerly known as Shared Image Gallery) simplifies sharing resources, like images and application packages, across your organization.  

The Azure Compute Gallery lets you share custom VM images and application packages with others in your organization, within or across regions, within a tenant. Choose what you want to share, which regions you want to make them available in, and who you want to share them with. You can create multiple galleries so that you can logically group resources. 

The gallery is a top-level resource that can be shared in multiple ways:

| Sharing with: | People | Groups | Service Principal | All users in a specific subscription (or) tenant | Publicly with all users in   Azure |
|---|---|---|---|---|---|
| [RBAC Sharing](./share-gallery.md) | Yes | Yes | Yes | No | No |
| RBAC + [Direct shared gallery](./share-gallery-direct.md)  | Yes | Yes | Yes | Yes | No |
| RBAC + [Community gallery](./share-gallery-community.md) | Yes | Yes | Yes | No | Yes |

## Naming

Allowed characters for gallery name are uppercase (A-Z) and lowercase (a-z) letters, digits (0-9), dots (or periods) `.`, and underscores `_`. The gallery name can't contain dashes `-`. Gallery names must be unique within your subscription.


## Create a private gallery


### [Portal](#tab/portal)



1. Sign in to the [Azure portal](https://portal.azure.com).
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, select **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. In **Resource group**, select a resource group from the drop-down or select **Create new** and type a name for the new resource group.
1. In **Name**, type a name for the name of the gallery.
1. Select a **Region** from the drop-down.
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


## Create a direct shared gallery

> [!IMPORTANT]
> Azure Compute Gallery – direct shared gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.
>
> You can't currently create a Flexible virtual machine scale set from an image shared to you by another tenant.

To start sharing a direct shared gallery with a subscription or tenant, see [Share a gallery with a subscription or tenant](./share-gallery-direct.md).

### [Portal](#tab/portaldirect)

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, select **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. Complete all of the details on the page.
1. At the bottom of the page, select **Next: Sharing method**.
    :::image type="content" source="media/create-gallery/create-gallery.png" alt-text="Screenshot showing where to select to go on to sharing methods.":::
1. On the **Sharing** tab, select **RBAC + share directly**.

   :::image type="content" source="media/create-gallery/share-direct.png" alt-text="Screenshot showing the option to share using both role-based access control and share directly.":::

1. When you're done, select **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.

To start sharing the gallery with a subscription or tenant, see [Share a gallery with a subscription or tenant](./share-gallery-direct.md).

### [CLI](#tab/clidirect)

To create a gallery that can be shared to a subscription or tenant using a direct shared gallery, you need to create the gallery with the `--permissions` parameter set to `groups`.

```azurecli-interactive
az sig create \
   --gallery-name myGallery \
   --permissions groups \
   --resource-group myResourceGroup  
```
 

To start sharing the gallery with a subscription or tenant, use see [Share a gallery with a subscription or tenant](./share-gallery-direct.md).

 
### [REST](#tab/restdirect)

Create a gallery for subscription or tenant-level sharing using the Azure REST API.

```rest
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{gallery-name}?api-version=2020-09-30

{
	"properties": {
		"sharingProfile": {
			"permissions": "Groups"
		}
	},
	"location": "{location}
}
```

To start sharing the gallery with a subscription or tenant, use see [Share a gallery with a subscription or tenant](./share-gallery-direct.md).


Reset sharing to clear everything in the `sharingProfile`.

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30 

{ 
 "operationType" : "Reset", 
} 
```

---



<a name=community></a>
## Create a community gallery

A [community gallery](azure-compute-gallery.md#community) is shared publicly with everyone. To create a community gallery, you create the gallery first, then enable it for sharing. The name of public instance of your gallery is the prefix you provide, plus a unique GUID.

During the preview, make sure that you create your gallery, image definitions, and image versions in the same region in order to share your gallery publicly.

> [!IMPORTANT]
> Azure Compute Gallery – community galleries is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery - community gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
> 
> To publish a community gallery, you'll need to [set up preview features in your Azure subscription](/azure/azure-resource-manager/management/preview-features?tabs=azure-portal). Creating VMs from community gallery images is open to all Azure users.

When creating an image to share with the community, you need to provide contact information. This information is shown **publicly**, so be careful when providing:
- Community gallery prefix
- Publisher support email
- Publisher URL
- Legal agreement URL

Information from your image definitions is also publicly available, like what you provide for **Publisher**, **Offer**, and **SKU**.

### Prerequisites

 Only the owner of a subscription, or a user or service principal assigned to the `Compute Gallery Sharing Admin` role at the subscription or gallery level, can enable a gallery to go public to the community. To assign a role to a user, group, service principal or managed identity, see [Steps to assign an Azure role](../role-based-access-control/role-assignments-steps.md).

### [CLI](#tab/cli2)

The `--public-name-prefix` value is used to create a name for the public version of your gallery. The `--public-name-prefix` is the first part of the public name, and the last part will be a GUID, created by the platform, that is unique to your gallery.

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

The output of this command gives you the public name for your community gallery in the `sharingProfile` section, under `publicNames`.

To start sharing the gallery to all Azure users, see [Share images using a community gallery](share-gallery-community.md).

### [REST](#tab/rest2)
To create a gallery, submit a PUT request:

```rest
PUT https://management.azure.com/subscriptions/{subscription-id}/resourceGroups/myResourceGroup/providers/Microsoft.Compute/galleries/myGalleryName?api-version=2021-10-01
```

Specify `permissions` as `Community` and information about your gallery in the request body: 

```json
{
  "location": "West US",
  "properties": {
    "description": "This is the gallery description.",
    "sharingProfile": {
      "permissions": "Community",
      "communityGalleryInfo": {
        "publisherUri": "http://www.uri.com",
        "publisherContact": "contact@domain.com",
        "eula": "http://www.uri.com/terms",
        "publicNamePrefix": "Prefix"
      }
    }
  }
}
```
To start sharing the gallery to all Azure users, see [Share images using a community gallery](share-gallery-community.md).


### [Portal](#tab/portal2)

Making a community gallery available to all Azure users is a two-step process. First you create the gallery with community sharing enabled, when you're ready to make it public, you share the gallery.

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. In **Resource group**, select **Create new** and type *myGalleryRG* for the name.
1. In **Name**, type *myGallery* for the name of the gallery.
1. Leave the default for **Region**.
1. You can type a short description of the gallery, like *My gallery for testing*.
1. At the bottom of the page, select **Next: Sharing method**.
    :::image type="content" source="media/create-gallery/create-gallery.png" alt-text="Screenshot showing where to select to go on to sharing methods.":::
1. On the **Sharing** tab, select **RBAC + share to public community gallery**.

   :::image type="content" source="media/create-gallery/sharing-type.png" alt-text="Screenshot showing the option to share using both role-based access control and a community gallery.":::

1. For **Community gallery prefix** type a prefix that will be appended to a GUID to create the unique name for your community gallery.
1. For **Publisher email** type a valid e-mail address that can be used to communicate with you about the gallery.
1. For **Publisher URL**, type the URL for where users can get more information about the images in your community gallery.
1. For **Legal Agreement URL**, type the URL where end users can find legal terms for the image.
1. When you're done, select **Review + create**.

   :::image type="content" source="media/create-gallery/rbac-community.png" alt-text="Screenshot showing the information that needs to be completed to create a community gallery.":::

1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.

To see the public name of your gallery, select **Sharing** in the left menu.

To start sharing the gallery to all Azure users, see [Share images using a community gallery](share-gallery-community.md).


---



## Next steps

- Create an [image definition and an image version](image-version.md).
- Create a VM from a [generalized](vm-generalized-image-version.md#direct-shared-gallery) or [specialized](vm-specialized-image-version.md#direct-shared-gallery) image in a gallery.
- [Create a VM application](vm-applications-how-to.md) in your gallery.
