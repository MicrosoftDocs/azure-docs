---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 11/02/2023
 ms.author: rogarana
ms.custom:
  - include file
  - ignite-2023
---
- Premium SSD v2 disks can't be used as an OS disk.
- Currently, Premium SSD v2 disks can only be attached to zonal VMs.
- Encryption at host is supported on Premium SSD v2 disks with some limitations and in select regions. For more information, see [Encryption at host](../articles/virtual-machines/disk-encryption.md#restrictions-1).
- Azure Disk Encryption (guest VM encryption via Bitlocker/DM-Crypt) isn't supported for VMs with Premium SSD v2 disks. We recommend you to use encryption at rest with platform-managed or customer-managed keys, which is supported for Premium SSD v2. 
- Currently, Premium SSD v2 disks can't be attached to VMs in Availability Sets. 
- Azure Site Recovery isn't supported for VMs with Premium SSD v2 disks.
- Azure Backup support for VMs with Premium SSD v2 disks is currently in [public preview](../articles/backup/backup-support-matrix-iaas.md#vm-storage-support). 
- The size of a Premium SSD v2 can't be expanded without either deallocating the VM or detaching the disk.
- Premium SSDv2 does NOT support host caching.
  
