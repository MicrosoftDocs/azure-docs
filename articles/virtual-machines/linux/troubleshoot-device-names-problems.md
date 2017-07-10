---
title: Linux VM Device Names are changed in Azure| Microsoft Docs
description: Explains the why Device names are changed, and provide solution for this problem.
services: virtual-machines-linux
documentationcenter: ''
author: genlin
manager: cshepard
editor: ''
tags: azure-resource-manager

ms.assetid: 3005a066-7a84-4dc5-bdaa-574c75e6e411
ms.service: virtual-machines-linux
ms.topic: article
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.devlang: azurecli
ms.date: 07/05/2017
ms.author: genli

---

# Troubleshooting: Linux VM device names are changed

The article explains why device names are changed after you restart a Linux virtual machine (VM), or reattach the disks. It also provides the solution for this problem.

## Symptom

You may experience the following problems when running Linux VMs in Microsoft Azure.

- Fail to boot after a restart.

- If data disks are detached and reattached, the devices names for disks are changed.

- An application or script referencing a disk by using device name fails. You find that the device name of disk is changed.

## Cause

The problem occurs because the device scanning in Linux is scheduled by the SCSI subsystem in Linux. Hnce it can happen asynchronously.  The final device path naming is essentially arbitrary.

## Solution

To address this issue, use persistent naming. There are four mechanisms to persistent naming - by filesystem label, by uuid, by id and by path. The filesystem label and UUID mechanisms are recommended for Azure Linux VM. For more information about how to configure a Linux VM to use a UUID when adding a data disk, see [Connect to the Linux VM to mount the new disk](add-disk.md#connect-to-the-linux-vm-to-mount-the-new-disk).

When the Azure Linux agent is installed on a VM, it uses Udev rules to construct a set of symbolic links under **/dev/disk/azure**. These Udev rules can be used by applications and scripts to identify disks are attached to the VM, their type, and the LUN.

## More information

### Discover filesystem UUIDs by using blkid

A script or application can read the output of blkid, or similar sources of information, and construct symbolic links under **/dev** for use. The output will show the UUIDs of all disks attached to the VM and the device file to which they are associated:

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

If there are additional partitions from the blkid list, they reside on a data disk. Applications can persist the UUID for these partitions and use a path like the below to discover the device name at runtime:

    $ ls -l /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692

    lrwxrwxrwx 1 root root 10 Jun 19 15:57 /dev/disk/by-uuid/b0048738-4ecc-4837-9793-49ce296d2692 -> ../../sdc1

    
## Get the latest Azure storage rules

To the latest Azure storage rules, run th following commands:

    # sudo curl -o /etc/udev/rules.d/66-azure-storage.rules https://raw.githubusercontent.com/Azure/WALinuxAgent/master/config/66-azure-storage.rules
    # sudo udevadm trigger --subsystem-match=block


### identify disk LUNs
Alternatively, an application could use LUNs for the purpose of finding all the attached disks and constructing symbolic links. The Azure Linux agent now comes with udev rules that set up symbolic links from LUN to the devices:

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
                                 

LUN information can also be retrieved from the Linux guest using lsscsi or similar tooling.

       sudo lsscsi

      \[1:0:0:0\] cd/dvd Msft Virtual CD/ROM 1.0 /dev/sr0

      \[2:0:0:0\] disk Msft Virtual Disk 1.0 /dev/sda

      \[3:0:1:0\] disk Msft Virtual Disk 1.0 /dev/sdb

      \[5:0:0:0\] disk Msft Virtual Disk 1.0 /dev/sdc

      \[5:0:0:1\] disk Msft Virtual Disk 1.0 /dev/sdd

This guest LUN information can be used with Azure subscription metadata to identify the location in Azure storage of the VHD which stores the partition data. For example, using the az cli:

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


For more information, see the following articles:

- [Ubuntu: Using UUID](https://help.ubuntu.com/community/UsingUUID)

- [Red Hat: Storage Administration Guide](https://access.redhat.com/documentation/en-US/Red_Hat_Enterprise_Linux/7/html/Storage_Administration_Guide/persistent_naming.htm)

- [Linux: What UUIDs can do for you](https://www.linux.com/news/what-uuids-can-do-you)

- [Udev: Introduction to Device Management In Modern Linux System](https://www.linux.com/news/udev-introduction-device-management-modern-linux-system)

