---
title: Install Azure Container Storage with AKS
description: Learn how to install Azure Container Storage for use with Azure Kubernetes Service (AKS). Create an AKS cluster and install Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.topic: tutorial
ms.date: 09/10/2025
ms.author: kendownie
ms.custom: devx-track-azurecli, references_regions
# Customer intent: "As a cloud administrator, I want to install Azure Container Storage on an AKS cluster so that I can efficiently manage storage for containerized applications."
---

# Tutorial: Install Azure Container Storage for use with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. In this tutorial, you'll create an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster and install the latest production version of Azure Container Storage on the cluster. If you already have an AKS cluster deployed, we recommend installing Azure Container Storage [using this quickstart](container-storage-aks-quickstart.md) instead of following the manual steps in this tutorial.

If you prefer the open-source version of Azure Container Storage, visit the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository for alternate installation instructions.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

> [!div class="checklist"]
> * Create a resource group
> * Ensure VM type for your cluster meets the installation criteria
> * Create an AKS cluster
> * Install Azure Container Storage

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- This article requires the latest version (2.77.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). Don't use Azure Cloud Shell, because `az upgrade` isn't available in Cloud Shell. Be sure to run the commands in this article with administrative privileges. Some Azure CLI extensions, such as `aks-preview`, can conflict with required command flags. Disable them if you encounter issues.

- You'll need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

- Sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

## Install the required extension

Add or upgrade to the latest version of `k8s-extension` by running the following command.

```azurecli
az extension add --upgrade --name k8s-extension
```

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli
az account set --subscription <subscription-id>
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*.

```azurecli
az group create --name <resource-group-name> --location <location>
```

If the resource group was created successfully, you'll see output similar to this:

```output
{
  "id": "/subscriptions/<guid>/resourceGroups/myContainerStorageRG",
  "location": "eastus",
  "managedBy": null,
  "name": "myContainerStorageRG",
  "properties": {
    "provisioningState": "Succeeded"
  },
  "tags": null
}
```

## Ensure VM type for your cluster meets the installation criteria

Follow these guidelines when choosing a VM type for the cluster nodes.

- Choose a VM SKU that supports local NVMe data disks, for example, [Storage optimized VM SKUs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VM SKUs](/azure/virtual-machines/sizes/overview#gpu-accelerated).
- Choose the OS type for the VMs in the node pools as Linux OS. Windows OS isn't currently supported.

## Create a new AKS cluster and install Azure Container Storage

If you already have an AKS cluster deployed, follow the installation instructions in [this quickstart guide](container-storage-aks-quickstart.md).

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage --generate-ssh-keys
```

The deployment will take 5-10 minutes. When it completes, you'll have an AKS cluster with Azure Container Storage installed and the components for local NVMe storage type deployed.

## Next step

- [Create generic ephemeral volume with local NVMe](use-container-storage-with-local-disk.md)