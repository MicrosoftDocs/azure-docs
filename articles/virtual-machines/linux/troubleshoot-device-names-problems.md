---
title: Linux VM device names are changed in Azure| Microsoft Docs
description: Explains the why device names are changed, and provide solution for this problem.
services: virtual-machines-linux
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.topic: troubleshooting
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.date: 07/12/2017
ms.author: genli

---

# Troubleshooting: Linux VM device names are changed

The article explains why device names are changed after you restart a Linux virtual machine (VM), or reattach the disks. It also provides the solution for this problem.

## Symptom

You may experience the following problems when running Linux VMs in Microsoft Azure.

- The VM fails to boot after a restart.

- If data disks are detached and reattached, the devices names for disks are changed.

- An application or script that references a disk by using device name fails. You find that the device name of the disk is changed.

## Cause

Device paths in Linux are not guaranteed to be consistent across restarts. Device names consist of major (letter) and minor numbers.  When the Linux storage device driver detects a new device, it assigns major and minor device numbers to it from the available range. When a device is removed, the device numbers are freed to be reused later.

The problem occurs because the device scanning in Linux scheduled by the SCSI subsystem happens asynchronously. The final device path naming may vary across restarts. 

## Solution

To resolve this problem, use persistent naming. There are four methods to persistent naming - by filesystem label, by uuid, by id and by path. We recommend the filesystem label and UUID methods for Azure Linux VMs. 

Most distributions also provide either the **nofail** or **nobootwait** fstab options. These options enable a system to boot even if the disk fails to mount at startup. Check the distribution's documentation for more information about these parameters. For more information about how to configure a Linux VM to use a UUID when you add a data disk, see [Connect to the Linux VM to mount the new disk](add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk). 

When the Azure Linux agent is installed on a VM, it uses Udev rules to construct a set of symbolic links under **/dev/disk/azure**. These Udev rules can be used by applications and scripts to identify disks are attached to the VM, their type, and the LUN.

## More information

### Identify disk LUNs

An application can use LUNs to find all the attached disks and constructing symbolic links. The Azure Linux agent now includes udev rules that set up symbolic links from a LUN to the devices, as follows:

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
                                 

LUN information can also be retrieved from the Linux guest using lsscsi or similar tool as follows.

       $ sudo lsscsi

      [1:0:0:0] cd/dvd Msft Virtual CD/ROM 1.0 /dev/sr0

      [2:0:0:0] disk Msft Virtual Disk 1.0 /dev/sda

      [3:0:1:0] disk Msft Virtual Disk 1.0 /dev/sdb

      [5:0:0:0] disk Msft Virtual Disk 1.0 /dev/sdc

      [5:0:0:1] disk Msft Virtual Disk 1.0 /dev/sdd

This guest LUN information can be used with Azure subscription metadata to identify the location in Azure storage of the VHD which stores the partition data. For example, use the az cli:

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

A script or application can read the output of blkid, or similar sources of information, and construct symbolic links in **/dev** for use. The output will show the UUIDs of all disks attached to the VM and the device file to which they are associated:

    $ sudo blkid -s UUID

    /dev/sr0: UUID="120B021372645f72"
    /dev/sda1: UUID="52c6959b-79b0-4bdd-8ed6-71e0ba782fb4"
    /dev/sdb1: UUID="176250df-9c7c-436f-94e4-d13f9bdea744"
    /dev/sdc1: UUID="b0048738-4ecc-4837-9793-49ce296d2692"

The waagent udev rules construct a set of symbolic links under **/dev/disk/azure**:


    $ ls -l /dev/disk/azure

    total 0
    lrwxrwxrwx 1 root root  9 Jun  2 23:17 resource -> ../../sdb
    lrwxrwxrwx 1 root root 10 Jun  2 23:17 resource-part1 -> ../../sdb1
    lrwxrwxrwx 1 root root  9 Jun  2 23:17 root -> ../../sda
    lrwxrwxrwx 1 root root 10 Jun  2 23:17 root-part1 -> ../../sda1


The application can use this information identify the boot disk device and the resource (ephemeral) disk. In Azure, applications should refer to **/dev/disk/azure/root-part1** or **/dev/disk/azure-resource-part1** to discover these partitions.

If there are additional partitions from the blkid list, they reside on a data disk. Applications can maintain the UUID for these partitions and use a path like the below to discover the device name at runtime:

    $ ls -l /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692

    lrwxrwxrwx 1 root root 10 Jun 19 15:57 /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692 -> ../../sdc1

    
### Get the latest Azure storage rules

To the latest Azure storage rules, run th following commands:

    # sudo curl -o /etc/udev/rules.d/66-azure-storage.rules https://raw.githubusercontent.com/Azure/WALinuxAgent/master/config/66-azure-storage.rules
    # sudo udevadm trigger --subsystem-match=block


For more information, see the following articles:

- [Ubuntu: Using UUID](https://help.ubuntu.com/community/UsingUUID)

- [Red Hat: Persistent Naming](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Storage_Administration_Guide/persistent_naming.html)

- [Linux: What UUIDs can do for you](https://www.linux.com/news/what-uuids-can-do-you)

- [Udev: Introduction to Device Management In Modern Linux System](https://www.linux.com/news/udev-introduction-device-management-modern-linux-system)

