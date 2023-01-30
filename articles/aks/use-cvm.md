---
title: Use Confidential Virtual Machines (CVM) in Azure Kubernetes Service (AKS)
description: Learn how to create Confidential Virtual Machines (CVM) node pools with Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.custom: ignite-2022
ms.date: 10/04/2022
---

# Use Confidential Virtual Machines (CVM) in Azure Kubernetes Service (AKS) cluster

You can use the generally available [confidential VM sizes (DCav5/ECav5)][cvm-announce] to add a node pool to your AKS cluster with CVM. Confidential VMs with AMD SEV-SNP support bring a new set of security features to protect data-in-use with full VM memory encryption. These features enable node pools with CVM to target the migration of highly sensitive container workloads to AKS without any code refactoring while benefiting from the features of AKS. The nodes in a node pool created with CVM use a customized Ubuntu 20.04 image specially configured for CVM. For more details on CVM, see [Confidential VM node pools support on AKS with AMD SEV-SNP confidential VMs][cvm].

Adding a node pool with CVM to your AKS cluster is currently in preview.


## Before you begin

- An Azure subscription. If you don't have an Azure subscription, you can create a [free account](https://azure.microsoft.com/free).
- [Azure CLI installed](/cli/azure/install-azure-cli).
- An existing AKS cluster in the *westus*, *eastus*, *westeurope*, or *northeurope* region.
- The [DCasv5 and DCadsv5-series][cvm-subs-dc] or [ECasv5 and ECadsv5-series][cvm-subs-ec] SKUs available for your subscription.

## Limitations

The following limitations apply when adding a node pool with CVM to AKS:

- You can't use `--enable-fips-image`, ARM64, or Mariner.
- You can't upgrade an existing node pool to use CVM.
- The [DCasv5 and DCadsv5-series][cvm-subs-dc] or [ECasv5 and ECadsv5-series][cvm-subs-ec] SKUs must be available for your subscription in the region where the cluster is created.

## Add a node pool with the CVM to AKS

To add a node pool with the CVM to AKS, use `az aks nodepool add` and set `node-vm-size` to `Standard_DCa4_v5`. For example:

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name cvmnodepool \
    --node-count 3 \
    --node-vm-size Standard_DC4as_v5 
```

## Verify the node pool uses CVM

To verify a node pool uses CVM, use `az aks nodepool show` and verify the `vmSize` is `Standard_DCa4_v5`. For example:

```azurecli-interactive
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name cvmnodepool \
    --query 'vmSize'
```

The following example command and output shows the node pool uses CVM:

```output
az aks nodepool show \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name cvmnodepool \
    --query 'vmSize'

"Standard_DC4as_v5"
```

## Remove a node pool with CVM from an AKS cluster

To remove a node pool with CVM from an AKS cluster, use `az aks nodepool delete`. For example:

```azurecli-interactive
az aks nodepool delete \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name cvmnodepool
```

## Next steps

In this article, you learned how to add a node pool with CVM to an AKS cluster. For more information about CVM, see [Confidential VM node pools support on AKS with AMD SEV-SNP confidential VMs][cvm].

<!-- LINKS - Internal -->
[cvm]: ../confidential-computing/confidential-node-pool-aks.md
[cvm-announce]: https://techcommunity.microsoft.com/t5/azure-confidential-computing/azure-confidential-vms-using-sev-snp-dcasv5-ecasv5-are-now/ba-p/3573747
[cvm-subs-dc]: ../virtual-machines/dcasv5-dcadsv5-series.md
[cvm-subs-ec]: ../virtual-machines/ecasv5-ecadsv5-series.md
