---
title: Manage Azure Kubernetes Service (AKS) backups using Azure Backup 
description: This article explains how to manage Azure Kubernetes Service (AKS) backups using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 03/03/2023
author: jyothisuri
ms.author: jsuri
---

# Manage Azure Kubernetes Service backups using Azure Backup (preview) 

This article describes how to manage Azure Kubernetes Service (AKS) backups using Azure CLI commands.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Manage operations

This section provires the set of Azure CLI commands to create, update, delete operations on the backup extension. You can use the *update* command to change the blob container where backups are stored along with compute limits for the underlying Backup Extension Pods.

### Install

To install the Backup Extension, use the following command:

   ```azurecli-interactive
   az k8s-extension create --name azure-aks-backup --extension-type Microsoft.DataProtection.Kubernetes --scope cluster --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg --release-train preview --configuration-settings blobContainer=containername storageAccount=storageaccountname storageAccountResourceGroup=storageaccountrg storageAccountSubscriptionId=subscriptionid
   ```

### Options

To update blob container , CPU, and memory in the Backup Extension, use the following command:

   ```azurecli-interactive
   az k8s-extension update --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg --release-train preview --configuration-settings [blobContainer=containername storageAccount=storageaccountname storageAccountResourceGroup=storageaccountrg storageAccountSubscriptionId=subscriptionid] [cpuLimit=1] [memoryLimit=1Gi]
   
   []: denotes the 3 different sub-groups of updates possible (discard the brackets while using the command)

   ```

### Delete

To stop the Backup Extension install operation, use the following command:

   ```azurecli-interactive
   az k8s-extension delete --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg
   ```

### Show

To view the progress of Backup Extension installation, use the following command:

   ```azurecli-interactive
   az k8s-extension show --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg
   ```

## Enable Trusted Access

To enable Trusted Access between Backup vault and AKS cluster, use the following Azure CLI command:

   ```azurecli-interactive
   az aks trustedaccess rolebinding create \
   -g $myResourceGroup \ 
   --cluster-name $myAKSCluster 
   –n <randomRoleBindingName> \ 
   -s <vaultID> \ 
   --roles Microsoft.DataProtection/backupVaults/backup-operator

   ```

>[!Note]
>AKS backup experience via Azure portal allows you to perform both Backup Extension installation and Trusted Access enablement, required to make the AKS cluster ready for backup and restore operations.

## Next steps

- [Back up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-restore.md)
- [Supported scenarios for backing up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup-support-matrix.md)