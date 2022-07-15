---
 title: include file
 description: include file
 services: storage
 author: roygara
 ms.service: storage
 ms.topic: include
 ms.date: 07/14/2022
 ms.author: rogarana
 ms.custom: include file
---
1. Premium SSD v2 disks can't be used as an OS disk.
1. Currently, Premium SSD v2 disks can only be attached to zonal VMs.
1. Currently, Premium SSD v2 disks can't be attached to VMs in virtual machine scale sets.
1. Currently, snapshots aren't supported.
1. Currently, Premium SSD v2 disks can't be attached to VMs with encryption at host enabled.
1. Currently, Premium SSD v2 disks can't be attached to VMs in Availability Sets.
1. Azure Disks Encryption isn't supported for VMs with Premium SSD v2 disks. 
1. Only uncached reads and uncached writes are supported.
1. Azure Backup and Azure Site Recovery aren't supported for VMs with Premium SSD v2 disks. 