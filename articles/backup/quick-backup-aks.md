---
title: "Quickstart: Configure an Azure Kubernetes Services cluster backup"
description: Learn how to configure backup for an Azure Kubernetes Service (AKS) cluster, and then use Azure Backup to back up specific items in the cluster.
ms.topic: quickstart
ms.date: 01/21/2025
ms.service: azure-backup
ms.custom:
  - ignite-2024
author: jyothisuri
ms.author: jsuri
---

# Quickstart: Configure backup for an AKS cluster

In this quickstart, you configure vaulted backup for an Azure Kubernetes Service (AKS) cluster, and then use the Azure Backup configuration to back up specific items in the cluster.

You can use Azure Backup to back up AKS clusters by installing the Backup extension. The extension must be installed in the cluster. An AKS cluster backup includes cluster resources and persistent volumes that are attached to the cluster.

The Backup vault communicates with the cluster via the Backup extension to complete backup and restore operations.

## Prerequisites

Before you configure vaulted backup for AKS cluster, ensure the following prerequisites are met:

- Identify or [create a Backup vault](create-manage-backup-vault.md) in the same region where you want to back up an AKS cluster.
- [Install the Backup extension](quick-install-backup-extension.md) in the AKS cluster that you want to back up.

## Configure vaulted backup for an AKS cluster

1. In the [Azure portal](https://portal.azure.com), go to the AKS cluster that you want to back up.

1. In the resource menu, select **Backup**, and then select **Configure Backup**.
  
1. Select a Backup vault to use for the AKS instance backup.
  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot that shows the Configure Backup page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The Backup vault must have Trusted Access enabled for the AKS cluster that you want to back up. To enable Trusted Access, select **Grant permission**. Once enabled, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows the review page for Configure Backup." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   > [!NOTE]
   > In case you are looking to backup you AKS clusters in a secondary region, select a Backup vault with Storage Redundancy set as Globally redundant and Cross Region Restore enabled.

1. Select a backup policy, which defines the schedule for backups and their retention period. Then select **Next**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot that shows the Backup policy tab." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

   > [!NOTE]
   > Please add a retention rule for Vault Tier if you are looking to store backups for long term for compliance reasons, enable ransomware protection features or use them for regional disaster recovery. 

1. On the **Datasources** tab, select **Add/Edit** to define the backup instance configuration.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot that shows the Add/Edit option on the Datasources tab." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the **Select Resources to Backup** pane, define the cluster resources that you want to back up. [Learn more](./azure-kubernetes-service-cluster-backup-concept.md).

    :::image type="content" source="./media/quick-backup-aks/resources-to-backup.png" alt-text="Screenshot that shows how to select resources to add to the backup." lightbox="./media/quick-backup-aks/resources-to-backup.png":::

1. For **Snapshot resource group**, select the resource group that you want to use to store the persistent volume (Azure Disk Storage) snapshots. Then select **Validate**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot that shows the Snapshot resource group dropdown." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. When validation is finished, if required roles aren't assigned to the vault in the snapshot resource group, an error appears.
     :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-permissions-not-assigned.png" alt-text="Screenshot that shows a validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-permissions-not-assigned.png":::  

1. To resolve the error, under **Datasource name**, select the datasource, and then select **Assign missing roles**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot that shows how to resolve a validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::

1. When role assignment is finished, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot that shows the resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::

1. Select **Configure backup**.

1. When the configuration is finished, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows the Review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   The backup instance is created when you finish configuring the backup.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot that shows a backup configured for an AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::

## Next step

Restore a backup for an AKS cluster using:

> [!div class="nextstepaction"]
>- [Azure portal](./azure-kubernetes-service-cluster-restore.md)
>- [Azure CLI](azure-kubernetes-service-cluster-restore-using-cli.md)
