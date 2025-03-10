---
title: Azure Kubernetes Service (AKS) backup using Azure Backup prerequisites
description: This article explains the prerequisites for Azure Kubernetes Service (AKS) backup.
ms.topic: overview
ms.service: azure-backup
ms.custom:
  - ignite-2023
ms.date: 01/30/2025
author: jyothisuri
ms.author: jsuri
---

# Prerequisites for Azure Kubernetes Service backup using Azure Backup

This article describes the prerequisites for Azure Kubernetes Service (AKS) backup.

Azure Backup now allows you to back up AKS clusters (cluster resources and persistent volumes attached to the cluster) using a backup extension, which must be installed in the cluster. Backup vault communicates with the cluster via this Backup Extension to perform backup and restore operations. Based on the least privileged security model, a Backup vault must have *Trusted Access* enabled to communicate with the AKS cluster.

## Backup Extension

- The extension enables backup and restore capabilities for the containerized workloads and persistent volumes used by the workloads running in AKS clusters. 

- Backup Extension is installed in its own namespace *dataprotection-microsoft* by default. It is installed with cluster wide scope that allows the extension to access all the cluster resources. During the extension installation, it also creates a User-assigned Managed Identity (Extension Identity) in the Node Pool resource group. 

- Backup Extension uses a blob container (provided in input during installation) as a default location for backup storage. To access this blob container, the Extension Identity requires *Storage Blob Data Contributor* role on the storage account that has the container.

- You need to install Backup Extension on both the source cluster to be backed up and the target cluster where backup is to be restored.

- Backup Extension can be installed in the cluster from the *AKS portal* blade on the **Backup** tab under **Settings**. You can also use the Azure CLI commands to [manage the installation and other operations on the Backup Extension](azure-kubernetes-service-cluster-manage-backups.md#backup-extension-related-operations).

- Before you install an extension in an AKS cluster, you must register the `Microsoft.KubernetesConfiguration` resource provider at the subscription level. Learn how to [register the resource provider](azure-kubernetes-service-cluster-manage-backups.md#resource-provider-registrations).

- Extension agent and extension operator are the core platform components in AKS, which are installed when an extension of any type is installed for the first time in an AKS cluster. These provide capabilities to deploy first-party and third-party extensions. The backup extension also relies on them for installation and upgrades.

  >[!Note]
  >Both of these core components are deployed with aggressive hard limits on CPU and memory, with CPU *less than 0.5% of a core* and memory limit ranging from *50-200 MB*. So, the *COGS impact* of these components is very low. Because they are core platform components, there is no workaround available to remove them once installed in the cluster.

- If Storage Account, to be provided as input for Extension installation, is under Virtual Network/Firewall, then BackupVault needs to be added as trusted access in Storage Account Network Settings. [Learn how to grant access to trusted Azure service](../storage/common/storage-network-security.md?tabs=azure-portal#grant-access-to-trusted-azure-services), which helps to store backups in the Vault datastore

- The blob container provided in input during extension installation should not contain any files unrelated to backup.   

Learn [how to manage the operation to install Backup Extension using Azure CLI](azure-kubernetes-service-cluster-manage-backups.md#backup-extension-related-operations).

## Trusted Access

Many Azure services depend on *clusterAdmin kubeconfig* and the *publicly accessible kube-apiserver endpoint* to access AKS clusters. The **AKS Trusted Access** feature enables you to bypass the private endpoint restriction. Without using Microsoft Entra application, this feature enables you to give explicit consent to your system-assigned identity of allowed resources to access your AKS clusters using an Azure resource RoleBinding. The feature allows you to access AKS clusters with different configurations, which aren't limited to private clusters, clusters with local accounts disabled, Microsoft Entra ID clusters, and authorized IP range clusters.

Your Azure resources access AKS clusters through the AKS regional gateway using system-assigned managed identity authentication. The managed identity must have the appropriate Kubernetes permissions assigned via an Azure resource role.

For AKS backup, the Backup vault accesses your AKS clusters via Trusted Access to configure backups and restores. The Backup vault is assigned a predefined role **Microsoft.DataProtection/backupVaults/backup-operator** in the AKS cluster, allowing it to only perform specific backup operations. 

To enable Trusted Access between a Backup vault and an AKS cluster. Learn [how to enable Trusted Access](azure-kubernetes-service-cluster-manage-backups.md#trusted-access-related-operations)

>[!Note]
>- You can install the Backup Extension on your AKS cluster directly from the Azure portal under the *Backup* section in AKS portal.
>- You can also enable Trusted Access between Backup vault and AKS cluster during the backup or restore operations in the Azure portal.


## AKS Cluster

To enable backup for an AKS cluster, see the following prerequisites: .

- AKS backup uses Container Storage Interface (CSI) drivers snapshot capabilities to perform backups of persistent volumes. CSI Driver support is available for AKS clusters with Kubernetes version *1.21.1* or later. 

  >[!Note]
  >- Currently, AKS backup only supports backup of Azure Disk-based persistent volumes (enabled by CSI driver). If you're using Azure File Share and Azure Blob type persistent volumes in your AKS clusters, you can configure backups for them via the Azure Backup solutions available for [Azure File Share](azure-file-share-backup-overview.md) and [Azure Blob](blob-backup-overview.md).
  >- In Tree, volumes aren't supported by AKS backup; only CSI driver based volumes can be backed up. You can [migrate from tree volumes to CSI driver based Persistent Volumes](/azure/aks/csi-migrate-in-tree-volumes).

- Before installing Backup Extension in the AKS cluster, ensure that the CSI drivers and snapshots are enabled for your cluster. If disabled, see [these steps to enable them](/azure/aks/csi-storage-drivers#enable-csi-storage-drivers-on-an-existing-cluster).

- Azure Backup for AKS supports AKS clusters using either a system-assigned managed identity or a user-assigned managed identity for backup operations. Although clusters using a service principal aren't supported, you can update an existing AKS cluster to use a [system-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-aks-cluster-to-use-a-system-assigned-managed-identity) or a [user-assigned managed identity](/azure/aks/use-managed-identity#update-an-existing-cluster-to-use-a-user-assigned-managed-identity).

- The Backup Extension during installation fetches Container Images stored in Microsoft Container Registry (MCR). If you enable a firewall on the AKS cluster, the extension installation process might fail due to access issues on the Registry. Learn [how to allow MCR access from the firewall](/azure/container-registry/container-registry-firewall-access-rules#configure-client-firewall-rules-for-mcr).

- In case you have the cluster in a Private Virtual Network and Firewall, apply the following FQDN/application rules: `*.microsoft.com`, `mcr.microsoft.com`, `data.mcr.microsoft.com`, `crl.microsoft.com`, `mscrl.microsoft.com`, `oneocsp.microsoft.com` , `*.azure.com`, `management.azure.com`, `gcs.prod.monitoring.core.windows.net`, `*.prod.warm.ingest.monitor.core.windows.net`, `*.blob.core.windows.net`, `*.azmk8s.io`, `ocsp.digicert.com`, `cacerts.digicert.com`, `crl3.digicert.com`, `crl4.digicert.com`, `ocsp.digicert.cn`, `cacerts.digicert.cn`, `cacerts.geotrust.com`, `cdp.geotrust.com`, `status.geotrust.com`, `ocsp.msocsp.com`,  `*.azurecr.io`, `docker.io`, `*.dp.kubernetesconfiguration.azure.com`. Learn [how to apply FQDN rules](../firewall/dns-settings.md).

- If you have any previous installation of *Velero* in the AKS cluster, you need to delete it before installing Backup Extension.

- If you are using [Azure policies in your AKS cluster](/azure/aks/policy-reference), ensure that the extension namespace *dataprotection-microsoft* is excluded from these policies to allow backup and restore operations to run successfully.

- If you are using Azure network security group to filter network traffic between Azure resources in an Azure virtual network then set an inbound rule to allow service tags *azurebackup* and *azurecloud*. 
     

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

| Role  | Assigned to    | Assigned on     |  Description |
| ---- | --- | --- | --- |
| Reader                         | Backup vault       | AKS cluster             | Allows the Backup vault to perform _List_ and _Read_ operations on AKS cluster.             |
| Reader                         | Backup vault       | Snapshot resource group | Allows the Backup vault to perform _List_ and _Read_ operations on snapshot resource group. |
| Contributor                    | AKS cluster        | Snapshot resource group | Allows AKS cluster to store persistent volume snapshots in the resource group.              |
| Storage Blob Data Contributor    | Extension Identity | Storage account         | Allows Backup Extension to store cluster resource backups in the blob container.            |
| Data Operator for Managed Disks | Backup vault       | Snapshot Resource Group | Allows Backup Vault service to move incremental snapshot data to the Vault.                  |
| Disk Snapshot Contributor      | Backup vault       | Snapshot Resource Group | Allows Backup Vault to access Disks snapshots and perform Vaulting operation.                |
| Storage Blob Data Reader       | Backup vault       | Storage Account         | Allow Backup Vault to access Blob Container with backup data stored to move to Vault.        |
| Contributor                    | Backup vault       | Staging Resource Group  | Allows Backup Vault to hydrate backups as Disks stored in Vault Tier.                        |
| Storage Account Contributor    | Backup vault       | Staging Storage Account | Allows Backup Vault to hydrate backups stored in Vault Tier.                                 |
| Storage Blob Data Owner        | Backup vault       | Staging Storage Account | Allows Backup Vault to copy cluster state in a blob container stored in Vault Tier.          |



>[!Note]
>AKS backup allows you to assign these roles during backup and restore processes through the Azure portal with a single click.

## Next steps

- [About Azure Kubernetes Service backup](azure-kubernetes-service-backup-overview.md)
- [Supported scenarios for Azure Kubernetes Service cluster backup](azure-kubernetes-service-cluster-backup-support-matrix.md)
- Back up Azure Kubernetes Service cluster using [Azure portal](azure-kubernetes-service-cluster-backup.md), [Azure PowerShell](azure-kubernetes-service-cluster-backup-using-powershell.md)
- Restore Azure Kubernetes Service cluster using [Azure portal](azure-kubernetes-service-cluster-restore.md), [Azure CLI](azure-kubernetes-service-cluster-restore-using-cli.md), [Azure PowerShell](azure-kubernetes-service-cluster-restore-using-powershell.md)
- [Manage Azure Kubernetes Service cluster backups](azure-kubernetes-service-cluster-manage-backups.md)
