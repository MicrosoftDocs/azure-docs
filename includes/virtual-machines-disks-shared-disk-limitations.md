---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 02/03/2020
 ms.author: rogarana
 ms.custom: include file
---

While in preview, managed disks that have shared disks enabled are subject to the following limitations:

- Currently only available with premium SSDs.
- Only currently supported in the West Central US region.
- Can only be enabled on data disks, not OS disks.
- Only basic disks can be used with WSFC, for details see here.
- ReadOnly host caching is not available for premium SSDs with maxShares>1.
- AvailabilitySet and virtual machine scale  sets can only be used with `FaultDomainCount` set to 1.
- Azure Backup and Azure Site Recovery support is not yet available.