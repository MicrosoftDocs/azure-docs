---
title: Configure your Service Fabric managed cluster
description: Learn how to configure your Service Fabric managed cluster for automatic OS upgrades, NSG rules, and more.
ms.topic: how-to
ms.author: tomcassidy
author: tomvcassidy
ms.service: service-fabric
services: service-fabric
ms.date: 07/11/2022
---

# Service Fabric managed cluster configuration options

In addition to selecting the [Service Fabric managed cluster SKU](overview-managed-cluster.md#service-fabric-managed-cluster-skus) when creating your cluster, there are a number of other ways to configure it, including:

* Adding a [virtual machine scale set extension](how-to-managed-cluster-vmss-extension.md) to a node type
* Configuring cluster [availability zone spanning](how-to-managed-cluster-availability-zones.md)
* Configuring cluster [network settings](how-to-managed-cluster-networking.md)
* Configure a node type for [large virtual machine scale sets](how-to-managed-cluster-large-virtual-machine-scale-sets.md)
* Configuring [managed identity](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md) on cluster node types
* Enabling [OS and data disk encryption](how-to-managed-cluster-enable-disk-encryption.md) on cluster nodes
* Configure [autoscaling](how-to-managed-cluster-autoscale.md) on a secondary node type
* [Scale a node type](how-to-managed-cluster-modify-node-type.md#scale-a-node-type)
* Enable [automatic OS image upgrades](how-to-managed-cluster-modify-node-type.md#enable-automatic-os-image-upgrades) on cluster node types
* Modify the [OS image](how-to-managed-cluster-modify-node-type.md#modify-the-os-sku-for-a-node-type) used for a node type
* Configure [placement properties](how-to-managed-cluster-modify-node-type.md#configure-placement-properties-for-a-node-type) for a node type
* Selecting the cluster [managed disk type](how-to-managed-cluster-managed-disk.md) SKU
* Configuring cluster [upgrade options](how-to-managed-cluster-upgrades.md) for the runtime updates
* Configure [Dedicated Hosts](how-to-managed-cluster-dedicated-hosts.md) with managed cluster
* Use [Ephemeral OS disks](how-to-managed-cluster-ephemeral-os-disks.md) for node types in managed cluster

## Next steps

[Service Fabric managed clusters overview](overview-managed-cluster.md)

[Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates)
