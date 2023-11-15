---
title: Quickstart - Install Azure Backup extension in an AKS cluster
description: In this quickstart, learn how to install the Azure Backup extension in an AKS cluster and get it ready to configure backup.
ms.topic: quickstart
ms.date: 11/14/2023
ms.service: backup
ms.custom:
  - ignite-2023
author: AbhishekMallick-MS
ms.author: v-abhmallick
---

# Quickstart: Install Azure Backup extension in an AKS cluster  

This article describes how to install the Azure Backup extension in an AKS cluster and get it ready to configure backup.

The AKS cluster extension provides an Azure Resource Manager-based process for installing and managing services throughout their lifecycle. Azure Backup enables backup and restore operations to be carried out within an AKS cluster using this extension. The Backup vault communicates with this extension to perform and manage backups.

Learn more about [Backup extension](./azure-kubernetes-service-cluster-backup-concept.md#backup-extension)    

## Prerequisites

Before you start:

1. You must register the `Microsoft.KubernetesConfiguration` resource provider at the subscription level before you install an extension in an AKS cluster. [Learn more](./azure-kubernetes-service-cluster-manage-backups.md#resource-provider-registrations).

2. In case you have the cluster in a Private Virtual Network and Firewall, apply the following FQDN/application rules: `*.microsoft.com`, `*.azure.com`, `*.core.windows.net`, `*.azmk8s.io`, `*.digicert.com`, `*.digicert.cn`, `*.geotrust.com`, `*.msocsp.com`. Learn [how to apply FQDN rules](../firewall/dns-settings.md).

3. Backup extension requires a storage account and a blob container in input. In case the AKS cluster is inside a private virtual network, enable private endpoint between the storage account and the AKS cluster by following these steps.
   1. Before you install the Backup extension in an AKS cluster, ensure that the CSI drivers and snapshots are enabled for your cluster. If they're disabled, [enable these settings](../aks/csi-storage-drivers.md#enable-csi-storage-drivers-on-an-existing-cluster).
   2. In case you have Azure Active Directory pod identity enabled on the AKS cluster, create a pod-identity exception in AKS cluster which works only for `dataprotection-microsoft` namespace by [following these steps](/cli/azure/aks/pod-identity/exception?view=azure-cli-latest&preserve-view=true#az-aks-pod-identity-exception-add)

## Install Backup extension in an AKS cluster

Follow these steps:

1. In the Azure portal, go to the **AKS Cluster** you want to back up, and then under **Settings**, select **Backup**.

1. To prepare AKS cluster for backup or restore, you need to install backup extension in the cluster by selecting **Install Extension**.

1. Provide a *storage account* and *blob container* as input.

   Your AKS cluster backups will be stored in this blob container. The storage account needs to be in the same region and subscription as the cluster.

    Select **Next**.

    :::image type="content" source="./media/quick-install-backup-extension/add-storage-details-for-backup.png" alt-text="Screenshot shows how to add storage and blob details for backup."::: 

1.  Review the extension installation details provided, and then select **Create**.

    The deployment begins to install the extension.

    :::image type="content" source="./media/quick-install-backup-extension/install-extension.png" alt-text="Screenshot shows how to review and install the backup extension.":::

1. Once the  backup extension is installed successfully, start configuring backups for your AKS cluster by selecting **Configure Backup**.


## Next steps

- [About Azure Kubernetes Service cluster backup](azure-kubernetes-service-backup-overview.md)

 
