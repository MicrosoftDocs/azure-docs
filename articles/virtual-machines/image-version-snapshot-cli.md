---
title: CLI - Create an image from a snapshot or Managed Disk in a Shared Image Gallery 
description: Learn how to Create an image from a snapshot or Managed Disk in a Shared Image Gallery using the Azure CLI.
author: cynthn
ms.service: virtual-machines
ms.subservice: shared-image-gallery
ms.topic: how-to
ms.workload: infrastructure
ms.date: 06/30/2020
ms.author: cynthn
ms.reviewer: akjosh

---

# Create an image from a Managed Disk or snapshot in a Shared Image Gallery using the Azure CLI

If you have an existing snapshot or Managed Disk that you would like to migrate into a Shared Image Gallery, you can create a Shared Image Gallery image directly from the Managed Disk or snapshot. Once you have tested your new image, you can delete the source Managed Disk or snapshot. You can also create an image from a Managed Disk or snapshot in a Shared Image Gallery using the [Azure PowerShell](image-version-snapshot-powershell.md).

Images in an image gallery have two components, which we will create in this example:
- An **Image definition** carries information about the image and requirements for using it. This includes whether the image is Windows or Linux, specialized or generalized, release notes, and minimum and maximum memory requirements. It is a definition of a type of image. 
- An **image version** is what is used to create a VM when using a Shared Image Gallery. You can have multiple versions of an image as needed for your environment. When you create a VM, the image version is used to create new disks for the VM. Image versions can be used multiple times.


## Before you begin

To complete this article, you must have an snapshot or Managed Disk. 

If you want to include a data disk, the data disk size cannot be more than 1 TB.

When working through this article, replace the resource names where needed.

## Find the snapshot or Managed Disk 

You can see a list of snapshots that are available in a resource group using [az snapshot list](/cli/azure/snapshot#az_snapshot_list). 

```azurecli-interactive
az snapshot list --query "[].[name, id]" -o tsv
```

You can also use a Managed Disk instead of a snapshot. To get a Managed Disk, use [az disk list](/cli/azure/disk#az_disk_list). 

```azurecli-interactive
az disk list --query "[].[name, id]" -o tsv
```

Once you have the ID of the snapshot or Managed Disk and assign it to a variable called `$source` to be used later.

You can use the same process to get any data disks that you want to include in your image. Assign them to variables, then use those variables later when you create the image version.


## Find the gallery

You will need information about the image gallery in order to create the image definition.

List information about the available image galleries using [az sig list](/cli/azure/sig#az_sig_list). Note the gallery name which resource group the gallery is in to use later.

```azurecli-interactive 
az sig list -o table
```


## Create an image definition

Image definitions create a logical grouping for images. They are used to manage information about the image. Image definition names can be made up of uppercase or lowercase letters, digits, dots, dashes and periods. 

When making your image definition, make sure is has all of the correct information. In this example, we are assuming that the snapshot or Managed Disk are from a VM that is in use, and hasn't been generalized. If the Managed Disk or snapshot was taken of a generalized OS (after running Sysprep for Windows or [waagent](https://github.com/Azure/WALinuxAgent) `-deprovision` or `-deprovision+user` for Linux) then change the `-OsState` to `generalized`. 

For more information about the values you can specify for an image definition, see [Image definitions](./shared-image-galleries.md#image-definitions).

Create an image definition in the gallery using [az sig image-definition create](/cli/azure/sig/image-definition#az_sig_image_definition_create).

In this example, the image definition is named *myImageDefinition*, and is for a [specialized](./shared-image-galleries.md#generalized-and-specialized-images) Linux OS image. To create a definition for images using a Windows OS, use `--os-type Windows`. 

In this example, the gallery is named *myGallery*, it is in the *myGalleryRG* resource group, and the image definition name will be *mImageDefinition*.

```azurecli-interactive 
resourceGroup=myGalleryRG
gallery=myGallery
imageDef=myImageDefinition
az sig image-definition create \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --gallery-image-definition $imageDef \
   --publisher myPublisher \
   --offer myOffer \
   --sku mySKU \
   --os-type Linux \
   --os-state specialized
```


## Create the image version

Create an image version using [az image gallery create-image-version](/cli/azure/sig/image-version#az_sig_image_version_create). 

Allowed characters for image version are numbers and periods. Numbers must be within the range of a 32-bit integer. Format: *MajorVersion*.*MinorVersion*.*Patch*.

In this example, the version of our image is *1.0.0* and we are going to create 1 replica in the *South Central US* region and 1 replica in the *East US 2* region using zone-redundant storage. When choosing target regions for replication, remember that you also have to include the *source* region of the Managed Disk or snapshot as a target for replication.

Pass the ID of the snapshot or Managed Disk in the `--os-snapshot` parameter.


```azurecli-interactive 
az sig image-version create \
   --resource-group $resourceGroup \
   --gallery-name $gallery \
   --gallery-image-definition $imageDef \
   --gallery-image-version 1.0.0 \
   --target-regions "southcentralus=1" "eastus2=1=standard_zrs" \
   --replica-count 2 \
   --os-snapshot $source
```

If you want to include data disks in the image, then you need to include both the `--data-snapshot-luns` parameter set to the LUN number and the `--data-snapshots` set to the ID of the data disk or snapshot.

> [!NOTE]
> You need to wait for the image version to completely finish being built and replicated before you can use the same managed image to create another image version.
>
> You can also store all of your image version replicas in [Zone Redundant Storage](../storage/common/storage-redundancy.md) by adding `--storage-account-type standard_zrs` when you create the image version.
>

## Next steps

Create a VM from a [specialized image version](vm-specialized-image-version-cli.md).

For information about how to supply purchase plan information, see [Supply Azure Marketplace purchase plan information when creating images](marketplace-images.md).