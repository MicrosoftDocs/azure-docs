---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
services: container-service
ms.topic: conceptual
ms.date: 03/11/2021
---

# Azure Kubernetes Service (AKS) node auto-repair

AKS continuously monitors the health state of worker nodes and performs automatic node repair if they become unhealthy. The Azure virtual machine (VM) platform [performs maintenance on VMs][vm-updates] experiencing issues. 

AKS and Azure VMs work together to minimize service disruptions for clusters.

In this document, you'll learn how automatic node repair functionality behaves for both Windows and Linux nodes. 

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

If AKS identifies an unhealthy node that remains unhealthy for 10 minutes, AKS takes the following actions:

1. Reboot the node.
1. If the reboot is unsuccessful, reimage the node.

Alternative remediations are investigated by AKS engineers if auto-repair is unsuccessful. 

If AKS finds multiple unhealthy nodes during a health check, each node is repaired individually before another repair begins.


## Node Autodrain
There may be times where [Scheduled Events](scheduled-events) may take place on the underlying infrastructure of AKS nodes, and in the case of Spot instances, the underlying VM can be preempted and taken away.

In these cases Node Autodrain will cordon and drain the node, providing a graceful reschedule of your workloads.

Along with Scheduled Maintenance events, and Preempt, other VM events are now surfaced into the node events:

| Event | Description |   Action   |
| --- | --- | --- |
| Freeze | The Virtual Machine is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there is no impact on memory or open files  | No action |
| Reboot | The Virtual Machine is scheduled for reboot (non-persistent memory is lost). | Cordon & Drain | 
| Redeploy | The Virtual Machine is scheduled to move to another node (ephemeral disks are lost). | Cordon & Drain |
| Preempt | The Spot Virtual Machine is being deleted (ephemeral disks are lost). | Cordon & Drain |
| Terminate | The virtual machine is scheduled to be deleted.| Cordon & Drain |



## Limitations

In many cases, AKS can determine if a node is unhealthy and attempt to repair the issue, but there are cases where AKS either can't repair the issue or can't detect that there is an issue. For example, AKS can't detect issues if a node status is not being reported due to error in network configuration, or has failed to initially register as a healthy node.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->
[scheduled-events]: https://docs.microsoft.com/azure/virtual-machines/linux/scheduled-events#event-properties
<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
