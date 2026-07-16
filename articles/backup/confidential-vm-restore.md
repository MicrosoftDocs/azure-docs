---
title: Azure Backup - Restore Confidential VM using Azure Backup (preview)
description: Learn about restoring Confidential VM with Platform Managed Key (PMK) or Customer Managed Key (CMK) using Azure Backup.
ms.topic: how-to
ms.date: 02/03/2026
ms.custom: references_regions
ms.service: azure-backup
author: AbhishekMallick-MS
ms.author: v-mallicka
---

# Restore Confidential VM using Azure Backup (preview)

[!INCLUDE [Confidential VM backup preview advisory.](../../includes/confidential-vm-backup-preview.md)]

This article describes how to restore Confidential VM (CVM) encrypted with Platform Managed Key (PMK) or Customer Managed Key (CMK) using Azure Backup. It covers restore scenarios based on encryption key and Disk Encryption Set (DES) states, and provides the recovery procedure for restore failures. It also provides the procedure to extract virtual machine encryption details, restore missing keys, and assign necessary permissions.

Learn about the [supported scenarios for Confidential VM backup](backup-support-matrix-iaas.md#support-for-confidential-vm-backup-preview).

## Prerequisites

Before you start the Confidential VM restore process, ensure you have the recovery points available in the Recovery Services vault.

## Restore scenarios for a Confidential VM

Confidential VM restore behavior depends on the state of the DES, Key Vault, and keys at the time of restore. Key restore scenarios include:

- **Original Key or Key Version intact**: Restore succeeds if the original Disk Encryption Set (DES) and key remain intact.
- **Key Rotation**: Restore succeeds when a new key version is active, provided the previous key version isn't expired or deleted.
- **Key Change**: If the DES uses a new key in the same key vault, restore succeeds only if the original key, used during backup still exists. It fails if the original key is deleted. If you're using a different key vault - it should point to the same key as the original one.
- **DES or Key Deleted**: Restore fails with errors, such as `UserErrorDiskEncryptionSetDoesNotExist` or `UserErrorDiskEncryptionSetKeyDoesNotExist`. To resolve, re-create the key and DES using restored key data, then retry the restore.
- **Input DES Provided**: If you provide a new DES created from restored key data, restore succeeds if the key and version match the ones used at backup time.
- **Mismatched DES or Key**: Restore fails with `UserErrorInputDESKeyDoesNotMatchWithOriginalKey`. To resolve this error, restore the missing keys.

Learn how to [restore missing keys for Confidential VM restore](#restore-missing-keys-for-confidential-vm-restore).

## Restore a Confidential VM

### Restore with original key intact
During the restore process, you can continue without providing a Disk encryption set input when the original Customer Managed Key (CMK), Key Vault, mHSM, and DES are available. In these scenarios, you can continue the restore process as usual. [Learn how to restore an Azure VM](backup-azure-arm-restore-vms.md).

### Restore when original key is rotated, lost, or compromised
The restore process fails if the original CMK, Key Vault, mHSM, or DES referencing the CMK is unavailable, or if backup can't access the original CMK. In such cases, the initial restore attempt fails, and the CVM won't restore. To address this, follow these steps:
1.	Trigger the first restore operation without providing the disk encryption set input. This attempt fails due to the missing key, but it results in the key being restored in the storage account.
1. After this process, restore the Customer Managed Key that was backed up by Azure Backup, then create a new DES that points to the recovered key. Learn how to [restore missing keys](#restore-missing-keys-for-confidential-vm-restore) and [assign required permissions](#assign-permissions-to-des-and-confidential-guest-vm-agent-for-restore).
1. Initiate the restore operation again on the Restore page, this time entering the appropriate Disk Encryption Set.

> [!NOTE]
> Restoring from a different DES - even if it uses the correct key - isn't currently supported from the snapshot-only tier restore points.

## Restore missing keys for Confidential VM restore

If the restore operation fails, you need to restore the keys that Azure Backup backed up. 

To restore the key using PowerShell, follow these steps:

1. To select the vault containing the protected CVM + CMK, enter the resource group and name of the vault in the cmdlet, and then run the cmdlet.

   ```azurepowershell
   $vault = Get-AzRecoveryServicesVault -ResourceGroupName "<vault-rg>" -Name "<vault-name>"
   ```

2. To list all failed restore jobs from the last seven days, run the following cmdlet. If you want to fetch older jobs, update the day range in the cmdlet.

   ```azurepowershell
   $Jobs = Get-AzRecoveryServicesBackupJob -From (Get-Date).AddDays(-7).ToUniversalTime() -Status Failed -Operation Restore -VaultId $vault.ID
   ```

3. To select the failed restore job from the result and get the job details, run the following cmdlet:

   *Example*

   ```azurepowershell
   $JobDetails = Get-AzRecoveryServicesBackupJobDetail -Job $Jobs[0] -VaultId $vault.ID
   ```

4. To get all the necessary parameters required for key restore from the job details, run the following cmdlet:

   ```azurepowershell
   $properties = $JobDetails.properties
   $storageAccountName = $properties["Target Storage Account Name"]
   $containerName = $properties["Config Blob Container Name"]
   $securedEncryptionInfoBlobName = $properties["Secured Encryption Info Blob Name"]
   ```

5. To select the target storage account used for restore, enter its resource group in the following cmdlet, and then run the cmdlet:


   ```azurepowershell
   Set-AzCurrentStorageAccount -Name $storageaccountname -ResourceGroupName '<storage-account-rg >'
   ```

6. To restore the JSON configuration file containing key details for CVM with CMK, run the following cmdlet:

   ```azurepowershell
   $destination_path = 'C:\cvmcmkencryption_config.json'
   Get-AzStorageBlobContent -Blob $securedEncryptionInfoBlobName -Container $containerName -Destination $destination_path
   $encryptionObject = Get-Content -Path $destination_path | ConvertFrom-Json 
   ```

7. After the JSON file is generated in the destination path mentioned previously, generate key blob file from the JSON data by running the following cmdlet:

   ```azurepowershell
   $keyDestination = 'C:\keyDetails.blob'
   [io.file]::WriteAllBytes($keyDestination, [System.Convert]::FromBase64String($encryptionObject.OsDiskEncryptionDetails.KeyBackupData)) 
   ```

8. To restore the key back in the Key Vault or Managed Hardware Security Module (HSM), run the following cmdlet:

   ```azurepowershell
   Restore-AzKeyVaultKey -VaultName '<target_key_vault_name> ' -InputFile $keyDestination
   For MHSM Use,  
   Restore-AzKeyVaultKey -HsmName '<target_mhsm_name>' -InputFile $keyDestination
   ```

Now, you can create a new DES with Encryption type as *Confidential disk encryption with CMK*, which should point to the restored key. This DES should have enough permissions to perform a successful restore. If you use a new Key Vault or Managed HSM to restore the key, then *Backup Management Service* has enough permissions on it. [Learn how to grant permission for Key Vault or Managed HSM access](confidential-vm-backup.md#assign-permissions-for-confidential-vm-backup).

## Assign permissions to DES and Confidential Guest VM Agent for restore

Disk Encryption Set and Confidential Guest VM Agent need permissions on the Key Vault or Managed HSM. To provide the permissions, follow these steps:

**For Key vault**: To grant permissions to the Key vault, you can follow [these steps in the documentation](/azure/key-vault/general/assign-access-policy?tabs=azure-portal) or follow these steps:
1. Navigate to the Disk encryption set instance.
1. Select the message *To associate a disk, image, or snapshot with this disk encryption set, you must grant permissions to the key vault* and grant permissions. 

**For Managed HSM**: To grant permissions to the Managed HSM, follow these steps:

1. Assign newly created DES with the Managed HSM Crypto User Role:

   1. In the [Azure portal](https://portal.azure.com/), go to **Managed HSM** > **Settings**, and then select **Local RBAC**.
   2. To add a new Role Assignment, select **Add**.
   3. Under **Role**, select **Managed HSM Crypto User Role**.
   4. Under **Scope**, select the restored key. You can also select **All Keys**.
   5. On the **Security principal**, select *newly created DES*.

2. Assign required permissions to the Confidential Guest VM Agent for booting up CVM:

   1. In the [Azure portal](https://portal.azure.com/), go to **Managed HSM** > **Settings**, and then select **Local RBAC**.
   2. To add a new Role Assignment, select **Add**.
   3. Under **Role**, select **Managed HSM Crypto Service Encryption User**.
   4. Under **Scope**, select the restored key. You can also select **All Keys**.
   5. On the **Security principal**, select **Confidential Guest VM Agent**.

## Related content

- [Support matrix for Confidential VM backup](backup-support-matrix-iaas.md#support-for-confidential-vm-backup-preview).
- [Back up CVM using Azure Backup (preview)](confidential-vm-backup.md).
