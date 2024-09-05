---
title: Create hybrid Standard workflows for your own environment
description: Learn to create a hybrid Standard workflow for deployment in customer-managed environments.
services: azure-logic-apps
ms.suite: integration
ms.reviewer: estfan, azla
ms.topic: how-to
ms.date: 09/10/2024
# Customer intent: As a developer, I want to create a Standard logic app workflow that can run in my own environment, which can include an on-premises system, private cloud, or public cloud.
---

# Create hybrid Standard workflows for your own environment or infrastructure (Preview)

[!INCLUDE [logic-apps-sku-standard](../../includes/logic-apps-sku-standard.md)]

> [!NOTE]
> This capability is in preview and is subject to the
> [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

For scenarios where you have to control and manage your own infrastructure, Azure Logic Apps supports *hybrid* Standard workflows that can run in on-premises enviroments, private clouds, or public clouds. This hybrid solution is useful when you have partially connected scenarios that require local processing, storage, and network access.

## Limitations

- Visual Studio Code is supported for creating and deploying hybrid Standard workflows.

- SAP access requires the SAP built-in connector.

- Only XSLT 1.0 with custom code

Custom code support with .NET Framework

Managed identity authentication

File system connector

- Managed connector creation from Azure portal

## Prerequisites

- An Azure account and subscription. If you don't have a subscription, [sign up for a free Azure account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Visual Studio Code and [prerequisites](create-single-tenant-workflows-visual-studio-code.md#prerequisites).

  > [!TIP]
  > 
  > If you have a new Visual Studio Code installation, confirm that you can locally run a 
  > basic Standard workflow before you try to deploy in a hybrid environment. This test 
  > run helps isolate any errors that might exist in your Standard workflow project.

## Azure Kubernetes Service (AKS) cluster support

To use [AKS](/azure/aks/what-is-aks) for deployment, you can create an AKS cluster or an [on-premises AKS *hyperconverged infrastructure* (HCI) cluster](/azure-stack/hci/overview). Your AKS cluster requires inbound and outbound connectivity with the [SQL Server that you use as the storage provider](#storage-provider).

### Create AKS cluster

To create your AKS cluster, [follow the steps for the Azure portal](/azure/aks/learn/quick-kubernetes-deploy-portal), or run the following commands by using Azure Cloud Shell in the Azure portal or by using [Azure CLI installed on your local computer](/cli/azure/install-azure-cli):

  > [!NOTE]
  >
  > Change the **max-count** and **min-count** node values based on your load requirements.

  ```azurecli
  az login
  az account set --subscription {Azure-subscription-ID}
  az provider register --namespace Microsoft.KubernetesConfiguration --wait
  az extension add --name k8s-extension --upgrade --yes
  az group create --name {resource-group-name} --location '{Azure-region}'
  az aks create --resource-group {resource-group-name} --name {cluster-name} --enable-aad --generate-ssh-keys --enable-cluster-autoscaler --max-count 6 --min-count 1 
  ```

### Create on-premises AKS HCI cluster

To create your AKS HCI cluster, see the following documentation:

- [Create Kubernetes clusters using Azure CLI](/azure/aks/hybrid/aks-create-clusters-cli)
- [Quickstart: Create a local Kubernetes cluster on AKS enabled by Azure Arc using Windows Admin Center](/azure/aks/hybrid/create-kubernetes-cluster)
- [Set up an Azure Kubernetes Service host on Azure Stack HCI and Windows Server and deploy a workload cluster using PowerShell](/azure/aks/hybrid/kubernetes-walkthrough-powershell)

For more information about AKS on-premises options, see [Overview of AKS on Windows Server and Azure Stack HCI, version 22H2](/azure/aks/hybrid/overview).

## Storage provider

Hybrid workflows use SQL Server as the storage provider for Azure Logic Apps runtime storage and support the following SQL Server editions:

- SQL Server on premises
- [Azure SQL Database](/azure/azure-sql/database/sql-database-paas-overview)
- [Azure SQL Managed Instance](/azure/azure-sql/managed-instance/sql-managed-instance-paas-overview)
- [SQL Server enabled by Azure Arc](/sql/sql-server/azure-arc/overview)

For more informmation, see [Set up SQL storage for Standard logic app workflows](/azure/logic-apps/set-up-sql-db-storage-single-tenant-standard-workflows).

## File share for artifact storage

To store Azure Logic Apps artifacts, hybrid workflows require a file share that uses [Server Message Block (SMB) protocol](/windows/win32/fileio/microsoft-smb-protocol-and-cifs-protocol-overview). This file share requires inbound and outbound connectivity with your AKS cluster. If you have enabled Azure virtual network restrictions, make sure that your file share exists in the same virtual network as your AKS cluster or in a peered virtual network.

To set up your file share, you must have administrator access. To deploy from Visual Studio Code, make sure that the local computer with Visual Studio Code can access the file share. 

### Set up SMB file share on Windows

1. Go to the folder that you want to share, open the shortcut menu, select **Properties**.

1. On the **Sharing** tab, select **Share**.

1. In the box that opens, select a person who you want to have access to the file share.

1. Select **Share**, and copy the link for the network path.

   If your local computer isn't connected to a domain, replace the computer name in the network path with the IP address.

### Set up SMB file share on Azure Files

Alternatively, for testing purposes, you can use [Azure Files as an SMB file share](/azure/storage/files/files-smb-protocol).

1. In the [Azure portal](https://portal.azure.com), create an Azure Storage account resource.

1. From the storage account menu, select **File shares**.

1. From the **File shares** page toolbar, select **+ File share**, and provide the required information about your file share.

Create Azure Storage Account resource, under Data Storage, choose “File shares” and create new file share. 

For more information, see [SMB Azure file shares](/azure/storage/files/files-smb-protocol).

/azure/storage/files/storage-how-to-create-file-share?tabs=azure-portal

## Related content
