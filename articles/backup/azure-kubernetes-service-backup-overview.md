---
title: What is Azure Kubernetes Service (AKS) backup?
description: Understand Azure Kubernetes Service (AKS) backup, the cloud-native process to back up and restore the containerized applications and data running in an AKS cluster.
ms.topic: conceptual
ms.service: backup
ms.custom:
  - ignite-2023
ms.date: 11/30/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# What is Azure Kubernetes Service backup?

[Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) backup is a simple, cloud-native process you can use to back up and restore containerized applications and data that run in your AKS cluster. You can configure scheduled backups for cluster state and application data that's stored on persistent volumes in CSI driver-based Azure Disk Storage. The solution gives you granular control to choose a specific namespace or an entire cluster to back up or restore by storing backups locally in a blob container and as disk snapshots. You can use AKS backup for end-to-end scenarios, including operational recovery, cloning developer/test environments, and cluster upgrade scenarios.

AKS backup integrates with Backup center in Azure, providing a single view that can help you govern, monitor, operate, and analyze backups at scale. Your backups are also available in the Azure portal under **Settings** in the resource menu for an AKS instance.

## How does AKS backup work?

Use AKS backup to back up your AKS workloads and persistent volumes that are deployed in AKS clusters. The solution requires the [Backup extension](/azure/azure-arc/kubernetes/conceptual-extensions) to be installed inside the AKS cluster. The Backup vault communicates to the extension to complete operations that are related to backup and restore. Using the Backup extension is mandatory, and the extension must be installed inside the AKS cluster to enable backup and restore for the cluster. When you configure AKS backup, you add values for a storage account and a blob container where backups are stored.

Along with the Backup extension, a user identity (called an *extension identity*) is created in the AKS cluster's managed resource group. The extension identity is assigned the Storage Account Contributor role on the storage account where backups are stored in a blob container.

To support public, private, and authorized IP-based clusters, AKS backup requires Trusted Access to be enabled between the AKS cluster and the Backup vault. Trusted Access allows the Backup vault to access the AKS cluster because of specific permissions that are assigned to it for backup operations. For more information on AKS Trusted Access, see [Enable Azure resources to access AKS clusters by using Trusted Access](../aks/trusted-access-feature.md).

> [!NOTE]
> AKS backup currently allows storing backups in the Operational Tier. The Operational Tier is a local datastore. Backups aren't moved to a vault, but are stored in your own tenant. However, you still use the Backup vault to manage backups.

After the Backup extension is installed and Trusted Access is enabled, you can configure scheduled backups for the clusters per your backup policy. You also can restore the backups to the original cluster or to an alternate cluster that's in the same subscription and region. You can choose a specific namespace or an entire cluster as a backup and restore configuration as you set up the specific operation.

The backup solution enables backup operations for your AKS workloads that are deployed in the cluster and for the data that's stored in the persistent volume for the cluster. The AKS workloads are stored in a blob container. The disk-based persistent volumes are backed up as disk snapshots in a snapshot resource group.

> [!NOTE]
> Currently, the solution supports only persistent volumes in CSI driver-based Azure Disk Storage. During backups, the solution skips other persistent volume types, like Azure File Share and blobs.

## Configure backup

To configure backup for an AKS cluster, first you need to create a Backup vault. The vault gives you a consolidated view of the backups that are configured across different workloads. AKS backup supports only Operational Tier backup.

> [!NOTE]
>
> - The Backup vault and the AKS cluster that you want to back up or restore must be in the same region and subscription.
> - Copying backups to the Vault Tier currently is not supported. The **Backup vault storage redundancy** setting (LRS/GRS) doesn't apply to backups that are stored in the Operational Tier.

AKS backup automatically triggers a scheduled backup job. The job copies the cluster resources to a blob container and creates an incremental snapshot of the disk-based persistent volumes per the backup frequency. Earlier backups are deleted per the retention duration that's specified in the backup policy.

> [!NOTE]
> You can use AKS backup to create multiple backup instances for a single AKS cluster by using different backup configurations per backup instance. However, each backup instance of an AKS cluster should be created either in a different Backup vault or by using a separate backup policy in the same Backup vault.

## Manage backup

When backup configuration for an AKS cluster is finished, a backup instance is created in the Backup vault. You can view the backup instance for the cluster in the **Backup** section for an AKS instance in the Azure portal. You can perform any backup-related operations for the instance, such as initiating restores, monitoring, stopping protection, and so on, through its corresponding backup instance.

AKS backup also integrates directly with Backup center to help you manage protection for all your AKS clusters and other backup-supported workloads centrally. Backup center is a single view for all your backup requirements, such as monitoring jobs and the state of backups and restores. Backup center helps you ensure compliance and governance, analyze backup usage, and perform critical operations to back up and restore data.

AKS backup uses managed identity to access other Azure resources. To configure backup of an AKS cluster and to restore from an earlier backup, the Backup vault's managed identity requires a set of permissions on the AKS cluster and the snapshot resource group where snapshots are created and managed. Currently, the AKS cluster requires a set of permissions on the snapshot resource group. Also, the Backup extension creates a user identity and assigns a set of permissions to access the storage account where backups are stored in a blob. You can grant permissions to the managed identity by using Azure role-based access control (Azure RBAC). A managed identity is a special type of service principle that can be used only with Azure resources. Learn more about [managed identities](../active-directory/managed-identities-azure-resources/overview.md).

## Restore from a backup

You can restore data from any point in time for which a recovery point exists. A recovery point is created when a backup instance is in a protected state and can be used to restore data until it's retained by the backup policy.

Azure Backup provides an instant restore experience because snapshots are stored locally in your subscription. Operational backup gives you the option to restore all items that are backed up or to use granular controls to select specific items from the backup by choosing namespaces and other filter options. Also, you can perform the restore on the original AKS cluster (the cluster that's backed up) or on an alternate AKS cluster that's in the same region and subscription.

## Use custom hooks for backup and restore

You can use custom hooks to take application-consistent snapshots of volumes that are used for databases deployed as containerized workloads.

### What are custom hooks?

You can use AKS backup to execute custom hooks as part of a backup and restore operation. Hooks are commands that are configured to run one or more commands to execute in a pod under a container during a backup operation or after restore. You define these hooks as a custom resource and deploy them in the AKS cluster that you want to back up or restore. When the custom resource is deployed in the AKS cluster in the required namespace, you provide the details as input for the flow to configure backup and restore. The Backup extension runs the hooks as defined in a YAML file.

> [!NOTE]
> Hooks aren't executed in a *shell* on the containers.

Backup in AKS has two types of hooks:

- Backup hooks
- Restore hooks

### Backup hooks

In a backup hook, you can configure the commands to run the hook before any custom action processing (pre-hooks), or after all custom actions are finished and any additional items specified by custom actions are backed up (post-hooks).

For example, here's the YAML template for a custom resource to be deployed by using backup hooks:

```json
apiVersion: clusterbackup.dataprotection.microsoft.com/v1alpha1
kind: BackupHook
metadata:
  # BackupHook CR Name and Namespace
  name: bkphookname0
  namespace: default
spec:
  # BackupHook is a list of hooks to execute before and after backing up a resource.
  backupHook:
    # BackupHook Name. This is the name of the hook that will be executed during backup.
    # compulsory
  - name: hook1
    # Namespaces where this hook will be executed.
    includedNamespaces: 
    - hrweb
    excludedNamespaces:
    labelSelector:
    # PreHooks is a list of BackupResourceHooks to execute prior to backing up an item.
    preHooks:
      - exec:
          # Container is the container in the pod where the command should be executed.
          container: webcontainer
          # Command is the command and arguments to execute.
          command:
            - /bin/uname
            - -a
          # OnError specifies how Velero should behave if it encounters an error executing this hook  
          onError: Continue
          # Timeout is the amount of time to wait for the hook to complete before considering it failed.
          timeout: 10s
      - exec:
          command:
            - /bin/bash
            - -c
            - echo hello > hello.txt && echo goodbye > goodbye.txt
          container: webcontainer
          onError: Continue
    # PostHooks is a list of BackupResourceHooks to execute after backing up an item.
    postHooks:
      - exec:
          container: webcontainer
          command:
            - /bin/uname
            - -a
          onError: Continue
          timeout: 10s
```

### Restore hooks

In the restore hook script, custom commands or scripts are written to be executed in the containers of a restored AKS pod.

Here's the YAML template for a custom resource to be deployed by using restore hooks:

```json
apiVersion: clusterbackup.dataprotection.microsoft.com/v1alpha1
kind: RestoreHook
metadata:
  name: restorehookname0
  namespace: default
spec:
  # RestoreHook is a list of hooks to execute after restoring a resource.
  restoreHook:
    # Name is the name of this hook.
  - name: myhook-1  
    # Restored Namespaces where this hook will be executed.
    includedNamespaces: 
    excludedNamespaces:
    labelSelector:
    # PostHooks is a list of RestoreResourceHooks to execute during and after restoring a resource.
    postHooks:
      - exec:
          # Container is the container in the pod where the command should be executed.
          container: webcontainer
          # Command is the command and arguments to execute from within a container after a pod has been restored.
          command:
            - /bin/bash
            - -c
            - echo hello > hello.txt && echo goodbye > goodbye.txt
          # OnError specifies how Velero should behave if it encounters an error executing this hook
          # default value is Continue
          onError: Continue
          # Timeout is the amount of time to wait for the hook to complete before considering it failed.
          execTimeout: 30s
          # WaitTimeout defines the maximum amount of time Velero should wait for the container to be ready before attempting to run the command.
          waitTimeout: 5m
```

Learn [how to use hooks during AKS backup](azure-kubernetes-service-cluster-backup.md#use-hooks-during-aks-backup).

## Understand pricing

You incur charges for:

- **Protected instance fee**: Azure Backup for AKS charges a *protected instance fee* per namespace per month. When you configure backup for an AKS cluster, a protected instance is created. Each instance has a specific number of namespaces that are backed up as defined in the backup configuration.

- **Snapshot fee**: Azure Backup for AKS protects a disk-based persistent volume by taking snapshots that are stored in the resource group in your Azure subscription. These snapshots incur snapshot storage charges. Because the snapshots aren't copied to the Backup vault, backup storage cost doesn't apply. For more information on the snapshot pricing, see [Managed Disk pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## Next step

> [!div class="nextstepaction"]
> [Prerequisites for Azure Kubernetes Service backup](azure-kubernetes-service-cluster-backup-concept.md)
