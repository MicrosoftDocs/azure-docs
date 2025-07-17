---
title: Custom Images
description: Review custom or marketplace images for an Azure CycleCloud cluster. Create a custom image, specify a custom image in the cluster UI, and more.
author: adriankjohnson
ms.date: 07/01/2025
ms.author: adjohnso
---
# Custom images in a CycleCloud cluster

An Azure CycleCloud installation uses recommended OS images for clusters by default, but it also supports Azure Marketplace images, Gallery images (in preview), and custom images for nodes and node arrays. Use custom images when you need preinstalled applications in a cluster or want to meet business or security requirements.

## Specify a custom image through the cluster UI

The cluster UI supports custom and marketplace images. Instead of selecting a built-in image, select **Custom Image** and enter the full _Resource ID_ or _URN_ for the image:

![Custom Images](~/articles/cyclecloud/images/custom-image.png)

> [!NOTE]
> CycleCloud supports custom images starting with version 7.7.0.

## Use a custom image in a CycleCloud template

Use the `ImageName` attribute to specify that a cluster node uses a private custom Azure image or a Marketplace image. For custom images, find the ID in the Azure portal as the Resource ID for the image. It generally takes the following form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

``` ini
[[node custom]]

  ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
```

The URN or Resource ID defines the marketplace image to use. The easiest way to get the URN or ID is through the [Azure CLI](/cli/azure/vm/image#az-vm-image-list).

You can also specify a Marketplace or Shared image by using the URN:

``` ini
[[node marketplace]]

 ImageName = publisher:offer:sku:version
```

> [!NOTE]
> CycleCloud versions earlier than 7.7.0 [require a different notation](#custom-image-notation-prior-7-7-0).

### Use an Azure Marketplace Image with a Pricing Plan

You can use a Marketplace image with an associated pricing plan but only if the image is enabled for programmatic use. To enable programmatic use, locate the desired image in the Marketplace, select **Want to deploy programmatically**, then select **Get Started ->**. Fill in the required information and save your changes.

::: moniker range=">=cyclecloud-8"
To enable CycleCloud to automatically accept license terms on your behalf, enable the **Accept marketplace terms on my behalf** option on your subscription in the web interface:

![Accept Marketplace terms](../images/auto-accept-terms.png)
::: moniker-end

To accept license terms from Azure CLI, use:

```azurecli-interactive
az vm image accept-terms --urn publisher:offer:sku:version
```

or

```azurecli-interactive
az vm image accept-terms --publisher PUBLISHER --offer OFFER --plan SKU
```

### Use a Shared Image Gallery image with a Pricing Plan

Starting with CycleCloud version 8.0.2, you can use custom images derived from images that have a pricing plan. To use this feature, you need a custom template:

``` ini
[[node custom_image]]

 ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/galleries/MyGallery/images/MyImage/versions/1.0.0
 ImagePlan.Publisher = PUBLISHER
 ImagePlan.Product = PRODUCT (sometimes called OFFER)
 ImagePlan.Name = NAME (sometimes called SKU)
```

If the Shared Image Gallery has the purchase-plan metadata on it, CycleCloud automatically uses it. You don't need to specify the plan details.

## Create a Custom Image

You can create custom Azure Images by following [this tutorial](/azure/virtual-machines/image-version-vm-cli#create-an-image-definition).

> [!NOTE]
> We recommend using generalized images. Specialized images don't go through the process to remove machine-specific information and accounts. They also lack the osProfile that CycleCloud needs.

<a name="custom-image-notation-prior-7-7-0"></a>
## Custom images on CycleCloud versions earlier than 7.7.0

CycleCloud versions earlier than 7.7.0 support custom and marketplace images but use a different notation. To use a custom image in a CycleCloud template earlier than version 7.7.0, use the `ImageId` attribute to specify the custom Azure image. You can find this ID in the Azure portal as the Resource ID for the image. It generally takes the following form:

`/subscriptions/$SUBSCRIPTION-ID/resourceGroups/$RESOURCEGROUPNAME/providers/Microsoft.Compute/images/$CustomImageName`

For CycleCloud versions earlier than 7.7.0, you must explicitly specify Marketplace images by providing their Publisher, Offer, SKU, and Version. You also need to define the `JetpackPlatform` attribute to make sure the correct Jetpack packages are installed. Accepted values for `JetpackPlatform` include `centos-6`, `centos-7`, `ubuntu-14.04`, `ubuntu-16.04`, and `windows`. This value should match the operating system of the Azure Marketplace image. Set `InstallJetpack` to true.

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
