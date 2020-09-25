---
title: How to resize encrypted logical volume management disks with Azure Disk Encryption
description: This article provides instructions for resizing ADE encrypted disks using logical volume management
author: jofrance
ms.service: security
ms.topic: article
ms.author: jofrance
ms.date: 09/21/2020
---

# How to resize logical volume management devices encrypted with Azure Disk Encryption

This article is a step-by-step process on how to resize ADE encrypted data disks using Logical Volume Management (LVM) on Linux, applicable to multiple scenarios.

The process applies to the following environments:

- Linux distributions
    - RHEL 7+
    - Ubuntu 16+
    - SUSE 12+
- Azure Disk Encryption single-pass extension
- Azure Disk Encryption dual-pass extension

## Considerations

This document assumes that:

1. There's an existing LVM configuration.
   
   Check [Configure LVM on a Linux VM](configure-lvm.md) for more information about configuring LVM on a Linux VM.

2. The disks are already encrypted using Azure Disk Encryption
   Check [Configure LVM on crypt](how-to-configure-lvm-raid-on-crypt.md) for information on how to configure LVM-on-Crypt.

3. You have the required Linux and LVM expertise to follow these examples.

4. You understand that the recommendation to use data disks on Azure as mentioned on [troubleshoot device names problems](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/troubleshoot-device-names-problems), is to use the /dev/disk/scsi1/ paths.

## Scenarios

The procedures in this article apply to the following scenarios:

### For traditional LVM and LVM-On-Crypt configurations

- Extending a logical volume when there's available space in the VG

### For traditional LVM encryption (the logical volumes are encrypted, not the whole disk)

- Extending a traditional LVM volume adding a new PV
- Extending a traditional LVM volume resizing an existing PV

### For LVM-on-crypt (recommended method, the entire disk is encrypted, not only the logical volume)

- Extending an LVM on crypt volume adding a new PV
- Extending an LVM on crypt volume resizing an existing PV

> [!NOTE]
> Mixing traditional LVM encryption and LVM-on-Crypt on the same VM is not recommended.

> [!NOTE]
> These examples use the pre-existing names for disks, physical volumes, volume groups, logical volumes, filesystems, UUIDs and mountpoints,   you need to replace the values provided on these examples to fit your environment.

#### Extending a logical volume when there's available space in the VG

Traditional method used to resize logical volumes, it can be applied to non-encrypted disks, traditional lvm encrypted volumes, and LVM-on-Crypt configurations.

1. Verify the current size of the filesystem we want to increase:

    ``` bash
    df -h /mountpoint
    ```

    ![scenarioa-check-fs1](./media/disk-encryption/resize-lvm/001-resize-lvm-scenarioa-check-fs.png)

2. Verify that the VG has enough space to increase the LV

    ``` bash
    vgs
    ```

    ![scenarioa-check-vg](./media/disk-encryption/resize-lvm/002-resize-lvm-scenarioa-check-vgs.png)

    You can also use "vgdisplay"

    ``` bash
    vgdisplay vgname
    ```

    ![scenarioa-check-vgdisplay](./media/disk-encryption/resize-lvm/002-resize-lvm-scenarioa-check-vgdisplay.png)

3. Identify which logical volume needs to be resized

    ``` bash
    lsblk
    ```

    ![scenarioa-check-lsblk1](./media/disk-encryption/resize-lvm/002-resize-lvm-scenarioa-check-lsblk1.png)

    For LVM-On-Crypt, the difference is on this output, which shows that the encrypted layer is on the encrypted layer covering the whole disk

    ![scenarioa-check-lsblk2](./media/disk-encryption/resize-lvm/002-resize-lvm-scenarioa-check-lsblk2.png)

4. Check the logical volume size

    ``` bash
    lvdisplay lvname
    ```

    ![scenarioa-check-lvdisplay01](./media/disk-encryption/resize-lvm/002-resize-lvm-scenarioa-check-lvdisplay01.png)

5. Increase the LV size, using "-r" for online resize of the filesystem

    ``` bash
    lvextend -r -L +2G /dev/vgname/lvname
    ```

    ![scenarioa-resize-lv](./media/disk-encryption/resize-lvm/003-resize-lvm-scenarioa-resize-lv.png)

6. Verify the new sizes for the LV and the file system

    ``` bash
    df -h /mountpoint
    ```

    ![scenarioa-check-fs](./media/disk-encryption/resize-lvm/004-resize-lvm-scenarioa-check-fs.png)

    The new size is reflected, it indicates a successful resize of the LV and the filesystem

7. You may check the LV information again to confirm the changes at the LV level

    ``` bash
    lvdisplay lvname
    ```

    ![scenarioa-check-lvdisplay2](./media/disk-encryption/resize-lvm/004-resize-lvm-scenarioa-check-lvdisplay2.png)

#### Extending a traditional LVM volume adding a new PV

Applicable when you need to add a new disk to increase the volume group size.

1. Verify the current size of the filesystem we want to increase:

    ``` bash
    df -h /mountpoint
    ```

    ![scenariob-check-fs](./media/disk-encryption/resize-lvm/005-resize-lvm-scenariob-check-fs.png)

2. Verify the current Physical Volume configuration

    ``` bash
    pvs
    ```

    ![scenariob-check-pvs](./media/disk-encryption/resize-lvm/006-resize-lvm-scenariob-check-pvs.png)

3. Check the current VG information

    ``` bash
    vgs
    ```

    ![scenariob-check-vgs](./media/disk-encryption/resize-lvm/007-resize-lvm-scenariob-check-vgs.png)

4. Check the current disk list

    Data disks should be identified by checking the devices under /dev/disk/azure/scsi1/

    ``` bash
    ls -l /dev/disk/azure/scsi1/
    ```

    ![scenariob-check-scs1](./media/disk-encryption/resize-lvm/008-resize-lvm-scenariob-check-scs1.png)

5. Check the output of lsblk 

    ``` bash
    lsbk
    ```

    ![scenariob-check-lsblk](./media/disk-encryption/resize-lvm/008-resize-lvm-scenariob-check-lsblk.png)

6. Attach the new disk to the VM

    Follow up to step 4 of the following document

   - [Attach a disk to a VM](attach-disk-portal.md)

7. After the disk is attached, check the disk list, notice the new disk

    ``` bash
    ls -l /dev/disk/azure/scsi1/
    ```

    ![scenariob-check-scsi12](./media/disk-encryption/resize-lvm/009-resize-lvm-scenariob-check-scsi12.png)

    ``` bash
    lsbk
    ```

    ![scenariob-check-lsblk12](./media/disk-encryption/resize-lvm/009-resize-lvm-scenariob-check-lsblk1.png)

8. Create a new PV on top of the new Data Disk

    ``` bash
    pvcreate /dev/newdisk
    ```

    ![scenariob-pvcreate](./media/disk-encryption/resize-lvm/010-resize-lvm-scenariob-pvcreate.png)

    This method uses the whole disk as a PV without a partition, optionally you can use "fdisk" to create a partition and then use that partition for the "pvcreate".

9. Verify that the PV was added to the PV list.

    ``` bash
    pvs
    ```

    ![scenariob-check-pvs1](./media/disk-encryption/resize-lvm/011-resize-lvm-scenariob-check-pvs1.png)

10. Extend the VG by adding the new PV to it

    ``` bash
    vgextend vgname /dev/newdisk
    ```

    ![scenariob-vg-extend](./media/disk-encryption/resize-lvm/012-resize-lvm-scenariob-vgextend.png)

11. Check the new VG size

    ``` bash
    vgs
    ```

    ![scenariob-check-vgs1](./media/disk-encryption/resize-lvm/013-resize-lvm-scenariob-check-vgs1.png)

12. Use lsblk to identify which LV needs to be resized

    ``` bash
    lsblk
    ```

    ![scenariob-check-lsblk1](./media/disk-encryption/resize-lvm/013-resize-lvm-scenariob-check-lsblk1.png)

13. Extend the LV size using “-r” to do an online increase of the filesystem

    ``` bash
    lvextend -r -L +2G /dev/vgname/lvname
    ```

    ![scenariob-lvextend](./media/disk-encryption/resize-lvm/013-resize-lvm-scenariob-lvextend.png) 

14. Verify the New LV and filesystem Sizes

    ``` bash
    df -h /mountpoint
    ```

    ![scenariob-check-fs1](./media/disk-encryption/resize-lvm/014-resize-lvm-scenariob-check-fs1.png)

    Is important to know that when ADE is used on traditional LVM configurations, the encrypted layer is created at the LV level, not at the disk level.

    At this point, the encrypted layer is expanded to the new disk.
    The actual data disk doesn't have any encryption settings at the platform level hence its encryption status isn't updated.

    >[!NOTE]
    >These are some of the reasons why LVM-on-Crypt is the recommended approach. 

15. Check the encryption information from the portal:

    ![scenariob-check-portal1](./media/disk-encryption/resize-lvm/014-resize-lvm-scenariob-check-portal1.png)

    You need to add a new LV and enable the extension on the VM in order to update the encryption settings on the disk.
    
16. Add a new LV, create a filesystem on it, and add it to /etc/fstab

17. Set the encryption extension again in order to stamp the encryption settings on the new data disk at the platform level.

    Example:

    CLI

    ``` bash
    az vm encryption enable -g ${RGNAME} --name ${VMNAME} --disk-encryption-keyvault "<your-unique-keyvault-name>"
    ```

18. Check the encryption information from the portal:

    ![scenariob-check-portal2](./media/disk-encryption/resize-lvm/014-resize-lvm-scenariob-check-portal2.png)

19. After the encryption settings are updated, you may delete the new LV, you would also need to delete the entry from /etc/fstab and /etc/crypttab that were created for it.

    ![scenariob-delete-fstab-crypttab](./media/disk-encryption/resize-lvm/014-resize-lvm-scenariob-delete-fstab-crypttab.png)

20. Unmount the logical volume

    ``` bash
    umount /mountpoint
    ```

21. Close the encrypted layer of the volume

    ``` bash
    cryptsetup luksClose /dev/vgname/lvname
    ```

22. Delete the LV

    ``` bash
    lvremove /dev/vgname/lvname
    ```

#### Extending a traditional LVM volume resizing an existing PV

Certain scenarios or limitations require that you resize an existing disk.

1. Identify your encrypted disks

    ``` bash
    ls -l /dev/disk/azure/scsi1/
    ```

    ![scenarioc-check-scsi1](./media/disk-encryption/resize-lvm/015-resize-lvm-scenarioc-check-scsi1.png)

    ``` bash
    lsblk -fs
    ```

    ![scenarioc-check-lsblk](./media/disk-encryption/resize-lvm/015-resize-lvm-scenarioc-check-lsblk.png)

2. Check the pv information

    ``` bash
    pvs
    ```

    ![scenarioc-check-pvs](./media/disk-encryption/resize-lvm/016-resize-lvm-scenarioc-check-pvs.png)

    All the space on all the PVs is currently used

3. Check the VGs information

    ``` bash
    vgs
    vgdisplay -v vgname
    ```

    ![scenarioc-check-vgs](./media/disk-encryption/resize-lvm/017-resize-lvm-scenarioc-check-vgs.png)

4. Check the disk sizes, you can use fdisk or lsblk to list the drive sizes

    ``` bash
    for disk in `ls -l /dev/disk/azure/scsi1/* | awk -F/ '{print $NF}'` ; do echo "fdisk -l /dev/${disk} | grep ^Disk "; done | bash

    lsblk -o "NAME,SIZE"
    ```

    ![scenarioc-check-fdisk](./media/disk-encryption/resize-lvm/018-resize-lvm-scenarioc-check-fdisk.png)

    We’ve identified which PVs are associated to which LVs by using lsblk -fs, you can identify it also by running "lvdisplay"

    ``` bash
    lvdisplay --maps VG/LV
    lvdisplay --maps datavg/datalv1
    ```

    ![check-lvdisplay](./media/disk-encryption/resize-lvm/019-resize-lvm-scenarioc-check-lvdisplay.png)

    On this particular case all 4 data drives are part of the same VG and a single LV, your configuration may differ from this example.

5. Check the current filesystem utilization:

    ``` bash
    df -h /datalvm*
    ```

    ![scenarioc-check-df](./media/disk-encryption/resize-lvm/020-resize-lvm-scenarioc-check-df.png)

6. Resize the data disk(s):

    You can reference [Linux expand disks](expand-disks.md) (only refer to the disk resize), you can use the portal, CLI, or PowerShell to do this step.

    >[!NOTE]
    >Please consider that resize operations on virtual disks can't be performed with the VM running. You will need to deallocate your VM for this step

7. When the disks are resized to the needed value, start the VM and check the new sizes using fdisk

    ``` bash
    for disk in `ls -l /dev/disk/azure/scsi1/* | awk -F/ '{print $NF}'` ; do echo "fdisk -l /dev/${disk} | grep ^Disk "; done | bash

    lsblk -o "NAME,SIZE"
    ```

    ![scenarioc-check-fdisk1](./media/disk-encryption/resize-lvm/021-resize-lvm-scenarioc-check-fdisk1.png)

    On this particular case /dev/sdd was resized from 5G to 20G

8. Check the current PV size

    ``` bash
    pvdisplay /dev/resizeddisk
    ```

    ![scenarioc-check-pvdisplay](./media/disk-encryption/resize-lvm/022-resize-lvm-scenarioc-check-pvdisplay.png)
    
    Even if the disk was resized, the pv still has the previous size.

9. Resize the PV

    ``` bash
    pvresize /dev/resizeddisk
    ```

    ![scenarioc-check-pvresize](./media/disk-encryption/resize-lvm/023-resize-lvm-scenarioc-check-pvresize.png)


10. Check the PV size

    ``` bash
    pvdisplay /dev/resizeddisk
    ```

    ![scenarioc-check-pvdisplay1](./media/disk-encryption/resize-lvm/024-resize-lvm-scenarioc-check-pvdisplay1.png)

    Apply the same procedure for all the disks you want to resize.

11. Check the VG information

    ``` bash
    vgdisplay vgname
    ```

    ![scenarioc-check-vgdisplay1](./media/disk-encryption/resize-lvm/025-resize-lvm-scenarioc-check-vgdisplay1.png)

    The VG now has space to be allocated to the LVs

12. Resize the LV

    ``` bash
    lvresize -r -L +5G vgname/lvname
    lvresize -r -l +100%FREE /dev/datavg/datalv01
    ```

    ![scenarioc-check-lvresize1](./media/disk-encryption/resize-lvm/031-resize-lvm-scenarioc-check-lvresize1.png)

13. Check FS size

    ``` bash
    df -h /datalvm2
    ```

    ![scenarioc-check-df3](./media/disk-encryption/resize-lvm/032-resize-lvm-scenarioc-check-df3.png)

#### Extending an LVM-on-Crypt volume adding a new PV

This method closely follows the steps from [Configure LVM on crypt](how-to-configure-lvm-raid-on-crypt.md) to add a new disk and configure it under a LVM-on-crypt configuration.

You can use this method to add space to an already existent LV or instead you can create new VGs or LVs.

1. Verify the current size of your VG

    ``` bash
    vgdisplay vgname
    ```

    ![scenarioe-check-vg01](./media/disk-encryption/resize-lvm/033-resize-lvm-scenarioe-check-vg01.png)

2. Verify the size of the fs and lv you want to increase

    ``` bash
    lvdisplay /dev/vgname/lvname
    ```

    ![scenarioe-check-lv01](./media/disk-encryption/resize-lvm/034-resize-lvm-scenarioe-check-lv01.png)

    ``` bash
    df -h mountpoint
    ```

    ![scenarioe-check-fs01](./media/disk-encryption/resize-lvm/034-resize-lvm-scenarioe-check-fs01.png)

3. Add a new data disk to the VM and identify it.

    Check the disks before adding the disk

    ``` bash
    fdisk -l | egrep ^"Disk /"
    ```

    ![scenarioe-check-newdisk01](./media/disk-encryption/resize-lvm/035-resize-lvm-scenarioe-check-newdisk01.png)

    Check the disks before adding the new disk

    ``` bash
    lsblk
    ```

    ![scenarioe-check-newdisk002](./media/disk-encryption/resize-lvm/035-resize-lvm-scenarioe-check-newdisk02.png)

    Add a new disk either with PowerShell, the Azure CLI, or the Azure portal. Check how to [attach a disk](attach-disk-portal.md) for reference on adding disks to a VM.

    Following the kernel name scheme for the devices the new drive normally will get assigned the next available letter, on this particular case the new added disk is sdd.

4. Check the disks after adding the new disk

    ``` bash
    fdisk -l | egrep ^"Disk /"
    ```

    ![scenarioe-check-newdisk02](./media/disk-encryption/resize-lvm/036-resize-lvm-scenarioe-check-newdisk02.png)-

    ``` bash
    lsblk
    ```

    ![scenarioe-check-newdisk003](./media/disk-encryption/resize-lvm/036-resize-lvm-scenarioe-check-newdisk03.png)

5. Create a filesystem on top of the recently added disk

    Match the recently added disk to the linked devices on /dev/disk/azure/scsi1/

    ``` bash
    ls -la /dev/disk/azure/scsi1/
    ```

    ![scenarioe-check-newdisk03](./media/disk-encryption/resize-lvm/037-resize-lvm-scenarioe-check-newdisk03.png)

    ``` bash
    mkfs.ext4 /dev/disk/azure/scsi1/${disk}
    ```

    ![scenarioe-mkfs01](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-mkfs01.png)

6. Create a new temp mountpoint for the new added disk

    ``` bash
    newmount=/data4
    mkdir ${newmount}
    ```

7. Add the recently created filesystem to /etc/fstab

    ``` bash
    blkid /dev/disk/azure/scsi1/lun4| awk -F\" '{print "UUID="$2" '${newmount}' "$4" defaults,nofail 0 0"}' >> /etc/fstab
    ```

8. Mount the new created fs using mount -a

    ``` bash
    mount -a
    ```

9. Verify the new added FS is mounted

    ``` bash
    df -h
    ```

    ![resize-lvm-scenarioe-df](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-df.png)

    ``` bash
    lsblk
    ```

    ![resize-lvm-scenarioe-lsblk](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lsblk.png)

10. Re-launch the encryption previously started for data drives

    For LVM-On-Crypt the recommendation is to use EncryptFormatAll otherwise a double encryption may happen while setting additional disks.

    For information on usage, see [Configure LVM on crypt](how-to-configure-lvm-raid-on-crypt.md).

    Example:

    ``` bash
    az vm encryption enable \
    --resource-group ${RGNAME} \
    --name ${VMNAME} \
    --disk-encryption-keyvault ${KEYVAULTNAME} \
    --key-encryption-key ${KEYNAME} \
    --key-encryption-keyvault ${KEYVAULTNAME} \
    --volume-type "DATA" \
    --encrypt-format-all \
    -o table
    ```

    When the encryption is completed, you will see a crypt layer on the newly added disk

    ``` bash
    lsblk
    ```

    ![scenarioe-lsblk2](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lsblk2.png)

11. Unmount the encrypted layer of the new disk

    ``` bash
    umount ${newmount}
    ```

12. Check the current pvs information

    ``` bash
    pvs
    ```

    ![scenarioe-currentpvs](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-currentpvs.png)

13. Create a PV on top of the encrypted layer of the disk

    Grab the device name from the previous lsblk command and add /dev/mapper in front of the device name to create the pv

    ``` bash
    pvcreate /dev/mapper/mapperdevicename
    ```

    ![scenarioe-pvcreate](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-pvcreate.png)

    You will see a warning about wiping the current ext4 fs signature, this is expected, answer y to this question

14. Verify that the new PV was added to the lvm configuration

    ``` bash
    pvs
    ```

    ![scenarioe-newpv](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-newpv.png)

15. Add the new PV to the VG that you need to increase

    ``` bash
    vgextend vgname /dev/mapper/nameofhenewpv
    ```

    ![scenarioe-vgextent](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-vgextent.png)

16. Verify the new size and free space of the VG

    ``` bash
    vgdisplay vgname
    ```

    ![scenarioe-vgdisplay](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-vgdisplay.png)

    Note the increase on the Total PE count and the Free PE / size

17. Increase the size of the lv and the filesystem by using the -r option on lvextend (in this example we are taking the total available space in the VG and adding it to the given logical volume)

    ``` bash
    lvextend -r -l +100%FREE /dev/vgname/lvname
    ```

    ![scenarioe-lvextend](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lvextend.png)

18. Verify the size of the LV

    ``` bash
    lvdisplay /dev/vgname/lvname
    ```

    ![scenarioe-lvdisplay](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lvdisplay.png)

19. Verify the size of the filesystem you just resized

    ``` bash
    df -h mountpoint
    ```

    ![scenarioe-df1](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-df1.png)

20. Verify that the LVM layer is created on top of the encrypted layer

    ``` bash
    lsblk
    ```

    ![scenarioe-lsblk3](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lsblk3.png)

    Using lsblk without options will show the mount points multiple times since it sorts by device and logical volumes, you may want to use lsblk -fs, -s reverses the sort so the mountpoints are shown once, then the disks will be shown multiple times.

    ``` bash
    lsblk -fs
    ```

    ![scenarioe-lsblk4](./media/disk-encryption/resize-lvm/038-resize-lvm-scenarioe-lsblk4.png)

#### Extending an LVM on crypt volume resizing an existing PV

1. Identify your encrypted disks

    ``` bash
    lsblk
    ```

    ![scenariof-lsblk01](./media/disk-encryption/resize-lvm/039-resize-lvm-scenariof-lsblk01.png)

    ``` bash
    lsblk -s
    ```

    ![scenariof-lsblk012](./media/disk-encryption/resize-lvm/040-resize-lvm-scenariof-lsblk012.png)

2. Check your pv information

    ``` bash
    pvs
    ```

    ![scenariof-pvs1](./media/disk-encryption/resize-lvm/041-resize-lvm-scenariof-pvs.png)

3. Check your vg information

    ``` bash
    vgs
    ```

    ![scenariof-vgs](./media/disk-encryption/resize-lvm/042-resize-lvm-scenariof-vgs.png)

4. Check your lv information

    ``` bash
    lvs
    ```

    ![scenariof-lvs](./media/disk-encryption/resize-lvm/043-resize-lvm-scenariof-lvs.png)

5. Check the filesystem utilization

    ``` bash
    df -h /mountpoint(s)
    ```

    ![lvm-scenariof-fs](./media/disk-encryption/resize-lvm/044-resize-lvm-scenariof-fs.png)

6. Check your disks sizes

    ``` bash
    fdisk
    fdisk -l | egrep ^"Disk /"
    lsblk
    ```

    ![scenariof-fdisk01](./media/disk-encryption/resize-lvm/045-resize-lvm-scenariof-fdisk01.png)

7. Resize the data disk

    You can reference [Linux expand disks](expand-disks.md) (only refer to the disk resize), you can use the portal, CLI or PowerShell to perform this step.

    >[!NOTE]
    >Please consider that resize operations on virtual disks can't be performed with the VM running. You will need to deallocate your VM for this step

8. Check your disks sizes

    ``` bash
    fdisk
    fdisk -l | egrep ^"Disk /"
    lsblk
    ```

    ![scenariof-fdisk02](./media/disk-encryption/resize-lvm/046-resize-lvm-scenariof-fdisk02.png)

    Note that (in this case) both disks were resized from 2GB to 4GB, however the FS, LV and PV size remain the same.

9. Check the current pv size

    Remember that on LVM-on-Crypt, the pv is the /dev/mapper/ device, not the /dev/sd* device

    ``` bash
    pvdisplay /dev/mapper/devicemappername
    ```

    ![scenariof-pvs](./media/disk-encryption/resize-lvm/047-resize-lvm-scenariof-pvs.png)

10. Resize the pv

    ``` bash
    pvresize /dev/mapper/devicemappername
    ```

    ![scenariof-resize-pv](./media/disk-encryption/resize-lvm/048-resize-lvm-scenariof-resize-pv.png)

11. Check the pv size after resizing

    ``` bash
    pvdisplay /dev/mapper/devicemappername
    ```

    ![scenariof-pv](./media/disk-encryption/resize-lvm/049-resize-lvm-scenariof-pv.png)

12. Resize the encrypted layer on the PV

    ``` bash
    cryptsetup resize /dev/mapper/devicemappername
    ```

    Apply the same procedure for all the disks you want to resize.

13. Check your vg information

    ``` bash
    vgdisplay vgname
    ```

    ![scenariof-vg](./media/disk-encryption/resize-lvm/050-resize-lvm-scenariof-vg.png)

    The VG now has space to be allocated to the LVs

14. Check the lv information

    ``` bash
    lvdisplay vgname/lvname
    ```

    ![scenariof-lv](./media/disk-encryption/resize-lvm/051-resize-lvm-scenariof-lv.png)

15. Check the fs utilization

    ``` bash
    df -h /mountpoint
    ```

    ![scenariof-fs](./media/disk-encryption/resize-lvm/052-resize-lvm-scenariof-fs.png)

16. Resize the lv

    ``` bash
    lvresize -r -L +2G /dev/vgname/lvname
    ```

    ![scenariof-lvresize](./media/disk-encryption/resize-lvm/053-resize-lvm-scenariof-lvresize.png)

    We’re using the -r option to also perform the FS resize

17. Check the lv information

    ``` bash
    lvdisplay vgname/lvname
    ```

    ![scenariof-lvsize](./media/disk-encryption/resize-lvm/054-resize-lvm-scenariof-lvsize.png)

18. Check the filesystem utilization

    ``` bash
    df -h /mountpoint
    ```

    ![create filesystem](./media/disk-encryption/resize-lvm/055-resize-lvm-scenariof-fs.png)

    Apply the same resizing procedure to any additional lv that requires it

## Next steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)
