---
title: Manage Azure Kubernetes Service (AKS) backups using Azure Backup
description: This article explains how to manage Azure Kubernetes Service (AKS) backups using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.custom:
  - devx-track-azurecli
  - ignite-2023
ms.date: 02/28/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage Azure Kubernetes Service backups using Azure Backup 

This article describes how to register resource providers on your subscriptions for using Backup Extension and Trusted Access. Also, it provides you with the Azure CLI commands to manage them.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. AKS cluster requires Trusted Access enabled with Backup vault, so that the vault can communicate with the Backup Extension to perform backup and restore operations.

## Resource provider registrations

- You must register these resource providers on the subscription before initiating any backup and restore operation.
- Once the registration is complete, you can perform backup and restore operations on all the cluster under the subscription.

### Register the Backup Extension

To install Backup Extension, you need to register `Microsoft.KubernetesConfiguration` resource provider on the subscription. To perform the registration, run the following command:

   ```azurecli-interactive
   az provider register --namespace Microsoft.KubernetesConfiguration
   ```

The registration may take up to *10 minutes*. To monitor the registration process, run the following command:

   ```azurecli-interactive
   az provider show -n Microsoft.KubernetesConfiguration -o table
   ```

### Register the Trusted Access

To enable Trusted Access between the Backup vault and AKS cluster, you must register *TrustedAccessPreview* feature flag on *Microsoft.ContainerService* over the subscription. To perform the registration, run the following commands:

## Enable the feature flag

To enable the feature flag follow these steps:

1. Install the *aks-preview* extension:

   ```azurecli-interactive
   az extension add --name aks-preview
   ```

1. Update to the latest version of the extension released:

   ```azurecli-interactive
   az extension update --name aks-preview
   ```

1. Register the *TrustedAccessPreview* feature flag:

   ```azurecli-interactive
   az feature register --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
   ```
   
   It takes a few minutes for the status to show *Registered*.

1. Verify the registration status:

   ```azurecli-interactive
   az feature show --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
   ```

1. When the status shows *Registered*, refresh the `Microsoft.ContainerService` resource provider registration:

   ```azurecli-interactive
   az provider register --namespace Microsoft.ContainerService
   ```

## Backup Extension related operations

This section provides the set of Azure CLI commands to perform create, update, or delete operations on the Backup Extension. You can use the update command to change compute limits for the underlying Backup Extension Pods.

### Install Backup Extension

To install the Backup Extension, run the following command:

   ```azurecli-interactive
   az k8s-extension create --name azure-aks-backup --extension-type microsoft.dataprotection.kubernetes --scope cluster --cluster-type managedClusters --cluster-name <aksclustername> --resource-group <aksclusterrg> --release-train stable --configuration-settings blobContainer=<containername> storageAccount=<storageaccountname> storageAccountResourceGroup=<storageaccountrg> storageAccountSubscriptionId=<subscriptionid>
   ```

### View Backup Extension installation status

To view the progress of Backup Extension installation, use the following command:

   ```azurecli-interactive
   az k8s-extension show --name azure-aks-backup --cluster-type managedClusters --cluster-name <aksclustername> --resource-group <aksclusterrg>
   ```

### Update resources in Backup Extension

To update blob container, CPU, and memory in the Backup Extension, use the following command:

   ```azurecli-interactive
   az k8s-extension update --name azure-aks-backup --cluster-type managedClusters --cluster-name <aksclustername> --resource-group <aksclusterrg> --release-train stable --configuration-settings [blobContainer=<containername> storageAccount=<storageaccountname> storageAccountResourceGroup=<storageaccountrg> storageAccountSubscriptionId=<subscriptionid>] [cpuLimit=1] [memoryLimit=1Gi]
   
   []: denotes the 3 different sub-groups of updates possible (discard the brackets while using the command)

   ```

### Delete Backup Extension installation operation

To stop the Backup Extension install operation, use the following command:

   ```azurecli-interactive
   az k8s-extension delete --name azure-aks-backup --cluster-type managedClusters --cluster-name <aksclustername> --resource-group <aksclusterrg>
   ```

### Grant permission on storage account

To provide *Storage Account Contributor Permission* to the Extension Identity on storage account, run the following command:

   ```azurecli-interactive
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name <aksclustername> --resource-group <aksclusterrg> --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Blob Data Contributor' --scope /subscriptions/<subscriptionid>/resourceGroups/<storageaccountrg>/providers/Microsoft.Storage/storageAccounts/<storageaccountname> 
   ```


## Trusted Access related operations

To enable Trusted Access between Backup vault and AKS cluster, use the following Azure CLI command:

   ```azurecli-interactive
   az aks trustedaccess rolebinding create \
   -g <aksclusterrg> \
   --cluster-name <aksclustername> \
   -n <randomRoleBindingName> \
   --source-resource-id $(az dataprotection backup-vault show -g <vaultrg> --vault <VaultName> --query id -o tsv) \
   --roles Microsoft.DataProtection/backupVaults/backup-operator   
   ```

Learn more about [other commands related to Trusted Access](../aks/trusted-access-feature.md#trusted-access-feature-overview).

## Monitor AKS backup jobs completed with warnings

When a scheduled or an on-demand backup or restore operation is performed, a job is created corresponding to the operation to track its progress. In case of a failure, these jobs allow you to identify error codes and fix issues to run a successful job later. 

For AKS backup, backup and restore jobs can show the status **Completed with Warnings**. This status appears when the backup and restore operation isn't fully successful due to issues in user-defined configurations or internal state of the workload.

:::image type="content" source="./media/azure-kubernetes-service-cluster-manage-backups/backup-restore-jobs-completed-with-warnings.png" alt-text="Screenshot shows the backup and restore jobs completed with warnings." lightbox="./media/azure-kubernetes-service-cluster-manage-backups/backup-restore-jobs-completed-with-warnings.png":::

For example, if a backup job for an AKS cluster completes with the status **Completed with Warnings**, a restore point will be created, but it might not have been able to back up all the resources in the cluster as per the backup configuration. The job will show warning details, providing the *issues* and *resources* that were impacted during the operation. 

To view these warnings, select **View Details** next to **Warning Details**.

:::image type="content" source="./media/azure-kubernetes-service-cluster-manage-backups/example-backup-job-with-warning-details.png" alt-text="Screenshot shows the job warming details." lightbox="./media/azure-kubernetes-service-cluster-manage-backups/example-backup-job-with-warning-details.png"::: 

Learn [how to identify and resolve the error](azure-kubernetes-service-backup-troubleshoot.md#aks-backup-extension-installation-error-resolutions). 

## Next steps

- [Back up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
- [Supported scenarios for backing up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup-support-matrix.md)
