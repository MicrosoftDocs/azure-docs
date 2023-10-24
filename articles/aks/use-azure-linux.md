---

title: Use the Azure Linux container host on Azure Kubernetes Service (AKS)
description: Learn how to use the Azure Linux container host on Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: ignite-2022, build-2023
ms.date: 09/18/2023
---

# Use the Azure Linux container host for Azure Kubernetes Service (AKS)

The Azure Linux container host for AKS is an open-source Linux distribution created by Microsoft, and it’s available as a container host on Azure Kubernetes Service (AKS). The Azure Linux container host provides reliability and consistency from cloud to edge across the AKS, AKS-HCI, and Arc products. You can deploy Azure Linux node pools in a new cluster, add Azure Linux node pools to your existing Ubuntu clusters, or migrate your Ubuntu nodes to Azure Linux nodes. To learn more about Azure Linux, see the [Azure Linux documentation][azurelinux-doc].

## Why use Azure Linux

The Azure Linux container host on AKS uses a native AKS image that provides one place to do all Linux development. Every package is built from source and validated, ensuring your services run on proven components. Azure Linux is lightweight, only including the necessary set of packages needed to run container workloads. It provides a reduced attack surface and eliminates patching and maintenance of unnecessary packages. At the base layer, it has a Microsoft hardened kernel tuned for Azure. Learn more about the [key capabilities of Azure Linux][azurelinux-capabilities].

## How to use Azure Linux on AKS

> [!NOTE]
> The Azure Linux node pool is now generally available (GA). To learn about the benefits and deployment steps, see the [Introduction to the Azure Linux Container Host for AKS][azurelinuxdocumentation].

To get started using the Azure Linux container host for AKS, see:

* [Creating a cluster with Azure Linux][azurelinux-cluster-config]
* [Add an Azure Linux node pool to your existing cluster][azurelinux-node-pool]
* [Ubuntu to Azure Linux migration][ubuntu-to-azurelinux]
* [Azure Linux supported GPU SKUs](../azure-linux/intro-azure-linux.md#azure-linux-container-host-supported-gpu-skus)

## How to upgrade Azure Linux nodes

We recommend keeping your clusters up to date and secured by enabling automatic upgrades for your cluster. To enable automatic upgrades, see:

* [Automatically upgrade an Azure Kubernetes Service (AKS) cluster][auto-upgrade-aks]
* [Deploy kured in an AKS cluster][kured]

To manually upgrade the node-image on a cluster, you can run `az aks nodepool upgrade`:

```azurecli
az aks nodepool upgrade \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name myNodePool \
    --node-image-only
```

## Regional availability

The Azure Linux container host is available for use in the same regions as AKS.

## Next steps

To learn more about Azure Linux, see the [Azure Linux documentation][azurelinuxdocumentation].

<!-- LINKS - Internal -->
[azurelinux-doc]: https://microsoft.github.io/CBL-Mariner/docs/#cbl-mariner-linux
[azurelinux-capabilities]: ../azure-linux/intro-azure-linux.md#azure-linux-container-host-key-benefits
[azurelinux-cluster-config]: cluster-configuration.md#azure-linux-container-host-for-aks
[azurelinux-node-pool]: create-node-pools.md#add-an-azure-linux-node-pool
[ubuntu-to-azurelinux]: create-node-pools.md#migrate-ubuntu-nodes-to-azure-linux-nodes
[auto-upgrade-aks]: auto-upgrade-cluster.md
[kured]: node-updates-kured.md
[azurelinuxdocumentation]: ../azure-linux/intro-azure-linux.md
