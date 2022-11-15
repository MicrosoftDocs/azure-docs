---
title: Migrate Batch pool configuration from Cloud Services to Virtual Machines
description: Learn how to update your pool configuration to the latest and recommended configuration
ms.topic: how-to
ms.date: 09/03/2021
---

# Migrate Batch pool configuration from Cloud Services to Virtual Machine

Currently, Batch pools can be created using either [virtualMachineConfiguration](/rest/api/batchservice/pool/add#virtualmachineconfiguration) or [cloudServiceConfiguration](/rest/api/batchservice/pool/add#cloudserviceconfiguration). We recommend using Virtual Machine Configuration only, as this configuration supports all Batch capabilities.

Cloud Services Configuration pools don't support some of the current Batch features, and won't support any newly added features. You won't be able to create new 'CloudServiceConfiguration' pools or add new nodes to existing pools [after February 29, 2024](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/).

If your Batch solutions currently use 'cloudServiceConfiguration' pools, we recommend changing to 'virtualMachineConfiguration' as soon as possible. This will enable you to benefit from all Batch capabilities, such as an expanded [selection of VM series](batch-pool-vm-sizes.md), Linux VMs, [containers](batch-docker-container-workloads.md), [Azure Resource Manager virtual networks](batch-virtual-network.md), and [node disk encryption](disk-encryption.md).

## Create a pool using Virtual Machine Configuration

You can't switch an existing active pool that uses 'cloudServiceConfiguration' to use 'virtualMachineConfiguration'. Instead, you'll need to create new pools. Once you've created your new 'virtualMachineConfiguration' pools and replicated all of your jobs and tasks, you can delete the old 'cloudServiceConfiguration'pools that you're no longer using.

All Batch APIs, command-line tools, the Azure portal, and the Batch Explorer UI let you create pools using 'virtualMachineConfiguration'.

For a walkthrough of the process of creating pools that use 'virtualMachineConfiguration, see the [.NET tutorial](tutorial-parallel-dotnet.md) or the [Python tutorial](tutorial-parallel-python.md).

## Pool configuration differences

Some of the key differences between the two configurations include:

- 'cloudServiceConfiguration' pool nodes only use Windows OS. 'virtualMachineConfiguration' pools can use either Linux or Windows OS.
- Compared to 'cloudServiceConfiguration' pools, 'virtualMachineConfiguration' pools have a richer set of capabilities, such as container support, data disks, and disk encryption.
- Pool and node startup and delete times may differ slightly between 'cloudServiceConfiguration' pools and 'virtualMachineConfiguration' pools.
- 'virtualMachineConfiguration' pool nodes utilize managed OS disks. The [managed disk type](../virtual-machines/disks-types.md) that is used for each node depends on the VM size chosen for the pool. If a 's' VM size is specified for the pool, for example 'Standard_D2s_v3', then a premium SSD is used. If a 'non-s' VM size is specified, for example 'Standard_D2_v3', then a standard HDD is used.

   > [!IMPORTANT]
   > As with Virtual Machines and Virtual Machine Scale Sets, the OS managed disk used for each node incurs a cost, which is additional to the cost of the VMs. 'virtualMachineConfiguration' pools can use [ephemeral OS disks](create-pool-ephemeral-os-disk.md), which create the OS disk on the VM cache or temporary disk, to avoid extra costs associated with managed disks.There is no OS disk cost for 'cloudServiceConfiguration' nodes, as the OS disk is created on the node's local disk.

## Azure Data Factory custom activity pools

Azure Batch pools can be used to run Data Factory custom activities. Any 'cloudServiceConfiguration' pools used to run custom activities will need to be deleted and new 'virtualMachineConfiguration' pools created.

When creating your new pools to run Data Factory custom activities, follow these practices:

- Pause all pipelines before creating the new pools and deleting the old ones to ensure no executions will be interrupted.
- The same pool ID can be used to avoid linked service configuration changes.
- Resume pipelines when new pools have been created.

For more information about using Azure Batch to run Data Factory custom activities, see [Azure Batch linked service](../data-factory/compute-linked-services.md#azure-batch-linked-service) and  [Custom activities in a Data Factory pipeline](../data-factory/transform-data-using-dotnet-custom-activity.md)

## Next steps

- Learn more about [pool configurations](nodes-and-pools.md#configurations).
- Learn more about [pool best practices](best-practices.md#pools).
- See the REST API reference for [pool addition](/rest/api/batchservice/pool/add) and [virtualMachineConfiguration](/rest/api/batchservice/pool/add#virtualmachineconfiguration).
