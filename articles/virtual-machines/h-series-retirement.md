---
title: H-series retirement
description: H-series retirement started September 1, 2021.
ms.service: virtual-machines
ms.subservice: sizes
ms.topic: conceptual
ms.date: 08/02/2021
---

# Migrate your H and H-series Promo virtual machines by August 31, 2022

Microsoft Azure has introduced newer generations of high-performance computing (HPC), general purpose, and memory-optimized virtual machines (VMs). For this reason, we recommend that you migrate workloads from the original H-series and H-series Promo VMs to our newer offerings.

Azure [HC](hc-series.md), [HBv2](hbv2-series.md), [HBv3](hbv3-series.md), [Dv4](dv4-dsv4-series.md), [Dav4](dav4-dasv4-series.md), [Ev4](ev4-esv4-series.md), and [Eav4](eav4-easv4-series.md) VMs have greater memory bandwidth, improved networking capabilities, and better cost and performance across various HPC workloads. On August 31, 2022, we're retiring the following H-series Azure VM sizes:

- H8
- H8m
- H16
- H16r
- H16m
- H16mr
- H8 Promo
- H8m Promo
- H16 Promo
- H16r Promo
- H16m Promo
- H16mr Promo

## How does the H-series migration affect me?

1-year and 3-year RI offerings for the VMs are no longer available; however, regular PAYGO offer can still be transacted until the official decommission date. After August 31, 2022, any remaining H-series VM subscriptions in the preceding list will be set to a deallocated state. They'll stop working and no longer incur billing charges. If you need RI, please refer to our migration documents to find the suitable VM offerings that have RI available. You can either exchange/refund your existing reservations. If you choose not to, after the hardware is deprecated you won’t be getting the reservation benefit but still be paying for it.

The current VM size retirement only affects the VM sizes in the [H series](h-series.md), which includes the H-series Promo.

## What actions should I take?

You'll need to resize or deallocate your H-series VMs. We recommend that you migrate workloads from the original H-series VMs and the H-series Promo VMs to our newer offerings.

**HPC workloads:** [HC](hc-series.md), [HBv2](hbv2-series.md), and [HBv3](hbv3-series.md) VMs offer substantially higher levels of HPC workload performance and cost efficiency because of:

- Large improvements in CPU core architecture.
- Higher memory bandwidth.
- Larger L3 caches.
- Enhanced InfiniBand networking hardware and software support as compared to H series.

As a result, HC, HBv2, and HBv3 series will in general offer substantially better performance per unit of cost (maximizing performance for a fixed amount of spend) and cost per performance (minimizing cost for a fixed amount of performance).

**General purpose workloads:** [Dv4](dv4-dsv4-series.md), [Dav4](dav4-dasv4-series.md), and Dv5 VMs offer the same or better CPU performance at identical or larger core counts, a comparable amount of memory per physical CPU core, better Azure networking capabilities, and lower overall cost.

**Memory-optimized workloads:** [Ev4](ev4-esv4-series.md), [Eav4](eav4-easv4-series.md), and Ev5 VMs offer the same or better CPU performance at identical or larger core counts, a comparable amount of memory per physical CPU core, better Azure networking capabilities, and lower overall cost.

[H-series](h-series.md) and H-series Promo VMs won't be retired until September 2022. We're providing this guide in advance to give you a long window to assess, plan, and execute your migration.

### Migration steps

1. Choose a series and size for migration.
1. Get a quota for the target VM series.
1. Resize the current H-series VM size to the target size.

### Breaking changes

If you use H-series VM sizes that expose an InfiniBand networking interface, such as those sizes with an "r" in the VM size name, and you want your new VM sizes to also support InfiniBand networking, you'll no longer be able to use legacy OS images with built-in InfiniBand driver support (CentOS 7.4 and prior, Windows Server 2012).

Instead, use modern OS images such as those available in Azure Marketplace that support modern operating systems (CentOS 7.5 and newer, Windows Server 2016 and newer) and standard OFED drivers. See the [supported software stack](hbv3-series.md#get-started), which includes the supported OS for the respective VM sizes.

### Get a quota for the target VM family

Follow the guide to [request an increase in vCPU quota by VM family](../azure-portal/supportability/per-vm-quota-requests.md).

### Resize the current VM

You can [resize the virtual machine](resize-vm.md).
