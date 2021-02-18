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

## Changing performance tier without downtime (preview)

You can also change your performance tier without downtime, meaning you don't have to deallocate your VM or detach your disk to change the tier. This feature is currently in preview and you may sign up for it [here](https://aka.ms/liveperftiersignup).

- Available in USEastEUAP region only.
- Not available for shared disks
- Must use Azure Resource Manager templates with `2020-12-01` API to change performance tiers without downtime.