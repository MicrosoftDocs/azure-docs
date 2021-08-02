---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 05/13/2021
 ms.author: rogarana
 ms.custom: include file
---

- This feature is currently supported only for premium SSDs.
- You must either deallocate your VM or detach your disk from a running VM before you can change the disk's tier.
- The P60, P70, and P80 performance tiers can only be used by disks that are larger than 4,096 GiB.
- A disk's performance tier can be downgraded only once every 12 hours.

## Change performance tier without downtime (preview)

Normally, you would have to deallocate your VM or detach your disk to change your performance tier. But if you enable this preview feature you don't have to deallocate your VM or detach your disk to change the tier.

The preview has the following limitations:
- Available in all the regions.
- Not currently available for shared disks.
- Must use one of the following methods to change the tier without downtime:
    - Azure Resource Manager templates with the `2020-12-01` API to change performance tiers without downtime.
    - Accessing the Azure portal through the following link: [https://aka.ms/diskPerfTiersPreview](https://aka.ms/diskPerfTiersPreview).
    - The latest Azure CLI.
