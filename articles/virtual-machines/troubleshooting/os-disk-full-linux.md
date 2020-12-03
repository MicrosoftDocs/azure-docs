---
title: Issues with a full OS disk on a Linux virtual machine
description: How to resolve issues with a full OS disk on a Linux virtual machine
author: v-miegge
ms.author: tibasham
manager: dcscontentpm
ms.service: virtual-machines
ms.subservice: disks
ms.workload: infrastructure-services
ms.topic: troubleshooting
ms.date: 11/20/2020

---
# Issues with a full OS disk on a Linux virtual machine

When the OS disk of a Linux virtual machine (VM) becomes full, this can cause problems with the proper operation of the VM.

## Symptom

When you try to create a new file, you receive this message:

```
username@AZUbuntu1404:~$ touch new 
touch: cannot touch “new”: No space left on device 
username@AZUbuntu1404:~$
```

Multiple daemons then indicate that they are not able to create temporary files during the boot session.

```
ERROR:IOError: [Errno 28] No space left on device: '/var/lib/waagent/events/1474306860983232.tmp' 
    
OSError: [Errno 28] No space left on device: '/var/lib/cloud/data/tmpDZCq0g'
```
	
## Cause

There are several reasons why this error message can occur:

1. The disk could be full.
1. The filesystem might have run out of iNodes.
1. A data disk may be mounted over an existing directory causing files to be hidden.
1. Files that are opened by a process and then deleted.

## Solution

### Process overview

1. Create and access a Repair VM.
1. Free space on disk.
1. Rebuild the VM.

> [!NOTE]
> When encountering this error, the Guest OS is not operational. Troubleshoot this issue in offline mode to resolve this issue.

### Create and access a Repair VM

1. Use steps 1-3 of the [VM Repair Commands](./repair-linux-vm-using-azure-virtual-machine-repair-commands.md) to prepare a Repair VM.
1. Using SSH, connect to the Repair VM.

### Free up space on the disk

To solve the issue:

- Resize the disk up to 1 TB if it is not already at the maximum size of 1 TB.
- Free up disk space.

1. Check if the disk is full. If the disk size is below 1 TB, expand it up to a maximum of 1 TB [using Azure CLI](../linux/expand-disks.md).
1. If the disk is already 1 TB, you will need to free up disk space.
1. Once resizing and clean-up are finished proceed to rebuild the VM.

### Rebuild the VM

Use [step 5 of the VM Repair Commands](./repair-linux-vm-using-azure-virtual-machine-repair-commands.md#repair-process-example) to rebuild the VM.
