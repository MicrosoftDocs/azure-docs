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
On Azure, we offer the ability to boost disk storage IOPS and MB/s performance referred to as bursting on both Virtual Machines and disks. Bursting is useful in many scenarios, such as handling unexpected disk traffic or processing batch jobs. You can effectively leverage VM and disk level bursting to achieve great baseline and bursting performance on both your VM and disk. This way you can achieve great baseline performance and bursting performance on both your vm and disk. 

Please note that bursting on Disks and VMs are independent from one another. If you have a bursting disk, you do not need a bursting VM to allow your disk to burst. If you have a bursting VM, you do not need a bursting disk to allow your VM to burst. 
