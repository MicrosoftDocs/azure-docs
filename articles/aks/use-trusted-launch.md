---
title: Trusted launch (preview) with Azure Kubernetes Service (AKS)
description: Learn how trusted launch (preview) protects the Azure Kubernetes Cluster (AKS) nodes against boot kits, rootkits, and kernel-level malware. 
ms.topic: article
ms.date: 03/10/2023

---

# Trusted launch (preview) for Azure Kubernetes Service (AKS)

[Trusted launch][trusted-launch-overview] (preview) improves the security of generation 2 VMs by protecting against advanced and persistent attack techniques. It enables administrators to deploy AKS nodes, which contain the underlying virtual machines, with verified and signed bootloaders, OS kernels, and drivers. By leveraging secure and measured boot, administrators gain insights and confidence of the entire boot chain's integrity.

With trusted launch available in AKS, sensitive workloads which had trouble deploying on an AKS cluster, can now deploy on it because of the boot integrity trusted launch provides.

This article helps you understand this new feature, and how to implement it.

## Prerequisites

- The Azure CLI version 2.44.1 or later. Run `az --version` to find the version, and run `az upgrade` to upgrade the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].

- The `aks-preview` Azure CLI extension version 0.5.123 or later <Need to call this out or not?>.

- Register the `xxx` feature in your Azure subscription <Need to specify a feature flag or not?>. 

- AKS supports trusted launch (preview) on version 1.25.2 and higher.

## Limitations

- Windows Server 2019 and higher cluster nodes are not supported.

## Deploy new cluster

Perform the following steps to deploy an AKS Mariner cluster using the Azure CLI.

1. Create an AKS cluster using the [az aks create][az-aks-create] command and specifying the following parameters:

   * **--name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--resource-group**: Enter the name of an existing resource group to create the AKS cluster in.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.

   The following example creates a cluster named *myAKSCluster* with one node in the *myResourceGroup*:

    ```azurecli
    az aks create --name myAKSCluster --resource-group myResourceGroup --enable-secure-boot

2. Run the following command to get access credentials for the Kubernetes cluster. Use the [az aks get-credentials][aks-get-credentials] command and replace the values for the cluster name and the resource group name.

    ```azurecli
    az aks get-credentials --resource-group myResourceGroup --name myAKSCluster
    ```

## Update cluster and enable Secure Boot

Use the following command to enable Secure Boot by updating a node pool.

1. Add a node pool to your AKS cluster using the [az aks nodepool update][az-aks-nodepool-update] command. Specify the following parameters:

   * **--resource-group**: Enter the name of an existing resource group hosting your existing AKS cluster.
   * **--cluster-name**: Enter a unique name for the AKS cluster, such as *myAKSCluster*.
   * **--name**: Enter a unique name for your clusters node pool, such as *nodepool2*.
   * **--enable-secure-boot**: Enables Secure Boot to authenticate that the image was signed by a trusted publisher.

   The following example updates a node pool on the *myAKSCluster* in the *myResourceGroup* and enables Secure Boot:

```azurecli
az aks nodepool update --cluster-name myCluster --resource-group myResourceGroup --name mynodepool --enable-secure-boot 
```

<!-- EXTERNAL LINKS -->

<!-- INTERNAL LINKS -->
[trusted-launch-overview]: ../virtual-machines/trusted-launch.md
