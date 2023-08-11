---
title: Managed disk bursting
description: Learn about disk bursting for Azure disks and Azure virtual machines.
author: roygara
ms.author: rogarana
ms.date: 05/02/2023
ms.topic: conceptual
ms.service: azure-disk-storage
ms.custom: references_regions, ignite-2022
---
# Managed disk bursting

**Applies to:** :heavy_check_mark: Linux VMs :heavy_check_mark: Windows VMs :heavy_check_mark: Flexible scale sets :heavy_check_mark: Uniform scale sets

Azure offers the ability to boost disk storage IOPS and MB/s performance, this is referred to as bursting for both virtual machines (VM) and disks. You can effectively use VM and disk bursting to achieve better bursting performance on both your VMs and disk.

Bursting for Azure VMs and disk resources aren't dependent on each other. You don't need to have a burst-capable VM for an attached burst-capable disk to burst. Similarly, you don't need to have a burst-capable disk attached to your burst-capable VM for the VM to burst.

## Common scenarios
The following scenarios can benefit greatly from bursting:
- **Improve startup times**  – With bursting, your instance will start up at a faster rate. For example, the default OS disk for premium enabled VMs is the P4 disk, which is a provisioned performance of up to 120 IOPS and 25 MB/s. With bursting, the P4 can go up to 3500 IOPS and 170 MB/s allowing for startup to accelerate by up to 6X.
- **Handle batch jobs** – Some application workloads are cyclical in nature. They require a baseline performance most of the time, and higher performance for short periods of time. An example of this is an accounting program that processes daily transactions that require a small amount of disk traffic. At the end of the month this program would complete reconciling reports that need a much higher amount of disk traffic.
- **Traffic spikes** – Web servers and their applications can experience traffic surges at any time. If your web server is backed by VMs or disks that use bursting, the servers would be better equipped to handle traffic spikes. 

## Disk-level bursting

Currently, there are two managed disk types that can burst, [Premium SSD managed disks](disks-types.md#premium-ssds), and [standard SSDs](disks-types.md#standard-ssds). Other disk types cannot currently burst. There are two models of bursting for disks:

- An on-demand bursting model, where the disk bursts whenever its needs exceed its current capacity. This model incurs additional charges anytime the disk bursts. On-demand bursting is only available for Premium SSDs larger than 512 GiB.
- A credit-based model, where the disk will burst only if it has burst credits accumulated in its credit bucket. This model does not incur additional charges when the disk bursts. Credit-based bursting is only available for Premium SSD managed disks 512 GiB and smaller, and standard SSDs 1024 GiB and smaller.

Azure [Premium SSD managed disks](disks-types.md#premium-ssds) can use either bursting model, but [standard SSDs](disks-types.md#standard-ssds) currently only offer credit-based bursting.

Additionally, the [performance tier of managed disks can be changed](disks-change-performance.md), which could be ideal if your workload would otherwise be running in burst.

|  |Credit-based bursting  |On-demand bursting  |Changing performance tier  |
|---------|---------|---------|---------|
| **Scenarios**|Ideal for short-term scaling (30 minutes or less).|Ideal for short-term scaling(Not time restricted).|Ideal if your workload would otherwise continually be running in burst.|
|**Cost**     |Free         |Cost is variable, see the [Billing](#billing) section for details.        |The cost of each performance tier is fixed, see [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for details.         |
|**Availability**     |Only available for premium SSD managed disks 512 GiB and smaller, and standard SSDs 1024 GiB and smaller.         |Only available for premium SSD managed disks larger than 512 GiB.         |Available to all premium SSD sizes.         |
|**Enablement**     |Enabled by default on eligible disks.         |Must be enabled by user.         |User must manually change their tier.         |

[!INCLUDE [managed-disks-bursting](../../includes/managed-disks-bursting-2.md)]

## Next steps

- To enable on-demand bursting, see [Enable on-demand bursting](disks-enable-bursting.md).
- To learn how to gain insight into your bursting resources, see [Disk bursting metrics](disks-metrics.md).
- To see exactly how much each applicable disk size can burst, see [Scalability and performance targets for VM disks](disks-scalability-targets.md).
