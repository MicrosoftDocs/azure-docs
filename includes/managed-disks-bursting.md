---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 10/24/2019
 ms.author: rogarana
 ms.custom: include file
---

Premium SSDs support bursting on any disk sizes <= 512 GiB (P20 or below). These disk sizes support bursting on a best effort basis and utilize a credit system to manage bursting. Credits accumulate in a burst bucket whenever disk traffic is below the provisioned performance target for their disk size, and consume credits when traffic bursts beyond the target. Disk traffic is tracked against both IOPS and bandwidth in the provisioned target.

Disk bursting is enabled by default on new deployments of the disk sizes that support it. Existing disk sizes, if they support disk bursting, can enable bursting through either of the following methods:

- Detach and reattach the disk.
- Stop and start the VM.

## Burst states

All burst applicable disk sizes will start with a full burst credit bucket when the disk is attached to a Virtual Machine. The max duration of bursting is determined by the size of the burst credit bucket. You can only accumulate unused credits up to the size of the credit bucket. At any point of time, your disk burst credit bucket can be in one of the following three states: 

- Accruing, when the disk traffic is using less than the provisioned performance target. You can accumulate credit if disk traffic is beyond IOPS or bandwidth targets or both. You can still accumulate IO credits when you are consuming full disk bandwidth, vice versa.  

- Declining, when the disk traffic is using more than the provisioned performance target. The burst traffic will independently consume credits from IOPS or bandwidth. 

- Remaining constant, when the disk traffic is exactly at the provisioned performance target. 

The disk sizes that provide bursting support along with the burst specifications are summarized in the table below.

## Regional availability

Currently, disk bursting is only available in the West Central US region.

## Disk sizes

[!INCLUDE [disk-storage-premium-ssd-sizes](disk-storage-premium-ssd-sizes.md)]

## Example scenarios

To give you a better idea of how this works, here's a few example scenarios:

- One common scenario that can benefit from disk bursting is faster VM boot and application launch on OS disks. Take a Linux VM with an 8 GiB OS image as an example. If we use a P2 disk as the OS disk, the provisioned target is 120 IOPS and 25 MBps. When VM starts, there will be a read spike to the OS disk loading the boot files. With the introduction of bursting, you can read at the max burst speed of 3500 IOPS and 170 MBps, accelerating the load time by at least 6x. After VM boot, the traffic level on the OS disk is usually low, since most data operations by the application will be against the attached data disks. If the traffic is below the provisioned target, you will accumulate credits.

- If you are hosting a Remote Virtual Desktop environment, whenever an active user launches an application like AutoCAD, read traffic to the OS disk significantly increases. In this case, burst traffic will consume accumulated credits, allowing you to go beyond the provisioned target, and launching the application much faster.

- A P1 disk has a provisioned target of 120 IOPS and 25 MBps. If the actual traffic on the disk was 100 IOPS and 20 MBps in the past 1 second interval, then the unused 20 IOs and 5 MB are credited to the burst bucket of the disk. Credits in the burst bucket can later be used when the traffic exceeds the provisioned target, up to the max burst limit. The max burst limit defines the ceiling of disk traffic even if you have burst credits to consume from. In this case, even if you have 10,000 IOs in the credit bucket, a P1 disk cannot issue more than the max burst of 3,500 IO per sec.  
