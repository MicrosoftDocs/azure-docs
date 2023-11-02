---
title: Restore Azure blobs via Azure PowerShell
description: Learn how to restore Azure blobs to any point-in-time using Azure PowerShell.
ms.topic: conceptual
ms.custom: devx-track-azurepowershell
ms.date: 05/05/2021
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure blobs to point-in-time using Azure PowerShell

This article describes how to restore [blobs](blob-backup-overview.md) to any point-in-time using Azure Backup.

> [!IMPORTANT]
> Support for Azure blobs is available from Az 5.9.0 version.

> [!IMPORTANT]
> Before proceeding to restore Azure blobs using Azure Backup, see [important points](blob-restore.md#before-you-start).

In this article, you'll learn how to:

- Restore Azure blobs to point-in-time

- Track the restore operation status

We will refer to an existing backup vault _TestBkpVault_, under the resource group _testBkpVaultRG_ in the examples.

```azurepowershell-interactive
$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault -ResourceGroupName "testBkpVaultRG"
```

## Restoring Azure blobs within a storage account

### Fetching the valid time range for restore

As the operational backup for blobs is continuous, there are no distinct points to restore from. Instead, we need to fetch the valid time-range under which blobs can be restored to any point-in-time. In this example, let's check for valid time-ranges to restore within the last 30 days.

```azurepowershell-interactive
$startDate = (Get-Date).AddDays(-30)
$endDate = Get-Date
```

First fetch all instances using [Get-AzDataProtectionBackupInstance](/powershell/module/az.dataprotection/get-azdataprotectionbackupinstance) command and identify the relevant instance.

```azurepowershell-interactive
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name
```

You can also use Az.Resourcegraph and the [Search-AzDataProtectionBackupInstanceInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionbackupinstanceinazgraph) command to search across instances in many vaults and subscriptions.

```azurepowershell-interactive
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -DatasourceType AzureBlob -ProtectionStatus ProtectionConfigured
```

Once the instance is identified then fetch the relevant recovery range using the [Find-AzDataProtectionRestorableTimeRange](/powershell/module/az.dataprotection/find-azdataprotectionrestorabletimerange) command.

```azurepowershell-interactive
Find-AzDataProtectionRestorableTimeRange -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstanceName $AllInstances[2].BackupInstanceName -StartTime $startDate -endTime $endDate

EndTime    : 2021-04-24T08:57:36.4149422Z
ObjectType : RestorableTimeRange
StartTime  : 2021-03-25T14:27:31.0000000Z

$DesiredPIT = (Get-Date -Date "2021-04-23T02:47:02.9500000Z")
```

### Preparing the restore request

Once the point-in-time to restore is fixed, there are multiple options to restore. Use the [Initialize-AzDataProtectionRestoreRequest](/powershell/module/az.dataprotection/initialize-azdataprotectionrestorerequest) command to prepare the restore request with all relevant details.

#### Restoring all the blobs to a point-in-time

Using this option restores all block blobs in the storage account by rolling them back to the selected point in time. Storage accounts containing large amounts of data or witnessing a high churn may take longer times to restore.

```azurepowershell-interactive
$restorerequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureBlob -SourceDataStore OperationalStore -RestoreLocation $TestBkpVault.Location  -RestoreType OriginalLocation -PointInTime (Get-Date -Date "2021-04-23T02:47:02.9500000Z") -BackupInstance $AllInstances[2]
```

#### Restoring selected containers

Using this option allows you to browse and select up to 10 containers to restore.

```azurepowershell-interactive
$restorerequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureBlob -SourceDataStore OperationalStore -RestoreLocation $TestBkpVault.Location  -RestoreType OriginalLocation -PointInTime (Get-Date -Date "2021-04-23T02:47:02.9500000Z") -BackupInstance $AllInstances[2] -ItemLevelRecovery -ContainersList "abc","xyz"
```

#### Restoring containers using a prefix match

This option lets you restore a subset of blobs using a prefix match. You can specify up to 10 lexicographical ranges of blobs within a single container or across multiple containers to return those blobs to their previous state at a given point in time. Here are a few things to keep in mind:

- You can use a forward slash (/) to delineate the container name from the blob prefix
- The start of the range specified is inclusive, however the specified range is exclusive.

[Learn more](blob-restore.md#use-prefix-match-for-restoring-blobs) about using prefixes to restore blob ranges.

```azurepowershell-interactive
$restorerequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureBlob -SourceDataStore OperationalStore -RestoreLocation $TestBkpVault.Location  -RestoreType OriginalLocation -PointInTime (Get-Date -Date "2021-04-23T02:47:02.9500000Z") -BackupInstance $AllInstances[2] -ItemLevelRecovery -FromPrefixPattern "containerabc/aaa","containerabc/ccc" -ToPrefixPattern "containerabc/bbb","containerabc/ddd"
```

### Trigger the restore

Use the [Start-AzDataProtectionBackupInstanceRestore](/powershell/module/az.dataprotection/start-azdataprotectionbackupinstancerestore) command to trigger the restore with the request prepared above.

```azurepowershell-interactive
Start-AzDataProtectionBackupInstanceRestore -BackupInstanceName $AllInstances[2].BackupInstanceName -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Parameter $restorerequest
```

## Tracking job

Track all jobs using the [Get-AzDataProtectionJob](/powershell/module/az.dataprotection/get-azdataprotectionjob) command. You can list all jobs and fetch a particular job detail.

You can also use Az.ResourceGraph to track all jobs across all backup vaults. Use the [Search-AzDataProtectionJobInAzGraph](/powershell/module/az.dataprotection/search-azdataprotectionjobinazgraph) command to get the relevant job which can be across any backup vault.

```azurepowershell-interactive
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureBlob -Operation Restore
```

## Next steps

[Overview of Azure blob backup](blob-backup-overview.md)
