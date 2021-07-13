---
title: Configure your Service Fabric managed cluster
description: Learn how to configure your Service Fabric managed cluster for automatic OS upgrades, NSG rules, and more.
ms.topic: how-to
ms.date: 5/10/2021
---
# Service Fabric managed cluster configuration options

In addition to selecting the [Service Fabric managed cluster SKU](overview-managed-cluster.md#service-fabric-managed-cluster-skus) when creating your cluster, there are a number of other ways to configure it, including:

* Adding a [virtual machine scale set extension](how-to-managed-cluster-vmss-extension.md) to a node type
* Configuring cluster [availability zone spanning](how-to-managed-cluster-availability-zones.md)
* Configuring cluster [NSG rules and other networking options](how-to-managed-cluster-networking.md)
* Configuring [managed identity](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md) on cluster node types
* Enabling [automatic OS upgrades](how-to-managed-cluster-configuration.md#enable-automatic-os-image-upgrades) for cluster nodes
* Enabling [OS and data disk encryption](how-to-enable-managed-cluster-disk-encryption.md) on cluster nodes
* Selecting the cluster [managed disk type](how-to-managed-cluster-managed-disk.md) SKU
* Configuring cluster [upgrade options](how-to-managed-cluster-upgrades.md) for the runtime updates

## Enable automatic OS image upgrades

You can choose to enable automatic OS image upgrades to the virtual machines running your managed cluster nodes. Although the virtual machine scale set resources are managed on your behalf with Service Fabric managed clusters, it's your choice to enable automatic OS image upgrades for your cluster nodes. As with [classic Service Fabric](service-fabric-best-practices-infrastructure-as-code.md#virtual-machine-os-automatic-upgrade-configuration) clusters, managed cluster nodes are not upgraded by default, in order to prevent unintended disruptions to your cluster.

To enable automatic OS upgrades:

* Use the `2021-05-01` (or later) version of *Microsoft.ServiceFabric/managedclusters* and *Microsoft.ServiceFabric/managedclusters/nodetypes* resources
* Set the cluster's property `enableAutoOSUpgrade` to *true*
* Set the cluster nodeTypes' resource property `vmImageVersion` to *latest*

For example:

```json
    {
      "apiVersion": "2021-05-01",
      "type": "Microsoft.ServiceFabric/managedclusters",
      ...
      "properties": {
        ...
        "enableAutoOSUpgrade": true
      },
    },
    {
      "apiVersion": "2021-05-01",
      "type": "Microsoft.ServiceFabric/managedclusters/nodetypes",
       ...
      "properties": {
        ...
        "vmImageVersion": "latest",
        ...
      }
    }
}

```

Once enabled, Service Fabric will begin querying and tracking OS image versions in the managed cluster. If a new OS version is available, the cluster node types (virtual machine scale sets) will be upgraded, one at a time. Service Fabric runtime upgrades are performed only after confirming no cluster node OS image upgrades are in progress.

If an upgrade fails, Service Fabric will retry after 24 hours, for a maximum of three retries. Similar to classic (unmanaged) Service Fabric upgrades, unhealthy apps or nodes may block the OS image upgrade.

For more on image upgrades, see [Automatic OS image upgrades with Azure virtual machine scale sets](../virtual-machine-scale-sets/virtual-machine-scale-sets-automatic-upgrade.md).

## Next steps

[Service Fabric managed clusters overview](overview-managed-cluster.md)

[Service Fabric cluster templates](https://github.com/Azure-Samples/service-fabric-cluster-templates)
