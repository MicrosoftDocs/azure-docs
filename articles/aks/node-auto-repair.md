---
title: Automatically repair Azure Kubernetes Service (AKS) nodes 
description: Learn about node auto-repair functionality and how AKS fixes broken worker nodes.
ms.topic: conceptual
ms.date: 05/30/2023
---

# Azure Kubernetes Service (AKS) node auto-repair

Azure Kubernetes Service (AKS) continuously monitors the health state of worker nodes and performs automatic node repair if they become unhealthy. The Azure virtual machine (VM) platform [performs maintenance on VMs][vm-updates] experiencing issues. AKS and Azure VMs work together to minimize service disruptions for clusters.

In this article, you learn how the automatic node repair functionality behaves for Windows and Linux nodes.

## How AKS checks for NotReady nodes

AKS uses the following rules to determine if a node is unhealthy and needs repair:

* The node reports the [**NotReady**](https://kubernetes.io/docs/reference/node/node-status/#condition) status on consecutive checks within a 10-minute time frame.
* The node doesn't report any status within 10 minutes.

You can manually check the health state of your nodes with the `kubectl get nodes` command.

## How automatic repair works

> [!NOTE]
> AKS initiates repair operations with the user account **aks-remediator**.

If AKS identifies an unhealthy node that remains unhealthy for *five* minutes, AKS performs the following actions:

1. Attempts to restart the node.
2. If the node restart is unsuccessful, AKS reimages the node.
3. If the reimage is unsuccessful and it's a Linux node, AKS redeploys the node.

AKS engineers investigate alternative remediations if auto-repair is unsuccessful.

> [!NOTE]
> Auto-repair is not triggered if the following taints are present on the node:` node.cloudprovider.kubernetes.io/shutdown`, `ToBeDeletedByClusterAutoscaler`.
> 
> The overall auto repair process can take up to an hour to complete. AKS retries for a max of 3 times for each step. 

## Node auto-drain

[Scheduled events][scheduled-events] can occur on the underlying VMs in any of your node pools. For [spot node pools][spot-node-pools], scheduled events may cause a *preempt* node event for the node. Certain node events, such as  *preempt*, cause AKS node auto-drain to attempt a cordon and drain of the affected node. This process enables rescheduling for any affected workloads on that node. You might notice the node receives a taint with `"remediator.aks.microsoft.com/unschedulable"`, because of `"kubernetes.azure.com/scalesetpriority: spot"`.

The following table shows the node events and actions they cause for AKS node auto-drain:

| Event | Description |   Action   |
| --- | --- | --- |
| Freeze | The VM is scheduled to pause for a few seconds. CPU and network connectivity may be suspended, but there's no impact on memory or open files.  | No action. |
| Reboot | The VM is scheduled for reboot. The VM's non-persistent memory is lost. | No action. |
| Redeploy | The VM is scheduled to move to another node. The VM's ephemeral disks are lost. | Cordon and drain. |
| Preempt | The spot VM is being deleted. The VM's ephemeral disks are lost. | Cordon and drain |
| Terminate | The VM is scheduled for deletion.| Cordon and drain. |

## Limitations

In many cases, AKS can determine if a node is unhealthy and attempt to repair the issue. However, there are cases where AKS either can't repair the issue or detect that an issue exists. For example, AKS can't detect issues in the following example scenarios:

* A node status isn't being reported due to error in network configuration.
* A node failed to initially register as a healthy node.

Node Autodrain is a best effort service and cannot be guaranteed to operate perfectly in all scenarios
## Next steps

Use [availability zones][availability-zones] to increase high availability with your AKS cluster workloads.

<!-- LINKS - Internal -->
[availability-zones]: ./availability-zones.md
[vm-updates]: ../virtual-machines/maintenance-and-updates.md
[scheduled-events]: ../virtual-machines/linux/scheduled-events.md
[spot-node-pools]: spot-node-pool.md
