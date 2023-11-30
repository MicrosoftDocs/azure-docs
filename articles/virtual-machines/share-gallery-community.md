---
title: Share Azure Compute Gallery resources with a community gallery
description: Learn how to use a community gallery to share VM images stored in an Azure Compute Gallery.
author: sandeepraichura
ms.service: virtual-machines
ms.subservice: gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 09/20/2023
ms.author: saraic
ms.reviewer: cynthn, mattmcinnes
ms.custom: template-how-to
ms.devlang: azurecli
---

# Share images using a community gallery

To share a gallery with all Azure users, you can create a [community gallery](azure-compute-gallery.md#community-gallery). Community galleries can be used by anyone with an Azure subscription. Someone creating a VM can browse images shared with the community using the portal, REST, or the Azure CLI.

Sharing images to the community is a new capability in [Azure Compute Gallery](./azure-compute-gallery.md#community). You can make your image galleries public, and share them to all Azure customers. When a gallery is marked as a community gallery, all images under the gallery become available to all Azure customers as a new resource type under Microsoft.Compute/communityGalleries. All Azure customers can see the galleries and use them to create VMs. Your original resources of the type `Microsoft.Compute/galleries` are still under your subscription, and private.


> [!IMPORTANT]
> Microsoft does not provide support for images you share to the community.
> 


There are three main ways to share images in an Azure Compute Gallery, depending on who you want to share with:

| Sharing with: | People | Groups | Service Principal | All users in a specific   subscription (or) tenant | Publicly with all users in   Azure |
|---|---|---|---|---|---|
| [RBAC Sharing](share-gallery.md) | Yes | Yes | Yes | No | No |
| RBAC + [Direct shared gallery](./share-gallery-direct.md)  | Yes | Yes | Yes | Yes | No |
| RBAC + [Community gallery](./share-gallery-community.md) | Yes | Yes | Yes | No | Yes |

## Disclaimer

[!INCLUDE [community-gallery-artifacts](./includes/community-gallery-artifacts.md)]

## Limitations for images shared to the community

There are some limitations for sharing your gallery to the community:
- You can't convert an existing private gallery(RBAC enabled gallery) to Community gallery.
- You can't use a third party image from Marketplace and publish it to the community. For a list of approved operating system base images, please see: [approved base images](https://go.microsoft.com/fwlink/?linkid=2245050).
- Encrypted images are not supported
- Image resources need to be created in the same region as the gallery. For example, if you create a gallery in West US, the image definitions and image versions should be created in West US if you want to make them available.
- You can't share [VM Applications](vm-applications.md) to the community yet.


## How sharing with the community works

You [create a gallery resource](create-gallery.md#create-a-community-gallery) under `Microsoft.Compute/Galleries` and choose `community` as a sharing option.

When you're ready, you flag your gallery as ready to be shared publicly. Only the  owner of a subscription, or a user or service principal with the `Compute Gallery Sharing Admin` role at the subscription or gallery level, can enable a gallery to go public to the community. At this point, the Azure infrastructure creates proxy read-only regional resources, under `Microsoft.Compute/CommunityGalleries`, which are public.

The end-users can only interact with the proxy resources, they never interact with your private resources. As the publisher of the private resource, you should consider the private resource as your handle to the public proxy resources. The `prefix` you provide when you create the gallery is used, along with a unique GUID, to create the public facing name for your gallery.

Azure users can see the latest image versions shared to the community in the portal, or query for them using the CLI. Only the latest version of an image is listed in the community gallery.

When creating a community gallery, you will need to provide contact information for your images. The objective and underlying intention of this information is to facilitate communication between the consumer of the image and the publisher, like if the consumer needs assistance. Microsoft doesn't offer support for these images. This information will be shown **publicly**, so be careful when providing it:
- Community gallery prefix
- Publisher support email
- Publisher URL
- Legal agreement URL (Do not put secrets, passwords, SASURI etc. in legal agreement URL field)

Information from your image definitions will also be publicly available, like what you provide for **Publisher**, **Offer**, and **SKU**.

> [!WARNING]
> If you want to stop sharing a gallery publicly, you can update the gallery to stop sharing, but making the gallery private will prevent existing virtual machine scale set users from scaling their resources.


## Why share to the community?

As a content publisher, you might want to share a gallery to the community:

- If you have non-commercial, non-proprietary content to share widely on Azure.

- You want greater control over the number of versions, regions, and the duration of image availability.  

- You want to quickly share daily or nightly builds with your customers.  

- You don’t want to deal with the complexity of multi-tenant authentication when sharing with multiple tenants on Azure.


## Should I use a marketplace image or a community gallery image?

There are a variety of reasons why you might want to use an Azure Marketplace image instead of a community gallery image. The primary reason to choose an Azure Marketplace image is that they're supported by Microsoft, while community images aren't. 

Why use a marketplace mage?
- Microsoft certified images
- Can be used for production workloads
- First party and third party images
- Paid images with additional software offerings
- Supported by Microsoft

When to use a community image?
- You trust and know how to contact the publisher
- You're looking for a community version of an image published by open-source community
- Using the image for testing
- Community images are free
- Supported by the owner of the image, not Microsoft.

## Reporting issues with a community image
Using community-submitted virtual machine images has several risks. Images could contain malware, security vulnerabilities, or violate someone's intellectual property. To help create a secure and reliable experience for the community, you can report images when you see these issues.

The easiest way to report issues with a community gallery is to use the portal, which will pre-fill information for the report:
- For issues with links or other information in the fields of an image definition, select **Report community image**.
- If an image version contains malicious code or there are other issues with a specific version of an image, select **Report** under the **Report version** column in the table of image versions.

You can also use the following links to report issues, but the forms won't be pre-filled:

- Malicious images: Contact [Abuse Report](https://msrc.microsoft.com/report/abuse).
- Intellectual Property violations: Contact [Infringement Report](https://msrc.microsoft.com/report/infringement).
 
## Best practices

- Images published to the community gallery should be [generalized](generalize.md) images that have had sensitive or machine specific information removed. For more information about preparing an image, see the OS specific information for [Linux](./linux/create-upload-generic.md) or [Windows](./windows/prepare-for-upload-vhd-image.md).
- If you would like to block sharing images to Community at the organization level, create an Azure policy with the following policy rule to deny sharing to Community.
```
  "policyRule": {
      "if": {
        "allOf": [
          {
            "field": "type",
            "equals": "Microsoft.Compute/galleries"
          },
          {
            "field": "Microsoft.Compute/galleries/sharingProfile.permissions",
            "equals": "Community"
          }
        ]
      },
      "then": {
        "effect": "[parameters('effect')]"
      }
    }
```
## FAQ

**Q: What are the charges for using a gallery that is shared to the community?**

**A**: There are no charges for using the service itself. However, content publishers would be charged for the following:
- Storage charges for application versions and replicas in each of the regions (source and target). These charges are based on the storage account type chosen. 
- Network egress charges for replication across regions.

Consumers of the image may have to pay additional software cost if the base image is using an Azure marketplace image with software charges.

**Q: Is it safe to use images shared to the community?**

**A**: Users should exercise caution while using images from non-verified sources, since these images aren't subject to certification and not scanned for malware/vulnerabilities and publisher details aren't verified.

**Q: If an image that is shared to the community doesn’t work, who do I contact for support?**

**A**: Azure isn't responsible for any issues users might encounter with community-shared images. The support is provided by the image publisher. Look up the publisher contact information for the image and reach out to them for any support.  

**Q: Is Community gallery sharing functionality part of Azure Marketplace?**

**A**: No, Community gallery sharing isn't part of Azure Marketplace, it's a feature of 'Azure Compute Gallery'. Anyone with an Azure subscription can use 'Community gallery' and make their images public.

**Q: I have concerns about an image, who do I contact?**

**A**: For issues with images shared to the community:
- To report malicious images, contact [Abuse Report](https://msrc.microsoft.com/report/abuse). 
- To report images that potentially violate intellectual property rights, contact [Infringement Report](https://msrc.microsoft.com/report/infringement).
 

**Q: How do I request that an image shared to the community be replicated to a specific region?**

**A**: Only the content publishers have control over the regions their images are available in. If you don’t find an image in a specific region, reach out to the publisher directly.

## Start sharing publicly

In order to share a gallery publicly, it needs to be created as a community gallery. For more information, see [Create a community gallery](create-gallery.md#create-a-community-gallery)



### [CLI](#tab/cli)

Once you're ready to make the gallery available to the public, enable the community gallery using [az sig share enable-community](/cli/azure/sig/share#az-sig-share-enable-community). Only a user in the `Owner` role definition can enable a gallery for community sharing.

```azurecli-interactive
az sig share enable-community \
   --gallery-name $galleryName \
   --resource-group $resourceGroup 
```


To go back to only RBAC based sharing, use the [az sig share reset](/cli/azure/sig/share#az-sig-share-reset) command.

To delete a gallery shared to community, you must first run `az sig share reset` to stop sharing, then delete the gallery.

### [REST](#tab/rest)

To go live with community sharing, send the following POST request. As part of the request, include the property `operationType` with value `EnableCommunity`.  

```rest
POST 
https://management.azure.com/subscriptions/{subscriptionId}/providers/Microsoft.Compu 
te/galleries/{galleryName}/share?api-version=2021-07-01 
{ 
  "operationType" : "EnableCommunity"
} 
```

### [Portal](#tab/portal)

When you're ready to make the gallery public:

1. On the page for the gallery, select **Sharing** from the left menu.
1. Select **Share** from the top of the page.
   :::image type="content" source="media/create-gallery/share.png" alt-text="Screenshot showing the Share button for sharing your gallery to the community.":::
1. When you're done, select **Save**.


---

> [!IMPORTANT]
> If you are listed as the owner of your subscription, but you are having trouble sharing the gallery publicly, you may need to explicitly [add yourself as owner again](../role-based-access-control/role-assignments-portal-subscription-admin.md).

To go back to only RBAC based sharing, use the [az sig share reset](/cli/azure/sig/share#az-sig-share-reset) command.

To delete a gallery shared to community, you must first run `az sig share reset` to stop sharing, then delete the gallery.

## Next steps

Create an [image definition and an image version](image-version.md).

Create a VM from a [generalized](vm-generalized-image-version.md#community-gallery) or [specialized](vm-specialized-image-version.md#community-gallery) image in a community gallery.
