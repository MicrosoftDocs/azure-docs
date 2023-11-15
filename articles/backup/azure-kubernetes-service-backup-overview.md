---
title: Azure Kubernetes Service backup - Overview
description: This article gives you an understanding about Azure Kubernetes Service (AKS) backup, the cloud-native process to back up and restore the containerized applications and data running in AKS clusters.
ms.topic: conceptual
ms.service: backup
ms.custom:
  - ignite-2023
ms.date: 11/14/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# About Azure Kubernetes Service backup using Azure Backup

[Azure Kubernetes Service (AKS)](../aks/intro-kubernetes.md) backup is a simple, cloud-native process to back up and restore the containerized applications and data running in AKS clusters. You can configure scheduled backup for cluster state and application data (persistent volumes - CSI driver-based Azure Disks). The solution provides granular control to choose a specific namespace or an entire cluster to back up or restore by storing backups locally in a blob container and as disk snapshots. With AKS backup, you can unlock end-to-end scenarios - operational recovery, cloning developer/test environments, or cluster upgrade scenarios. 

AKS backup integrates with Backup center, providing a single pane of glass that can help you govern, monitor, operate, and analyze backups at scale. Your backups are also available in the *AKS portal* under the **Settings** section.

## How does AKS backup work?

AKS Backup enables you to back up your Kubernetes workloads and Persistent Volumes deployed in AKS clusters. The solution requires a [**Backup Extension**](/azure/azure-arc/kubernetes/conceptual-extensions) to be installed inside the AKS cluster and Backup Vault communicates to the Extension to perform backup and restore related operations. **Backup Extension** is mandatory to be installed inside AKS cluster to enable backup and restore. As part of installation, a storage account and a blob container is to be provided in input where backups will be stored. 

Along with Backup Extension, a *User Identity* is created in the AKS cluster's Managed Resource Group (called Extension Identity). This extension identity gets the *Storage Account Contributor* role assigned to it on the storage account where backups are stored in a blob container.

To support Public, Private, and Authorized IP based clusters, AKS backup requires *Trusted Access* to be enabled between *Backup vault* and *AKS cluster*. Trusted Access allows Backup vault to access the AKS clusters as specific permissions assigned to it related to the *Backup operations*. For more information on AKS Trusted Access, see [Enable Azure resources to access Azure Kubernetes Service (AKS) clusters using Trusted Access](../aks/trusted-access-feature.md).

>[!Note]
>AKS backup currently allows storing backups in *Operational Tier*. Operational Tier is a local data store and backups aren't moved to a vault, but are stored in your own tenant. However, the Backup vault still serves as the unit of managing backups.

Once *Backup Extension* is installed and *Trusted Access* is enabled, you can configure scheduled backups for the clusters as per your backup policy, and can restore the backups to the original or an alternate cluster in the same subscription and region. AKS backup allows you to enable granular controls to choose a specific *namespace* or an *entire cluster* as a backup/restore configuration while performing the specific operation.

The *backup solution* enables backup operation for your Kubernetes workloads deployed in the cluster and the data stored in the *Persistent Volume*. The Kubernetes workloads are stored in a blob container and the *Disk-based Persistent Volumes* are backed up as *Disk Snapshots* in a Snapshot Resource Group 

>[!Note]
>Currently, the solution only supports Persistent Volumes of CSI Driver-based Azure Disks. During backups, other Persistent Volume types (File Share, Blobs) are skipped by the solution.

## Backup
 
To configure backup for AKS cluster, first you need to create a *Backup vault*. The vault gives you a consolidated view of the backups configured across different workloads. AKS backup supports only Operational Tier backup.

>[!Note]
>- The Backup vault and the AKS cluster to be backed up or restored should be in the same region and subscription.
>- Copying backups to the *Vault Tier* is currently not supported. So, the *Backup vault storage redundancy* setting (LRS/GRS) doesn't apply to the backups stored in Operational Tier.

AKS backup automatically triggers scheduled backup job that copies the cluster resources to a blob container and creates an incremental snapshot of the disk-based persistent volumes as per the backup frequency. Older backups are deleted as per the retention duration specified by the backup policy.

>[!Note]
>AKS backup allows creating multiple backup instances for a single AKS cluster with different backup configurations, as required. However, each backup instance of an AKS cluster should be created either in a different Backup vault or with a different backup policy in the same Backup vault.

## Backup management 

Once the backup configuration for an AKS cluster is complete, a backup instance is created in the Backup vault. You can view the backup instance for the cluster under the Backup section in the AKS portal. You can perform any Backup-related operations for the Instance, such as initiating restores, monitoring, stopping protection, and so on, through its corresponding backup instance.

AKS backup also integrates directly with Backup center to help you manage the protection of all your AKS clusters centrally along with all other backup supported workloads. The Backup center is a single pane of glass for all your backup requirements, such as monitoring jobs and state of backups and restores, ensuring compliance and governance, analyzing backup usage, and performing operations pertaining to back up and restore of data.

AKS backup uses Managed Identity to access other Azure resources. To configure backup of an AKS cluster and to restore from past backup, Backup vault's Managed Identity requires a set of permissions on the AKS cluster and the snapshot resource group where snapshots are created and managed. Currently, the AKS cluster requires a set of permissions on the Snapshot Resource Group. Also, the Backup Extension creates a User Identity and assigns a set of permissions to access the storage account where backups are stored in a blob. You can grant permissions to the Managed Identity using Azure role-based access control (Azure RBAC). Managed Identity is a service principle of a special type that can only be used with Azure resources. Learn more about [Managed Identities](../active-directory/managed-identities-azure-resources/overview.md).

## Restore

You can restore data from any point-in-time for which a recovery point exists. A recovery point is created when a backup instance is in protected state, and can be used to restore data until it's retained by the backup policy.

Azure Backup provides an instant restore experience because the snapshots are stored locally in your subscription. Operational backup gives you the option to restore all the backed-up items or use the granular controls to select specific items from the backup by choosing namespaces and other available filters. Also, you've the ability to perform the restore on the original AKS cluster (that's backed up) or alternate AKS cluster in the same region and subscription.

## Custom Hooks for backup and restore

You  can now use the Custom Hooks capability available in Azure Backup for AKS. This helps to do Application Consistent Snapshots of Volumes that are used for databases deployed as containerized workloads.

### What are Custom Hooks? 

Azure Backup for AKS enables you to execute Custom Hooks as part of the backup and restore operation. Hooks are commands configured to run one or more commands to execute in a pod under a container during the backup operation or after restore. They allow you to define these hooks as a custom resource and deploy in the AKS cluster to be backed up or restored. Once the custom resource is deployed in the AKS cluster in the required Namespace, you need to provide the details as input for the Configure Backup/Restore flow, and the Backup extension runs the hooks as defined in the YAML file.

>[!Note]
>Hooks aren't executed in a *shell* on the containers.

There are two types of hooks:

### Backup Hooks

In a Backup Hook, you can configure the commands to run it before any custom action processing (pre-hooks), or after all custom actions are complete and any additional items specified by custom actions are backed up (post-hooks).

The YAML template for the Custom Resource to be deployed with Backup Hooks is defined below:

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

### Restore Hooks

In the Restore Hook script, custom commands or scripts are written to be executed in containers of a restored Kubernetes pod.

The YAML template for the Custom Resource to be deployed with Restore Hooks is defined below:

```json
apiVersion: clusterbackup.dataprotection.microsoft.com/v1alpha1
kind: RestoreHook
metadata:
  name: restorehookname0
  namespace: default
spec:
  # Name is the name of this hook.
  name: myhook-1  
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

Learn [how to use Hooks during AKS backup](azure-kubernetes-service-cluster-backup.md#use-hooks-during-aks-backup).

## Pricing

You'll incur the  charges for:

- **Protected Instance fee**: On configuring backup for an AKS cluster, a Protected Instance gets created. Each Instance has specific number of *Namespaces* that get backed up defined under **Backup Configuration**. Thus, Azure Backup for AKS charges *Protected Instance fee* on per *Namespace* basis per month.

- **Snapshot fee**: Azure Backup for AKS protects Disk-based Persistent Volume by taking snapshots that are stored in the resource group in your Azure subscription. These snapshots incur Snapshot Storage charges. Because the snapshots aren't copied to the Backup vault, Backup Storage cost doesn't apply. For more information on the snapshot pricing, see [Managed Disk Pricing](https://azure.microsoft.com/pricing/details/managed-disks/).

## Next steps

- [Prerequisites for Azure Kubernetes Service backup](azure-kubernetes-service-cluster-backup-concept.md)
