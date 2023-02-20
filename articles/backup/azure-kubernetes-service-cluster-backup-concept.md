---
title: Azure Kubernetes Service (AKS) cluster backup using Azure Backup overview 
description: This article explains about the concept of Azure Kubernetes Service (AKS) cluster backup using Azure Backup.
ms.topic: conceptual
ms.service: backup
ms.date: 02/28/2023
author: jyothisuri
ms.author: jsuri
---

# Overview of Azure Kubernetes Service (AKS) cluster backup using Azure Backup (preview) 

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. 

## Least Privileged security models

This section explains the least privileged security models required for a Backup vault (to have Trusted Access enabled) to communicate with the AKS cluster.

### Backup Extension

The extension enables backup and restore capabilities for the containerized workloads and persistent volumes used by the workloads running in AKS clusters. 

Backup Extension is installed in its own namespace *dataprotection-microsoft* by default. It's installed with cluster wide scope that allows the extension to access all the cluster resources. During the extension installation, it also creates a User-assigned Managed Identity (Extension Identity) in the Node Pool resource group. 

Backup Extension uses a blob container (provided in input during installation) as a default location for backup storage. To access this blob container, the Extension Identity requires *Storage Account Contributor* role on the storage account that has the container.

Backup Extension also needs to be installed on the both source cluster to be backed up and the target cluster where the restore will happen.

### Trusted Access

Many Azure services depend on *clusterAdmin kubeconfig* and the *publicly accessible kube-apiserver endpoint* to access AKS clusters. The **AKS Trusted Access** feature enables you to bypass the private endpoint restriction. Without using Microsoft Azure Active Directory (Azure AD) application, this feature enables you to give explicit consent to your system-assigned identity of allowed resources to access your AKS clusters using an Azure resource RoleBinding. 

Your Azure resources access AKS clusters through the AKS regional gateway via system-assigned Managed Identity authentication with the appropriate Kubernetes permissions via an Azure resource role. The Trusted Access feature allows you to access AKS clusters with different configurations, which isn’t limited to private clusters, clusters with local accounts disabled, Azure AD clusters, and authorized IP range clusters. 

For AKS backup, the Backup vault accesses your AKS clusters via Trusted Access to configure backups and restores. The Backup vault is assigned a pre-defined role **Microsoft.DataProtection/backupVaults/backup-operator** in the AKS cluster, allowing it to only perform specific backup operations. 

>[!Note]
>AKS backup experience via Azure portal allows you to perform both the steps (Backup Extension Installation and Trusted Access enablement) required to get the AKS cluster ready for backup and restore operations.

### AKS Cluster

To enable backup for an AKS cluster, see the following prerequisites: .

- AKS backup uses CSI drivers snapshot capabilities to perform backups of Persistent Volumes. CSI Driver support is available for AKS clusters with Kubernetes version *1.21.1* or later. 
- Currently, AKS backup only supports backup of Azure Disk based Persistent Volumes (enabled by CSI Driver). If you’re using Azure File Share and Azure Blob type Persistent Volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions available for [Azure File Share](azure-file-share-backup-overview.md) and [Azure Blob](blob-backup-overview.md).

- In Tree, volumes aren't supported by AKS backup; only CSI Driver based volumes can be backed up. You can [migrate from tree volumes to CSI driver based Persistent Volumes](../aks/csi-migrate-in-tree-volumes.md).

- Before installing Backup Extension in the AKS cluster, ensure that the CSI drivers and snapshots are enabled for your cluster. If disabled, see [these steps to enable them](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).

- Backup Extension uses the AKS cluster’s Managed System Identity to perform backup operations. So, AKS clusters using Service Principal aren't supported by ASK Backup. You can [update your AKS cluster to use Managed System Identity](../aks/use-managed-identity.nd#update-an-aks-cluster-to-use-a-managed-identityn).

   >[!Note]
   >Only Managed System Identity based AKS clusters are supported by AKS backup. The support for User Identity based AKS clusters is currently not available. 

- Backup Extension during installation fetches Container Images stored in Microsoft Container Registry (MCR). If a firewall is enabled on the AKS cluster, the extension installation process might fail due to access issues on the Registry. You can follow these steps to allow MCR access from behind the firewall.













## Next steps

- Learn [how to configure and manage private endpoints for Azure Backup](backup-azure-private-endpoints-configure-manage.md).

