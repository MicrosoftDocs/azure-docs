---
title: Quickstart for using Azure Container Storage Preview with Azure Kubernetes Service (AKS)
description: Create a Linux-based Azure Kubernetes Service (AKS) cluster, install Azure Container Storage, and create a storage pool.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 11/06/2023
ms.author: kendownie
ms.custom: devx-track-azurecli
---

# Quickstart: Use Azure Container Storage Preview with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to create a Linux-based [Azure Kubernetes Service (AKS)](../../aks/intro-kubernetes.md) cluster, install Azure Container Storage, and create a storage pool using Azure CLI.

## Prerequisites

[!INCLUDE [container-storage-prerequisites](../../../includes/container-storage-prerequisites.md)]

## Getting started

- Take note of your Azure subscription ID. We recommend using a subscription on which you have a [Kubernetes contributor](../../role-based-access-control/built-in-roles.md#kubernetes-extension-contributor) role if you want to use Azure Disks or Ephemeral Disk as data storage. If you want to use Azure Elastic SAN Preview as data storage, you'll need an [Owner](../../role-based-access-control/built-in-roles.md#owner) role on the Azure subscription.

- [Launch Azure Cloud Shell](https://shell.azure.com), or if you're using a local installation, sign in to the Azure CLI by using the [az login](/cli/azure/reference-index#az-login) command.

- If you're using Azure Cloud Shell, you might be prompted to mount storage. Select the Azure subscription where you want to create the storage account and select **Create**.

## Install the required extensions

Upgrade to the latest version of the `aks-preview` cli extension by running the following command.

```azurecli-interactive
az extension add --upgrade --name aks-preview
```

Add or upgrade to the latest version of `k8s-extension` by running the following command.

```azurecli-interactive
az extension add --upgrade --name k8s-extension
```

## Set subscription context

Set your Azure subscription context using the `az account set` command. You can view the subscription IDs for all the subscriptions you have access to by running the `az account list --output table` command. Remember to replace `<subscription-id>` with your subscription ID.

```azurecli-interactive
az account set --subscription <subscription-id>
```

## Register resource providers

The `Microsoft.ContainerService` and `Microsoft.KubernetesConfiguration` resource providers must be registered on your Azure subscription. To register these providers, run the following commands:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService --wait 
az provider register --namespace Microsoft.KubernetesConfiguration --wait 
```

## Create a resource group

An Azure resource group is a logical group that holds your Azure resources that you want to manage as a group. If you already have a resource group you want to use, you can skip this section.

When you create a resource group, you're prompted to specify a location. This location is:

* The storage location of your resource group metadata.
* Where your resources will run in Azure if you don't specify another region during resource creation.

Create a resource group using the `az group create` command. Replace `<resource-group-name>` with the name of the resource group you want to create, and replace `<location>` with an Azure region such as *eastus*, *westus2*, *westus3*, or *westeurope*. See this [list of Azure regions](container-storage-introduction.md#regional-availability) where Azure Container Storage is available.

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

## Choose a data storage option for your storage pool

Before deploying Azure Container Storage, you'll need to decide which back-end storage option you want to use to create your storage pool and persistent volumes. Three options are currently available:

- **Azure Elastic SAN Preview**: Azure Elastic SAN preview is a good fit for general purpose databases, streaming and messaging services, CI/CD environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

- **Azure Disks**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

- **Ephemeral Disk**: This option uses local NVMe drives on the AKS cluster nodes and is extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment. 

You'll specify the storage pool type when you install Azure Container Storage.

> [!NOTE]
> For Azure Elastic SAN Preview and Azure Disks, Azure Container Storage will deploy the backing storage for you as part of the installation. You don't need to create your own Elastic SAN or Azure Disk.  

## Choose a VM type for your cluster

If you intend to use Azure Elastic SAN Preview or Azure Disks as backing storage, then you should choose a [general purpose VM type](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5** for the cluster nodes. If you intend to use Ephemeral Disk, choose a [storage optimized VM type](../../virtual-machines/sizes-storage.md) with NVMe drives such as **standard_l8s_v3**. In order to use Ephemeral Disk, the VMs must have NVMe drives. You'll specify the VM type when you create the cluster in the next section.

> [!IMPORTANT]
> You must choose a VM type that supports [Azure premium storage](../../virtual-machines/premium-storage-performance.md). Each VM should have a minimum of four virtual CPUs (vCPUs). Azure Container Storage will consume one core for I/O processing on every VM the extension is deployed to.

## Create a new AKS cluster and install Azure Container Storage

If you already have an AKS cluster deployed, skip this section and go to [Install Azure Container Storage on an existing AKS cluster](#install-azure-container-storage-on-an-existing-aks-cluster).

Run the following command to create a new AKS cluster, install Azure Container Storage, and create a storage pool. Replace `<cluster-name>` and `<resource-group-name>` with your own values, and specify which VM type you want to use. You'll need a node pool of at least three Linux VMs. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

Optional storage pool parameters:

| **Parameter**      | **Default** |
|----------------|-------------|
| --storage-pool-name | mypool-<random 7 char lowercase> |
| --storage-pool-size | 512Gi (1Ti for Elastic SAN) |
| --storage-pool-sku | Premium_LRS |
| --storage-pool-option | NVMe |

```azurecli-interactive
az aks create -n <cluster-name> -g <resource-group-name> --node-vm-size Standard_D4s_v3 --node-count 3 --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes to complete.

## Display available storage pools

To get the list of available storage pools, run the following command:

```azurecli-interactive
kubectl get sp –n acstor
```

> [!IMPORTANT]
> If you specified Azure Elastic SAN Preview as backing storage for your storage pool and you don't have owner-level access to the Azure subscription, only Azure Container Storage will be installed and a storage pool won't be created. In this case, you'll have to [create an Elastic SAN storage pool manually](use-container-storage-with-elastic-san.md).

## Install Azure Container Storage on an existing AKS cluster

If you already have an AKS cluster that meets the [VM requirements](#choose-a-vm-type-for-your-cluster), run the following command to install Azure Container Storage on the cluster and create a storage pool. Replace `<cluster-name>` and `<resource-group-name>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.

Running this command will enable Azure Container Storage on a node pool named `nodepool1`, which is the default node pool name. If you want to install it on other node pools, see [Install Azure Container Storage on specific node pools](#install-azure-container-storage-on-specific-node-pools).

> [!IMPORTANT]
> **If you created your AKS cluster using the Azure portal:** The cluster will likely have a user node pool and a system/agent node pool. However, if your cluster consists of only a system node pool, which is the case with test/dev clusters created with the Azure portal, you'll need to first [add a new user node pool](../../aks/create-node-pools.md#add-a-node-pool) and then label it. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` is added to the system/agent nodepool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group-name> --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes to complete.

### Install Azure Container Storage on specific node pools

If you want to install Azure Container Storage on specific node pools, follow these instructions. The node pools must contain at least three Linux VMs each.

1. Run the following command to view the list of available node pools. Replace `<resource-group-name>` and `<cluster-name>` with your own values.
   
   ```azurecli-interactive
   az aks nodepool list --resource-group <resource-group-name> --cluster-name <cluster-name>
   ```
   
2. Run the following command to install Azure Container Storage on specific node pools. Replace `<cluster-name>` and `<resource-group-name>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeraldisk`, or `elasticSan`.
   
   ```azurecli-interactive
   az aks update -n <cluster-name> -g <resource-group-name> --enable-azure-container-storage <storage-pool-type> --azure-container-storage-nodepools <comma separated values of nodepool names> 
   ```

## Next steps

To create persistent volumes, select the link for the backing storage type you selected.

- [Create persistent volume claim with Azure managed disks](use-container-storage-with-managed-disks.md#create-a-persistent-volume-claim)
- [Create persistent volume claim with Ephemeral Disk](use-container-storage-with-local-disk.md#create-a-persistent-volume-claim)
- [Create persistent volume claim with Azure Elastic SAN Preview](use-container-storage-with-elastic-san.md#create-a-persistent-volume-claim)
