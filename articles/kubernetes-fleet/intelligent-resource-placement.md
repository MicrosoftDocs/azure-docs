---
title: "Intelligent cross-cluster Kubernetes resource placement using Azure Kubernetes Fleet Manager (Preview)"
description: Learn how to use Kubernetes Fleet to intelligently place your workloads on target member clusters based on cost and resource availability.
ms.topic: how-to
ms.date: 05/13/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
---

# Intelligent cross-cluster Kubernetes resource placement using Azure Kubernetes Fleet Manager (Preview)

Application developers often need to deploy Kubernetes resources into multiple clusters. Fleet operators often need to pick the best clusters for placing the workloads based on heuristics such as cost of compute in the clusters or available resources such as memory and CPU. It's tedious to create, update, and track these Kubernetes resources across multiple clusters manually. This article covers how Azure Kubernetes Fleet Manager (Kubernetes Fleet) allows you to address these scenarios using the intelligent Kubernetes resource placement feature.

## Overview

Kubernetes Fleet provides resource placement capability that can make scheduling decisions based on the following properties:
- Node count
- Cost of compute in target member clusters
- Resource (CPU/Memory) availability in target member clusters

[!INCLUDE [preview-callout](./includes/preview/preview-callout.md)]

## Prerequisites

* Read the [resource propagation conceptual overview](./concepts-resource-propagation.md) to understand the concepts and terminology used in this quickstart.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* You need a Fleet resource with a hub cluster and member clusters. If you don't have one, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI](quickstart-create-fleet-and-members.md).
* You need access to the Kubernetes API of the hub cluster. If you don't have access, see [Access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager](./quickstart-access-fleet-kubernetes-api.md).


## Filter clusters at the time of scheduling based on member cluster properties

**requiredDuringSchedulingIgnoredDuringExecution** affinity type allows for **filtering** the member clusters eligible for placement using property selectors. A property selector is an array of expression conditions against cluster properties.

In each condition you specify:

* **Name**: Name of the property, which should be in the following format:

    ```
    resources.kubernetes-fleet.io/<CAPACITY-TYPE>-<RESOURCE-NAME>
    ```

    `<CAPACITY-TYPE>` is one of `total`, `allocatable`, or `available`, depending on which capacity (usage information) you would like to check against, and `<RESOURCE-NAME>` is the name of the resource (CPU/memory).

    For example, if you would like to select clusters based on the available CPU capacity of a cluster, the name used in the property selector should be `resources.kubernetes-fleet.io/available-cpu`. For allocatable memory capacity, you can use `resources.kubernetes-fleet.io/allocatable-memory`.

* A list of values, which are possible values of the property.
* An operator used to express the condition between the constraint/desired value and the observed value on the cluster. The following operators are currently supported:

    * `Gt` (Greater than): a cluster's observed value of the given property must be greater than the value in the condition before it can be picked for resource placement.
    * `Ge` (Greater than or equal to): a cluster's observed value of the given property must be greater than or equal to the value in the condition before it can be picked for resource placement.
    * `Lt` (Less than): a cluster's observed value of the given property must be less than the value in the condition before it can be picked for resource placement.
    * `Le` (Less than or equal to): a cluster's observed value of the given property must be less than or equal to the value in the condition before it can be picked for resource placement.
    * `Eq` (Equal to): a cluster's observed value of the given property must be equal to the value in the condition before it can be picked for resource placement.
    * `Ne` (Not equal to): a cluster's observed value of the given property must be not equal to the value in the condition before it can be picked for resource placement.

    If you use the operator `Gt`, `Ge`, `Lt`, `Le`, `Eq`, or `Ne`, the list of values in the condition should have exactly one value.

Fleet evaluates each cluster based on the properties specified in the condition. Failure to satisfy conditions listed under `requiredDuringSchedulingIgnoredDuringExecution` excludes this member cluster from resource placement.

> [!NOTE]
> If a member cluster does not possess the property expressed in the condition, it will automatically fail the condition.

Example placement policy to select only clusters with greater than or equal to five nodes for resource placement:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp
spec:
  resourceSelectors:
    - ...
  policy:
    placementType: PickAll
    affinity:
        clusterAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
                clusterSelectorTerms:
                - propertySelector:
                    matchExpressions:
                    - name: "kubernetes.azure.com/node-count"
                      operator: Ge
                      values:
                      - "5"
```

You can use both label and property selectors under
`requiredDuringSchedulingIgnoredDuringExecution` affinity term to filter the eligible member clusters on both these constraints.

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp
spec:
  resourceSelectors:
    - ...
  policy:
    placementType: PickAll
    affinity:
        clusterAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
                clusterSelectorTerms:
                - labelSelector:
                    matchLabels:
                      region: east
                  propertySelector:
                    matchExpressions:
                    - name: "kubernetes.azure.com/node-count"
                      operator: Ge
                      values:
                      - "5"
```

In this example, Kubernetes Fleet only considers a cluster for resource placement if it has the `region=east` label and a node count greater than or equal to five.

## Rank order clusters at the time of scheduling based on member cluster properties

When `preferredDuringSchedulingIgnoredDuringExecution` is used, a property sorter ranks all the clusters in the fleet based on their values in the ascending or descending order. The weights are calculated based on the weight value specified under `preferredDuringSchedulingIgnoredDuringExecution`.

A property sorter consists of:

* **Name**: Name of the property with more information of the formatting of the property covered in the previous section.
* **Sort order**: Sort order can be either `Ascending` or `Descending`. When `Ascending` order is used, Kubernetes Fleet prefers member clusters with lower observed values. When `Descending` order is used, member clusters with higher observed value are preferred.

For sort order `Descending`, the proportional weight is calculated using the formula:

```
((Observed Value - Minimum observed value) / (Maximum observed value - Minimum observed value)) * Weight
```

For example, let's say you want to rank clusters based on the property of available CPU capacity in descending order and that you have a fleet of three clusters with the following available CPU:

| Cluster | Available CPU capacity |
| -------- | ------- |
| `bravelion` | 100 |
| `smartfish` | 20 |
| `jumpingcat` | 10 |

In this case, the sorter computes the following weights:

| Cluster | Available CPU capacity | Weight |
| -------- | ------- | ------- | 
| `bravelion` | 100 | (100 - 10) / (100 - 10) = 100% of the weight |
| `smartfish` | 20 | (20 - 10) / (100 - 10) = 11.11% of the weight |
| `jumpingcat` | 10 | (10 - 10) / (100 - 10) = 0% of the weight |


For sort order `Ascending`, the proportional weight is calculated using the formula:

```
(1 - ((Observed Value - Minimum observed value) / (Maximum observed value - Minimum observed value))) * Weight
```

For example, let's say you want to rank clusters based on their per-CPU-core-cost in ascending order and that you have a fleet of three clusters with the following CPU core costs:

| Cluster | Per-CPU core cost |
| -------- | ------- |
| `bravelion` | 1 |
| `smartfish` | 0.2 |
| `jumpingcat` | 0.1 |

In this case, the sorter computes the following weights:

| Cluster | Per-CPU core cost | Weight |
| -------- | ------- | ------- | 
| `bravelion` | 1 | 1 - ((1 - 0.1) / (1 - 0.1)) = 0% of the weight |
| `smartfish` | 0.2 | 1 - ((0.2 - 0.1) / (1 - 0.1)) = 88.89% of the weight |
| `jumpingcat` | 0.1 | 1 - (0.1 - 0.1) / (1 - 0.1) = 100% of the weight |

The example below showcases a property sorter using the `Descending` order:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp
spec:
  resourceSelectors:
    - ...
  policy:
    placementType: PickN
    numberOfClusters: 10
    affinity:
        clusterAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 20
              preference:
                metricSorter:
                  name: kubernetes.azure.com/node-count
                  sortOrder: Descending
```

In this example, Fleet will prefer clusters with higher node counts. The cluster with the highest node count would receive a weight of 20, and the cluster with the lowest would receive 0. Other clusters receive proportional weights calculated using the weight calculation formula.

You may use both label selector and property sorter under `preferredDuringSchedulingIgnoredDuringExecution` affinity. A member cluster that fails the label selector won't receive any weight. Member clusters that satisfy the label selector receive proportional weights as specified under property sorter.

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp
spec:
  resourceSelectors:
    - ...
  policy:
    placementType: PickN
    numberOfClusters: 10
    affinity:
        clusterAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 20
              preference:
                labelSelector:
                  matchLabels:
                    env: prod
                metricSorter:
                  name: resources.kubernetes-fleet.io/total-cpu
                  sortOrder: Descending
```

In this example, a cluster would only receive extra weight if it has the label `env=prod`. If it satisfies that label based constraint, then the cluster is given proportional weight based on the amount of total CPU in that member cluster.


## Clean up resources

If you no longer wish to use the `ClusterResourcePlacement` objects created in this article, you can delete them using the `kubectl delete` command. For example:

```bash
kubectl delete clusterresourceplacement <name-of-the-crp-resource>
```

## Next steps

To learn more about resource propagation, see the following resources:

* [Intelligent cross-cluster Kubernetes resource placement based on member clusters properties](./intelligent-resource-placement.md)
* [Upstream Fleet documentation](https://github.com/Azure/fleet/blob/main/docs/concepts/ClusterResourcePlacement/README.md)
