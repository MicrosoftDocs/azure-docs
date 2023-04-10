---
title: Back up Azure Kubernetes Service (AKS) using Azure Backup 
description: This article explains how to back up Azure Kubernetes Service (AKS) using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 03/27/2023
author: jyothisuri
ms.author: jsuri
---

# Back up Azure Kubernetes Service using Azure Backup (preview) 

This article describes how to configure and back up Azure Kubernetes Service (AKS).

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Before you start

- Currently, AKS backup supports Azure Disk-based persistent volumes (enabled by CSI driver) only. The backups are stored in operational datastore only (backup data is stored in your tenant only and isn't moved to a vault). The Backup vault and AKS cluster should be in the same region.

- AKS backup uses a blob container and a resource group to store the backups. The blob container has the AKS cluster resources stored in it, whereas the persistent volume snapshots are stored in the resource group. The AKS cluster and the storage locations must reside in the same region. Learn [how to create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).

- Currently, AKS backup supports once-a-day backup. It also supports more frequent backups (in every *4*, *8*, and *12* hours intervals) per day. This solution allows you to retain your data for restore for up to 360 days. Learn to [create a backup policy](#create-a-backup-policy).

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) to configure backup and restore operations on an AKS cluster. Learn more [about Backup Extension](azure-kubernetes-service-cluster-backup-concept.md#backup-extension).

- Ensure that `Microsoft.KubernetesConfiguration`, `Microsoft.DataProtection`, and the `TrustedAccessPreview` feature flag on `Microsoft.ContainerService` are registered for your subscription before initiating the backup configuration and restore operations.

- Ensure to perform [all the prerequisites](azure-kubernetes-service-cluster-backup-concept.md) before initiating backup or restore operation for AKS backup.

For more information on the supported scenarios, limitations, and availability, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Create a Backup vault

A Backup vault is a management entity that stores recovery points created over time and provides an interface to perform backup operations. These include taking on-demand backups, performing restores, and creating backup policies. Though operational backup of AKS cluster is a local backup and doesn't *store data* in the vault, the vault is required for various management operations. AKS backup requires the Backup vault and the AKS cluster to be in the same region.

>[!Note]
>The Backup vault is a new resource used for backing up newly supported workloads and is different from the already existing Recovery Services vault.

Learn [how to create a Backup vault](backup-vault-overview.md#create-a-backup-vault).


## Create a backup policy

Before you configure backups, you need to create a backup policy that defines the frequency of backup and retention duration of backups before getting deleted. You can also create a backup policy during the backup configuration.

To create a backup policy, follow these steps:

1. Go to **Backup center** and select  **+ Policy** to create a new backup policy.

   Alternatively, go to **Backup center** > **Backup policies** > **Add**.

2. Select **Datasource type** as **Kubernetes Service** and continue.

3. Enter a name for the backup policy (for example, *Default Policy*) and select the *Backup vault* (the new Backup vault you created) where the backup policy needs to be created. 

4. On the **Schedule + retention** tab, select the *backup frequency* – (*Hourly* or *Daily*), and then choose the *retention duration for the backups*. 

   >[!Note]
   >- You can edit the retention duration with default retention rule. You can't delete the default retention rule. 
   >- You can also create additional retention rules to store backups taken daily or weekly to be stored for a longer duration.

5. Once the backup frequency and retention settings configurations are complete, select **Next**.

6. On the **Review + create** tab, review the information, and then select **Create**.

## Configure backups

AKS backup allows you to back up an entire cluster or specific cluster resources deployed in the cluster, as required. You can also protect a cluster multiple times as per the deployed applications schedule and retention requirements or security requirements.

>[!Note]
>You can set up multiple backup instances for the same AKS cluster by:
>- Configuring backup in the same Backup vault with a different backup policy.
>- Configuring backup in a different Backup vault.

To configure backups for AKS cluster, follow these steps:

1. Go to **Backup center** and select **+ Backup** to start backing up an AKS cluster.

2. Select **Datasource Type** as **Kubernetes Service (Preview)**, and then continue.

3. Click **Select Vault**.

   The vault should be in the same region and subscription as the AKS cluster you want to back up.

4. Click **Select Kubernetes Cluster** to choose an *AKS cluster* to back up.

   After you select a cluster, a validation is performed on the cluster to check if it has Backup Extension installed and Trusted Access enabled for the selected vault.

5. Select **Install/Fix Extension** to install the **Backup Extension** on the cluster.

6. In the *context* pane, provide the *storage account* and *blob container* where you need to store the backup, and then select **Click on Install Extension**.

7. To enable *Trusted Access* and *other role permissions*, select **Grant Permission** > **Next**.

8. Select the backup policy that defines the schedule and retention policy for AKS backup, and then select **Next**.

9. Select **Add/Edit** to define the *backup instance configuration*.

10. In the *context* pane, enter the *cluster resources* that you want to back up.

    Learn about the [backup configurations](#backup-configurations).

11. Select the *snapshot resource group* where *persistent volume (Azure Disk) snapshots* need to be stored, and then select **Validate**.

   After validation, if the appropriate roles aren't assigned to the vault over snapshot resource group, the error **Role assignment not done** appears.

12. To resolve the error, select the *checkbox* corresponding to the *Datasource*, and then select **Assign Missing Role**.

13. Once the *role assignment* is successful, select **Next**.

14. Select **Configure Backup**. 

   Once the configuration is complete, the **Backup Instance** gets created.

### Backup configurations

As a part of AKS backup capability, you can back up all or specific cluster resources by using the filters available for the backup configurations. The defined backup configurations are referenced by the **Backup Instance Name**. You can use the following options to choose the *Namespaces* for backup:

- **All (including future Namespaces)**: This backs up all the current and future *Namespaces* with the underlying cluster resources.
- **Choose from list**: Select the specific *Namespaces* in the AKS cluster to be backed up.

If you want to check specific cluster resources, you can use labels attached to them in the textbox. Only the resources with entered labels are backed up. You can use multiple labels. You can also back up cluster scoped resources, secrets, and persistent volumes, and select the specific checkboxes under **Other Options**. 

## Next steps

- [Restore Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-restore.md)
- [Manage Azure Kubernetes Service cluster backups (preview)](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup (preview)](azure-kubernetes-service-cluster-backup-concept.md)
