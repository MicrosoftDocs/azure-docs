---
title: Configure your Service Fabric managed cluster (preview)
description: Learn how to configure your Service Fabric managed cluster for automatic OS upgrades, NSG rules, and more.
ms.topic: how-to
ms.date: 02/15/2021
---
# Service Fabric managed cluster (preview) configuration options

In addition to selecting the [Service Fabric managed cluster SKU](overview-managed-cluster.md#service-fabric-managed-cluster-skus) when creating your cluster, there are a number of other ways to configure it. In the current preview, you can:

* Configure [networking options](how-to-managed-cluster-networking.md) for your cluster
* Add a [virtual machine scale set extension](how-to-managed-cluster-vmss-extension.md) to a node type
* Configure [managed identity](how-to-managed-identity-managed-cluster-virtual-machine-scale-sets.md) on your node types
* Enable [automatic OS upgrades](how-to-managed-cluster-configuration.md#enable-automatic-os-image-upgrades) for your nodes
* Enable [OS and data disk encryption](how-to-enable-managed-cluster-disk-encryption.md) on your nodes

## Enable automatic OS image upgrades

You can choose to enable automatic OS image upgrades to the virtual machines running your managed cluster nodes. Although the virtual machine scale set resources are managed on your behalf with Service Fabric managed clusters, it's your choice to enable automatic OS image upgrades for your cluster nodes. As with [classic Service Fabric](service-fabric-best-practices-infrastructure-as-code.md#azure-virtual-machine-operating-system-automatic-upgrade-configuration) clusters, managed cluster nodes are not upgraded by default, in order to prevent unintended disruptions to your cluster.

To enable automatic OS upgrades:

* Use the `2021-01-01-preview` (or later) version of *Microsoft.ServiceFabric/managedclusters* and *Microsoft.ServiceFabric/managedclusters/nodetypes* resources
* Set the cluster's property `enableAutoOSUpgrade` to *true*
* Set the cluster nodeTypes' resource property `vmImageVersion` to *latest*

For example:

```json
    {
      "apiVersion": "2021-01-01-preview",
      "type": "Microsoft.ServiceFabric/managedclusters",
      ...
      "properties": {
        ...
        "enableAutoOSUpgrade": true
      },
    },
    {
      "apiVersion": "2021-01-01-preview",
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
