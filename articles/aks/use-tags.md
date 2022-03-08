---
title: Use Azure tags in Azure Kubernetes Service (AKS)
description: Learn how to use Azure provider tags to track resources in Azure Kubernetes Service (AKS)
services: container-service
ms.topic: article
ms.date: 02/08/2022
---

# Use Azure tags in Azure Kubernetes Service (AKS)

AKS has the ability to set Azure tags on the cluster and its related resources using the Azure Resource Manager, such as the Azure CLI. For some resources, you can also use Kubernetes manifests to set Azure tags. Azure tags are useful tracking resource usage for things like charge back.

This article explains how Azure tags set for AKS clusters and related resources.

## Before you begin

Setting and updating Azure tags with AKS clusters and their related resources work as follows:

* Tags set on an AKS cluster apply those tags to all resources related to the cluster, but not the node pools. This operation will overwrite the value of existing keys.
* Tags set on a node pool apply those tags to only resources related to that node pool. This operation will overwrite the value of existing keys. Resources outside that node pool, including resources for the rest of the cluster and other node pools, are unaffected.
* Public IPs, files, and disks can have tags set by Kubernetes using a Kubernetes manifest. Tags set in this way will maintain the Kubernetes value, even if later updates are made to those tags using another method. When public IPs, files, or disks are removed through Kubernetes, any tags set by Kubernetes are removed. Tags that are not tracked by Kubernetes on those resources remain unaffected.

### Limitations

* Azure tags have keys which are case-insensitive for operations, such as when retrieving a tag by searching the key. In this case a tag with the given key will be updated or retrieved regardless of casing. Tag values are case-sensitive.
* In AKS, if multiple tags are set with identical keys but different casing, the tag used is the first in alphabetical order. For example, `{"Key1": "val1", "kEy1": "val2", "key1": "val3"}` results in `Key1` and `val1` being set.
* You need the Azure CLI version 2.0.59 or later installed and configured. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][install-azure-cli].
* Kubernetes version 1.20 or newer is required.
* For shared resources, tags aren't able to determine the split in resource usage on their own.

## Adding tags to the cluster

When you create or update a cluster with the `--tags` parameter, the following are assigned the Azure tags you specified:

* the AKS cluster
* the route table associated with the cluster
* the public IP associated with the cluster
* the network security group associated with the cluster
* the virtual network associated with the cluster

To create a cluster and assign Azure tags, use the `az aks create` with the `--tags` parameter. The following command creates a *myAKSCluster* in the *myResourceGroup* with the tags *dept=IT* and *costcenter=9999*.

> [!NOTE]
> To set tags on the initial node pool, node resource group, the virtual machine scale set, and each virtual machine scale set instance associated with the initial node pool, also set the `--nodepool-tags` parameter.

```azurecli-interactive
az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --tags dept=IT costcenter=9999 \
    --generate-ssh-keys
```

> [!IMPORTANT]
> In cases where you are using existing resources when creating a new cluster, such as an IP address or route table, `az aks create` overwrites the set of tags. If you later delete that cluster, any tags set by the cluster will be removed.

Verify the tags have been applied to the cluster and related resources. The following example shows the cluster tags for *myAKSCluster*.

```output
$ az aks show -g myResourceGroup -n myAKSCluster --query '[tags]'
{
  "clusterTags": {
    "costcenter": "9999",
    "dept": "IT"
  }
}
```

To update the tags on an existing cluster, use `az aks update` with the `--tags` parameter. The following command updates the *myAKSCluster* with the tags *team=alpha* and *costcenter=1234*.


```azurecli-interactive
az aks update \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --tags team=alpha costcenter=1234
```

Verify the tags have been applied to the cluster. For example:

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
> Setting tags on a cluster using `az aks update` overwrites the set of tags. For example, if your cluster had the tags *dept=IT* and *costcenter=9999* and you used `az aks update` with the tags *team=alpha* and *costcenter=1234*, the new list of tags would be *team=alpha* and *costcenter=1234*.

## Adding tags to node pools

You can apply an Azure tag to a new or existing node pool in your AKS cluster. Tags applied to a node pool are applied to each node within the node pool and are persisted through upgrades. Tags are also applied to new nodes added to a node pool during scale-out operations. Adding a tag can help with tasks such as policy tracking or cost estimation.

When you create or update a node pool with the `--tags` parameter, the following are assigned the Azure tags you specified:

* the node pool
* the node resource group
* the virtual machine scale set and each virtual machine scale set instance associated with the node pool

To create a node pool with an Azure tag, use `az aks nodepool add` with the `--tags` parameter. The following example creates a *tagnodepool* node pool with the tags *abtest=a* and *costcenter=5555* in the *myAKSCluster*.

```azurecli-interactive
az aks nodepool add \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name tagnodepool \
    --node-count 1 \
    --tags abtest=a costcenter=5555 \
    --no-wait
```

Verify the tags have been applied to the *tagnodepool* node pool.

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

To update a node pool with an Azure tag, use `az aks nodepool update` with the `--tags` parameter. The following example updates *tagnodepool* node pool with the tags *appversion=0.0.2* and *costcenter=4444* in the *myAKSCluster*, which already has the tags *abtest=a* and *costcenter=5555*.

```azurecli-interactive
az aks nodepool update \
    --resource-group myResourceGroup \
    --cluster-name myAKSCluster \
    --name tagnodepool \
    --tags appversion=0.0.2 costcenter=4444 \
    --no-wait
```

> [!IMPORTANT]
> Setting tags on a node pool using `az aks nodepool update` overwrites the set of tags. For example, if your node pool had the tags *abtest=a* and *costcenter=5555* and you used `az aks nodepool update` with the tags *appversion=0.0.2* and *costcenter=4444*, the new list of tags would be *appversion=0.0.2* and *costcenter=4444*.

Verify the tags have been updated on the nodepool.

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

## Adding tags using Kubernetes

You can apply Azure tags to public IPs, disks, and files using a Kubernetes manifest.

For public IPs, use *service.beta.kubernetes.io/azure-pip-tags*, for example:

```yml
apiVersion: v1
kind: Service
...
spec:
  ...
  service.beta.kubernetes.io/azure-pip-tags: costcenter=3333,team=beta
  ...
```

For files and disks, use *tags* under *parameters*, for example:

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
> Setting tags on files, disks, and public IPs using Kubernetes updates the set of tags. For example, if your disk has the tags *dept=IT* and *costcenter=5555*, and you used Kubernetes to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=3333*.
> 
> Any updates made to tags through Kubernetes will retain the value set through kubernetes. For example, if your disk has tags *dept=IT* and *costcenter=5555* set by Kubernetes, and you used the portal to set the tags *team=beta* and *costcenter=3333*, the new list of tags would be *dept=IT*, *team=beta*, and *costcenter=5555*. If you then removed the disk through Kubernetes, the disk would have the tag *team=beta*.

[install-azure-cli]: /cli/azure/install-azure-cli