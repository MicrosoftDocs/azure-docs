---
title: Azure CycleCloud Custom Images | Microsoft Docs
description: Create and modify custom images or Marketplace Images for Azure CycleCloud.
services: azure cyclecloud
author: KimliW
ms.prod: cyclecloud
ms.devlang: na
ms.topic: conceptual
ms.date: 08/01/2018
ms.author: adjohnso
---
# Custom Images in a CycleCloud Cluster

An Azure CycleCloud installation uses recommended OS images for clusters, but the use of Azure Marketplace images, Gallery images (in preview) or custom images in nodes and nodearrays is also supported. Custom Images are useful for pre-installed applications in a cluster, or to fulfill business or security requirements.

## Specify a Custom Image or Marketplace Image via the new cluster UI wizard in 7.7+

Custom and marketplace images are also supported in the new cluster UI. Instead of selecting a built-in image, check the "Custom Image" box and specify the full Resource ID or URN for the image:

![Custom Images](~/images/custom-image.png)

## Use a Custom Image in a CycleCloud template


The `ImageName` attribute is used to specify that a cluster node should use a private Custom Azure image or a Marketplace image. This ID can be found for custom images in the Azure portal as the Resource ID for the image, and generally takes the form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

``` ini
[[node custom]]

  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
```

> [!NOTE]
> For CycleCloud versions prior to 7.7.0, `InstallJetpack` must be set to true and custom images need to be specified using their Publisher/Offer/Sku/Version explicitly. They also need to specify `JetpackPlatform` so the correct jetpack packages is installed. Acceptable values for `JetpackPlatform` are: `centos-6`,`centos-7`, `ubuntu-14.04`, `ubuntu-16.04`, and `windows`. This should match the operating system of the Azure Marketplace image:

``` ini
[[node marketplace]]
  Azure.Publisher = OpenLogic
  Azure.Offer = CentOS-HPC
  Azure.Sku = 7.4
  Azure.ImageVersion = 7.4.20180301

  # Azure CycleCloud < 7.7.0 jetpack selection attributes
  InstallJetpack = true
  JetpackPlatform = centos-7

  # Azure CycleCloud >= 7.7.0 jetpack selection attributes
  InstallJetpack = true

```



The URN or Resource ID defines the marketplace image to be used. The easiest way to retrieve URN or ID is through the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/vm/image?view=azure-cli-latest#az-vm-image-list).

You can also specify a Marketplace or Gallery image by using the URN:

``` ini
[[node marketplace]]

 ImageName = publisher:offer:sku:version
```

### Use an Azure Marketplace Image with a Pricing Plan

You can use a Marketplace image with an associated pricing plan with CycleCloud. The image must be enabled for programmatic use. To do this, locate the Marketplace image you want to use. Click "Want to deploy programmatically", "Get Started ->", and enter any required information and save it.

To accept a license from the CLI:

```azurecli-interactive
$> az vm image accept-terms --urn publisher:offer:sku:version
```

or

```azurecli-interactive
      $> az vm image accept-terms --publisher PUBLISHER --offer OFFER --plan SKU
```

## Use a Custom Image in a CycleCloud Node on CycleCloud prior to 7.7

Custom Images are useful for pre-installed applications in a cluster, or to fulfill business or security requirements.

The `ImageId` attribute is used to specify that a cluster node should use a private custom Azure image. This ID can be found in the Azure portal as the Resource ID for the image, and generally takes the form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

``` ini
[[node custom]]

  ImageId = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
  InstallJetpack = true
```
## Create a Custom Image

Custom Azure Images can be created for [Windows](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/tutorial-custom-images) or for [Linux](https://docs.microsoft.com/en-us/azure/virtual-machines/linux/tutorial-custom-images).
