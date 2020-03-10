---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/10/2020
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously checks the health state of worker nodes and performs automatic repair of the nodes if they become unhealthy.

## Region Availability

This feature is available in all regions where AKS is supported.

## How AKS checks for unhealthy nodes

> [!Note]
> AKS takes repair action on nodes with the user account **aks-remediator**.

AKS uses rules to determine if a node is an unhealthy state and needs repair. AKS uses the following rules to determine if automatic repair is needed.

* The node reports status of **NotReady** on consecutive checks within a 10-minute timeframe
* The node doesn't report a status within 10 minutes

You can manually check the health state of your nodes with kubectl. 

```
kubectl get nodes
```

## How automatic repair works

Auto-repair takes several steps to repair a broken node.  If a node is determined to be unhealthy, AKS attemps several remediation steps.  The steps are performed in this order:

1. Docker is restarted on the node.
2. The node is rebooted.
3. The node is re-imaged.

> ![Note]
> If multiple nodes are unhealthy, they are repaired one by one

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md

