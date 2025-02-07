---
title: Restore Azure Kubernetes Service (AKS) using Azure CLI
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure CLI.
ms.topic: how-to
ms.service: azure-backup
ms.date: 01/30/2025
ms.custom:
  - devx-track-azurecli
  - ignite-2023
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Kubernetes Service using Azure CLI 

This article describes how to restore Azure Kubernetes cluster from a restore point created by Azure Backup using Azure CLI. You can also restore AKS cluster using [Azure PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md).

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

You can perform both *Original-Location Recovery (OLR)* (restoring in the AKS cluster that was backed up) and *Alternate-Location Recovery (ALR)* (restoring in a different AKS cluster). You can also select the items to be restored from the backup that is Item-Level Recovery (ILR).

>[!Note]
>Before you initiate a restore operation, the target cluster should have Backup Extension installed and Trusted Access enabled for the Backup vault. [Learn more](azure-kubernetes-service-cluster-backup-using-cli.md#prepare-aks-cluster-for-backup).

## Before you start

Before you start restoring an AKS cluster, review the following details:

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-to-an-aks-cluster) to define parameters based on the cluster resources that are to be restored. 

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations) between the Backup vault and the AKS cluster.

- If the target AKS cluster version differs from the version used during backup, the restore operation may fail or complete with warnings for various scenarios like deprecated resources in the newer cluster version. If restoring from Vault tier, you can use the hydrated resources in the staging location to restore application resources to the target cluster.

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Validate and prepare target AKS cluster

Before you initiate a restore process, you must validate that AKS cluster is prepared for restore. It includes the Backup Extension to be installed with the extension having the permission on storage account where backups are stored/hydrated with Trusted Access enabled between target AKS cluster and Backup vault.

To validate and prepare AKS cluster for restore, run the following commands:

1. Check if Backup Extension is installed in the cluster.

    ```azurecli
    az k8s-extension show --name azure-aks-backup --cluster-type managedClusters --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup
    ```

2. If the extension is installed, then check if it has the right permissions on the storage account where backups are stored.

    ```azurecli
    az role assignment list --all --assignee  $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv)
    ```

3. If the role isn't assigned, then assign the role.

    ```azurecli
    az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor'  --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount

    ```

4. If the Backup Extension isn't installed, then run the following extension installation command with the *storage account and blob container where backups are stored* as input.

    ```azurecli
    az k8s-extension create --name azure-aks-backup --extension-type microsoft.dataprotection.kubernetes --scope cluster --cluster-type managedClusters --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --release-train stable --configuration-settings blobContainer=$blobcontainer storageAccount=$storageaccount storageAccountResourceGroup=$storageaccountresourcegroup storageAccountSubscriptionId=$subscriptionId
    ```

5. Assign the required role to the extension on the storage account.

    ```azurecli
    az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name $targetakscluster --resource-group $aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Blob Data Contributor'  --scope /subscriptions/$subscriptionId/resourceGroups/$storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/$storageaccount

    ```

## Check Trusted Access

To check if Trusted Access is enabled between the Backup vault and Target AKS cluster, run the following command:

```azurecli
az aks trustedaccess rolebinding list --resource-group $aksclusterresourcegroup --cluster-name $targetakscluster
```

If not then Trusted Access can be enabled with the following command:

```azurecli
az aks trustedaccess rolebinding create --cluster-name $targetakscluster --name backuprolebinding --resource-group $aksclusterresourcegroup --roles Microsoft.DataProtection/backupVaults/backup-operator --source-resource-id /subscriptions/$subscriptionId/resourceGroups/$backupvaultresourcegroup/providers/Microsoft.DataProtection/BackupVaults/$backupvault
```

## Restore to an AKS cluster 

To restore to an AKS cluster, see the following sections.

### Fetch the relevant recovery point

To fetch the relevant recovery point, run the following commands:

1. Fetch all instances associated with the AKS cluster and identify the relevant instance.

    ```azurecli
    az dataprotection backup-instance list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster 

    ```


2. Once the instance is identified, fetch the relevant recovery point.

    ```azurecli
    az dataprotection recovery-point list --backup-instance-name $backupinstancename --resource-group $backupvaultresourcegroup --vault-name $backupvault

    ```
3. If you're looking to restore backups to the secondary region, use the flag `--use-secondary-region` to identify recovery points available in that region.

    ```azurecli
    az dataprotection recovery-point list --backup-instance-name $backupinstancename --resource-group $backupvaultresourcegroup --vault-name $backupvault --use-secondary-region true

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
  "persistent_volume_restore_mode": "RestoreWithVolumeData",
  "resource_modifier_reference": null,
  "restore_hook_references": null,
  "staging_resource_group_id": null,
  "staging_storage_account_id": null
}

```

The restore configuration is composed of following items:

- `conflict_policy`: During a restore, if a resource with the same name exists in the cluster as in the backup, you can choose how to handle the conflict. You have two options: Skip, which won't restore the backup item, or Update, which modifies the mutable fields of the in-cluster resource with the resource stored in the backup.

- `excluded_namespace`: You can list down the namespaces to be excluded from being restored into the cluster. Resource underlying those namespaces won't be restored.

- `excluded_resource_types`: You can list down the resource types to be excluded from being restored into the cluster. The values in input should be provided as API Group Kind as key value pair.

- `include_cluster_scope_resources`: You can decide whether you want to restore cluster scoped resources or not by setting the value as true or false.

- `included_namespaces` : You can list down the namespaces to be only included as part of restoration to the cluster. Resource underlying those namespaces are to be restored.

- `excluded_resource_types`: You can list down the resource types to be only included for restoration into the cluster. The values in input should be provided as API Group Kind as key value pair.
  
- `label_selectors`: You can select resources to be restored with specific labels in them. The input value should be provided as key value pair.

- `namespace_mappings`: You can map namespace (and underlying resources) to a different namespace in the target cluster. If the target namespace doesn't exist in the cluster, then a new namespace is created by the extension. The input value should be provided as key value pair.

- `persistent_volume_restore_mode`: You can use this variable to decide whether you would like to restore the persistent volumes backed up or not. Accepted values are RestoreWithVolumeData, RestoreWithoutVolumeData

- `resource_modifier_reference`: You can refer the Resource Modifier resource deployed in the cluster with this variable. The input value is a key value pair of the Namespace in which the resource is deployed and the name of the yaml file.

- `restore_hook_references`: You can refer the Restore Hook resource deployed in the cluster with this variable. The input value is a key value pair of the Namespace in which the resource is deployed and the name of the yaml files.

- `staging_resource_group_id`: In case you're restoring backup stored in the **vault tier**, you need to provide an ID of resource group as a staging location. In this resource group, the backed up persistent volumes are hydrated before being restored to the target cluster. 

- `staging_storage_account_id`: In case you're restoring backup stored in the **vault tier**, you need to provide an ID of storage account as a staging location. In this resource group, the backed up kubernetes resources are hydrated before being restored to the target cluster. 

Now, prepare the restore request with all relevant details. If you're restoring the backup to the original cluster, then run the following command:

```azurecli
az dataprotection backup-instance restore initialize-for-item-recovery --datasource-type AzureKubernetesService --restore-location $region --source-datastore OperationalStore --recovery-point-id $recoverypointid --restore-configuration restoreconfig.json --backup-instance-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.DataProtection/backupVaults/$backupvault/backupInstances/$backupinstanceid >restorerequestobject.json

```

If the Target AKS cluster for restore is different from the original cluster, then run the following command:

```azurecli
az dataprotection backup-instance restore initialize-for-data-recovery --datasource-type AzureKubernetesService --restore-location $region --source-datastore OperationalStore --recovery-point-id $recoverypointid --restore-configuration restoreconfig.json --target-resource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$targetakscluster >restorerequestobject.json

```

>[!Note]
> In case you have picked a recovery point from vault tier with `--source-datastore` as VaultStore then provide a storage account and snapshot resource group in restore configuration.
>
>In case you are trying to restore to the cluster in the secondary region, then set the flag `--restore-location` as the name of the secondary region and `--source-datastore` as VaultStore. 

Now, you can update the JSON object as per your requirements, and then validate the object by running the following command:

```azurecli
az dataprotection backup-instance validate-for-restore --backup-instance-name $backupinstancename --resource-group $backupvaultresourcegroup --restore-request-object restorerequestobject.json --vault-name $backupvault

```

This command checks if the AKS Cluster and Backup vault have the required roles on different resource needed to perform restore. If the validation fails due to missing roles, you can assign them by running the following command:

```azurecli
az dataprotection backup-instance update-msi-permissions --datasource-type AzureKubernetesService --operation Restore --permissions-scope Resource --resource-group  $backupvaultresourcegroup --vault-name $backupvault --restore-request-object restorerequestobject.json --snapshot-resource-group-id /subscriptions/$subscriptionId/resourceGroups/$snapshotresourcegroup

```

>[!Note]
>During the restore operation, the Backup vault and the AKS cluster need to have certain roles assigned to perform the restore:
>
> - *Target AKS* cluster should have *Contributor* role on the *Snapshot Resource Group*.
> - The *User Identity* attached with the Backup Extension should have *Storage Blob Data Contributor* roles on the *storage account* where backups are stored in case of Operational Tier and on the **staging storage account* in case of Vault Tier. 
> - The *Backup vault* should have a *Reader* role on the *Target AKS cluster* and *Snapshot Resource Group* in case of restoring from Operational Tier.
> - The *Backup vault* should have a *Contributor* role on the *Staging Resource Group* in case of restoring backup from Vault Tier. 
> - The *Backup vault* should have a *Storage Account Contributor* and *Storage Blob Data Owner* role on the *Staging Resource Group* in case of restoring backup from Vault Tier. 

## Trigger the restore

Once the role assignment is complete, you should validate the restore object once more. After that, you can trigger a restore operation by running the following command:

```azurecli
az dataprotection backup-instance restore trigger --backup-instance-name $backupinstancename --restore-request-object restorerequestobject.json 
```

>[!Note]
>The resources hydrated in the staging resource group and storage account are not automatically cleaned up after the restore job is completed and are to be deleted manually.

## Tracking job

You can track the restore jobs using the `az dataprotection job` command. You can list all jobs and fetch a particular job detail.

You can also use Resource Graph to track all jobs across all subscriptions, resource groups, and Backup vaults. Use the `az dataprotection job list-from-resourcegraph` command to get the relevant job.

```azurecli
az dataprotection job list-from-resourcegraph --datasource-type AzureKubernetesService --datasource-id /subscriptions/$subscriptionId/resourceGroups/$aksclusterresourcegroup/providers/Microsoft.ContainerService/managedClusters/$akscluster --operation Restore
```

## Next steps

- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
