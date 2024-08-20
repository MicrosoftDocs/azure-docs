---
title: Install Azure Container Storage with Azure Kubernetes Service
description: Learn how to install Azure Container Storage for use with Azure Kubernetes Service (AKS). Create an AKS cluster and install Azure Container Storage.
author: khdownie
ms.service: azure-container-storage
ms.topic: tutorial
ms.date: 07/03/2024
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Tutorial: Install Azure Container Storage for use with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. In this tutorial, you'll create an [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster and install the latest production version of Azure Container Storage on the cluster. If you already have an AKS cluster deployed, we recommend installing Azure Container Storage [using this QuickStart](container-storage-aks-quickstart.md) instead of following the manual steps in this tutorial.

> [!IMPORTANT]
> Azure Container Storage is now generally available (GA) beginning with version 1.1.0. The GA version is recommended for production workloads.

> [!div class="checklist"]
> * Create a resource group
> * Choose a data storage option and VM type
> * Create an AKS cluster
> * Connect to the cluster
> * Label the node pool
> * Assign Azure Container Storage Operator role to AKS managed identity
> * Install Azure Container Storage

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

* This article requires the latest version (2.35.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using the Bash environment in Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges. For more information, see [Get started with Azure Cloud Shell](/azure/cloud-shell/get-started).

* You'll need the Kubernetes command-line client, `kubectl`. It's already installed if you're using Azure Cloud Shell, or you can install it locally by running the `az aks install-cli` command.

* Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

## Getting started

* Take note of your Azure subscription ID. If you want to use Azure Elastic SAN as data storage, you'll need either an [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role assigned to the Azure subscription. Owner-level access allows you to install the Azure Container Storage extension, grants access to its storage resources, and gives you permission to configure your Azure Elastic SAN resource. Contributor-level access allows you to install the extension and grants access to its storage resources. If you're planning on using Azure Disks or Ephemeral Disk as data storage, you don't need special permissions on your subscription.

* [Launch Azure Cloud Shell](https://shell.azure.com), or if you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

* If you're using Azure Cloud Shell, you might be prompted to mount storage. Select the Azure subscription where you want to create the storage account and select **Create**.

## Install the required extension

Add or upgrade to the latest version of `k8s-extension` by running the following command.

```azurecli-interactive
az extension add --upgrade --name k8s-extension
```

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*.

```azurecli-interactive
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

## Choose a data storage option and virtual machine type

Before you create your cluster, you should understand which back-end storage option you'll ultimately choose to create your storage pool. This is because different storage services work best with different virtual machine (VM) types as cluster nodes, and you'll deploy your cluster before you create the storage pool.

### Data storage options

* **[Azure Elastic SAN](../elastic-san/elastic-san-introduction.md)**: Azure Elastic SAN is a good fit for general purpose databases, streaming and messaging services, CD/CI environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

* **[Azure Disks](/azure/virtual-machines/managed-disks-overview)**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

* **Ephemeral Disk**: This option uses local NVMe or temp SSD drives on the AKS nodes and is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment.

### Resource consumption

Azure Container Storage requires certain node resources to run components for the service. Based on your storage pool type selection, which you'll specify when you install Azure Container Storage, these are the resources that will be consumed:

| **Storage pool type** | **CPU cores** | **RAM** |
|-----------------------|---------------|---------|
| Azure Elastic SAN | None | None |
| Azure Disks | 1 | 1 GiB |
| Ephemeral Disk - Temp SSD |  1 | 1 GiB |
| Ephemeral Disk - Local NVMe (standard tier) |  25% of cores (performance tier can be updated)\* | 1 GiB |

The resources consumed are per node, and will be consumed for each node in the node pool where Azure Container Storage will be installed. If your nodes don't have enough resources, Azure Container Storage will fail to run. Kubernetes will automatically re-try to initialize these failed pods, so if resources get liberated, these pods can be initialized again.

\*In a storage pool type Ephemeral Disk - Local NVMe with the standard (default) performance tier, if you're using multiple VM SKU types for your cluster nodes, the 25% of CPU cores consumed applies to the smallest SKU used. For example, if you're using a mix of 8-core and 16-core VM types, resource consumption is 2 cores. You can [update the performance tier](use-container-storage-with-local-disk.md#optimize-performance-when-using-local-nvme) to use a greater percentage of cores and achieve greater IOPS.

### Ensure VM type for your cluster meets the following criteria

To use Azure Container Storage, you'll need a node pool of at least three Linux VMs. Each VM should have a minimum of four virtual CPUs (vCPUs). Azure Container Storage will consume one core for I/O processing on every VM the extension is deployed to.

Follow these guidelines when choosing a VM type for the cluster nodes. You must choose a VM type that supports [Azure premium storage](/azure/virtual-machines/premium-storage-performance).

- If you intend to use Azure Elastic SAN or Azure Disks as backing storage, choose a [general purpose VM type](/azure/virtual-machines/sizes-general) such as **standard_d4s_v5**.
- If you intend to use Ephemeral Disk with local NVMe, choose a [storage optimized VM type](/azure/virtual-machines/sizes-storage) such as **standard_l8s_v3**.
- If you intend to use Ephemeral Disk with temp SSD, choose a VM that has a temp SSD disk such as [Ev3 and Esv3-series](/azure/virtual-machines/ev3-esv3-series).

## Create a new AKS cluster and install Azure Container Storage

If you already have an AKS cluster deployed, follow the installation instructions in [this QuickStart](container-storage-aks-quickstart.md).

Run the following command to create a new AKS cluster, install Azure Container Storage, and create a storage pool. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use. Replace `<storage-pool-type>` with `azureDisk`, `ephemeralDisk`, or `elasticSan`. If you select `ephemeralDisk`, you must also specify `--storage-pool-option`, and the values can be `NVMe` or `Temp`.

Running this command will enable Azure Container Storage on the system node pool\* with three Linux VMs. **If you're specifying local NVMe for your storage pool type, be sure to set the node count to 4 or greater, or the command will fail to run.**

By default, the system node pool is named `nodepool1`. If you want to enable Azure Container Storage on other node pools, see [Install Azure Container Storage on specific node pools](container-storage-aks-quickstart.md#install-azure-container-storage-on-specific-node-pools). If you want to specify additional storage pool parameters with this command, see [this table](container-storage-storage-pool-parameters.md).

\*If there are any existing node pools with the `acstor.azure.com/io-engine:acstor` label then Azure Container Storage will be installed there by default. Otherwise, it's installed on the system node pool.

```azurecli-interactive
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_D4s_v3 --node-count 3 --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes. When it completes, you'll have an AKS cluster with Azure Container Storage installed, the components for your chosen storage pool type enabled, and a default storage pool. If you want to enable additional storage pool types to create additional storage pools, see [Enable additional storage pool types](container-storage-aks-quickstart.md#enable-additional-storage-pool-types).

> [!IMPORTANT]
> If you specified Azure Elastic SAN as backing storage for your storage pool and you don't have either [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role assigned to the Azure subscription, Azure Container Storage installation will fail and a storage pool won't be created. If you try to [enable Azure Elastic SAN as an additional storage pool type](container-storage-aks-quickstart.md#enable-additional-storage-pool-types) without either of these roles, your previous installation and storage pools will remain unaffected and an Elastic SAN storage pool wont be created.

## Display available storage pools

To get the list of available storage pools, run the following command:

```azurecli-interactive
kubectl get sp -n acstor
```

To check the status of a storage pool, run the following command:

```azurecli-interactive
kubectl describe sp <storage-pool-name> -n acstor
```

If the `Message` doesn't say `StoragePool is ready`, then your storage pool is still creating or ran into a problem. See [Troubleshoot Azure Container Storage](troubleshoot-container-storage.md).

## Next step

Select the link for the backing storage type you selected and follow the instructions for creating volumes.

- [Create persistent volume with Azure managed disks](use-container-storage-with-managed-disks.md)
- [Create persistent volume with Azure Elastic SAN](use-container-storage-with-elastic-san.md)
- [Create generic ephemeral volume with local NVMe](use-container-storage-with-local-disk.md)
- [Create generic ephemeral volume with temp SSD](use-container-storage-with-temp-ssd.md)
- [Create persistent volume with local NVMe and volume replication](use-container-storage-with-local-nvme-replication.md)
