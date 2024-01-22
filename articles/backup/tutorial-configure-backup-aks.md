---
title: "Tutorial: Configure item-level backup for an Azure Kubernetes Service cluster"
description: Learn how to configure backup for an Azure Kubernetes Service (AKS) cluster, and use Azure Backup to back up specific items from the cluster.
ms.topic: tutorial
ms.date: 11/14/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Configure item-level backup for an Azure Kubernetes Service cluster

This tutorial describes how to configure backup for an Azure Kubernetes Service (AKS) cluster, and then use the Azure Backup configuration to back up specific items in the cluster.

You also learn how to use backup hooks in a backup configuration to achieve application-consistent backups for databases that are deployed in an AKS cluster.

You can use Azure Backup to back up AKS clusters by using the Backup extension. The extension must be installed in the cluster. An AKS cluster backup includes cluster resources and persistent volumes that are attached to the cluster.

The Backup vault communicates with the cluster via the Backup extension to complete backup and restore operations.

## Prerequisites

- Identify or [create a Backup vault](create-manage-backup-vault.md) in the same region where you want to back up an AKS cluster.
- [Install the Backup extension](quick-install-backup-extension.md) in the AKS cluster that you want to back up.

## Configure backup for an AKS cluster

1. In the Azure portal, go to the AKS cluster that you want to back up.

1. In the resource menu, select **Backup**, and then select **Configure Backup**.

1. Select a Backup vault to use for the AKS instance backup.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot that shows the Configure backup page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The Backup vault must have Trusted Access enabled for the AKS cluster that you want to back up. To enable Trusted Access, select **Grant permission**. If it's already enabled, select **Next**.

    :::image type="content" source="./media/tutorial-configure-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows the review page for Configure Backup." lightbox="./media/tutorial-configure-backup-aks/backup-vault-review.png":::

    > [!NOTE]
    > Before you enable Trusted Access, enable the `TrustedAccessPreview` feature flag for the `Microsoft.ContainerServices` resource provider on the subscription.

1. Select a backup policy, which defines the schedule for backups and their retention period. Then select **Next**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot that shows the Backup policy page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

1. On the **Datasources** tab, select **Add/Edit** to define the backup instance.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot that shows the Add/Edit option on the Datasources tab." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the **Select Resources to Backup** pane, define the cluster resources to back up.

1. You can use the backup configuration for item-level backups and to run custom hooks. For example, you can use it to achieve application-consistent backup of databases:

    1. For **Backup Instance name**, enter a value and assign it to the backup instance that's configured for the application in the AKS cluster.

        :::image type="content" source="./media/tutorial-configure-backup-aks/resources-to-backup.png" alt-text="Screenshot that shows how to select resources to include in the backup." lightbox="./media/tutorial-configure-backup-aks/resources-to-backup.png":::

    1. For **Select Namespaces to backup**, you can either select **All** to back up all existing and future namespaces in the cluster, or you can select **Choose from list** to select specific namespaces for backup.

        :::image type="content" source="./media/tutorial-configure-backup-aks/backup-instance-name.png" alt-text="Screenshot that shows how to select namespaces to include in the backup." lightbox="./media/tutorial-configure-backup-aks/backup-instance-name.png":::

    1. Expand **Additional Resource Settings** to see filters that you can use to choose cluster resources to back up. You can choose to back up resources based on the following categories:

        - **Labels**: You can filter AKS resources by using [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) that you assign to types of resources. Enter labels in the form of key/value pairs. Combine multiple labels by using `AND` logic.

          For example, if you enter the labels `env=prod;tier!=web`, the process selects resources that have a label with the `env` key and the `prod` value, and a label with the `tier` key for which the value isn't `web`. These resources are backed up.

        - **API groups**: You can also include resources by providing the AKS API group and kind. For example, you can choose for backup AKS resources like Deployments.

        - **Other options**: You can enable or disable backup for cluster-scoped resources, persistent volumes, and secrets.

        :::image type="content" source="./media/tutorial-configure-backup-aks/cluster-scope-resources.png" alt-text="Screenshot that shows the Additional Resource Settings pane." lightbox="./media/tutorial-configure-backup-aks/cluster-scope-resources.png":::

        > [!NOTE]
        > All these resource settings are combined and applied via `AND` logic.

    1. If you have a database like MySQL deployed in the AKS cluster, you can use *backup hooks* that are deployed as custom resources in your AKS cluster to achieve application-consistent backups.

       Backup hooks consist of pre-hook and post-hook commands that run before a snapshot of a disk with the database stored in it is taken. For input, you must provide the name of the YAML file and the namespace in which it's deployed.

        :::image type="content" source="./media/tutorial-configure-backup-aks/namespace.png" alt-text="Screenshot that shows the Backup hooks pane." lightbox="./media/tutorial-configure-backup-aks/namespace.png":::

    1. Choose **Select**.

1. For **Snapshot resource group**, select the resource group to use to store the persistent volume (Azure Disk Storage) snapshots. Then select **Validate**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot that shows the Snapshot resource group pane." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. When validation is finished, if required roles aren't assigned to the vault in the snapshot resource group, an error appears.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot that shows a validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png":::  

1. To resolve the error, under **Datasource name**, select the datasource, and then select **Assign missing roles**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot that shows how to resolve a validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::

1. When role assignment is finished, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot that shows resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::

1. Select **Configure backup**.

1. When the configuration is finished, select **Next**.

    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot that shows review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::

   The backup instance is created when you finish configuring the backup.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot that shows a backup configured for an AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::

## Next step

> [!div class="nextstepaction"]
> [Restore a backup for an AKS cluster](./azure-kubernetes-service-cluster-restore.md)
