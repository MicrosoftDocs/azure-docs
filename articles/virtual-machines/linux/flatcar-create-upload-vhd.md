---
title: Create and upload a Flatcar Container Linux VHD for use in Azure 
description: Learn to create and upload a VHD that contains a Flatcar Container Linux operating system.
author: mattmcinnes
ms.author: mattmcinnes
ms.service: virtual-machines
ms.collection: linux
ms.workload: infrastructure-services
ms.topic: how-to
ms.date: 07/16/2020
ms.reviewer: cynthn

---
# Using a prebuilt Flatcar image for Azure

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Flexible scale sets 

You can download prebuilt Azure virtual hard disk images of Flatcar Container
Linux for each of the Flatcar supported channels:

- [stable](https://stable.release.flatcar-linux.net/amd64-usr/current/flatcar_production_azure_image.vhd.bz2)
- [beta](https://beta.release.flatcar-linux.net/amd64-usr/current/flatcar_production_azure_image.vhd.bz2)
- [alpha](https://alpha.release.flatcar-linux.net/amd64-usr/current/flatcar_production_azure_image.vhd.bz2)
- [LTS](https://lts.release.flatcar-linux.net/amd64-usr/current/flatcar_production_azure_image.vhd.bz2)

This image is already fully set up and optimized to run on Azure. You only
need to decompress it.

## Building your own Flatcar-based virtual machine for Azure

Alternatively, you can choose to build your own Flatcar Container Linux
image.

On any linux based machine, follow the instructions detailed in the
[Flatcar Container Linux developer SDK guide](https://www.flatcar.org/docs/latest/reference/developer-guides/). When
running the `image_to_vm.sh` script, make sure you pass `--format=azure` to
create an Azure virtual hard disk.

## Next steps

Once you have the .vhd file, you can use the resulting file to create new
virtual machines in Azure. If this is the first time that you're uploading
a .vhd file to Azure, see [Create a Linux VM from a custom
disk](upload-vhd.md#option-1-upload-a-vhd).
