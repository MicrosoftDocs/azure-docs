---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 09/10/2022
 ms.author: rogarana
 ms.custom: include file
---
- Only supports Ultra disks and Premium SSD v2 disks in the following regions:
    - RegionListHere
- Cannot be enabled if Azure Disk Encryption (guest-VM encryption using bitlocker/DM-Crypt) is enabled on your VMs/virtual machine scale sets.
- Azure Disk Encryption cannot be enabled on disks that have encryption at host enabled.
- The encryption can be enabled on existing virtual machine scale set. However, only new VMs created after enabling the encryption are automatically encrypted.
- Existing VMs must be deallocated and reallocated in order to be encrypted.
- Supports ephemeral OS disks but only with platform-managed keys.
