---
title: Managed disk bursting
description: Learn about disk bursting for Azure disks and Azure virtual machines.
author: albecker1
ms.author: albecker
ms.date: 03/02/2021
ms.topic: conceptual
ms.service: virtual-machines
ms.subservice: disks
ms.custom: references_regions
---
# Managed disk bursting
[!INCLUDE [managed-disks-bursting](../../includes/managed-disks-bursting.md)]

Azure [premium SSDs](disks-types.md#premium-ssd) offer two models of bursting:

- A on-demand bursting model (preview), where the disk bursts whenever its needs exceed its current capacity. This model incurs additional charges anytime the disk bursts. Noncredit bursting is only available on disks greater than 512 GiB in size.
- A credit-based model, where the disk will burst only if it has burst credits accumulated in its credit bucket. This model does not incur additional charges when the disk bursts. Credit-based bursting is only available on disks 512 GiB and smaller.

Additionally, the [performance tier of managed disks can be changed](disks-change-performance.md), which could be ideal if your workload would otherwise be running in burst.

|  |Credit-based bursting  |On-demand bursting  |Changing performance tier  |
|---------|---------|---------|---------|
| **Scenarios**|Ideal for short-term scaling (30 minutes or less).|Ideal for short-term scaling(Not time restricted).|Ideal if your workload would otherwise continually be running in burst.|
|**Cost**     |Free         |Cost is variable, see the [Billing](#billing) section for details.        |The cost of each performance tier is fixed, see [Managed Disks pricing](https://azure.microsoft.com/pricing/details/managed-disks/) for details.         |
|**Availability**     |Only available for premium SSDs 512 GiB and smaller.         |Only available for premium SSDs larger than 512 GiB.         |Available to all premium SSD sizes.         |
|**Enablement**     |Enabled by default on eligible disks.         |Must be enabled by user.         |User must manually change their tier.         |

## Common scenarios
The following scenarios can benefit greatly from bursting:
- **Improve startup times**  – With bursting, your instance will startup at a significantly faster rate. For example, the default OS disk for premium enabled VMs is the P4 disk, which is a provisioned performance of up to 120 IOPS and 25 MB/s. With bursting, the P4 can go up to 3500 IOPS and 170 MB/s allowing for startup to accelerate by up to 6X.
- **Handle batch jobs** – Some application workloads are cyclical in nature. They require a baseline performance most of the time, and higher performance for short periods of time. An example of this is an accounting program that processes daily transactions that require a small amount of disk traffic. At the end of the month this program would complete reconciling reports that need a much higher amount of disk traffic.
- **Traffic spikes** – Web servers and their applications can experience traffic surges at any time. If your web server is backed by VMs or disks that use bursting, the servers would be better equipped to handle traffic spikes. 

[!INCLUDE [managed-disks-bursting](../../includes/managed-disks-bursting-2.md)]

## Next steps

To enable on-demand bursting, see [Enable on-demand bursting](disks-enable-bursting.md).
To learn how to gain insight into your bursting resources, see [Disk bursting metrics](disks-metrics.md).
