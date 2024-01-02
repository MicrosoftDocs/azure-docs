---
title: Linux NFS read-ahead best practices for Azure NetApp Files - Session slots and slot table entries | Microsoft Docs
description: Describes filesystem cache and Linux NFS read-ahead best practices for Azure NetApp Files.  
services: azure-netapp-files
documentationcenter: ''
author: b-hchen
manager: ''
editor: ''

ms.assetid:
ms.service: azure-netapp-files
ms.workload: storage
ms.tgt_pltfrm: na
ms.custom: devx-track-linux
ms.topic: conceptual
ms.date: 09/29/2022
ms.author: anfdocs
---
# Linux NFS read-ahead best practices for Azure NetApp Files

This article helps you understand filesystem cache best practices for Azure NetApp Files.  

NFS read-ahead predictively requests blocks from a file in advance of I/O requests by the application. It is designed to improve client sequential read throughput.  Until recently, all modern Linux distributions set the read-ahead value to be equivalent of 15 times the mounted filesystems `rsize`.  

The following table shows the default read-ahead values for each given `rsize` mount option.

| Mounted filesystem `rsize` | Blocks read-ahead |
|-|-|
| 64 KiB | 960 KiB |
| 256 KiB | 3,840 KiB |
| 1024 KiB | 15,360 KiB |

RHEL 8.3 and Ubuntu 18.04 introduced changes that might negatively impact client sequential read performance.  Unlike earlier releases, these distributions set read-ahead to a default of 128 KiB regardless of the `rsize` mount option used. Upgrading from releases with the larger read-ahead value to those with the 128-KiB default experienced decreases in sequential read performance. However, read-ahead values may be tuned upward both dynamically and persistently.  For example, testing with SAS GRID  found the 15,360-KiB read value optimal compared to 3,840 KiB, 960 KiB, and 128 KiB.  Not enough tests have been run beyond 15,360 KiB to determine positive or negative impact.

The following table shows the default read-ahead values for each currently available distribution.

|     Distribution    |     Release    |     Blocks   read-ahead    |
|-|-|-|
|     RHEL    |     8.3    |     128 KiB    |
|     RHEL    |     7.X, 8.0, 8.1, 8.2    |     15 X `rsize`    |
|     SLES    |     12.X – at   least 15SP2    |     15 X `rsize`    |
|     Ubuntu    |     18.04 – at least 20.04    |     128 KiB    |
|     Ubuntu    |     16.04    |     15 X `rsize`    |
|     Debian    |     Up to at least 10    |     15 x `rsize`    |


## How to work with per-NFS filesystem read-ahead   

NFS read-ahead is defined at the mount point for an NFS filesystem. The default setting can be viewed and set both dynamically and persistently.  For convenience, the following bash script written by Red Hat has been provided for viewing or dynamically setting read-ahead for amounted NFS filesystem.

Read-ahead can be defined either dynamically per NFS mount using the following script or persistently using `udev` rules as shown in this section.  To display or set read-ahead for a mounted NFS filesystem, you can save the following script as a bash file, modify the file’s permissions to make it an executable (`chmod 544 readahead.sh`), and run as shown. 

## How to show or set read-ahead values   

To show the current read-ahead value (the returned value is in KiB), run the following command:  

```bash
   ./readahead.sh show <mount-point>
```

To set a new value for read-ahead, run the following command:   

```bash
./readahead.sh set <mount-point> [read-ahead-kb]
```
 
### Example   

```bash
#!/bin/bash
# set | show readahead for a specific mount point
# Useful for things like NFS and if you do not know / care about the backing device
#
# To the extent possible under law, Red Hat, Inc. has dedicated all copyright
# to this software to the public domain worldwide, pursuant to the
# CC0 Public Domain Dedication. This software is distributed without any warranty.
# For more information, see the [CC0 1.0 Public Domain Dedication](http://creativecommons.org/publicdomain/zero/1.0/).

E_BADARGS=22
function myusage() {
echo "Usage: `basename $0` set|show <mount-point> [read-ahead-kb]"
}

if [ $# -gt 3 -o $# -lt 2 ]; then
   myusage
   exit $E_BADARGS
fi

MNT=${2%/}
BDEV=$(grep $MNT /proc/self/mountinfo | awk '{ print $3 }')

if [ $# -eq 3 -a $1 == "set" ]; then
   echo $3 > /sys/class/bdi/$BDEV/read_ahead_kb
elif [ $# -eq 2 -a $1 == "show" ]; then
   echo "$MNT $BDEV /sys/class/bdi/$BDEV/read_ahead_kb = "$(cat /sys/class/bdi/$BDEV/read_ahead_kb)
else
   myusage
   exit $E_BADARGS
fi
```

## How to persistently set read-ahead for NFS mounts

To persistently set read-ahead for NFS mounts, `udev` rules can be written as follows:    

1. Create and test `/etc/udev/rules.d/99-nfs.rules`:

    ```config
       SUBSYSTEM=="bdi", ACTION=="add", PROGRAM="<absolute_path>/awk -v bdi=$kernel 'BEGIN{ret=1} {if ($4 == bdi) {ret=0}} END{exit ret}' /proc/fs/nfsfs/volumes", ATTR{read_ahead_kb}="15380"
   ```

2. Apply the `udev` rule:   

    ```bash
       sudo udevadm control --reload
    ```

## Next steps  

* [Linux direct I/O best practices for Azure NetApp Files](performance-linux-direct-io.md)
* [Linux filesystem cache best practices for Azure NetApp Files](performance-linux-filesystem-cache.md)
* [Linux NFS mount options best practices for Azure NetApp Files](performance-linux-mount-options.md)
* [Linux concurrency best practices](performance-linux-concurrency-session-slots.md)
* [Azure virtual machine SKUs best practices](performance-virtual-machine-sku.md) 
* [Performance benchmarks for Linux](performance-benchmarks-linux.md) 
