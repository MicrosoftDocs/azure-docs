---
title: Restore Azure Kubernetes Service (AKS) via PowerShell using Azure Backup
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure PowerShell.
ms.topic: how-to
ms.service: azure-backup
ms.date: 01/30/2025
ms.custom:
  - devx-track-azurepowershell
  - ignite-2023
  - engagement-fy24
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Kubernetes Service using PowerShell 

This article describes how to restore Azure Kubernetes cluster from a restore point created by Azure Backup using Azure PowerShell.

Azure Backup supports backing up AKS clusters, including cluster resources and attached persistent volumes, using a backup extension. This extension must be installed in the cluster, enabling the Backup Vault to communicate with it to perform backup and restore operations.

You can perform *Original-Location Recovery (OLR)* in the same AKS cluster or *Alternate-Location Recovery (ALR)* in a different AKS cluster. Item-Level Recovery (ILR) lets you select specific items to restore from the backup.

>[!Note]
>Before you initiate a restore operation, ensure that the target cluster has Backup Extension installed and Trusted Access enabled for the Backup vault. [Learn more](azure-kubernetes-service-cluster-backup-using-powershell.md#prepare-aks-cluster-for-backup).

## Prerequisites

Before you restore an AKS cluster, ensure that you meet the following prerequisites:

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-to-an-aks-cluster) to define parameters based on the cluster resources for restore.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations) between the Backup vault and the AKS cluster.

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Initialize Variables for Resource Commands

Here, provide the necessary details for each resource to be used in your commands.

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

- ID of the target AKS cluster, in case the restore is performed to an alternate AKS cluster

    ```azurepowershell
    $targetAKSClusterId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourceGroups/targetrg/providers/Microsoft.ContainerService/managedClusters/PSAKSCluster2"
    ```

## Restore to an AKS cluster 

### Fetch the relevant recovery point

To fetch the relevant recovery points, run the following cmdlets:

1. Fetch all instances using the `Get-AzDataProtectionBackupInstance` cmdlet and identify the relevant instance.

    ```azurepowershell
    $AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName $vaultRgName -VaultName $vaultName
    ```

 To search across instances in multiple vaults and subscriptions, use `Az.Resourcegraph` and `Search-AzDataProtectionBackupInstanceInAzGraph` cmdlets.

   ```azurepowershell
    $AllInstances = Search-AzDataProtectionBackupInstanceInAzGraph -Subscription $vaultSubId -ResourceGroup $vaultRgName -Vault $vaultName -DatasourceType AzureKubernetesService  -ProtectionStatus ProtectionConfigured
   ```

2. Once the instance is identified, fetch the relevant recovery point. From the output array of the given cmdlet, third backup instance is to be restored.

    ```azurepowershell
    $rp = Get-AzDataProtectionRecoveryPoint -ResourceGroupName $vaultRgName -VaultName $vaultName -BackupInstanceName $AllInstances[2].BackupInstanceName
    ```

### Prepare the restore request

To prepare the restore request, run the following cmdlets:

1. Prepare the restore configuration and define the items to be restored to the target AKS cluster by using the `New-AzDataProtectionRestoreConfigurationClientObject` cmdlet.

    ```azurepowershell
    $aksRestoreCriteria = New-AzDataProtectionRestoreConfigurationClientObject -DatasourceType AzureKubernetesService  -PersistentVolumeRestoreMode RestoreWithVolumeData  -IncludeClusterScopeResource $true -NamespaceMapping  @{"sourceNamespace"="targetNamespace"}
    ```

2. Prepare the restore request with all relevant details by using the `Initialize-AzDataProtectionRestoreRequest` cmdlet.

   For restore to the original AKS cluster, use the following cmdlet  format:

    ```azurepowershell
    $aksRestoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureKubernetesService  -SourceDataStore OperationalStore -RestoreLocation $restoreLocation -RestoreType OriginalLocation -RecoveryPoint $rp[0].Property.RecoveryPointId -RestoreConfiguration $aksRestoreCriteria -BackupInstance $AllInstances[2]
    ```
   For restore to an alternate AKS cluster, use the following cmdlet format:

    ```azurepowershell
    $aksRestoreRequest = Initialize-AzDataProtectionRestoreRequest -DatasourceType AzureKubernetesService  -SourceDataStore OperationalStore -RestoreLocation $restoreLocation -RestoreType AlternateLocation -TargetResourceId $targetAKSClusterId -RecoveryPoint $rp[0].Property.RecoveryPointId -RestoreConfiguration $aksRestoreCriteria -BackupInstance $AllInstances[2]
    ```

## Trigger the restore

To trigger the restore operation, run the following cmdlets:

1. Validate the restore request created earlier.

    ```azurepowershell
    $validateRestore = Test-AzDataProtectionBackupInstanceRestore -SubscriptionId $vaultSubId  -ResourceGroupName $vaultRgName -VaultName $vaultName -RestoreRequest $aksRestoreRequest -Name $AllInstances[2].BackupInstanceName
    ```

   >[!Note]
   >During the restore operation, the Backup vault and the AKS cluster need to have certain roles assigned to perform the restore:

   - *Target AKS* cluster should have *Contributor* role on the *Snapshot Resource Group*.
   - The *User Identity* attached with the Backup Extension should have *Storage Account Contributor* roles on the *storage account* where backups are stored. 
   - The *Backup vault* should have a *Reader* role on the *Target AKS cluster* and *Snapshot Resource Group*.

2. To trigger the restore operation with the request prepared earlier by using the `Start-AzDataProtectionBackupInstanceRestore` cmdlet.

    ```azurepowershell
    $restoreJob = Start-AzDataProtectionBackupInstanceRestore -SubscriptionId $vaultSubId  -ResourceGroupName $vaultRgName -VaultName $vaultName -BackupInstanceName $AllInstances[2].BackupInstanceName -Parameter $aksRestoreRequest
    ```

## Track the restore job

Track all the jobs using the `Get-AzDataProtectionJob` cmdlet. You can list all jobs and fetch a particular job detail. Alternatively, use Az.ResourceGraph to track jobs across all Backup vaults.

To get the relevant job across any Backup vault, use the `Search-AzDataProtectionJobInAzGraph` cmdlet.

```azurepowershell
$job = Search-AzDataProtectionJobInAzGraph -Subscription -SubscriptionId $vaultSubId -ResourceGroup $vaultRgName -Vault $vaultName -DatasourceType AzureKubernetesService -Operation Restore
```

## Next steps

- [Management of  Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md).
- [Azure Kubernetes Service cluster backup overview](azure-kubernetes-service-cluster-backup-concept.md).
