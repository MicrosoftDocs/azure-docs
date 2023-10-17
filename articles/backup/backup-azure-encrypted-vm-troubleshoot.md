---
title: Troubleshoot encrypted Azure VM backup errors
description: Describes how to troubleshoot common errors that might occur when you use Azure Backup to back up an encrypted VM.
ms.topic: troubleshooting
ms.date: 11/9/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Troubleshoot backup failures on encrypted Azure virtual machines

You can troubleshoot common errors encountered while using Azure Backup service to back up encrypted Azure virtual machines with the steps listed below:

## Before you start

1. Review below limitations and supported configurations:
   - You can back up and restore ADE encrypted VMs within the same subscription.
   - Azure Backup supports VMs encrypted using standalone keys. Any key that's a part of a certificate used to encrypt a VM isn't currently supported.
   - Azure Backup supports Cross Region Restore of encrypted Azure VMs to the [Azure paired regions](../best-practices-availability-paired-regions.md#azure-regional-pairs).
   - ADE encrypted VMs cannot be recovered at the file/folder level. You must recover the entire VM to restore files and folders. 
   - When restoring a VM, you cannot use 'replace existing VM' option for ADE encrypted VMs. See, [steps to restore encrypted Azure virtual machines](restore-azure-encrypted-virtual-machines.md)
2. Review the [support matrix](backup-support-matrix.md#cross-region-restore) for a list of supported managed types and regions
3. Learn more about encryption support using [Azure Disk Encryption(ADE)](backup-azure-vms-encryption.md#encryption-support-using-ade), [customer-managed keys(CMk)](backup-azure-vms-encryption.md#encryption-using-customer-managed-keys) and [platform-managed keys(PMK)](backup-azure-vms-encryption.md#encryption-using-platform-managed-keys)

## Common error codes

This section provides steps to troubleshoot common errors that you might see.

## UserErrorEncryptedVmNotSupportedWithDiskEx

Error message: Disk exclusion is not supported for encrypted virtual machines.

Backup operation failed because selective disk backup is currently not supported for encrypted VMs. Review [selective disk backup limitations](selective-disk-backup-restore.md#limitations).

## UserErrorKeyVaultPermissionsNotConfigured

Error message: Backup doesn't have sufficient permissions to the key vault for backup of encrypted VMs.

Backup operation failed because the encrypted VMs do not have the required permissions to access the key vault. 
Permissions can be set through [Azure portal](./backup-azure-vms-encryption.md#provide-permissions) or through [PowerShell](./backup-azure-vms-automation.md#enable-protection).

## DiskEncryptionInternalError

Error message: Unknown error encountered when retrieving secret from the Key Vault with URL

Restore operation of encrypted VM failed because of the missing key-vault key or secret.
To resolve this issue, [restore the Key-Vault key or secret](backup-azure-restore-key-secret.md) and [create encrypted VMs from restored disk, key, and secret](backup-azure-vms-automation.md#create-a-vm-from-restored-disks).

## BCMProtGetSaSUriAsyncError

Error message: Backup failed in allocating storage from protection service

Backup operation failed because Azure Key Vault do not have required access to the Recovery Service Vault. [Assign required permissions to the vault to access the encryption key](./encryption-at-rest-with-cmk.md?tabs=portal#assign-user-assigned-managed-identity-to-the-vault-in-preview) and retry the operation. 


## Next steps

- [Step-by-step instructions to backup encrypted Azure virtual machines](backup-azure-vms-encryption.md)
- [Step-by-step instructions to restore encrypted Azure virtual machines](restore-azure-encrypted-virtual-machines.md)