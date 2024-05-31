---
title: Back up Azure Kubernetes Service by using Azure Backup
description: Learn how to back up Azure Kubernetes Service (AKS) by using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.custom:
  - ignite-2023
ms.date: 01/03/2024
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Back up Azure Kubernetes Service by using Azure Backup

This article describes how to configure and back up Azure Kubernetes Service (AKS).

You can use Azure Backup to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) by using the Backup extension, which must be installed in the cluster. The Backup vault communicates with the cluster via the Backup extension to perform backup and restore operations.

>[!Note]
>Vaulted backup and Cross Region Restore for AKS using Azure Backup are currently in preview.

## Before you start

- Currently, AKS backup supports only Azure Disk Storage-based persistent volumes (enabled by CSI driver). The backups are stored in an operational datastore only (backup data is stored in your tenant and isn't moved to a vault). The Backup vault and AKS cluster must be in the same region.

- AKS backup uses a blob container and a resource group to store the backups. The blob container holds the AKS cluster resources. Persistent volume snapshots are stored in the resource group. The AKS cluster and the storage locations must be in the same region. Learn [how to create a blob container](../storage/blobs/storage-quickstart-blobs-portal.md#create-a-container).

- Currently, AKS backup supports once-a-day backup. It also supports more frequent backups (in 4-hour, 8-hour, and 12-hour intervals) per day. This solution allows you to retain your data for restore for up to 360 days. Learn how to [create a backup policy](#create-a-backup-policy).

- You must [install the Backup extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) to configure backup and restore operations for an AKS cluster. Learn more [about the Backup extension](azure-kubernetes-service-cluster-backup-concept.md#backup-extension).

- Ensure that `Microsoft.KubernetesConfiguration`, `Microsoft.DataProtection`, and the `TrustedAccessPreview` feature flag on `Microsoft.ContainerService` are registered for your subscription before you initiate backup configuration and restore operations.

- Ensure that you perform [all the prerequisites](azure-kubernetes-service-cluster-backup-concept.md) before you initiate a backup or restore operation for AKS backup.

For more information on supported scenarios, limitations, and availability, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Create a Backup vault

A Backup vault is a management entity that stores recovery points treated over time. A Backup vault also provides an interface to do the backup operations. Operations include taking on-demand backups, doing restores, and creating backup policies. AKS backup requires the Backup vault and the AKS cluster to be in the same region. Learn [how to create a Backup vault](create-manage-backup-vault.md#create-a-backup-vault).

>[!Note]
>A Backup vault is a new resource that's used to back up newly supported datasources. A Backup vault is different from a Recovery Services vault.

If you want to use Azure Backup to protect your AKS clusters from any regional outage: 

1. Set the **Backup Storage Redundancy** parameter as **Globally-Redundant** during vault creation. Once the redundancy for a vault is set, you can't disable.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-backup-storage-redundancy-parameter.png" alt-text="Screenshot shows how to enable the Backup Storage Redundance parameter.":::

2. Set the **Cross Region Restore** parameter under **Vault Properties** as **Enabled**. Once this parameter is enabled, you can't disable it.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enable-cross-region-restore-parameter.png" alt-text="Screenshot shows how to enable the Cross Region Restore parameter.":::

3. Create a Backup Instance using a Backup Policy with retention duration set for Vault-standard datastore. Every recovery point stored in this datastore will be in the secondary region.

   >[!Note]
   >Vault-standard datastore is currently in preview.

## Create a backup policy

Before you configure backups, you need to create a backup policy that defines the frequency of backups and the retention duration of backups.

You can also create a backup policy when you configure the backup.

To create a backup policy:

1. Go to **Backup center** and select  **Policy** to create a new backup policy.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/create-backup-policy.png" alt-text="Screenshot that shows how to start creating a backup policy.":::

   Alternatively, go to **Backup center** > **Backup policies** > **Add**.

1. For **Datasource type**, select **Kubernetes Service** and continue.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-datasource-type.png" alt-text="Screenshot that shows selecting the datasource type.":::

1. Enter a name for the backup policy (for example, *Default Policy*) and select the Backup vault (the new Backup vault you created) where the backup policy needs to be created.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/enter-backup-policy-name.png" alt-text="Screenshot that shows providing the backup policy name.":::

1. On the **Schedule + retention** tab, define the *frequency of backups* and *how long they need to be retained* in Operational and Vault Tier (also called *datastore*).

   **Backup Frequency**: Select the *backup frequency* (hourly or daily), and then choose the *retention duration* for the backups.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-frequency.png" alt-text="Screenshot that shows selection of backup frequency.":::

   **Retention Setting**: A new backup policy has two retention rules.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-period.png" alt-text="Screenshot that shows selection of retention period.":::

   You can also create additional retention rules to store backups for a longer duration that are taken daily or weekly.


   - **Default**: This  rule defines the default retention duration for all the operational tier backups taken. You can only edit this rule and  can’t delete it.

   - **First successful backup taken every day**: In addition to the default rule, every first successful backup of the day can be retained in the Operational datastore and Vault-standard store. You can edit and delete this rule (if you want to retain backups in Operational datastore).

     :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/retention-configuration-for-vault-operational-tiers.png" alt-text="Screenshot that shows the retention configuration for Vault Tier and Operational Tier.":::


   You can also define similar rules for the *First successful backup taken every week, month, and year*.

   >[!Note]
   >- In addition to first successful backup of the day, you can define the retention rules for first successful backup of the week, month, and year. In terms of priority, the order is year, month, week, and day.
   >- The Vault-standard datastore is currently in preview. If you don't want to use the feature, edit the retention rule and clear the checkbox next to the **Vault-standard datastore**.
   >- The backups stored in the Vault Tier can also copied in the secondary region (Azure Paired region) that you can use to restore AKS clusters to a secondary region when the primary region is unavailable. To opt for this feature, use a *Geo-redundant vault* with *Cross Region Restore* enabled.



1. When the backup frequency and retention settings are configured, select **Next**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/review-create-policy.png" alt-text="Screenshot that shows the completion of a backup policy creation.":::

1. On the **Review + create** tab, review the information, and then select **Create**.

## Configure backups

You can use AKS backup to back up an entire cluster or specific cluster resources that are deployed in the cluster. You can also protect a cluster multiple times per the deployed application's schedule and retention requirements or security requirements.

> [!NOTE]
> To set up multiple backup instances for the same AKS cluster:
>
> - Configure backup in the same Backup vault but using a different backup policy.
> - Configure backup in a different Backup vault.

To configure backups for AKS cluster:

1. In the Azure portal, go to the AKS cluster that you want to back up.

1. In the resource menu, select **Backup**, and then select **Configure Backup**.

1. To prepare the AKS cluster for backup or restore, select **Install Extension** to install the Backup extension in the cluster.

1. Provide a storage account and blob container as input.

   Your AKS cluster backups are stored in this blob container. The storage account must be in the same region and subscription as the cluster.

    Select **Next**.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/add-storage-details-for-backup.png" alt-text="Screenshot that shows how to add storage and blob details for backup.":::

1. Review the extension installation details, and then select **Create**.

    The extension installation begins.

    :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/install-extension.png" alt-text="Screenshot that shows how to review and install the Backup extension.":::

1. When the Backup extension is installed successfully, select **Configure Backup** to begin configuring backups for your AKS cluster.

   You can also perform this action in Backup center.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/configure-backup.png" alt-text="Screenshot that shows the selection of Configure Backup.":::

1. Select the Backup vault.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-vault.png" alt-text="Screenshot that shows how to choose a vault.":::

   The Backup vault should have Trusted Access enabled for the AKS cluster to be backed up. To enable Trusted Access, select **Grant Permission**. If it's already enabled, select **Next**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/grant-permission.png" alt-text="Screenshot that shows how to proceed to the next step after granting permission.":::

   > [!NOTE]
   > - Before you enable Trusted Access, enable the `TrustedAccessPreview` feature flag for the `Microsoft.ContainerServices` resource provider on the subscription.
   > - If the AKS cluster doesn't have the Backup extension installed, you can perform the installation step that configures backup.

1. Select the backup policy, which defines the schedule for backups and their retention period. Then select **Next**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-backup-policy.png" alt-text="Screenshot that shows how to choose a backup policy.":::

1. On the **Datasources** tab, select **Add/Edit** to define the backup instance configuration.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-backup-instance-configuration.png" alt-text="Screenshot that shows how to define the Backup Instance Configuration.":::

1. In the **Select Resources to Backup** pane, define the cluster resources that you want to back up.

   Learn more about [backup configurations](azure-kubernetes-service-backup-overview.md).

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/define-cluster-resources-for-backup.png" alt-text="Screenshot that shows how to define the cluster resources for backup.":::

1. For **Snapshot resource group**, select the resource group to use to store the persistent volume (Azure Disk Storage) snapshots. Then select **Validate**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validate-snapshot-resource-group-selection.png" alt-text="Screenshot that shows how to validate the snapshot resource group.":::

1. When validation is finished, if required roles aren't assigned to the vault in the snapshot resource group, an error appears:

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/validation-error-on-permissions-not-assigned.png" alt-text="Screenshot that shows a validation error when required permissions aren't assigned.":::

1. To resolve the error, under **Datasource name**, select the datasource, and then select **Assign missing roles**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/start-role-assignment.png" alt-text="Screenshot that shows how to start assigning roles.":::

   The following screenshot shows the list of roles that you can select:

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/select-missing-roles.png" alt-text="Screenshot that shows how to select missing roles.":::

1. When role assignment is finished, select **Next**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/proceed-for-backup.png" alt-text="Screenshot that shows how to proceed to the backup configuration.":::

1. Select **Configure backup**.

1. When the configuration is finished, select **Next**.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/finish-backup-configuration.png" alt-text="Screenshot that shows how to finish backup configuration.":::

   The backup instance is created when backup configuration is finished.

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/list-of-backup-instances.png" alt-text="Screenshot that shows the list of created backup instances.":::

   :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/backup-instance-details.png" alt-text="Screenshot that shows the backup instance details.":::

### Backup configurations

As part of the AKS backup capability, you can back up all cluster resources or specific cluster resources. You can use the filters that are available for backup configuration to choose the resources to back up. The defined backup configurations are referenced by the values for **Backup Instance Name**. You can use the following options to choose the **Namespaces** values to back up:

- **All (including future Namespaces)**: This backs up all current and future values for **Namespaces** when the underlying cluster resources are backed up.
- **Choose from list**: Select the specific values for **Namespaces** in the AKS cluster to back up.

  To select specific cluster resources to back up, you can use labels that are attached to the resources to include the resources in the backup. Only the resources that have the labels that you enter are backed up. You can use multiple labels.

  > [!NOTE]
  > You should add the labels to every single YAML file that is deployed and to be backed up. This includes namespace-scoped resources like persistent volume claims, and cluster-scoped resources like persistent volumes.

  If you also want to back up cluster-scoped resources, secrets, and persistent volumes, select the items under **Other Options**.

:::image type="content" source="./media/azure-kubernetes-service-cluster-backup/various-backup-configurations.png" alt-text="Screenshot that shows various backup configurations.":::

## Use hooks during AKS backup

This section describes how to use a backup hook to create an application-consistent snapshot of the AKS cluster with MySQL deployed (a persistent volume that contains the MySQL instance).

You can use custom hooks in AKS backup to accomplish application-consistent snapshots of volumes. The volumes are used for databases that are deployed as containerized workloads.

By using a backup hook, you can define the commands to freeze and unfreeze a MySQL pod so that an application snapshot of the volume can be taken. The Backup extension then orchestrates the steps of running the commands in the hooks and takes the volume snapshot.

An application-consistent snapshot of a volume with MySQL deployed is taken by doing the following actions:

1. The pod running MySQL is frozen so that no new transaction is performed on the database.
1. A snapshot is taken of the volume as backup.
1. The pod running MySQL is unfrozen so that transactions can be done again on the database.

To enable a backup hook as part of the backup configuration flow to back up MySQL:

1. Write the custom resource for backup hook with commands to freeze and unfreeze a PostgreSQL pod.

   You can also use the following sample YAML script  *postgresbackuphook.yaml*, which has predefined commands:

      ```json
      apiVersion: clusterbackup.dataprotection.microsoft.com/v1alpha1
      kind: BackupHook
      metadata:
      # BackupHook CR Name and Namespace
      name: bkphookname0
      namespace: default
      spec:
      # BackupHook Name. This is the name of the hook that will be executed during backup.
      # compulsory
      name: hook1
      # Namespaces where this hook will be executed.
      includedNamespaces: 
      - hrweb
      excludedNamespaces:
      labelSelector:
      # PreHooks is a list of BackupResourceHooks to execute prior to backing up an item.
      preHooks:
         - exec:
            command:
            - /sbin/fsfreeze
            - --freeze
            - /var/lib/postgresql/data
            container: webcontainer
            onError: Continue
      # PostHooks is a list of BackupResourceHooks to execute after backing up an item.
      postHooks:
         - exec:
            container: webcontainer
            command:
               - /sbin/fsfreeze
               - --unfreeze
            onError: Fail
            timeout: 10s


      ```  

1. Before you configure a backup, you must deploy the backup hook custom resource in the AKS cluster. 

   To deploy the script, run the following command:

      ```dotnetcli
      kubectl apply -f mysqlbackuphook.yaml

      ```

1. When the deployment is finished, you can [configure backup for the AKS cluster](#configure-backups).

   > [!NOTE]
   >
   > As part of a backup configuration, you must provide the custom resource name and the namespace that the resource is deployed in as input.
   >
   > :::image type="content" source="./media/azure-kubernetes-service-cluster-backup/custom-resource-name-and-namespace.png" alt-text="Screenshot that shows how to add the namespace for the backup configuration." lightbox="./media/azure-kubernetes-service-cluster-backup/custom-resource-name-and-namespace.png":::
   >

## Next steps

- [Restore an Azure Kubernetes Service cluster](azure-kubernetes-service-cluster-restore.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-concept.md)
