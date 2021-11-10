---
title: Troubleshoot encrypted Azure VM backup errors
description: Describes how to troubleshoot common errors that might occur when you use Azure Backup to back up an encrypted VM.
ms.topic: troubleshooting
ms.date: 11/9/2021
---

# Troubleshoot backup failures on encrypted Azure virtual machines

You can troubleshoot common errors encountered while using Azure Backup service to backup encrypted Azure virtual machines with the steps listed below:

## Before you start

1. Review below limitations and supported configurations:
 - You can back up and restore ADE encrypted VMs within the same subscription.
  - Azure Backup supports VMs encrypted using standalone keys. Any key that's a part of a certificate used to encrypt a VM isn't currently supported.
 - Azure Backup supports Cross Region Restore of encrypted Azure VMs to the [Azure paired regions](../best-practices-availability-paired-regions.md#azure-regional-pairs).
 - ADE encrypted VMs cannot be recovered at the file/folder level. You need to recover the entire VM to restore files and folders. 
 - When restoring a VM, you can't use the replace existing VM option for ADE encrypted VMs. See, [steps to restore encrypted Azure virtual machines](restore-azure-encrypted-virtual-machines.md)
2. Review the [support matrix](backup-support-matrix.md#cross-region-restore) for a list of supported managed types and regions
3. 
