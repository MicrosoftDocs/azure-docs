---
title: Quickstart - Configure backup of an AKS cluster 
description: In this quickstart, learn how to configure backup of an AKS cluster and utilize Azure Backup to back up specific items from the cluster.
ms.topic: quickstart
ms.date: 10/17/2023
ms.service: backup
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure backup of an AKS cluster 

This quickstart how to configure backup of an AKS Cluster and utilize the Backup configuration to back up specific items from the cluster. 

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations.

## Prerequisites

- Identify or [create a Backup vault](./tutorial-postgresql-backup.md) in the same region where you want to back up the AKS cluster.
- Install [Backup Extension](./quick-backup-vm-portal.md) in the AKS cluster to be backed up. 


## Configure backup of an AKS cluster

To configure backup of an AKS cluster, follow these steps:
 
1. In the Azure portal, navigate to the selected Kubernetes services and select **Backup (preview)** > **Configure backup**.
    
    :::image type="content" source="./media/quick-backup-aks/configure-backup.png" alt-text="Screenshot showing **Configure backup** option." lightbox="./media/quick-backup-aks/configure-backup.png":::

1. Select the Backup vault to configure backup.
    
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot showing **Configure backup** homepage." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The Backup vault should have *Trusted Access* enabled for the AKS cluster to be backed up. You can enable *Trusted Access* by selecting **Grant permission**. If it's already enabled, select **Next**.
    
    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review page for Configure Backup." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

    >[!NOTE]
    >Before you enable *Trusted Access*, enable the `TrustedAccessPreview` feature flag for the Microsoft.ContainerServices resource provider on the subscription.

1. Select the backup policy, which defines the schedule for backups and their retention period. Then select **Next**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot showing Backup policy page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

1. Select **Add/Edit** to define the Backup Instance configuration.
    
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot showing the Add/Edit option for configure backup." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the context pane, define the cluster resources you want to back up. Learn about [backup configurations](./azure-kubernetes-service-cluster-backup-concept.md).
    :::image type="content" source="./media/quick-backup-aks/resources-to-backup.png" alt-text="Screenshot showing Select Resources to Backup blade." lightbox="./media/quick-backup-aks/resources-to-backup.png":::

1. Select **Snapshot resource group** where the Persistent volumes (Azure Disk) snapshots will be stored. Then select **Validate**.  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot showing **Snapshot resource group** blade." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. After validation is complete, if appropriate roles aren't assigned to the vault on **Snapshot resource group**, an error appears. See the following screenshot to check the error.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot showing validation error message." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png":::  

1. To resolve the error, select the checkbox next to the **Datasource name** > **Assign missing roles**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot showing how to resolve validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::
1. Once the role assignment is complete, select **Next** and proceed for backup.
    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot showing resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::
1. Select Configure backup.
    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::
1. Once the configuration is complete, the Backup Instance is created.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot showing configured backup for AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::


## Next steps

Learn how to [restore backups to an AKS cluster](./azure-kubernetes-service-cluster-restore.md).

 