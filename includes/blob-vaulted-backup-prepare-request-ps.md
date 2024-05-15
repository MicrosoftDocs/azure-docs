---
author: AbhishekMallick-MS
ms.service: backup
ms.topic: include
ms.date: 05/14/2024
ms.author: v-abhmallick
---

Once all the relevant permissions are set, you can configure backup by following these steps.

Create a new backup configuration object to specify the set of containers you want to back up. To back up all containers, pass -IncludeAllContainer parameter. If you want to back up specific containers, pass the list of containers to `-VaultedBackupContainer parameter`. 

```azurepowershell-interactive
$backupConfig=New-AzDataProtectionBackupConfigurationClientObject -DatasourceType AzureBlob -IncludeAllContainer -StorageAccountResourceGroupName "StorageRG" -StorageAccountName "testpscmd"
```

Prepare the relevant request by using the relevant vault, policy, storage account, and the backup configuration object created in the above step using the [Initialize-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/initialize-azdataprotectionbackupinstance) command.  

```azurepowershell-interactive
$instance=Initialize-AzDataProtectionBackupInstance -DatasourceType AzureBlob -DatasourceLocation $TestBkpVault.Location -PolicyId $blobBkpPol.Id -DatasourceId $SAId -BackupConfiguration $backupConfig
```

Submit the request to protect the blobs within the storage account using the [New-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/new-azdataprotectionbackupinstance) command.

```azurepowershell-interactive
New-AzDataProtectionBackupInstance -ResourceGroupName "StorageRG" -VaultName $TestBkpVault.Name -BackupInstance $instance
```

 