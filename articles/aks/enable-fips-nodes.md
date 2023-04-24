---
title: Enable Federal Information Process Standard (FIPS) for Azure Kubernetes Service (AKS) node pools
description: Learn how to enable Federal Information Process Standard (FIPS) for Azure Kubernetes Service (AKS) node pools.
author: rayoef
ms.author: rayoflores
ms.topic: how-to 
ms.date: 07/19/2022
ms.custom: template-how-to
---

# Enable Federal Information Process Standard (FIPS) for Azure Kubernetes Service (AKS) node pools

The Federal Information Processing Standard (FIPS) 140-2 is a US government standard that defines minimum security requirements for cryptographic modules in information technology products and systems. Azure Kubernetes Service (AKS) allows you to create Linux and Windows node pools with FIPS 140-2 enabled. Deployments running on FIPS-enabled node pools can use those cryptographic modules to provide increased security and help meet security controls as part of FedRAMP compliance. For more information on FIPS 140-2, see [Federal Information Processing Standard (FIPS) 140][fips].

## Prerequisites

You need the Azure CLI version 2.32.0 or later installed and configured. Run `az --version` to find the version. For more information about installing or upgrading the Azure CLI, see [Install Azure CLI][install-azure-cli].

FIPS-enabled node pools have the following limitations:

* FIPS-enabled node pools require Kubernetes version 1.19 and greater.
* To update the underlying packages or modules used for FIPS, you must use [Node Image Upgrade][node-image-upgrade].
* Container images on the FIPS nodes haven't been assessed for FIPS compliance.

> [!IMPORTANT]
> The FIPS-enabled Linux image is a different image than the default Linux image used for Linux-based node pools. To enable FIPS on a node pool, you must create a new Linux-based node pool. You can't enable FIPS on existing node pools.
> 
> FIPS-enabled node images may have different version numbers, such as kernel version, than images that are not FIPS-enabled. Also, the update cycle for FIPS-enabled node pools and node images may differ from node pools and images that are not FIPS-enabled.

## Create a FIPS-enabled Linux node pool

To create a FIPS-enabled Linux node pool, use the [az aks nodepool add][az-aks-nodepool-add] command with the `--enable-fips-image` parameter when creating a node pool.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name fipsnp \
    --enable-fips-image
```

> [!NOTE]
> You can also use the `--enable-fips-image` parameter with [az aks create][az-aks-create] when creating a cluster to enable FIPS on the default node pool. When adding node pools to a cluster created in this way, you still must use the `--enable-fips-image` parameter when adding node pools to create a FIPS-enabled node pool.

To verify your node pool is FIPS-enabled, use [az aks show][az-aks-show] to check the *enableFIPS* value in *agentPoolProfiles*.

```azurecli-interactive
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --query="agentPoolProfiles[].{Name:name enableFips:enableFips}" \
    -o table
```

The following example output shows the *fipsnp* node pool is FIPS-enabled and *nodepool1* isn't.

```output
Name       enableFips
---------  ------------
fipsnp     True
nodepool1  False  
```

You can also verify deployments have access to the FIPS cryptographic libraries using `kubectl debug` on a node in the FIPS-enabled node pool. Use `kubectl get nodes` to list the nodes:

```output
$ kubectl get nodes
NAME                                STATUS   ROLES   AGE     VERSION
aks-fipsnp-12345678-vmss000000      Ready    agent   6m4s    v1.19.9
aks-fipsnp-12345678-vmss000001      Ready    agent   5m21s   v1.19.9
aks-fipsnp-12345678-vmss000002      Ready    agent   6m8s    v1.19.9
aks-nodepool1-12345678-vmss000000   Ready    agent   34m     v1.19.9
```

In the above example, the nodes starting with `aks-fipsnp` are part of the FIPS-enabled node pool. Use `kubectl debug` to run a deployment with an interactive session on one of those nodes in the FIPS-enabled node pool.

```azurecli-interactive
kubectl debug node/aks-fipsnp-12345678-vmss000000 -it --image=mcr.microsoft.com/dotnet/runtime-deps:6.0
```

From the interactive session, you can verify the FIPS cryptographic libraries are enabled:

```output
root@aks-fipsnp-12345678-vmss000000:/# cat /proc/sys/crypto/fips_enabled
1
```

FIPS-enabled node pools also have a *kubernetes.azure.com/fips_enabled=true* label, which can be used by deployments to target those node pools.

## Create a FIPS-enabled Windows node pool

To create a FIPS-enabled Windows node pool, use the [az aks nodepool add][az-aks-nodepool-add] command with the `--enable-fips-image` parameter when creating a node pool. Unlike Linux-based node pools, Windows node pools share the same image set. 

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name fipsnp \
    --enable-fips-image \
    --os-type Windows
```

To verify your node pool is FIPS-enabled, use [az aks show][az-aks-show] to check the *enableFIPS* value in *agentPoolProfiles*.

```azurecli-interactive
az aks show \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --query="agentPoolProfiles[].{Name:name enableFips:enableFips}" \
    -o table
```

To verify Windows node pools have access to the FIPS cryptographic libraries, [create an RDP connection to a Windows node][aks-rdp] in a FIPS-enabled node pool and check the registry.

1. From the **Run** application, enter `regedit`.
1. Look for `HKEY_LOCAL_MACHINE\SYSTEM\CurrentControlSet\Control\Lsa\FIPSAlgorithmPolicy` in the registry.
1. If `Enabled` is set to 1, then FIPS is enabled.

:::image type="content" source="./media/enable-fips-nodes/enable-fips-nodes-windows.png" alt-text="Screenshot shows a picture of the registry editor to the FIPS Algorithm Policy, and it being enabled.":::

FIPS-enabled node pools also have a *kubernetes.azure.com/fips_enabled=true* label, which can be used by deployments to target those node pools.

## Next steps

To learn more about AKS security, see [Best practices for cluster security and upgrades in Azure Kubernetes Service (AKS)][aks-best-practices-security].

<!-- LINKS - Internal -->
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-show]: /cli/azure/aks#az_aks_show
[aks-best-practices-security]: operator-best-practices-cluster-security.md
[aks-rdp]: rdp.md
[fips]: /azure/compliance/offerings/offering-fips-140-2
[install-azure-cli]: /cli/azure/install-azure-cli
[node-image-upgrade]: node-image-upgrade.md