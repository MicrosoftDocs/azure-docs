---
title: Restore Azure Kubernetes Service (AKS) using Azure Backup 
description: This article explains how to restore backed-up Azure Kubernetes Service (AKS) using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 03/27/2023
author: jyothisuri
ms.author: jsuri
---

# Restore Azure Kubernetes Service using Azure Backup (preview) 

This article describes how to restore backed-up Azure Kubernetes Service (AKS).

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Before you start

- AKS backup allows you to restore to original AKS cluster (that was backed up) and to an alternate AKS cluster. AKS backup allows you to perform a full restore and item-level restore. You can utilize [restore configurations](#restore-configurations) to define parameters based on the cluster resources that will be picked up during the restore.

- You must [install the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#install-backup-extension) in the target AKS cluster. Also, you must [enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#register-the-trusted-access) between the Backup vault and the AKS cluster.

For more information on the limitations and supported scenarios, see the [support matrix](azure-kubernetes-service-cluster-backup-support-matrix.md).

## Restore the AKS clusters

To restore the backed-up AKS cluster, follow these steps:

1. Go to **Backup center** and select **Restore**.

2. On the next page, click **Select Backup Instance**, select the *instance* that you want to restore, and then select **Continue**.

3. Click **Select restore point** to select the restore point you want to restore.

4. In the **Restore parameters** section, click **Select Kubernetes Service** and select the *AKS cluster* to which you want to restore the backup to.

   If the selected cluster doesn't have Backup Extension installed or Trusted Access enabled, the message *Mandatory Extension is either not installed or in unhealthy state** appears.

5. To select the *backed-up cluster resources* for restore, click **Select resources**.

   Learn more about [restore configurations](#restore-configurations).

6. Select **Validate** to run validation on the backed-up cluster selections.

   If the validation shows missing permission or roles, select **Grant Permission** to assign them.

7.	Once the validation is successful, select **Review + restore** and restore the backups to the selected cluster.

### Restore configurations

As part of item-level restore capability of AKS backup, you can utilize multiple restore configuration filters   to perform restore.

- Select the *Namespaces* that you want to restore from the list. The list shows only the backed-up Namespaces. 

  You can also select the checkboxes if you want to restore cluster scoped resources and persistent volumes (of Azure Disk only).

- To restore specific cluster resources, use the labels attached to them in the textbox. Only resources with the entered labels are backed up.

- You can provide *API Groups* and *Kinds* to restore specific resource types. The list of *API Group* and *Kind* is available in the *Appendix*. You can enter *multiple API Groups*.

- To restore a workload, such as Deployment from a backup via API Group, the entry should be: 

   - **Kind**: Select **Deployment**.
   - **Group**: Select **Group**.
   - **Namespace Mapping**: To migrate the backed-up cluster resources to a different *Namespace*, select the *backed-up Namespace*, and then enter the *Namespace* to which you want to migrate the resources.

     If the *Namespace* doesn't exist in the AKS cluster, it gets created. If a conflict occurs during the cluster resources restore, you can skip or patch the conflicting resources.

## Next steps

- [Manage Azure Kubernetes Service cluster backups (preview)](azure-kubernetes-service-cluster-manage-backups.md)
- [About Azure Kubernetes Service cluster backup (preview)](azure-kubernetes-service-cluster-backup-concept.md)

