---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/09/2021
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously monitors the health state of worker nodes and performs automatic node repair if they become unhealthy. 

In addition to AKS repairs, the Azure virtual machine (VM) platform [performs maintenance on VMs][vm-updates] experiencing issues. AKS and Azure VMs work together to minimize service disruptions for clusters.

In this document, you will learn how automatic node repair functionality behaves for both Windows and Linux nodes. 

## How AKS checks for unhealthy nodes

AKS uses the following rules to determine if a node is unhealthy and needs repair: 
* The node reports **NotReady** status on consecutive checks within a 10-minute timeframe.
* The node doesn't report any status within 10 minutes.

You can manually check the health state of your nodes with kubectl.

```
kubectl get nodes
```

## How automatic repair works

> [!Note]
> AKS initiates repair operations with the user account **aks-remediator**.

Based on the rules above, if AKS identifies an unhealthy node and it remains unhealthy for 10 consecutive minutes, AKS takes the following actions:

1. Reboot the node.
1. If the reboot is unsuccessful, reimage the node.
1. If the reimage is unsuccessful, create and reimage a new node.

Additional remediations are investigated by AKS engineers if auto-repair is unsuccessful. 

If AKS finds multiple unhealthy nodes during a health check, each node is repaired individually before another repair begins.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
