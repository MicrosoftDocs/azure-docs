---
title: Troubleshoot Linux VM device name changes in Azure | Microsoft Docs
description: Explains why Linux VM device names change and how to solve the problem.
services: virtual-machines-linux
documentationcenter: ''
author: genlin
manager: jeconnoc
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.date: 05/11/2018
ms.author: genli

---

# Troubleshoot Linux VM device name changes

This article explains why device names change after you restart a Linux VM or reattach the data disks. The article also provides solutions for this problem.

## Symptoms
You may experience the following problems when running Linux VMs in Microsoft Azure:

- The VM fails to boot after a restart.
- When data disks are detached and reattached, the disk device names are changed.
- An application or script that references a disk by using the device name fails because the device name has changed.

## Cause

Device paths in Linux aren't guaranteed to be consistent across restarts. Device names consist of major numbers (letters) and minor numbers. When the Linux storage device driver detects a new device, the driver assigns major and minor numbers from the available range to the device. When a device is removed, the device numbers are freed for reuse.

The problem occurs because device scanning in Linux is scheduled by the SCSI subsystem to happen asynchronously. As a result, a device path name can vary across restarts. 

## Solution

To resolve this problem, use persistent naming. There are four ways to use persistent naming: by filesystem label, by UUID, by ID, or by path. We recommend using the filesystem label or UUID for Azure Linux VMs. 

Most distributions provide the `fstab` **nofail** or **nobootwait** parameters. These parameters enable a system to boot when the disk fails to mount at startup. Check your distribution documentation for more information about these parameters. For information on how to configure a Linux VM to use a UUID when you add a data disk, see [Connect to the Linux VM to mount the new disk](../linux/add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk). 

When the Azure Linux agent is installed on a VM, the agent uses Udev rules to construct a set of symbolic links under the /dev/disk/azure path. Applications and scripts use Udev rules to identify disks that are attached to the VM, along with the disk type and disk LUNs.

### Identify disk LUNs

Applications use LUNs to find all of the attached disks and to construct symbolic links. The Azure Linux agent includes Udev rules that set up symbolic links from a LUN to the devices:

    $ tree /dev/disk/azure

    /dev/disk/azure
    ├── resource -> ../../sdb
    ├── resource-part1 -> ../../sdb1
    ├── root -> ../../sda
    ├── root-part1 -> ../../sda1
    └── scsi1
        ├── lun0 -> ../../../sdc
        ├── lun0-part1 -> ../../../sdc1
        ├── lun1 -> ../../../sdd
        ├── lun1-part1 -> ../../../sdd1
        ├── lun1-part2 -> ../../../sdd2
        └── lun1-part3 -> ../../../sdd3                                    
                                 
LUN information from the Linux guest account is retrieved by using `lsscsi` or a similar tool:

       $ sudo lsscsi

      [1:0:0:0] cd/dvd Msft Virtual CD/ROM 1.0 /dev/sr0

      [2:0:0:0] disk Msft Virtual Disk 1.0 /dev/sda

      [3:0:1:0] disk Msft Virtual Disk 1.0 /dev/sdb

      [5:0:0:0] disk Msft Virtual Disk 1.0 /dev/sdc

      [5:0:0:1] disk Msft Virtual Disk 1.0 /dev/sdd

The guest LUN information is used with Azure subscription metadata to locate the VHD in Azure Storage that contains the partition data. For example, you can use the `az` CLI:

    $ az vm show --resource-group testVM --name testVM | jq -r .storageProfile.dataDisks                                        
    [                                                                                                                                                                  
    {                                                                                                                                                                  
    "caching": "None",                                                                                                                                              
      "createOption": "empty",                                                                                                                                         
    "diskSizeGb": 1023,                                                                                                                                             
      "image": null,                                                                                                                                                   
    "lun": 0,                                                                                                                                                        
    "managedDisk": null,                                                                                                                                             
    "name": "testVM-20170619-114353",                                                                                                                    
    "vhd": {                                                                                                                                                          
      "uri": "https://testVM.blob.core.windows.net/vhd/testVM-20170619-114353.vhd"                                                       
    }                                                                                                                                                              
    },                                                                                                                                                                
    {                                                                                                                                                                   
    "caching": "None",                                                                                                                                               
    "createOption": "empty",                                                                                                                                         
    "diskSizeGb": 512,                                                                                                                                              
    "image": null,                                                                                                                                                   
    "lun": 1,                                                                                                                                                        
    "managedDisk": null,                                                                                                                                             
    "name": "testVM-20170619-121516",                                                                                                                    
    "vhd": {                                                                                                                                                           
      "uri": "https://testVM.blob.core.windows.net/vhd/testVM-20170619-121516.vhd"                                                       
      }                                                                                                                                                            
      }                                                                                                                                                             
    ]

### Discover filesystem UUIDs by using blkid

Applications and scripts read the output of `blkid`, or similar sources of information, to construct symbolic links in the /dev path. The output shows the UUIDs of all disks that are attached to the VM and their associated device file:

    $ sudo blkid -s UUID

    /dev/sr0: UUID="120B021372645f72"
    /dev/sda1: UUID="52c6959b-79b0-4bdd-8ed6-71e0ba782fb4"
    /dev/sdb1: UUID="176250df-9c7c-436f-94e4-d13f9bdea744"
    /dev/sdc1: UUID="b0048738-4ecc-4837-9793-49ce296d2692"

The Azure Linux agent Udev rules construct a set of symbolic links under the /dev/disk/azure path:

    $ ls -l /dev/disk/azure

    total 0
    lrwxrwxrwx 1 root root  9 Jun  2 23:17 resource -> ../../sdb
    lrwxrwxrwx 1 root root 10 Jun  2 23:17 resource-part1 -> ../../sdb1
    lrwxrwxrwx 1 root root  9 Jun  2 23:17 root -> ../../sda
    lrwxrwxrwx 1 root root 10 Jun  2 23:17 root-part1 -> ../../sda1

Applications use the links to identify the boot disk device and the resource (ephemeral) disk. In Azure, applications should look in the /dev/disk/azure/root-part1 or /dev/disk/azure-resource-part1 paths to discover these partitions.

Any additional partitions from the `blkid` list reside on a data disk. Applications maintain the UUID for these partitions and use a path to discover the device name at runtime:

    $ ls -l /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692

    lrwxrwxrwx 1 root root 10 Jun 19 15:57 /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692 -> ../../sdc1

    
### Get the latest Azure Storage rules

To get the latest Azure Storage rules, run the following commands:

    # sudo curl -o /etc/udev/rules.d/66-azure-storage.rules https://raw.githubusercontent.com/Azure/WALinuxAgent/master/config/66-azure-storage.rules
    # sudo udevadm trigger --subsystem-match=block

## See also

For more information, see the following articles:

- [Ubuntu: Using UUID](https://help.ubuntu.com/community/UsingUUID)
- [Red Hat: Persistent naming](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Storage_Administration_Guide/persistent_naming.html)
- [Linux: What UUIDs can do for you](https://www.linux.com/news/what-uuids-can-do-you)
- [Udev: Introduction to device management in a modern Linux system](https://www.linux.com/news/udev-introduction-device-management-modern-linux-system)

