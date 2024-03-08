---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/24/2023
 ms.author: rogarana
 ms.custom: include file
---

- This feature is currently supported only for premium SSD managed disks.
- Performance tiers of shared disks can't be changed while attached to running VMs.
    - To change the performance tier of a shared disk, stop all the VMs it's attached to.
- The P60, P70, and P80 performance tiers can only be used by disks that are larger than 4,096 GiB.
- A disk's performance tier can be downgraded only once every 12 hours.
- The system does not return Performance Tier for disks created before June 2020. You can take advantage of Performance Tier for an older disk by updating it with the baseline Tier.
