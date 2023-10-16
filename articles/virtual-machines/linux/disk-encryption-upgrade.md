---
title: How to upgrade Azure Disk Encryption on a disk
description: This article provides instructions on upgrading Azure Disk Encryption on a disk
author: msmbaldwin
ms.service: virtual-machines
ms.subservice: disks
ms.topic: how-to
ms.author: mbaldwin
ms.date: 05/27/2021
ms.custom: seodec18, devx-track-linux
---

# Upgrading the Azure Disk Encryption version

The first version of Azure Disk Encryption (ADE) relied on Microsoft Entra ID for authentication; the current version does not.  We strongly encourage the use of the newest version.

## Determine ADE version

The versions of ADE in scope for migration are:
- **Windows**: 1.1.* (ADE on the VM must be upgraded to 2.2)
- **Linux**: 0.1.* (ADE on the VM must be upgraded to 1.2)

You can determine the version of ADE with which a VM was encrypted via Azure CLI, Azure PowerShell, or the Azure portal.

# [CLI](#tab/CLI)

To determine the ADE version, run the Azure CLI [az vm get-instance-view](/cli/azure/vm#az-vm-get-instance-view) command.

```azurecli-interactive
az vm get-instance-view --resource-group  <ResourceGroupName> --name <VMName> 
```

Locate the AzureDiskEncryption extension in the output and identify the version number from the "TypeHandlerVersion" field in the output.

# [PowerShell](#tab/PowerShell)

To determine the ADE version, run the Azure PowerShell [Get-AzVM](/powershell/module/az.compute/get-azvm) command.

```azurepowershell-interactive
Get-AzVM -ResourceGroupName <ResourceGroupName> -Name <VMName> -Status
```

Locate the AzureDiskEncryption extension in the output and identify the version number from the "TypeHandlerVersion" field in the output.

# [Portal](#tab/Portal)

Go to the "Extensions" blade of your VM in the Azure portal.

:::image type="content" source="../media/disk-encryption/ade-version-1.png" alt-text="finding ADE version portal screenshot 1":::

Choose the "AzureDiskEncryption" extension for Windows or "AzureDiskEncryptionForLinux" extension for Linux, and locate the version number in the "Version"" field.

:::image type="content" source="../media/disk-encryption/ade-version-2.png" alt-text="finding ADE version portal screenshot 2":::

---

## How to migrate

Migration from Azure Disk Encryption (with Microsoft Entra ID) to Azure Disk Encryption (without Microsoft Entra ID) is only available through Azure PowerShell. Ensure you have the latest version of Azure PowerShell and at least the [Azure PowerShell Az module version 5.9.0](/powershell/azure/new-azureps-module-az) installed .

To upgrade from Azure Disk Encryption (with Microsoft Entra ID) to Azure Disk Encryption (without Microsoft Entra ID), use the [Set-AzVMDiskEncryptionExtension](/powershell/module/az.compute/set-azvmdiskencryptionextension) PowerShell cmdlet.

> [!WARNING]
> The Set-AzVMDiskEncryptionExtension cmdlet must only be used on VMs encrypted with Azure Disk Encryption (with Microsoft Entra ID). Attempting to migrate an unencrypted VM, or a VM encrypted with Azure Disk Encryption (without Microsoft Entra ID), will result in a terminal error.

```azurepowershell-interactive
Set-AzVMDiskEncryptionExtension -ResourceGroupName <resourceGroupName> -VMName <vmName> -Migrate
```

When the cmdlet prompts you for confirmation, enter "Y".  The ADE version will be updated and the VM rebooted. The output will look similar to the following:

```output
Update AzureDiskEncryption version?
This cmdlet updates Azure Disk Encryption version to single pass (Azure Disk Encryption without Azure AD). This may reboot
the machine and takes 10-15 minutes to finish. Are you sure you want to continue?
[Y] Yes  [N] No  [S] Suspend  [?] Help (default is "Y"): Y
Azure Disk Encryption Extension Public Settings
"KeyVaultResourceId": /subscriptions/ea500758-3163-4849-bd2c-3e50f06efa7a/resourceGroups/myResourceGroup/providers/Microsoft.KeyVault/vaults/myKeyVault
"SequenceVersion":
"MigrateFlag": Migrate
"KeyVaultURL": https://myKeyVault.vault.azure.net/
"Azure ADClientID": d29edf8c-3fcb-42e7-8410-9e39fdf0dd70
"KeyEncryptionKeyURL":
"KekVaultResourceId":
"EncryptionOperation": EnableEncryption
"Azure ADClientCertThumbprint":
"VolumeType":
"KeyEncryptionAlgorithm":

Running ADE extension (with Azure AD) for -Migrate..
ADE extension (with Azure AD) is now complete. Updating VM model..
Running ADE extension (without Azure AD) for -Migrate..
ADE extension (without Azure AD) is now complete. Clearing VM model..

RequestId IsSuccessStatusCode StatusCode ReasonPhrase
--------- ------------------- ---------- ------------
                         True         OK OK
```

> [!IMPORTANT]
> The upgrade will take at least 10 - 15 minutes to complete. Do not cancel the cmdlet while the upgrade is in progress. Doing so puts the health of the VM at risk.

## Next steps

- [Azure Disk Encryption troubleshooting](disk-encryption-troubleshooting.md)
