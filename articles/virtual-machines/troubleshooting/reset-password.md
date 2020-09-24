---
title: How to reset local Linux password on Azure VMs | Microsoft Docs
description: Introduce the steps to reset the local Linux password on Azure VM
services: virtual-machines-linux
documentationcenter: ''
author: Deland-Han
manager: dcscontentpm
editor: ''
tags: ''

ms.service: virtual-machines-linux
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-linux
ms.topic: troubleshooting
ms.date: 08/20/2019
ms.author: delhan

---

# How to reset local Linux password on Azure VMs

This article introduces several methods to reset local Linux Virtual Machine (VM) passwords. If the user account is expired or you just want to create a new account, you can use the following methods to create a new local admin account and re-gain access to the VM.

## Symptoms

You can't log in to the VM, and you receive a message that indicates that the password that you used is incorrect. Additionally, you can't use VMAgent to reset your password on the Azure portal.

## Manual password reset procedure

> [!NOTE]
> The following steps does not apply to the VM with unmanaged disk.

1. Take a snapshot for the OS disk of the affected VM, create a disk from the snapshot, and then attach the disk to a troubleshoot VM. For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM using the Azure portal](troubleshoot-recovery-disks-portal-linux.md).

2. Connect to the troubleshooting VM using Remote Desktop.

3.	Run the following SSH command on the troubleshooting VM to become a super-user.

    ```bash
    sudo su
    ```

4.	Run **fdisk -l** or look at system logs to find the newly attached disk. Locate the drive name to mount. Then on the temporal VM, look in the relevant log file.

    ```bash
    grep SCSI /var/log/kern.log (ubuntu)
    grep SCSI /var/log/messages (centos, suse, oracle)
    ```

    The following is example output of the grep command:

    ```bash
    kernel: [ 9707.100572] sd 3:0:0:0: [sdc] Attached SCSI disk
    ```

5.	Create a mount point called **tempmount**.

    ```bash
    mkdir /tempmount
    ```

6.	Mount the OS disk on the mount point. You usually need to mount *sdc1* or *sdc2*. This will depend on the hosting partition in */etc* directory from the broken machine disk.

    ```bash
    mount /dev/sdc1 /tempmount
    ```

7.	Create copies of the core credential files before making any changes:

    ```bash
    cp /etc/passwd /etc/passwd_orig    
    cp /etc/shadow /etc/shadow_orig    
    cp /tempmount/etc/passwd /etc/passwd
    cp /tempmount/etc/shadow /etc/shadow 
    cp /tempmount/etc/passwd /tempmount/etc/passwd_orig
    cp /tempmount/etc/shadow /tempmount/etc/shadow_orig
    ```

8.	Reset the user’s password that you need:

    ```bash
    passwd <<USER>> 
    ```

9.	Move the modified files to the correct location on the broken machine's disk.

    ```bash
    cp /etc/passwd /tempmount/etc/passwd
    cp /etc/shadow /tempmount/etc/shadow
    cp /etc/passwd_orig /etc/passwd
    cp /etc/shadow_orig /etc/shadow
    ```

10.	Go back to the root and unmount the disk.

    ```bash
    cd /
    umount /tempmount
    ```

11. In Azure portal, detach the disk from the troubleshooting VM.

12. [Change the OS disk for the affected VM](troubleshoot-recovery-disks-portal-linux.md#swap-the-os-disk-for-the-vm).

## Next steps

* [Troubleshoot Azure VM by attaching OS disk to another Azure VM](https://social.technet.microsoft.com/wiki/contents/articles/18710.troubleshoot-azure-vm-by-attaching-os-disk-to-another-azure-vm.aspx)

* [Azure CLI: How to delete and re-deploy a VM from VHD](/archive/blogs/linuxonazure/azure-cli-how-to-delete-and-re-deploy-a-vm-from-vhd)
