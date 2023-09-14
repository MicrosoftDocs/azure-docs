---
title: Arc SQL Managed Instance pod scheduling
description: Describes how pods are scheduled for Azure Arc-enabled data services, and how you may configure them.
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2023
ms.topic: how-to
---

# Arc SQL Managed Instance pod scheduling

By default, SQL pods are scheduled with a preferred pod anti affinity between each other. This setting prefers that the pods are scheduled on different nodes, but does not require it. In a scenario where there are not enough nodes to place each pod on a distinct node, multiple pods are scheduled on a single node. Kubernetes does not reevaluate this decision until a pod is rescheduled.

This default behavior can be overridden using the scheduling options. Arc SQL Managed Instance has three controls for scheduling, which are located at `$.spec.scheduling`

## NodeSelector

The simplest control is node selector. The node selector simply specifies a label that the target nodes for an instance must have. The path of nodeSelector is `$.spec.scheduling.nodeSelector` and functions the same as any other Kubernetes nodeSelector property. (see: [Assign Pods to Nodes | Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#create-a-pod-that-gets-scheduled-to-your-chosen-node))

## Affinity

Affinity is a feature in Kubernetes that allows fine-grained control over how pods are scheduled onto nodes within a cluster. There are many ways to leverage affinity in Kubernetes (see: [Assigning Pods to Nodes | Kubernetes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)). The same rules for applying affinities to traditional StatefulSets in Kubernetes apply in SQL MI. The exact same object model is used.



The path of affinity in a deployment is `$.spec.template.spec.affinity`, whereas the path of affinity in SQL MI is `$.spec.scheduling.affinity`.

Here is a sample spec for a required pod anti affinity between replicas of a single SQL MI instance. The labels chosen in the labelSelector of the affinity term are automatically applied by the dataController based on the resource type and name, but the labelSelector could be changed to use any labels provided.


```yaml
apiVersion: sql.arcdata.microsoft.com/v13
kind: SqlManagedInstance
metadata:
  labels:
    management.azure.com/resourceProvider: Microsoft.AzureArcData
  name: sql1
  namespace: test
spec:
  backup:
    retentionPeriodInDays: 7
  dev: false
  licenseType: LicenseIncluded
  orchestratorReplicas: 1
  preferredPrimaryReplicaSpec:
    preferredPrimaryReplica: any
    primaryReplicaFailoverInterval: 600
  readableSecondaries: 1
  replicas: 3
  scheduling:
    affinity:
      podAntiAffinity:
        requiredDuringSchedulingIgnoredDuringExecution:
        - labelSelector:
            matchLabels:
              arc-resource: sqlmanagedinstance
              controller: sql1
          topologyKey: kubernetes.io/hostname
    default:
      resources:
        limits:
          cpu: "4"
        requests:
          cpu: "4"
          memory: 4Gi
  services:
    primary:
      type: NodePort
    readableSecondaries:
      type: NodePort
  storage:
    data:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
    logs:
      volumes:
      - accessMode: ReadWriteOnce
        className: local-storage
        size: 5Gi
  syncSecondaryToCommit: -1
  tier: BusinessCritical
```

## TopologySpreadConstraints

Pod topology spread constraints control rules around how pods are spread across different groupings of nodes in a Kubernetes cluster. A cluster may have different node topology domains defined such as regions, zones, node pools, etc. A standard Kubernetes topology spread constraint can be applied at `$.spec.scheduling.topologySpreadConstraints` (see: [Pod Topology Spread Constraints | Kubernetes](https://kubernetes.io/docs/concepts/scheduling-eviction/topology-spread-constraints/)).

For instance:


```yaml
apiVersion: sql.arcdata.microsoft.com/v13 
kind: SqlManagedInstance 
metadata: 
  labels: 
  management.azure.com/resourceProvider: Microsoft.AzureArcData 
  name: sql1 
  namespace: test 
spec: 
  backup: 
  retentionPeriodInDays: 7 
  dev: false 
  licenseType: LicenseIncluded 
  orchestratorReplicas: 1 
  preferredPrimaryReplicaSpec: 
  preferredPrimaryReplica: any 
  primaryReplicaFailoverInterval: 600 
  readableSecondaries: 1 
  replicas: 3 
  scheduling:
    topologySpreadConstraints:
    - maxSkew: 1
      topologyKey: kubernetes.io/hostname
      whenUnsatisfiable: DoNotSchedule
      labelSelector:
        matchLabels:
          name: sql1
```
