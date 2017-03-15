---
title: Restore Key Vault key and secret for encrypted VMs using Azure Backup | Microsoft Docs
description: Learn how to restore Key Vault key and secret in Azure Backup using PowerShell
services: backup
documentationcenter: ''
author: JPallavi
manager: vijayts
editor: ''

ms.assetid: 45214083-d5fc-4eb3-a367-0239dc59e0f6
ms.service: backup
ms.workload: storage-backup-recovery
ms.tgt_pltfrm: na
ms.devlang: na
ms.topic: article
ms.date: 10/18/2016
ms.author: pajosh
ms.custom: H1Hack27Feb2017

---
# Restore an encrypted virtual machine from an Azure Backup recovery point
This article talks about using Azure VM Backup to perform restore of encrypted Azure VMs, if your key and secret do not exist in the key vault. These steps can also be used if you want to maintain a separate copy of key (Key Encryption Key) and secret (BitLocker Encryption Key) for the restored VM.

## Pre-requisites
1. **Backup encrypted VMs** - Encrypted Azure VMs have been backed up using Azure Backup. Refer the article [Manage backup and restore of Azure VMs using PowerShell](backup-azure-vms-automation.md) for details about how to backup encrypted Azure VMs.
2. **Configure Azure Key Vault** – Ensure that key vault to which keys and secrets need to be restored is already present. Refer the article [Get Started with Azure Key Vault](../key-vault/key-vault-get-started.md) for details about key vault management.

## Setup recovery services vault
Use the following steps to log in to PowerShell and set recovery services vault context

### Log in to Azure PowerShell
Log in to Azure account using the following cmdlet

```
PS C:\> Login-AzureRmAccount
```

### Set recovery services vault context
Once logged in, use the following cmdlet to get the list of your available subscriptions

```
PS C:\> Get-AzureRmSubscription
```

Select the subscription in which resources are available

```
PS C:\> Set-AzureRmContext -SubscriptionId "<subscription-id>"
```

Set the vault context using Recovery Services vault where backup was enabled for encrypted VMs

```
PS C:\> Get-AzureRmRecoveryServicesVault -ResourceGroupName "<rg-name>" -Name "<rs-vault-name>" | Set-AzureRmRecoveryServicesVaultContext
```

### Get recovery point
Select container in the vault that represents encrypted Azure virtual machine

```
PS C:\> $namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -Status "Registered" -Name "<vm-name>"
```

Using this container, get back up item for the corresponding virtual machine

```
PS C:\> $backupitem = Get-AzureRmRecoveryServicesBackupItem -Container $namedContainer -WorkloadType "AzureVM"
```

Get an array of recovery points for the selected backup item in the variable rp

```
PS C:\> $startDate = (Get-Date).AddDays(-7)
PS C:\> $endDate = Get-Date
PS C:\> $rp = Get-AzureRmRecoveryServicesBackupRecoveryPoint -Item $backupitem -StartDate $startdate.ToUniversalTime() -EndDate $enddate.ToUniversalTime()
```

## Restore encrypted virtual machine
Use the following steps to restore encrypted VM, its key and secret.

### Restore key
The array $rp above, is sorted in reverse order of time with the latest recovery point at index 0. For example: $rp[0] selects the latest recovery point.

```
PS C:\> $rp1 = Get-AzureRmRecoveryServicesBackupRecoveryPoint -RecoveryPointId $rp[0].RecoveryPointId -Item $backupItem -KeyFileDownloadLocation "C:\Users\downloads"
```

> [!NOTE]
> After this cmdlet runs successfully, a blob file gets generated in the specified folder on the machine where it is run. This blob file represents Key Encrypted Key in encrypted form.
>
>

Restore key back to the key vault using the following cmdlet.

```
PS C:\> Restore-AzureKeyVaultKey -VaultName "contosokeyvault" -InputFile "C:\Users\downloads\key.blob"
```

### Restore secret
Restore secret data from recovery point obtained above

```
PS C:\> $rp1.KeyAndSecretDetails.SecretUrl

https://contosokeyvault.vault.azure.net/secrets/B3284AAA-DAAA-4AAA-B393-60CAA848AAAA/20aaae9eaa99996d89d99a29990d999a
```

> [!NOTE]
> The text before vault.azure.net represents original key vault name. The text after secrets/ represents secret name.
>
>

Get the secret name and value from the output of the cmdlet run above, in case you want to use the same secret name. In other cases, $secretname below should be updated to use the new secret name.

```
PS C:\> $secretname = "B3284AAA-DAAA-4AAA-B393-60CAA848AAAA"
PS C:\> $secretdata = $rp1.KeyAndSecretDetails.SecretData
PS C:\> $Secret = ConvertTo-SecureString -String $secretdata -AsPlainText -Force
```

Set tags for the secret, in case VM needs to be restored as well. For the tag DiskEncryptionKeyFileName, value should contain name of the secret you plan to use.

```
PS C:\> $Tags = @{'DiskEncryptionKeyEncryptionAlgorithm' = 'RSA-OAEP';'DiskEncryptionKeyFileName' = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA.BEK';'DiskEncryptionKeyEncryptionKeyURL' = 'https://contosokeyvault.vault.azure.net:443/keys/KeyName/84daaac999949999030bf99aaa5a9f9';'MachineName' = 'vm-name'}
```

> [!NOTE]
> Value for DiskEncryptionKeyFileName is same as secret name obtained above. Value for DiskEncryptionKeyEncryptionKeyURL can be obtained from key vault after restoring the keys back and using [Get-AzureKeyVaultKey](https://msdn.microsoft.com/library/dn868053.aspx) cmdlet    
>
>

Set the secret back to the key vault

```
PS C:\> Set-AzureKeyVaultSecret -VaultName "contosokeyvault" -Name $secretname -SecretValue $secret -Tags $Tags -SecretValue $Secret -ContentType  "Wrapped BEK"
```

### Restore virtual machine
The above PowerShell cmdlets help you restore key and secret back to the key vault, if you have backed up encrypted VM using Azure VM Backup. After restoring them, refer the article [Manage backup and restore of Azure VMs using PowerShell](backup-azure-vms-automation.md) to restore encrypted VMs.
