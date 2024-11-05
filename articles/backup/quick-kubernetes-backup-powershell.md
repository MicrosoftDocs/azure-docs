---
title: Quickstart - Configure backup for an Azure Kubernetes Service (AKS) cluster using Azure Backup via PowerShell
description: Learn how to quickly configure backup for a Kubernetes cluster using PowerShell.
ms.service: azure-backup
ms.topic: quickstart
ms.date: 05/31/2024
ms.custom: devx-track-terraform, devx-track-extended-azdevcli
ms.reviewer: rajats
ms.author: v-abhmallick
author: AbhishekMallick-MS

---

# Quickstart: Configure backup for an Azure Kubernetes Service (AKS) cluster using PowerShell

This quickstart describes how to configure backup for an Azure Kubernetes Service (AKS) cluster using PowerShell.

Azure Backup for AKS is a cloud-native, enterprise-ready, application-centric backup service that lets you quickly configure backup for AKS clusters.

## Before you start

- Currently, AKS backup supports Azure Disk-based persistent volumes (enabled by CSI driver) only. The backups are stored only in operational datastore (in your tenant) and aren't moved to a vault. The Backup vault and AKS cluster should be in the same region.

- AKS backup uses a blob container and a resource group to store the backups. The blob container has the AKS cluster resources stored in it, whereas the persistent volume snapshots are stored in the resource group. The AKS cluster and the storage locations must reside in the same region. Learn [how to create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).

- Currently, AKS backup supports once-a-day backup. It also supports more frequent backups (in every *4*, *8*, and *12* hours intervals) per day. This solution allows you to retain your data for restore for up to 360 days. Learn to [create a backup policy](#create-a-backup-policy).

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) to configure backup and restore operations on an AKS cluster. Learn more [about Backup Extension](azure-kubernetes-service-cluster-backup-concept.md#backup-extension).

- Ensure that `Microsoft.KubernetesConfiguration`, `Microsoft.DataProtection`, and `Microsoft.ContainerService` are registered for your subscription before initiating the backup configuration and restore operations.

- Ensure to perform [all the prerequisites](azure-kubernetes-service-cluster-backup-concept.md) before initiating backup or restore operation for AKS backup.

For more information on the supported scenarios, limitations, and availability, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Create a Backup vault

To create the Backup vault, run the following command:

```azurepowershell
$storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type GloballyRedundant -DataStoreType VaultStore

New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting

$TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
```

The newly created vault has storage settings set as Globally Redundant, thus backups stored in vault tier will be available in the Azure paired region. Once the vault creation is complete, create a backup policy to protect AKS clusters.

## Create a backup policy

Retrieve the policy template using the command `Get-AzDataProtectionPolicyTemplate`.

```azurepowershell
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureKubernetesService
```

The policy template consists of a trigger criteria (which decides the factors to trigger the backup job) and a lifecycle (which decides when to delete, copy, or move the backups). In AKS backup, the default value for trigger is a scheduled hourly trigger is *every 4 hours (PT4H)* and retention of each backup is *seven days*.

```azurepowershell
New-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name aksBkpPolicy -Policy $policyDefn

$aksBkpPol = Get-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "aksBkpPolicy"
```

Once the policy JSON has all the required values, proceed to create a new policy from the policy object.

```azurepowershell
az dataprotection backup-policy create -g testBkpVaultRG --vault-name TestBkpVault -n mypolicy --policy policy.json
```

## Prepare AKS cluster for backup

Once the vault and policy creation are complete, you need to perform the following prerequisites to get the AKS cluster ready for backup:

1. **Create a storage account and blob container**.

   Backup for AKS stores Kubernetes resources in a blob container as backups. To get the AKS cluster ready for backup, you need to install an extension in the cluster. This extension requires the storage account and blob container as inputs.

   To create a new storage account and a blob container, see [these steps](../storage/blobs/blob-containers-powershell.md#create-a-container).

2. **Install Backup Extension**.

   Backup Extension is mandatory to be installed  in the AKS cluster to perform any backup and restore operations. The Backup Extension creates a namespace `dataprotection-microsoft` in the cluster and uses the same to deploy its resources. The extension requires the storage account and blob container as inputs for installation. Learn about the [extension installation commands](./azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension).

   As part of extension installation, a user identity is created in the AKS cluster's Node Pool Resource Group. For the extension to access the storage account, you need to provide this identity the **Storage Account Contributor** role. To assign the required role, [run these command](azure-kubernetes-service-cluster-manage-backups.md#grant-permission-on-storage-account) 

3. **Enable Trusted Access**

   For the Backup vault to connect with the AKS cluster, you must enable Trusted Access as it allows the Backup vault to have a direct line of sight to the AKS cluster. Learn [how to enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations).

> [!NOTE]
> For Backup Extension installation and Trusted Access enablement, the commands are available in Azure CLI only.

## Configure backups

With the created Backup vault and backup policy, and the AKS cluster in *ready-to-be-backed-up* state, you can now start to back up your AKS cluster.

### Key entities

- **AKS cluster to be protected**

  Fetch the Azure Resource Manager ID of the AKS cluster to be protected. This serves as the identifier of the cluster. In this example, let's use an AKS cluster named *PSTestAKSCluster*, under a resource group *aksrg*, in a different subscription:

  ```azurepowershell
  $sourceClusterId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/aksrg /providers/Microsoft.ContainerService/managedClusters/ PSTestAKSCluster "
  ```

- **Snapshot resource group**

  The persistent volume snapshots are stored in a resource group in your subscription. We recommend you to create a dedicated resource group as a snapshot datastore to be used by the Azure Backup service. 

  ```azurepowershell
  $snapshotrg = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/snapshotrg"
  ```

### Prepare the request

The configuration of backup is performed in two steps:


The configuration of backup is performed in two steps:

1. Prepare backup configuration to define which cluster resources are to be backed up using the `New-AzDataProtectionBackupConfigurationClientObject` cmdlet. In this example, we're going to use the default configuration and perform a full cluster backup.

    ```azurepowershell
   $backupConfig = New-AzDataProtectionBackupConfigurationClientObject -SnapshotVolume $true -IncludeClusterScopeResource $true -DatasourceType AzureKubernetesService -LabelSelector "env=prod"
   ```
  
2. Prepare the relevant request using the relevant vault, policy, AKS cluster, backup configuration, and snapshot resource group using the `Initialize-AzDataProtectionBackupInstance` cmdlet.

   ```azurepowershell
   $backupInstance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureKubernetesService  -DatasourceLocation $dataSourceLocation -PolicyId $ aksBkpPol.Id -DatasourceId $sourceClusterId -SnapshotResourceGroupId $ snapshotrg -FriendlyName $friendlyName -BackupConfiguration $backupConfig
   ```

### Assign required permissions and validate

With the request prepared, first you need to assign required roles o the resources involved by running the following command:

```azurepowershell
Set-AzDataProtectionMSIPermission -BackupInstance $backupInstance -VaultResourceGroup $rgName -VaultName $vaultName -PermissionsScope "ResourceGroup"
```


Once permissions are assigned, run the following cmdlet to test the readiness of the instance created.

```azurepowershell
test-AzDataProtectionBackupInstanceReadiness -ResourceGroupName $resourceGroupName -VaultName $vaultName -BackupInstance  $backupInstance.Property 
```

When the validation is successful,  you can submit the request to protect the AKS cluster using the `New-AzDataProtectionBackupInstance` cmdlet.

```azurepowershell
New-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupInstance $backupInstance
```

## Next steps

- [Restore Azure Kubernetes Service cluster using PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
