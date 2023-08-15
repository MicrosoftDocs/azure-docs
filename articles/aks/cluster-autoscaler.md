---
title: Use the cluster autoscaler in Azure Kubernetes Service (AKS)
description: Learn how to use the cluster autoscaler to automatically scale your Azure Kubernetes Service (AKS) clusters to meet application demands.
ms.topic: article
ms.date: 07/14/2023
---

# Automatically scale a cluster to meet application demands on Azure Kubernetes Service (AKS)

To keep up with application demands in Azure Kubernetes Service (AKS), you may need to adjust the number of nodes that run your workloads. The cluster autoscaler component watches for pods in your cluster that can't be scheduled because of resource constraints. When the cluster autoscaler detects issues, it scales up the number of nodes in the node pool to meet the application demand. It also regularly checks nodes for a lack of running pods and scales down the number of nodes as needed.

This article shows you how to enable and manage the cluster autoscaler in an AKS cluster.

## Before you begin

This article requires Azure CLI version 2.0.76 or later. Run `az --version` to find the version. If you need to install or upgrade, see [Install Azure CLI][azure-cli-install].

## About the cluster autoscaler

To adjust to changing application demands, such as between workdays and evenings or weekends, clusters often need a way to automatically scale. AKS clusters can scale in one of two ways:

* The **cluster autoscaler** watches for pods that can't be scheduled on nodes because of resource constraints. The cluster then automatically increases the number of nodes.
* The **horizontal pod autoscaler** uses the Metrics Server in a Kubernetes cluster to monitor the resource demand of pods. If an application needs more resources, the number of pods is automatically increased to meet the demand.

![The cluster autoscaler and horizontal pod autoscaler often work together to support the required application demands](media/autoscaler/cluster-autoscaler.png)

Both the horizontal pod autoscaler and cluster autoscaler can decrease the number of pods and nodes as needed. The cluster autoscaler decreases the number of nodes when there has been unused capacity for a period of time. Any pods on a node to be removed by the cluster autoscaler are safely scheduled elsewhere in the cluster.

If the current node pool size is lower than the specified minimum or greater than the specified maximum when you enable autoscaling, the autoscaler waits to take effect until a new node is needed in the node pool or until a node can be safely deleted from the node pool. For more information, see [How does scale-down work?](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#how-does-scale-down-work)

The cluster autoscaler may be unable to scale down if pods can't move, such as in the following situations:

* A pod is directly created and isn't backed by a controller object, such as a deployment or replica set.
* A pod disruption budget (PDB) is too restrictive and doesn't allow the number of pods to fall below a certain threshold.
* A pod uses node selectors or anti-affinity that can't be honored if scheduled on a different node.

For more information, see [What types of pods can prevent the cluster autoscaler from removing a node?][autoscaler-scaledown]

The cluster autoscaler uses startup parameters for things like time intervals between scale events and resource thresholds. For more information on what parameters the cluster autoscaler uses, see [using the autoscaler profile](#use-the-cluster-autoscaler-profile).

The cluster autoscaler and horizontal pod autoscaler can work together and are often both deployed in a cluster. When combined, the horizontal pod autoscaler runs the number of pods required to meet application demand, and the cluster autoscaler runs the number of nodes required to support the scheduled pods.

> [!NOTE]
> Manual scaling is disabled when you use the cluster autoscaler. Let the cluster autoscaler determine the required number of nodes. If you want to manually scale your cluster, [disable the cluster autoscaler](#disable-the-cluster-autoscaler-on-a-cluster).

## Use the cluster autoscaler on your AKS cluster

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
> You can manually scale your cluster after disabling the cluster autoscaler using the [`az aks scale`][az-aks-scale] command. If you use the horizontal pod autoscaler, that feature continues to run with the cluster autoscaler disabled, but pods may end up unable to be scheduled if all node resources are in use.

### Re-enable a disabled cluster autoscaler

You can re-enable the cluster autoscaler on an existing cluster using the [`az aks update`][az-aks-update-preview] command and specifying the `--enable-cluster-autoscaler`, `--min-count`, and `--max-count` parameters.

## Change the cluster autoscaler settings

> [!IMPORTANT]
> If you have multiple node pools in your AKS cluster, skip to the [autoscale with multiple agent pools section](#use-the-cluster-autoscaler-with-multiple-node-pools-enabled). Clusters with multiple agent pools require the `az aks nodepool` command instead of `az aks`.

In the previous step to create an AKS cluster or update an existing node pool, the cluster autoscaler minimum node count was set to one and the maximum node count was set to three. As your application demands change, you may need to adjust the cluster autoscaler node count.

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

You can also configure more granular details of the cluster autoscaler by changing the default values in the cluster-wide autoscaler profile. For example, a scale down event happens after nodes are under-utilized after 10 minutes. If you have workloads that run every 15 minutes, you may want to change the autoscaler profile to scale down under-utilized nodes after 15 or 20 minutes. When you enable the cluster autoscaler, a default profile is used unless you specify different settings. The cluster autoscaler profile has the following settings you can update:

| Setting                          | Description                                                                              | Default value |
|----------------------------------|------------------------------------------------------------------------------------------|---------------|
| scan-interval                    | How often cluster is reevaluated for scale up or down                                    | 10 seconds    |
| scale-down-delay-after-add       | How long after scale up that scale down evaluation resumes                               | 10 minutes    |
| scale-down-delay-after-delete    | How long after node deletion that scale down evaluation resumes                          | scan-interval |
| scale-down-delay-after-failure   | How long after scale down failure that scale down evaluation resumes                     | 3 minutes     |
| scale-down-unneeded-time         | How long a node should be unneeded before it's eligible for scale down                  | 10 minutes    |
| scale-down-unready-time          | How long an unready node should be unneeded before it's eligible for scale down         | 20 minutes    |
| scale-down-utilization-threshold | Node utilization level, defined as sum of requested resources divided by capacity, below which a node can be considered for scale down | 0.5 |
| max-graceful-termination-sec     | Maximum number of seconds the cluster autoscaler waits for pod termination when trying to scale down a node | 600 seconds   |
| balance-similar-node-groups      | Detects similar node pools and balances the number of nodes between them                 | false         |
| expander                         | Type of node pool [expander](https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-are-expanders) to be used in scale up. Possible values: `most-pods`, `random`, `least-waste`, `priority` | random |
| skip-nodes-with-local-storage    | If true, cluster autoscaler doesn't delete nodes with pods with local storage, for example, EmptyDir or HostPath | false |
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

Use the following steps to configure logs to be pushed from the cluster autoscaler into Log Analytics:

1. Set up a rule for resource logs to push cluster autoscaler logs to Log Analytics using the [instructions here][aks-view-master-logs]. Make sure you check the box for `cluster-autoscaler` when selecting options for **Logs**.
2. Select the **Log** section on your cluster.
3. Enter the following example query into Log Analytics:

    ```kusto
    AzureDiagnostics
    | where Category == "cluster-autoscaler"
    ```

    As long as there are logs to retrieve, you should see logs similar to the following logs:

    ![Log Analytics logs](media/autoscaler/autoscaler-logs.png)

    The cluster autoscaler also writes out the health status to a `configmap` named `cluster-autoscaler-status`. You can retrieve these logs using the following `kubectl` command:

    ```bash
    kubectl get configmap -n kube-system cluster-autoscaler-status -o yaml
    ```

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
[aks-view-master-logs]: ../azure-monitor/containers/monitor-kubernetes.md#configure-monitoring
[azure-cli-install]: /cli/azure/install-azure-cli
[az-aks-create]: /cli/azure/aks#az-aks-create
[az-aks-update]: /cli/azure/aks#az-aks-update
[az-aks-scale]: /cli/azure/aks#az-aks-scale
[vertical-pod-autoscaler]: vertical-pod-autoscaler.md
[az-group-create]: /cli/azure/group#az_group_create

<!-- LINKS - external -->
[az-aks-update-preview]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview
[az-aks-nodepool-update]: https://github.com/Azure/azure-cli-extensions/tree/master/src/aks-preview#enable-cluster-auto-scaler-for-a-node-pool
[autoscaler-scaledown]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#what-types-of-pods-can-prevent-ca-from-removing-a-node
[kubernetes-faq]: https://github.com/kubernetes/autoscaler/blob/master/cluster-autoscaler/FAQ.md#ca-doesnt-work-but-it-used-to-work-yesterday-why
[kubernetes-hpa]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/
[kubernetes-hpa-walkthrough]: https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale-walkthrough/
[metrics-server]: https://kubernetes.io/docs/tasks/debug-application-cluster/resource-metrics-pipeline/#metrics-server
