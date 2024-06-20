---
title: "Kubernetes resource propagation from hub cluster to member clusters"
description: This article describes the concept of Kubernetes resource propagation from hub cluster to member clusters.
ms.date: 03/04/2024
author: shashankbarsin
ms.author: shasb
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
ms.topic: conceptual
---

# Kubernetes resource propagation from hub cluster to member clusters

This article describes the concept of Kubernetes resource propagation from hub clusters to member clusters using Azure Kubernetes Fleet Manager (Fleet).

Platform admins often need to deploy Kubernetes resources into multiple clusters for various reasons, for example:

* Managing access control using roles and role bindings across multiple clusters.
* Running infrastructure applications, such as Prometheus or Flux, that need to be on all clusters.

Application developers often need to deploy Kubernetes resources into multiple clusters for various reasons, for example:

* Deploying a video serving application into multiple clusters in different regions for a low latency watching experience.
* Deploying a shopping cart application into two paired regions for customers to continue to shop during a single region outage.
* Deploying a batch compute application into clusters with inexpensive spot node pools available.

It's tedious to create, update, and track these Kubernetes resources across multiple clusters manually. Fleet provides Kubernetes resource propagation to enable at-scale management of Kubernetes resources. With Fleet, you can create Kubernetes resources in the hub cluster and propagate them to selected member clusters via Kubernetes Custom Resources: `MemberCluster` and `ClusterResourcePlacement`. Fleet supports these custom resources based on an [open-source cloud-native multi-cluster solution][fleet-github]. For more information, see the [upstream Fleet documentation][fleet-github].

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## Resource propagation workflow

[![Diagram that shows how Kubernetes resource are propagated to member clusters.](./media/conceptual-resource-propagation.png)](./media/conceptual-resource-propagation.png#lightbox)

## What is a `MemberCluster`?

Once a cluster joins a fleet, a corresponding `MemberCluster` custom resource is created on the hub cluster. You can use this custom resource to select target clusters in resource propagation.

The following labels can be used for target cluster selection in resource propagation and are automatically added to all member clusters:

* `fleet.azure.com/location`
* `fleet.azure.com/resource-group`
* `fleet.azure.com/subscription-id`

For more information, see the [MemberCluster API reference][membercluster-api].

## What is a `ClusterResourcePlacement`?

A `ClusterResourcePlacement` object is used to tell the Fleet scheduler how to place a given set of cluster-scoped objects from the hub cluster into member clusters. Namespace-scoped objects like Deployments, StatefulSets, DaemonSets, ConfigMaps, Secrets, and PersistentVolumeClaims are included when their containing namespace is selected.

With `ClusterResourcePlacement`, you can:

* Select which cluster-scoped Kubernetes resources to propagate to member clusters.
* Specify placement policies to manually or automatically select a subset or all of the member clusters as target clusters.
* Specify rollout strategies to safely roll out any updates of the selected Kubernetes resources to multiple target clusters.
* View the propagation progress towards each target cluster.

The `ClusterResourcePlacement` object supports [using ConfigMap to envelope the object][envelope-object] to help propagate to member clusters without any unintended side effects. Selection methods include:

* **Group, version, and kind**: Select and place all resources of the given type.
* **Group, version, kind, and name**: Select and place one particular resource of a given type.
* **Group, version, kind, and labels**: Select and place all resources of a given type that match the labels supplied.

For more information, see the [`ClusterResourcePlacement` API reference][clusterresourceplacement-api].

When creating the `ClusterResourcePlacement`, the following affinity types can be specified:

- **requiredDuringSchedulingIgnoredDuringExecution**: As this affinity is of the required type during scheduling, it **filters** the clusters based on their properties.
- **preferredDuringSchedulingIgnoredDuringExecution**: As this affinity is only of the preferred type, but is not required during scheduling, it provides preferential ranking to clusters based on properties specified by you such as cost or resource availability.

Multiple placement types are available for controlling the number of clusters to which the Kubernetes resource needs to be propagated:

* `PickAll` places the resources into all available member clusters. This policy is useful for placing infrastructure workloads, like cluster monitoring or reporting applications.
* `PickFixed` places the resources into a specific list of member clusters by name.
* `PickN` is the most flexible placement option and allows for selection of clusters based on affinity or topology spread constraints and is useful when spreading workloads across multiple appropriate clusters to ensure availability is desired.

### `PickAll` placement policy

You can use a `PickAll` placement policy to deploy a workload across all member clusters in the fleet (optionally matching a set of criteria).

The following example shows how to deploy a `test-deployment` namespace and all of its objects across all clusters labeled with `environment: production`:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp-1
spec:
  policy:
    placementType: PickAll
    affinity:
        clusterAffinity:
            requiredDuringSchedulingIgnoredDuringExecution:
                clusterSelectorTerms:
                - labelSelector:
                    matchLabels:
                        environment: production
  resourceSelectors:
    - group: ""
      kind: Namespace
      name: prod-deployment
      version: v1
```

This simple policy takes the `test-deployment` namespace and all resources contained within it and deploys it to all member clusters in the fleet with the given `environment` label. If all clusters are desired, you can remove the `affinity` term entirely.

### `PickFixed` placement policy

If you want to deploy a workload into a known set of member clusters, you can use a `PickFixed` placement policy to select the clusters by name.

The following example shows how to deploy the `test-deployment` namespace into member clusters `cluster1` and `cluster2`:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp-2
spec:
  policy:
    placementType: PickFixed
    clusterNames:
    - cluster1
    - cluster2
  resourceSelectors:
    - group: ""
      kind: Namespace
      name: test-deployment
      version: v1
```

### `PickN` placement policy

The `PickN` placement policy is the most flexible option and allows for placement of resources into a configurable number of clusters based on both affinities and topology spread constraints.

#### `PickN` with affinities

Using affinities with a `PickN` placement policy functions similarly to using affinities with pod scheduling. You can set both required and preferred affinities. Required affinities prevent placement to clusters that don't match them those specified affinities, and preferred affinities allow for ordering the set of valid clusters when a placement decision is being made.

The following example shows how to deploy a workload into three clusters. Only clusters with the `critical-allowed: "true"` label are valid placement targets, and preference is given to clusters with the label `critical-level: 1`:

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
    numberOfClusters: 3
    affinity:
        clusterAffinity:
            preferredDuringSchedulingIgnoredDuringExecution:
              weight: 20
              preference:
              - labelSelector:
                  matchLabels:
                    critical-level: 1
            requiredDuringSchedulingIgnoredDuringExecution:
                clusterSelectorTerms:
                - labelSelector:
                    matchLabels:
                      critical-allowed: "true"
```

#### `PickN` with topology spread constraints

You can use topology spread constraints to force the division of the cluster placements across topology boundaries to satisfy availability requirements, for example, splitting placements across regions or update rings. You can also configure topology spread constraints to prevent scheduling if the constraint can't be met (`whenUnsatisfiable: DoNotSchedule`) or schedule as best possible (`whenUnsatisfiable: ScheduleAnyway`).

The following example shows how to spread a given set of resources out across multiple regions and attempts to schedule across member clusters with different update days:

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
    topologySpreadConstraints:
    - maxSkew: 2
      topologyKey: region
      whenUnsatisfiable: DoNotSchedule
    - maxSkew: 2
      topologyKey: updateDay
      whenUnsatisfiable: ScheduleAnyway
```

For more information, see the [upstream topology spread constraints Fleet documentation][crp-topo].

## Update strategy

Fleet uses a rolling update strategy to control how updates are rolled out across multiple cluster placements.

The following example shows how to configure a rolling update strategy using the default settings:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp
spec:
  resourceSelectors:
    - ...
  policy:
    ...
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 25%
      maxSurge: 25%
      unavailablePeriodSeconds: 60
```

The scheduler rolls out updates to each cluster sequentially, waiting at least `unavailablePeriodSeconds` between clusters. Rollout status is considered successful if all resources were correctly applied to the cluster. Rollout status checking doesn't cascade to child resources, for example, it doesn't confirm that pods created by a deployment become ready.

For more information, see the [upstream rollout strategy Fleet documentation][fleet-rollout].

## Placement status

The Fleet scheduler updates details and status on placement decisions onto the `ClusterResourcePlacement` object. You can view this information using the `kubectl describe crp <name>` command. The output includes the following information:

* The conditions that currently apply to the placement, which include if the placement was successfully completed.
* A placement status section for each member cluster, which shows the status of deployment to that cluster.

The following example shows a `ClusterResourcePlacement` that deployed the `test` namespace and the `test-1` ConfigMap into two member clusters using `PickN`. The placement was successfully completed and the resources were placed into the `aks-member-1` and `aks-member-2` clusters.

```
Name:         crp-1
Namespace:
Labels:       <none>
Annotations:  <none>
API Version:  placement.kubernetes-fleet.io/v1beta1
Kind:         ClusterResourcePlacement
Metadata:
  ...
Spec:
  Policy:
    Number Of Clusters:  2
    Placement Type:      PickN
  Resource Selectors:
    Group:
    Kind:                  Namespace
    Name:                  test
    Version:               v1
  Revision History Limit:  10
Status:
  Conditions:
    Last Transition Time:  2023-11-10T08:14:52Z
    Message:               found all the clusters needed as specified by the scheduling policy
    Observed Generation:   5
    Reason:                SchedulingPolicyFulfilled
    Status:                True
    Type:                  ClusterResourcePlacementScheduled
    Last Transition Time:  2023-11-10T08:23:43Z
    Message:               All 2 cluster(s) are synchronized to the latest resources on the hub cluster
    Observed Generation:   5
    Reason:                SynchronizeSucceeded
    Status:                True
    Type:                  ClusterResourcePlacementSynchronized
    Last Transition Time:  2023-11-10T08:23:43Z
    Message:               Successfully applied resources to 2 member clusters
    Observed Generation:   5
    Reason:                ApplySucceeded
    Status:                True
    Type:                  ClusterResourcePlacementApplied
  Placement Statuses:
    Cluster Name:  aks-member-1
    Conditions:
      Last Transition Time:  2023-11-10T08:14:52Z
      Message:               Successfully scheduled resources for placement in aks-member-1 (affinity score: 0, topology spread score: 0): picked by scheduling policy
      Observed Generation:   5
      Reason:                ScheduleSucceeded
      Status:                True
      Type:                  ResourceScheduled
      Last Transition Time:  2023-11-10T08:23:43Z
      Message:               Successfully Synchronized work(s) for placement
      Observed Generation:   5
      Reason:                WorkSynchronizeSucceeded
      Status:                True
      Type:                  WorkSynchronized
      Last Transition Time:  2023-11-10T08:23:43Z
      Message:               Successfully applied resources
      Observed Generation:   5
      Reason:                ApplySucceeded
      Status:                True
      Type:                  ResourceApplied
    Cluster Name:            aks-member-2
    Conditions:
      Last Transition Time:  2023-11-10T08:14:52Z
      Message:               Successfully scheduled resources for placement in aks-member-2 (affinity score: 0, topology spread score: 0): picked by scheduling policy
      Observed Generation:   5
      Reason:                ScheduleSucceeded
      Status:                True
      Type:                  ResourceScheduled
      Last Transition Time:  2023-11-10T08:23:43Z
      Message:               Successfully Synchronized work(s) for placement
      Observed Generation:   5
      Reason:                WorkSynchronizeSucceeded
      Status:                True
      Type:                  WorkSynchronized
      Last Transition Time:  2023-11-10T08:23:43Z
      Message:               Successfully applied resources
      Observed Generation:   5
      Reason:                ApplySucceeded
      Status:                True
      Type:                  ResourceApplied
  Selected Resources:
    Kind:       Namespace
    Name:       test
    Version:    v1
    Kind:       ConfigMap
    Name:       test-1
    Namespace:  test
    Version:    v1
Events:
  Type    Reason                     Age                    From                                   Message
  ----    ------                     ----                   ----                                   -------
  Normal  PlacementScheduleSuccess   12m (x5 over 3d22h)    cluster-resource-placement-controller  Successfully scheduled the placement
  Normal  PlacementSyncSuccess       3m28s (x7 over 3d22h)  cluster-resource-placement-controller  Successfully synchronized the placement
  Normal  PlacementRolloutCompleted  3m28s (x7 over 3d22h)  cluster-resource-placement-controller  Resources have been applied to the selected clusters
```

## Placement changes

The Fleet scheduler prioritizes the stability of existing workload placements. This prioritization can limit the number of changes that cause a workload to be removed and rescheduled. The following scenarios can trigger placement changes:

* Placement policy changes in the `ClusterResourcePlacement` object can trigger removal and rescheduling of a workload.
  * Scale out operations (increasing `numberOfClusters` with no other changes) place workloads only on new clusters and don't affect existing placements.
* Cluster changes, including:
  * A new cluster becoming eligible might trigger placement if it meets the placement policy, for example, a `PickAll` policy.
  * A cluster with a placement is removed from the fleet will attempt to replace all affected workloads without affecting their other placements.

Resource-only changes (updating the resources or updating the `ResourceSelector` in the `ClusterResourcePlacement` object) roll out gradually in existing placements but do **not** trigger rescheduling of the workload.

## Tolerations

`ClusterResourcePlacement` objects support the specification of tolerations, which apply to the `ClusterResourcePlacement` object. Each toleration object consists of the following fields:

* `key`: The key of the toleration.
* `value`: The value of the toleration.
* `effect`: The effect of the toleration, such as `NoSchedule`.
* `operator`: The operator of the toleration, such as `Exists` or `Equal`.

Each toleration is used to tolerate one or more specific taints applied on the `ClusterResourcePlacement`. Once all taints on a [`MemberCluster`](./concepts-fleet.md#what-are-member-clusters) are tolerated, the scheduler can then propagate resources to the cluster. You can't update or remove tolerations from a `ClusterResourcePlacement` object once it's created.

For more information, see [the upstream Fleet documentation](https://github.com/Azure/fleet/blob/main/docs/concepts/ClusterResourcePlacement/README.md#tolerations).

## Access the Kubernetes API of the Fleet resource cluster

If you created an Azure Kubernetes Fleet Manager resource with the hub cluster enabled, you can use it to centrally control scenarios like Kubernetes object propagation. To access the Kubernetes API of the Fleet resource cluster, follow the steps in [Access the Kubernetes API of the Fleet resource cluster with Azure Kubernetes Fleet Manager](./quickstart-access-fleet-kubernetes-api.md).

## Next steps

[Set up Kubernetes resource propagation from hub cluster to member clusters](./quickstart-resource-propagation.md).

<!-- LINKS - external -->
[fleet-github]: https://github.com/Azure/fleet
[membercluster-api]: https://github.com/Azure/fleet/blob/main/docs/api-references.md#membercluster
[clusterresourceplacement-api]: https://github.com/Azure/fleet/blob/main/docs/api-references.md#clusterresourceplacement
[envelope-object]: https://github.com/Azure/fleet/blob/main/docs/concepts/ClusterResourcePlacement/README.md#envelope-object
[crp-topo]: https://github.com/Azure/fleet/blob/main/docs/howtos/topology-spread-constraints.md
[fleet-rollout]: https://github.com/Azure/fleet/blob/main/docs/howtos/crp.md#rollout-strategy
