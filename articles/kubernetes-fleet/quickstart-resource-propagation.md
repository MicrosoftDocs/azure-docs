---
title: "Quickstart: Propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters (Preview)"
description: In this quickstart, you learn how to propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters.
ms.date: 03/28/2024
author: schaffererin
ms.author: schaffererin
ms.service: kubernetes-fleet
ms.custom:
  - build-2024
ms.topic: quickstart
---

# Quickstart: Propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters

In this quickstart, you learn how to propagate resources from an Azure Kubernetes Fleet Manager (Fleet) hub cluster to member clusters.

## Prerequisites

[!INCLUDE [free trial note](../../includes/quickstarts-free-trial-note.md)]

* Read the [resource propagation conceptual overview](./concepts-resource-propagation.md) to understand the concepts and terminology used in this quickstart.
* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* You need a Fleet resource with a hub cluster and member clusters. If you don't have one, see [Create an Azure Kubernetes Fleet Manager resource and join member clusters using Azure CLI](quickstart-create-fleet-and-members.md).
* Member clusters must be labeled appropriately in the hub cluster to match the desired selection criteria. Example labels include region, environment, team, availability zones, node availability, or anything else desired.
* You need access to the Kubernetes API of the hub cluster. If you don't have access, see [Access the Kubernetes API of the Fleet resource with Azure Kubernetes Fleet Manager](./quickstart-access-fleet-kubernetes-api.md).

## Use the `ClusterResourcePlacement` API to propagate resources to member clusters

The `ClusterResourcePlacement` API object is used to propagate resources from a hub cluster to member clusters. The `ClusterResourcePlacement` API object specifies the resources to propagate and the placement policy to use when selecting member clusters. The `ClusterResourcePlacement` API object is created in the hub cluster and is used to propagate resources to member clusters. This example demonstrates how to propagate a namespace to member clusters using the `ClusterResourcePlacement` API object with a `PickAll` placement policy.

For more information, see [Kubernetes resource propagation from hub cluster to member clusters (Preview)](./concepts-resource-propagation.md) and the [upstream Fleet documentation](https://github.com/Azure/fleet/blob/main/docs/concepts/ClusterResourcePlacement/README.md).

1. Create a namespace to place onto the member clusters using the `kubectl create namespace` command. The following example creates a namespace named `my-namespace`:

    ```bash
    kubectl create namespace my-namespace
    ```

2. Create a `ClusterResourcePlacement` API object in the hub cluster to propagate the namespace to the member clusters and deploy it using the `kubectl apply -f` command. The following example `ClusterResourcePlacement` creates an object named `crp` and uses the `my-namespace` namespace with a `PickAll` placement policy to propagate the namespace to all member clusters:

    ```bash
    kubectl apply -f - <<EOF
    apiVersion: placement.kubernetes-fleet.io/v1beta1
    kind: ClusterResourcePlacement
    metadata:
      name: crp
    spec:
      resourceSelectors:
        - group: ""
          kind: Namespace
          version: v1          
          name: my-namespace
      policy:
        placementType: PickAll
    EOF
    ```

3. Check the progress of the resource propagation using the `kubectl get clusterresourceplacement` command. The following example checks the status of the `ClusterResourcePlacement` object named `crp`:

    ```bash
    kubectl get clusterresourceplacement crp
    ```

    Your output should look similar to the following example output:

    ```output
    NAME   GEN   SCHEDULED   SCHEDULEDGEN   APPLIED   APPLIEDGEN   AGE
    crp    2     True        2              True      2            10s
    ```

4. View the details of the `crp` object using the `kubectl describe crp` command. The following example describes the `ClusterResourcePlacement` object named `crp`:

    ```bash
    kubectl describe clusterresourceplacement crp
    ```

    Your output should look similar to the following example output:

    ```output
    Name:         crp
    Namespace:    
    Labels:       <none>
    Annotations:  <none>
    API Version:  placement.kubernetes-fleet.io/v1beta1
    Kind:         ClusterResourcePlacement
    Metadata:
      Creation Timestamp:  2024-04-01T18:55:31Z
      Finalizers:
        kubernetes-fleet.io/crp-cleanup
        kubernetes-fleet.io/scheduler-cleanup
      Generation:        2
      Resource Version:  6949
      UID:               815b1d81-61ae-4fb1-a2b1-06794be3f986
    Spec:
      Policy:
        Placement Type:  PickAll
      Resource Selectors:
        Group:                 
        Kind:                  Namespace
        Name:                  my-namespace
        Version:               v1
      Revision History Limit:  10
      Strategy:
        Type:  RollingUpdate
    Status:
      Conditions:
        Last Transition Time:   2024-04-01T18:55:31Z
        Message:                found all the clusters needed as specified by the scheduling policy
        Observed Generation:    2
        Reason:                 SchedulingPolicyFulfilled
        Status:                 True
        Type:                   ClusterResourcePlacementScheduled
        Last Transition Time:   2024-04-01T18:55:36Z
        Message:                All 3 cluster(s) are synchronized to the latest resources on the hub cluster
        Observed Generation:    2
        Reason:                 SynchronizeSucceeded
        Status:                 True
        Type:                   ClusterResourcePlacementSynchronized
        Last Transition Time:   2024-04-01T18:55:36Z
        Message:                Successfully applied resources to 3 member clusters
        Observed Generation:    2
        Reason:                 ApplySucceeded
        Status:                 True
        Type:                   ClusterResourcePlacementApplied
      Observed Resource Index:  0
      Placement Statuses:
        Cluster Name:  membercluster1
        Conditions:
          Last Transition Time:  2024-04-01T18:55:31Z
          Message:               Successfully scheduled resources for placement in membercluster1 (affinity score: 0, topology spread score: 0): picked by scheduling policy
          Observed Generation:   2
          Reason:                ScheduleSucceeded
          Status:                True
          Type:                  ResourceScheduled
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully Synchronized work(s) for placement
          Observed Generation:   2
          Reason:                WorkSynchronizeSucceeded
          Status:                True
          Type:                  WorkSynchronized
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully applied resources
          Observed Generation:   2
          Reason:                ApplySucceeded
          Status:                True
          Type:                  ResourceApplied
        Cluster Name:            membercluster2
        Conditions:
          Last Transition Time:  2024-04-01T18:55:31Z
          Message:               Successfully scheduled resources for placement in membercluster2 (affinity score: 0, topology spread score: 0): picked by scheduling policy
          Observed Generation:   2
          Reason:                ScheduleSucceeded
          Status:                True
          Type:                  ResourceScheduled
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully Synchronized work(s) for placement
          Observed Generation:   2
          Reason:                WorkSynchronizeSucceeded
          Status:                True
          Type:                  WorkSynchronized
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully applied resources
          Observed Generation:   2
          Reason:                ApplySucceeded
          Status:                True
          Type:                  ResourceApplied
        Cluster Name:            membercluster3
        Conditions:
          Last Transition Time:  2024-04-01T18:55:31Z
          Message:               Successfully scheduled resources for placement in membercluster3 (affinity score: 0, topology spread score: 0): picked by scheduling policy
          Observed Generation:   2
          Reason:                ScheduleSucceeded
          Status:                True
          Type:                  ResourceScheduled
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully Synchronized work(s) for placement
          Observed Generation:   2
          Reason:                WorkSynchronizeSucceeded
          Status:                True
          Type:                  WorkSynchronized
          Last Transition Time:  2024-04-01T18:55:36Z
          Message:               Successfully applied resources
          Observed Generation:   2
          Reason:                ApplySucceeded
          Status:                True
          Type:                  ResourceApplied
      Selected Resources:
        Kind:     Namespace
        Name:     my-namespace
        Version:  v1
    Events:
      Type    Reason                     Age   From                                   Message
      ----    ------                     ----  ----                                   -------
      Normal  PlacementScheduleSuccess   108s  cluster-resource-placement-controller  Successfully scheduled the placement
      Normal  PlacementSyncSuccess       103s  cluster-resource-placement-controller  Successfully synchronized the placement
      Normal  PlacementRolloutCompleted  103s  cluster-resource-placement-controller  Resources have been applied to the selected clusters
    ````

## Clean up resources

If you no longer wish to use the `ClusterResourcePlacement` object, you can delete it using the `kubectl delete` command. The following example deletes the `ClusterResourcePlacement` object named `crp`:

```bash
kubectl delete clusterresourceplacement crp
```

## Next steps

To learn more about resource propagation, see the following resources:

* [Intelligent cross-cluster Kubernetes resource placement based on member clusters properties](./intelligent-resource-placement.md)
* [Upstream Fleet documentation](https://github.com/Azure/fleet/blob/main/docs/concepts/ClusterResourcePlacement/README.md)
