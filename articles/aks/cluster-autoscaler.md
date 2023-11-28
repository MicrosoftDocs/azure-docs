---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your Azure Kubernetes Service (AKS) clusters to meet application demands.
ms.topic: article
ms.custom: devx-track-azurecli
ms.date: 09/26/2023
---

# Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)

To keep up with application demands in Azure Kubernetes Service (AKS), you might need to adjust the number of nodes that run your workloads. The cluster autoscaler component watches for pods in your cluster that can't be scheduled because of resource constraints. When the cluster autoscaler detects issues, it scales up the number of nodes in the node pool to meet the application demand. It also regularly checks nodes for a lack of running pods and scales down the number of nodes as needed.

This article shows you how to enable and manage the cluster autoscaler in an AKS cluster, which is based on the open source [Kubernetes][kubernetes-cluster-autoscaler] version.

## Before you begin

This article requires Azure CLI version 2.0.76 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## About the cluster autoscaler

To adjust to changing application demands, such as between workdays and evenings or weekends, clusters often need a way to automatically scale. AKS clusters can scale in the following ways:

* The **cluster autoscaler** periodically checks for pods that can't be scheduled on nodes because of resource constraints. The cluster then automatically increases the number of nodes. For more information, see [How does scale-up work?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-up-work).
* The **[Horizontal Pod Autoscaler][horizontal-pod-autoscaler]** uses the Metrics Server in a Kubernetes cluster to monitor the resource demand of pods. If an application needs more resources, the number of pods is automatically increased to meet the demand.
* **[Vertical Pod Autoscaler][vertical-pod-autoscaler]** (preview) automatically sets resource requests and limits on containers per workload based on past usage to ensure pods are scheduled onto nodes that have the required CPU and memory resources.

:::image type="content" source="media/cluster-autoscaler/cluster-autoscaler.png" alt-text="Screenshot of how the cluster autoscaler and horizontal pod autoscaler often work together to support the required application demands.":::

The Horizontal Pod Autoscaler scales the number of pod replicas as needed, and the cluster autoscaler scales the number of nodes in a node pool as needed. The cluster autoscaler decreases the number of nodes when there has been unused capacity after a period of time. Any pods on a node removed by the cluster autoscaler are safely scheduled elsewhere in the cluster.

While Vertical Pod Autoscaler or Horizontal Pod Autoscaler can be used to automatically adjust the number of Kubernetes pods in a workload, the number of nodes also needs to be able to scale to meet the computational needs of the pods. The cluster autoscaler addresses that need, handling scale up and scale down of Kubernetes nodes. It is common practice to enable cluster autoscaler for nodes, and either Vertical Pod Autoscaler or Horizontal Pod Autoscalers for pods.

The cluster autoscaler and Horizontal Pod Autoscaler can work together and are often both deployed in a cluster. When combined, the Horizontal Pod Autoscaler runs the number of pods required to meet application demand, and the cluster autoscaler runs the number of nodes required to support the scheduled pods.

> [!NOTE]
> Manual scaling is disabled when you use the cluster autoscaler. Let the cluster autoscaler determine the required number of nodes. If you want to manually scale your cluster, [disable the cluster autoscaler](#disable-the-cluster-autoscaler-on-a-cluster).

With cluster autoscaler enabled, when the node pool size is lower than the minimum or greater than the maximum it applies the scaling rules. Next, the autoscaler waits to take effect until a new node is needed in the node pool or until a node might be safely deleted from the current node pool. For more information, see [How does scale-down work?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-down-work)

The cluster autoscaler might be unable to scale down if pods can't move, such as in the following situations:

* A directly created pod not backed by a controller object, such as a deployment or replica set.
* A pod disruption budget (PDB) is too restrictive and doesn't allow the number of pods to fall below a certain threshold.
* A pod uses node selectors or anti-affinity that can't be honored if scheduled on a different node.

For more information, see [What types of pods can prevent the cluster autoscaler from removing a node?][autoscaler-scaledown]

## Use the cluster autoscaler on your AKS cluster

In this section, you deploy, upgrade, disable, or re-enable the cluster autoscaler on your cluster.

The cluster autoscaler uses startup parameters for things like time intervals between scale events and resource thresholds. For more information on what parameters the cluster autoscaler uses, see [using the autoscaler profile](#use-the-cluster-autoscaler-profile).

### Enable the cluster autoscaler on a new cluster

> [!IMPORTANT]
> The cluster autoscaler is a Kubernetes component. Although the AKS cluster uses a virtual machine scale set for the nodes, don't manually enable or edit settings for scale set autoscale in the Azure portal or using the Azure CLI. Let the Kubernetes cluster autoscaler manage the required scale settings. For more information, see [Can I modify the AKS resources in the node resource group?][aks-faq-node-resource-group]

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

> [!IMPORTANT]
> The cluster autoscaler is a Kubernetes component. Although the AKS cluster uses a virtual machine scale set for the nodes, don't manually enable or edit settings for scale set autoscale in the Azure portal or using the Azure CLI. Let the Kubernetes cluster autoscaler manage the required scale settings. For more information, see [Can I modify the AKS resources in the node resource group?][aks-faq-node-resource-group]

#### [Azure CLI](#tab/azure-cli)

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

#### [Portal](#tab/azure-portal)

1. To enable cluster autoscaler on your existing cluster’s node pools, navigate to *Node pools* from your cluster's overview page in the Azure portal. Select the *scale method* for the node pool you’d like to adjust scaling settings for.

    :::image type="content" source="./media/cluster-autoscaler/main-blade-column-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's node pools. The column for 'Scale method' is highlighted." lightbox="./media/cluster-autoscaler/main-blade-column.png":::

1. From here, you can enable or disable autoscaling, adjust minimum and maximum node count, and learn more about your node pool’s size, capacity, and usage. Select *Apply* to save your changes.

    :::image type="content" source="./media/cluster-autoscaler/menu-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's node pools is shown with the 'Scale node pool' menu expanded. The 'Apply' button is highlighted." lightbox="./media/cluster-autoscaler/menu.png":::

---

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
> You can manually scale your cluster after disabling the cluster autoscaler using the [`az aks scale`][az-aks-scale] command. If you use the horizontal pod autoscaler, that feature continues to run with the cluster autoscaler disabled, but pods might end up unable to be scheduled if all node resources are in use.

### Re-enable a disabled cluster autoscaler

You can re-enable the cluster autoscaler on an existing cluster using the [`az aks update`][az-aks-update-preview] command and specifying the `--enable-cluster-autoscaler`, `--min-count`, and `--max-count` parameters.

## Change the cluster autoscaler settings

> [!IMPORTANT]
> If you have multiple node pools in your AKS cluster, skip to the [autoscale with multiple agent pools section](#use-the-cluster-autoscaler-with-multiple-node-pools-enabled). Clusters with multiple agent pools require the `az aks nodepool` command instead of `az aks`.

In our example to enable cluster autoscaling, your cluster autoscaler's minimum node count was set to one and maximum node count was set to three. As your application demands change, you need to adjust the cluster autoscaler node count to scale efficiently.

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

Monitor the performance of your applications and services, and adjust the cluster autoscaler node counts to match the required performance.

## Use the cluster autoscaler profile

You can also configure more granular details of the cluster autoscaler by changing the default values in the cluster-wide autoscaler profile. For example, a scale down event happens after nodes are under-utilized after 10 minutes. If you have workloads that run every 15 minutes, you might want to change the autoscaler profile to scale down under-utilized nodes after 15 or 20 minutes. When you enable the cluster autoscaler, a default profile is used unless you specify different settings. The cluster autoscaler profile has the following settings you can update:

* Example profile update that scales after 15 minutes and changes after 10 minutes of idle use.

    ```azurecli-interactive
    az aks update \
      -g learn-aks-cluster-scalability \
      -n learn-aks-cluster-scalability \
      --cluster-autoscaler-profile scan-interval=5s \
        scale-down-unready-time=10m \
        scale-down-delay-after-add=15m
    ```

| Setting                          | Description                                                                              | Default value |
|----------------------------------|------------------------------------------------------------------------------------------|---------------|
| scan-interval                    | How often cluster is reevaluated for scale up or down                                    | 10 seconds    |
| scale-down-delay-after-add       | How long after scale up that scale down evaluation resumes                               | 10 minutes    |
| scale-down-delay-after-delete    | How long after node deletion that scale down evaluation resumes                          | scan-interval |
| scale-down-delay-after-failure   | How long after scale down failure that scale down evaluation resumes                     | 3 minutes     |
| scale-down-unneeded-time         | How long a node should be unneeded before it's eligible for scale down                  | 10 minutes    |
| scale-down-unready-time          | How long an unready node should be unneeded before it's eligible for scale down         | 20 minutes    |
| ignore-daemonsets-utilization (Preview)     | Whether DaemonSet pods will be ignored when calculating resource utilization for scaling down | false |
| daemonset-eviction-for-empty-nodes (Preview) | Whether DaemonSet pods will be gracefully terminated from empty nodes | false |
| daemonset-eviction-for-occupied-nodes (Preview) | Whether DaemonSet pods will be gracefully terminated from non-empty nodes | true |
| scale-down-utilization-threshold | Node utilization level, defined as sum of requested resources divided by capacity, in which a node can be considered for scale down | 0.5 |
| max-graceful-termination-sec     | Maximum number of seconds the cluster autoscaler waits for pod termination when trying to scale down a node | 600 seconds   |
| balance-similar-node-groups | Detects similar node pools and balances the number of nodes between them | false |
| balance-similar-node-groups      | Detects similar node pools and balances the number of nodes between them                 | false         |
| expander                         | Type of node pool [expander](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders) to be used in scale up. Possible values: `most-pods`, `random`, `least-waste`, `priority` | random |
| skip-nodes-with-local-storage    | If true, cluster autoscaler doesn't delete nodes with pods with local storage, for example, EmptyDir or HostPath | true |
| skip-nodes-with-system-pods      | If true, cluster autoscaler doesn't delete nodes with pods from kube-system (except for DaemonSet or mirror pods) | true |
| max-empty-bulk-delete            | Maximum number of empty nodes that can be deleted at the same time                       | 10 nodes      |
| new-pod-scale-up-delay           | For scenarios like burst/batch scale where you don't want CA to act before the kubernetes scheduler could schedule all the pods, you can tell CA to ignore unscheduled pods before they're a certain age.                                                                                                                | 0 seconds    |
| max-total-unready-percentage     | Maximum percentage of unready nodes in the cluster. After this percentage is exceeded, CA halts operations | 45% |
| max-node-provision-time          | Maximum time the autoscaler waits for a node to be provisioned                           | 15 minutes    |
| ok-total-unready-count           | Number of allowed unready nodes, irrespective of max-total-unready-percentage            | Three nodes       |

> [!IMPORTANT]
> When using the autoscaler profile, keep the following information in mind:
>
> * The cluster autoscaler profile affects **all node pools** that use the cluster autoscaler. You can't set an autoscaler profile per node pool. When you set the profile, any existing node pools with the cluster autoscaler enabled immediately start using the profile.
> * The cluster autoscaler profile requires Azure CLI version *2.11.1* or later. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].
> * To access preview features use the aks-preview extension version 0.5.126 or later

[!INCLUDE [preview features callout](./includes/preview/preview-callout.md)]

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

Use the following steps to configure logs to be pushed from the cluster autoscaler into Log Analytics:

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

### [Portal](#tab/azure-portal)

1. Navigate to *Node pools* from your cluster's overview page in the Azure portal. Select any of the tiles for autoscale events, autoscale warnings, or scale-ups not triggered to get more details.

    :::image type="content" source="./media/cluster-autoscaler/main-blade-tiles-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's node pools. The section displaying autoscaler events, warning, and scale-ups not triggered is highlighted." lightbox="./media/cluster-autoscaler/main-blade-tiles.png":::

1. You’ll see a list of Kubernetes events filtered to `source: cluster-autoscaler` that have occurred within the last hour. With this information, you’ll be able to troubleshoot and diagnose any issues that might arise while scaling your nodes.

    :::image type="content" source="./media/cluster-autoscaler/events-inline.png" alt-text="Screenshot of the Azure portal page for a cluster's events. The filter for source is highlighted, showing 'source: cluster-autoscaler'." lightbox="./media/cluster-autoscaler/events.png":::

---

To learn more about the autoscaler logs, see the [Kubernetes/autoscaler GitHub project FAQ][kubernetes-faq].

## Use the cluster autoscaler with node pools

### Use the cluster autoscaler with multiple node pools enabled

You can use the cluster autoscaler with [multiple node pools][aks-multiple-node-pools] enabled. When using both features together, you can enable the cluster autoscaler on each individual node pool in the cluster and pass unique autoscaling rules to each node pool.

* Update the settings on an existing node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command. The following command continues from the [previous steps](#enable-the-cluster-autoscaler-on-a-new-cluster) in this article:

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

* Re-enable the cluster autoscaler on a node pool using the [`az aks nodepool update`][az-aks-nodepool-update] command and specifying the `--enable-cluster-autoscaler`, `--min-count`, and `--max-count` parameters.

    ```azurecli-interactive
    az aks nodepool update \
      --resource-group myResourceGroup \
      --cluster-name myAKSCluster \
      --name nodepool1 \
      --enable-cluster-autoscaler \
      --min-count 1 \
      --max-count 5
    ```

    > [!NOTE]
    > If you plan on using the cluster autoscaler with node pools that span multiple zones and leverage scheduling features related to zones, such as volume topological scheduling, we recommend you have one node pool per zone and enable the `--balance-similar-node-groups` through the autoscaler profile. This ensures the autoscaler can successfully scale up and keep the sizes of the node pools balanced.

## Configure the horizontal pod autoscaler

Kubernetes supports [horizontal pod autoscaling][kubernetes-hpa] to adjust the number of pods in a deployment depending on CPU utilization or other select metrics. The [Metrics Server][metrics-server] provides resource utilization to Kubernetes. You can configure horizontal pod autoscaling through the `kubectl autoscale` command or through a manifest. For more information on using the horizontal pod autoscaler, see the [HorizontalPodAutoscaler walkthrough][kubernetes-hpa-walkthrough].

## Next steps

This article showed you how to automatically scale the number of AKS nodes. You can also use the horizontal pod autoscaler to automatically adjust the number of pods that run your application. For steps on using the horizontal pod autoscaler, see [Scale applications in AKS][aks-scale-apps].

To further help improve cluster resource utilization and free up CPU and memory for other pods, see [Vertical Pod Autoscaler][vertical-pod-autoscaler].

<!-- LINKS - internal -->
[aks-faq-node-resource-group]: faq.md#can-i-modify-tags-and-other-properties-of-the-aks-resources-in-the-node-resource-group
[aks-multiple-node-pools]: create-node-pools.md
[aks-scale-apps]: tutorial-kubernetes-scale.md
[aks-view-master-logs]: monitor-aks.md#aks-control-planeresource-logs
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-scale]: /cli/azure/aks#az-aks-scale
[vertical-pod-autoscaler]: vertical-pod-autoscaler.md
[horizontal-pod-autoscaler]:concepts-scale.md#horizontal-pod-autoscaler
[az-group-create]: /cli/azure/group#az_group_create

<!-- LINKS - external -->
[az-aks-update-preview]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[az-aks-nodepool-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview#enable-cluster-auto-scaler-for-a-node-pool
[autoscaler-scaledown]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-types-of-pods-can-prevent-ca-from-removing-a-node
[kubernetes-faq]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#ca-doesnt-work-but-it-used-to-work-yesterday-why
[kubernetes-hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
[kubernetes-hpa-walkthrough]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
[metrics-server]: https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server
[kubernetes-cluster-autoscaler]: https://github.com/kubernetes/autoscaler/tree/master/cluster-autoscaler
