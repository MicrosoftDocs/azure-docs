---
title: Disk metrics
description: Examples of disk bursting metrics
author: roygara
ms.service: virtual-machines
ms.topic: conceptual
ms.date: 01/27/2021
ms.author: rogarana
ms.subservice: disks
---

# Disk bursting metric examples

The following examples show how bursting works with various virtual machine and disk combinations. To make the examples easy to follow, we will focus on MB/s, but the same logic is applied independently to IOPS.


### Non-burstable virtual machine with burstable Disks
**VM and disk combination:** 
- Standard_D8as_v4 
    - Uncached MB/s: 192
- P4 OS Disk
    - Provisioned MB/s: 25
    - Max burst MB/s: 170 
- 2 P10 Data Disks 
    - Provisioned MB/s: 100
    - Max burst MB/s: 170

 When the VM boots up it will retrieve data from the OS disk. Since the OS disk is part of a VM that is getting started, the OS disk will be full of bursting credits. These credits will allow the OS disk burst its startup at 170 MB/s second as seen below:

![Non-bursting vm bursting disk startup](media/disks-metrics/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-startup.jpg)

After the boot up is complete, an application is then run on the VM and has a non-critical workload. This workload requires 15 MB/S that gets spread evenly across all the disks:

![Non-bursting vm bursting disk idle](media/disks-metrics/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-idling.jpg)

Then the application needs to process a batched job that requires 192 MB/s. 2 MB/s are used by the OS Disk and the rest are evenly split between the data disks:

![Non-bursting vm bursting disk bursting](media/disks-metrics/nonbursting-vm-busting-disk/nonbusting-vm-bursting-disk-bursting.jpg)

### Burstable virtual machine with non-burstable disks
**VM and disk combination:** 
- Standard_L8s_v2 
    - Uncached MB/s: 160
    - Max burst MB/s: 1,280
- P50 OS Disk
    - Provisioned MB/s: 250 
- 2 P10 Data Disks 
    - Provisioned MB/s: 250

 After the initial boot up, an application is run on the VM and has a non-critical workload. This workload requires 30 MB/s that gets spread evenly across all the disks:
![Bursting vm non-bursting disk idle](media/disks-metrics/bursting-vm-nonbursting-disk/burst-vm-nonbursting-disk-normal.jpg)

Then the application needs to process a batched job that requires 600 MB/s. The Standard_L8s_v2 bursts to meet this demand and then requests to the disks get evenly spread out to P50 disks:

![Bursting vm non-bursting disk bursting](media/disks-metrics/bursting-vm-nonbursting-disk/burst-vm-nonbursting-disk-bursting.jpg)
### Burstable virtual machine with burstable Disks
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

When the VM boots up, it will burst to request its burst limit of 1,280 MB/s from the OS disk and the OS disk will respond with its burst performance of 170 MB/s:

![Bursting vm bursting disk startup](media/disks-metrics/bursting-vm-bursting-disk/burst-vm-burst-disk-startup.jpg)

Then after the boot up is complete, an application is then run on the VM. The application has a non-critical workload that requires 15 MB/s that gets spread evenly across all the disks:

![Bursting vm bursting disk idle](media/disks-metrics/bursting-vm-bursting-disk/burst-vm-burst-disk-idling.jpg)

Then the application needs to process a batched job that requires 360 MB/s. The Standard_L8s_v2 bursts to meet this demand and then requests. Only 20 MB/s are needed by the OS disk. The remaining 340 MB/s are handled by the bursting P4 data disks:  

![Bursting vm bursting disk bursting](media/disks-metrics/bursting-vm-bursting-disk/burst-vm-burst-disk-bursting.jpg)