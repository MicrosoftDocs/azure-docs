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
- Supported for 4k sector size Ultra Disks and Premium SSD v2.
- Only supported on 512e sector size Ultra Disks and Premium SSD v2 if they were created after 5/13/2023.
    - For disks created before this date, [snapshot your disk](../articles/virtual-machines/disks-incremental-snapshots.md) and create a new disk using the snapshot.
- Can't be enabled if Azure Disk Encryption (guest-VM encryption using bitlocker/DM-Crypt) is enabled on your virtual machines (VMs) or virtual machine scale sets.
- Azure Disk Encryption can't be enabled on disks that have encryption at host enabled.
- The encryption can be enabled on existing virtual machine scale sets. However, only new VMs created after enabling the encryption are automatically encrypted.
- Existing VMs must be deallocated and reallocated in order to be encrypted.
