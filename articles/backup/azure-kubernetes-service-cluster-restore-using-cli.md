---
title: Restore Azure Kubernetes Service (AKS) using Azure CLI 
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure CLI.
ms.topic: how-to
ms.service: backup
ms.date: 06/20/2023
ms.custom: devx-track-azurecli
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Restore Azure Kubernetes Service using Azure CLI (preview) 

This article describes how to restore Azure Kubernetes cluster from a restore point created by Azure Backup using Azure CLI.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

You can perform both *Original-Location Recovery (OLR)* (restoring in the AKS cluster that was backed up) and *Alternate-Location Recovery (ALR)* (restoring in a different AKS cluster). You can also select the items to be restored from the backup that is Item-Level Recovery (ILR).

>[!Note]
>Before you initiate a restore operation, the target cluster should have Backup Extension installed and Trusted Access enabled for the Backup vault. [Learn more](azure-kubernetes-service-cluster-backup-using-cli.md#prepare-aks-cluster-for-backup).

## Before you start

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-to-an-aks-cluster) to define parameters based on the cluster resources that will be picked up during the restore.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#register-the-trusted-access) between the Backup vault and the AKS cluster.

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Validate and prepare target AKS cluster

Before you initiate a restore process, you must validate that AKS cluster is prepared for restore. This includes the Backup Extension to be installed with the extension having the permission on storage account where backups are stored and Trusted Access to be enabled between AKS cluster and Backup vault.

First, check if Backup Extension is installed in the cluster by running the following command:

```azurecli
az k8s-extension show --name azure-aks-backup --cluster-type managedClusters --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup
```

If the extension is installed, then check if it has the right permissions on the storage account where backups are stored:

```azurecli
az role assignment list --all --assignee  $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv)
```

If the role isn't assigned, then you can assign the role by running the following command:

```azurecli
az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor'  --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount

```

If the Backup Extension isn't installed, then running the following extension installation command with the storage account and blob container where backups are stored as input.

```azurecli
az k8s-extension create --name azure-aks-backup --extension-type microsoft.dataprotection.kubernetes --scope cluster --cluster-type managedClusters --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --release-train stable --configuration-settings blobContainer=$blobcontainer storageAccount=$storageaccount storageAccountResourceGroup=$storageaccountresourcegroup storageAccountSubscriptionId=$subscriptionId
```

Then assign the required role to the extension on the storage account by running the following command:

```azurecli
az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor'  --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount

```

## Check Trusted Access

To check if Trusted Access is enabled between the Backup vault and Target AKS cluster, run the following command:

```azurecli
az aks trustedaccess rolebinding list --resource-group $aksclusterresourcegroup --cluster-name $targetakscluster
```

If it's not enabled, then run the following command to enable Trusted Access:

```azurecli
az aks trustedaccess rolebinding create --cluster-name $targetakscluster --name backuprolebinding --resource-group $aksclusterresourcegroup --roles Microsoft.DataProtection/backupVaults/backup-operator --source-resource-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/BackupVaults/$backupvault
```

## Restore to an AKS cluster 

### Fetch the relevant recovery point

Fetch all instances associated with the AKS cluster and identify the relevant instance.

```azurecli
az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --query aksAssignedIdentity.id

```


Once the instance is identified, fetch the relevant recovery point.

```azurecli
az dataprotection recovery-point list --backup-instance-name $backupinstancename --resource-group $backupvaultresourcegroup --vault-name $backupvault

```

### Prepare the restore request

To prepare the restore configuration defining the items to be restored to the target AKS cluster, run the `az dataprotection backup-instance initialize-restoreconfig` command.

```azurecli
az dataprotection backup-instance initialize-restoreconfig --datasource-type AzureKubernetesService >restoreconfig.json



{
  "conflict_policy": "Skip",
  "excluded_namespaces": null,
  "excluded_resource_types": null,
  "include_cluster_scope_resources": true,
  "included_namespaces": null,
  "included_resource_types": null,
  "label_selectors": null,
  "namespace_mappings": null,
  "object_type": "KubernetesClusterRestoreCriteria",
  "persistent_volume_restore_mode": "RestoreWithVolumeData"
}

```

Now, prepare the restore request with all relevant details. If you're restoring the backup to the original cluster, then run the following command:

```azurecli
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureKubernetesService --restore-location $region --source-datastore OperationalStore --recovery-point-id $recoverypointid --restore-configuration restoreconfig.json --backup-instance-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupInstances/$backupinstanceid >restorerequestobject.json

```

If the Target AKS cluster for restore is different from the original cluster, then run the following command:

```azurecli
az dataprotection backup-instance restore initialize-for-data-recovery --datasource-type AzureKubernetesService --restore-location $region --source-datastore OperationalStore --recovery-point-id $recoverypointid --restore-configuration restoreconfig.json --target-resource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$targetakscluster >restorerequestobject.json

```

Now, you can update the JSON object as per your requirements, and then validate the object by running the following command:

```azurecli
az dataprotection backup-instance validate-for-restore --backup-instance-name $backupinstancename --resource-group $backupvaultresourcegroup --restore-request-object restorerequestobject.json --vault-name $backupvault

```

This command checks if the AKS Cluster and Backup vault have required permissions on each other and the Snapshot resource group to perform restore. If the validation fails due to missing permissions, you can assign them by running the following command:

```azurecli
az dataprotection backup-instance update-msi-permissions --datasource-type AzureKubernetesService --operation Restore --permissions-scope Resource --resource-group  $backupvaultresourcegroup --vault-name $backupvault --restore-request-object restorerequestobject.json --snapshot-resource-group-id /subscriptions/$subscriptionId/resourceGroups/$snapshotresourcegroup

```

## Trigger the restore

Once the role assignment is complete, you should validate the restore object once more. After that, you can trigger a restore operation by running the following command:

```azurecli
az dataprotection backup-instance restore trigger --restore-request-object restorerequestobject.json --ids /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupInstances/$backupinstancename 
```

>[!Note]
>During the restore operation, the Backup vault and the AKS cluster need to have certain roles assigned to perform the restore:
>
>1. *Target AKS* cluster should have *Contributor* role on the *Snapshot Resource Group*.
>2. The *User Identity* attached with the Backup Extension should have *Storage Account Contributor* roles on the *storage account* where backups are stored. 
>3. The *Backup vault* should have a *Reader* role on the *Target AKS cluster* and *Snapshot Resource Group*.

## Tracking job

You can track the restore jobs using the `az dataprotection job` command. You can list all jobs and fetch a particular job detail.

You can also use Resource Graph to track all jobs across all subscriptions, resource groups, and Backup vaults. Use the `az dataprotection job list-from-resourcegraph` command to get the relevant job.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --operation Restore
```

## Next steps

- [Manage Azure Kubernetes Service cluster backups (preview)](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup (preview)](azure-kubernetes-service-cluster-backup-concept.md)

