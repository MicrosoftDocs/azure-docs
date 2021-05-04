---
title: Upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
services: container-service
ms.topic: article
ms.date: 12/17/2020

---

# Upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It is important you apply the latest security releases, or upgrade to get the latest features. This article shows you how to upgrade the master components or a single, default node pool in an AKS cluster.

For AKS clusters that use multiple node pools or Windows Server nodes, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Before you begin

This article requires that you are running the Azure CLI version 2.0.65 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

> [!WARNING]
> An AKS cluster upgrade triggers a cordon and drain of your nodes. If you have a low compute quota available, the upgrade may fail. For more information, see [increase quotas](../azure-portal/supportability/resource-manager-core-quotas-request.md)

## Check for available AKS cluster upgrades

To check which Kubernetes releases are available for your cluster, use the [az aks get-upgrades][az-aks-get-upgrades] command. The following example checks for available upgrades to *myAKSCluster* in *myResourceGroup*:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
```

> [!NOTE]
> When you upgrade a supported AKS cluster, Kubernetes minor versions cannot be skipped. All upgrades must be performed sequentially by major version number. For example, upgrades between *1.14.x* -> *1.15.x* or *1.15.x* -> *1.16.x* are allowed, however *1.14.x* -> *1.16.x* is not allowed. 
> > Skipping multiple versions can only be done when upgrading from an _unsupported version_ back to a _supported version_. For example, an upgrade from an unsupported *1.10.x* --> a supported *1.15.x* can be completed.

The following example output shows that the cluster can be upgraded to versions *1.19.1* and *1.19.3*:

```console
Name     ResourceGroup    MasterVersion    Upgrades
-------  ---------------  ---------------  --------------
default  myResourceGroup  1.18.10          1.19.1, 1.19.3
```

If no upgrade is available, you will get the message:

```console
ERROR: Table output unavailable. Use the --query option to specify an appropriate query. Use --debug for more info.
```

## Customize node surge upgrade

> [!Important]
> Node surges require subscription quota for the requested max surge count for each upgrade operation. For example, a cluster that has 5 node pools, each with a count of 4 nodes, has a total of 20 nodes. If each node pool has a max surge value of 50%, additional compute and IP quota of 10 nodes (2 nodes * 5 pools) is required to complete the upgrade.
>
> If using Azure CNI, validate there are available IPs in the subnet as well to [satisfy IP requirements of Azure CNI](configure-azure-cni.md).

By default, AKS configures upgrades to surge with one additional node. A default value of one for the max surge settings will enable AKS to minimize workload disruption by creating an additional node before the cordon/drain of existing applications to replace an older versioned node. The max surge value may be customized per node pool to enable a trade-off between upgrade speed and upgrade disruption. By increasing the max surge value, the upgrade process completes faster, but setting a large value for max surge may cause disruptions during the upgrade process. 

For example, a max surge value of 100% provides the fastest possible upgrade process (doubling the node count) but also causes all nodes in the node pool to be drained simultaneously. You may wish to use a higher value such as this for testing environments. For production node pools, we recommend a max_surge setting of 33%.

AKS accepts both integer values and a percentage value for max surge. An integer such as "5" indicates five additional nodes to surge. A value of "50%" indicates a surge value of half the current node count in the pool. Max surge percent values can be a minimum of 1% and a maximum of 100%. A percent value is rounded up to the nearest node count. If the max surge value is lower than the current node count at the time of upgrade, the current node count is used for the max surge value.

During an upgrade, the max surge value can be a minimum of 1 and a maximum value equal to the number of nodes in your node pool. You can set larger values, but the maximum number of nodes used for max surge won't be higher than the number of nodes in the pool at the time of upgrade.

> [!Important]
> The max surge setting on a node pool is permanent.  Subsequent Kubernetes upgrades or node version upgrades will use this setting. You may change the max surge value for your node pools at any time. For production node pools, we recommend a max-surge setting of 33%.

Use the following commands to set max surge values for new or existing node pools.

```azurecli-interactive
# Set max surge for a new node pool
az aks nodepool add -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 33%
```

```azurecli-interactive
# Update max surge for an existing node pool 
az aks nodepool update -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 5
```

## Upgrade an AKS cluster

With a list of available versions for your AKS cluster, use the [az aks upgrade][az-aks-upgrade] command to upgrade. During the upgrade process, AKS will: 
- add a new buffer node (or as many nodes as configured in [max surge](#customize-node-surge-upgrade)) to the cluster that runs the specified Kubernetes version. 
- [cordon and drain][kubernetes-drain] one of the old nodes to minimize disruption to running applications (if you're using max surge it will [cordon and drain][kubernetes-drain] as many nodes at the same time as the number of buffer nodes specified). 
- When the old node is fully drained, it will be reimaged to receive the new version and it will become the buffer node for the following node to be upgraded. 
- This process repeats until all nodes in the cluster have been upgraded. 
- At the end of the process, the last buffer node will be deleted, maintaining the existing agent node count and zone balance.

```azurecli-interactive
az aks upgrade \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --kubernetes-version KUBERNETES_VERSION
```

It takes a few minutes to upgrade the cluster, depending on how many nodes you have.

> [!IMPORTANT]
> Ensure that any `PodDisruptionBudgets` (PDBs) allow for at least 1 pod replica to be moved at a time otherwise the drain/evict operation will fail.
> If the drain operation fails, the upgrade operation will fail by design to ensure that the applications are not disrupted. Please correct what caused the operation to stop (incorrect PDBs, lack of quota, and so on) and re-try the operation.

To confirm that the upgrade was successful, use the [az aks show][az-aks-show] command:

```azurecli-interactive
az aks show --resource-group myResourceGroup --name myAKSCluster --output table
```

The following example output shows that the cluster now runs *1.18.10*:

```json
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.18.10              Succeeded            myakscluster-dns-379cbbb9.hcp.eastus.azmk8s.io
```

## Set auto-upgrade channel

In addition to manually upgrading a cluster, you can set an auto-upgrade channel on your cluster. The following upgrade channels are available:

|Channel| Action | Example
|---|---|---|
| `none`| disables auto-upgrades and keeps the cluster at its current version of Kubernetes| Default setting if left unchanged|
| `patch`| automatically upgrade the cluster to the latest supported patch version when it becomes available while keeping the minor version the same.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.17.9*|
| `stable`| automatically upgrade the cluster to the latest supported patch release on minor version *N-1*, where *N* is the latest supported minor version.| For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster is upgraded to *1.18.6*.
| `rapid`| automatically upgrade the cluster to the latest supported patch release on the latest supported minor version.| In cases where the cluster is at a version of Kubernetes that is at an *N-2* minor version where *N* is the latest supported minor version, the cluster first upgrades to the latest supported patch version on *N-1* minor version. For example, if a cluster is running version *1.17.7* and versions *1.17.9*, *1.18.4*, *1.18.6*, and *1.19.1* are available, your cluster first is upgraded to *1.18.6*, then is upgraded to *1.19.1*.

> [!NOTE]
> Cluster auto-upgrade only updates to GA versions of Kubernetes and will not update to preview versions.

Automatically upgrading a cluster follows the same process as manually upgrading a cluster. For more details, see [Upgrade an AKS cluster][upgrade-cluster].

The cluster auto-upgrade for AKS clusters is a preview feature.

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

Register the `AutoUpgradePreview` feature flag by using the [az feature register][az-feature-register] command, as shown in the following example:

```azurecli-interactive
az feature register --namespace Microsoft.ContainerService -n AutoUpgradePreview
```

It takes a few minutes for the status to show *Registered*. Verify the registration status by using the [az feature list][az-feature-list] command:

```azurecli-interactive
az feature list -o table --query "[?contains(name, 'Microsoft.ContainerService/AutoUpgradePreview')].{Name:name,State:properties.state}"
```

When ready, refresh the registration of the *Microsoft.ContainerService* resource provider by using the [az provider register][az-provider-register] command:

```azurecli-interactive
az provider register --namespace Microsoft.ContainerService
```

To set the auto-upgrade channel when creating a cluster, use the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks create --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable --generate-ssh-keys
```

To set the auto-upgrade channel on existing cluster, update the *auto-upgrade-channel* parameter, similar to the following example.

```azurecli-interactive
az aks update --resource-group myResourceGroup --name myAKSCluster --auto-upgrade-channel stable
```

## Next steps

This article showed you how to upgrade an existing AKS cluster. To learn more about deploying and managing AKS clusters, see the set of tutorials.

> [!div class="nextstepaction"]
> [AKS tutorials][aks-tutorial-prepare-app]

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[az-aks-show]: /cli/azure/aks#az_aks_show
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az_provider_register
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[upgrade-cluster]:  #upgrade-an-aks-cluster
