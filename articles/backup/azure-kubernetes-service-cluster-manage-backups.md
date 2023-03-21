---
title: Manage Azure Kubernetes Service (AKS) backups using Azure Backup 
description: This article explains how to manage Azure Kubernetes Service (AKS) backups using Azure Backup.
ms.topic: how-to
ms.service: backup
ms.date: 03/20/2023
author: jyothisuri
ms.author: jsuri
---

# Manage Azure Kubernetes Service backups using Azure Backup (preview) 

This article describes how to manage Azure Kubernetes Service (AKS) backups using Azure CLI commands.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Manage operations

This section provides the set of Azure CLI commands to create, update, delete operations on the backup extension. You can use the *update* command to change the blob container where backups are stored along with compute limits for the underlying Backup Extension Pods.

## Register the resource provider

To register the resource provider, run the following command:

   ```azurecli-interactive
   az provider register --namespace Microsoft.KubernetesConfiguration
   ```

>[!Note]
>Don't initiate extension installation before registering resource provider.

### Monitor the registration process

The registration may take up to *10 minutes*. To monitor the registration process, run the following command:

   ```azurecli-interactive
   az provider show -n Microsoft.KubernetesConfiguration -o table
   ```

### Install Backup Extension

To install the Backup Extension, use the following command:

   ```azurecli-interactive
   az k8s-extension create --name azure-aks-backup --extension-type Microsoft.DataProtection.Kubernetes --scope cluster --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg --release-train stable --configuration-settings blobContainer=containername storageAccount=storageaccountname storageAccountResourceGroup=storageaccountrg storageAccountSubscriptionId=subscriptionid
   ```

### Update resources in Backup Extension

To update blob container, CPU, and memory in the Backup Extension, use the following command:

   ```azurecli-interactive
   az k8s-extension update --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg --release-train stable --configuration-settings [blobContainer=containername storageAccount=storageaccountname storageAccountResourceGroup=storageaccountrg storageAccountSubscriptionId=subscriptionid] [cpuLimit=1] [memoryLimit=1Gi]
   
   []: denotes the 3 different sub-groups of updates possible (discard the brackets while using the command)

   ```

### Delete Backup Extension installation operation

To stop the Backup Extension install operation, use the following command:

   ```azurecli-interactive
   az k8s-extension delete --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg
   ```

### Grant permission on storage account

To provide *Storage Account Contributor Permission* to the Extension Identity on storage account, run the following command:

   ```azurecli-interactive
   az role assignment create --assignee-object-id $(az k8s-extension show --name azure-aks-backup --cluster-name aksclustername --resource-group aksclusterresourcegroup --cluster-type managedClusters --query aksAssignedIdentity.principalId --output tsv) --role 'Storage Account Contributor' --scope /subscriptions/subscriptionid/resourceGroups/storageaccountresourcegroup/providers/Microsoft.Storage/storageAccounts/storageaccountname 
   ```

### View Backup Extension installation status

To view the progress of Backup Extension installation, use the following command:

   ```azurecli-interactive
   az k8s-extension show --name azure-aks-backup --cluster-type managedClusters --cluster-name aksclustername --resource-group aksclusterrg
   ```

## Enable the feature flag

To enable the feature flag follow these steps:

1. To install the *aks-preview* extension, run the following command:

   ```azurecli-interactive
   az extension add --name aks-preview
   ```

1. To update to the latest version of the extension released, run the following command:

   ```azurecli-interactive
   az extension update --name aks-preview
   ```

1. To register the *TrustedAccessPreview* feature flag, run the `az feature register` command.

   **Example**

   ```azurecli-interactive
   az feature register --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
   ```
   
   It takes a few minutes for the status to show Registered.

1. To verify the registration status, run the `az feature show` command.

   **Example**

   ```azurecli-interactive
   az feature show --namespace "Microsoft.ContainerService" --name "TrustedAccessPreview"
   ```

1. When the status shows as **Registered**, run the `az provider register` command to refresh the `Microsoft.ContainerService` resource provider registration.

   **Example**

   ```azurecli-interactive
   az provider register --namespace Microsoft.ContainerService
   ```

>[!Note]
>Don't initiate backup configuration before enabling the feature flag.

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

Learn more about [other commands related to Trusted Access](../aks/trusted-access-feature.md#trusted-access-feature-overview).

## Next steps

- [Back up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-restore.md)
- [Supported scenarios for backing up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup-support-matrix.md)