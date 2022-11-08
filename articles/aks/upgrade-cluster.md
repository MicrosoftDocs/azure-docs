---
title: Upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
services: container-service
ms.topic: article
ms.custom: event-tier1-build-2022
ms.date: 12/17/2020
---

# Upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It’s important you apply the latest security releases, or upgrade to get the latest features. This article shows you how to check for, configure, and apply upgrades to your AKS cluster.

For AKS clusters that use multiple node pools or Windows Server nodes, see [Upgrade a node pool in AKS][nodepool-upgrade].

## Before you begin

### [Azure CLI](#tab/azure-cli)

This article requires that you're running the Azure CLI version 2.34.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

### [Azure PowerShell](#tab/azure-powershell)

This tutorial requires that you're running Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].

---

> [!WARNING]
> An AKS cluster upgrade triggers a cordon and drain of your nodes. If you have a low compute quota available, the upgrade may fail. For more information, see [increase quotas](../azure-portal/supportability/regional-quota-requests.md)

## Check for available AKS cluster upgrades

### [Azure CLI](#tab/azure-cli)

To check which Kubernetes releases are available for your cluster, use the [az aks get-upgrades][az-aks-get-upgrades] command. The following example checks for available upgrades to *myAKSCluster* in *myResourceGroup*:

```azurecli-interactive
az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
```

> [!NOTE]
> When you upgrade a supported AKS cluster, Kubernetes minor versions can't be skipped. All upgrades must be performed sequentially by major version number. For example, upgrades between *1.14.x* -> *1.15.x* or *1.15.x* -> *1.16.x* are allowed, however *1.14.x* -> *1.16.x* is not allowed.
>
> Skipping multiple versions can only be done when upgrading from an _unsupported version_ back to a _supported version_. For example, an upgrade from an unsupported *1.10.x* -> a supported *1.15.x* can be completed if available.

The following example output shows that the cluster can be upgraded to versions *1.19.1* and *1.19.3*:

```console
Name     ResourceGroup    MasterVersion    Upgrades
-------  ---------------  ---------------  --------------
default  myResourceGroup  1.18.10          1.19.1, 1.19.3
```

The following example output means that the appservice-kube extension isn't compatible with your Azure CLI version (a minimum of version 2.34.1 is required):

```console
The 'appservice-kube' extension is not compatible with this version of the CLI.
You have CLI core version 2.0.81 and this extension requires a min of 2.34.1.
Table output unavailable. Use the --query option to specify an appropriate query. Use --debug for more info.
```

If you receive this output, you need to update your Azure CLI version. The `az upgrade` command was added in version 2.11.0 and doesn't work with versions prior to 2.11.0. Older versions can be updated by reinstalling Azure CLI as described in [Install the Azure CLI](/cli/azure/install-azure-cli). If your Azure CLI version is 2.11.0 or later, you'll receive a message to run `az upgrade` to upgrade Azure CLI to the latest version.

If your Azure CLI is updated and you receive the following example output, it means that no upgrades are available:

```console
ERROR: Table output unavailable. Use the --query option to specify an appropriate query. Use --debug for more info.
```

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when `az aks get-upgrades` shows that no upgrades are available.

### [Azure PowerShell](#tab/azure-powershell)

To check which Kubernetes releases are available for your cluster, use the [Get-AzAksUpgradeProfile][get-azaksupgradeprofile] command. The following example checks for available upgrades to *myAKSCluster* in *myResourceGroup*:

```azurepowershell-interactive
 Get-AzAksUpgradeProfile -ResourceGroupName myResourceGroup -ClusterName myAKSCluster |
 Select-Object -Property Name, ControlPlaneProfileKubernetesVersion -ExpandProperty ControlPlaneProfileUpgrade |
 Format-Table -Property *
```

> [!NOTE]
> When you upgrade a supported AKS cluster, Kubernetes minor versions can't be skipped. All upgrades must be performed sequentially by major version number. For example, upgrades between *1.14.x* -> *1.15.x* or *1.15.x* -> *1.16.x* are allowed, however *1.14.x* -> *1.16.x* is not allowed.
>
> Skipping multiple versions can only be done when upgrading from an _unsupported version_ back to a _supported version_. For example, an upgrade from an unsupported *1.10.x* -> a supported *1.15.x* can be completed if available.

The following example output shows that the cluster can be upgraded to versions *1.19.1* and *1.19.3*:

```Output
Name    ControlPlaneProfileKubernetesVersion IsPreview KubernetesVersion 
----    ------------------------------------ --------- ----------------- 
default 1.18.10                                        1.19.1            
default 1.18.10                                        1.19.3         
```

If no upgrade is available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when `Get-AzAksUpgradeProfile` shows that no upgrades are available.

---

## Customize node surge upgrade

> [!IMPORTANT]
> Node surges require subscription quota for the requested max surge count for each upgrade operation. For example, a cluster that has 5 node pools, each with a count of 4 nodes, has a total of 20 nodes. If each node pool has a max surge value of 50%, additional compute and IP quota of 10 nodes (2 nodes * 5 pools) is required to complete the upgrade.
>
> If using Azure CNI, validate there are available IPs in the subnet as well to [satisfy IP requirements of Azure CNI](configure-azure-cni.md).

By default, AKS configures upgrades to surge with one extra node. A default value of one for the max surge settings will enable AKS to minimize workload disruption by creating an extra node before the cordon/drain of existing applications to replace an older versioned node. The max surge value may be customized per node pool to enable a trade-off between upgrade speed and upgrade disruption. By increasing the max surge value, the upgrade process completes faster, but setting a large value for max surge may cause disruptions during the upgrade process.

For example, a max surge value of 100% provides the fastest possible upgrade process (doubling the node count) but also causes all nodes in the node pool to be drained simultaneously. You may wish to use a higher value such as this for testing environments. For production node pools, we recommend a max_surge setting of 33%.

AKS accepts both integer values and a percentage value for max surge. An integer such as "5" indicates five extra nodes to surge. A value of "50%" indicates a surge value of half the current node count in the pool. Max surge percent values can be a minimum of 1% and a maximum of 100%. A percent value is rounded up to the nearest node count. If the max surge value is higher than the current node count at the time of upgrade, the current node count is used for the max surge value.

During an upgrade, the max surge value can be a minimum of 1 and a maximum value equal to the number of nodes in your node pool. You can set larger values, but the maximum number of nodes used for max surge won't be higher than the number of nodes in the pool at the time of upgrade.

> [!IMPORTANT]
> The max surge setting on a node pool is persistent.  Subsequent Kubernetes upgrades or node version upgrades will use this setting. You may change the max surge value for your node pools at any time. For production node pools, we recommend a max-surge setting of 33%.

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

### [Azure CLI](#tab/azure-cli)

With a list of available versions for your AKS cluster, use the [az aks upgrade][az-aks-upgrade] command to upgrade. During the upgrade process, AKS will:

- Add a new buffer node (or as many nodes as configured in [max surge](#customize-node-surge-upgrade)) to the cluster that runs the specified Kubernetes version.
- [Cordon and drain][kubernetes-drain] one of the old nodes to minimize disruption to running applications. If you're using max surge, it will [cordon and drain][kubernetes-drain] as many nodes at the same time as the number of buffer nodes specified.
- When the old node is fully drained, it will be reimaged to receive the new version, and it will become the buffer node for the following node to be upgraded.
- This process repeats until all nodes in the cluster have been upgraded.
- At the end of the process, the last buffer node will be deleted, maintaining the existing agent node count and zone balance.

[!INCLUDE [alias minor version callout](./includes/aliasminorversion/alias-minor-version-upgrade.md)]

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

The following example output shows that the cluster now runs *1.19.1*:

```json
Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------
myAKSCluster  eastus      myResourceGroup  1.19.1               Succeeded            myakscluster-dns-379cbbb9.hcp.eastus.azmk8s.io
```

### [Azure PowerShell](#tab/azure-powershell)

With a list of available versions for your AKS cluster, use the [Set-AzAksCluster][set-azakscluster] cmdlet to upgrade. During the upgrade process, AKS will:

- Add a new buffer node (or as many nodes as configured in [max surge](#customize-node-surge-upgrade)) to the cluster that runs the specified Kubernetes version.
- [Cordon and drain][kubernetes-drain] one of the old nodes to minimize disruption to running applications. If you're using max surge, it will [cordon and drain][kubernetes-drain] as many nodes at the same time as the number of buffer nodes specified.
- When the old node is fully drained, it will be reimaged to receive the new version, and it will become the buffer node for the following node to be upgraded.
- This process repeats until all nodes in the cluster have been upgraded.
- At the end of the process, the last buffer node will be deleted, maintaining the existing agent node count and zone balance.

[!INCLUDE [alias minor version callout](./includes/aliasminorversion/alias-minor-version-upgrade.md)]

```azurepowershell-interactive
Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
```

It takes a few minutes to upgrade the cluster, depending on how many nodes you have.

> [!IMPORTANT]
> Ensure that any `PodDisruptionBudgets` (PDBs) allow for at least 1 pod replica to be moved at a time otherwise the drain/evict operation will fail.
> If the drain operation fails, the upgrade operation will fail by design to ensure that the applications are not disrupted. Please correct what caused the operation to stop (incorrect PDBs, lack of quota, and so on) and re-try the operation.

To confirm that the upgrade was successful, use the [Get-AzAksCluster][get-azakscluster] command:

```azurepowershell-interactive
Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
 Format-Table -Property Name, Location, KubernetesVersion, ProvisioningState, Fqdn
```

The following example output shows that the cluster now runs *1.19.1*:

```Output
Name         Location KubernetesVersion ProvisioningState Fqdn                                   
----         -------- ----------------- ----------------- ----                                   
myAKSCluster eastus   1.19.1            Succeeded         myakscluster-dns-379cbbb9.hcp.eastus.azmk8s.io
```

---

## View the upgrade events

When you upgrade your cluster, the following Kubernetes events may occur on each node:

- Surge – Create surge node.
- Drain – Pods are being evicted from the node. Each pod has a 30-minute timeout to complete the eviction.
- Update – Update of a node has succeeded or failed.
- Delete – Deleted a surge node.

Use `kubectl get events` to show events in the default namespaces while running an upgrade. For example:

```azurecli-interactive
kubectl get events 
```

The following example output shows some of the above events listed during an upgrade.

```output
...
default 2m1s Normal Drain node/aks-nodepool1-96663640-vmss000001 Draining node: [aks-nodepool1-96663640-vmss000001]
...
default 9m22s Normal Surge node/aks-nodepool1-96663640-vmss000002 Created a surge node [aks-nodepool1-96663640-vmss000002 nodepool1] for agentpool %!s(MISSING)
...
```

## Set auto-upgrade channel

In addition to manually upgrading a cluster, you can set an auto-upgrade channel on your cluster. For more information, see [Auto-upgrading an AKS cluster][aks-auto-upgrade].

## Special considerations for node pools that span multiple Availability Zones

AKS uses best-effort zone balancing in node groups. During an Upgrade surge, zone(s) for the surge node(s) in virtual machine scale sets is unknown ahead of time. This can temporarily cause an unbalanced zone configuration during an upgrade. However, AKS deletes the surge node(s) once the upgrade has been completed and preserves the original zone balance. If you desire to keep your zones balanced during upgrade, increase the surge to a multiple of three nodes. Virtual machine scale sets will then balance your nodes across Availability Zones with best-effort zone balancing.

If you have PVCs backed by Azure LRS Disks, they’ll be bound to a particular zone, and they may fail to recover immediately if the surge node doesn’t match the zone of the PVC. This could cause downtime on your application when the Upgrade operation continues to drain nodes but the PVs are bound to a zone. To handle this case and maintain high availability, configure a [Pod Disruption Budget](https://kubernetes.io/docs/tasks/run-application/configure-pdb/) on your application. This allows Kubernetes to respect your availability requirements during Upgrade's drain operation.

## Next steps

This article showed you how to upgrade an existing AKS cluster. To learn more about deploying and managing AKS clusters, see the set of tutorials.

> [!div class="nextstepaction"]
> [AKS tutorials][aks-tutorial-prepare-app]

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/

<!-- LINKS - internal -->
[aks-tutorial-prepare-app]: ./tutorial-kubernetes-prepare-app.md
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[get-azaksupgradeprofile]: /powershell/module/az.aks/get-azaksupgradeprofile
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[az-aks-show]: /cli/azure/aks#az_aks_show
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[az-extension-add]: /cli/azure/extension#az_extension_add
[az-extension-update]: /cli/azure/extension#az_extension_update
[az-feature-list]: /cli/azure/feature#az_feature_list
[az-feature-register]: /cli/azure/feature#az_feature_register
[az-provider-register]: /cli/azure/provider#az_provider_register
[nodepool-upgrade]: use-multiple-node-pools.md#upgrade-a-node-pool
[upgrade-cluster]:  #upgrade-an-aks-cluster
[planned-maintenance]: planned-maintenance.md
[aks-auto-upgrade]: auto-upgrade-cluster.md
