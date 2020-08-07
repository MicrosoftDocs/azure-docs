--- 
title: FAQ Azure VM sizes with no local temporary disk 
description: This article provides answers to frequently asked questions (FAQ) about Microsoft Azure VM sizes that don’t have local temporary disk. 
author: brbell 
ms.service: virtual-machines 
ms.topic: article 
ms.author: brbell
ms.reviewer: mimckitt
ms.date: 06/15/2020 
--- 

# Azure VM sizes with no local temporary disk 
This article provides answers to frequently asked questions (FAQ) about Azure VM sizes that do not have a local temporary disk (i.e. no local temp desk). For more information on these VM sizes, see [Specifications for Dv4 and Dsv4-series (General Purpose Workloads)](dv4-dsv4-series.md) or [Specifications for Ev4 and Esv4-series (Memory Optimized Workloads)](ev4-esv4-series.md).

> [!IMPORTANT]
> Dv4, Dsv4, Ev4 and Esv4-series VM sizes are now in Public Preview. To sign up for Public Preview, fill out this [Form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRURE1ZSkdDUzg1VzJDN0cwWUlKTkcyUlo5Mi4u). 

## What does no local temp disk mean? 
Traditionally, we have had VM sizes (e.g. Standard_D2s_v3, Standard_E48_v3) that include a small local disk (i.e. a D: Drive). Now with these new VM sizes, that small local disk no longer exists; however, you can still attach Standard HDD, Premium SSD or Ultra SSD.

## What if I still want local temp disk?
If your workload requires a local temporary disk, we also have new [Ddv4 and Ddsv4](ddv4-ddsv4-series.md) or [Edv4 and Edsv4](edv4-edsv4-series.md) VM sizes available. These sizes offer 50% larger temporary disk compared with the previous v3 sizes.

> [!NOTE]
> Local temporary disk is not persistent; to ensure your data is persistent, please use Standard HDD, Premium SSD or Ultra SSD options. 

## What are the differences between these new VM sizes and the General Purpose Dv3/Dsv3 or the Memory Optimized Ev3/Esv3 VM sizes that I am used to? 
| v3 VM families with local temp disk	| New v4 families with local temp disk | New v4 families with no local temp disk |
|---|---|---|
| Dv3	| Ddv4 | Dv4 |
| Dsv3 | Ddsv4  | Dsv4 |
| Ev3	| Edv4  | Ev4 |
| Esv3 | Edsv4 |	Esv4 | 

## Can I resize a VM size that has a local temp disk to a VM size with no local temp disk?  
No. The only combinations allowed for resizing are: 

1. VM (with local temp disk) -> VM (with local temp disk); and 
2. VM (with no local temp disk) -> VM (with no local temp disk). 

> [!NOTE]
> If an image depends on the resource disk, or a pagefile or swapfile exists on the local temp disk, the diskless images will not work—instead, use the ‘with disk’ alternative. 

## Do these VM sizes support both Linux and Windows Operating Systems (OS)?
Yes.

## Will this break my custom scripts, custom images or OS images that have scratch files or page files on a local temp disk?
If the custom OS image points to the local temp disk, the image might not work correctly with this diskless size.

## Have questions or feedback?
Fill out the [feedback form]( https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRUMzdCQkw0OVVRTldFUUtXSTlLQVBPUkVHSy4u). 

## Next steps 
In this document, you learned more about the most frequent questions related to Azure VMs with local temp disk. For more information about these VM sizes, see the following articles:

- [Specifications for Dv4 and Dsv4-series (General Purpose Workload)](dv4-dsv4-series.md)
- [Specifications for Ev4 and Esv4-series (Memory Optimized Workload)](ev4-esv4-series.md)
