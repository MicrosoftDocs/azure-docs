---
title: Kubernetes on Azure - Cluster Autoscaler
description: Learn how to use the cluster autoscaler with Azure Kubernetes Service (AKS) to automatically scale your cluster to meet demand.
services: container-service
author: sakthivetrivel
manager: jeconnoc

ms.service: container-service
ms.topic: article
ms.date: 07/19/18
ms.author: sakthivetrivel
ms.custom: mvc
---

# Cluster Autoscaler on Azure Kubernetes Service (AKS) - Preview

Azure Kubernetes Service (AKS) provides a flexible solution to deploy a managed Kubernetes cluster in Azure. As resource demands increase, the cluster autoscaler allows your cluster to grow to meet that demand based on constraints you set. The cluster autoscaler (CA) does this by scaling your agent nodes based on pending pods. It scans the cluster periodically to check for pending pods or empty nodes and increases the size if possible. By default, the CA scans for pending pods every 10 seconds and removes a node if it's unneeded for more than 10 minutes. When used with the [horizontal pod autoscaler](https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/)  (HPA), the HPA will update pod replicas and resources as per demand. If there are not enough nodes or unneeded nodes following this pod scaling, the CA will respond and schedule the pods on the new set of nodes.

## Enable autoscaling

To enable cluster autoscaling while creating a cluster, use the --enable-autoscaling flag:

[comment]: <> (Since we need kubernetes version 1.10.x and rbac-enabled to enable autoscaling, we should also automatically set those flags when we see --enable-autoscaling flag set)

``` azurecli
az aks create --name myAKSCluster --resource-group myResourceGroup --enable-autoscaling --min-nodes 1 --max-nodes 5
```

To enable autoscaling on an existing cluster, use the autoscale command

``` azurecli
az aks autoscale-nodes --name myAKSCluster --resource-group myResourceGroup --min-nodes 1 --max-nodes 5
```

[comment]: <> (If enabling autoscaling on an existing cluster, we should make sure the number of nodes currently on the cluster is within the range set for the cluster autoscaler when validating the command)

## Next steps

To use the cluster autoscaler with the horizontal pod autoscaler, check out [Scaling Kubernetes application and infrastructure][aks-tutorial-scale].

Learn more about deploying and managing AKS with the AKS tutorials.

> [!div class="nextstepaction"]
> [AKS Tutorial][aks-tutorial-prepare-app]

<!-- LINKS - internal -->
[aks-quick-start]: ./kubernetes-walkthrough.md
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[aks-tutorial-scale]: ./tutorial-kubernetes-scale.md
[aks-upgrade]: ./upgrade-cluster.md

<!-- LINKS - external -->
[cluster-autoscale]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md
