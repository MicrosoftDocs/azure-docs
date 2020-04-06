---
 title: include file
 description: include file
 services: virtual-machines
 author: roygara
 ms.service: virtual-machines
 ms.topic: include
 ms.date: 04/06/2020
 ms.author: rogarana
 ms.custom: include file
---

Because ultra disks have the unique capability of allowing you to set your performance, it exposes modifiable attributes you can use to adjust performance.

By default, there are only two modifiable attributes but, ultra disks that are being shared have two additional attributes.


|Attribute  |Description  |
|---------|---------|
|DiskIOPSReadWrite     |The total number of IOPS allowed across all VMs mounting the share disk with write access.         |
|DiskMBpsReadWrite     |The total throughput (MB/s) allowed across all VMs mounting the shared disk with write access.         |
|DiskIOPSReadOnly     |The total number of IOPS allowed across all VMs mounting the shared disk as ReadOnly.         |
|DiskMBpsReadOnly     |The total throughput (MB/s) allowed across all VMs mounting the shared disk as ReadOnly.         |

Because these performance attributes are user modifiable, here are some formulas that explain them:

- DiskIOPSReadWrite/DiskIOPSReadOnly: 
    - IOPS limits of 300 IOPS/GiB, up to a maximum of 160K IOPS per disk
    - Minimum of 100 IOPS
    - DiskIOPSReadWrite  + DiskIOPSReadOnly is at least 2 IOPS/GiB
- DiskMBpsRead    Write/DiskMBpsReadOnly:
    - The throughput limit of a single disk is 256 KiB/s for each provisioned IOPS, up to a maximum of 2000 MBps per disk
    - The minimum guaranteed throughput per disk is 4KiB/s for each provisioned IOPS, with an overall baseline minimum of 1 MBps
