---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/09/2020
 ms.author: rogarana
 ms.custom: include file
---
1. Does not support ultra disks.
1. Host-based encryption cannot be enabled if you have Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) currently enabled on your VMs/virtual machine scale sets.
1. The encryption can be enabled on existing virtual machine scale set. However, only new VMs created after enabling the encryption are automatically encrypted.
1. Existing VMs must be deallocated and reallocated in order to be encrypted.