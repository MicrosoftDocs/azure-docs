---
title: Manage Azure Kubernetes Service (AKS) backups using Azure Backup
description: This article explains how to manage Azure Kubernetes Service (AKS) backups using Azure Backup.
ms.topic: how-to
ms.service: azure-backup
ms.custom:
  - devx-track-azurecli
  - ignite-2023
  - ignite-2024
ms.date: 02/28/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Manage Azure Kubernetes Service backups using Azure Backup 

This article describes how to register resource providers on your subscriptions for using Backup Extension and Trusted Access. Also, it provides you with the Azure CLI commands to manage them.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. AKS cluster requires Trusted Access enabled with Backup vault, so that the vault can communicate with the Backup Extension to perform backup and restore operations.

In addition, it helps to describe how to manage backup for the Azure Kubernetes Service clusters from the Azure portal.

## Resource provider registrations

- You must register these resource providers on the subscription before initiating any backup and restore operation.
- Once the registration is complete, you can perform backup and restore operations on all the cluster under the subscription.

### Register the Backup Extension

To install Backup Extension, you need to register `Microsoft.KubernetesConfiguration` resource provider on the subscription. To perform the registration, run the following command:

   ```azurecli-interactive
   az provider register --namespace Microsoft.KubernetesConfiguration
   ```

The registration can take up to *10 minutes*. To monitor the registration process, run the following command:

   ```azurecli-interactive
   az provider show --name Microsoft.KubernetesConfiguration --output table
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

The backup extension creates a User Assigned Managed Identity in the cluster's managed resource group. This identity needs to be provided *Storage Blob Data Contributor Permission* on storage account by running the following command:

   ```azurecli-interactive
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name <aksclustername> --resource-group <aksclusterrg> --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Blob Data Contributor' --scope /subscriptions/<subscriptionid>/resourceGroups/<storageaccountrg>/providers/Microsoft.Storage/storageAccounts/<storageaccountname> 
   ```


## Trusted Access related operations

To enable Trusted Access between Backup vault and AKS cluster, use the following Azure CLI command:

   ```azurecli-interactive
   az aks trustedaccess rolebinding create \
   --resource-group <aksclusterrg> \
   --cluster-name <aksclustername> \
   --name <randomRoleBindingName> \
   --source-resource-id $(az dataprotection backup-vault show --resource-group <vaultrg> --vault <VaultName> --query id -o tsv) \
   --roles Microsoft.DataProtection/backupVaults/backup-operator   
   ```

Learn more about [other commands related to Trusted Access](/azure/aks/trusted-access-feature#trusted-access-feature-overview).

## Monitor a backup operation

The Azure Backup service creates a job for scheduled backups or if you trigger on-demand backup operation for tracking. To view the backup job status:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. Here you can see the backup jobs for the last seven days. 

1. To view the status of the backup operation, select **View all** to show ongoing and past jobs of this backup instance.

   ![Screenshot shows how to select the view all option.](./media/backup-managed-disks/view-all.png)

1. Review the list of backup and restore jobs and their status. Select a job from the list of jobs to view job details.

   ![Screenshot shows how to select a job to see details.](./media/backup-managed-disks/select-job.png)

## Monitor a restore operation

After you trigger the restore operation, the backup service creates a job for tracking. Azure Backup displays notifications about the job in the portal. To view the restore job progress:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. Here you can see the backup jobs for the last seven days. 

1. To view the status of the restore operation, select **View all** to show ongoing and past jobs of this backup instance.

    ![Screenshot shows how to select View all.](./media/restore-managed-disks/view-all.png)

1. Review the list of backup and restore jobs and their status. Select a job from the list of jobs to view job details.

    ![Screenshot shows the list of jobs.](./media/restore-managed-disks/list-of-jobs.png)


## Monitor AKS backup related jobs with the completed with warnings status

When a scheduled or an on-demand backup or restore operation is performed, a job is created corresponding to the operation to track its progress. If there is a failure, these jobs allow you to identify error codes and fix issues to run a successful job later. 

For AKS backup, backup and restore jobs can show the status **Completed with Warnings**. This status appears when the backup and restore operation isn't fully successful due to issues in user-defined configurations or internal state of the workload.

:::image type="content" source="./media/azure-kubernetes-service-cluster-manage-backups/backup-restore-jobs-completed-with-warnings.png" alt-text="Screenshot shows the backup and restore jobs completed with warnings." lightbox="./media/azure-kubernetes-service-cluster-manage-backups/backup-restore-jobs-completed-with-warnings.png":::

For example, if a backup job for an AKS cluster completes with the status **Completed with Warnings**, a restore point is created, but it does not have all the resources in the cluster backed up as per the backup configuration. The job shows warning details, providing the *issues* and *resources* that were impacted during the operation. 

To view these warnings, select **View Details** next to **Warning Details**.

:::image type="content" source="./media/azure-kubernetes-service-cluster-manage-backups/example-backup-job-with-warning-details.png" alt-text="Screenshot shows the job warming details." lightbox="./media/azure-kubernetes-service-cluster-manage-backups/example-backup-job-with-warning-details.png"::: 

Learn [how to identify and resolve the error](azure-kubernetes-service-backup-troubleshoot.md#aks-backup-extension-installation-error-resolutions). 


## Manage operations using the Azure portal

This section describes several Azure Backup supported management operations that make it easy to manage Azure Kubernetes Service cluster backups.

### Stop Protection


There are three ways by which you can stop protecting an Azure Disk:

- **Stop Protection and Retain Data (Retain forever)**: This option helps you stop all future backup jobs from protecting your cluster. However, Azure Backup service retains the recovery points that are backed up forever. You need to pay to keep the recovery points in the vault (see [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/) for details). You are able to restore the disk, if needed. To resume cluster protection, use the **Resume backup** option.

- **Stop Protection and Retain Data (Retain as per Policy)**: This option helps you stop all future backup jobs from protecting your cluster. The recovery points are retained as per policy and will be chargeable according to [Azure Backup pricing](https://azure.microsoft.com/pricing/details/backup/). However, the latest recovery point is retained forever.

- **Stop Protection and Delete Data**: This option helps you stop all future backup jobs from protecting your clusters and delete all the recovery points. You won't be able to restore the disk or use the **Resume backup** option.

#### Stop Protection and Retain Data

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Stop Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/select-disk-backup-instance-to-stop-inline.png" alt-text="Screenshot showing the selection of the Azure disk backup instance to be stopped." lightbox="./media/manage-azure-managed-disks/select-disk-backup-instance-to-stop-expanded.png":::
 
1. Select one of the following data retention options:

   1. Retain forever
   1. Retain as per policy
 
   :::image type="content" source="./media/manage-azure-managed-disks/data-retention-options-for-disk-inline.png" alt-text="Screenshot showing the options to stop disk backup instance protection." lightbox="./media/manage-azure-managed-disks/data-retention-options-for-disk-expanded.png":::

   You can also select the reason for stopping backups  from the drop-down list.

1. Select **Stop Backup**.

1. Select **Confirm** to stop data protection.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-inline.png" alt-text="Screenshot showing the options for disk backup instance retention to be selected." lightbox="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-expanded.png":::

#### Stop Protection and Delete Data

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Stop Backup**.

1. Select **Delete Backup Data**.

   Provide the name of the backup instance, reason for deletion, and any other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/details-to-stop-disk-backup-inline.png" alt-text="Screenshot for the confirmation for stopping disk backup." lightbox="./media/manage-azure-managed-disks/details-to-stop-disk-backup-expanded.png":::

1. Select **Stop Backup**.

1. Select **Confirm** to stop data protection.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-inline.png" alt-text="Screenshot showing the options for disk backup instance retention to be selected." lightbox="./media/manage-azure-managed-disks/confirm-stopping-disk-backup-expanded.png":::

### Resume Protection

If you have selected the **Stop Protection and Retain data** option, you can resume protection for your clusters.

>[!Note]
>When you start protecting a clusters, the backup policy is applied to the retained data as well. The recovery points that have expired as per the policy will be cleaned up.

Use the following steps:

1. Go to the **Azure Business Continuity Center** and select **Protected Items** under **Protection Inventory**.

   The **Protected Items** blade shows all the backup instances created across the subscriptions. Use the filters to access the backup instance you would like to take a look at. Select on the protected item and open it.

   :::image type="content" source="./media/backup-managed-disks/jobs-dashboard.png" alt-text="Screenshot shows the jobs dashboard." lightbox="./media/backup-managed-disks/jobs-dashboard.png":::

1. Now select on the **Associated Items** to open up the dashboard for the backup instance. 

1. Select **Resume Backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-protection-inline.png" alt-text="Screenshot showing the option to resume protection of disk." lightbox="./media/manage-azure-managed-disks/resume-disk-protection-expanded.png":::

1. Select **Resume backup**.

   :::image type="content" source="./media/manage-azure-managed-disks/resume-disk-backup-inline.png" alt-text="Screenshot showing the option to resume disk backup." lightbox="./media/manage-azure-managed-disks/resume-disk-backup-expanded.png":::

### Delete Backup Instance

If you choose to stop all scheduled backup jobs and delete all existing backups, use **Delete Backup Instance**.

To delete an AKS cluster backup instance, follow these steps:

1. Select **Delete** on the backup instance screen.

   :::image type="content" source="./media/manage-azure-managed-disks/initiate-deleting-backup-instance-inline.png" alt-text="Screenshot showing the process to delete a backup instance." lightbox="./media/manage-azure-managed-disks/initiate-deleting-backup-instance-expanded.png":::

1. Provide confirmation details including name of the Backup instance, reason for deletion, and other comments.

   :::image type="content" source="./media/manage-azure-managed-disks/confirm-deleting-backup-instance-inline.png" alt-text="Screenshot showing to confirm the deletion of backup instances." lightbox="./media/manage-azure-managed-disks/confirm-deleting-backup-instance-expanded.png":::

1. Select **Delete** to confirm and proceed with deleting backup instance.


## Next steps

- [Back up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
- [Supported scenarios for backing up Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-backup-support-matrix.md)
