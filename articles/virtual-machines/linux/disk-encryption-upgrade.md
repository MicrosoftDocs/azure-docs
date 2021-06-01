---
title: How to upgrade Azure Disk Encryption on a disk
description: This article provides instructions on upgrading Azure Disk Encryption on a disk
author: msmbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.topic: how-to
ms.author: mbaldwin
ms.date: 05/27/2021

ms.custom: seodec18, devx-track-azurecli, devx-track-azurepowershell

---

# Upgrading the Azure Disk Encryption version

The first version of Azure Disk Encryption (ADE)—sometimes referred to as "dual-pass encryption"—relied on Azure Active Directory (AAD) for authentication; the current version—sometimes referred to as "single-pass" encryption—does not.  We strongly encourage the use of the newest version.

## How to migrate

Migration from dual-pass encryption to single-pass encryption is only available through Azure PowerShell. Ensure you have the latest version of Azure PowerShell (at least version 5.9.0) and the [Azure PowerShell Az module](/powershell/azure/new-azureps-module-az) installed.

To upgrade from dual-pass encryption to single-pass encryption, use the [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension) PowerShell cmdlet. 

> [!WARNING]
> The Set-AzVMDiskEncryptionExtension cmdlet must only be used on VMs encrypted with dual-pass encryption. Attempting to migrate an unencrypted VM, or a VM encrypted with single-pass encryption, will result in a terminal error.

```azurepowershell-interactive
Set-AzVMDiskEncryptionExtension -ResourceGroupName <resourceGroupName> -VMName <vmName> -Migrate
```

When the cmdlet prompts you for confirmation, enter "Y".  The ADE version will be updated and the VM rebooted. The output will look similar to the following:

```bash
> Set-AzVMDiskEncryptionExtension -ResourceGroupName myResourceGroup -VMName myVM -Migrate

Update AzureDiskEncryption version?
This cmdlet updates Azure Disk Encryption version to single pass (Azure Disk Encryption without AAD). This may reboot
the machine and takes 10-15 minutes to finish. Are you sure you want to continue?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
Azure Disk Encryption Extension Public Settings
"KeyVaultResourceId": /subscriptions/ea500758-3163-4849-bd2c-3e50f06efa7a/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myKeyVault
"SequenceVersion":
"MigrateFlag": Migrate
"KeyVaultURL": https://myKeyVault.vault.azure.net/
"AADClientID": d29edf8c-3fcb-42e7-8410-9e39fdf0dd70
"KeyEncryptionKeyURL":
"KekVaultResourceId":
"EncryptionOperation": EnableEncryption
"AADClientCertThumbprint":
"VolumeType":
"KeyEncryptionAlgorithm":

Running ADE extension (with AAD) for -Migrate..
ADE extension (with AAD) is now complete. Updating VM model..
Running ADE extension (without AAD) for -Migrate..
ADE extension (without AAD) is now complete. Clearing VM model..

RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK
```

As it says in the output, the migration will take at least 10 - 15 minutes minutes to complete.

> [!IMPORTANT]
> Do not cancel the cmdlet while the upgrade is in progress.  Doing so puts the health of the health at risk.

## Next steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)
