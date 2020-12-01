---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 08/24/2020
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously checks the health state of worker nodes and performs automatic repair of the nodes if they become unhealthy. This document informs operators about how automatic node repair functionality behaves for both Windows and Linux nodes. In addition to AKS repairs, the Azure VM platform [performs maintenance on Virtual Machines][vm-updates] that experience issues as well. AKS and Azure VMs work together to minimize service disruptions for clusters.

## How AKS checks for unhealthy nodes

AKS uses rules to determine if a node is unhealthy and needs repair. AKS uses the following rules to determine if automatic repair is needed.

* The node reports status of **NotReady** on consecutive checks within a 10-minute timeframe
* The node doesn't report a status within 10 minutes

You can manually check the health state of your nodes with kubectl.

```
kubectl get nodes
```

## How automatic repair works

> [!Note]
> AKS initiates repair operations with the user account **aks-remediator**.

If a node is unhealthy based on the rules above and remains unhealthy for 10 consecutive minutes, the following actions are taken.

1. Reboot the node
1. If the reboot is unsuccessful, reimage the node
1. If the reimage is unsuccessful, create and reimage a new node

If none of the actions are successful, additional remediations are investigated by AKS engineers. If multiple nodes are unhealthy during a health check, each node is repaired individually before another repair begins.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
