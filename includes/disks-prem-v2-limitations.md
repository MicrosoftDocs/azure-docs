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
1. Currently, Premium SSD v2 disks can only be attached to zonal VMs.
1. Currently, Premium SSD v2 disks cannot be attached to VMs in VM Scale Sets.
1. Currently, snapshots and Azure Backup aren't supported.
1. Premium SSD v2 disks can't be attached to VMs with encryption at host enabled.
1. Premium SSD v2 disks can't be attached to VMs in Availability Sets.
1. Azure Disks Encryption is not supported for VMs with Premium SSD v2 disks. 
1. Only un-cached reads and un-cached writes are supported.
1. Azure Site Recovery isn't supported for VMs with Premium SSD v2 disks. 