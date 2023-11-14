---
title: Back up Azure Kubernetes Service (AKS) using Azure PowerShell
description: This article explains how to back up Azure Kubernetes Service (AKS) using PowerShell.
ms.topic: how-to
ms.service: backup
ms.date: 05/05/2023
ms.custom:
  - devx-track-azurepowershell
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Kubernetes Service using PowerShell 

This article describes how to configure and back up Azure Kubernetes Service (AKS) using Azure PowerShell.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Before you start

- Currently, AKS backup supports Azure Disk-based persistent volumes (enabled by CSI driver) only. The backups are stored only in operational datastore (in your tenant) and aren't moved to a vault. The Backup vault and AKS cluster should be in the same region.

- AKS backup uses a blob container and a resource group to store the backups. The blob container has the AKS cluster resources stored in it, whereas the persistent volume snapshots are stored in the resource group. The AKS cluster and the storage locations must reside in the same region. Learn [how to create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).

- Currently, AKS backup supports once-a-day backup. It also supports more frequent backups (in every *4*, *8*, and *12* hours intervals) per day. This solution allows you to retain your data for restore for up to 360 days. Learn to [create a backup policy](#create-a-backup-policy).

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) to configure backup and restore operations on an AKS cluster. Learn more [about Backup Extension](azure-kubernetes-service-cluster-backup-concept.md#backup-extension).

- Ensure that `Microsoft.KubernetesConfiguration`, `Microsoft.DataProtection`, and the `TrustedAccessPreview` feature flag on `Microsoft.ContainerService` are registered for your subscription before initiating the backup configuration and restore operations.

- Ensure to perform [all the prerequisites](azure-kubernetes-service-cluster-backup-concept.md) before initiating backup or restore operation for AKS backup.

For more information on the supported scenarios, limitations, and availability, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Create a Backup vault

A Backup vault is a management entity in Azure that stores backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers and Azure Disks. Backup vaults make it easy to organize your backup data while minimizing management overhead. They are based on the Azure Resource Manager model, which provides enhanced capabilities to help secure backup data. Before you create a Backup vault, choose the storage redundancy of the data in the vault, and then create the Backup vault with that storage redundancy and the location. 

Here, we're creating a Backup vault *TestBkpVault* in *West US* region under the resource group *testBkpVaultRG*. Use the `New-AzDataProtectionBackupVault` cmdlet to create a Backup vault. Learn more about [creating a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

>[!Note]
>Though the selected vault may have the *global-redundancy* setting, backup for AKS currently supports **Operational Tier** only. All backups are stored in your subscription in the same region as that of the AKS cluster, and they aren't copied to Backup vault storage.

1. To define the storage settings of the Backup vault, run the following cmdlet:

   >[!Note]
   >The vault is created with only *Local Redundancy* and *Operational Data store* support.

    ```azurepowershell
    $storageSetting = New-AzDataProtectionBackupVaultStorageSettingObject -Type LocallyRedundant -DataStoreType OperationalStore
    ```

2. To create the Backup vault as per the details mentioned earlier, run the following cmdlet:

   ```azurepowershell
   New-AzDataProtectionBackupVault -ResourceGroupName testBkpVaultRG -VaultName TestBkpVault -Location westus -StorageSetting $storageSetting
   $TestBkpVault = Get-AzDataProtectionBackupVault -VaultName TestBkpVault
   ```

Once the vault creation is complete, create a backup policy to protect AKS clusters.

## Create a backup policy

To understand the inner components of a backup policy for the backup of AKS, retrieve the policy template using the cmdlet `Get-AzDataProtectionPolicyTemplate`. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurepowershell
$policyDefn = Get-AzDataProtectionPolicyTemplate -DatasourceType AzureKubernetesService
```

The policy template consists of a trigger criteria (which decides the factors to trigger the backup job) and a lifecycle (which decides when to delete, copy, or move the backups). In AKS backup, the default value for trigger is a scheduled hourly trigger is *every 4 hours (PT4H)* and retention of each backup is *365 days*.


```azurepowershell
$policyDefn.PolicyRule[0]. Trigger | fl

ObjectType: ScheduleBasedTriggerContext
ScheduleRepeatingTimeInterval: {R/2023-04-05T13:00:00+00:00/PT4H}
TaggingCriterion: {Default}

$policyDefn.PolicyRule[1]. Lifecycle | fl

DeleteAfterDuration: P7D
DeleteAfterObjectType: AbsoluteDeleteOption
SourceDataStoreObjectType : DataStoreInfoBase
SourceDataStoreType: OperationalStore
TargetDataStoreCopySetting:
```

Backup for AKS provides multiple backups per day. The backups are equally distributed across the day, if you require more frequent backups by choosing the *Hourly backup frequency* that has the ability to take backups with intervals of every *4*, *6*, *8*, or *12* hours. The backups are scheduled based on the *Time interval* you've selected. For example, if you select *Every 4 hours*, then the backups are taken at approximately in the interval of *every 4 hours*.

If *once a day backup* is sufficient, then choose the *Daily backup frequency*. In the daily backup frequency, you can specify the *time of the day* when your backups should be taken.

>[!Important]
>The time of the day indicates the backup start time and not the time when the backup completes. The time required for completing the backup operation is dependent on various factors, including number and size of the persistent volumes and churn rate between consecutive backups.

If you want to edit the hourly frequency or the retention period, use the `Edit-AzDataProtectionPolicyTriggerClientObject` and/or `Edit-AzDataProtectionPolicyRetentionRuleClientObject` cmdlets. Once the policy object has all the required values, start creating a new policy from the policy object using the `New-AzDataProtectionBackupPolicy` cmdlet.

```azurepowershell
New-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name aksBkpPolicy -Policy $policyDefn

$aksBkpPol = Get-AzDataProtectionBackupPolicy -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "aksBkpPolicy"
```

## Prepare AKS cluster for backup

Once the vault and policy creation are complete, you need to perform the following prerequisites to get the AKS cluster ready for backup:

1. **Create a storage account and blob container**

   Backup for AKS stores Kubernetes resources in a blob container as backups. To get the AKS cluster ready for backup, you need to install an extension in the cluster. This extension requires the storage account and blob container as inputs.

   To create a new storage account and a blob container, see [these steps](../storage/blobs/blob-containers-powershell.md#create-a-container).

   >[!Note]
   >1. The storage account and the AKS cluster should be in the same region and subscription.
   >2. The blob container shouldn't contain any previously created file systems (except created by backup for AKS). 
   >3. If your source or target AKS cluster is in a private virtual network, then you need to create Private Endpoint to connect storage account with the AKS cluster. 

2. **Install Backup Extension**

   Backup Extension is mandatory to be installed  in the AKS cluster to perform any backup and restore operations. The Backup Extension creates a namespace `dataprotection-microsoft` in the cluster and uses the same to deploy its resources. The extension requires the storage account and blob container as inputs for installation. Learn about the [extension installation commands](./azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension).

   As part of extension installation, a user identity is created in the AKS cluster's Node Pool Resource Group. For the extension to access the storage account, you need to provide this identity the **Storage Account Contributor** role. To assign the required role, [run these command](azure-kubernetes-service-cluster-manage-backups.md#grant-permission-on-storage-account) 

3.    **Enable Trusted Access**

   For the Backup vault to connect with the AKS cluster, you must enable Trusted Access as it allows the Backup vault to have a direct line of sight to the AKS cluster. Learn [how to enable Trusted Access]](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations).

>[!Note]
>For Backup Extension installation and Trusted Access enablement, the commands are available in Azure CLI only.

## Configure backups

With the created Backup vault and backup policy, and the AKS cluster in *ready-to-be-backed-up* state, you can now start to back up your AKS cluster.

### Key entities

- **AKS cluster to be protected**

  Fetch the Azure Resource Manager ID of the AKS cluster to be protected. This serves as the identifier of the cluster. In this example, let's use an AKS cluster named *PSTestAKSCluster*, under a resource group *aksrg*, in a different subscription:

  ```azurepowershell
  $sourceClusterId = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/aksrg /providers/Microsoft.ContainerService/managedClusters/ PSTestAKSCluster "
  ```

- **Snapshot resource group**

  The persistent volume snapshots are stored in a resource group in your subscription. We recommend you to create a dedicated resource group as a snapshot datastore to be used by the Azure Backup service. A dedicated resource group allows restricting access permissions on the resource group, providing safety and ease of management of the backup data. Save the Azure Resource Manager ID of the resource group to the location where you want to store the persistent volume snapshots.

  ```azurepowershell
  $snapshotrg = "/subscriptions/xxxxxxxx-xxxx-xxxx-xxxx/resourcegroups/snapshotrg"
  ```


### Prepare the request

The configuration of backup is performed in two steps:

1. Prepare backup configuration to define which cluster resources are to be backed up using the `New-AzDataProtectionBackupConfigurationClientObject` cmdlet. In the following example, the configuration is defined as all cluster resources under current, and future namespaces will be backed up  with the label as `key-value pair x=y`. Also, all the cluster scoped resources and persistent volumes are backed up.

   ```azurepowershell
   $backupConfig = New-AzDataProtectionBackupConfigurationClientObject -SnapshotVolume $true -IncludeClusterScopeResource $true -DatasourceType AzureKubernetesService -LabelSelector "env=prod"
   ```

2. Prepare the relevant request using the relevant vault, policy, AKS cluster, backup configuration, and snapshot resource group using the `Initialize-AzDataProtectionBackupInstance` cmdlet.

   ```azurepowershell
   $backupInstance = Initialize-AzDataProtectionBackupInstance -DatasourceType AzureKubernetesService  -DatasourceLocation $dataSourceLocation -PolicyId $ aksBkpPol.Id -DatasourceId $sourceClusterId -SnapshotResourceGroupId $ snapshotrg -FriendlyName $friendlyName -BackupConfiguration $backupConfig
   ```

### Assign required permissions and validate

With the request prepared, you need to assign the user the required permissions via Azure role-based access control (Azure RBAC) to vault (represented by vault managed system identity) and the AKS cluster. You can perform this using the `Set-AzDataProtectionMSIPermission` cmdlet. Backup vault uses managed identity to access other Azure resources. To configure backup of AKS cluster, Backup vault's managed identity requires a set of permissions on the AKS cluster and resource groups, where snapshots are created and managed. Also, the AKS cluster requires permission on the snapshot resource group.

Only, system-assigned managed identity is currently supported for backup (both Backup vault and AKS cluster). A system-assigned managed identity is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure RBAC. Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more [about managed identities](../active-directory/managed-identities-azure-resources/overview.md).

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

## Run an on-demand backup

To fetch the relevant backup instance on which you want to trigger a backup, run the `Get-AzDataProtectionBackupInstance` cmdlet.

```azurepowershell
$instance = Get-AzDataProtectionBackupInstance -SubscriptionId "xxxx-xxx-xxx" -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -Name "BackupInstanceName"
```

You can specify a retention rule while triggering the backup. To view the retention rules in policy, go to the policy object for retention rules. In the following example, the rule with name *default* appears and we'll use that rule for the on-demand backup.

```azurepowershell
$policyDefn.PolicyRule | fl
BackupParameter: Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.AzureBackupParams
BackupParameterObjectType: AzureBackupParams
DataStoreObjectType: DataStoreInfoBase
DataStoreType: OperationalStore
Name: BackupHourly
ObjectType: AzureBackupRule
Trigger: Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.ScheduleBasedTriggerContext
TriggerObjectType: ScheduleBasedTriggerContext
IsDefault: True
Lifecycle: {Microsoft.Azure.PowerShell.Cmdlets.DataProtection.Models.Api20210201Preview.SourceLifeCycle}
Name: Default
ObjectType: AzureRetentionRule
```

Now, trigger an on-demand backup using the `Backup-AzDataProtectionBackupInstanceAdhoc` cmdlet.

```azurepowershell
$AllInstances = Get-AzDataProtectionBackupInstance -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name

Backup-AzDataProtectionBackupInstanceAdhoc -BackupInstanceName $AllInstances[0].Name -ResourceGroupName "testBkpVaultRG" -VaultName $TestBkpVault.Name -BackupRuleOptionRuleName "Default"
```

## Tracking jobs

Track all the jobs using the `Get-AzDataProtectionJob` cmdlet. You can list all jobs and fetch a particular job detail. You can also use the `Az.ResourceGraph` cmdlet to track all jobs across all Backup vaults. Use the `Search-AzDataProtectionJobInAzGraph` cmdlet to get the relevant job details from any Backup vault.

```azurepowershell
$job = Search-AzDataProtectionJobInAzGraph -Subscription $sub -ResourceGroupName "testBkpVaultRG" -Vault $TestBkpVault.Name -DatasourceType AzureKubernetesService  -Operation OnDemandBackup
```

## Next steps

- [Restore Azure Kubernetes Service cluster using PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
