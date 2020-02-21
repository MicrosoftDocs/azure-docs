---
title: 'Troubleshoot boot errors in Azure Linux Virtual Machines | Microsoft Docs'
description: This article helps link you to articles to troubleshoot boot errors in Azure Linux Virtual Machines.
services: virtual-machines-linux
documentationCenter: ''
author: vilibert
manager: spogge
editor: ''

ms.service: virtual-machines-linux

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-linux
ms.workload: infrastructure
ms.date: 11/20/2019
ms.author: vilibert
---

# Troubleshoot Azure Linux Virtual Machines boot errors

This article lists the common boot errors that you may receive when you start a Linux virtual machine (VM) in Microsoft Azure. For more information about the errors, see the articles in the **Boot errors and solutions** section.

## Boot errors and solutions

* [GRUB rescue](troubleshoot-vm-boot-error.md)

## Next steps

- [VM Serial Console](serial-console-linux.md)

Troubleshoot a Linux VM by attaching the OS disk to a recovery VM using Azure:

- [Azure VM repair](repair-linux-vm-using-azure-virtual-machine-repair-commands.md)

 Disk Swap – this can be automated using either:
- [Power Shell Recovery Scripts](https://github.com/Azure/azure-support-scripts/tree/master/VMRecovery/ResourceManager)
- [bash Recovery Scripts](https://github.com/sribs/azure-support-scripts)

- [CLI](troubleshoot-recovery-disks-linux.md)
- [Azure portal](troubleshoot-recovery-disks-portal-linux.md)


## Disk Swap Video:

If you do not have access to GRUB watch [this](https://youtu.be/m5t0GZ5oGAc) video and see, how you can easily automate the disk swap procedure to recover your VM

## Unofficial solution

Recovery of a VM can also be attempted with the unsupported BETA script [ALAR](https://github.com/malachma/azure-auto-recover)