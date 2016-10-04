<properties
	pageTitle="Restore Key Vault key and secret using Azure Backup | Microsoft Azure"
	description="Learn how to restore Key Vault key and secret in Azure Backup using PowerShell"
	services="backup"
	documentationCenter=""
	authors="JPallavi"
	manager="vijayts"
	editor=""/>

<tags
	ms.service="backup"
	ms.workload="storage-backup-recovery"
	ms.tgt_pltfrm="na"
	ms.devlang="na"
	ms.topic="article"
	ms.date="04/10/2016"
	ms.author="JPallavi" />

# Restore Key Vault key and secret using Azure Backup
This article talks about using Azure VM Backup to perform restore of encrypted Azure VMs, if your key and secret do not exist in the key vault.

## Pre-requisites

1. **Backup of encrypted VMs** - Encrypted Azure VMs have been backed up using Azure Backup. Refer the article [Deploy and manage backups using Azure PowerShell](backup-azure-vms-automation.md) for details about how to backup encrypted Azure VMs.

2. **Configure Azure Key Vault** – Ensure that key vault to which keys and secrets need to be restored is already present. Refer the article [Get Started with Azure Key Vault](../key-vault/key-vault-get-started.md) for details about key vault management.

## Log in to Azure PowerShell 

Log in to Azure account using the following cmdlet

```
PS C:\> Login-AzureRmAccount
```

## Set recovery services vault context

Once logged in, use the following cmdlet to get the list of your available subscriptions

```
PS C:\> Get-AzureRmSubscription
```

Select the subscription in which resources are available

```
PS C:\> Set-AzureRmContext -SubscriptionId "subscription-id"
```

Set the vault context using Recovery Services vault where backup was enabled for encrypted VMs

```
PS C:\> Get-AzureRmRecoveryServicesVault -ResourceGroupName "rg-name" -Name "rs-vault-name" | Set-AzureRmRecoveryServicesVaultContext
```

## Get recovery point 

Select container in the vault that represents encrypted Azure virtual machine

```
PS C:\> $namedContainer = Get-AzureRmRecoveryServicesBackupContainer -ContainerType "AzureVM" -Status "Registered" -Name "vm-name"
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

## Restore key

The array $rp above, is sorted in reverse order of time with the latest recovery point at index 0. For example: $rp[0] selects the latest recovery point.

```
PS C:\> $rp1 = Get-AzureRmRecoveryServicesBackupRecoveryPoint -RecoveryPointId $rp[0].RecoveryPointId -Item $backupItem -KeyFileDownloadLocation "C:\Users\downloads"
```

**Note:** After this cmdlet runs successfully, a blob file gets generated in the specified folder on the machine where it is run. This blob file represents Key Encrypted Key in encrypted form.

Restore key back to the key vault using the following cmdlet

```
PS C:\> Restore-AzureKeyVaultKey -VaultName "contosokeyvault" -InputFile "C:\Users\ downloads\key.blob"
```

## Restore secret

Get secret data from recovery point obtained above

```
PS C:\> $rp1.KeyAndSecretDetails.SecretUrl

https://contosokeyvault.vault.azure.net/secrets/B3284AAA-DAAA-4AAA-B393-60CAA848AAAA/20aaae9eaa99996d89d99a29990d999a
```

**Note:** The text before vault.azure.net represents key vault name. The text after secrets/ represents secret name. 

Get the secret name and value from the output of the cmdlet run above

```
PS C:\> $secretname = "B3284AAA-DAAA-4AAA-B393-60CAA848AAAA"
PS C:\> $secretdata = $rp1.KeyAndSecretDetails.SecretData
PS C:\> $Secret = ConvertTo-SecureString -String $secretdata -AsPlainText -Force
```

Set tags for the secret, in case VM needs to be restored as well

```
PS C:\> $Tags = @{'DiskEncryptionKeyEncryptionAlgorithm' = 'RSA-OAEP';'DiskEncryptionKeyFileName' = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA.BEK';'DiskEncryptionKeyEncryptionKeyURL' = 'https://contosokeyvault.vault.azure.net:443/keys/KeyName/84daaac999949999030bf99aaa5a9f9';'MachineName' = 'vm-name'}
```

**Note:** Value for DiskEncryptionKeyFileName is same as secret name obtained above. Value for DiskEncryptionKeyEncryptionKeyURL can be obtained from key vault after restoring the keys back and using [Get-AzureKeyVaultKey](https://msdn.microsoft.com/library/dn868053.aspx) cmdlet	

Set the secret back to the key vault

```
PS C:\> Set-AzureKeyVaultSecret -VaultName "contosokeyvault" -Name $secretname -SecretValue $secret -Tags $Tags -SecretValue $Secret -ContentType  "Wrapped BEK"
```

## Restore virtual machine
The above PowerShell cmdlets help you restore key and secret back to the key vault, if you have backed up encrypted VM using Azure VM Backup. After restoring them, refer the article [Deploy and manage Azure VMs](backup-azure-vms-automation.md) to restore encrypted VMs.
