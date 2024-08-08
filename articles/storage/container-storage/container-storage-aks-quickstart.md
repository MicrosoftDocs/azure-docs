---
title: Quickstart for using Azure Container Storage with Azure Kubernetes Service
description: Connect to a Linux-based Azure Kubernetes Service (AKS) cluster, install Azure Container Storage, and create a storage pool.
author: khdownie
ms.service: azure-container-storage
ms.topic: quickstart
ms.date: 07/24/2024
ms.author: kendownie
ms.custom: devx-track-azurecli, ignite-2023-container-storage, linux-related-content
---

# Quickstart: Use Azure Container Storage with Azure Kubernetes Service

[Azure Container Storage](container-storage-introduction.md) is a cloud-based volume management, deployment, and orchestration service built natively for containers. This Quickstart shows you how to connect to a Linux-based [Azure Kubernetes Service (AKS)](/azure/aks/intro-kubernetes) cluster, install Azure Container Storage, and create a storage pool using Azure CLI.

> [!IMPORTANT]
> Azure Container Storage is now generally available (GA) beginning with version 1.1.0. The GA version is recommended for production workloads.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

- This article requires the latest version (2.35.0 or later) of the Azure CLI. See [How to install the Azure CLI](/cli/azure/install-azure-cli). If you're using the Bash environment in Azure Cloud Shell, the latest version is already installed. If you plan to run the commands locally instead of in Azure Cloud Shell, be sure to run them with administrative privileges. For more information, see [Get started with Azure Cloud Shell](/azure/cloud-shell/get-started).

- You'll need the Kubernetes command-line client, `kubectl`. It's already installed if you're using Azure Cloud Shell, or you can install it locally by running the `az aks install-cli` command.

- Check if your target region is supported in [Azure Container Storage regions](container-storage-introduction.md#regional-availability).

- If you haven't already created an AKS cluster, follow the instructions for [Installing an AKS Cluster](install-container-storage-aks.md).

## Getting started

- Take note of your Azure subscription ID. If you want to use Azure Elastic SAN as data storage, you'll need either an [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role assigned to the Azure subscription. Owner-level access allows you to install the Azure Container Storage extension, grants access to its storage resources, and gives you permission to configure your Azure Elastic SAN resource. Contributor-level access allows you to install the extension and grants access to its storage resources. If you're planning on using Azure Disks or Ephemeral Disk as data storage, you don't need special permissions on your subscription.

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

## Connect to the cluster

To connect to the cluster, use the Kubernetes command-line client, `kubectl`. It's already installed if you're using Azure Cloud Shell, or you can install it locally by running the `az aks install-cli` command.

1. Configure `kubectl` to connect to your cluster using the `az aks get-credentials` command. The following command:

    * Downloads credentials and configures the Kubernetes CLI to use them.
    * Uses `~/.kube/config`, the default location for the Kubernetes configuration file. You can specify a different location for your Kubernetes configuration file using the *--file* argument.

    ```azurecli-interactive
    az aks get-credentials --resource-group <resource-group> --name <cluster-name>
    ```

2. Verify the connection to your cluster using the `kubectl get` command. This command returns a list of the cluster nodes.

    ```azurecli-interactive
    kubectl get nodes
    ```

3. The following output example shows the nodes in your cluster. Make sure the status for all nodes shows *Ready*:

    ```output
    NAME                                STATUS   ROLES   AGE   VERSION
    aks-nodepool1-34832848-vmss000000   Ready    agent   80m   v1.25.6
    aks-nodepool1-34832848-vmss000001   Ready    agent   80m   v1.25.6
    aks-nodepool1-34832848-vmss000002   Ready    agent   80m   v1.25.6
    ```
    
    Take note of the name of your node pool. In this example, it would be **nodepool1**.
   
## Choose a data storage option for your storage pool

Before deploying Azure Container Storage, you'll need to decide which back-end storage option you want to use to create your storage pool and volumes. Three options are currently available:

- **Azure Elastic SAN**: Azure Elastic SAN is a good fit for general purpose databases, streaming and messaging services, CI/CD environments, and other tier 1/tier 2 workloads. Storage is provisioned on demand per created volume and volume snapshot. Multiple clusters can access a single SAN concurrently, however persistent volumes can only be attached by one consumer at a time.

- **Azure Disks**: Azure Disks are a good fit for databases such as MySQL, MongoDB, and PostgreSQL. Storage is provisioned per target container storage pool size and maximum volume size.

- **Ephemeral Disk**: This option uses local NVMe drives or temp SSD on the AKS cluster nodes. It's extremely latency sensitive (low sub-ms latency), so it's best for applications with no data durability requirement or with built-in data replication support such as Cassandra. AKS discovers the available ephemeral storage on AKS nodes and acquires the drives for volume deployment.

> [!NOTE]
> For Azure Elastic SAN and Azure Disks, Azure Container Storage will deploy the backing storage for you as part of the installation. You don't need to create your own Elastic SAN or Azure Disk. In order to use Elastic SAN, you'll need either an [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role on the Azure subscription.

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

## Ensure VM type for your cluster meets the following criteria

To use Azure Container Storage, you'll need a node pool of at least three Linux VMs. If you're using local NVMe for your storage pool, the node pool should contain a minimum of four Linux VMs. Each VM should have a minimum of four virtual CPUs (vCPUs). Azure Container Storage will consume one core for I/O processing on every VM the extension is deployed to.

Follow these guidelines when choosing a VM type for the cluster nodes. You must choose a VM type that supports [Azure premium storage](../../virtual-machines/premium-storage-performance.md).

- If you intend to use Azure Elastic SAN or Azure Disks as backing storage, choose a [general purpose VM type](../../virtual-machines/sizes-general.md) such as **standard_d4s_v5**.
- If you intend to use Ephemeral Disk with local NVMe, choose a [storage optimized VM type](../../virtual-machines/sizes-storage.md) such as **standard_l8s_v3**.
- If you intend to use Ephemeral Disk with temp SSD, choose a VM that has a temp SSD disk such as [Ev3 and Esv3-series](../../virtual-machines/ev3-esv3-series.md).

## Install Azure Container Storage on your AKS cluster

The installation command is different depending on whether you already have a preview instance of Azure Container Storage running on your AKS cluster, or if you're installing Azure Container Storage on the cluster for the first time.

### Upgrade a preview installation to GA

If you already have a preview instance of Azure Container Storage running on your cluster, we recommend updating to the latest generally available (GA) version by running the following command. If you're installing Azure Container Storage for the first time on the cluster, proceed instead to [Install Azure Container Storage and create a storage pool](#install-azure-container-storage-and-create-a-storage-pool). You can also [Install Azure Container Storage on specific node pools](#install-azure-container-storage-on-specific-node-pools).

```azurecli-interactive
az k8s-extension update --cluster-type managedClusters --cluster-name <cluster-name> --resource-group <resource-group> --name azurecontainerstorage --version 1.1.0 --auto-upgrade false --release-train stable
```

Remember to replace `<cluster-name>` and `<resource-group>` with your own values.

### Install Azure Container Storage and create a storage pool

Before installing, ensure that your AKS cluster meets the [VM requirements](#ensure-vm-type-for-your-cluster-meets-the-following-criteria).

Run the following command to install Azure Container Storage on the cluster and create a storage pool. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeralDisk`, or `elasticSan`. If you select `ephemeralDisk`, you can also specify `--storage-pool-option`, and the values can be `NVMe` or `Temp`.

Running this command will enable Azure Container Storage on the system node pool, which by default is named `nodepool1`\*. If you want to enable it on other node pools, see [Install Azure Container Storage on specific node pools](#install-azure-container-storage-on-specific-node-pools). If you want to specify additional parameters, see [Azure Container Storage storage pool parameters](container-storage-storage-pool-parameters.md).

\*If there are any existing node pools with the `acstor.azure.com/io-engine:acstor` label then Azure Container Storage will be installed there by default. Otherwise, it's installed on the system node pool.

> [!IMPORTANT]
> **If you created your AKS cluster using the Azure portal:** The cluster will likely have a user node pool and a system/agent node pool. However, if your cluster consists of only a system node pool, which is the case with test/dev clusters created with the Azure portal, you'll need to first [add a new user node pool](/azure/aks/create-node-pools#add-a-node-pool) and then label it. This is because when you create an AKS cluster using the Azure portal, a taint `CriticalAddOnsOnly` is added to the system/agent node pool, which blocks installation of Azure Container Storage on the system node pool. This taint isn't added when an AKS cluster is created using Azure CLI.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --enable-azure-container-storage <storage-pool-type>
```

The deployment will take 10-15 minutes. When it completes, you'll have an AKS cluster with Azure Container Storage installed, the components for your chosen storage pool type enabled, and a default storage pool. If you want to enable additional storage pool types to create additional storage pools, see [Enable additional storage pool types](#enable-additional-storage-pool-types).

> [!IMPORTANT]
> If you specified Azure Elastic SAN as backing storage for your storage pool and you don't have either [Azure Container Storage Owner](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-owner) role or [Azure Container Storage Contributor](../../role-based-access-control/built-in-roles/containers.md#azure-container-storage-contributor) role assigned to the Azure subscription, Azure Container Storage installation will fail and a storage pool won't be created. If you try to [enable Azure Elastic SAN as an additional storage pool type](#enable-additional-storage-pool-types) without either of these roles, your previous installation and storage pools will remain unaffected and an Elastic SAN storage pool wont be created.

### Install Azure Container Storage on specific node pools

If you want to install Azure Container Storage on specific node pools, follow these instructions. The node pools must contain at least three Linux VMs each. If you're using local NVMe for your storage pool, then the node pools must contain at least four Linux VMs each.

1. Run the following command to view the list of available node pools. Replace `<resource-group>` and `<cluster-name>` with your own values.
   
   ```azurecli-interactive
   az aks nodepool list --resource-group <resource-group> --cluster-name <cluster-name>
   ```
   
2. Run the following command to install Azure Container Storage on specific node pools. Replace `<cluster-name>` and `<resource-group>` with your own values. Replace `<storage-pool-type>` with `azureDisk`, `ephemeralDisk`, or `elasticSan`. If you select `ephemeralDisk`, you can also specify --storage-pool-option, and the values can be `NVMe` or `Temp`.
   
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

## Disable storage pool types

If you're no longer using a specific storage pool type and want to disable it to free up resources in your node pool, run the following command. Replace `<cluster-name>` and `<resource-group>` with your own values. For `<storage-pool-type>`, specify `azureDisk`, `ephemeralDisk`, or `elasticSan`.

```azurecli-interactive
az aks update -n <cluster-name> -g <resource-group> --disable-azure-container-storage <storage-pool-type>
```

> [!NOTE]
> If you have an existing storage pool of the type that you're trying to disable, the storage pool type won't be disabled.

## Next step

To create volumes, select the link for the backing storage type you selected.

- [Create persistent volume with Azure managed disks](use-container-storage-with-managed-disks.md#3-create-a-persistent-volume-claim)
- [Create persistent volume with Azure Elastic SAN](use-container-storage-with-elastic-san.md#3-create-a-persistent-volume-claim)
- [Create generic ephemeral volume with local NVMe](use-container-storage-with-local-disk.md#create-and-attach-generic-ephemeral-volumes)
- [Create generic ephemeral volume with temp SSD](use-container-storage-with-temp-ssd.md#create-and-attach-generic-ephemeral-volumes)
- [Create persistent volume with local NVMe and volume replication](use-container-storage-with-local-nvme-replication.md#create-and-attach-persistent-volumes)
