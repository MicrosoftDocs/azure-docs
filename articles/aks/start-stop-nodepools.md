---
title: Start and stop a node pool on Azure Kubernetes Service (AKS)
description: Learn how to start or stop a node pool on Azure Kubernetes Service (AKS).
ms.topic: article
ms.date: 04/25/2023
author: qpetraroia
ms.author: qpetraroia
---

# Start and stop an Azure Kubernetes Service (AKS) node pool

You might not need to continuously run your AKS workloads. For example, you might have a development cluster that has node pools running specific workloads. To optimize your compute costs, you can completely stop your node pools in your AKS cluster.

## Features and limitations

* You can't stop system pools.
* Spot node pools are supported.
* Stopped node pools can be upgraded.
* The cluster and node pool must be running.

## Before you begin

This article assumes you have an existing AKS cluster. If you need an AKS cluster, create one using the [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal].

## Stop an AKS node pool

1. Stop a running AKS node pool using the [`az aks nodepool stop`][az-aks-nodepool-stop] command.

    ```azurecli-interactive
    az aks nodepool stop --resource-group myResourceGroup --cluster-name myAKSCluster --nodepool-name testnodepool 
    ```

2. Verify your node pool stopped using the [`az aks nodepool show`][az-aks-nodepool-show] command.

    ```azurecli-interactive
    az aks nodepool show --resource-group myResourceGroup --cluster-name myAKSCluster --nodepool-name testnodepool
    ```

    The following condensed example output shows the `powerState` as `Stopped`:

    ```output
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
    > If the `provisioningState` shows `Stopping`, your node pool is still in the process of stopping.

---

## Start a stopped AKS node pool

1. Restart a stopped node pool using the [`az aks nodepool start`][az-aks-nodepool-start] command.

    ```azurecli-interactive
    az aks nodepool start --resource-group myResourceGroup --cluster-name myAKSCluster --nodepool-name testnodepool 
    ```

2. Verify your node pool started using the [`az aks nodepool show`][az-aks-nodepool-show] command.

    ```azurecli-interactive
    az aks nodepool show --resource-group myResourceGroup --cluster-name myAKSCluster --nodepool-name testnodepool
    ```

    The following condensed example output shows the `powerState` as `Running`:

    ```output
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
    > If the `provisioningState` shows `Starting`, your node pool is still in the process of starting.

---

## Next steps

* To learn how to scale `User` pools to 0, see [scale `User` pools to 0](scale-cluster.md#scale-user-node-pools-to-0).
* To learn how to stop your cluster, see [cluster start/stop](start-stop-cluster.md).
* To learn how to save costs using Spot instances, see [add a spot node pool to AKS](spot-node-pool.md).
* To learn more about the AKS support policies, see [AKS support policies](support-policies.md).

<!-- LINKS - internal -->
[aks-quickstart-cli]: ./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-portal]: ./learn/quick-kubernetes-deploy-portal.md
[aks-quickstart-powershell]: ./learn/quick-kubernetes-deploy-powershell.md
[az-aks-nodepool-stop]: /cli/azure/aks/nodepool#az_aks_nodepool_stop
[az-aks-nodepool-start]:/cli/azure/aks/nodepool#az_aks_nodepool_start
[az-aks-nodepool-show]: /cli/azure/aks/nodepool#az_aks_nodepool_show
