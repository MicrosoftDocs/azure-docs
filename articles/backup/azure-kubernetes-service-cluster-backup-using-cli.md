---
title: Back up Azure Kubernetes Service (AKS) using Azure CLI
description: This article explains how to back up Azure Kubernetes Service (AKS) using Azure CLI.
ms.topic: how-to
ms.service: backup
ms.date: 06/20/2023
ms.custom:
  - devx-track-azurecli
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Kubernetes Service using Azure CLI 

This article describes how to configure and back up Azure Kubernetes Service (AKS) using Azure CLI.

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

A Backup vault is a management entity in Azure that stores backup data for various newer workloads that Azure Backup supports, such as Azure Database for PostgreSQL servers and Azure Disks. Backup vaults make it easy to organize your backup data, while minimizing management overhead. Backup vaults are based on the Azure Resource Manager model of Azure, which provides enhanced capabilities to help secure backup data.

Before you create a Backup vault, choose the storage redundancy of the data in the vault, and then create the Backup vault with that storage redundancy and the location. Learn more about [creating a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

>[!Note]
>Though the selected vault may have the *global-redundancy* setting, backup for AKS currently supports **Operational Tier** only. All backups are stored in your subscription in the same region as that of the AKS cluster, and they aren't copied to Backup vault storage.

To create the Backup vault, run the following command:

```azurecli
az dataprotection backup-vault create --resource-group $backupvaultresourcegroup --vault-name $backupvault --location $region --type SystemAssigned --storage-settings datastore-type="VaultStore" type="LocallyRedundant"
```

Once the vault creation is complete, create a backup policy to protect AKS clusters.

## Create a backup policy

To understand the inner components of a backup policy for the backup of AKS, retrieve the policy template using the command `az dataprotection backup-policy get-default-policy-template`. This command returns a default policy template for a given datasource type. Use this policy template to create a new policy.

```azurecli
az dataprotection backup-policy get-default-policy-template --datasource-type AzureKubernetesService > akspolicy.json


{
  "datasourceTypes": [
    "Microsoft.ContainerService/managedClusters"
  ],
  "name": "AKSPolicy1",
  "objectType": "BackupPolicy",
  "policyRules": [
    {
      "backupParameters": {
        "backupType": "Incremental",
        "objectType": "AzureBackupParams"
      },
      "dataStore": {
        "dataStoreType": "OperationalStore",
        "objectType": "DataStoreInfoBase"
      },
      "name": "BackupHourly",
      "objectType": "AzureBackupRule",
      "trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2023-01-04T09:00:00+00:00/PT4H"
          ]
        },
        "taggingCriteria": [
          {
            "isDefault": true,
            "tagInfo": {
              "id": "Default_",
              "tagName": "Default"
            },
            "taggingPriority": 99
          }
        ]
      }
    },
    {
      "isDefault": true,
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P7D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],
      "name": "Default",
      "objectType": "AzureRetentionRule"
    }
  ]
}

```

The policy template consists of a trigger criteria (which decides the factors to trigger the backup job) and a lifecycle (which decides when to delete, copy, or move the backups). In AKS backup, the default value for trigger is a scheduled hourly trigger is *every 4 hours (PT4H)* and retention of each backup is *365 days*.


```azurecli
Scheduled trigger:
      "trigger": {
        "objectType": "ScheduleBasedTriggerContext",
        "schedule": {
          "repeatingTimeIntervals": [
            "R/2023-01-04T09:00:00+00:00/PT4H"
          ]
        },

Default retention lifecycle:
      "lifecycles": [
        {
          "deleteAfter": {
            "duration": "P7D",
            "objectType": "AbsoluteDeleteOption"
          },
          "sourceDataStore": {
            "dataStoreType": "OperationalStore",
            "objectType": "DataStoreInfoBase"
          }
        }
      ],


```

Backup for AKS provides multiple backups per day. If you require more frequent backups, choose the *Hourly backup frequency* that has the ability to take backups with intervals of every *4*, *6*, *8*, or *12* hours. The backups are scheduled based on the *Time interval* you've selected.

For example, if you select *Every 4 hours*, then the backups are taken at approximately in the interval of *every 4 hours* so that the backups are distributed equally across the day. If *once a day backup* is sufficient, then choose the *Daily backup frequency*. In the daily backup frequency, you can specify the *time of the day* when your backups should be taken.

>[!Important]
>The time of the day indicates the backup start time and not the time when the backup completes.

>[!Note]
>Though the selected vault has the global-redundancy setting, backup for AKS currently supports snapshot datastore only. All backups are stored in a resource group in your subscription, and aren't copied to the Backup vault storage.

Once you've downloaded the template as a JSON file, you can edit it for scheduling and retention as required. Then create a new policy with the resulting JSON. If you want to edit the hourly frequency or the retention period, use the `az dataprotection backup-policy trigger set` and/or `az dataprotection backup-policy retention-rule set` commands. Once the policy JSON has all the required values, proceed to create a new policy from the policy object using the `az dataprotection backup-policy create` command.

```azurecli
az dataprotection backup-policy create -g testBkpVaultRG --vault-name TestBkpVault -n mypolicy --policy policy.json
```

## Prepare AKS cluster for backup

Once the vault and policy creation are complete, you need to perform the following prerequisites to get the AKS cluster ready for backup:

1. **Create a storage account and blob container**.

   Backup for AKS stores Kubernetes resources in a blob container as backups. To get the AKS cluster ready for backup, you need to install an extension in the cluster. This extension requires the storage account and blob container as inputs.

   To create a new storage account, run the following command:

   ```azurecli
   az storage account create --name $storageaccount --resource-group $storageaccountresourcegroup --location $region --sku Standard_LRS
   ```

   Once the storage account creation is complete, create a blob container inside by running the following command:

   ```azurecli
   az storage container create --name $blobcontainer --account-name $storageaccount --auth-mode login
   ```

   Learn how to [enable or disable specific features, such as private endpoint, while creating storage account and blob container](../storage/common/storage-account-create.md?tabs=azure-portal).


   >[!Note]
   >1. The storage account and the AKS cluster should be in the same region and subscription.
   >2. The blob container shouldn't contain any previously created file systems (except created by backup for AKS). 
   >3. If your source or target AKS cluster is in a private virtual network, then you need to create Private Endpoint to connect storage account with the AKS cluster. 

2. **Install Backup Extension**.

   Backup Extension is mandatory to be installed in the AKS cluster to perform any backup and restore operations. The Backup Extension creates a namespace `dataprotection-microsoft` in the cluster and uses the same to deploy its resources. The extension requires the storage account and blob container as inputs for installation.

   ```azurecli
   az k8s-extension create --name azure-aks-backup --extension-type microsoft.dataprotection.kubernetes --scope cluster --cluster-type managedClusters --cluster-name $akscluster --resource-group $aksclusterresourcegroup --release-train stable --configuration-settings blobContainer=$blobcontainer storageAccount=$storageaccount storageAccountResourceGroup=$storageaccountresourcegroup storageAccountSubscriptionId=$subscriptionId
	
   ```

   As part of extension installation, a user identity is created in the AKS cluster's Node Pool Resource Group. For the extension to access the storage account, you need to provide this identity the **Storage Account Contributor** role. To assign the required role, run the following command:

   ```azurecli
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $akscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor' --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount
   ```
 

3. **Enable Trusted Access**

   For the Backup vault to connect with the AKS cluster, you must enable *Trusted Access* as it allows the Backup vault to have a direct line of sight to the AKS cluster.


   To enable Trusted Access, run the following command:

   ```azurecli
   az aks trustedaccess rolebinding create --cluster-name $akscluster --name backuprolebinding --resource-group $aksclusterresourcegroup --roles Microsoft.DataProtection/backupVaults/backup-operator --source-resource-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/BackupVaults/$backupvault
   ```

## Configure backups

With the created Backup vault and backup policy, and the AKS cluster in *ready-to-be-backed-up* state, you can now start to back up your AKS cluster.

### Prepare the request

The configuration of backup is performed in two steps:

1. Prepare backup configuration to define which cluster resources are to be backed up using the `az dataprotection backup-instance initialize-backupconfig` command. The command generates a JSON, which you can update to define backup configuration for your AKS cluster as required.

   ```azurecli
   az dataprotection backup-instance initialize-backupconfig --datasource-type AzureKubernetesService > aksbackupconfig.json

   {
    "excluded_namespaces": null,
    "excluded_resource_types": null,
    "include_cluster_scope_resources": true,
    "included_namespaces": null, 
    "included_resource_types": null,
    "label_selectors": null,
    "snapshot_volumes": true
   }
   ```

2. Prepare the relevant request using the relevant vault, policy, AKS cluster, backup configuration, and snapshot resource group using the `az dataprotection backup-instance initialize` command.

   ```azurecli
   az dataprotection backup-instance initialize --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --datasource-location $region --datasource-type AzureKubernetesService --policy-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupPolicies/$backuppolicy --backup-configuration ./aksbackupconfig.json --friendly-name ecommercebackup --snapshot-resource-group-name $snapshotresourcegroup > backupinstance.json
   ```

Now, use the JSON output of this command to configure backup for the AKS cluster.

### Assign required permissions and validate

Backup vault uses managed identity to access other Azure resources. To configure backup of AKS cluster, Backup vault's managed identity requires a set of permissions on the AKS cluster and resource groups, where snapshots are created and managed. Also, the AKS cluster requires permission on the Snapshot Resource group.

Only, system-assigned managed identity is currently supported for backup (both Backup vault and AKS cluster). A system-assigned managed identity is restricted to one per resource and is tied to the lifecycle of this resource. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). Managed identity is a service principal of a special type that may only be used with Azure resources. Learn more [about managed identities](../active-directory/managed-identities-azure-resources/overview.md).

With the request prepared, first you need to validate if the required roles are assigned to the resources mentioned above by running the following command:

```azurecli
az dataprotection backup-instance validate-for-backup --backup-instance ./backupinstance.json --ids /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault
```

If the validation fails and there are certain permissions missing, then you can assign them by running the following command:

```azurecli
az dataprotection backup-instance update-msi-permissions command.
az dataprotection backup-instance update-msi-permissions --datasource-type AzureKubernetesService --operation Backup --permissions-scope ResourceGroup --vault-name $backupvault --resource-group $backupvaultresourcegroup --backup-instance backupinstance.json

```

Once the permissions are assigned, revalidate using the following *validate for backup* command:

```azurecli
az dataprotection backup-instance create --backup-instance  backupinstance.json --resource-group $backupvaultresourcegroup --vault-name $backupvault
```

## Run an on-demand backup

To fetch the relevant backup instance on which you want to trigger a backup, run the `az dataprotection backup-instance list-from-resourcegraph --` command.

```azurecli
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --query aksAssignedIdentity.id
```

Now, trigger an on-demand backup for the backup instance by running the following command:

```azurecli
az dataprotection backup-instance adhoc-backup --rule-name "BackupDaily" --ids /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupInstances/$backupinstanceid

```

## Tracking jobs

Track backup jobs running the `az dataprotection job` command. You can list all jobs and fetch a particular job detail.

You can also use Resource Graph to track all jobs across all subscriptions, resource groups, and Backup vaults by running the `az dataprotection job list-from-resourcegraph` command to get the relevant job

**For on-demand backup**:

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --operation OnDemandBackup
```

**For scheduled backup**:

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --operation ScheduledBackup
```

## Next steps

- [Restore Azure Kubernetes Service cluster using Azure CLI](azure-kubernetes-service-cluster-restore-using-cli.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
