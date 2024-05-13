---
title: "Intelligent cross-cluster Kubernetes resource placement using Azure Kubernetes Fleet Manager (Preview)"
description: Learn how to use Kubernetes Fleet to intelligently place your workloads on AKS clusters based on cost and resource availability.
ms.topic: how-to
ms.date: 05/13/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
---

# Intelligent cross-cluster Kubernetes resource placement using Azure Kubernetes Fleet Manager (Preview).

Application developers often need to deploy Kubernetes resources into multiple clusters. While sometimes they need to replicate the same resource across multiple clusters, other times they need to pick the best clusters for placing the workloads based on heuristics such as cost of compute in the clusters, available memory, available CPU, or a mix of multiple weighted metrics. It's tedious to create, update, and track these Kubernetes resources across multiple clusters manually. This article covers how Azure Kubernetes Fleet Manager (Kubernetes Fleet) allows you to address these scenarios using the Kubernetes resource placement feature.

## Overview

Kubernetes Fleet provides resource placement capability that can make scheduling decisions based on the following properties:
- Node count.
- Cost of compute in target member clusters.
- Resource (CPU/Memory) availability in target member clusters.

[!INCLUDE [preview-callout](./includes/preview/preview-callout.md)]

## Prerequisites

* Read the [resource propagation conceptual overview](./concepts-resource-propagation.md) to understand the concepts and terminology used in this quickstart.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* You need a Fleet resource with a hub cluster and member clusters. If you don't have one, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI](quickstart-create-fleet-and-members.md).
* You need access to the Kubernetes API of the hub cluster. If you don't have access, see [Access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager](./quickstart-access-fleet-kubernetes-api.md).


## Filter clusters at the time of scheduling based on properties

**requiredDuringSchedulingIgnoredDuringExecution** affinity type allows for **filtering** the member clusters eligible for placement using property selectors. A property selector is an array of expression conditions against cluster properties.

In each condition you will specify:

* **Name**: Name of the property, which should be in the following format:

    ```
    resources.kubernetes-fleet.io/[CAPACITY-TYPE]-[RESOURCE-NAME]
    ```

    `[CAPACITY-TYPE]` is one of `total`, `allocatable`, or `available`, depending on which capacity (usage information) you would like to check against, and `[RESOURCE-NAME]` is the name of the resource (CPU/memory).

    For example, if you would like to select clusters based on the available CPU capacity of a cluster, the name used in the property selector should be `resources.kubernetes-fleet.io/available-cpu`. For allocatable memory capacity, you can use `resources.kubernetes-fleet.io/allocatable-memory`.

* A list of values, which are possible values of the property.
* An operator used to express the condition between the constraint/desired value and the observed value on the cluster. The following operators are currently supported:

    * `Gt` (Greater than): a cluster's observed value of the given property must be greater than the value in the condition before it can be picked for resource placement.
    * `Ge` (Greater than or equal to): a cluster's observed value of the given property must be greater than or equal to the value in the condition before it can be picked for resource placement.
    * `Lt` (Less than): a cluster's observed value of the given property must be less than the value in the condition before it can be picked for resource placement.
    * `Le` (Less than or equal to): a cluster's observed value of the given property must be less than or equal to the value in the condition before it can be picked for resource placement.
    * `Eq` (Equal to): a cluster's observed value of the given property must be equal to the value in the condition before it can be picked for resource placement.
    * `Ne` (Not equal to): a cluster's observed value of the given property must be not equal to the value in the condition before it can be picked for resource placement.

    Note that if you use the operator `Gt`, `Ge`, `Lt`, `Le`, `Eq`, or `Ne`, the list of values in the condition should have exactly one value.

Fleet will evaluate each cluster based on the properties specified in the condition. Failure to satisfy conditions listed under `requiredDuringSchedulingIgnoredDuringExecution` will exclude this member cluster from resource placement.

> [!NOTE]
> If a member cluster does not possess the property expressed in the condition, it will automatically
fail the matcher.

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

In the example above, Kubernetes Fleet will only consider a cluster for resource placement if it has the `region=east` label and a node count greater than or equal to five.
