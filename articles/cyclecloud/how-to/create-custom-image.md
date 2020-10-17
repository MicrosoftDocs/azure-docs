---
title: Custom Images
description: Review custom or marketplace images for an Azure CycleCloud cluster. Create a custom image, specify a custom image in the cluster UI, and more.
author: adriankjohnson
ms.date: 03/01/2018
ms.author: adjohnso
---
# Custom Images in a CycleCloud Cluster

An Azure CycleCloud installation uses recommended OS images for clusters by default, but the use of Azure Marketplace images, Gallery images (in preview) or custom images in nodes and nodearrays is also supported. Custom images are useful for pre-installed applications in a cluster, or to fulfill business or security requirements.

## Specify a Custom Image via the Cluster UI

Custom and marketplace images are supported in the cluster UI. Instead of selecting a built-in image, check the **Custom Image** box and specify the full _Resource ID_ or _URN_ for the image:

![Custom Images](~/images/custom-image.png)

> [!NOTE]
> This is only supported in CycleCloud versions >7.7.0

## Use a Custom Image in a CycleCloud Template

The `ImageName` attribute is used to specify that a cluster node should use a private Custom Azure image or a Marketplace image. This ID can be found for custom images in the Azure portal as the Resource ID for the image, and generally takes the form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

``` ini
[[node custom]]

  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
```

The URN or Resource ID defines the marketplace image to be used. The easiest way to retrieve URN or ID is through the [Azure CLI](https://docs.microsoft.com/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list).

You can also specify a Marketplace or Gallery image by using the URN:

``` ini
[[node marketplace]]

 ImageName = publisher:offer:sku:version
```

> [!NOTE]
> CycleCloud versions prior to 7.7.0 [require a different notation](#custom-image-notation-prior-7-7-0).

### Use an Azure Marketplace Image with a Pricing Plan

You can use a Marketplace image with an associated pricing plan but the image must be enabled for programmatic use. To do this, locate the Marketplace image you want to use. Click **Want to deploy programmatically**, **Get Started ->**, and enter any required information and save it.

To accept a license from the CLI:

```azurecli-interactive
az vm image accept-terms --urn publisher:offer:sku:version
```

or

```azurecli-interactive
az vm image accept-terms --publisher PUBLISHER --offer OFFER --plan SKU
```

### Use a Shared Image Gallery image with a Pricing Plan

CycleCloud 8.0.2 and up support custom images created from images with a pricing plan. This requires using a custom template:

``` ini
[[node custom_image]]

 ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyImage/versions/1.0.0
 ImagePlan.Publisher = PUBLISHER
 ImagePlan.Product = PRODUCT (sometimes called OFFER)
 ImagePlan.Plan = PLAN (sometimes called SKU)
```

If the Shared Image Gallery has the purchase-plan metadata on it, it is used automatically and you do not need to specify the plan details. 

## Create a Custom Image

Custom Azure Images can be created for [Windows](https://docs.microsoft.com/azure/virtual-machines/windows/tutorial-custom-images) or for [Linux](https://docs.microsoft.com/azure/virtual-machines/linux/tutorial-custom-images).

<a name="custom-image-notation-prior-7-7-0"></a>
## Custom Images on prior CycleCloud versions (<7.7.0)

Custom and marketplace images are supported in CycleCloud versions prior to 7.7.0 but they use a different notation. To use a custom image in a CycleCloud template prior to version 7.7.0, the `ImageId` attribute is used to specify the custom Azure image. This ID can be found in the Azure portal as the Resource ID for the image, and generally takes the form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

Marketplace images prior to version 7.7.0 need to be specified using their Publisher/Offer/Sku/Version explicitly. They also need to specify `JetpackPlatform` so the correct jetpack packages is installed. Acceptable values for `JetpackPlatform` are: `centos-6`,`centos-7`, `ubuntu-14.04`, `ubuntu-16.04`, and `windows`. This should match the operating system of the Azure Marketplace image. Additionally, `InstallJetpack` must be set to true.

``` ini
[[node custom]]
  ImageId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
  InstallJetpack = true

[[node marketplace]]
  Azure.Publisher = OpenLogic
  Azure.Offer = CentOS-HPC
  Azure.Sku = 7.4
  Azure.ImageVersion = 7.4.20180301

  # Azure CycleCloud < 7.7.0 jetpack selection attributes
  InstallJetpack = true
  JetpackPlatform = centos-7
```
