---
title: Enable automatic OS upgrades for Service Fabric managed cluster (preview) nodes
description: Learn how to enable automatic OS upgrades for Azure Service Fabric managed cluster nodes.
ms.topic: how-to
ms.date: 02/15/2021
---
# Enable automatic OS upgrades for Service Fabric managed cluster (preview) nodes

You can choose to enable automatic OS upgrades to the virtual machines running your managed cluster nodes. Although the virtual machine scale set resources are managed on your behalf with Service Fabric managed clusters, it's your choice to enable automatic OS upgrades for your cluster nodes. As with [classic Service Fabric](service-fabric-best-practices-infrastructure-as-code.md#azure-virtual-machine-operating-system-automatic-upgrade-configuration) clusters, managed cluster nodes are not upgraded by default, in order to prevent unintended disruptions to your cluster.

To enable automatic OS upgrades, set the `EnableAutoOSUpgrade` property to *true* in your cluster template:

```json
TBD
```

Once enabled, Service Fabric will begin querying and tracking OS image versions in the managed cluster. If a new OS version is available, the cluster node types (virtual machine scale sets) will be upgraded, one at a time.

If a node upgrade fails, Service Fabric will retry after 24 hours, for a maximum of three retries. Similar to classic Service Fabric upgrades, unhealthy apps or nodes may block the upgrade.

Service Fabric runtime upgrades are only performed after confirming no cluster node OS upgrades are in progress.

## Next steps

[Link to sample template]

[Managed cluster overview]