---
title: Use Azure tags in Azure Kubernetes Service (AKS)
description: Learn how to use Azure provider tags to track resources in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 06/16/2023
---

# Use Azure tags in Azure Kubernetes Service (AKS)

With Azure Kubernetes Service (AKS), you can set Azure tags on an AKS cluster and its related resources using Azure Resource Manager and the Azure CLI. You can also use Kubernetes manifests to set Azure tags for certain resources. Azure tags are a useful tracking resource for certain business processes, such as *chargeback*.

This article explains how to set Azure tags for AKS clusters and related resources.

## Before you begin

Review the following information before you begin:

* Tags set on an AKS cluster apply to all resources related to the cluster, but not the node pools. This operation overwrites the values of existing keys.
* Tags set on a node pool apply only to resources related to that node pool. This operation overwrites the values of existing keys. Resources outside that node pool, including resources for the rest of the cluster and other node pools, are unaffected.
* Public IPs, files, and disks can have tags set by Kubernetes through a Kubernetes manifest. Tags set in this way maintain the Kubernetes values, even if you update them later using a different method. When you remove public IPs, files, or disks through Kubernetes, any tags set by Kubernetes are removed. The tags on those resources that Kubernetes doesn't track remain unaffected.

### Prerequisites

* The Azure CLI version 2.0.59 or later. To find your version, run `az --version`. If you need to install it or update your version, see [Install Azure CLI][install-azure-cli].
* Kubernetes version 1.20 or later.

### Limitations

* Azure tags have keys that are case-insensitive for operations, such as when you're retrieving a tag by searching the key. In this case, a tag with the specified key is updated or retrieved regardless of casing. Tag values are case-sensitive.
* In AKS, if multiple tags are set with identical keys but different casing, the tags are used in alphabetical order. For example, `{"Key1": "val1", "kEy1": "val2", "key1": "val3"}` results in `Key1` and `val1` being set.
* For shared resources, tags can't determine the split in resource usage on their own.

## Azure tags and AKS clusters

When you create or update an AKS cluster with the `--tags` parameter, the following are assigned the Azure tags that you specified:

* The AKS cluster itself and its related resources:
  * Route table
  * Public IP
  * Load balancer
  * Network security group
  * Virtual network
  * AKS-managed kubelet msi
  * AKS-managed add-on msi
  * Private DNS zone associated with the *private cluster*
  * Private endpoint associated with the *private cluster*
* The node resource group

> [!NOTE]
> Azure Private DNS only supports 15 tags. For more information, see the [tag resources](../azure-resource-manager/management/tag-resources.md).

## Create or update tags on an AKS cluster

### Create a new AKS cluster

> [!IMPORTANT]
> If you're using existing resources when you create a new cluster, such as an IP address or route table, the `az aks create` command overwrites the set of tags. If you delete the cluster later, any tags set by the cluster are removed.

1. Create a cluster and assign Azure tags using the [`az aks create`][az-aks-create] command with the `--tags` parameter.

    > [!NOTE]
    > To set tags on the initial node pool, the virtual machine scale set, and each virtual machine scale set instance associated with the initial node pool, you can also set the `--nodepool-tags` parameter.

    ```azurecli-interactive
    az aks create \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --tags dept=IT costcenter=9999 \
        --generate-ssh-keys
    ```

2. Verify the tags have been applied to the cluster and its related resources using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show -g myResourceGroup -n myAKSCluster --query '[tags]'
    ```

    The following example output shows the tags applied to the cluster:

    ```output
    {
      "clusterTags": {
        "dept": "IT",
        "costcenter": "9999"
      }
    }
    ```

### Update an existing AKS cluster

> [!IMPORTANT]
> Setting tags on a cluster using the `az aks update` command overwrites the set of tags. For example, if your cluster has the tags *dept=IT* and *costcenter=9999*, and you use `az aks update` with the tags *team=alpha* and *costcenter=1234*, the new list of tags would be *team=alpha* and *costcenter=1234*.

1. Update the tags on an existing cluster using the [`az aks update`][az-aks-update] command with the `--tags` parameter.

    ```azurecli-interactive
    az aks update \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --tags team=alpha costcenter=1234
    ```

2. Verify the tags have been applied to the cluster and its related resources using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show -g myResourceGroup -n myAKSCluster --query '[tags]'
    ```

    The following example output shows the tags applied to the cluster:

    ```output
    {
      "clusterTags": {
        "team": "alpha",
        "costcenter": "1234"
      }
    }
    ```

## Add tags to node pools

You can apply an Azure tag to a new or existing node pool in your AKS cluster. Tags applied to a node pool are applied to each node within the node pool and are persisted through upgrades. Tags are also applied to new nodes that are added to a node pool during scale-out operations. Adding a tag can help with tasks such as policy tracking or cost estimation.

When you create or update a node pool with the `--tags` parameter, the tags you specify are assigned to the following resources:

* The node pool.
* The virtual machine scale set and each virtual machine scale set instance associated with the node pool.

### Create a new node pool

1. Create a node pool with an Azure tag using the [`az aks nodepool add`][az-aks-nodepool-add] command with the `--tags` parameter.

    ```azurecli-interactive
    az aks nodepool add \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name tagnodepool \
        --node-count 1 \
        --tags abtest=a costcenter=5555 \
        --no-wait
    ```

2. Verify that the tags have been applied to the node pool using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show -g myResourceGroup -n myAKSCluster --query 'agentPoolProfiles[].{nodepoolName:name,tags:tags}'
    ```

    The following example output shows the tags applied to the node pool:

    ```output
    [
      {
        "nodepoolName": "nodepool1",
        "tags": null
      },
      {
        "nodepoolName": "tagnodepool",
        "tags": {
          "abtest": "a",
          "costcenter": "5555"
        }
      }
    ]
    ```

### Update an existing node pool

> [!IMPORTANT]
> Setting tags on a node pool using the `az aks nodepool update` command overwrites the set of tags. For example, if your node pool has the tags *abtest=a* and *costcenter=5555*, and you use `az aks nodepool update` with the tags *appversion=0.0.2* and *costcenter=4444*, the new list of tags would be *appversion=0.0.2* and *costcenter=4444*.

1. Update a node pool with an Azure tag using the [`az aks nodepool update`][az-aks-nodepool-update] command.

    ```azurecli-interactive
    az aks nodepool update \
        --resource-group myResourceGroup \
        --cluster-name myAKSCluster \
        --name tagnodepool \
        --tags appversion=0.0.2 costcenter=4444 \
        --no-wait
    ```

2. Verify the tags have been applied to the node pool using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show -g myResourceGroup -n myAKSCluster --query 'agentPoolProfiles[].{nodepoolName:name,tags:tags}'
    ```

    The following example output shows the tags applied to the node pool:

    ```output
    [
      {
        "nodepoolName": "nodepool1",
        "tags": null
      },
      {
        "nodepoolName": "tagnodepool",
        "tags": {
          "appversion": "0.0.2",
          "costcenter": "4444"
        }
      }
    ]
    ```

## Add tags using Kubernetes

> [!IMPORTANT]
> Setting tags on files, disks, and public IPs using Kubernetes updates the set of tags. For example, if your disk has the tags *dept=IT* and *costcenter=5555*, and you use Kubernetes to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=3333*.
>
> Any updates you make to tags through Kubernetes retain the value set through Kubernetes. For example, if your disk has tags *dept=IT* and *costcenter=5555* set by Kubernetes, and you use the portal to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=5555*. If you then remove the disk through Kubernetes, the disk would have the tag *team=beta*.

You can apply Azure tags to public IPs, disks, and files using a Kubernetes manifest.

* For public IPs, use *service.beta.kubernetes.io/azure-pip-tags* under *annotations*. For example:

    ```yml
    apiVersion: v1
    kind: Service
    metadata:
      annotations:
        service.beta.kubernetes.io/azure-pip-tags: costcenter=3333,team=beta
    spec:
      ...
    ```

* For files and disks, use *tags* under *parameters*. For example:

    ```yml
    ---
    apiVersion: storage.k8s.io/v1
    ...
    parameters:
      ...
      tags: costcenter=3333,team=beta
    ...
    ```

## Next steps

Learn more about [using labels in an AKS cluster][use-labels-aks].

<!-- LINKS - internal -->
[install-azure-cli]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-show]: /cli/azure/aks#az-aks-show
[use-labels-aks]: ./use-labels.md
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az-aks-nodepool-add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az-aks-nodepool-update
[az-aks-update]: /cli/azure/aks#az-aks-update
