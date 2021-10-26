---
title: Start and Stop a node pool on Azure Kubernetes Service (AKS)
description: Learn how to start or stop a node pool on Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 10/25/2021
author: qpetraroia
ms.author: qpetraroia
---

# Start and Stop an Azure Kubernetes Service (AKS) node pool

Your AKS workloads may not need to run continuously, for example a development cluster that has node pools running specific workloads. To optimize your costs, you can completely turn off (stop) your node pools in your AKS cluster, allowing you to save on compute costs.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][kubernetes-walkthrough-powershell], or [using the Azure portal][aks-quickstart-portal].

### Install aks-preview CLI extension

You also need the *aks-preview* Azure CLI extension. Install the *aks-preview* Azure CLI extension by using the [az extension add][az-extension-add] command. Or install any available updates by using the [az extension update][az-extension-update] command.

```azurecli-interactive
# Install the aks-preview extension
az extension add --name aks-preview

# Update the extension to make sure you have the latest version installed
az extension update --name aks-preview

# Register `node pool start/stop` for use
az feature register --namespace "Microsoft.ContainerService" --name "PreviewStartStopAgentPool"
```

> [!NOTE]
> When using node pool start/stop, the following is expected behavior:
>
> * You can not stop system pools.
> * spot node pools are supported.
> * Stopped node pools can be upgraded.

## Stop an AKS node pool

### [Azure CLI](#tab/azure-cli)

You can use the `az aks nodepool stop` command to stop a running AKS node pool. To properly stop a node pool, you must make sure that the cluster is currently running and you are not stopping a system pool. The following example stops a cluster named *testnodepool*:

```azurecli-interactive
az aks nodepool stop --nodepool-name testnodepool -resource-group myResourceGroup --cluster-name myAKSCluster
```

You can verify when your node pool is stopped by using the [az aks show][az-aks-show] command and confirming the `powerState` shows as `Stopped` as on the below output:

```json
{
[...]
 "osType": "Linux",
    "podSubnetId": null,
    "powerState": {
        "code": "Stopped"
        },
    "provisioningState": "Succeeded",
    "proximityPlacementGroupId": null,
[...]
}
```

If the `provisioningState` shows `Stopping` that means your node pool hasn't fully stopped yet.

## Start an AKS node pool

### [Azure CLI](#tab/azure-cli)

You can use the `az aks nodepool start` command to start a stopped AKS node pool. The following example starts a node pool named *testnodepool*:

```azurecli-interactive
az aks nodepool start --nodepool-name testnodepool -resource-group myResourceGroup --cluster-name myAKSCluster
```

You can verify when your node pool has started by using the [az aks show][az-aks-show] command and confirming the `powerState` shows `Running` as on the below output:

```json
{
[...]
 "osType": "Linux",
    "podSubnetId": null,
    "powerState": {
        "code": "Running"
        },
    "provisioningState": "Succeeded",
    "proximityPlacementGroupId": null,
[...]
}
```

If the `provisioningState` shows `Starting` that means your node pool hasn't fully started yet.

---

## Next steps

- To learn how to scale `User` pools to 0, see [Scale `User` pools to 0](scale-cluster.md#scale-user-node-pools-to-0).
- To learn how to stop your cluster, see [Cluster start/stop](start-stop-cluster.md).
- To learn how to save costs using Spot instances, see [Add a spot node pool to AKS](spot-node-pool.md).
- To learn more about the AKS support policies, see [AKS support policies](support-policies.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[aks-quickstart-cli]: kubernetes-walkthrough.md
[aks-quickstart-portal]: kubernetes-walkthrough-portal.md
[install-azure-cli]: /cli/azure/install-azure-cli
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-provider-register]: /cli/azure/provider#az_provider_register
[az-aks-show]: /cli/azure/aks#az_aks_show
[kubernetes-walkthrough-powershell]: kubernetes-walkthrough-powershell.md
[stop-azakscluster]: /powershell/module/az.aks/stop-azakscluster
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[start-azakscluster]: /powershell/module/az.aks/start-azakscluster