---
title: Azure Kubernetes Service (AKS) backup using Azure Backup prerequisites 
description: This article explains the prerequisites for Azure Kubernetes Service (AKS) backup.
ms.topic: conceptual
ms.service: backup
ms.date: 08/17/2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Prerequisites for Azure Kubernetes Service backup using Azure Backup (preview)

This article describes the prerequisites for Azure Kubernetes Service (AKS) backup.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. Based on the least privileged security model, a Backup vault must have *Trusted Access* enabled to communicate with the AKS cluster.

## Backup Extension

- The extension enables backup and restore capabilities for the containerized workloads and persistent volumes used by the workloads running in AKS clusters. 

- Backup Extension is installed in its own namespace *dataprotection-microsoft* by default. It's installed with cluster wide scope that allows the extension to access all the cluster resources. During the extension installation, it also creates a User-assigned Managed Identity (Extension Identity) in the Node Pool resource group. 

- Backup Extension uses a blob container (provided in input during installation) as a default location for backup storage. To access this blob container, the Extension Identity requires *Storage Account Contributor* role on the storage account that has the container.

- You need to install Backup Extension on both the source cluster to be backed up and the target cluster where the restore will happen.

- Backup Extension can be installed in the cluster from the *AKS portal* blade on the **Backup** tab under **Settings**. You can also use the Azure CLI commands to [manage the installation and other operations on the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#backup-extension-related-operations).

- Before you install an extension in an AKS cluster, you must register the `Microsoft.KubernetesConfiguration` resource provider at the subscription level. Learn how to [register the resource provider](azure-kubernetes-service-cluster-manage-backups.md#resource-provider-registrations).

- Extension agent and extension operator are the core platform components in AKS, which are installed when an extension of any type is installed for the first time in an AKS cluster. These provide capabilities to deploy *1P* and *3P* extensions. The backup extension also relies on these for installation and upgrades.

  >[!Note]
  >Both of these core components are deployed with aggressive hard limits on CPU and memory, with CPU *less than 0.5% of a core* and memory limit ranging from *50-200 MB*. So, the *COGS impact* of these components is very low. Because they are core platform components, there is no workaround available to remove them once installed in the cluster.

Learn [how to manage the operation to install Backup Extension using Azure CLI](azure-kubernetes-service-cluster-manage-backups.md#backup-extension-related-operations).

## Trusted Access

Many Azure services depend on *clusterAdmin kubeconfig* and the *publicly accessible kube-apiserver endpoint* to access AKS clusters. The **AKS Trusted Access** feature enables you to bypass the private endpoint restriction. Without using Microsoft Azure Active Directory (Azure AD) application, this feature enables you to give explicit consent to your system-assigned identity of allowed resources to access your AKS clusters using an Azure resource RoleBinding. The Trusted Access feature allows you to access AKS clusters with different configurations, which aren't limited to private clusters, clusters with local accounts disabled, Azure AD clusters, and authorized IP range clusters.

Your Azure resources access AKS clusters through the AKS regional gateway using system-assigned managed identity authentication. The managed identity must have the appropriate Kubernetes permissions assigned via an Azure resource role.

For AKS backup, the Backup vault accesses your AKS clusters via Trusted Access to configure backups and restores. The Backup vault is assigned a pre-defined role **Microsoft.DataProtection/backupVaults/backup-operator** in the AKS cluster, allowing it to only perform specific backup operations. 

To enable Trusted Access between a Backup vault and an AKS cluster, you must register the `TrustedAccessPreview`  feature flag on `Microsoft.ContainerService` at the subscription level. Learn more [to register the resource provider](azure-kubernetes-service-cluster-manage-backups.md#enable-the-feature-flag).

Learn [how to enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#register-the-trusted-access).

>[!Note]
>- You can install the Backup Extension on your AKS cluster directly from the Azure portal under the *Backup* section in AKS portal.
>- You can also enable Trusted Access between Backup vault and AKS cluster during the backup or restore operations in the Azure portal.


## AKS Cluster

To enable backup for an AKS cluster, see the following prerequisites: .

- AKS backup uses CSI drivers snapshot capabilities to perform backups of persistent volumes. CSI Driver support is available for AKS clusters with Kubernetes version *1.21.1* or later. 

  >[!Note]
  >- Currently, AKS backup only supports backup of Azure Disk-based persistent volumes (enabled by CSI driver). If you're using Azure File Share and Azure Blob type persistent volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions available for [Azure File Share](azure-file-share-backup-overview.md) and [Azure Blob](blob-backup-overview.md).
  >- In Tree, volumes aren't supported by AKS backup; only CSI driver based volumes can be backed up. You can [migrate from tree volumes to CSI driver based Persistent Volumes](../aks/csi-migrate-in-tree-volumes.md).

- Before installing Backup Extension in the AKS cluster, ensure that the CSI drivers and snapshots are enabled for your cluster. If disabled, see [these steps to enable them](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).

- Backup Extension uses the AKS cluster’s Managed System Identity to perform backup operations. So, AKS backup doesn't support AKS clusters using Service Principal. You can [update your AKS cluster to use Managed System Identity](../aks/use-managed-identity.md#enable-managed-identities-on-an-existing-aks-cluster).

  >[!Note]
  >Only Managed System Identity based AKS clusters are supported by AKS backup. The support for User Identity based AKS clusters is currently not available. 

- The Backup Extension during installation fetches Container Images stored in Microsoft Container Registry (MCR). If you enable a firewall on the AKS cluster, the extension installation process might fail due to access issues on the Registry. Learn [how to allow MCR access from the firewall](../container-registry/container-registry-firewall-access-rules.md#configure-client-firewall-rules-for-mcr).

- Install Backup Extension on the AKS clusters following the [required FQDN/application rules](../aks/outbound-rules-control-egress.md).

- If you've any previous installation of *Velero* in the AKS cluster, you need to delete it before installing Backup Extension.


## Required roles and permissions

To perform AKS backup and restore operations as a user, you need to have specific roles on the AKS cluster, Backup vault, Storage account, and Snapshot resource group.

| Scope | Preferred role | Description |
| --- | --- | --- |
| AKS Cluster | Owner | Allows you to install Backup Extension, enable *Trusted Access* and grant permissions to Backup vault over the cluster. |
| Backup vault resource group | Backup Contributor | Allows you to create Backup vault in a resource group, create backup policy, configure backup, and restore and assign missing roles required for Backup operations. |
| Storage account | Owner | Allows you to perform read and write operations on the storage account and assign required roles to other Azure resources as a part of backup operations. |
| Snapshot resource group | Owner | Allows you to perform read and write operations on the Snapshot resource group and assign required roles to other Azure resources as part of backup operations. |

>[!Note]
>Owner role on an Azure resource allows you to perform Azure RBAC operations of that resource. If it's not available, the *resource owner* must provide the required roles to the Backup vault and AKS cluster before initiating the backup or restore operations.

Also, as part of the backup and restore operations, the following roles are assigned to the AKS cluster, Backup Extension Identity, and Backup vault.

| Role | Assigned To | Assigned on | Description |
| --- | --- | --- | --- |
| Reader | Backup vault | AKS cluster | Allows the Backup vault to perform *List* and *Read* operations on AKS cluster. |
| Reader | Backup vault | Snapshot resource group | Allows the Backup vault to perform *List* and *Read* operations on snapshot resource group. |
| Contributor | AKS cluster | Snapshot resource group | Allows AKS cluster to store persistent volume snapshots in the resource group. |
| Storage Account Contributor | Extension Identity | Storage account | Allows Backup Extension to store cluster resource backups in the blob container. |

>[!Note]
>AKS backup allows you to assign these roles during backup and restore processes through the Azure portal with a single click.

## Next steps

- [About Azure Kubernetes Service backup (preview)](azure-kubernetes-service-backup-overview.md)
- [Supported scenarios for Azure Kubernetes Service cluster backup (preview)](azure-kubernetes-service-cluster-backup-support-matrix.md)
- [Back up Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-backup.md)
- [Restore Azure Kubernetes Service cluster (preview)](azure-kubernetes-service-cluster-restore.md)
- [Manage Azure Kubernetes Service cluster backups (preview)](azure-kubernetes-service-cluster-manage-backups.md)

