---
title: Images
description: Attach and manage images within Azure CycleCloud. You can specify standard operating systems using Image, ImageName, ImageId, or ImageUrl.
author: KimliW
ms.date: 08/01/2018
ms.author: adjohnso
---

# Images

Azure CycleCloud ships with support for standard operating systems. You can specify the image with `Image`:

``` ini
[[node defaults]]
Image = Cycle Windows 2016
```

You can also specify by `ImageName`:

``` ini
[[node defaults]]
ImageName = cycle.image.win2016
```

Finally, you can always select a specific image by `ImageId` or `ImageUrl`:

``` ini
[[node defaults]]
ImageId = order66

[[node defaults]]
ImageUrl = http://cloud-provider/path/to/custom-image
```

CycleCloud automatically uses the latest released version of the image for the cloud provider and region that the instance is in.

> [!NOTE]
If you are using a custom (non-standard) image that was created with Jetpack, you can set `AwaitInstallation=true` on the node, specifying that the image supports sending status messages back to CycleCloud. This will allow for more accurate representations of the node's state within CycleCloud.

CycleCloud currently includes the following images:

| Operating System | Label | Name |
| ---------------- | ------------------ | --------------------- |
| CentOS 7         | CentOS 7     | cycle.image.centos7   |
| CentOS 8         | CentOS 8     | cycle.image.centos8   |
| Ubuntu 16.04     | Ubuntu 16    | cycle.image.ubuntu16  |
| Ubuntu 18.04     | Ubuntu 18    | cycle.image.ubuntu18  |
| Ubuntu 20.04     | Ubuntu 20    | cycle.image.ubuntu20  |
| Alma Linux 8.5 HPC | Alma Linux 8 | almalinux-8 |
| Windows 2008 R2  | Windows 2008 R2 | cycle.image.win2008   |
| Windows 2012 R2  | Windows 2012 R2 | cycle.image.win2012   |
| Windows 2016 DataCenter | Windows 2016 DataCenter | cycle.image.win2016   |

> [!NOTE]
> Standard images referenced in CycleCloud are the latest known versions of publicly-available operating system images hosted by the cloud service provider and are not created, maintained, or supported by Microsoft for the CycleCloud product.
