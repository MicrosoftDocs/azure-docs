---
title: Linux VM boots to Grub Rescue
description: Virtual machine failed to boot because the virtual machine entered a rescue console
services: virtual-machines-windows
documentationcenter: ''
author: v-miegge
manager: dcscontentpm
editor: ''
ms.service: virtual-machines-windows
ms.workload: infrastructure-services
ms.tgt_pltfrm: vm-windows
ms.devlang: na
ms.topic: troubleshooting
ms.date: 08/28/2019
ms.author: tiag
---


# Linux VM boots to Grub Rescue

We have identified that your Virtual Machine (VM) entered a rescue console. The issue occurs when your Linux VM had kernel changes applied recently such as a kernel upgrade, and is no longer starting up properly because of kernel errors during the boot process. During the boot process, when the boot loader attempts to locate the Linux kernel and hand off boot control to it, the VM enters a rescue console when the handoff fails.

If you find that you can't connect to a VM in the future, you can view a screenshot of your VM using the boot diagnostics blade in the Azure portal. This may help you diagnose the issue and determine if a similar boot error is the cause.

## Recommended steps

Follow the mitigation steps below depending on the error you receive:

### Error - Unknown filesystem

* If you're getting the error **Unknown filesystem**, this error can result from a file system corruption on the boot partition, or an incorrect kernel configuration.

   * For file system issues, follow the steps in the article [Linux Recovery: Cannot SSH to Linux VM due to file system errors (fsck, inodes)](https://blogs.msdn.microsoft.com/linuxonazure/2016/09/13/linux-recovery-cannot-ssh-to-linux-vm-due-to-file-system-errors-fsck-inodes/).
   * For kernel issues, follow the steps in the article [Linux Recovery: Manually fixing non-boot issues related to Kernel problems](https://blogs.msdn.microsoft.com/linuxonazure/2016/10/09/linux-recovery-manually-fixing-non-boot-issues-related-to-kernel-problems/), or [Linux Recovery: Fixing non-boot issues related to Kernel problems using chroot](https://blogs.msdn.microsoft.com/linuxonazure/2016/10/09/linux-recovery-fixing-non-boot-issues-related-to-kernel-problems-using-chroot/).
   
### Error - File not found

* If you're getting the error **Error 15: File not found or initial RAM disk** or **initrd/initramfs file not found**, follow the steps below.

    * For the missing file `/boot/grub2/grub.cfg` or `initrd/initramfs` proceed with the following process:

    1. Ensure `/etc/default/grub` exist and has correct/desired settings. If you don't know which are the default settings, you can check with a working VM.

    2. Next, run the following command to regenerate its configuration: `grub2-mkconfig -o /boot/grub2/grub.cfg`

   * If the missing file is `/boot/grub/menu.lst`, this error is for older OS versions (**RHEL 6.x**, **Centos 6.x** and **Ubuntu 14.04**) so the commands could differ. You will have to spin up an old server and test to ensure the correct commands are provided.

### Error - No such partition

* If you're getting the error **No such partition**, refer to [Case Scenario : "no such partition" error while trying to start the VM after attempting to extend the OS drive](https://blogs.technet.microsoft.com/shwetanayak/2017/03/12/case-scenario-no-such-partition-error-while-trying-to-start-the-vm-after-attempting-to-extend-the-os-drive/).

### Error - grub.cfg file not found

* If you're getting the error **/boot/grub2/grub.cfg file not found**, follow the steps below.

    * For the missing file `/boot/grub2/grub.cfg` or `initrd/initramfs` proceed with the following process:

    1. Ensure `/etc/default/grub` exist and has correct/desired settings. If you don't know which are the default settings, you can check with a working VM.

    2. Next, run the following command to regenerate its configuration: `grub2-mkconfig -o /boot/grub2/grub.cfg`.

   * If the missing file is `/boot/grub/menu.lst`, this error is for older OS versions (**RHEL 6.x**, **Centos 6.x** and **Ubuntu 14.04**) so the commands could defer. Spin up an old server and test it to ensure the correct commands are provided.

## Next steps

* [Azure Virtual Machine Agent overview](../extensions/agent-windows.md)
* [Virtual machine extensions and features for Windows](../extensions/features-windows.md)

