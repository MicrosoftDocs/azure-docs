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

1. In the Azure portal, go to the AKS cluster that you want to back up.

1. In the resource menu, select **Backup**, and then select **Configure Backup**.
  
1. Select a backup vault to use for the AKS instance backup.
  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot that shows the Configure Backup page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The backup vault must have **Trusted Access** enabled for the AKS cluster to be backed up. To enable **Trusted Access**, select **Grant permission**. If it's already enabled, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows the review page for Configure Backup." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   > [!NOTE]
   > Before you enable **Trusted Access**, enable the `TrustedAccessPreview` feature flag for the Microsoft.ContainerServices resource provider on the subscription.

1. Select a backup policy, which defines the schedule for backups and their retention period. Then select **Next**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot that shows the Backup policy tab." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

1. On the **Datasources** tab, select **Add/Edit** to define the backup instance configuration.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot that shows the Add/Edit option on the Datasources tab." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the **Select Resources to Backup** pane, define the cluster resources that you want to back up. [Learn more](./azure-kubernetes-service-cluster-backup-concept.md).

    :::image type="content" source="./media/quick-backup-aks/resources-to-backup.png" alt-text="Screenshot shows how to select resources to add to the backup." lightbox="./media/quick-backup-aks/resources-to-backup.png":::

1. For **Snapshot resource group**, select the resource group that you want to store the persistent volumes (Azure Disk) snapshots. Then select **Validate**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot that shows the Snapshot resource group dropdown." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. When validation is finished, if appropriate roles aren't assigned to the vault for **Snapshot resource group**, an error appears.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot that shows validation error message." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png":::  

1. To resolve the error, select the checkbox next to **Datasource name** > **Assign missing roles**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot that shows how to resolve validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::

1. When the role assignment is complete, select **Next** and proceed to back up.

    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot that shows resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::

1. Select **Configure backup**.

1. When the configuration is finished, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows the Review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   The backup instance is created when you finish configuring the backup.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot that shows a configured backup for an AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::

## Next step

> [!div class="nextstepaction"]
> [Restore a backup for an AKS cluster](./azure-kubernetes-service-cluster-restore.md)
