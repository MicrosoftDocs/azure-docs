---
title: Restore Azure Kubernetes Service (AKS) using PowerShell
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure PowerShell.
ms.topic: how-to
ms.service: backup
ms.date: 05/13/2024
ms.custom:
  - devx-track-azurepowershell
  - ignite-2023
  - engagement-fy24
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Kubernetes Service using PowerShell 

This article describes how to restore Azure Kubernetes cluster from a restore point created by Azure Backup using Azure PowerShell.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

You can perform both *Original-Location Recovery (OLR)* (restoring in the AKS cluster that was backed up) and *Alternate-Location Recovery (ALR)* (restoring in a different AKS cluster). You can also select the items to be restored from the backup that is Item-Level Recovery (ILR).

>[!Note]
>Before you initiate a restore operation, the target cluster should have Backup Extension installed and Trusted Access enabled for the Backup vault. [Learn more](azure-kubernetes-service-cluster-backup-using-powershell.md#prepare-aks-cluster-for-backup).

Initialize the variables with required details related to each resource to be used in commands:

- Subscription ID of the Backup Vault

    ```azurepowershell
    $vaultSubId = "xxxxxxxx-xxxx-xxxx-xxxx"
    ```
- Resource Group to which Backup Vault belongs to

    ```azurepowershell
    $vaultRgName = "testBkpVaultRG"
    ```

- Name of the Backup Vault

    ```azurepowershell
    $vaultName = "TestBkpVault"
    ```
- Region to which the Backup Vault belongs to

    ```azurepowershell
    $restoreLocation = "vaultRegion" #example eastus
    ```

- ID of the target AKS cluster, in case the restore will be performed to an alternate AKS cluster

    ```azurepowershell
    $targetAKSClusterId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/Microsoft.ContainerService/managedClusters/PSAKSCluster2"
    ```

## Before you start

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-to-an-aks-cluster) to define parameters based on the cluster resources that will be restored.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#register-the-trusted-access) between the Backup vault and the AKS cluster.

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Restore to an AKS cluster 

### Fetch the relevant recovery point

Fetch all instances using the `Get-AzDataProtectionBackupInstance` cmdlet and identify the relevant instance.

```azurepowershell
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName $vaultRgName -VaultName $vaultName
```

You can also use `Az.Resourcegraph` and `Search-AzDataProtectionBackupInstanceInAzGraph` cmdlets to search across instances in multiple vaults and subscriptions.

```azurepowershell
$AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -Subscription $vaultSubId -ResourceGroup $vaultRgName -Vault $vaultName -DatasourceType AzureKubernetesService  -ProtectionStatus ProtectionConfigured
```

Once the instance is identified, fetch the relevant recovery point. Supposedly, from the output array of the above command, third backup instance is to be restored.

```azurepowershell
$rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName $vaultRgName -VaultName $vaultName -BackupInstanceName $AllInstances[2].BackupInstanceName
```

### Prepare the restore request

Use the `New-AzDataProtectionRestoreConfigurationClientObject` cmdlet to prepare the restore configuration and defining the items to be restored to the target AKS cluster.

```azurepowershell
$aksRestoreCriteria = New-AzDataProtectionRestoreConfigurationClientObject -DatasourceType AzureKubernetesService  -PersistentVolumeRestoreMode RestoreWithVolumeData  -IncludeClusterScopeResource $true -NamespaceMapping  @{"sourceNamespace"="targetNamespace"}
```

Then, use the `Initialize-AzDataProtectionRestoreRequest` cmdlet to prepare the restore request with all relevant details.

In case you want to perform restore to the original AKS cluster backedup, use the below format for the cmdlet

```azurepowershell
$aksRestoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureKubernetesService  -SourceDataStore OperationalStore -RestoreLocation $restoreLocation -RestoreType OriginalLocation -RecoveryPoint $rp[0].Property.RecoveryPointId -RestoreConfiguration $aksRestoreCriteria -BackupInstance $AllInstances[2]
```
In case you want to perform restore to an alternate AKS cluster, use the below format for the cmdlet

```azurepowershell
$aksRestoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureKubernetesService  -SourceDataStore OperationalStore -RestoreLocation $restoreLocation -RestoreType AlternateLocation -TargetResourceId $targetAKSClusterId -RecoveryPoint $rp[0].Property.RecoveryPointId -RestoreConfiguration $aksRestoreCriteria -BackupInstance $AllInstances[2]
```

## Trigger the restore

Before you trigger the restore operation, validate the restore request created earlier.

```azurepowershell
$validateRestore = Test-AzDataProtectionBackupInstanceRestore -SubscriptionId $vaultSubId  -ResourceGroupName $vaultRgName -VaultName $vaultName -RestoreRequest $aksRestoreRequest -Name $AllInstances[2].BackupInstanceName
```

>[!Note]
>During the restore operation, the Backup vault and the AKS cluster need to have certain roles assigned to perform the restore:

1. *Target AKS* cluster should have *Contributor* role on the *Snapshot Resource Group*.
2. The *User Identity* attached with the Backup Extension should have *Storage Account Contributor* roles on the *storage account* where backups are stored. 
3. The *Backup vault* should have a *Reader* role on the *Target AKS cluster* and *Snapshot Resource Group*.

Now, use the `Start-AzDataProtectionBackupInstanceRestore` cmdlet to trigger the restore operation with the request prepared earlier.

```azurepowershell
$restoreJob = Start-AzDataProtectionBackupInstanceRestore -SubscriptionId $vaultSubId  -ResourceGroupName $vaultRgName -VaultName $vaultName -BackupInstanceName $AllInstances[2].BackupInstanceName -Parameter $aksRestoreRequest
```

## Tracking job

Track all the jobs using the `Get-AzDataProtectionJob` cmdlet. You can list all jobs and fetch a particular job detail. You can also use `Az.ResourceGraph` to track all jobs across all Backup vaults.

Use the `Search-AzDataProtectionJobInAzGraph` cmdlet to get the relevant job, which can be across any Backup vault.

```azurepowershell
$job = Search-AzDataProtectionJobInAzGraph -Subscription -SubscriptionId $vaultSubId -ResourceGroup $vaultRgName -Vault $vaultName -DatasourceType AzureKubernetesService -Operation Restore
```

## Next steps

- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
