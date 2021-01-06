---
title: Migrate Batch pool configuration from Cloud Services to Virtual Machines
description: Learn how to update your pool configuration to the latest and recommended configuration
ms.topic: how-to
ms.date: 1/4/2021
---

# Migrate Batch pool configuration from Cloud Services to Virtual Machines

Batch pools can be created using either [cloudServiceConfiguration](https://docs.microsoft.com/rest/api/batchservice/pool/add#cloudserviceconfiguration) or [virtualMachineConfiguration](https://docs.microsoft.com/rest/api/batchservice/pool/add#virtualmachineconfiguration). 'virtualMachineConfiguration' is the recommended configuration as it supports all Batch capabilities. 'cloudServiceConfiguration' pools do not support all features and no new features are planned.

If you use 'cloudServiceConfiguration' pools, it is highly recommended that you move to use 'virtualMachineConfiguration' pools. This article describes how to migrate to the recommended 'virtualMachineConfiguration' configuration.

## New pools are required

Existing active pools cannot be updated from 'cloudServiceConfiguration' to 'virtualMachineConfiguration', new pools must be created. Creating pools using 'virtualMachineConfiguration' is supported by all Batch APIs, command-line tools, Azure portal, and the Batch Explorer UI.

The [.NET](tutorial-parallel-dotnet.md) and [Python](tutorial-parallel-python.md) tutorials provide examples of pool creation using 'virtualMachineConfiguration'.

## Pool configuration differences

The following should be considered when updating pool configuration:

- 'cloudServiceConfiguration' pool nodes are always Windows OS, 'virtualMachineConfiguration' pools can either be Linux or Windows OS.
- Compared to 'cloudServiceConfiguration' pools, 'virtualMachineConfiguration' pools have a richer set of capabilities, such as container support, data disks, and disk encryption.
- 'virtualMachineConfiguration' pool nodes utilize managed OS disks. The [managed disk type](../virtual-machines/disks-types.md) that is used for each node depends on the VM size chosen for the pool. If a 's' VM size is specified for the pool, for example 'Standard_D2s_v3', then a premium SSD is used. If a 'non-s' VM size is specified, for example 'Standard_D2_v3', then a standard HDD is used.

   > [!IMPORTANT]
   > As with Virtual Machines and Virtual Machine Scale Sets, the OS managed disk used for each node incurs a cost, which is additional to the cost of the VMs. There is no OS disk cost for 'cloudServiceConfiguration' nodes as the OS disk is created on the nodes local SSD.

- Pool and node startup and delete times may differ slightly between 'cloudServiceConfiguration' pools and 'virtualMachineConfiguration' pools.

## Next steps

- Learn more about [pool configurations](nodes-and-pools.md#configurations).
- Learn more about [pool best practices](best-practices.md#pools).
- REST API reference for [pool addition](https://docs.microsoft.com/rest/api/batchservice/pool/add) and [virtualMachineConfiguration](https://docs.microsoft.com/rest/api/batchservice/pool/add#virtualmachineconfiguration).
