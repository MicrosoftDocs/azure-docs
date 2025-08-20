---
title: Images
description: Attach and manage images within Azure CycleCloud. You can specify standard operating systems using Image, ImageName, ImageId, or ImageUrl.
author: KimliW
ms.date: 06/10/2025
ms.author: adjohnso
---

# Images

Azure CycleCloud ships with support for standard operating systems. You can specify the image with `ImageName`, which can be a CycleCloud image name, an image URN, or the resource ID of a custom image: 

``` ini
# CycleCloud image name
[[node defaults]]
ImageName = cycle.image.win2022

# Image URN (publisher:offer:sku:version)
[[node defaults]]
ImageName = MicrosoftWindowsServer:WindowsServer:2022-datacenter-g2:latest

# Image resource ID
[[node defaults]]
ImageName = /subscriptions/xxxxxxxx-xxxx-xxxx-xxxxxxxxxxxx/resourceGroups/MyResourceGroup/providers/Microsoft.Compute/images/MyCustomImage
```

Alternatively, use `Image` which supports image labels:

``` ini
[[node defaults]]
Image = Windows 2022 DataCenter
```

When you don't specify an exact version, CycleCloud automatically uses the latest released version of the image for the region of the node.

> [!NOTE]
> If you're using a custom (nonstandard) image that you created with Jetpack, set `AwaitInstallation=true` on the node. This setting specifies that the image supports sending status messages back to CycleCloud. With this setting, CycleCloud can provide more accurate representations of the node's state.

CycleCloud currently includes the following images:

| Operating System | Label | Name | End of life date |
| ---------------- | ------|------| ---------------- |
| Alma Linux 8.5 HPC | Alma Linux 8 | almalinux-8 | |
| CentOS 7         | CentOS 7     | cycle.image.centos7   | |
| CentOS 8         | CentOS 8     | cycle.image.centos8   | December 31, 2021 |
| SLES 12     | SLES 12 HPC    | cycle.image.sles12-hpc  | |
| SLES 15     | SLES 15 HPC    | cycle.image.sles15-hpc  | |
| Ubuntu 20.04     | Ubuntu 20.04 LTS    | cycle.image.ubuntu20  | |
| Ubuntu 22.04     | Ubuntu 22.04 LTS    | cycle.image.ubuntu22  | |
| Windows 2008 R2  | Windows 2008 R2 | cycle.image.win2008   | January 14, 2020 |
| Windows 2012 R2  | Windows 2012 R2 | cycle.image.win2012   | October 10, 2023 |
| Windows 2016 DataCenter | Windows 2016 DataCenter | cycle.image.win2016   | |
| Windows 2019 DataCenter | Windows 2019 DataCenter | cycle.image.win2019   | |
| Windows 2022 DataCenter | Windows 2022 DataCenter | cycle.image.win2022   | |

> [!NOTE]
> Standard images referenced in CycleCloud are the latest known versions of publicly available operating system images hosted in the Marketplace. Microsoft doesn't create, maintain, or support these images for the CycleCloud product.
