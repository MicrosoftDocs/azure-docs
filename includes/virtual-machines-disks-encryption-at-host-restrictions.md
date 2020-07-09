---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 07/08/2020
 ms.author: rogarana
 ms.custom: include file
---
1. Does not support ultra disks.
1. You cannot enable the feature if you have enabled Azure Disks Encryption (guest-VM encryption using bitlocker/VM-Decrypt) enabled on your VMs/virtual machine scale sets.
1. You have to deallocate your existing VMs to enable the encryption.
1. You can enable the encryption for existing virtual machine scale set. However, only new VMs created after enabling the encryption are encrypted.