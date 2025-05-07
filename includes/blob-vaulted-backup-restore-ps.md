---
author: AbhishekMallick-MS
ms.service: azure-backup
ms.custom: devx-track-azurepowershell
ms.topic: include
ms.date: 07/01/2024
ms.author: v-abhmallick
---

To  restore from vaulted blob backup, run the following commands:

1. Fetch the backup instance for which you want to perform the restore.

    ```azurepowershell-interactive
    $instance = Get-AzDataProtectionBackupInstance -SubscriptionId "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e" -ResourceGroupName "StorageRG" -VaultName "contosobackupvault" -Name “abc”
    ```

2. Fetch the recovery point you want to use for restoring the data.

    ```azurepowershell-interactive
    $rp = Get-AzDataProtectionRecoveryPoint -SubscriptionId "aaaa0a0a-bb1b-cc2c-dd3d-eeeeee4e4e4e" -ResourceGroupName "StorageRG" -VaultName "contosobackupvault" -BackupInstanceName $instance.Name
    ```

3. Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all the relevant details. The target resource ID is the ARM ID of the alternate storage account where the contents should be restored.

    ```azurepowershell-interactive
    $ResourceId="/subscriptions/xxxxxx /resourceGroups/StorageRG/providers/Microsoft.Storage/storageAccounts/xxxx "
    $restorerequest =Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureBlob -SourceDataStore VaultStore -RestoreType AlternateLocation -BackupInstance $instance -RecoveryPoint $rp[0].Name -TargetResourceId $ResourceId
    ```

4. To restore specific containers, pass the container list explicitly to the `-ContainersList` parameter and also pass the parameter -ItemLevelRecovery.

    ```azurepowershell-interactive
    $restorerequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureBlob -SourceDataStore VaultStore -RestoreType AlternateLocation -RecoveryPoint $rp[0].Name -TargetResourceId $ResourceId -ContainersList "test1" -RestoreLocation "eastus" -ItemLevelRecovery
    ```

5. Trigger the restore with the restore request prepared in the above steps.

    ```azurepowershell-interactive
    Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $instance.Name -ResourceGroupName "StorageRG" -VaultName $TestBkpVault.Name -Parameter $restorerequest
    ```

6. Restore specific blobs based on the prefix match in each container.

To restore specific blobs from vaulted backup, see [this example](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore?view=azps-11.6.0&preserve-view=true#example-10-trigger-vaulted-backup-conatiners-itemlevelrestore-with-prefixmatch-for-azureblob).
