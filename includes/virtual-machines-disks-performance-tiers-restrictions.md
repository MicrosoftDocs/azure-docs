---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 11/20/2020
 ms.author: rogarana
 ms.custom: include file
---

- This feature is currently supported only for premium SSDs.
- You must either deallocate your VM or detach your disk from a running VM before you can change the disk's tier.
- The P60, P70, and P80 performance tiers can only be used by disks that are larger than 4,096 GiB.
- A disk's performance tier can be downgraded only once every 12 hours.