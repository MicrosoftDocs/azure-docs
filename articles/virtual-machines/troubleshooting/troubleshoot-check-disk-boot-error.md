---

title: Checking file system when booting an Azure VM| Microsoft Docs
description: Learn how to resolve the issue that VM show Checking file system when booting| Microsoft Docs
services: virtual-machines-windows
documentationCenter: ''
author: genlin
manager: dcscontentpm
editor: ''

ms.service: virtual-machines-windows

ms.topic: troubleshooting
ms.tgt_pltfrm: vm-windows
ms.workload: infrastructure
ms.date: 08/31/2018
ms.author: genli
---

# Windows shows “checking file system” when booting an Azure VM

This article describes the “Checking file system” error that you may encounter when you boot a Windows Virtual Machine (VM) in Microsoft Azure.


## Symptom 

A Windows VM doesn't start. When you check the boot screenshots in [Boot diagnostics](boot-diagnostics.md), you see that the Check Disk process (chkdsk.exe) is running with one of the following messages:

- Scanning and repairing drive (C:)
- Checking file system on C:

## Cause

If an NTFS error is found in the file system, Windows will check and repair the consistency of the disk at the next restart. Usually this happens if the VM had any unexpected restart, or if the VM shutdown process was abruptly interrupted.

## Solution 

Windows will boot normally after the Check Disk process is completed. If the VM is stuck in the Check Disk process, try to run the Check Disk on the VM offline:
1.	Take a snapshot of the OS disk of the affected VM as a backup. For more information, see [Snapshot a disk](../windows/snapshot-copy-managed-disk.md).
2.	[Attach the OS disk to a recovery VM](troubleshoot-recovery-disks-portal-windows.md).  
3.	On the recovery VM, run Check Disk on the attached OS disk. In the following sample, the driver letter of the attached OS disk is E: 
        
        chkdsk E: /f
4.	After the Check Disk completes, detach the disk from the recovery VM, and then re-attach the disk to the affected VM as an OS disk. For more information, see [Troubleshoot a Windows VM by attaching the OS disk to a recovery VM](troubleshoot-recovery-disks-portal-windows.md).
