---
title: Use node taints in an Azure Kubernetes Service (AKS) cluster
description: Learn how to use taints in an Azure Kubernetes Service (AKS) cluster.
author: allyford
ms.author: schaffererin
ms.topic: article 
ms.date: 05/07/2024
# Customer intent: As a cluster operator, I want to learn how to use taints in an AKS cluster to ensure that pods are not scheduled onto inappropriate nodes.
---

# Use node taints in an Azure Kubernetes Service (AKS) cluster

This article describes how to use node taints in an Azure Kubernetes Service (AKS) cluster.

## Overview

The AKS scheduling mechanism is responsible for placing pods onto nodes and is based upon the upstream Kubernetes scheduler, [kube-scheduler](https://kubernetes.io/docs/concepts/scheduling-eviction/kube-scheduler/). You can constrain a pod to run on particular nodes by attaching the pods to a set of nodes using [node affinity](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity) or by instructing the node to repel a set of pods using [node taints](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/), which interact with the AKS scheduler.

Node taints work by marking a node so that the scheduler avoids placing certain pods on the marked nodes. You can place [tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/) on a pod to allow the scheduler to schedule that pod on a node with a matching taint. Taints and tolerations work together to help you control how the scheduler places pods onto nodes. For more information, see [example use cases of taints and tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases:~:text=not%20be%20evicted.-,Example%20Use%20Cases,-Taints%20and%20tolerations).

Taints are key-value pairs with an [effect](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/). There are three values for the effect field when using node taints: `NoExecute`, `NoSchedule`, and `PreferNoSchedule`.

* `NoExecute`: Pods already running on the node are immediately evicted if they don't have a matching toleration. If a pod has a matching toleration, it might be evicted if `tolerationSeconds` are specified.
* `NoSchedule`: Only pods with a matching toleration are placed on this node. Existing pods aren't evicted.
* `PreferNoSchedule`: The scheduler avoids placing any pods that don't have a matching toleration.

### Node taint options

There are two types of node taints that can be applied to your AKS nodes: **node taints** and **node initialization taints**.

* **Node taints** are meant to remain permanently on the node for scheduling pods with node affinity. Node taints can only be added, updated, or removed completely using the AKS API.
* **Node initialization taints** are placed on the node at boot time and are meant to be used temporarily, such as in scenarios where you might need extra time to set up your nodes. You can remove node initialization taint using the Kubernetes API and aren't guaranteed during the node lifecycle. They appear only after a node is scaled up or upgraded/reimaged. New nodes still have the node initialization taint after scaling. Node initialization taints appear on all nodes after upgrading. If you want to remove the initialization taints completely, you can remove them using the AKS API after untainting the nodes using the Kubernetes API. Once you remove the initialization taints from the cluster spec using the AKS API, newly created nodes don't come up with those initialization taints. If the initialization taint is still present on existing nodes, you can permanently remove it by performing a node image upgrade operation.

> [!NOTE]
>
> Node taints and labels applied using the AKS node pool API aren't modifiable from the Kubernetes API and vice versa. Modifications to system taints aren't allowed.
>
> This doesn't apply to node initialization taints.

## Use node taints

### Prerequisites

This article assumes you have an existing AKS cluster. If you need an AKS cluster, you can create one using [Azure CLI][aks-quickstart-cli], [Azure PowerShell][aks-quickstart-powershell], or the [Azure portal][aks-quickstart-portal]. 

### Create a node pool with a node taint

1. Create a node pool with a taint using the [`az aks nodepool add`][az-aks-nodepool-add] command and use the `--node-taints` parameter to specify `sku=gpu:NoSchedule` for the taint.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group $RESOURCE_GROUP_NAME \
        --cluster-name $CLUSTER_NAME \
        --name $NODE_POOL_NAME \
        --node-count 1 \
        --node-taints "sku=gpu:NoSchedule" \
        --no-wait
    ```

2. [Check the status of the node pool](#check-the-status-of-the-node-pool).
3. [Check that the taint is set on the node](#check-that-the-taint-is-set-on-the-node).

### Update a node pool to add a node taint

1. Update a node pool to add a node taint using the [`az aks nodepool update`][az-aks-nodepool-update] command and use the `--node-taints` parameter to specify `sku=gpu:NoSchedule` for the taint.

    ```azurecli-interactive
    az aks nodepool update \
        --resource-group $RESOURCE_GROUP_NAME \
        --cluster-name $CLUSTER_NAME \
        --name $NODE_POOL_NAME \
        --node-taints "sku=gpu:NoSchedule" \
        --no-wait
    ```

2. [Check the status of the node pool](#check-the-status-of-the-node-pool).
3. [Check that the taint has been set on the node](#check-that-the-taint-is-set-on-the-node).

## Use node initialization taints (preview)

[!INCLUDE [preview features callout](includes/preview/preview-callout.md)]

### Prerequisites and limitations

* You need the Azure CLI version `3.0.0b3` or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* You can only apply initialization taints via cluster create or upgrade when using the AKS API. If using ARM templates, you can specify node initialization taints during node pool creation and update.
* You can't apply initialization taints to Windows node pools using the Azure CLI.

### Get the credentials for your cluster

* Get the credentials for your AKS cluster using the [`az aks get-credentials`][az-aks-get-credentials] command.

    ```azurecli-interactive
    az aks get-credentials --resource-group $RESOURCE_GROUP_NAME --name $CLUSTER_NAME
    ```

### Install the `aks-preview` Azure CLI extension

* Register or update the aks-preview extension using the [`az extension add`][az-extension-add] or [`az extension update`][az-extension-update] command.

    ```azurecli-interactive
    # Register the aks-preview extension
    az extension add --name aks-preview

    # Update the aks-preview extension
    az extension update --name aks-preview
    ```

### Register the `NodeInitializationTaintsPreview` feature flag

1. Register the `NodeInitializationTaintsPreview` feature flag using the [`az feature register`][az-feature-register] command.

    ```azurecli-interactive
    az feature register --namespace "Microsoft.ContainerService" --name "NodeInitializationTaintsPreview"
    ```

    It takes a few minutes for the status to show *Registered*.

2. Verify the registration status using the [`az feature show`][az-feature-show] command.

    ```azurecli-interactive
    az feature show --namespace "Microsoft.ContainerService" --name "NodeInitializationTaintsPreview"
    ```

3. When the status reflects *Registered*, refresh the registration of the *Microsoft.ContainerService* resource provider using the [`az provider register`][az-provider-register] command.

    ```azurecli-interactive
    az provider register --namespace Microsoft.ContainerService
    ```

### Create a cluster with a node initialization taint

1. Create a cluster with a node initialization taint using the [`az aks create`][az-aks-create] command and the `--node-initialization-taints` parameter to specify `sku=gpu:NoSchedule` for the taint.

    > [!IMPORTANT]
    > The node initialization taints you specify apply to all of the node pools in the cluster. To apply the initialization taint to a specific node, you can use an ARM template instead of the CLI.

    ```azurecli-interactive
    az aks create \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-count 1 \
    --node-init-taints "sku=gpu:NoSchedule"
    ```

2. [Check the status of the node pool](#check-the-status-of-the-node-pool).
3. [Check that the taint is set on the node](#check-that-the-taint-is-set-on-the-node).

### Update a cluster to add a node initialization taint

1. Update a cluster to add a node initialization taint using the [`az aks update`][az-aks-update] command and the `--node-initialization-taints` parameter to specify `sku=gpu:NoSchedule` for the taint.

    > [!IMPORTANT]
    > When updating a cluster with a node initialization taint, the taints apply to all node pools in the cluster. You can view updates to node initialization taints on the node after a reimage operation.

    ```azurecli-interactive
    az aks update \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-init-taints "sku=gpu:NoSchedule"
    ```

2. [Check the status of the node pool](#check-the-status-of-the-node-pool).
3. [Check that the taint is set on the node](#check-that-the-taint-is-set-on-the-node).

## Check the status of the node pool

* After applying the node taint or initialization taint, check the status of the node pool using the [`az aks nodepool list`][az-aks-nodepool-list] command.

    ```azurecli-interactive
    az aks nodepool list --resource-group $RESOURCE_GROUP_NAME --cluster-name $CLUSTER_NAME
    ```

    If you applied node taints, the following example output shows that the `<node-pool-name>` node pool is `Creating` nodes with the specified `nodeTaints`:

    ```output
    [
      {
        ...
        "count": 1,
        ...
        "name": "<node-pool-name>",
        "orchestratorVersion": "1.15.7",
        ...
        "provisioningState": "Creating",
        ...
        "nodeTaints":  [
          "sku=gpu:NoSchedule"
        ],
        ...
      },
     ...
    ]
    ```

    If you applied node initialization taints, the following example output shows that the `<node-pool-name>` node pool is `Creating` nodes with the specified `nodeInitializationTaints`:

    ```output
    [
      {
        ...
        "count": 1,
        ...
        "name": "<node-pool-name>",
        "orchestratorVersion": "1.15.7",
        ...
        "provisioningState": "Creating",
        ...
        "nodeInitializationTaints":  [
          "sku=gpu:NoSchedule"
        ],
        ...
      },
     ...
    ]
    ```

## Check that the taint is set on the node

* Check the node taints and node initialization taints in the node configuration using the `kubectl describe node` command.

    ```bash
    kubectl describe node $NODE_NAME
    ```

    If you applied node taints, the following example output shows that the `<node-pool-name>` node pool has the specified `Taints`:

    ```output
    [
        ...
        Name: <node-pool-name>
        ...
        Taints: sku=gpu:NoSchedule
        ...
        ],
        ...
     ...
    ]
    ```

## Remove node taints

### Remove a specific node taint

* Remove node taints using the [`az aks nodepool update`][az-aks-nodepool-update] command. The following example command removes the `"sku=gpu:NoSchedule"` node taint from the node pool.

    ```azurecli-interactive
    az aks nodepool update \
    --cluster-name $CLUSTER_NAME \
    --name $NODE_POOL_NAME \
    --node-taints "sku=gpu:NoSchedule"
    ```

### Remove all node taints

* Remove all node taints from a node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command. The following example command removes all node taints from the node pool.

    ```azurecli-interactive
    az aks nodepool update \
    --cluster-name $CLUSTER_NAME \
    --name $NODE_POOL_NAME \
    --node-taints ""
    ```

## Remove node initialization taints

You have the following options to remove node initialization taints from the node:

* **Remove node initialization taints temporarily** using the Kubernetes API. If you remove them this way, the taints reappear after node scaling or upgrade occurs. New nodes still have the node initialization taint after scaling. Node initialization taints appear on all nodes after upgrading.
* **Remove node initialization taints permanently** by untainting the node using the Kubernetes API, and then removing the taint using the AKS API. Once the initialization taints are removed from cluster spec using AKS API, newly created nodes after reimage operations no longer have initialization taints.

When you remove all initialization taint occurrences from node pool replicas, the existing initialization taint might reappear after an upgrade with any new initialization taints.

### Remove node initialization taints temporarily

* Remove node initialization taints temporarily using the `kubectl taint nodes` command.

    This command removes the taint from only the specified node. If you want to remove the taint from every node in the node pool, you need to run the command for every node that you want the taint removed from.

    ```bash
    kubectl taint nodes $NODE_POOL_NAME sku=gpu:NoSchedule-
    ```

    Once removed, node initialization taints reappear after node scaling or upgrading occurs.

### Remove node initialization taints permanently

1. Follow steps in [Remove node initialization taints temporarily](#remove-node-initialization-taints-temporarily) to remove the node initialization taint using the Kubernetes API.
2. Remove the taint from the node using the AKS API using the [`az aks update`][az-aks-update] command.
    This command removes the node initialization taint from every node in the cluster.

    ```azurecli-interactive
    az aks update \
    --resource-group $RESOURCE_GROUP_NAME \
    --name $CLUSTER_NAME \
    --node-init-taints "sku=gpu:NoSchedule"
    ```

## Check that the taint has been removed from the node

* Check the node taints and node initialization taints in the node configuration using the `kubectl describe node` command.

    ```bash
    kubectl describe node $NODE_NAME
    ```

    If you removed a node taint, the following example output shows that the `<node-pool-name>` node pool doesn't have the removed taint under `Taints`:

    ```output
    [
        ...
        Name: <node-pool-name>
        ...
        Taints: 
        ...
        ],
        ...
     ...
    ]
    ```

## Next steps

* Learn more about example use cases for [taints and tolerations](https://kubernetes.io/docs/concepts/scheduling-eviction/taint-and-toleration/#example-use-cases:~:text=not%20be%20evicted.-,Example%20Use%20Cases,-Taints%20and%20tolerations).
* Learn more about [best practices for advanced AKS scheduler features](./operator-best-practices-advanced-scheduler.md).
* Learn more about Kubernetes labels in the [Kubernetes labels documentation][kubernetes-labels].

<!-- LINKS - external -->
[kubernetes-labels]: https://kubernetes.io/docs/concepts/overview/working-with-objects/labels/

<!-- LINKS - internal -->
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-nodepool-add]: /cli/azure/aks#az-aks-nodepool-add
[az-aks-nodepool-list]: /cli/azure/aks/nodepool#az-aks-nodepool-list
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[install-azure-cli]: /cli/azure/install-azure-cli
[aks-quickstart-cli]:./learn/quick-kubernetes-deploy-cli.md
[aks-quickstart-powershell]:./learn/quick-kubernetes-deploy-powershell.md
[aks-quickstart-portal]:./learn/quick-kubernetes-deploy-portal.md
[az-aks-get-credentials]: /cli/azure/aks#az-aks-get-credentials
[az-extension-add]: /cli/azure/extension#az-extension-add
[az-extension-update]: /cli/azure/extension#az-extension-update
[az-feature-register]: /cli/azure/feature#az-feature-register
[az-feature-show]: /cli/azure/feature#az-feature-show
[az-provider-register]: /cli/azure/provider#az-provider-register
[az-aks-update]: /cli/azure/aks#az-aks-update
