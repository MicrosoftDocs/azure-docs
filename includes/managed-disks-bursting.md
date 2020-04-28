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
The performance of Azure Disks is determined by both the performance target of the disk but also the performance target of the virtual machine it is attached to. Each VM has its own limits on the IOPS and MB/s it can drive to disk storage, and each disk attached to a virtual machine has its own performance characteristics as well. Now Azure offers the ability to boost disk storage IOPS and MB/s performance referred to as bursting on both Virtual Machines and Disks. Bursting is great for a wide range of scenarios like handling unforeseen spiky disk traffic smoothly or processing batched jobs with speed. Since there are disk IO limits on both the virtual machine level and the disk level, you get the best experience using bursting products together. This way you can achieve great baseline performance and bursting performance without the need to over provision your virtual machine or disk for the peak performance. Virtual machine level bursting is independent from disk level bursting and you do not need to use both products to get bursting performance, however, it is recommended that you use both together. 