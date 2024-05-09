---
title: "Use taints on member clusters and tolerations on cluster resource placements in Azure Kubernetes Fleet Manager"
description: Learn how to use taints on `MemberCluster` resources and tolerations on `ClusterResourcePlacement` resources in Azure Kubernetes Fleet Manager.
ms.topic: how-to
ms.date: 04/23/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
---

# Use taints on member clusters and tolerations on cluster resource placements

This article explains how to add/remove taints on `MemberCluster` resources and tolerations on `ClusterResourcePlacement` resources in Azure Kubernetes Fleet Manager.

Taints and tolerations work together to ensure member clusters only receive specified resources during resource propagation. Taints are applied to `MemberCluster` resources to prevent resources from being propagated to the member cluster. Tolerations are applied to `ClusterResourcePlacement` resources to allow resources to be propagated to the member cluster, even if the member cluster has a taint.

## Prerequisites

* [!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]
* Read the conceptual overviews for [taints](./concepts-fleet.md#taints) and [tolerations](./concepts-resource-propagation.md#tolerations).
* You must have a Fleet resource with a hub cluster and member clusters. If you don't have this resource, follow [Quickstart: Create a Fleet resource and join member clusters](quickstart-create-fleet-and-members.md).
* You must gain access to the Kubernetes API of the hub cluster by following the steps in [Access the Kubernetes API of the Fleet resource](./quickstart-access-fleet-kubernetes-api.md).

## Add taints to a member cluster

In this example, we add a taint to a `MemberCluster` resource, then try to propagate resources to the member cluster using a `ClusterResourcePlacement` with a `PickAll` placement policy. The resources shouldn't be propagated to the member cluster because of the taint.

1. Create a namespace to propagate to the member cluster using the `kubectl create ns` command.

    ```bash
    kubectl create ns test-ns
    ```

2. Create a taint on the `MemberCluster` resource using the following example code:

    ```yml
    apiVersion: cluster.kubernetes-fleet.io/v1beta1
    kind: MemberCluster
    metadata:
      name: kind-cluster-1
    spec:
      identity:
        name: fleet-member-agent-cluster-1
        kind: ServiceAccount
        namespace: fleet-system
        apiGroup: ""
      taints:                    # Add taint to the member cluster
        - key: test-key1
          value: test-value1
          effect: NoSchedule
    ```
        
3. Apply the taint to the `MemberCluster` resource using the `kubectl apply` command. Make sure you replace the file name with the name of your file.

    ```bash
    kubectl apply -f member-cluster-taint.yml
    ```

4. Create a `PickAll` placement policy on the `ClusterResourcePlacement` resource using the following example code:

    ```yml
      resourceSelectors:
        - group: ""
          kind: Namespace
          version: v1          
          name: test-ns
      policy:
        placementType: PickAll
    ```

5. Apply the `ClusterResourcePlacement` resource using the `kubectl apply` command. Make sure you replace the file name with the name of your file.

    ```bash
    kubectl apply -f cluster-resource-placement-pick-all.yml
    ```

6. Verify that the resources weren't propagated to the member cluster by checking the details of the `ClusterResourcePlacement` resource using the `kubectl describe` command.

    ```bash
    kubectl describe clusterresourceplacement test-ns
    ```

    Your output should look similar to the following example output:

    ```output
    status:
      conditions:
      - lastTransitionTime: "2024-04-16T19:03:17Z"
        message: found all the clusters needed as specified by the scheduling policy
        observedGeneration: 2
        reason: SchedulingPolicyFulfilled
        status: "True"
        type: ClusterResourcePlacementScheduled
      - lastTransitionTime: "2024-04-16T19:03:17Z"
        message: All 0 cluster(s) are synchronized to the latest resources on the hub
          cluster
        observedGeneration: 2
        reason: SynchronizeSucceeded
        status: "True"
        type: ClusterResourcePlacementSynchronized
      - lastTransitionTime: "2024-04-16T19:03:17Z"
        message: There are no clusters selected to place the resources
        observedGeneration: 2
        reason: ApplySucceeded
        status: "True"
        type: ClusterResourcePlacementApplied
      observedResourceIndex: "0"
      selectedResources:
      - kind: Namespace
        name: test-ns
        version: v1
    ```

## Remove taints from a member cluster

In this example, we remove the taint we created in [add taints to a member cluster](#add-taints-to-a-member-cluster). This should automatically trigger the Fleet scheduler to propagate the resources to the member cluster.

1. Open your `MemberCluster` YAML file and remove the taint section.
2. Apply the changes to the `MemberCluster` resource using the `kubectl apply` command. Make sure you replace the file name with the name of your file.

    ```bash
    kubectl apply -f member-cluster-taint.yml
    ```

3. Verify that the resources were propagated to the member cluster by checking the details of the `ClusterResourcePlacement` resource using the `kubectl describe` command.

    ```bash
    kubectl describe clusterresourceplacement test-ns
    ```

    Your output should look similar to the following example output:

    ```output
    status:
      conditions:
      - lastTransitionTime: "2024-04-16T20:00:03Z"
        message: found all the clusters needed as specified by the scheduling policy
        observedGeneration: 2
        reason: SchedulingPolicyFulfilled
        status: "True"
        type: ClusterResourcePlacementScheduled
      - lastTransitionTime: "2024-04-16T20:02:57Z"
        message: All 1 cluster(s) are synchronized to the latest resources on the hub
          cluster
        observedGeneration: 2
        reason: SynchronizeSucceeded
        status: "True"
        type: ClusterResourcePlacementSynchronized
      - lastTransitionTime: "2024-04-16T20:02:57Z"
        message: Successfully applied resources to 1 member clusters
        observedGeneration: 2
        reason: ApplySucceeded
        status: "True"
        type: ClusterResourcePlacementApplied
      observedResourceIndex: "0"
      placementStatuses:
      - clusterName: kind-cluster-1
        conditions:
        - lastTransitionTime: "2024-04-16T20:02:52Z"
          message: 'Successfully scheduled resources for placement in kind-cluster-1 (affinity
            score: 0, topology spread score: 0): picked by scheduling policy'
          observedGeneration: 2
          reason: ScheduleSucceeded
          status: "True"
          type: Scheduled
        - lastTransitionTime: "2024-04-16T20:02:57Z"
          message: Successfully Synchronized work(s) for placement
          observedGeneration: 2
          reason: WorkSynchronizeSucceeded
          status: "True"
          type: WorkSynchronized
        - lastTransitionTime: "2024-04-16T20:02:57Z"
          message: Successfully applied resources
          observedGeneration: 2
          reason: ApplySucceeded
          status: "True"
          type: Applied
      selectedResources:
      - kind: Namespace
        name: test-ns
        version: v1
    ```

## Add tolerations to a cluster resource placement

In this example, we add a toleration to a `ClusterResourcePlacement` resource to propagate resources to a member cluster that has a taint. The toleration allows the resources to be propagated to the member cluster.

1. Create a namespace to propagate to the member cluster using the `kubectl create ns` command.

    ```bash
    kubectl create ns test-ns
    ```

2. Create a taint on the `MemberCluster` resource using the following example code:

    ```yml
    apiVersion: cluster.kubernetes-fleet.io/v1beta1
    kind: MemberCluster
    metadata:
      name: kind-cluster-1
    spec:
      identity:
        name: fleet-member-agent-cluster-1
        kind: ServiceAccount
        namespace: fleet-system
        apiGroup: ""
      taints:                    # Add taint to the member cluster
        - key: test-key1
          value: test-value1
          effect: NoSchedule
    ```
        
3. Apply the taint to the `MemberCluster` resource using the `kubectl apply` command. Make sure you replace the file name with the name of your file.

    ```bash
    kubectl apply -f member-cluster-taint.yml
    ```

4. Create a toleration on the `ClusterResourcePlacement` resource using the following example code:

    ```yml
    spec:
      policy:
        placementType: PickAll
        tolerations:
          - key: test-key1
            operator: Exists
      resourceSelectors:
        - group: ""
          kind: Namespace
          name: test-ns
          version: v1
      revisionHistoryLimit: 10
      strategy:
        type: RollingUpdate
    ```

5. Apply the `ClusterResourcePlacement` resource using the `kubectl apply` command. Make sure you replace the file name with the name of your file.

    ```bash
    kubectl apply -f cluster-resource-placement-toleration.yml
    ```

6. Verify that the resources were propagated to the member cluster by checking the details of the `ClusterResourcePlacement` resource using the `kubectl describe` command.

    ```bash
    kubectl describe clusterresourceplacement test-ns
    ```

    Your output should look similar to the following example output:

    ```output
    status:
      conditions:
        - lastTransitionTime: "2024-04-16T20:16:10Z"
          message: found all the clusters needed as specified by the scheduling policy
          observedGeneration: 3
          reason: SchedulingPolicyFulfilled
          status: "True"
          type: ClusterResourcePlacementScheduled
        - lastTransitionTime: "2024-04-16T20:16:15Z"
          message: All 1 cluster(s) are synchronized to the latest resources on the hub
            cluster
          observedGeneration: 3
          reason: SynchronizeSucceeded
          status: "True"
          type: ClusterResourcePlacementSynchronized
        - lastTransitionTime: "2024-04-16T20:16:15Z"
          message: Successfully applied resources to 1 member clusters
          observedGeneration: 3
          reason: ApplySucceeded
          status: "True"
          type: ClusterResourcePlacementApplied
      observedResourceIndex: "0"
      placementStatuses:
        - clusterName: kind-cluster-1
          conditions:
            - lastTransitionTime: "2024-04-16T20:16:10Z"
              message: 'Successfully scheduled resources for placement in kind-cluster-1 (affinity
            score: 0, topology spread score: 0): picked by scheduling policy'
              observedGeneration: 3
              reason: ScheduleSucceeded
              status: "True"
              type: Scheduled
            - lastTransitionTime: "2024-04-16T20:16:15Z"
              message: Successfully Synchronized work(s) for placement
              observedGeneration: 3
              reason: WorkSynchronizeSucceeded
              status: "True"
              type: WorkSynchronized
            - lastTransitionTime: "2024-04-16T20:16:15Z"
              message: Successfully applied resources
              observedGeneration: 3
              reason: ApplySucceeded
              status: "True"
              type: Applied
      selectedResources:
        - kind: Namespace
          name: test-ns
          version: v1
    ```

## Next steps

For more information on Azure Kubernetes Fleet Manager, see the [upstream Fleet documentation](https://github.com/Azure/fleet/tree/main/docs).
