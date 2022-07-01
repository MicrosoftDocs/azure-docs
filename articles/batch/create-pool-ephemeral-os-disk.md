---
title: Use ephemeral OS disk nodes for Azure Batch pools
description: Learn how and why to create a Batch pool that uses ephemeral OS disk nodes.
ms.topic: how-to
ms.date: 09/03/2021
ms.devlang: csharp
---

# Use ephemeral OS disk nodes for Azure Batch pools

Some Azure virtual machine (VM) series support the use of [ephemeral OS disks](../virtual-machines/ephemeral-os-disks.md), which create the OS disk on the node virtual machine local storage. The default Batch pool configuration uses [Azure managed disks](../virtual-machines/managed-disks-overview.md) for the node OS disk, where the managed disk is like a physical disk, but virtualized and persisted in remote Azure Storage.

For Batch workloads, the main benefits of using ephemeral OS disks are reduced costs associated with pools, the potential for faster node start time, and improved application performance due to better OS disk performance. When choosing whether ephemeral OS disks should be used for your workload, consider the following:

- There is lower read/write latency to ephemeral OS disks, which may lead to improved application performance.
- There is no storage cost for ephemeral OS disks, whereas there is a cost for each managed OS disk.
- Reimaging the node, when supported by Batch, will be faster for ephemeral disks compared to managed disks.
- Node start time may be slightly faster when ephemeral OS disks are used.
- Ephemeral OS disks are not highly durable and available; when a VM is removed for any reason, the OS disk is lost. Since Batch workloads are inherently stateless, and don't normally rely on changes to the OS disk being persisted, ephemeral OS disks are appropriate to use for most Batch workloads.
- The use of an ephemeral OS disk is not currently supported by all Azure VM series. If a VM size doesn't support an ephemeral OS disk, a managed OS disk must be used.

> [!NOTE]
> Ephemeral OS disk configuration is only applicable to 'virtualMachineConfiguration' pools, and aren't supported by 'cloudServiceConfiguration’ pools. We recommend using 'virtualMachineConfiguration for your Batch pools, as 'cloudServiceConfiguration' pools do not support all features and no new capabilities are planned. You won't be able to create new 'cloudServiceConfiguration' pools or add new nodes to existing pools [after February 29, 2024](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/). For more information, see [Migrate Batch pool configuration from Cloud Services to Virtual Machine](batch-pool-cloud-service-to-virtual-machine-configuration.md).

## VM series support

To determine whether a VM series supports ephemeral OS disks, check the documentation for each VM instance. For example, the [Ddv4 and Ddsv4-series](../virtual-machines/ddv4-ddsv4-series.md) supports ephemeral OS disks.

Alternately, you can programmatically query to check the 'EphemeralOSDiskSupported' capability. An example PowerShell cmdlet to query this capability is provided in the [ephemeral OS disk frequently asked questions](../virtual-machines/ephemeral-os-disks-faq.md).

## Create a pool that uses ephemeral OS disks

The `EphemeralOSDiskSettings` property is not set by default. You must set this property in order to configure ephemeral OS disk use on the pool nodes.

The following example shows how to create a Batch pool where the nodes use ephemeral OS disks and not managed disks.

### Batch .NET API

```csharp
VirtualMachineConfiguration virtualMachineConfiguration = new VirtualMachineConfiguration(
        imageReference: imageReference,
        nodeAgentSkuId: nodeAgentSku
        );
virtualMachineConfiguration.OSDisk = new OSDisk();
virtualMachineConfiguration.OSDisk.EphemeralOSDiskSettings = new DiffDiskSettings();
virtualMachineConfiguration.OSDisk.EphemeralOSDiskSettings.Placement = DiffDiskPlacement.CacheDisk;
```

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [costs that may be associated with Azure Batch workloads](budget.md).
