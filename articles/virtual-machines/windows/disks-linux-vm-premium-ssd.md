---
title: Set up Linux VM using premium SSDs
description: Learn about high-performance Premium Storage and managed disks for Azure VMs. Azure DS-series, DSv2-series, GS-series, and Fs-series VMs support Premium Storage.
services: "virtual-machines-windows,storage"
author: ramankumarlive
ms.service: virtual-machines-windows
ms.topic: article
ms.date: 02/01/2019
ms.author: ramankum
ms.subservice: disks
---

## Premium Storage for Linux VMs
You can use the following information to help you set up your Linux VMs in Premium Storage:

To achieve scalability targets in Premium Storage, for all premium storage disks with cache set to **ReadOnly** or **None**, you must disable "barriers" when you mount the file system. You don't need barriers in this scenario because the writes to premium storage disks are durable for these cache settings. When the write request successfully finishes, data has been written to the persistent store. To disable "barriers," use one of the following methods. Choose the one for your file system:
  
* For **reiserFS**, to disable barriers, use the  `barrier=none` mount option. (To enable barriers, use `barrier=flush`.)
* For **ext3/ext4**, to disable barriers, use the `barrier=0` mount option. (To enable barriers, use `barrier=1`.)
* For **XFS**, to disable barriers, use the `nobarrier` mount option. (To enable barriers, use `barrier`.)
* For premium storage disks with cache set to **ReadWrite**, enable barriers for write durability.
* For volume labels to persist after you restart the VM, you must update /etc/fstab with the universally unique identifier (UUID) references to the disks. For more information, see [Add a managed disk to a Linux VM](../articles/virtual-machines/linux/add-disk.md).

The following Linux distributions have been validated for Azure Premium Storage. For better performance and stability with Premium Storage, we recommend that you upgrade your VMs to one of these versions, at a minimum (or to a later version). Some of the versions require the latest Linux Integration Services (LIS), v4.0, for Azure. To download and install a distribution, follow the link listed in the following table. We add images to the list as we complete validation. Note that our validations show that performance varies for each image. Performance depends on workload characteristics and your image settings. Different images are tuned for different kinds of workloads.

| Distribution | Version | Supported kernel | Details |
| --- | --- | --- | --- |
| Ubuntu | 12.04 | 3.2.0-75.110+ | Ubuntu-12_04_5-LTS-amd64-server-20150119-en-us-30GB |
| Ubuntu | 14.04 | 3.13.0-44.73+ | Ubuntu-14_04_1-LTS-amd64-server-20150123-en-us-30GB |
| Debian | 7.x, 8.x | 3.16.7-ckt4-1+ | &nbsp; |
| SUSE | SLES 12| 3.12.36-38.1+| suse-sles-12-priority-v20150213 <br> suse-sles-12-v20150213 |
| SUSE | SLES 11 SP4 | 3.0.101-0.63.1+ | &nbsp; |
| CoreOS | 584.0.0+| 3.18.4+ | CoreOS 584.0.0 |
| CentOS | 6.5, 6.6, 6.7, 7.0 | &nbsp; | [LIS4 required](https://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note in the next section* |
| CentOS | 7.1+ | 3.10.0-229.1.2.el7+ | [LIS4 recommended](https://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) <br> *See note in the next section* |
| Red Hat Enterprise Linux (RHEL) | 6.8+, 7.2+ | &nbsp; | &nbsp; |
| Oracle | 6.0+, 7.2+ | &nbsp; | UEK4 or RHCK |
| Oracle | 7.0-7.1 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](https://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |
| Oracle | 6.4-6.7 | &nbsp; | UEK4 or RHCK w/[LIS 4.1+](https://go.microsoft.com/fwlink/?LinkID=403033&clcid=0x409) |


### LIS drivers for OpenLogic CentOS

If you are running OpenLogic CentOS VMs, run the following command to install the latest drivers:

```
sudo rpm -e hypervkvpd  ## (Might return an error if not installed. That's OK.)
sudo yum install microsoft-hyper-v
```

To activate the new drivers, restart the VM.