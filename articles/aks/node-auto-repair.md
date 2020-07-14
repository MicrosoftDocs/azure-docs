---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 06/02/2020
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously checks the health state of worker nodes and performs automatic repair of the nodes if they become unhealthy. This document informs operators about how automatic node repair functionality behaves. In addition to AKS repairs, the Azure VM platform [performs maintenance on Virtual Machines][vm-updates] that experience issues as well. AKS and Azure VMs work together to minimize service disruptions for clusters.

> [!Important]
> Node auto-repair functionality is not currently supported for Windows Server node pools.

## How AKS checks for unhealthy nodes

> [!Note]
> AKS takes repair action on nodes with the user account **aks-remediator**.

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

Automatic repair is supported by default for clusters with a VM set type of **Virtual Machine Scale Sets**. If a node is determined to be unhealthy based on the rules above, AKS reboots the node after 10 consecutive unhealthy minutes. If nodes remain unhealthy after the initial repair operation, additional remediations are investigated by AKS engineers.
  
If multiple nodes are unhealthy during a health check, each node is repaired individually before another repair begins.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
