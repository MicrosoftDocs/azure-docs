---

title: Use the Mariner container host on Azure Kubernetes Service (AKS)
description: Learn how to use the Mariner container host on Azure Kubernetes Service (AKS)
ms.topic: article
ms.custom: ignite-2022
ms.date: 04/19/2023
---

# Use the Mariner container host on Azure Kubernetes Service (AKS)

Mariner is an open-source Linux distribution created by Microsoft, and it’s now available for preview as a container host on Azure Kubernetes Service (AKS). The Mariner container host provides reliability and consistency from cloud to edge across the AKS, AKS-HCI, and Arc products. You can deploy Mariner node pools in a new cluster, add Mariner node pools to your existing Ubuntu clusters, or migrate your Ubuntu nodes to Mariner nodes. To learn more about Mariner, see the [Mariner documentation][mariner-doc].

## Why use Mariner

The Mariner container host on AKS uses a native AKS image that provides one place to do all Linux development. Every package is built from source and validated, ensuring your services run on proven components. Mariner is lightweight, only including the necessary set of packages needed to run container workloads. It provides a reduced attack surface and eliminates patching and maintenance of unnecessary packages. At Mariner's base layer, it has a Microsoft hardened kernel tuned for Azure. Learn more about the [key capabilities of Mariner][mariner-capabilities].

## How to use Mariner on AKS

To get started using Mariner on AKS, see:

* [Creating a cluster with Mariner][mariner-cluster-config]
* [Add a Mariner node pool to your existing cluster][mariner-node-pool]
* [Ubuntu to Mariner migration][ubuntu-to-mariner]

## How to upgrade Mariner nodes

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

Mariner is available for use in the same regions as AKS.

## Limitations

Mariner currently has the following limitations:

* Image SKUs for SGX and FIPS are not available. 
* It doesn't meet the [Federal Information Processing Standard (FIPS) 140](https://csrc.nist.gov/publications/detail/fips/140/3/final) compliance requirements and [Center for Internet Security (CIS)](https://www.cisecurity.org/) certification.
* Mariner can't yet be deployed through the Azure portal.
* Qualys, Trivy, and Microsoft Defender for Containers are the only vulnerability scanning tools that support Mariner today.
* Mariner doesn't support AppArmor. Support for SELinux can be manually configured.
* Some addons, extensions, and open-source integrations may not be supported yet on Mariner. Azure Monitor, Grafana, Helm, Key Vault, and Container Insights are supported.

<!-- LINKS - Internal -->
[mariner-doc]: https://microsoft.github.io/CBL-Mariner/docs/#cbl-mariner-linux
[mariner-capabilities]: https://microsoft.github.io/CBL-Mariner/docs/#key-capabilities-of-cbl-mariner-linux
[mariner-cluster-config]: cluster-configuration.md
[mariner-node-pool]: use-multiple-node-pools.md#add-a-mariner-node-pool
[ubuntu-to-mariner]: use-multiple-node-pools.md#migrate-ubuntu-nodes-to-mariner
[auto-upgrade-aks]: auto-upgrade-cluster.md
[kured]: node-updates-kured.md
