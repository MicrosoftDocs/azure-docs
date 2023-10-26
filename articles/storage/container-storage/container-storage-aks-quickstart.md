---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Create a Linux-based Azure Kubernetes Service (AKS) cluster, install Azure Container Storage, and create a storage pool using Azure CLI.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 10/26/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to create a Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster, install Azure Container Storage, and create a storage pool using Azure CLI.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

- Upgrade to the latest version of the `aks-preview` cli extension by running `az extension add --upgrade --name aks-preview`

> [!IMPORTANT]
> This Quickstart will work for most use cases. The only exception is if you plan to use Azure Elastic SAN Preview as backing storage for your storage pool and you don't have owner-level access to the Azure subscription. If both these statements apply to you, use the [manual installation steps](install-container-storage-aks.md) instead.


## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Register resource providers

The `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` resource providers must be registered on your Azure subscription. To register these providers, run the following command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait 
az provider register --namespace Microsoft.KubernetesConfiguration --wait 
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. If you already have a resource group you want to use, you can skip this section.

When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*.

```azurecli-interactive
az group create --name <resource-group-name> --location <location>
```

If the resource group was created successfully, you'll see output similar to this:

```json
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

- **Azure Elastic SAN Preview**: Azure Elastic SAN preview is a good fit for general purpose databases, streaming and messaging services, CI/CD environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

- **Azure Disks**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

- **Ephemeral Disk**: This option uses local NVMe drives on the AKS cluster nodes and is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment. 

You'll specify the storage pool type when you install Azure Container Storage.

## Choose a VM type for your cluster

If you intend to use Azure Elastic SAN Preview or Azure Disks as backing storage, then you should choose a [general purpose VM type](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5** for the cluster nodes. If you intend to use Ephemeral Disk, choose a [storage optimized VM type](../../virtual-machines/sizes-storage.md) with NVMe drives such as **standard_l8s_v3**. In order to use Ephemeral Disk, the VMs must have NVMe drives. You'll specify the VM type when you create the cluster in the next section.

> [!IMPORTANT]
> You must choose a VM type that supports [Azure premium storage](../../virtual-machines/premium-storage-performance.md). Each VM should have a minimum of four virtual CPUs (vCPUs). Azure Container Storage will consume one core for I/O processing on every VM the extension is deployed to.

## Create a new AKS cluster and install Azure Container Storage

Run the following command to create a new AKS cluster, install Azure Container Storage, and create a storage pool. Replace `<cluster-name>` and `<resource-group-name>` with your own values, and specify which VM type you want to use. You'll need a node pool of at least three Linux VMs. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

If you already have an AKS cluster deployed, skip this section and go to [Install Azure Container Storage on an existing AKS cluster](#install-azure-container-storage-on-an-existing-aks-cluster).

Optional storage pool parameters:

| **Parameter**      | **Default** |
|----------------|-------------|
| --storage-pool-name | mypool-<random 7 char lowercase> |
| --storage-pool-size | 512Gi (1Ti for Elastic SAN) |
| --storage-pool-sku | Premium_LRS |
| --storage-pool-option | NVMe |

```azurecli-interactive
az aks create --n <cluster-name> --g <resource-group-name> --node-vm-size Standard_D4s_v3 --node-count 3 --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes to complete.

## Install Azure Container Storage on an existing AKS cluster

If you already have an AKS cluster that meets the [VM requirements](#choose-a-vm-type-for-your-cluster), run the following command to install Azure Container Storage on the cluster and create a storage pool. Replace `<cluster-name>` and `<resource-group-name>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

> [!IMPORTANT]
> **If you created your AKS cluster using the Azure portal:** The cluster will likely have a user node pool and a system/agent node pool. Before you can install Azure Container Storage, you must update the user node pool label as described in this section. However, if your cluster consists of only a system node pool, which is the case with test/dev clusters created with the Azure portal, you'll need to first [add a new user node pool](../../aks/create-node-pools.md#add-a-node-pool) and then label it. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` is added to the agent/system nodepool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI.

```azurecli-interactive
az aks update --n <cluster-name> --g <resource-group-name> --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes to complete.
