---
title: "Quickstart: Configure an Azure Kubernetes Services cluster backup"
description: Learn how to configure backup for an Azure Kubernetes Service (AKS) cluster, and then use Azure Backup to back up specific items in the cluster.
ms.topic: quickstart
ms.date: 11/14/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Configure backup for an AKS cluster

In this quickstart, you configure backup for an Azure Kubernetes Service (AKS) cluster, and then use the Azure Backup configuration to back up specific items in the cluster.

You can use Azure Backup to back up AKS clusters by using an Azure Backup extension. The extension must be installed in the cluster. An AKS cluster backup includes cluster resources and persistent volumes that are attached to the cluster.

The Azure Backup vault communicates with the cluster via the Backup extension to complete backup and restore operations.

## Prerequisites

- Identify or [create an Azure Backup vault](create-manage-backup-vault.md) in the same region where you want to back up an AKS cluster.
- [Install the Backup extension](quick-install-backup-extension.md) in the AKS cluster that you want to back up.

## Configure backup for an AKS cluster

To configure backup for a cluster:

1. In the Azure portal, go to the AKS cluster that you want to back up.

1. Select **Backup** > **Configure backup**.
  
1. Select the Backup vault to configure backup.
  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot that shows the Configure backup page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The Backup vault should have *Trusted Access* enabled for the AKS cluster to be backed up. You can enable *Trusted Access* by selecting **Grant permission**. If it's already enabled, select **Next**.
    
    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review page for Configure Backup." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

    >[!NOTE]
    >Before you enable *Trusted Access*, enable the `TrustedAccessPreview` feature flag for the Microsoft.ContainerServices resource provider on the subscription.

1. Select the backup policy, which defines the schedule for backups and their retention period, and then select **Next**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot showing Backup policy page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

1. Select **Add/Edit** to define the Backup Instance configuration.
    
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot showing the Add/Edit option for configure backup." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the context pane, define the cluster resources you want to back up. [Learn more](./azure-kubernetes-service-cluster-backup-concept.md).
    :::image type="content" source="./media/quick-backup-aks/resources-to-backup.png" alt-text="Screenshot shows how to select resources to the Backup pane." lightbox="./media/quick-backup-aks/resources-to-backup.png":::

1. Select **Snapshot resource group** where the Persistent volumes (Azure Disk) snapshots will be stored. Then select **Validate**.  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot showing **Snapshot resource group** blade." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. After validation is complete, if appropriate roles aren't assigned to the vault on **Snapshot resource group**, an error appears.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot showing validation error message." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png":::  

1. To resolve the error, select the checkbox next to the **Datasource name** > **Assign missing roles**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot showing how to resolve validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::
1. Once the role assignment is complete, select **Next** and proceed for backup.
    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot showing resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::
1. Select Configure backup.

1. Once the configuration is complete, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   The Backup Instance is created after the backup configuration is complete.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot showing configured backup for AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::


## Next steps

Learn how to [restore backups to an AKS cluster](./azure-kubernetes-service-cluster-restore.md).

 
