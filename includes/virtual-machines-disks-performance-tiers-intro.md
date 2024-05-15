---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 03/04/2024
 ms.author: rogarana
 ms.custom: include file
---

> [!NOTE]
> This article focuses on how to change performance tiers. To learn how to change the performance of disks that don't use performance tiers, like Ultra Disks or Premium SSD v2, see either [Adjust the performance of an ultra disk](../articles/virtual-machines/disks-enable-ultra-ssd.md#adjust-the-performance-of-an-ultra-disk) or [Adjust disk performance of a Premium SSD v2](../articles/virtual-machines/disks-deploy-premium-v2.md#adjust-disk-performance)

The performance of your Azure managed disk is set when you create your disk, in the form of its performance tier. The performance tier determines the IOPS and throughput your managed disk has. When you set the provisioned size of your disk, a performance tier is automatically selected. The performance tier can be changed at deployment or afterwards, without changing the size of the disk and without downtime. To learn more about performance tiers, see [Performance tiers for managed disks](../articles/virtual-machines/disks-change-performance.md).

Changing your performance tier has billing implications. See [Billing impact](../articles/virtual-machines/disks-change-performance.md#billing-impact) for details.