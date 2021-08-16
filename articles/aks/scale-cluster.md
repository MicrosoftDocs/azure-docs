---
title: Scale an Azure Kubernetes Service (AKS) cluster
description: Learn how to scale the number of nodes in an Azure Kubernetes Service (AKS) cluster.
services: container-service
ms.topic: article
ms.date: 09/16/2020
---

# Scale the node count in an Azure Kubernetes Service (AKS) cluster

If the resource needs of your applications change, you can manually scale an AKS cluster to run a different number of nodes. When you scale down, nodes are carefully [cordoned and drained][kubernetes-drain] to minimize disruption to running applications. When you scale up, AKS waits until nodes are marked `Ready` by the Kubernetes cluster before pods are scheduled on them.

## Scale the cluster nodes

First, get the *name* of your node pool using the [az aks show][az-aks-show] command. The following example gets the node pool name for the cluster named *myAKSCluster* in the *myResourceGroup* resource group:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --query agentPoolProfiles
```

The following example output shows that the *name* is *nodepool1*:

```output
[
  {
    "count": 1,
    "maxPods": 110,
    "name": "nodepool1",
    "osDiskSizeGb": 30,
    "osType": "Linux",
    "storageProfile": "ManagedDisks",
    "vmSize": "Standard_DS2_v2"
  }
]
```

Use the [az aks scale][az-aks-scale] command to scale the cluster nodes. The following example scales a cluster named *myAKSCluster* to a single node. Provide your own `--nodepool-name` from the previous command, such as *nodepool1*:

```azurecli-interactive
az aks scale --resource-group myResourceGroup --name myAKSCluster --node-count 1 --nodepool-name <your node pool name>
```

The following example output shows the cluster has successfully scaled to one node, as shown in the *agentPoolProfiles* section:

```json
{
  "aadProfile": null,
  "addonProfiles": null,
  "agentPoolProfiles": [
    {
      "count": 1,
      "maxPods": 110,
      "name": "nodepool1",
      "osDiskSizeGb": 30,
      "osType": "Linux",
      "storageProfile": "ManagedDisks",
      "vmSize": "Standard_DS2_v2",
      "vnetSubnetId": null
    }
  ],
  [...]
}
```


## Scale `User` node pools to 0

Unlike `System` node pools that always require running nodes, `User` node pools allow you to scale to 0. To learn more on the differences between system and user node pools, see [System and user node pools](use-system-pools.md).

To scale a user pool to 0, you can use the [az aks nodepool scale][az-aks-nodepool-scale] in alternative to the above `az aks scale` command, and set 0 as your node count.


```azurecli-interactive
az aks nodepool scale --name <your node pool name> --cluster-name myAKSCluster --resource-group myResourceGroup  --node-count 0 
```

You can also autoscale `User` node pools to 0 nodes, by setting the `--min-count` parameter of the [Cluster Autoscaler](cluster-autoscaler.md) to 0.

## Next steps

In this article, you manually scaled an AKS cluster to increase or decrease the number of nodes. You can also use the [cluster autoscaler][cluster-autoscaler] to automatically scale your cluster.

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-tutorial]: ./tutorial-kubernetes-prepare-app.md
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-aks-scale]: /cli/azure/aks#az_aks_scale
[cluster-autoscaler]: cluster-autoscaler.md
[az-aks-nodepool-scale]: /cli/azure/aks/nodepool#az_aks_nodepool_scale