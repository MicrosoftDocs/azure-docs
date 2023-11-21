---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your Azure Kubernetes Service (AKS) workloads to meet application demands.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 11/21/2023
---

# Use the cluster autoscaler in Azure Kubernetes Service (AKS)

To keep up with application demands in AKS, you might need to adjust the number of nodes that run your workloads. The cluster autoscaler component watches for pods in your cluster that can't be scheduled because of resource constraints. When the cluster autoscaler detects issues, it scales up the number of nodes in the node pool to meet the application demands. It also regularly checks nodes for a lack of running pods and scales down the number of nodes as needed.

This article shows you how to enable and manage the cluster autoscaler in AKS, which is based on the [open-source Kubernetes version][kubernetes-cluster-autoscaler].

## Before you begin

This article requires Azure CLI version 2.0.76 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## Use the cluster autoscaler on an AKS cluster

> [!IMPORTANT]
> The cluster autoscaler is a Kubernetes component. Although the AKS cluster uses a virtual machine scale set for the nodes, don't manually enable or edit settings for scale set autoscaling. Let the Kubernetes cluster autoscaler manage the required scale settings. For more information, see [Can I modify the AKS resources in the node resource group?][aks-faq-node-resource-group]

### Enable the cluster autoscaler on a new cluster

1. Create a resource group using the [`az group create`][az-group-create] command.

    ```azurecli-interactive
    az group create --name myResourceGroup --location eastus
    ```

2. Create an AKS cluster using the [`az aks create`][az-aks-create] command and enable and configure the cluster autoscaler on the node pool for the cluster using the `--enable-cluster-autoscaler` parameter and specifying a node `--min-count` and `--max-count`. The following example command creates a cluster with a single node backed by a virtual machine scale set, enables the cluster autoscaler, sets a minimum of one and maximum of three nodes:

    ```azurecli-interactive
    az aks create \
    --resource-group myResourceGroup \
    --name myAKSCluster \
    --node-count 1 \
    --vm-set-type VirtualMachineScaleSets \
    --load-balancer-sku standard \
    --enable-cluster-autoscaler \
    --min-count 1 \
    --max-count 3
    ```

    It takes a few minutes to create the cluster and configure the cluster autoscaler settings.

### Enable the cluster autoscaler on an existing cluster

* Update an existing cluster using the [`az aks update`][az-aks-update] command and enable and configure the cluster autoscaler on the node pool using the `--enable-cluster-autoscaler` parameter and specifying a node `--min-count` and `--max-count`. The following example command updates an existing AKS cluster to enable the cluster autoscaler on the node pool for the cluster and sets a minimum of one and maximum of three nodes:

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --enable-cluster-autoscaler \
      --min-count 1 \
      --max-count 3
    ```

    It takes a few minutes to update the cluster and configure the cluster autoscaler settings.

### Disable the cluster autoscaler on a cluster

* Disable the cluster autoscaler using the [`az aks update`][az-aks-update-preview] command and the `--disable-cluster-autoscaler` parameter.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --disable-cluster-autoscaler
    ```

    Nodes aren't removed when the cluster autoscaler is disabled.

> [!NOTE]
> You can manually scale your cluster after disabling the cluster autoscaler using the [`az aks scale`][az-aks-scale] command. If you use the horizontal pod autoscaler, it continues to run with the cluster autoscaler disabled, but pods might end up unable to be scheduled if all node resources are in use.

### Re-enable the cluster autoscaler on a cluster

You can re-enable the cluster autoscaler on an existing cluster using the [`az aks update`][az-aks-update-preview] command and specifying the `--enable-cluster-autoscaler`, `--min-count`, and `--max-count` parameters.

## Use the cluster autoscaler on node pools

### Use the cluster autoscaler on multiple node pools

You can use the cluster autoscaler with [multiple node pools][aks-multiple-node-pools] and can enable the cluster autoscaler on each individual node pool and pass unique autoscaling rules to them.

* Update the settings on an existing node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command.

    ```azurecli-interactive
    az aks nodepool update \
      --resource-group myResourceGroup \
      --cluster-name myAKSCluster \
      --name nodepool1 \
      --update-cluster-autoscaler \
      --min-count 1 \
      --max-count 5
    ```

### Disable the cluster autoscaler on a node pool

* Disable the cluster autoscaler on a node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command and the `--disable-cluster-autoscaler` parameter.

    ```azurecli-interactive
    az aks nodepool update \
      --resource-group myResourceGroup \
      --cluster-name myAKSCluster \
      --name nodepool1 \
      --disable-cluster-autoscaler
    ```

### Re-enable the cluster autoscaler on a node pool

You can re-enable the cluster autoscaler on a node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command and specifying the `--enable-cluster-autoscaler`, `--min-count`, and `--max-count` parameters.

> [!NOTE]
> If you plan on using the cluster autoscaler with node pools that span multiple zones and leverage scheduling features related to zones, such as volume topological scheduling, we recommend you have one node pool per zone and enable `--balance-similar-node-groups` through the autoscaler profile. This ensures the autoscaler can successfully scale up and keep the sizes of the node pools balanced.

## Update the cluster autoscaler settings

As your application demands change, you might need to adjust the cluster autoscaler node count to scale efficiently.

* Change the node count using the [`az aks update`][az-aks-update] command and update the cluster autoscaler using the `--update-cluster-autoscaler` parameter and specifying your updated node `--min-count` and `--max-count`.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --update-cluster-autoscaler \
      --min-count 1 \
      --max-count 5
    ```

> [!NOTE]
> The cluster autoscaler enforces the minimum count in cases where the actual count drops below the minimum due to external factors, such as during a spot eviction or when changing the minimum count value from the AKS API.

## Use the cluster autoscaler profile

You can configure more granular details of the cluster autoscaler by changing the default values in the cluster-wide autoscaler profile. For example, a scale down event happens after nodes are under-utilized after 10 minutes. If you have workloads that run every 15 minutes, you might want to change the autoscaler profile to scale down under-utilized nodes after 15 or 20 minutes. When you enable the cluster autoscaler, a default profile is used unless you specify different settings.

> [!IMPORTANT]
> The cluster autoscaler profile affects **all node pools** that use the cluster autoscaler. You can't set an autoscaler profile per node pool. When you set the profile, any existing node pools with the cluster autoscaler enabled immediately start using the profile.

### Cluster autoscaler profile settings

| Setting                          | Description                                                                              | Default value |
|----------------------------------|------------------------------------------------------------------------------------------|---------------|
| `scan-interval`                    | How often the cluster is reevaluated for scale up or down.                                    | 10 seconds    |
| `scale-down-delay-after-add`       | How long after scale up that scale down evaluation resumes.                               | 10 minutes    |
| `scale-down-delay-after-delete`    | How long after node deletion that scale down evaluation resumes.                          | `scan-interval` |
| `scale-down-delay-after-failure`   | How long after scale down failure that scale down evaluation resumes.                     | Three minutes     |
| `scale-down-unneeded-time`         | How long a node should be unneeded before it's eligible for scale down.                  | 10 minutes    |
| `scale-down-unready-time`          | How long an unready node should be unneeded before it's eligible for scale down.         | 20 minutes    |
| `ignore-daemonsets-utilization` (Preview)     | Whether DaemonSet pods will be ignored when calculating resource utilization for scale down. | `false` |
| `daemonset-eviction-for-empty-nodes` (Preview) | Whether DaemonSet pods will be gracefully terminated from empty nodes. | `false` |
| `daemonset-eviction-for-occupied-nodes` (Preview) | Whether DaemonSet pods will be gracefully terminated from non-empty nodes. | `true` |
| `scale-down-utilization-threshold` | Node utilization level, defined as sum of requested resources divided by capacity, in which a node can be considered for scale down. | 0.5 |
| `max-graceful-termination-sec`     | Maximum number of seconds the cluster autoscaler waits for pod termination when trying to scale down a node. | 600 seconds   |
| `balance-similar-node-groups` | Detects similar node pools and balances the number of nodes between them. | `false` |
| `balance-similar-node-groups`      | Detects similar node pools and balances the number of nodes between them.                 | `false`         |
| `expander                         | Type of node pool [expander](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders) to use in scale up. Possible values include `most-pods`, `random`, `least-waste`, and `priority`. |  |
| `skip-nodes-with-local-storage`    | If `true`, cluster autoscaler doesn't delete nodes with pods with local storage, for example, EmptyDir or HostPath. | `true` |
| `skip-nodes-with-system-pods`      | If `true`, cluster autoscaler doesn't delete nodes with pods from kube-system (except for DaemonSet or mirror pods). | `true` |
| `max-empty-bulk-delete`            | Maximum number of empty nodes that can be deleted at the same time.                       | 10 nodes      |
| `new-pod-scale-up-delay`           | For scenarios such as burst/batch scale where you don't want CA to act before the Kubernetes scheduler could schedule all the pods, you can tell CA to ignore unscheduled pods before they reach a certain age.                                                                                                                | 0 seconds    |
| `max-total-unready-percentage`     | Maximum percentage of unready nodes in the cluster. After this percentage is exceeded, CA halts operations. | 45% |
| `max-node-provision-time`          | Maximum time the autoscaler waits for a node to be provisioned.                           | 15 minutes    |
| `ok-total-unready-count`           | Number of allowed unready nodes, irrespective of max-total-unready-percentage.            | Three nodes       |

### Set the cluster autoscaler profile on a new cluster

* Create an AKS cluster using the [`az aks create`][az-aks-create] command and set the cluster autoscaler profile using the `cluster-autoscaler-profile` parameter.

    ```azurecli-interactive
    az aks create \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --node-count 1 \
      --enable-cluster-autoscaler \
      --min-count 1 \
      --max-count 3 \
      --cluster-autoscaler-profile scan-interval=30s
    ```

### Set the cluster autoscaler profile on an existing cluster

* Set the cluster autoscaler on an existing cluster using the [`az aks update`][az-aks-update-preview] command and the `cluster-autoscaler-profile` parameter. The following example configures the scan interval setting as *30s*:

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --cluster-autoscaler-profile scan-interval=30s
    ```

### Reset cluster autoscaler profile to default values

* Reset the cluster autoscaler profile using the [`az aks update`][az-aks-update-preview] command.

    ```azurecli-interactive
    az aks update \
      --resource-group myResourceGroup \
      --name myAKSCluster \
      --cluster-autoscaler-profile ""
    ```

## Retrieve cluster autoscaler logs and status updates

You can retrieve logs and status updates from the cluster autoscaler to help diagnose and debug autoscaler events. AKS manages the cluster autoscaler on your behalf and runs it in the managed control plane. You can enable control plane node to see the logs and operations from the cluster autoscaler.

### [Azure CLI](#tab/azure-cli)

1. Set up a rule for resource logs to push cluster autoscaler logs to Log Analytics using the [instructions here][aks-view-master-logs]. Make sure you check the box for `cluster-autoscaler` when selecting options for **Logs**.
2. Select the **Log** section on your cluster.
3. Enter the following example query into Log Analytics:

    ```kusto
    AzureDiagnostics
    | where Category == "cluster-autoscaler"
    ```

    As long as there are logs to retrieve, you should see logs similar to the following logs:

    :::image type="content" source="media/cluster-autoscaler/autoscaler-logs.png" alt-text="Screenshot of Log Analytics logs.":::

    The cluster autoscaler also writes out the health status to a `configmap` named `cluster-autoscaler-status`. You can retrieve these logs using the following `kubectl` command:

    ```bash
    kubectl get configmap -n kube-system cluster-autoscaler-status -o yaml
    ```

### [Azure portal](#tab/azure-portal)

* Navigate to *Node pools* from your cluster's overview page in the Azure portal. Select any of the tiles for autoscale events, autoscale warnings, or scale ups not triggered to get more details.

    :::image type="content" source="./media/cluster-autoscaler/main-blade-tiles-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's node pools. The section displaying autoscaler events, warning, and scale ups not triggered is highlighted." lightbox="./media/cluster-autoscaler/main-blade-tiles.png":::

    This shows a list of Kubernetes events filtered to `source: cluster-autoscaler` that have occurred within the last hour. You can use this information troubleshoot and diagnose any issues that might arise while scaling your nodes.

    :::image type="content" source="./media/cluster-autoscaler/events-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's events. The filter for source is highlighted, showing 'source: cluster-autoscaler'." lightbox="./media/cluster-autoscaler/events.png":::

---

For more information, see the [Kubernetes/autoscaler GitHub project FAQ][kubernetes-faq].

## Next steps

This article showed you how to automatically scale the number of AKS nodes. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][aks-scale-apps].

To further help improve cluster resource utilization and free up CPU and memory for other pods, see [Vertical Pod Autoscaler][vertical-pod-autoscaler].

<!-- LINKS - internal -->
[aks-faq-node-resource-group]: faq.md#can-i-modify-tags-and-other-properties-of-the-aks-resources-in-the-node-resource-group
[aks-multiple-node-pools]: create-node-pools.md
[aks-scale-apps]: tutorial-kubernetes-scale.md
[aks-view-master-logs]: monitor-aks.md#resource-logs
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-scale]: /cli/azure/aks#az-aks-scale
[vertical-pod-autoscaler]: vertical-pod-autoscaler.md
[az-group-create]: /cli/azure/group#az_group_create

<!-- LINKS - external -->
[az-aks-update-preview]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[az-aks-nodepool-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview#enable-cluster-auto-scaler-for-a-node-pool
[kubernetes-faq]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#ca-doesnt-work-but-it-used-to-work-yesterday-why
[kubernetes-cluster-autoscaler]: https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler
