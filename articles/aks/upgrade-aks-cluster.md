---
title: Upgrade an Azure Kubernetes Service (AKS) cluster
description: Learn how to upgrade an Azure Kubernetes Service (AKS) cluster to get the latest features and security updates.
ms.topic: article
ms.custom: azure-kubernetes-service, devx-track-azurecli
ms.date: 10/19/2023
---

# Upgrade an Azure Kubernetes Service (AKS) cluster

Part of the AKS cluster lifecycle involves performing periodic upgrades to the latest Kubernetes version. It's important you apply the latest security releases and upgrades to get the latest features. This article shows you how to check for and apply upgrades to your AKS cluster.

## Kubernetes version upgrades

When you upgrade a supported AKS cluster, you can't skip Kubernetes minor versions. You must perform all upgrades sequentially by major version number. For example, upgrades between *1.14.x* -> *1.15.x* or *1.15.x* -> *1.16.x* are allowed. *1.14.x* -> *1.16.x* isn't allowed. You can only skip multiple versions when upgrading from an *unsupported version* back to a *supported version*. For example, you can perform an upgrade from an unsupported *1.10.x* to a supported *1.12.x* if available.

When you perform an upgrade from an *unsupported version* that skips two or more minor versions, the upgrade has no guarantee of functionality and is excluded from the service-level agreements and limited warranty. If your version is significantly out of date, we recommend you recreate your cluster instead.

## Before you begin

* If you're using the Azure CLI, this article requires Azure CLI version 2.34.1 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
* If you're using Azure PowerShell, this article requires Azure PowerShell version 5.9.0 or later. Run `Get-InstalledModule -Name Az` to find the version. If you need to install or upgrade, see [Install Azure PowerShell][azure-powershell-install].
* Performing upgrade operations requires the `Microsoft.ContainerService/managedClusters/agentPools/write` RBAC role. For more on Azure RBAC roles, see the [Azure resource provider operations][azure-rp-operations].

> [!WARNING]
> An AKS cluster upgrade triggers a cordon and drain of your nodes. If you have a low compute quota available, the upgrade might fail. For more information, see [increase quotas](../azure-portal/supportability/regional-quota-requests.md).

## Check for available AKS cluster upgrades

> [!NOTE]
> To stay up to date with AKS fixes, releases, and updates, see the [AKS release tracker][release-tracker].

### [Azure CLI](#tab/azure-cli)

* Check which Kubernetes releases are available for your cluster using the [`az aks get-upgrades`][az-aks-get-upgrades] command.

    ```azurecli-interactive
    az aks get-upgrades --resource-group myResourceGroup --name myAKSCluster --output table
    ```

    The following example output shows the current version as *1.26.6* and lists the available versions under `upgrades`:

    ```output
    {
      "agentPoolProfiles": null,
      "controlPlaneProfile": {
        "kubernetesVersion": "1.26.6",
        ...
        "upgrades": [
          {
            "isPreview": null,
            "kubernetesVersion": "1.27.1"
          },
          {
            "isPreview": null,
            "kubernetesVersion": "1.27.3"
          }
        ]
      },
      ...
    }
    ```

### [Azure PowerShell](#tab/azure-powershell)

* Check which Kubernetes releases are available for your cluster and the region in which it resides using the [`Get-AzAksVersion`][get-azaksversion] cmdlet.

    ```azurepowershell-interactive
    Get-AzAksVersion -Location eastus | Where-Object OrchestratorVersion
    ```

    The following example output shows the available versions under `OrchestratorVersion`:

    ```output
    Default     IsPreview     OrchestratorType     OrchestratorVersion
    -------     ---------     ----------------     -------------------
                              Kubernetes           1.27.1
                              Kubernetes           1.27.3
    ```

### [Azure portal](#tab/azure-portal)

Check which Kubernetes releases are available for your cluster using the following steps:

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your AKS cluster.
3. Under **Settings**, select **Cluster configuration**.
4. In **Kubernetes version**, select **Upgrade version**.
5. In **Kubernetes version**, select the version to check for available upgrades.

The Azure portal highlights all the deprecated APIs between your current version and new available versions you intend to migrate to. For more information, see [the Kubernetes API Removal and Deprecation process][k8s-deprecation].

:::image type="content" source="./media/upgrade-cluster/portal-upgrade.png" alt-text="The screenshot of the upgrade blade for an AKS cluster in the Azure portal. The automatic upgrade field shows 'patch' selected, and several APIs deprecated between the selected Kubernetes version and the cluster's current version are described.":::

---

## Troubleshoot AKS cluster upgrade error messages

### [Azure CLI](#tab/azure-cli)

The following example output means the `appservice-kube` extension isn't compatible with your Azure CLI version (a minimum of version 2.34.1 is required):

```output
The 'appservice-kube' extension is not compatible with this version of the CLI.
You have CLI core version 2.0.81 and this extension requires a min of 2.34.1.
Table output unavailable. Use the --query option to specify an appropriate query. Use --debug for more info.
```

If you receive this output, you need to update your Azure CLI version. The `az upgrade` command was added in version 2.11.0 and doesn't work with versions prior to 2.11.0. You can update older versions by reinstalling Azure CLI as described in [Install the Azure CLI](/cli/azure/install-azure-cli). If your Azure CLI version is 2.11.0 or later, run `az upgrade` to upgrade Azure CLI to the latest version.

If your Azure CLI is updated and you receive the following example output, it means that no upgrades are available:

```output
ERROR: Table output unavailable. Use the --query option to specify an appropriate query. Use --debug for more info.
```

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when `az aks get-upgrades` shows that no upgrades are available.

### [Azure PowerShell](#tab/azure-powershell)

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when `Get-AzAksUpgradeProfile` shows that no upgrades are available.

### [Azure portal](#tab/azure-portal)

If no upgrades are available, create a new cluster with a supported version of Kubernetes and migrate your workloads from the existing cluster to the new cluster. It's not supported to upgrade a cluster to a newer Kubernetes version when no upgrades are available.

---

## Upgrade an AKS cluster

During the cluster upgrade process, AKS performs the following operations:

* Add a new buffer node (or as many nodes as configured in [max surge](#customize-node-surge-upgrade)) to the cluster that runs the specified Kubernetes version.
* [Cordon and drain][kubernetes-drain] one of the old nodes to minimize disruption to running applications. If you're using max surge, it [cordons and drains][kubernetes-drain] as many nodes at the same time as the number of buffer nodes specified.
* For long running pods, you can configure the node drain timeout, which allows for custom wait time on the eviction of pods and graceful termination per node. If not specified, the default is 30 minutes.
* When the old node is fully drained, it's reimaged to receive the new version and becomes the buffer node for the following node to be upgraded.
* Optionally, you can set a node soak time to wait between draining a node, reimaging it, and then moving on to the next node. The minimum soak time value is 0 minutes, with a maximum of 30 minutes. If not specified, the default value is 0 minutes.
* This process repeats until all nodes in the cluster have been upgraded.
* At the end of the process, the last buffer node is deleted, maintaining the existing agent node count and zone balance.

[!INCLUDE [alias minor version callout](./includes/aliasminorversion/alias-minor-version-upgrade.md)]

### [Azure CLI](#tab/azure-cli)

1. Upgrade your cluster using the [`az aks upgrade`][az-aks-upgrade] command.

    ```azurecli-interactive
    az aks upgrade \
        --resource-group myResourceGroup \
        --name myAKSCluster \
        --kubernetes-version <KUBERNETES_VERSION>
    ```

2. Confirm the upgrade was successful using the [`az aks show`][az-aks-show] command.

    ```azurecli-interactive
    az aks show --resource-group myResourceGroup --name myAKSCluster --output table
    ```

    The following example output shows that the cluster now runs *1.27.3*:

    ```output
    Name          Location    ResourceGroup    KubernetesVersion    ProvisioningState    Fqdn
    ------------  ----------  ---------------  -------------------  -------------------  ----------------------------------------------
    myAKSCluster  eastus      myResourceGroup  1.27.3               Succeeded            myakscluster-dns-379cbbb9.hcp.eastus.azmk8s.io
    ```

### [Azure PowerShell](#tab/azure-powershell)

1. Upgrade your cluster using the [`Set-AzAksCluster`][set-azakscluster] command.

    ```azurepowershell-interactive
    Set-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster -KubernetesVersion <KUBERNETES_VERSION>
    ```

2. Confirm the upgrade was successful using the [`Get-AzAksCluster`][get-azakscluster] command.

    ```azurepowershell-interactive
    Get-AzAksCluster -ResourceGroupName myResourceGroup -Name myAKSCluster |
     Format-Table -Property Name, Location, KubernetesVersion, ProvisioningState, Fqdn
    ```

    The following example output shows that the cluster now runs *1.27.3*:

    ```output
    Name         Location KubernetesVersion ProvisioningState Fqdn                                   
    ----         -------- ----------------- ----------------- ----                                   
    myAKSCluster eastus   1.27.3            Succeeded         myakscluster-dns-379cbbb9.hcp.eastus.azmk8s.io
    ```

### [Azure portal](#tab/azure-portal)

1. Sign in to the [Azure portal](https://portal.azure.com).
2. Navigate to your AKS cluster.
3. Under **Settings**, select **Cluster configuration**.
4. In **Kubernetes version**, select **Upgrade version**.
5. In **Kubernetes version**, select your desired version and then select **Save**.
6. Navigate to your AKS cluster **Overview** page, and select the **Kubernetes version** to confirm the upgrade was successful.

---

### Set auto-upgrade channel

You can set an auto-upgrade channel on your cluster. For more information, see [Auto-upgrading an AKS cluster][aks-auto-upgrade].

### Customize node surge upgrade

> [!IMPORTANT]
>
> * Node surges require subscription quota for the requested max surge count for each upgrade operation. For example, a cluster that has five node pools, each with a count of four nodes, has a total of 20 nodes. If each node pool has a max surge value of 50%, additional compute and IP quota of 10 nodes (2 nodes * 5 pools) is required to complete the upgrade.
>
> * The max surge setting on a node pool is persistent. Subsequent Kubernetes upgrades or node version upgrades will use this setting. You can change the max surge value for your node pools at any time. For production node pools, we recommend a max-surge setting of 33%.
>
> * If you're using Azure CNI, validate there are available IPs in the subnet to [satisfy IP requirements of Azure CNI](configure-azure-cni.md).

AKS configures upgrades to surge with one extra node by default. A default value of *one* for the max surge settings enables AKS to minimize workload disruption by creating an extra node before the cordon/drain of existing applications to replace an older versioned node. You can customize the max surge value per node pool. When you increase the max surge value, the upgrade process completes faster, and you might experience disruptions during the upgrade process. 

For example, a max surge value of *100%* provides the fastest possible upgrade process, but also causes all nodes in the node pool to be drained simultaneously. You might want to use a higher value such as this for testing environments. For production node pools, we recommend a `max_surge` setting of *33%*.

AKS accepts both integer values and a percentage value for max surge. An integer such as *5* indicates five extra nodes to surge. A value of *50%* indicates a surge value of half the current node count in the pool. Max surge percent values can be a minimum of *1%* and a maximum of *100%*. A percent value is rounded up to the nearest node count. If the max surge value is higher than the required number of nodes to be upgraded, the number of nodes to be upgraded is used for the max surge value. During an upgrade, the max surge value can be a minimum of *1* and a maximum value equal to the number of nodes in your node pool. You can set larger values, but you can't set the maximum number of nodes used for max surge higher than the number of nodes in the pool at the time of upgrade.

#### Set max surge value

* Set max surge values for new or existing node pools using the [`az aks nodepool add`][az-aks-nodepool-add] or [`az aks nodepool update`][az-aks-nodepool-update] command.

    ```azurecli-interactive
    # Set max surge for a new node pool
    az aks nodepool add -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 33%

    # Update max surge for an existing node pool 
    az aks nodepool update -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 5
    ```

#### Set node drain timeout value

When you have a long running workload on a certain pod and it cannot be rescheduled to another node during runtime, for example, a memory intensive stateful workload that must finish running, you can configure a node drain timeout that AKS will respect in the upgrade workflow. If no node drain timeout value is specified, the default is 30 minutes.


* Set node drain timeout for new or existing node pools using the [`az aks nodepool add`][az-aks-nodepool-add] or [`az aks nodepool update`][az-aks-nodepool-update] command.

    ```azurecli-interactive
    # Set drain timeout for a new node pool
    az aks nodepool add -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster   --drainTimeoutInMinutes 100

    # Update drain timeout for an existing node pool
    az aks nodepool update -n mynodepool -g MyResourceGroup --cluster-name MyManagedCluster --drainTimeoutInMinutes 45
    ```

#### Set node soak time value

To stagger a node upgrade in a controlled manner and minimize application downtime during an upgrade, you can set the node soak time to a value between 0 and 30 minutes. A short time interval allows you to complete other tasks, such as checking application health from a Grafana dashboard during the upgrade process. We recommend a short timeframe for the upgrade process, as close to 0 minutes as reasonably possible. Otherwise, a higher node soak time affects how long before you discover an issue.

* Set node soak time for new or existing node pools using the [`az aks nodepool add`][az-aks-nodepool-add], [`az aks nodepool update`][az-aks-nodepool-update], or [`az aks nodepool upgrade`][az-aks-nodepool-upgrade] command.

    ```azurecli-interactive
    # Set node soak time for a new node pool
    az aks nodepool add -n MyNodePool -g MyResourceGroup --cluster-name MyManagedCluster --node-soak-duration 10

    # Update node soak time for an existing node pool
    az aks nodepool update -n MyNodePool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 33% --node-soak-duration 5

    # Set node soak time when upgrading an existing node pool
    az aks nodepool upgrade -n MyNodePool -g MyResourceGroup --cluster-name MyManagedCluster --max-surge 33% --node-soak-duration 20
    ```


## View upgrade events

* View upgrade events using the `kubectl get events` command.

    ```azurecli-interactive
    kubectl get events 
    ```

    The following example output shows some of the above events listed during an upgrade:

    ```output
    ...
    default 2m1s Normal Drain node/aks-nodepool1-96663640-vmss000001 Draining node: [aks-nodepool1-96663640-vmss000001]
    ...
    default 9m22s Normal Surge node/aks-nodepool1-96663640-vmss000002 Created a surge node [aks-nodepool1-96663640-vmss000002 nodepool1] for agentpool %!s(MISSING)
    ...
    ```

## Next steps

To learn how to configure automatic upgrades, see [Configure automatic upgrades for an AKS cluster][configure-automatic-aks-upgrades].

<!-- LINKS - internal -->
[azure-cli-install]: /cli/azure/install-azure-cli
[azure-powershell-install]: /powershell/azure/install-az-ps
[az-aks-get-upgrades]: /cli/azure/aks#az_aks_get_upgrades
[az-aks-upgrade]: /cli/azure/aks#az_aks_upgrade
[set-azakscluster]: /powershell/module/az.aks/set-azakscluster
[az-aks-show]: /cli/azure/aks#az_aks_show
[get-azakscluster]: /powershell/module/az.aks/get-azakscluster
[aks-auto-upgrade]: auto-upgrade-cluster.md
[k8s-deprecation]: https://kubernetes.io/blog/2022/11/18/upcoming-changes-in-kubernetes-1-26/#:~:text=A%20deprecated%20API%20is%20one%20that%20has%20been,point%20you%20must%20migrate%20to%20using%20the%20replacement
[azure-rp-operations]: ../role-based-access-control/built-in-roles.md#containers
[get-azaksversion]: /powershell/module/az.aks/get-azaksversion
[az-aks-nodepool-add]: /cli/azure/aks/nodepool#az_aks_nodepool_add
[az-aks-nodepool-update]: /cli/azure/aks/nodepool#az_aks_nodepool_update
[az-aks-nodepool-upgrade]: /cli/azure/aks/nodepool#az_aks_nodepool_upgrade
[configure-automatic-aks-upgrades]: ./upgrade-cluster.md#configure-automatic-upgrades
[release-tracker]: release-tracker.md

<!-- LINKS - external -->
[kubernetes-drain]: https://kubernetes.io/docs/tasks/administer-cluster/safely-drain-node/
