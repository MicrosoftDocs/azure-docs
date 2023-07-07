---
---
title: Arc SQL Managed Instance pod scheduling
description: Arc SQL Managed Instance pod scheduling
services: azure-arc
ms.service: azure-arc
ms.subservice: azure-arc-data-sqlmi
author: dnethi
ms.author: dinethi
ms.reviewer: mikeray
ms.date: 07/07/2023
ms.topic: how-to
---
---

# Arc SQL Managed Instance pod scheduling

By default, SQL pods are scheduled with a preferred pod anti affinity between each other.  This prefers that the pods are scheduled on different nodes but does not require it.  In a scenario where there are not enough schedulable nodes to place each pod on a distinct node, multiple pods will be scheduled on a single node.  This decision is not re-evaluated by Kubernetes until a pod is rescheduled.

This default behavior can be overridden using the scheduling options.  Arc SQL Managed Instance has three controls for scheduling, which are located at `$.spec.scheduling`

#### NodeSelector

The simplest of the controls is the node selector.  The node selector simply specifies a label that the target nodes for an instance must have.  The path of nodeSelector is `$.spec.scheduling.nodeSelector` and functions the same as any other Kubernetes nodeSelector property. (see: [Assign Pods to Nodes | Kubernetes](https://kubernetes.io/docs/tasks/configure-pod-container/assign-pods-nodes/#create-a-pod-that-gets-scheduled-to-your-chosen-node))

#### Affinity

Affinity is a feature in Kubernetes that allows fine-grained control over how pods are scheduled onto nodes within a cluster. There are many ways to leverage affinity in Kubernetes (see: [Assigning Pods to Nodes | Kubernetes](https://kubernetes.io/docs/concepts/scheduling-eviction/assign-pod-node/#affinity-and-anti-affinity)). The same rules for applying affinities to traditional StatefulSets in Kubernetes apply in SQL MI.  The exact same object model is used.

 

The path of affinity in a deployment is `$.spec.template.spec.affinity`, where as the path of affinity in SQL MI is `$.spec.scheduling.affinity`.

Here is a sample spec for a required pod anti affinity between replicas of a single SQL MI instance.  The labels chosen in the labelSelector of the affinity term are automatically applied by the dataController based on the resource type and name, but the labelSelector could be changed to use any labels provided.

  


