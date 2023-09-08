---
title: Share Azure Compute Gallery resources directly with subscriptions and tenants
description: Learn how to share Azure Compute Gallery resources explicitly with subscriptions and tenants.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 02/14/2023
ms.author: saraic
ms.reviewer: cynthn
ms.custom: template-how-to , devx-track-azurecli 
ms.devlang: azurecli

---

# Share a gallery with subscriptions or tenants (preview)

This article covers how to share an Azure Compute Gallery with specific subscriptions or tenants using a direct shared gallery. Sharing a gallery with tenants and subscriptions give them read-only access to your gallery.


> [!IMPORTANT]
> Azure Compute Gallery – direct shared gallery is currently in PREVIEW and subject to the [Preview Terms for Azure Compute Gallery](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
>
> To publish images to a direct shared gallery during the preview, you need to register at [https://aka.ms/directsharedgallery-preview](https://aka.ms/directsharedgallery-preview). Please submit the form and share your use case, We will evaluate the request and follow up in 10 business days after submitting the form. No additional access required to consume images, Creating VMs from a direct shared gallery is open to all Azure users in the target subscription or tenant the gallery is shared with. In most scenarios RBAC/Cross-tenant sharing using service principal is sufficient, request access to this feature only if you wish to share images widely with all users in the subscription/tenant.
>
> During the preview, you need to create a new gallery, with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.


There are three main ways to share images in an Azure Compute Gallery, depending on who you want to share with:

| Sharing with: | People | Groups | Service Principal | All users in a specific   subscription (or) tenant | Publicly with all users in   Azure |
|---|---|---|---|---|---|
| [RBAC Sharing](share-gallery.md) | Yes | Yes | Yes | No | No |
| RBAC + [Direct shared gallery](./share-gallery-direct.md)  | Yes | Yes | Yes | Yes | No |
| RBAC + [Community gallery](./share-gallery-community.md) | Yes | Yes | Yes | No | Yes |


## Limitations

During the preview:
- You can only share to 30 subscriptions and 5 tenants.
- Only images can be shared. You can't directly share a [VM application](vm-applications.md) during the preview.
- A direct shared gallery can't contain encrypted image versions. Encrypted images can't be created within a gallery that is directly shared.
- Only the owner of a subscription, or a user or service principal assigned to the `Compute Gallery Sharing Admin` role at the subscription or gallery level will be able to enable group-based sharing.
- You need to create a new gallery,  with the property `sharingProfile.permissions` set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.
- TrustedLaunch and ConfidentialVM are not supported
- PowerShell, Ansible, and Terraform aren't supported at this time.
- The image version region in the gallery should be same as the region home region, creating of cross-region version where the home region is different than the gallery is not supported, however once the image is in the home region it can be replicated to other regions
- Not available in Government clouds
- For consuming direct shared images in target subscription, Direct shared images can be found from VM/VMSS creation blade only.
- **Known issue**: When creating a VM from a direct shared image using the Azure portal, if you select a region, select an image, then change the region, you will get an error message: "You can only create VM in the replication regions of this image" even when the image is replicated to that region. To get rid of the error, select a different region, then switch back to the region you want. If the image is available, it should clear the error message.

## Prerequisites

You need to create a [new direct shared gallery ](./create-gallery.md#create-a-direct-shared-gallery). A direct shared gallery has the `sharingProfile.permissions` property is set to `Groups`. When using the CLI to create a gallery, use the `--permissions groups` parameter. You can't use an existing gallery, the property can't currently be updated.

## How sharing with direct shared gallery works

First you create a gallery under `Microsoft.Compute/Galleries` and choose `groups` as a sharing option.

When you are ready, you share your gallery with subscriptions and tenants. Only the  owner of a subscription, or a user or service principal with the `Compute Gallery Sharing Admin` role at the subscription or gallery level, can share the gallery. At this point, the Azure infrastructure creates proxy read-only regional resources, under `Microsoft.Compute/SharedGalleries`. Only subscriptions and tenants you have shared with can interact with the proxy resources, they never interact with your private resources. As the publisher of the private resource, you should consider the private resource as your handle to the public proxy resources. The subscriptions and tenants you have shared your gallery with will see the gallery name as the subscription ID where the gallery was created, followed by the gallery name.

### [Portal](#tab/portaldirect)

> [!NOTE]
> **Known issue**: In the Azure portal, If you get an error "Failed to update Azure compute gallery", please verify if you have owner (or) compute gallery sharing admin permission on the gallery.
>
1. Sign in to the [Azure portal](https://portal.azure.com).
1. Type **Azure Compute Gallery** in the search box and select **Azure Compute Gallery** in the results.
1. In the **Azure Compute Gallery** page, click **Add**.
1. On the **Create Azure Compute Gallery** page, select the correct subscription.
1. Complete all of the details on the page.
1. At the bottom of the page, select **Next: Sharing method**.
    :::image type="content" source="media/create-gallery/create-gallery.png" alt-text="Screenshot showing where to select to go on to sharing methods.":::
1. On the **Sharing** tab, select **RBAC + share directly**.

   :::image type="content" source="media/create-gallery/share-direct.png" alt-text="Screenshot showing the option to share using both role-based access control and share directly.":::

1. When you are done, select **Review + create**.
1. After validation passes, select **Create**.
1. When the deployment is finished, select **Go to resource**.


To share the gallery:

1. On the page for the gallery, select **Sharing** from the left menu.
1. Under **Direct sharing settings**, select **Add**.

   :::image type="content" source="media/create-gallery/direct-share-add.png" alt-text="Screenshot showing the option to share with a subscription or tenant.":::

1. If you would like to share with someone within your organization, for **Type** select *Subscription* or *Tenant* and choose the appropriate item from the **Tenants and subscriptions** drop-down. If you want to share with someone outside of your organization, select either *Subscription outside of my organization* or *Tenant outside of my organization* and then paste or type the ID into the text box.

	**When a gallery is shared with the tenant, all subscriptions within the tenant will get access to the image and don't have to share it with individual subscription(s) in the tenant**

1. When you are done adding items, select **Save**.


### [CLI](#tab/clidirect)

To create a direct shared gallery, you need to create the gallery with the `--permissions` parameter set to `groups`.

```azurecli-interactive
az sig create \
   --gallery-name myGallery \
   --permissions groups \
   --resource-group myResourceGroup  
```
 

To start sharing the gallery with a subscription or tenant, use [az sig share add](/cli/azure/sig#az-sig-share-add) 

```azurecli-interactive
sub=<subscription-id>
tenant=<tenant-id>
gallery=<gallery-name>
rg=<resource-group-name>
az sig share add \
   --subscription-ids $sub \
   --tenant-ids $tenant \
   --gallery-name $gallery \
   --resource-group $rg
```
 

Remove access for a subscription or tenant using [az sig share remove](/cli/azure/sig#az-sig-share-remove).

```azurecli-interactive
sub=<subscription-id>
tenant=<tenant-id>
gallery=<gallery-name>
rg=<resource-group-name>

az sig share remove \
   --subscription-ids $sub \
   --tenant-ids $tenant \
   --gallery-name $gallery \
   --resource-group $rg
```
 


 
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


Share a gallery to subscription or tenant.


```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30

{
  "operationType": "Add",
  "groups": [
    {
      "type": "Subscriptions",
      "ids": [
        "{SubscriptionID}"
      ]
    },
    {
      "type": "AADTenants",
      "ids": [
        "{tenantID}"
      ]
    }
  ]
}

```
 

Remove access for a subscription or tenant.

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30

{
	"operationType": "Remove",
	"groups":[ 
		{
			"type": "Subscriptions",
			"ids": [
				"{subscriptionId1}",
				"{subscriptionId2}"
			],
},
{
			"type": "AADTenants",
			"ids": [
				"{tenantId1}",
				"{tenantId2}"
			]
		}
	]
}

```


Reset sharing to clear everything in the `sharingProfile`.

```rest
POST https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{rgName}/providers/Microsoft.Compute/galleries/{galleryName}/share?api-version=2020-09-30 

{ 
 "operationType" : "Reset", 
} 
```

---


## Next steps
- Create an [image definition and an image version](image-version.md).
- Create a VM from a [generalized](vm-generalized-image-version.md#direct-shared-gallery) or [specialized](vm-specialized-image-version.md#direct-shared-gallery) image from a direct shared image in the target subscription or tenant.
