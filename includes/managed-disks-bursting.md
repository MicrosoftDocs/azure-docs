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
# Disk bursting
The performance of Azure Disks is determined by both the performance target of the disk but also the performance target of the virtual machine it is attached to. Each VM has its own limits on the IOPS and MB/s it can drive to disk storage. Each disk attached to a virtual machine has its own performance characteristics as well. Now Azure offers the ability to boost disk storage IOPS and MB/s performance referred to as bursting on both Virtual Machines and Disks. Busting is useful in many scenarios, such as handling unexpected disk traffic or processing batch jobs. You can effectively leverage VM and disk level bursting to achieve great baseline and bursting performance on both your VM and disk. This way you can achieve great baseline performance and bursting performance on both your vm and disk.