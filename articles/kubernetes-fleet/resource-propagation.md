---
title: "Using cluster resource propagation (preview)"
description: Learn how to use Azure Kubernetes Fleet Manager to intelligently place workloads across multiple clusters.
ms.topic: how-to
ms.date: 10/31/2023
author: phealy
ms.author: pahealy
ms.service: kubernetes-fleet
ms.custom:
  - ignite-2023
---

# Using cluster resource propagation (preview)

Azure Kubernetes Fleet Manager (Fleet) resource propagation allows for deployment of any Kubernetes objects to fleet member clusters according to specified criteria. Placement is triggered by creating the objects in a fleet hub cluster namespace, followed by the creation of a `ClusterResourcePlacement` object to indicate the desired scheduling behavior.

[!INCLUDE [preview features note](./includes/preview/preview-callout.md)]

## `ClusterResourcePlacements`

A `ClusterResourcePlacement` object's specification defines what resources should be included in the placement, what policy should be used to place them, and what strategy is used to roll out updates across multiple member clusters.

A simple `ClusterResourcePlacement` looks like this:

```yaml
apiVersion: placement.kubernetes-fleet.io/v1beta1
kind: ClusterResourcePlacement
metadata:
  name: crp-1
spec:
  policy:
    placementType: PickN
    numberOfClusters: 2
    topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: "env"
        whenUnsatisfiable: DoNotSchedule
  resourceSelectors:
    - group: ""
      kind: Namespace
      name: test-deployment
      version: v1
  revisionHistoryLimit: 100
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
      unavailablePeriodSeconds: 5
    type: RollingUpdate
```

### Resource selectors

Resource selectors identify cluster-scoped objects to include based on standard Kubernetes identifiers, namely, the `group`, `kind`, `version`, and `name` of the object. Namespace-scoped objects are included automatically when the namespace they are part of is selected. The example `ClusterResourcePlacement` above includes the `test-deployment` namespace and any objects created in that namespace.

### Placement policy

Placement policy consists of several attributes:

- The placement type
- The number of clusters to select (used only with `PickN` placement type)
- The affinity selectors
- The topology spread constraints.

#### Placement type

The `policy` attribute defines how the member clusters should be selected for placement, according to a `placementType` and related configuration values.

Three different placement types are available:

- `PickAll` - deploy to all member clusters with optional matching affinities
- `PickFixed` - deploy to a fixed list of member clusters
- `PickN` - deploy to `<n>` member clusters with optional topology spread constraints or affinity preference scheduling

If no policy is specified, the default is `PickAll` with no matching affinities.

#### Cluster names

If the `PickFixed` placement policy is selected, the only supported configuration attribute is `clusterNames`, which is a list of the names of the member clusters to which the resources should be deployed.

```yaml
spec:
  policy:
    placementType: PickFixed
    clusterNames:
      - aks-member-3
      - aks-member-4
```

#### Number of clusters

If the `PickN` placement policy is selected, the number of desired placements must be selected using the `numberOfClusters` attribute. This determines the total number of member clusters that will receive the resources in the `ClusterResourcePlacement` resource selectors.

#### Placement affinities

Placement affinities function similarly to Kubernetes pod placement affinities, with two different categories:

- `requiredDuringSchedulingIgnoredDuringExecution` - if the cluster placement policy is `PickAll` or `PickN`, all requirements indicated here must be met for a cluster to be a valid placement target.
- `preferredDuringSchedulingIgnoredDuringExecution` - if the cluster placement policy is `PickN`, each member cluster is assigned a total score based on the preferences indicated here. If a cluster matches a given filter, that filter's `weight` is added to the score for the cluster. Once all clusters have been evaluated, the clusters will be sorted from highest to lowest score and the top `N` clusters will be selected.

A placement policy that selected all clusters with the `env` label having a value of `prod` would include the following, and would only deploy onto clusters labeled with prod:

```yaml
spec:
  policy:
    placementType: PickAll
    affinity:
      clusterAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
          clusterSelectorTerms:
              - labelSelector:
                  matchLabels:
                    env: prod
```

The placement policy below would always select exactly one cluster, but would give a preference to a cluster labeled with `env: canary`. However, if no canary clusters were available, any other cluster would be selected.

```yaml
spec:
  policy:
    placementType: PickN
    numberOfClusters: 1
    affinity:
      clusterAffinity:
        preferredDuringSchedulingIgnoredDuringExecution:
            - weight: 50
              preference:
                labelSelector:
                  matchLabels:
                    env: canary
```

#### Topology spread constraints

Placement policy topology spread constraints can be used in the `PickN` placement policy to force deployments to split across topology domains like regions or availability zones. These constraints work in conjunction with the affinities above to enable scheduling resources to meet high availability requirements.

```yaml
  policy:
    placementType: PickN
    numberOfClusters: 2
    topologySpreadConstraints:
      - maxSkew: 1
        topologyKey: "env"
        whenUnsatisfiable: DoNotSchedule
```

A topology spread constraint functions almost identically to the Kubernetes Deployment construct, and has three attributes:

- `maxSkew`: the degree to which domains can be dissimilar. This must be >=1 and defaults to 1.
- `topologyKey`: a cluster label key. Clusters with identical values in this key are considered to be in the same domain. Examples would be `region` or `zone`.
- `whenUnsatisfiable`: indicates what should be done when a topology spread cannot be satisfied.
  - `DoNotSchedule` (default) - fail the placement if it would violate `maxSkew`
  - `ScheduleAnyway` - allow the placement to proceed even if the constraint cannot be satisfied, but prefer placements that minimize skew.

#### `PickN`, affinities, and topology spread constraints

When used together, affinities and topology spread constraints allow for the `PickN` policy to provide intelligent placement of workloads to satisfy multiple requirements simultaneously. When evaluating the requirements, the scheduling process works as follows:

1. All member clusters are evaluated to see if they meet the required affinities, if any. Clusters that do not meet required affinities are removed from consideration.
2. All remaining clusters are assigned a score based on the preferred affinities. if any.
3. The scheduler then selects `N` clusters by repeating the following process. Each step through the process will have a different set of valid placement targets based on what will satisfy the topology spread constraints based on all existing selections.
   1. Start with the list from step 2.
   2. Remove any clusters that do not meet the topology spread constraints and skew criteria specified.
   3. If there are no valid placement targets remaining and the topology spread constraint is set to `ScheduleAnyway`, ignore the constraint and use the whole list from step 2.
   1. Select the highest scoring cluster from the list.

### Strategy

Strategy determines how changes to the `ClusterWorkloadPlacement` will be rolled out across member clusters. The only supported strategy is `RollingUpdate`, which has three configuration options:

- `maxSurge` - the maximum number of extra clusters that can be scheduled if an in-place upgrade is not performed due to a change in constraints or placement decision. This can be specified as an absolute number or a percentage and defaults to 25%.
- `maxUnavailable` - the maximum number of clusters that can be unavailable compared to the number of placements. This can be specified as an absolute number or a percentage and defaults to 25%.
- `unavailablePeriodSeconds` - the number of seconds to wait after resources are successfully applied before a cluster is considered available.

`maxSurge` and `maxUnavailable` cannot both be 0.

```yaml
  strategy:
    rollingUpdate:
      maxSurge: 25%
      maxUnavailable: 25%
      unavailablePeriodSeconds: 5
    type: RollingUpdate
```

## Placement status

After a `ClusterResourcePlacement` is created, the scheduler will immediately begin placement. Details on current status can be seen by performing a `kubectl describe crp <name>`.

The status output will indicate both scheduling status (if the cluster was able to select enough clusters to satisfy all placement policy constraints) and individual placement statuses on each member cluster that was selected.

The list of resources that were selected for placement will also be included in the output.
