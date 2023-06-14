---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 08/30/2022
 ms.author: rogarana
 ms.custom: include file
---

The performance of your Azure managed disk is set when you create your disk, in the form of its performance tier. The performance tier determines the IOPS and throughput your managed disk has. When you set the provisioned size of your disk, a performance tier is automatically selected. The performance tier can be changed at deployment or afterwards, without changing the size of the disk and without downtime. To learn more about performance tiers, see [Performance tiers for managed disks](../articles/virtual-machines/disks-change-performance.md).

Changing your performance tier has billing implications. See [Billing impact](../articles/virtual-machines/disks-change-performance.md#billing-impact) for details.