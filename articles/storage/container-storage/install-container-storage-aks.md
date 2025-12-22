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

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. Use this tutorial to install the latest production version of Azure Container Storage on an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster, whether you're creating a new cluster or enabling the service on an existing deployment.

If you prefer the open-source version of Azure Container Storage, visit the [local-csi-driver](https://github.com/Azure/local-csi-driver) repository for alternate installation instructions.

> [!IMPORTANT]
> This article applies to [Azure Container Storage (version 2.x.x)](container-storage-introduction.md). For earlier versions, see [Azure Container Storage (version 1.x.x) documentation](container-storage-introduction-version-1.md). If you already have Azure Container Storage (version 1.x.x) installed on your AKS cluster, remove it by following [these steps](remove-container-storage-version-1.md).

> [!div class="checklist"]
> * Prepare your Azure CLI environment
> * Create or select a resource group for your cluster
> * Confirm your node pool virtual machine types meet the installation criteria
> * Install Azure Container Storage by creating a new AKS cluster or enabling it on an existing cluster

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

- This article requires the latest version (2.77.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). Don't use Azure Cloud Shell, because `az upgrade` isn't available in Cloud Shell. Be sure to run the commands in this article with administrative privileges. Some Azure CLI extensions, such as `aks-preview`, can conflict with required command flags. Disable them if you encounter issues.

- You need the Kubernetes command-line client, `kubectl`. You can install it locally by running the `az aks install-cli` command.

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
* Where your resources run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*. If you're enabling Azure Container Storage on an existing AKS cluster, use the resource group that already hosts the cluster.

```azurecli
az group create --name <resource-group-name> --location <location>
```

If the resource group is created successfully, you see output similar to this example:

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

## Ensure the VM type for your cluster meets the installation criteria

Follow these guidelines when choosing a virtual machine type for the cluster nodes.

- Choose a virtual machine SKU that supports local NVMe data disks, for example, [storage optimized VMs](/azure/virtual-machines/sizes/overview#storage-optimized) or [GPU accelerated VMs](/azure/virtual-machines/sizes/overview#gpu-accelerated).
- Choose the OS type for the VMs in the node pools as Linux OS. Windows OS isn't currently supported.
- For existing clusters, make sure node pools already use a supported VM SKU before enabling Azure Container Storage.

## Install Azure Container Storage on your AKS cluster

Choose the scenario that matches your environment.

### Option 1: Create a new AKS cluster with Azure Container Storage enabled

Run the following command to create a new AKS cluster and install Azure Container Storage. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use.

```azurecli
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_L8s_v3 --enable-azure-container-storage --generate-ssh-keys
```

The deployment takes 5-10 minutes. When it completes, you have an AKS cluster with Azure Container Storage installed and the components for local NVMe storage type deployed.

### Option 2: Enable Azure Container Storage on an existing AKS cluster

Run the following command to enable Azure Container Storage on an existing AKS cluster. Replace `<cluster-name>` and `<resource-group>` with your own values.

```azurecli
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage
```

The deployment takes 5-10 minutes. When it completes, the targeted AKS cluster has Azure Container Storage installed and the components for local NVMe storage type deployed.

## Connect to the cluster and verify status

After installation, configure `kubectl` to connect to your cluster and verify the nodes are ready.

1. Download the cluster credentials and configure the Kubernetes CLI to use them. By default, credentials are stored in `~/.kube/config`. Provide a different path by using the `--file` argument if needed.

    ```azurecli
    az aks get-credentials --resource-group <resource-group> --name <cluster-name>
    ```

2. Verify the connection by listing the cluster nodes.

    ```azurecli
    kubectl get nodes
    ```

3. Make sure all nodes report a status of `Ready`, similar to the following output:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-34832848-vmss000000   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000001   Ready    agent   80m   v1.32.6
    aks-nodepool1-34832848-vmss000002   Ready    agent   80m   v1.32.6
    ```

## Next step

- [Use Azure Container Storage with local NVMe](use-container-storage-with-local-disk.md)
- [Overview of deploying a highly available PostgreSQL database on Azure Kubernetes Service (AKS)](/azure/aks/postgresql-ha-overview#storage-considerations)
