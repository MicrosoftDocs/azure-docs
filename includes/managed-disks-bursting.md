---
 title: include file
 description: include file
 services: virtual-machines
 author: albecker1
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/27/2020
 ms.author: albecker1
 ms.custom: include file
---
Azure offers the ability to boost disk storage IOPS and MB/s performance, this is referred to as bursting for both virtual machines (VM) and disks. You can effectively leverage VM and disk bursting to achieve better bursting performance on both your VMs and disk.

Bursting for Azure VMs and disk resources aren't dependent on each other. You don't need to have a burst-capable VM for an attached burst-capable disk to burst. Similarly, you don't need to have a burst-capable disk attached to your burst-capable VM for the VM to burst.