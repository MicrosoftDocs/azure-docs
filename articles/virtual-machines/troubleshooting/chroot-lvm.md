---
title: Recover Linux VM using chroot on LVM configured VMs
description: Recovery of Linux VMs with LVMs. 
services: virtual-machines-linux
documentationcenter: ''
author: vilibert
manager: spogge
editor: ''
tags: Linux chroot LVM

ms.service: virtual-machines-linux
ms.devlang: na
ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure-services
ms.date: 11/24/2019
ms.author: vilibert
---

# Troubleshooting a Linux VM when there is no access to the Azure serial console and the disk layout is using LVM (Logical Volume Manager)

This troubleshooting guide is of benefit for scenarios where a Linux VM is not booting,ssh is not possible and the underlying file system layout is configured with LVM (Logical Volume Manager).

## Take snapshot of the failing VM

Take a snapshot of the affected VM. 

The snapshot will then be attached to a **rescue** VM. 
Follow instructions [here](https://docs.microsoft.com/azure/virtual-machines/linux/snapshot-copy-managed-disk#use-azure-portal) on how to take a **snapshot**.

## Create a rescue VM
Usually a rescue VM of the same or similar Operating system version is recommended. Use the same **region** and **resource group** of the affected VM

## Connect to the rescue VM
Connect using ssh into the **rescue** VM. Elevate privileges and become super user using

`sudo su -`

## Attach the disk
Attach a disk to the **rescue** VM made from the snapshot taken previously.

Azure portal -> select the **rescue** VM -> **Disks** 

![createdisk](./media/chroot-lvm/creatediskfromsnap.png)

Populate the fields. 
Assign a name to your new disk, select the same Resource Group as the snapshot, affected VM, and Rescue VM.

The **Source type** is **Snapshot** .
The **Source snapshot** is the name of the **snapshot** previously created.

![createdisk2](./media/chroot-lvm/creatediskfromsnap2.png)

Create a mount point for the attached disk.

`mkdir /rescue`

Run the **fdisk -l** command to verify the snapshot disk has been attached and list all devices and partitions available

`fdisk -l`

Most scenarios, the attached snapshot disk will be seen as **/dev/sdc** displaying two partitions **/dev/sdc1** and **/dev/sdc2**

![fdisk](./media/chroot-lvm/fdisk_output_sdc.png)

The **\*** indicates a boot partition, both partitions are to be mounted.

Run the command **lsblk** to see the LVMs of the affected VM

`lsblk`

![run lsblk](./media/chroot-lvm/lsblk_output_mounted.png)


Verify if LVMs from the affected VM are displayed.
If not, use the below commands to enable them and rerun **lsblk**.
Ensure to have the LVMs from the attached disk visible before proceeding.

```
vgscan --mknodes
vgchange -ay
lvscan
mount –a
lsblk
```

Locate the path to mount the Logical Volume that contains the / (root)  partition. It has the configuration files such as /etc/default/grub

In this example, taking the output from the previous **lsblk** command  **rootvg-rootlv** is the correct **root** LV to mount and can be used in the next command.

The output of the next command will show the path to mount for the **root** LV

`pvdisplay -m | grep -i rootlv`

![rootlv](./media/chroot-lvm/locate_rootlv.png)

Proceed to mount this device on the directory /rescue

`mount /dev/rootvg/rootlv /rescue`

Mount the partition that has the **Boot flag** set on /rescue/boot

`
mount /dev/sdc1 /rescue/boot
`

Verify the file systems of the attached disk are now correctly mounted using the **lsblk** command


![run lsblk](./media/chroot-lvm/lsblk_output.png)

or the **df -Th** command

![df](./media/chroot-lvm/df_output.png)

## Gaining chroot access

Gain **chroot** access, which will enable you to perform various fixes, slight variations exist for each Linux distribution.

```
 cd /rescue​
 mount -t proc proc proc
 mount -t sysfs sys sys/​
 mount -o bind /dev dev/​
 mount -o bind /dev/pts dev/pts/​
 chroot /rescue​
```

If an error is experienced such as:

**chroot: failed to run command ‘/bin/bash’: No such file or directory**

attempt to mount the **usr** Logical Volume

`
mount  /dev/mapper/rootvg-usrlv /rescue/usr
`

> [!TIP]
> When executing commands in a **chroot** environment, note they are run against the attached OS Disk and not the local **rescue** VM. 

Commands can be used to install, remove and update software. Troubleshoot VMs in order to fix errors.


Execute the lsblk command and the /rescue is now / and /rescue/boot is /boot
![chrooted](./media/chroot-lvm/chrooted.png)

# Perform Fixes

## Example 1 - Configure the VM to boot from a different kernel

A common scenario is to force a VM to boot from a previous kernel as the current installed kernel may have become corrupt or an upgrade did not complete correctly.


```
cd /boot/grub2

grep -i linux grub.cfg

grub2-editenv list

grub2-set-default "CentOS Linux (3.10.0-1062.1.1.el7.x86_64) 7 (Core)"

grub2-editenv list

grub2-mkconfig -o /boot/grub2/grub.cfg
```

*walkthrough*

The **grep** command lists the kernels that **grub.cfg** is aware of.
![kernels](./media/chroot-lvm/kernels.png)

**grub2-editenv list** displays which kernel will be loaded at next boot
![kernel_default](./media/chroot-lvm/kernel_default.png)

**grub2-set-default** is used to change to another kernel
![grub2_set](./media/chroot-lvm/grub2_set_default.png)

**grub2-editenv** list displays which kernel will be loaded at next boot
![new_kernel](./media/chroot-lvm/kernel_new.png)

**grub2-mkconfig** rebuilds grub.cfg using the versions required
![grub2_mkconfig](./media/chroot-lvm/grub2_mkconfig.png)



## Example 2 - Upgrade packages

A failed kernel upgrade can render the VM non-bootable.
Mount all the Logical Volumes to allow packages to be removed or reinstalled

Run the **lvs** command to verify which **LVs** are available for mounting, every VM, which has been migrated or comes from another Cloud Provider will vary in configuration.

Exit the **chroot** environment mount the required **LV**

![advanced](./media/chroot-lvm/advanced.png)

Now access the **chroot** environment again by running

`chroot /rescue`

All LVs should be visible as mounted partitions

![advanced](./media/chroot-lvm/chroot_all_mounts.png)

Query the installed **kernel**

![advanced](./media/chroot-lvm/rpm_kernel.png)

If needed upgrade the **kernel**
![advanced](./media/chroot-lvm/rpm_remove_kernel.png)


## Example 3 - Enable Serial Console
If access has not been possible to the Azure serial console, verify GRUB configuration parameters for your Linux VM and correct them. DEtailed information can be found [in this doc](https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-grub-proactive-configuration)


# Exit chroot and swap the OS disk

After repairing the issue, proceed to unmount and detach the disk from the rescue VM allowing it to be swapped with the affected VM OS disk.

```
exit
cd /
umount /rescue/proc/
umount /rescue/sys/
umount /rescue/dev/pts
umount /rescue/dev/
umount /rescue/boot
umount /rescue
```

Detach the disk from the rescue VM and perform a Disk Swap.

Select the VM from the portal **Disks** and select **detach**
![detachdisk](./media/chroot-lvm/detachdisk.png) 

Save the changes
![savedetach](./media/chroot-lvm/savedetach.png) 

The disk will now become available allowing it to be swapped with the original OS disk of the affected VM.

Navigate in the Azure portal to the failing VM and select **Disks** -> **Swap OS Disk**
![swapdisk](./media/chroot-lvm/swapdisk.png) 

Complete the fields the **Choose disk** is the snapshot disk just detached in the previous step. The VM name of the affected VM is also required then select **OK**

![newosdisk](./media/chroot-lvm/newosdisk.png) 

If the VM is running the Disk Swap will shut it down, reboot the VM once the disk swap operation has completed.


## Next steps
Learn more about [Azure Serial Console]( https://docs.microsoft.com/azure/virtual-machines/troubleshooting/serial-console-linux)
