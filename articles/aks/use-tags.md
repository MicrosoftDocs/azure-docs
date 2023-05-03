---
title: Use Azure tags in Azure Kubernetes Service (AKS)
description: Learn how to use Azure provider tags to track resources in Azure Kubernetes Service (AKS).
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 05/26/2022
---

# Use Azure tags in Azure Kubernetes Service (AKS)

With Azure Kubernetes Service (AKS), you can set Azure tags on an AKS cluster and its related resources by using Azure Resource Manager, through the Azure CLI. For some resources, you can also use Kubernetes manifests to set Azure tags. Azure tags are a useful tracking resource for certain business processes, such as *chargeback*.

This article explains how to set Azure tags for AKS clusters and related resources.

## Before you begin

It's a good idea to understand what happens when you set and update Azure tags with AKS clusters and their related resources. For example: 

* Tags set on an AKS cluster apply to all resources that are related to the cluster, but not the node pools. This operation overwrites the values of existing keys.
* Tags set on a node pool apply only to resources related to that node pool. This operation overwrites the values of existing keys. Resources outside that node pool, including resources for the rest of the cluster and other node pools, are unaffected.
* Public IPs, files, and disks can have tags set by Kubernetes through a Kubernetes manifest. Tags set in this way will maintain the Kubernetes values, even if you update them later by using another method. When public IPs, files, or disks are removed through Kubernetes, any tags that are set by Kubernetes are removed. Tags on those resources that aren't tracked by Kubernetes remain unaffected.

### Prerequisites

* The Azure CLI version 2.0.59 or later, installed and configured. 

  To find your version, run `az --version`. If you need to install it or update your version, see [Install Azure CLI][install-azure-cli].
* Kubernetes version 1.20 or later, installed.

### Limitations

* Azure tags have keys that are case-insensitive for operations, such as when you're retrieving a tag by searching the key. In this case, a tag with the specified key will be updated or retrieved regardless of casing. Tag values are case-sensitive.
* In AKS, if multiple tags are set with identical keys but different casing, the tags are used in alphabetical order. For example, `{"Key1": "val1", "kEy1": "val2", "key1": "val3"}` results in `Key1` and `val1` being set.
* For shared resources, tags aren't able to determine the split in resource usage on their own.

## Add tags to the cluster

When you create or update an AKS cluster with the `--tags` parameter, the following are assigned the Azure tags that you've specified:

* The AKS cluster
* The node resource group
* The route table that's associated with the cluster
* The public IP that's associated with the cluster
* The load balancer that's associated with the cluster
* The network security group that's associated with the cluster
* The virtual network that's associated with the cluster
* The AKS managed kubelet msi associated with the cluster
* The AKS managed addon msi associated with the cluster
* The private DNS zone associated with the private cluster
* The private endpoint associated with the private cluster

> [!NOTE]
> Azure Private DNS only supports 15 tags. [tag resources](../azure-resource-manager/management/tag-resources.md). 

To create a cluster and assign Azure tags, run `az aks create` with the `--tags` parameter, as shown in the following command. Running the command creates a *myAKSCluster* in the *myResourceGroup* with the tags *dept=IT* and *costcenter=9999*.

> [!NOTE]
> To set tags on the initial node pool, the virtual machine scale set, and each virtual machine scale set instance that's associated with the initial node pool, also set the `--nodepool-tags` parameter.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --tags dept=IT costcenter=9999 \
    --generate-ssh-keys
```

> [!IMPORTANT]
> If you're using existing resources when you're creating a new cluster, such as an IP address or route table, `az aks create` overwrites the set of tags. If you delete that cluster later, any tags set by the cluster will be removed.

Verify that the tags have been applied to the cluster and related resources. The cluster tags for *myAKSCluster* are shown in the following example:

```output
$ az aks show -g myResourceGroup -n myAKSCluster --query '[tags]'
{
  "clusterTags": {
    "costcenter": "9999",
    "dept": "IT"
  }
}
```

To update the tags on an existing cluster, run `az aks update` with the `--tags` parameter. Running the command updates the *myAKSCluster* with the tags *team=alpha* and *costcenter=1234*.


```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --tags team=alpha costcenter=1234
```

Verify that the tags have been applied to the cluster. For example:

```output
$ az aks show -g myResourceGroup -n myAKSCluster --query '[tags]'
{
  "clusterTags": {
    "costcenter": "1234",
    "team": "alpha"
  }
}
```

> [!IMPORTANT]
> Setting tags on a cluster by using `az aks update` overwrites the set of tags. For example, if your cluster has the tags *dept=IT* and *costcenter=9999* and you use `az aks update` with the tags *team=alpha* and *costcenter=1234*, the new list of tags would be *team=alpha* and *costcenter=1234*.

## Adding tags to node pools

You can apply an Azure tag to a new or existing node pool in your AKS cluster. Tags applied to a node pool are applied to each node within the node pool and are persisted through upgrades. Tags are also applied to new nodes that are added to a node pool during scale-out operations. Adding a tag can help with tasks such as policy tracking or cost estimation.

When you create or update a node pool with the `--tags` parameter, the tags that you specify are assigned to the following resources:

* The node pool
* The virtual machine scale set and each virtual machine scale set instance that's associated with the node pool

To create a node pool with an Azure tag, run `az aks nodepool add` with the `--tags` parameter. Running the following command creates a *tagnodepool* node pool with the tags *abtest=a* and *costcenter=5555* in the *myAKSCluster*.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name tagnodepool \
    --node-count 1 \
    --tags abtest=a costcenter=5555 \
    --no-wait
```

Verify that the tags have been applied to the *tagnodepool* node pool.

```output
$ az aks show -g myResourceGroup -n myAKSCluster --query 'agentPoolProfiles[].{nodepoolName:name,tags:tags}'
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

To update a node pool with an Azure tag, run `az aks nodepool update` with the `--tags` parameter. Running the following command updates the *tagnodepool* node pool with the tags *appversion=0.0.2* and *costcenter=4444* in the *myAKSCluster*, which already has the tags *abtest=a* and *costcenter=5555*.

```azurecli-interactive
az aks nodepool update \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name tagnodepool \
    --tags appversion=0.0.2 costcenter=4444 \
    --no-wait
```

> [!IMPORTANT]
> Setting tags on a node pool by using `az aks nodepool update` overwrites the set of tags. For example, if your node pool has the tags *abtest=a* and *costcenter=5555*, and you use `az aks nodepool update` with the tags *appversion=0.0.2* and *costcenter=4444*, the new list of tags would be *appversion=0.0.2* and *costcenter=4444*.

Verify that the tags have been updated on the nodepool.

```output
$ az aks show -g myResourceGroup -n myAKSCluster --query 'agentPoolProfiles[].{nodepoolName:name,tags:tags}'
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

## Add tags by using Kubernetes

You can apply Azure tags to public IPs, disks, and files by using a Kubernetes manifest.

For public IPs, use *service.beta.kubernetes.io/azure-pip-tags* under *annotations*. For example:

```yml
apiVersion: v1
kind: Service
metadata:
  annotations:
    service.beta.kubernetes.io/azure-pip-tags: costcenter=3333,team=beta
spec:
  ...
```

For files and disks, use *tags* under *parameters*. For example:

```yml
---
apiVersion: storage.k8s.io/v1
...
parameters:
  ...
  tags: costcenter=3333,team=beta
...
```

> [!IMPORTANT]
> Setting tags on files, disks, and public IPs by using Kubernetes updates the set of tags. For example, if your disk has the tags *dept=IT* and *costcenter=5555*, and you use Kubernetes to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=3333*.
> 
> Any updates that you make to tags through Kubernetes will retain the value that's set through Kubernetes. For example, if your disk has tags *dept=IT* and *costcenter=5555* set by Kubernetes, and you use the portal to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=5555*. If you then remove the disk through Kubernetes, the disk would have the tag *team=beta*.

[install-azure-cli]: /cli/azure/install-azure-cli
