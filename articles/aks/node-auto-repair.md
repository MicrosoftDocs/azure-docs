---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/10/2020
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously checks the health state of worker nodes and performs automatic repair of the nodes if they become unhealthy. This documentation describes how Azure Kubernetes Service (AKS) monitors worker nodes, and repairs unhealthy worker nodes.  The documentation is to inform AKS operators on the behavior of node repair functionality. It is also important to note that Azure platform [performs maintenance on Virtual Machines][vm-updates] that experience issues. AKS and Azure work together to minimize service disruptions for your clusters.

> [!Important]
> Node auto-repair functionality isn't currently supported for Windows Server node pools.

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

> [!Note]
> AKS takes repair action on nodes with the user account **aks-remediator**.

This behavior is for **Virtual Machine Scale Sets**.  Auto-repair takes several steps to repair a broken node.  If a node is determined to be unhealthy, AKS attempts several remediation steps.  The steps are performed in this order:

1. After the container runtime becomes unresponsive for 10 minutes, the failing runtime services are restarted on the node.
2. If the node is not ready within 10 minutes, the node is rebooted.
3. If the node is not ready within 30 minutes, the node is re-imaged.

> [!Note]
> If multiple nodes are unhealthy, they are repaired one by one

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
