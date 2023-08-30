---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 01/19/2023
 ms.author: rogarana
 ms.custom: include file
---
- Doesn't support ultra disks or premium SSD v2 managed disks.
- Can't be enabled if Azure Disk Encryption (guest-VM encryption using bitlocker/DM-Crypt) is enabled on your virtual machines (VMs) or virtual machine scale sets.
- Azure Disk Encryption can't be enabled on disks that have encryption at host enabled.
- The encryption can be enabled on existing virtual machine scale sets. However, only new VMs created after enabling the encryption are automatically encrypted.
- Existing VMs must be deallocated and reallocated in order to be encrypted.
