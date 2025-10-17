---
title: Use Azure Container Storage with AKS
description: Connect to a Linux-based Azure Kubernetes Service (AKS) cluster and install Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 09/10/2025
ms.author: kendownie
ms.custom: references_regions
# Customer intent: As a cloud engineer, I want to install Azure Container Storage on my AKS cluster, so that I can manage container volumes efficiently and choose the appropriate storage options for my workloads.
---

# Quickstart: Use Azure Container Storage with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This quickstart shows you how to connect to a Linux-based [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster and install Azure Container Storage.

If you prefer the open-source version of Azure Container Storage, visit the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository for alternate installation instructions.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- This article requires the latest version (2.77.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). Don't use Azure Cloud Shell, because `az upgrade` isn't available in Cloud Shell. Be sure to run the commands in this article with administrative privileges. Some Azure CLI extensions, such as `aks-preview`, can conflict with required command flags. Disable them if you encounter issues.

- You'll need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

- If you haven't already created an AKS cluster, follow the instructions for [Installing an AKS Cluster](install-container-storage-aks.md).

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

## Connect to the cluster

To connect to the cluster, use the Kubernetes command-line client, `kubectl`.

1. Configure `kubectl` to connect to your cluster using the `az aks get-credentials` command. The following command:

    * Downloads credentials and configures the Kubernetes CLI to use them.
    * Uses `~/.kube/config`, the default location for the Kubernetes configuration file. You can specify a different location for your Kubernetes configuration file using the *--file* argument.

    ```azurecli
    az aks get-credentials --resource-group <resource-group> --name <cluster-name>
    ```

2. Verify the connection to your cluster using the `kubectl get` command. This command returns a list of the cluster nodes.

    ```azurecli
    kubectl get nodes
    ```

3. The following output example shows the nodes in your cluster. Make sure the status for all nodes shows *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-34832848-vmss000000   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000001   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000002   Ready    agent   80m   v1.32.6
    ```

## Ensure VM type for your cluster meets the following criteria

Follow these guidelines when choosing a VM type for the cluster nodes.

- Choose a VM SKU that supports local NVMe data disks, for example, [Storage optimized VM SKUs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VM SKUs](/azure/virtual-machines/sizes/overview#gpu-accelerated).

- Choose Linux OS as the OS type for the VMs in the node pools. Windows OS isn't currently supported.

## Install Azure Container Storage on your AKS cluster

Run the following command to install Azure Container Storage on the cluster. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
```

The deployment will take 5-10 minutes. When it completes, you'll have an AKS cluster with Azure Container Storage installed and the components for local NVMe storage type deployed.

## Next step

- [Create generic ephemeral volume with local NVMe](use-container-storage-with-local-disk.md)