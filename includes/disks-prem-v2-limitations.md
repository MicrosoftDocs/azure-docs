---
 title: include file
 description: include file
 author: roygara
 ms.service: azure-disk-storage
 ms.topic: include
 ms.date: 11/02/2023
 ms.author: rogarana
 ms.custom: include file
---
- Premium SSD v2 disks can't be used as an OS disk.
- Currently, Premium SSD v2 disks can only be attached to zonal VMs.
- Encryption at host is supported on Premium SSD v2 that have a 4k sector size.
- Encryption at host is supported on Premium SSD v2 that have a 512e sector size only if they were created after 5/13/2023.
    - For disks created before this date, [snapshot your disk](../articles/virtual-machines/disks-incremental-snapshots.md), and create a new disk from the snapshot.
- Azure Disk Encryption (guest VM encryption via Bitlocker/DM-Crypt) isn't supported for VMs with Premium SSD v2 disks. We recommend you to use encryption at rest with platform-managed or customer-managed keys, which is supported for Premium SSD v2. 
- Currently, Premium SSD v2 disks can't be attached to VMs in Availability Sets. 
- Azure Site Recovery aren't supported for VMs with Premium SSD v2 disks.
- Azure Backup support for VMs with Premium SSD v2 disks is currently in [public preview](../articles/backup/backup-support-matrix-iaas.md#vm-storage-support). 
- The size of a Premium SSD v2 can't be expanded without either deallocating the VM or detaching the disk.
- Premium SSDv2 does NOT support host caching.
  
