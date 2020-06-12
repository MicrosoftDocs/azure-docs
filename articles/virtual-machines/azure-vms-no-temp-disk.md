---
title: Azure VM sizes with no local temporary disk
description: This article provides answers to frequently asked questions about Microsoft Azure VM sizes that do not have local temporary disk.
author: brbell
ms.author: brbell
ms.reviwer: cynthn
ms.custom: mimckitt
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 06/08/2020
---

# Azure VM sizes with no local temporary disk FAQ

This article provides answers to frequently asked questions about Azure VM sizes that do not have a local temporary disk.

For more information about these VM sizes, see the specifications for the [Dv4, Dsv4-series](dv4-dsv-series.md) or the [Ev4, Esv4-series](ev4-esv4-series.md) 

> [!NOTE]
> If you have questions or feedback, you can reach out by filling out this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRUMzdCQkw0OVVRTldFUUtXSTlLQVBPUkVHSy4u) and we will get back to you.

## What does no local temporary disk mean?

In the past where we have had VM sizes (e.g. Standard_D2s_v3, Standard_E48_v3) that come with a small local disk (i.e. D: Drive). With these new VM sizes, there no longer a local temp disk available. However, you can still attach Standard HDD, Premium SSD or Ultra SSD as needed. 

## What if I still want to use a local temporary disk in my VM?

If your workload still requires the local temporary disk, the [Ddv4 and Ddsv4](dv4-dsv4-series.md) or the [Edv4 and Edsv4](ev4-esv4-series.md ) VM sizes still offer a local temp disk. The "d" in the series name indicates the temp disk. These sizes offer 50% larger temporary disk than compared with the previous v3 sizes.

> [!NOTE]
> The local temp disk is not persistent, to retain and persist your data, use Standard HDD, Premium SSD or Ultra SSD options.
 
## What are the differences from the General Purpose Dv3/Dsv3 or Memory Optimized Ev3/Esv3 VM sizes that I am used to?

| v3 VM families with local temp disk	| New v4 families with local temp disk	| New v4 families without local temp disk |
|---|---|---|
| Dv3	| Ddv4 | Dv4 |
| Dsv3 | Ddsv4 | Dsv4 |
| Ev3 | Edv4 | Ev4 |
| Esv3 | Edsv4 |	Esv4 |

## Are these VMs with no local temporary disk in general availability (GA) yet?

Dv4, Dsv4, Ev4 and Esv4-series VM sizes are now in Public Preview.

You can sign up for these Dv4, Dsv4-series or Ev4, Esv4-series [here](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRURE1ZSkdDUzg1VzJDN0cwWUlKTkcyUlo5Mi4u). If you have further question or feedback, fill out this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRUMzdCQkw0OVVRTldFUUtXSTlLQVBPUkVHSy4u) and we will get back to you. 

## Can I resize a VM size with a local temp disk to a new VM size with no local disk? 

No. The only combinations allowed for resizing are: 

VM (with local temp disk) -> VM (with local temp disk)
- For example: Standard_E2s_v3 -> Standard_E2ds_v4 

VM (with no local temp disk) -> VM (with no local temp disk)
- For example: Standard_D4s_v4 ->Standard_D8s_v4


## How much does VM size with no local temp disk cost?

PLACEHOLDER

## How can I start using these VM sizes?

PLACEHOLDER

## What operating systems support this non-local temporary disk?

Both Windows and Linux OS.

## What OS images will work on these new VM sizes that has no temp disk?

PLACEHOLDER

## Will this break my custom script, custom images or OS images that I am using that has scratch file or page file on this local temp disk?

PLACEHOLDER

## What is the performance expectation if my workload is dependent on the page file and the page file is not located on the temp disk anymore? What is the latency going to be like?

PLACEHOLDER

## Where can I go to ask questions or provide feedback?

If you have questions or feedback, reach out via this [form](https://forms.office.com/Pages/ResponsePage.aspx?id=v4j5cvGGr0GRqy180BHbR_Y3toRKxchLjARedqtguBRUMzdCQkw0OVVRTldFUUtXSTlLQVBPUkVHSy4u)

## Next steps
For more information about these VM sizes, see the following articles:

- [Specifications for Dv4, Dsv4-series (General Purpose Workload)](dv4-dsv4-series.md)
- [Specifications for Ev4, Esv4-series (Memory Optimized Workload)](ev4-esv4-series.md)
