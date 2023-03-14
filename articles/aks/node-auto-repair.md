---
title: Automatically repairing Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality, and how AKS fixes broken worker nodes.
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
> Minimum required Nodes in an AKS Cluster for auto repair is 2. 

If AKS identifies an unhealthy node that remains unhealthy for 10 minutes, AKS takes the following actions:

1. Reboot the node.
1. If the reboot is unsuccessful, reimage the node.
1. If the reimage is unsuccessful, redeploy the node.

Alternative remediations are investigated by AKS engineers if auto-repair is unsuccessful. 

If AKS finds multiple unhealthy nodes during a health check, each node is repaired individually before another repair begins.


## Node Autodrain
[Scheduled Events][scheduled-events] can occur on the underlying virtual machines (VMs) in any of your node pools. For [spot node pools][spot-node-pools], scheduled events may cause a *preempt* node event for the node. Certain node events, such as  *preempt*, cause AKS node autodrain to attempt a cordon and drain of the affected node, which allows for a graceful reschedule of any affected workloads on that node. When this happens, you might notice the node to receive a taint with *"remediator.aks.microsoft.com/unschedulable"*, because of *"kubernetes.azure.com/scalesetpriority: spot"*.


The following table shows the node events, and the actions they cause for AKS node autodrain.

| Event | Description |   Action   |
| --- | --- | --- |
| Freeze | The VM is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there is no impact on memory or open files  | No action |
| Reboot | The VM is scheduled for reboot. The VM's non-persistent memory is lost. | No action | 
| Redeploy | The VM is scheduled to move to another node. The VM's ephemeral disks are lost. | Cordon and drain |
| Preempt | The spot VM is being deleted. The VM's ephemeral disks are lost. | Cordon and drain |
| Terminate | The VM is scheduled to be deleted.| Cordon and drain |



## Limitations

In many cases, AKS can determine if a node is unhealthy and attempt to repair the issue, but there are cases where AKS either can't repair the issue or can't detect that there is an issue. For example, AKS can't detect issues if a node status is not being reported due to error in network configuration, or has failed to initially register as a healthy node.

## Next steps

Use [Availability Zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - External -->
<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
[scheduled-events]: ../virtual-machines/linux/scheduled-events.md
[spot-node-pools]: spot-node-pool.md
