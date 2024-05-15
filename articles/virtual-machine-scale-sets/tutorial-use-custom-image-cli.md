---
title: Tutorial - Use a custom VM image in a scale set with Azure CLI
description: Learn how to use the Azure CLI to create a custom VM image that you can use to deploy a Virtual Machine Scale Set
author: ju-shim
ms.service: virtual-machine-scale-sets
ms.subservice: shared-image-gallery
ms.topic: tutorial
ms.date: 12/16/2022
ms.reviewer: mimckitt
ms.author: jushiman
ms.custom: mvc, devx-track-azurecli
---

# Tutorial: Create and use a custom image for Virtual Machine Scale Sets with the Azure CLI
When you create a scale set, you specify an image to be used when the VM instances are deployed. To reduce the number of tasks after VM instances are deployed, you can use a custom VM image. This custom VM image includes any required application installs or configurations. Any VM instances created in the scale set use the custom VM image and are ready to serve your application traffic. In this tutorial you learn how to:

> [!div class="checklist"]
> * Create an Azure Compute Gallery
> * Create a specialized image definition
> * Create an image version
> * Create a scale set from a specialized image
> * Share an image gallery

[!INCLUDE [quickstarts-free-trial-note](../../includes/quickstarts-free-trial-note.md)]

[!INCLUDE [azure-cli-prepare-your-environment.md](~/reusable-content/azure-cli/azure-cli-prepare-your-environment.md)]

- This article requires version 2.4.0 or later of the Azure CLI. If using Azure Cloud Shell, the latest version is already installed.

## Overview
A [Azure Compute Gallery](../virtual-machines/shared-image-galleries.md) simplifies custom image sharing across your organization. Custom images are like marketplace images, but you create them yourself. Custom images can be used to bootstrap configurations such as preloading applications, application configurations, and other OS configurations.

The Azure Compute Gallery lets you share your custom VM images with others. Choose which images you want to share, which regions you want to make them available in, and who you want to share them with.

## Create and configure a source VM
First, create a resource group with [az group create](/cli/azure/group), then create a VM with [az vm create](/cli/azure/vm#az-vm-create). This VM is then used as the source for the image. The following example creates a VM named *myVM* in the resource group named *myResourceGroup*:

```azurecli-interactive
az group create --name myResourceGroup --location eastus

az vm create \
  --resource-group myResourceGroup \
  --name myVM \
  --image <SKU image> \
  --admin-username azureuser \
  --generate-ssh-keys
```

> [!IMPORTANT]
> The **ID** of your VM is shown in the output of the [az vm create](/cli/azure/vm#az-vm-create) command. Copy this someplace safe so you can use it later in this tutorial.

## Create an image gallery
An image gallery is the primary resource used for enabling image sharing.

Allowed characters for Gallery name are uppercase or lowercase letters, digits, dots, and periods. The gallery name cannot contain dashes.   Gallery names must be unique within your subscription.

Create an image gallery using [az sig create](/cli/azure/sig#az-sig-create). The following example creates a resource group named gallery named *myGalleryRG* in *East US*, and a gallery named *myGallery*.

```azurecli-interactive
az group create --name myGalleryRG --location eastus
az sig create --resource-group myGalleryRG --gallery-name myGallery
```

## Create an image definition
Image definitions create a logical grouping for images. They are used to manage information about the image versions that are created within them.

Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes, and periods.

Make sure your image definition is the right type. If you have generalized the VM (using Sysprep for Windows, or waagent -deprovision for Linux) then you should create a generalized image definition using `--os-state generalized`. If you want to use the VM without removing existing user accounts, create a specialized image definition using `--os-state specialized`.

For more information about the values you can specify for an image definition, see [Image definitions](../virtual-machines/shared-image-galleries.md#image-definitions).

Create an image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az-sig-image-definition-create).

In this example, the image definition is named *myImageDefinition*, and is for a [specialized](../virtual-machines/shared-image-galleries.md#generalized-and-specialized-images) Linux OS image. To create a definition for images using a Windows OS, use `--os-type Windows`.

```azurecli-interactive
az sig image-definition create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --publisher myPublisher \
   --offer myOffer \
   --sku mySKU \
   --os-type Linux \
   --os-state specialized
```

> [!IMPORTANT]
> The **ID** of your image definition is shown in the output of the command. Copy this someplace safe so you can use it later in this tutorial.

## Create the image version
Create an image version from the VM using [az image gallery create-image-version](/cli/azure/sig/image-version#az-sig-image-version-create).

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 1 replica in the *South Central US* region and 1 replica in the *East US 2* region. The replication regions must include the region the source VM is located.

Replace the value of `--managed-image` in this example with the ID of your VM from the previous step.

```azurecli-interactive
az sig image-version create \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --gallery-image-definition myImageDefinition \
   --gallery-image-version 1.0.0 \
   --target-regions "southcentralus=1" "eastus=1" \
   --managed-image "/subscriptions/<Subscription ID>/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/virtualMachines/myVM"
```

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store your image in Premium storage by a adding `--storage-account-type  premium_lrs`, or [Zone Redundant Storage](../storage/common/storage-redundancy.md) by adding `--storage-account-type  standard_zrs` when you create the image version.


## Create a scale set from the image

> [!IMPORTANT]
>Starting November 2023, VM scale sets created using PowerShell and Azure CLI will default to Flexible Orchestration Mode if no orchestration mode is specified. For more information about this change and what actions you should take, go to [Breaking Change for VMSS PowerShell/CLI Customers - Microsoft Community Hub](
https://techcommunity.microsoft.com/t5/azure-compute-blog/breaking-change-for-vmss-powershell-cli-customers/ba-p/3818295)

Create a scale set from the specialized image using [`az vmss create`](/cli/azure/vmss#az-vmss-create).

Create the scale set using [`az vmss create`](/cli/azure/vmss#az-vmss-create) using the --specialized parameter to indicate the image is a specialized image.

Use the image definition ID for `--image` to create the scale set instances from the latest version of the image that is available. You can also create the scale set instances from a specific version by supplying the image version ID for `--image`.

Create a scale set named *myScaleSet* the latest version of the *myImageDefinition* image we created earlier.

```azurecli
az group create --name myResourceGroup --location eastus
az vmss create \
   --resource-group myResourceGroup \
   --name myScaleSet \
   --orchestration-mode flexible \
   --image "/subscriptions/<Subscription ID>/resourceGroups/myGalleryRG/providers/Microsoft.Compute/galleries/myGallery/images/myImageDefinition" \
   --specialized
```

It takes a few minutes to create and configure all the scale set resources and VMs.


## Share the gallery
You can share images across subscriptions using Azure role-based access control (Azure RBAC). You can share images at the gallery, image definition or image version. Any user that has read permissions to an image version, even across subscriptions, will be able to deploy a VM using the image version.

We recommend that you share with other users at the gallery level. To get the object ID of your gallery, use [az sig show](/cli/azure/sig#az-sig-show).

```azurecli-interactive
az sig show \
   --resource-group myGalleryRG \
   --gallery-name myGallery \
   --query id
```

Use the object ID as a scope, along with an email address and [az role assignment create](/cli/azure/role/assignment#az-role-assignment-create) to give a user access to the shared image gallery. Replace `<email-address>` and `<gallery iD>` with your own information.

```azurecli-interactive
az role assignment create \
   --role "Reader" \
   --assignee <email address> \
   --scope <gallery ID>
```

For more information about how to share resources using Azure RBAC, see [Add or remove Azure role assignments using Azure CLI](../role-based-access-control/role-assignments-cli.md).


## Clean up resources
To remove your scale set and additional resources, delete the resource group and all its resources with [az group delete](/cli/azure/group). The `--no-wait` parameter returns control to the prompt without waiting for the operation to complete. The `--yes` parameter confirms that you wish to delete the resources without an additional prompt to do so.

```azurecli-interactive
az group delete --name myResourceGroup --no-wait --yes
```

## Next steps
In this tutorial, you learned how to create and use a custom VM image for your scale sets with the Azure CLI:

> [!div class="checklist"]
> * Create an Azure Compute Gallery
> * Create a specialized image definition
> * Create an image version
> * Create a scale set from a specialized image
> * Share an image gallery

Advance to the next tutorial to learn how to deploy applications to your scale set.

> [!div class="nextstepaction"]
> [Deploy applications to your scale sets](tutorial-install-apps-cli.md)
