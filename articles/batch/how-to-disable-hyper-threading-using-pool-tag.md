---
title: Disable hyper-threading for Batch pool nodes
description: Learn how to disable hyper-threading (simultaneous multithreading) on the compute nodes of an Azure Batch pool by using a pool tag.
ms.topic: how-to
ms.date: 08/03/2026
# Customer intent: As a cloud architect running HPC or core-licensed workloads on Azure Batch, I want to disable hyper-threading on my pool nodes, so that each task runs on a physical core for more predictable performance and to satisfy per-core licensing requirements.
---

# Disable hyper-threading for Azure Batch pool nodes

Many Azure virtual machine (VM) sizes ship with [hyper-threading](/azure/virtual-machines/acu) (also called simultaneous multithreading, or SMT) enabled, which exposes two logical vCPUs for each physical core. For some Azure Batch workloads, you might want to disable hyper-threading so that each compute node exposes only its physical cores. Common reasons include:

- **High performance computing (HPC) workloads** that are sensitive to memory bandwidth or cache contention and perform better with one thread per physical core.
- **Per-core software licensing**, where you're billed by the number of physical cores and want to avoid counting logical cores.
- **Predictable, deterministic performance** for tightly coupled or benchmark-sensitive applications.

You disable hyper-threading on a Batch pool by adding a reserved [tag](/azure/azure-resource-manager/management/tag-resources) to the pool. Batch propagates the tag to the virtual machine scale set that backs the pool, and the compute platform provisions the nodes with hyper-threading turned off (one thread per physical core).

> [!NOTE]
> The Batch service no longer requires you to register the `Microsoft.Compute/PlatformSettingsOverride` feature (Azure Feature Exposure Control flag) on your subscription to use this capability. Applying the pool tag is now sufficient. If you previously received a `Platform settings override is not supported in this subscription` error, retry after the latest Batch service rollout.

## VM size support

Disabling hyper-threading only applies to VM sizes that ship with hyper-threading enabled, that is, sizes that have two threads per physical core. On those sizes, disabling hyper-threading exposes one thread per core, which **halves the number of vCPUs** presented by each node (for example, a 16-vCPU size presents 8 cores).

VM sizes that already expose one thread per core (for example, many GPU and specialized HPC sizes) don't support the setting, and the tag has no effect on them.

To determine whether a VM size supports disabling hyper-threading, check its **vCPUs per core** ratio:

- Review the [VM sizes documentation](/azure/virtual-machines/sizes) for the series you plan to use. A `vCPUs:Core` ratio of `2:1` indicates hyper-threading is enabled and can be disabled.
- Or query the [Resource SKUs - List API](/rest/api/compute/resource-skus/list) and inspect the `vCPUsPerCore` capability. A value of `2` means hyper-threading can be disabled; a value of `1` means it can't.

## How disabling hyper-threading affects your pool

- **vCPU count halves.** Because each node exposes only physical cores, the number of vCPUs per node is halved. Plan your pool size and [core quotas](batch-quota-limit.md) accordingly.
- **Task scheduling slots.** If you rely on the default of one task slot per vCPU, or you set [`taskSlotsPerNode`](batch-parallel-node-tasks.md), review those values so tasks are scheduled as expected on the reduced core count.
- **Billing is unchanged.** You're still billed for the VM size you selected; disabling hyper-threading doesn't change the VM's price.

## Add the pool tag

Set a tag on the pool resource with the following key and value:

| Tag key | Tag value |
| --- | --- |
| `platformsettings.host_environment.disablehyperthreading` | `true` |

Because you set the tag on the `Microsoft.Batch/batchAccounts/pools` resource, create or update the pool through Azure Resource Manager. For example, use an ARM template, a Bicep file, or the Batch Management REST API. The `platformsettings.` prefix is reserved for platform settings, so use the key exactly as shown.

### Bicep

The following Bicep example creates a pool with hyper-threading disabled. Only the `tags` property is required to enable the behavior.

```bicep
resource pool 'Microsoft.Batch/batchAccounts/pools@2024-07-01' = {
  name: 'hpcpool'
  parent: batchAccount
  tags: {
    'platformsettings.host_environment.disablehyperthreading': 'true'
  }
  properties: {
    vmSize: 'Standard_D16s_v5'
    deploymentConfiguration: {
      virtualMachineConfiguration: {
        imageReference: {
          publisher: 'canonical'
          offer: '0001-com-ubuntu-server-jammy'
          sku: '22_04-lts'
          version: 'latest'
        }
        nodeAgentSkuId: 'batch.node.ubuntu 22.04'
      }
    }
    scaleSettings: {
      fixedScale: {
        targetDedicatedNodes: 2
        resizeTimeout: 'PT15M'
      }
    }
  }
}
```

### ARM template

```json
{
  "type": "Microsoft.Batch/batchAccounts/pools",
  "apiVersion": "2024-07-01",
  "name": "[format('{0}/{1}', parameters('batchAccountName'), 'hpcpool')]",
  "tags": {
    "platformsettings.host_environment.disablehyperthreading": "true"
  },
  "properties": {
    "vmSize": "Standard_D16s_v5",
    "deploymentConfiguration": {
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "canonical",
          "offer": "0001-com-ubuntu-server-jammy",
          "sku": "22_04-lts",
          "version": "latest"
        },
        "nodeAgentSkuId": "batch.node.ubuntu 22.04"
      }
    },
    "scaleSettings": {
      "fixedScale": {
        "targetDedicatedNodes": 2,
        "resizeTimeout": "PT15M"
      }
    }
  }
}
```

### Batch Management REST API

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Batch/batchAccounts/{accountName}/pools/{poolName}?api-version=2024-07-01
```

```json
{
  "tags": {
    "platformsettings.host_environment.disablehyperthreading": "true"
  },
  "properties": {
    "vmSize": "Standard_D16s_v5",
    "deploymentConfiguration": {
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "canonical",
          "offer": "0001-com-ubuntu-server-jammy",
          "sku": "22_04-lts",
          "version": "latest"
        },
        "nodeAgentSkuId": "batch.node.ubuntu 22.04"
      }
    },
    "scaleSettings": {
      "fixedScale": {
        "targetDedicatedNodes": 2,
        "resizeTimeout": "PT15M"
      }
    }
  }
}
```

> [!IMPORTANT]
> To disable hyper-threading, set the tag value to `true`. Setting any other value or removing the tag re-enables hyper-threading. When you change this tag on an existing pool, you must reimage or recreate the nodes (for example, by resizing the pool down to zero and back up) for the change to take effect.

## Verify that hyper-threading is disabled

After the nodes are provisioned, sign in to a compute node (for example, through the Azure portal or by [configuring remote access](pool-endpoint-configuration.md)) and confirm the thread count.

- **Linux:** Run `lscpu` and confirm that `Thread(s) per core: 1`.

  ```bash
  lscpu | grep -i "Thread(s) per core"
  ```

- **Windows:** Compare the number of logical processors to the number of physical cores. When hyper-threading is disabled, the two values are equal.

  ```powershell
  Get-CimInstance Win32_Processor | Select-Object NumberOfCores, NumberOfLogicalProcessors
  ```

## Next steps

- Learn about [Batch pool and compute node lifetime](nodes-and-pools.md).
- Review [VM sizes for Batch pools](batch-pool-vm-sizes.md).
- Understand [Batch service quotas and limits](batch-quota-limit.md), including core quotas.
- Configure [task scheduling across nodes](batch-parallel-node-tasks.md).
