---
title: Restore Key Vault key and secret for encrypted VMs using Azure Backup
description: Learn how to restore Key Vault key and secret in Azure Backup using PowerShell
services: backup
author: sogup
manager: vijayts
ms.service: backup
ms.topic: conceptual
ms.date: 08/28/2017
ms.author: sogup
ms.custom: H1Hack27Feb2017
---
# Restore Key Vault key and secret for encrypted VMs using Azure Backup
This article talks about using Azure VM Backup to perform restore of encrypted Azure VMs, if your key and secret do not exist in the key vault. These steps can also be used if you want to maintain a separate copy of key (Key Encryption Key) and secret (BitLocker Encryption Key) for the restored VM.

## Prerequisites
* **Backup encrypted VMs** - Encrypted Azure VMs have been backed up using Azure Backup. Refer the article [Manage backup and restore of Azure VMs using PowerShell](backup-azure-vms-automation.md) for details about how to backup encrypted Azure VMs.
* **Configure Azure Key Vault** – Ensure that key vault to which keys and secrets need to be restored is already present. Refer the article [Get Started with Azure Key Vault](../key-vault/key-vault-get-started.md) for details about key vault management.
* **Restore disk** - Ensure that you have triggered restore job for restoring disks for encrypted VM using [PowerShell steps](backup-azure-vms-automation.md#restore-an-azure-vm). This is because this job generates a JSON file in your storage account containing keys and secrets for the encrypted VM to be restored.

## Get key and secret from Azure Backup

> [!NOTE]
> Once disk has been restored for the encrypted VM, ensure that:
> 1. $details is populated with restore disk job details, as mentioned in [PowerShell steps in Restore the Disks section](backup-azure-vms-automation.md#restore-an-azure-vm)
> 2. VM should be created from restored disks only **after key and secret is restored to key vault**.
>
>

Query the restored disk properties for the job details.

```
PS C:\> $properties = $details.properties
PS C:\> $storageAccountName = $properties["Target Storage Account Name"]
PS C:\> $containerName = $properties["Config Blob Container Name"]
PS C:\> $encryptedBlobName = $properties["Encryption Info Blob Name"]
```

Set the Azure storage context and restore JSON configuration file containing key and secret details for encrypted VM.

```
PS C:\> Set-AzureRmCurrentStorageAccount -Name $storageaccountname -ResourceGroupName '<rg-name>'
PS C:\> $destination_path = 'C:\vmencryption_config.json'
PS C:\> Get-AzureStorageBlobContent -Blob $encryptedBlobName -Container $containerName -Destination $destination_path
PS C:\> $encryptionObject = Get-Content -Path $destination_path  | ConvertFrom-Json
```

## Restore key
Once the JSON file is generated in the destination path mentioned above, generate key blob file from the JSON and feed it to restore key cmdlet to put the key (KEK) back in the key vault.

```
PS C:\> $keyDestination = 'C:\keyDetails.blob'
PS C:\> [io.file]::WriteAllBytes($keyDestination, [System.Convert]::FromBase64String($encryptionObject.OsDiskKeyAndSecretDetails.KeyBackupData))
PS C:\> Restore-AzureKeyVaultKey -VaultName '<target_key_vault_name>' -InputFile $keyDestination
```

## Restore secret
Use the JSON file generated above to get secret name and value and feed it to set secret cmdlet to put the secret (BEK) back in the key vault. **Use these cmdlets if your VM is encrypted using BEK and KEK.**

```
PS C:\> $secretdata = $encryptionObject.OsDiskKeyAndSecretDetails.SecretData
PS C:\> $Secret = ConvertTo-SecureString -String $secretdata -AsPlainText -Force
PS C:\> $secretname = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA'
PS C:\> $Tags = @{'DiskEncryptionKeyEncryptionAlgorithm' = 'RSA-OAEP';'DiskEncryptionKeyFileName' = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA.BEK';'DiskEncryptionKeyEncryptionKeyURL' = $encryptionObject.OsDiskKeyAndSecretDetails.KeyUrl;'MachineName' = 'vm-name'}
PS C:\> Set-AzureKeyVaultSecret -VaultName '<target_key_vault_name>' -Name $secretname -SecretValue $Secret -ContentType  'Wrapped BEK' -Tags $Tags
```

If your VM is **encrypted using BEK only**, generate secret blob file from the JSON and feed it to restore secret cmdlet to put the secret (BEK) back in the key vault.

```
PS C:\> $secretDestination = 'C:\secret.blob'
PS C:\> [io.file]::WriteAllBytes($secretDestination, [System.Convert]::FromBase64String($encryptionObject.OsDiskKeyAndSecretDetails.KeyVaultSecretBackupData))
PS C:\> Restore-AzureKeyVaultSecret -VaultName '<target_key_vault_name>' -InputFile $secretDestination -Verbose
```

> [!NOTE]
> 1. Value for $secretname can be obtained by referring to the output of $encryptionObject.OsDiskKeyAndSecretDetails.SecretUrl and using text after secrets/ e.g. output secret URL is https://keyvaultname.vault.azure.net/secrets/B3284AAA-DAAA-4AAA-B393-60CAA848AAAA/xx000000xx0849999f3xx30000003163 and secret name is B3284AAA-DAAA-4AAA-B393-60CAA848AAAA
> 2. Value of the tag DiskEncryptionKeyFileName is same as secret name.
>
>

## Create virtual machine from restored disk
If you have backed up encrypted VM using Azure VM Backup, the PowerShell cmdlets mentioned above help you restore key and secret back to the key vault. After restoring them, refer the article [Manage backup and restore of Azure VMs using PowerShell](backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create encrypted VMs from restored disk, key, and secret.

## Legacy approach
The approach mentioned above would work for all the recovery points. However, the older approach of getting key and secret information from recovery point, would be valid for recovery points older than July 11, 2017 for VMs encrypted using BEK and KEK. Once restore disk job is complete for encrypted VM using [PowerShell steps](backup-azure-vms-automation.md#restore-an-azure-vm), ensure that $rp is populated with a valid value.

### Restore key
Use the following cmdlets to get key (KEK) information from recovery point and feed it to restore key cmdlet to put it back in the key vault.

```
PS C:\> $rp1 = Get-AzureRmRecoveryServicesBackupRecoveryPoint -RecoveryPointId $rp[0].RecoveryPointId -Item $backupItem -KeyFileDownloadLocation 'C:\Users\downloads'
PS C:\> Restore-AzureKeyVaultKey -VaultName '<target_key_vault_name>' -InputFile 'C:\Users\downloads'
```

### Restore secret
Use the following cmdlets to get secret (BEK) information from recovery point and feed it to set secret cmdlet to put it back in the key vault.

```
PS C:\> $secretname = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA'
PS C:\> $secretdata = $rp1.KeyAndSecretDetails.SecretData
PS C:\> $Secret = ConvertTo-SecureString -String $secretdata -AsPlainText -Force
PS C:\> $Tags = @{'DiskEncryptionKeyEncryptionAlgorithm' = 'RSA-OAEP';'DiskEncryptionKeyFileName' = 'B3284AAA-DAAA-4AAA-B393-60CAA848AAAA.BEK';'DiskEncryptionKeyEncryptionKeyURL' = 'https://mykeyvault.vault.azure.net:443/keys/KeyName/84daaac999949999030bf99aaa5a9f9';'MachineName' = 'vm-name'}
PS C:\> Set-AzureKeyVaultSecret -VaultName '<target_key_vault_name>' -Name $secretname -SecretValue $secret -Tags $Tags -SecretValue $Secret -ContentType  'Wrapped BEK'
```

> [!NOTE]
> 1. Value for $secretname can be obtained by referring to the output of $rp1.KeyAndSecretDetails.SecretUrl and using text after secrets/ e.g. output secret URL is https://keyvaultname.vault.azure.net/secrets/B3284AAA-DAAA-4AAA-B393-60CAA848AAAA/xx000000xx0849999f3xx30000003163 and secret name is B3284AAA-DAAA-4AAA-B393-60CAA848AAAA
> 2. Value of the tag DiskEncryptionKeyFileName is same as secret name.
> 3. Value for DiskEncryptionKeyEncryptionKeyURL can be obtained from key vault after restoring the keys back and using [Get-AzureKeyVaultKey](https://docs.microsoft.com/powershell/module/azurerm.keyvault/get-azurekeyvaultkey) cmdlet
>
>

## Next steps
After restoring key and secret back to key vault, refer the article [Manage backup and restore of Azure VMs using PowerShell](backup-azure-vms-automation.md#create-a-vm-from-restored-disks) to create encrypted VMs from restored disk, key and secret.
