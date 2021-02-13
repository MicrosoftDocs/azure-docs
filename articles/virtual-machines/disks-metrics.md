---
title: Disk metrics
description: Examples of disk bursting metrics
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 02/12/2021
ms.author: rogarana
ms.subservice: disks
---

# Disk bursting metric examples

The following examples show how bursting works with various VM and disk combinations. To make the examples easy to follow, we will focus on MB/s, but the same logic is applied independently to IOPS.

### Non-burstable virtual machine with burstable disks
**VM and disk combination:** 
- Standard_D8as_v4 
    - Uncached MB/s: 192
- P4 OS Disk
    - Provisioned MB/s: 25
    - Max burst MB/s: 170 
- 2 P10 Data Disks 
    - Provisioned MB/s: 100
    - Max burst MB/s: 170

 When the VM boots up it retrieves data from the OS disk. Since the OS disk is part of a VM that is booting, the OS disk will be full of bursting credits. These credits will allow the OS disk burst its startup at 170 MB/s second.

![VM sends a request for 192 MB/s of throughput to OS disk, OS disk responds with 170 MB/s data.](media/managed-disks-bursting/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-startup.jpg)

After the boot up is complete, an application is then run on the VM and has a non-critical workload. This workload requires 15 MB/S that gets spread evenly across all the disks.

![Application sends request for 15 MB/s of throughput to VM, VM takes request and sends each of its disks a request for 5 MB/s, each disk returns 5 MB/s, VM returns 15 MB/s to application.](media/managed-disks-bursting/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-idling.jpg)

Then the application needs to process a batched job that requires 192 MB/s. 2 MB/s are used by the OS disk and the rest are evenly split between the data disks.

![Application sends request for 192 MB/s of throughput to VM, VM takes request and sends the bulk of its request to the data disks (95 MB/s each) and 2 MB/s to the OS disk, the data disks burst to meet the demand and all disks return the requested throughput to the VM, which returns it to the application.](media/managed-disks-bursting/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-bursting.jpg)

### Burstable virtual machine with non-burstable disks
**VM and disk combination:** 
- Standard_L8s_v2 
    - Uncached MB/s: 160
    - Max burst MB/s: 1,280
- P50 OS Disk
    - Provisioned MB/s: 250 
- 2 P10 Data Disks 
    - Provisioned MB/s: 250

 After the initial boot up, an application is run on the VM and has a non-critical workload. This workload requires 30 MB/s that gets spread evenly across all the disks.
![Application sends request for 30 MB/s of throughput to VM, VM takes request and sends each of its disks a request for 10 MB/s, each disk returns 10 MB/s, VM returns 30 MB/s to application.](media/managed-disks-bursting/bursting-vm-nonbursting-disk/burst-vm-nonbursting-disk-normal.jpg)

Then the application needs to process a batched job that requires 600 MB/s. The Standard_L8s_v2 bursts to meet this demand and then requests to the disks get evenly spread out to P50 disks.

![Application sends request for 600 MB/s of throughput to VM, VM takes bursts to take the request and sends each of its disks a request for 200 MB/s, each disk returns 200 MB/s, VM bursts to return 600 MB/s to application.](media/managed-disks-bursting/bursting-vm-nonbursting-disk/burst-vm-nonbursting-disk-bursting.jpg)
### Burstable virtual machine with burstable disks
**VM and disk combination:** 
- Standard_L8s_v2 
    - Uncached MB/s: 160
    - Max burst MB/s: 1,280
- P4 OS Disk
    - Provisioned MB/s: 25
    - Max burst MB/s: 170 
- 2 P4 Data Disks 
    - Provisioned MB/s: 25
    - Max burst MB/s: 170 

When the VM starts, it will burst to request its burst limit of 1,280 MB/s from the OS disk and the OS disk will respond with its burst performance of 170 MB/s.

![At startup, the VM bursts to send a request of 1,280 MB/s to the OS disk, OS disk bursts to return the 1,280 MB/s.](media/managed-disks-bursting/bursting-vm-bursting-disk/burst-vm-burst-disk-startup.jpg)

After startup, you start an application that has a non-critical workload. This application requires 15 MB/s that gets spread evenly across all the disks.

![Application sends request for 15 MB/s of throughput to VM, VM takes request and sends each of its disks a request for 5 MB/s, each disk returns 5 MB/s, VM returns 15 MB/s to application.](media/managed-disks-bursting/bursting-vm-bursting-disk/burst-vm-burst-disk-idling.jpg)

Then the application needs to process a batched job that requires 360 MB/s. The Standard_L8s_v2 bursts to meet this demand and then requests. Only 20 MB/s are needed by the OS disk. The remaining 340 MB/s are handled by the bursting P4 data disks.

![Application sends request for 360 MB/s of throughput to VM, VM takes bursts to take the request and sends each of its data disks a request for 170 MB/s and 20 MB/s from the OS disk, each disk returns the requested MB/s, VM bursts to return 360 MB/s to application.](media/managed-disks-bursting/bursting-vm-bursting-disk/burst-vm-burst-disk-bursting.jpg)