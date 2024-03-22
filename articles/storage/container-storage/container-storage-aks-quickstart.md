---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Create a Linux-based Azure Kubernetes Service (AKS) cluster, install Azure Container Storage, and create a storage pool.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 03/21/2024
ms.author: kendownie
ms.custom:
  - devx-track-azurecli
  - ignite-2023-container-storage
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to create a Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster, install Azure Container Storage, and create a storage pool using Azure CLI.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

## Getting started

- Take note of your Azure subscription ID. If you want to use Azure Elastic SAN as data storage, you'll need an [Azure role-based access control (Azure RBAC) Owner](../../role-based-access-control/built-in-roles.md#owner) role on the Azure subscription. Owner-level access grants the Azure Container Storage extension the proper permissions to interact with Elastic SAN's API. If you're planning on using Azure Disks or Ephemeral Disk as data storage, you don't need special permissions on your subscription.

- [Launch Azure Cloud Shell](https://shell.azure.com), or if you're using a local installation, sign in to Azure by using the [az login](/cli/azure/reference-index#az-login) command.

- If you're using Azure Cloud Shell, you might be prompted to mount storage. Select the Azure subscription where you want to create the storage account and select **Create**.

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

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. If you already have a resource group you want to use, you can skip this section.

When you create a resource group, you're prompted to specify a location. This location is:

- The storage location of your resource group metadata.
- Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*. See this [list of Azure regions](container-storage-introduction.md#regional-availability) where Azure Container Storage is available.

```azurecli-interactive
az group create --name <resource-group> --location <location>
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

## Choose a data storage option for your storage pool

Before deploying Azure Container Storage, you'll need to decide which back-end storage option you want to use to create your storage pool and persistent volumes. Three options are currently available:

- **Azure Elastic SAN**: Azure Elastic SAN is a good fit for general purpose databases, streaming and messaging services, CI/CD environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

- **Azure Disks**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

- **Ephemeral Disk**: This option uses local NVMe drives or temp SSD on the AKS cluster nodes. It's extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment.

> [!NOTE]
> For Azure Elastic SAN and Azure Disks, Azure Container Storage will deploy the backing storage for you as part of the installation. You don't need to create your own Elastic SAN or Azure Disk. In order to use Elastic SAN, you'll need an [Azure role-based access control (Azure RBAC) Owner](../../role-based-access-control/built-in-roles.md#owner) role on the Azure subscription.

### Resource consumption

Azure Container Storage requires certain node resources to run components for the service. Based on your storage pool type selection, which you'll specify when you install Azure Container Storage, these are the resources that will be consumed:

| **Storage pool type** | **CPU cores** | **RAM** |
|-----------------------|---------------|---------|
| Azure Elastic SAN | None | None |
| Azure Disks | 1 | 1 GiB |
| Ephemeral Disk - Temp SSD |  1 | 1 GiB |
| Ephemeral Disk - Local NVMe |  25% of cores (depending on node size)\* | 2 GiB |

The resources consumed are per node, and will be consumed for each node in the node pool where Azure Container Storage will be installed. If your nodes don't have enough resources, Azure Container Storage will fail to run. Kubernetes will automatically re-try to initialize these failed pods, so if resources get liberated, these pods can be initialized again.

\*In a storage pool type Ephemeral Disk - Local NVMe, if you're using multiple VM SKU types for your cluster nodes, the 25% of CPU cores consumed applies to the smallest SKU used. For example, if you're using a mix of 8-core and 16-core VM types, resource consumption is 2 cores.

## Choose a VM type for your cluster

You'll specify the VM type when you create the cluster in the next section. Follow these guidelines when choosing a VM type for the cluster nodes. You must choose a VM type that supports [Azure premium storage](../../virtual-machines/premium-storage-performance.md).

- If you intend to use Azure Elastic SAN or Azure Disks as backing storage, choose a [general purpose VM type](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5**.
- If you intend to use Ephemeral Disk with local NVMe, choose a [storage optimized VM type](../../virtual-machines/sizes-storage.md) such as **standard_l8s_v3**.
- If you intend to use Ephemeral Disk with temp SSD, choose a VM that has a temp SSD disk such as [Ev3 and Esv3-series](../../virtual-machines/ev3-esv3-series.md).

## Create a new AKS cluster and install Azure Container Storage

If you already have an AKS cluster deployed, skip this section and go to [Install Azure Container Storage on an existing AKS cluster](#install-azure-container-storage-on-an-existing-aks-cluster).

Run the following command to create a new AKS cluster, install Azure Container Storage, and create a storage pool. Replace `<cluster-name>` and `<resource-group>` with your own values, and specify which VM type you want to use. Replace `<storage-pool-type>` with `azureDisk`, `ephemeralDisk`, or `elasticSan`. If you select `ephemeralDisk`, you can also specify `--storage-pool-option`, and the values can be `NVMe` or `Temp`.

Running this command will enable Azure Container Storage on the system node pool\* with three Linux VMs. By default, the system node pool is named `nodepool1`. If you want to enable Azure Container Storage on other node pools, see [Install Azure Container Storage on specific node pools](#install-azure-container-storage-on-specific-node-pools). If you want to specify additional storage pool parameters with this command, see [this table](container-storage-faq.md#storage-pool-parameters).

\*If there are any existing node pools with the `acstor.azure.com/io-engine:acstor` label then Azure Container Storage will be installed there by default. Otherwise, it's installed on the system node pool.

```azurecli-interactive
az aks create -n <cluster-name> -g <resource-group> --node-vm-size Standard_D4s_v3 --node-count 3 --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes. When it completes, you'll have an AKS cluster with Azure Container Storage installed, the components for your chosen storage pool type enabled, and a default storage pool. If you want to enable additional storage pool types to create additional storage pools, see [Enable additional storage pool types](#enable-additional-storage-pool-types).

> [!IMPORTANT]
> If you specified Azure Elastic SAN as backing storage for your storage pool and you don't have owner-level access to the Azure subscription, only Azure Container Storage will be installed and a storage pool won't be created. In this case, you'll have to [create an Elastic SAN storage pool manually](use-container-storage-with-elastic-san.md).

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

## Install Azure Container Storage on an existing AKS cluster

If you already have an AKS cluster that meets the [VM requirements](#choose-a-vm-type-for-your-cluster), run the following command to install Azure Container Storage on the cluster and create a storage pool. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

Running this command will enable Azure Container Storage on the system node pool, which by default is named `nodepool1`\*. If you want to enable it on other node pools, see [Install Azure Container Storage on specific node pools](#install-azure-container-storage-on-specific-node-pools). If you want to specify additional storage pool parameters, see [this table](container-storage-faq.md#storage-pool-parameters).

\*If there are any existing node pools with the `acstor.azure.com/io-engine:acstor` label then Azure Container Storage will be installed there by default. Otherwise, it's installed on the system node pool.

> [!IMPORTANT]
> **If you created your AKS cluster using the Azure portal:** The cluster will likely have a user node pool and a system/agent node pool. However, if your cluster consists of only a system node pool, which is the case with test/dev clusters created with the Azure portal, you'll need to first [add a new user node pool](../../aks/create-node-pools.md#add-a-node-pool) and then label it. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` is added to the system/agent node pool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes to complete.

### Install Azure Container Storage on specific node pools

If you want to install Azure Container Storage on specific node pools, follow these instructions. The node pools must contain at least three Linux VMs each.

1. Run the following command to view the list of available node pools. Replace `<resource-group>` and `<cluster-name>` with your own values.
   
   ```azurecli-interactive
   az aks nodepool list --resource-group <resource-group> --cluster-name <cluster-name>
   ```
   
2. Run the following command to install Azure Container Storage on specific node pools. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`. If you select `ephemeralDisk`, you can also specify --storage-pool-option, and the values can be `NVMe` or `Temp`.
   
   ```azurecli-interactive
   az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type> --azure-container-storage-nodepools <comma separated values of nodepool names>
   ```

## Enable additional storage pool types

If you want to enable a storage pool type that wasn't originally enabled during installation of Azure Container Storage, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. For `<storage-pool-type>`, specify `azureDisk`, `ephemeralDisk`, or `elasticSan`.

If you want to specify additional storage pool parameters with this command, see [this table](container-storage-faq.md#storage-pool-parameters).

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

If the new storage pool type that you've enabled takes up more resources than the storage pool type that's already enabled, the [resource consumption](#resource-consumption) will change to the maximum amount.

> [!TIP]
> If you've added a new node pool to your cluster and want to run Azure Container Storage on that node pool, you can specify the node pool with `--azure-container-storage-nodepools <nodepool-name>` when running the `az aks update` command.

## Disable storage pool types

If you're no longer using a specific storage pool type and want to disable it to free up resources in your node pool, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. For `<storage-pool-type>`, specify `azureDisk`, `ephemeralDisk`, or `elasticSan`.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --disable-azure-container-storage <storage-pool-type>
```

> [!NOTE]
> If you have an existing storage pool of the type that you're trying to disable, the storage pool type won't be disabled.

## Next steps

To create persistent volumes, select the link for the backing storage type you selected.

- [Create persistent volume claim with Azure managed disks](use-container-storage-with-managed-disks.md#create-a-persistent-volume-claim)
- [Create persistent volume claim with Ephemeral Disk](use-container-storage-with-local-disk.md#create-a-persistent-volume-claim)
- [Create persistent volume claim with Azure Elastic SAN](use-container-storage-with-elastic-san.md#create-a-persistent-volume-claim)
