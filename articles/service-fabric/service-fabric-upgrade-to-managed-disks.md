---
title: Upgrade cluster nodes to use Azure managed disks 
description: Here's how to upgrade an existing Service Fabric cluster to use Azure managed disks with little or no downtime of your cluster.
ms.topic: how-to
ms.date: 3/01/2020
---
# Upgrade cluster nodes to use Azure managed disks

[Azure managed disks](../virtual-machines/windows/managed-disks-overview.md) are the recommended disk storage offering for use with Azure virtual machines for persistent storage of data. You can improve the resiliency of your Service Fabric workloads by upgrading the virtual machine scale sets that underlie your node types to use managed disks. Here's how to upgrade an existing Service Fabric cluster to use Azure managed disks with little or no downtime of your cluster.

The general strategy for upgrading a Service Fabric cluster node to use managed disks is to deploy an otherwise duplicate virtual machine scale set of that node type, but with the [managedDisk](https://docs.microsoft.com/en-us/azure/templates/microsoft.compute/2019-07-01/virtualmachinescalesets/virtualmachines#ManagedDiskParameters) object added to the `osDisk` section of the virtual machine scale set deployment template. With both the original and upgraded scale sets running side by side, you'll then gracefully shut down the original node instances one at a time, as the system services (in the case of your primary node type) and/or replicas of stateful services (in the case of stateful non-primary node types) are created on the new scale set. Once you have verified...... remove the original node type.

## Upgrade non-primary nodes

https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-best-practices-capacity-scaling#vertical-scaling-considerations

## Upgrade primary nodes

https://docs.microsoft.com/en-us/azure/service-fabric/service-fabric-scale-up-node-type#upgrade-the-size-and-operating-system-of-the-primary-node-type-vms

https://github.com/microsoft/service-fabric-scripts-and-templates/blob/master/templates/nodetype-upgrade/Deploy-2NodeTypes-2ScaleSets.json