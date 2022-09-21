---
title: Start and stop a node pool on Azure Kubernetes Service (AKS)
description: Learn how to start or stop a node pool on Azure Kubernetes Service (AKS).
services: container-service
ms.topic: article
ms.date: 10/25/2021
author: qpetraroia
ms.author: qpetraroia
---

# Start and stop an Azure Kubernetes Service (AKS) node pool

Your AKS workloads may not need to run continuously, for example a development cluster that has node pools running specific workloads. To optimize your costs, you can completely turn off (stop) your node pools in your AKS cluster, allowing you to save on compute costs.

## Before you begin

This article assumes that you have an existing AKS cluster. If you need an AKS cluster, see the AKS quickstart [using the Azure CLI][aks-quickstart-cli], [using Azure PowerShell][aks-quickstart-powershell], or [using the Azure portal][aks-quickstart-portal].

## Stop an AKS node pool

> [!IMPORTANT]
> When using node pool start/stop, the following is expected behavior:
>
> * You can't stop system pools.
> * Spot node pools are supported.
> * Stopped node pools can be upgraded.
> * The cluster and node pool must be running.

Use `az aks nodepool stop` to stop a running AKS node pool. The following example stops the *testnodepool* node pool:

```azurecli-interactive
az aks nodepool stop --nodepool-name testnodepool --resource-group myResourceGroup --cluster-name myAKSCluster
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

> [!NOTE]
> If the `provisioningState` shows `Stopping`, your node pool hasn't fully stopped yet.

## Start a stopped AKS node pool

Use `az aks nodepool start` to start a stopped AKS node pool. The following example starts the stopped node pool named *testnodepool*:

```azurecli-interactive
az aks nodepool start --nodepool-name testnodepool --resource-group myResourceGroup --cluster-name myAKSCluster
```

You can verify your node pool has started using [az aks show][az-aks-show] and confirming the `powerState` shows `Running`. For example:

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

> [!NOTE]
> If the `provisioningState` shows `Starting`, your node pool hasn't fully started yet.

---

## Next steps

- To learn how to scale `User` pools to 0, see [Scale `User` pools to 0](scale-cluster.md#scale-user-node-pools-to-0).
- To learn how to stop your cluster, see [Cluster start/stop](start-stop-cluster.md).
- To learn how to save costs using Spot instances, see [Add a spot node pool to AKS](spot-node-pool.md).
- To learn more about the AKS support policies, see [AKS support policies](support-policies.md).

<!-- LINKS - external -->

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
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