---
title: Boot diagnostics for Linux virtual machines in Azure | Microsoft Doc
description: Overview of the two debugging features for Linux virtual machines in Azure
services: virtual-machines-linux
documentationcenter: virtual-machines-linux
author: Deland-Han
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid:
ms.service: virtual-machines-linux
ms.workload: infrastructure
ms.tgt_pltfrm: vm-linux
ms.devlang: na
ms.topic: article
ms.date: 08/21/2017
ms.author: delhan
---
# How to use boot diagnostics to troubleshoot Linux virtual machines in Azure

Support for two debugging features is now available in Azure: Console Output and Screenshot support for Azure Virtual Machines Resource Manager deployment model. 

When bringing your own image to Azure or even booting one of the platform images, there can be many reasons why a Virtual Machine gets into a non-bootable state. These features enable you to easily diagnose and recover your Virtual Machines from boot failures.

For Linux Virtual Machines, you can easily view the output of your console log from the Portal:

![Azure portal](./media/virtual-machines-common-boot-diagnostics/screenshot1.png)

However, for both Windows and Linux Virtual Machines, Azure also enables you to see a screenshot of the VM from the hypervisor:

![Error](./media/virtual-machines-common-boot-diagnostics/screenshot2.png)

Both of these features are supported for Azure Virtual Machines in all regions. Note, screenshots, and output can take up to 10 minutes to appear in your storage account.

## Common boot errors

**File system issues:**

- /dev/sda1 contains a file system with errors, check forced.
- Making fs in need of filesystem check.
- Couldn’t remount RDWR because of unprocessed orphan inode list.

See [Linux Recovery: Cannot SSH to Linux VM due to file system errors](https://blogs.msdn.microsoft.com/linuxonazure/2016/09/13/linux-recovery-cannot-ssh-to-linux-vm-due-to-file-system-errors-fsck-inodes/) for details on these issues.

**Kernal issues:**

- No root device found.
- Kernel timeout.
- Kernel null point.
- Kernel panic.

See [Linux Recovery: Manually fixing non-boot issues related to Kernel problems](https://blogs.msdn.microsoft.com/linuxonazure/2016/10/09/linux-recovery-manually-fixing-non-boot-issues-related-to-kernel-problems/) for details on these issues.

**FSTAB issues:**

- A disk was being mounted by a scsi id instead of UUID.
- A missing device on CentOS.
- VM is unable to boot due to a fstab misconfiguration or disk no longer attached to the VM.
- Serial log showing show incorrect UUID.

See [Linux Recovery: Cannot SSH to Linux VM due to FSTAB errors](https://blogs.msdn.microsoft.com/linuxonazure/2016/07/21/cannot-ssh-to-linux-vm-after-adding-data-disk-to-etcfstab-and-rebooting/) for details on these issues.

**SELinux disabled issue:**

- Failed to load SELinux policy, freezing.

See [Azure/Virtual Machine/Can’t RDP-SSH/TSG/Non-Boot Bucket/SELinux disabled](https://www.csssupportwiki.com/index.php/curated:Azure/Virtual_Machine/Can%E2%80%99t_RDP-SSH/TSG/Non-Boot_Bucket/SELinux_disabled) for details on this issue.

**Grub rescue prompt issues:**

- unknown filesystem.
- File not found.
- No such partition.

See [Azure/Virtual Machine/Can’t RDP-SSH/TSG/Non-Boot Bucket/Grub Rescue](https://www.csssupportwiki.com/index.php/curated:Azure/Virtual_Machine/Can%E2%80%99t_RDP-SSH/TSG/Non-Boot_Bucket/Grub_Rescue) for details on these issues.

[!INCLUDE [virtual-machines-common-boot-diagnostics](../../../includes/virtual-machines-common-boot-diagnostics.md)]