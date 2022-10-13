---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 07/15/2022
 ms.author: rogarana
 ms.custom: include file
---
- Premium SSD v2 disks can't be used as an OS disk.
- Currently, Premium SSD v2 disks can only be attached to zonal VMs.
- Currently, taking snapshots aren't supported, and you can't create a Premium SSD v2 from the snapshot of another disk type.
- Currently, Premium SSD v2 disks can't be attached to VMs with encryption at host enabled.
- Azure Disk Encryption isn't supported for VMs with Premium SSD v2 disks.
- Currently, Premium SSD v2 disks can't be attached to VMs in Availability Sets.
- Azure Backup and Azure Site Recovery aren't supported for VMs with Premium SSD v2 disks. 