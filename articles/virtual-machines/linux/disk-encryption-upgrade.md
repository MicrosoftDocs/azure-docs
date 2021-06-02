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

The first version of Azure Disk Encryption (ADE) relied on Azure Active Directory (AAD) for authentication; the current version does not.  We strongly encourage the use of the newest version.

## How to migrate

Migration from Azure Disk Encryption (with AAD) to Azure Disk Encryption (without AAD) is only available through Azure PowerShell. Ensure you have the latest version of Azure PowerShell and at least the [Azure PowerShell Az module version 5.9.0](/powershell/azure/new-azureps-module-az) installed .

To upgrade from Azure Disk Encryption (with AAD) to Azure Disk Encryption (without AAD), use the [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension) PowerShell cmdlet. 

> [!WARNING]
> The Set-AzVMDiskEncryptionExtension cmdlet must only be used on VMs encrypted with Azure Disk Encryption (with AAD). Attempting to migrate an unencrypted VM, or a VM encrypted with Azure Disk Encryption (without AAD), will result in a terminal error.

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


> [!IMPORTANT]
> The upgrade will take at least 10 - 15 minutes to complete. Do not cancel the cmdlet while the upgrade is in progress. Doing so puts the health of the health at risk.

## Next steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)
