---
title: Tutorial - Configure item level backup of an AKS cluster
description: Learn how to configure backup of an AKS cluster and utilize Azure Backup to back up specific items from the cluster.
ms.topic: tutorial
ms.date: 11/14/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Tutorial: Configure item level backup of an AKS cluster and utilize Azure Backup to back up specific items from the cluster

This tutorial describes how to configure backup of an AKS Cluster and utilize the Backup configuration to back up specific items from the cluster. 

You also learn how to use Backup Hooks within Backup configuration to achieve application-consistent backups for databases deployed in AKS clusters.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations.


## Prerequisites

- Identify or [create a Backup vault](create-manage-backup-vault.md) in the same region where you want to back up the AKS cluster.
- Install [Backup Extension](quick-install-backup-extension.md) in the AKS cluster to be backed up. 


## Configure backup of an AKS cluster

To configure backup of an AKS cluster, follow these steps:
 
1. In the Azure portal, navigate to the selected Kubernetes services and select **Backup** > **Configure backup**.

1. Select the Backup vault to configure backup.
    
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot showing **Configure backup** homepage." lightbox="./media/azure-kubernetes-service-cluster-backup/select-vault.png":::

    The Backup vault should have *Trusted Access* enabled for the AKS cluster to be backed up. You can enable *Trusted Access* by selecting **Grant permission**. If it's already enabled, select **Next**.
    
    :::image type="content" source="./media/tutorial-configure-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review page for Configure Backup." lightbox="./media/tutorial-configure-backup-aks/backup-vault-review.png":::

    >[!NOTE]
    >Before you enable *Trusted Access*, enable the `TrustedAccessPreview` feature flag for the Microsoft.ContainerServices resource provider on the subscription.

1. Select the backup policy, which defines the schedule for backups and their retention period. Then select **Next**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot showing Backup policy page." lightbox="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png":::

1. Select **Add/Edit** to define the Backup Instance configuration.
    
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot showing the Add/Edit option for configure backup." lightbox="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png":::

1. In the context pane, define the cluster resources you want to back up.
    
1. You can use the Backup configuration for item level backups and run custom hooks. For example, you can use it to achieve application consistent backup of databases. Follow these steps:
 
    1. Provide a **Backup Instance name** in input and assign it to the Backup instance configured for the application in the AKS Cluster.
        :::image type="content" source="./media/tutorial-configure-backup-aks/resources-to-backup.png" alt-text="Screenshot shows how to select resources to the Backup pane." lightbox="./media/tutorial-configure-backup-aks/resources-to-backup.png":::

    1. For **Select Namespaces to backup**, you can either select **All** to back up all the namespaces in the cluster along with any new namespace created in future, or you can select **Choose from list** to select specific namespaces for backup.
        :::image type="content" source="./media/tutorial-configure-backup-aks/backup-instance-name.png" alt-text="Screenshot shows how to select resources to the 'Backup input' pane." lightbox="./media/tutorial-configure-backup-aks/backup-instance-name.png":::

    1. Expand **Additional Resource Settings** to see specific filters to pick and choose resource within the cluster for backup. You can choose to back up resources based on following categories:
        1. **Labels**: You can filter Kubernetes resources by [labels](https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/) assigned to them. The labels are entered in the form of *key-value* pair where multiple labels can be combined with an `AND` logic. 
             For example, if you enter the labels `env=prod;tier!=web`, the process selects resources that have a label with the key *"env"* having the value *"prod"* and a label with the key *"tier"* for which the value that isn't *"web"*. These resources will be backed up.
        
        1. **API Groups**: You can also pick up resources by providing the Kubernetes API group and Kind. So, you can choose for backup Kubernetes resources such as *Deployments*.
        
        1. **Other options**: You can select the checkbox and enable or disable backup for Cluster scoped resources, Persistent Volumes and Secrets.
    
        :::image type="content" source="./media/tutorial-configure-backup-aks/cluster-scope-resources.png" alt-text="Screenshot showing **Additional Resource Settings** blade." lightbox="./media/tutorial-configure-backup-aks/cluster-scope-resources.png":::
    
        >[!NOTE]
        > All these resource settings are combined and are applied with an `AND` logic.

    1. If you have a database deployed in the AKS cluster like MySQL, you can use **Backup Hooks** deployed as custom resources in your AKS cluster to achieve application consistent backups. 
        These Hooks consist of Pre and Post commands that are run before taking snapshot of a disk with the database stored in it. For input, you need to provide the name of the YAML file and the Namespace in which it's deployed.
        :::image type="content" source="./media/tutorial-configure-backup-aks/namespace.png" alt-text="Screenshot showing **Backup Hooks** blade." lightbox="./media/tutorial-configure-backup-aks/namespace.png":::
    1. Select **Select**.

1. Select **Snapshot resource group** where the Persistent volumes (Azure Disk) snapshots will be stored. Then select **Validate**.  
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot showing **Snapshot resource group** blade." lightbox="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png":::

1. After validation is complete, if appropriate roles aren't assigned to the vault on **Snapshot resource group**, an error appears.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot showing validation error message." lightbox="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png":::  

1. To resolve the error, select the checkbox next to the **Datasource name** > **Assign missing roles**.
    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot showing how to resolve validation error." lightbox="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png":::
1. Once the role assignment is complete, select **Next** and proceed for backup.
    :::image type="content" source="./media/quick-backup-aks/backup-role-assignment.png" alt-text="Screenshot showing resolved Configure Backup page." lightbox="./media/quick-backup-aks/backup-role-assignment.png":::
1. Select **Configure backup**.

1. Once the configuration is complete, select **Next**.
    :::image type="content" source="./media/quick-backup-aks/backup-vault-review.png" alt-text="Screenshot showing review Configure Backup page." lightbox="./media/quick-backup-aks/backup-vault-review.png":::
   The Backup Instance is created after the configuration is complete.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot showing configured backup for AKS cluster." lightbox="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png":::

## Next steps

Learn how to [restore backups to an AKS cluster](./azure-kubernetes-service-cluster-restore.md).

 
