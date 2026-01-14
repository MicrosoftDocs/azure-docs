---
title: Migrate low-priority VMs to spot VMs in Batch
description: Learn how to migrate Azure Batch low-priority VMs to Spot VMs and plan for feature end of support.
author: padmalathas
ms.author: padmalathas
ms.service: azure-batch
ms.topic: how-to
ms.date: 11/20/2025
# Customer intent: As an Azure Batch user, I want to migrate my low-priority VMs to Spot VMs before the retirement deadline, so that I can continue to benefit from cost-effective compute resources without service disruption.
---

# Migrate Batch low-priority VMs to Spot VMs

The ability to allocate low-priority compute nodes in Azure Batch pools is being retired on *September 30, 2025*. Learn how to migrate your Batch pools with low-priority compute nodes to compute nodes based on Spot instances.

## About the feature

Currently, as part of a Batch pool configuration, you can specify a target number of low-priority compute nodes for Batch managed pool allocation Batch accounts. In user subscription pool allocation Batch accounts, you can specify a target number of spot compute nodes. In both cases, these compute resources are allocated from spare capacity and offered at a discount compared to dedicated, on-demand VMs.

The amount of unused capacity that's available varies depending on factors such as VM family, VM size, region, and time of day. Unlike dedicated capacity, these low-priority or spot VMs can be reclaimed at any time by Azure. Therefore, low-priority and spot VMs are typically viable for Batch workloads that are amenable to interruption or don't require strict completion timeframes to potentially lower costs.

## Feature end of support

Only low-priority compute nodes in Batch are being retired. Spot compute nodes will continue to be supported, is a GA offering, and not affected by this deprecation. On September 30, 2025, we'll retire low-priority compute nodes. After that date, existing low-priority pools in Batch may no longer be usable, attempts to seek back to target low-priority node counts will fail, and you'll no longer be able to provision new pools with low-priority compute nodes.

## Alternative: Use Azure Spot-based compute nodes in Batch pools

As of December 2021, Azure Batch began offering Spot-based compute nodes in Batch. Like low-priority VMs, you can use spot instances to obtain spare capacity at a discounted price in exchange for the possibility that the VM will be preempted. If a preemption occurs, the spot compute node will be evicted and all work that wasn't appropriately checkpointed will be lost. Checkpointing is optional and is up to the Batch end-user to implement. The running Batch task that was interrupted due to preemption will be automatically requeued for execution by a different compute node. Additionally, Azure Batch will automatically attempt to seek back to the target Spot node count as specified on the pool.

### What changes during migration

When migrating from low-priority to Spot VMs, the following pool configuration properties are affected:

- **Pool allocation mode**: Must be `UserSubscription` (Spot VMs are not available in `BatchService` mode)
- **VM configuration**: Must be `VirtualMachineConfiguration` (not supported in `CloudServiceConfiguration`)
- **Target node properties**: 
  - `targetLowPriorityNodes` → `targetSpotNodes` 
  - Pool pricing model changes from low-priority to Spot pricing
  - Eviction policy becomes configurable (delete or deallocate)

See the [detailed breakdown](batch-spot-vms.md) between the low-priority and spot offering in Batch.

## Migrate a Batch pool with low-priority compute nodes or create a Batch pool with Spot instances

### Prerequisites
1. Ensure that you're using a [user subscription pool allocation mode Batch account](batch-account-create-portal.md).
1. Verify your pool uses `VirtualMachineConfiguration` (Spot VMs are not supported in `CloudServiceConfiguration`).

### Option 1: Azure CLI Migration (Recommended for automation)

#### Create a new pool with Spot instances:
```azurecli-interactive
az batch pool create \
  --id "spot-pool-001" \
  --vm-size "Standard_D2s_v3" \
  --target-low-priority-nodes 5 \
  --enable-inter-node-communication false \
  --image "Canonical:0001-com-ubuntu-server-focal:20_04-lts-gen2" \
  --node-agent-sku-id "batch.node.ubuntu 20.04" \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com"
```

#### Scale existing pool to use Spot instances:
```azurecli-interactive
az batch pool resize \
  --pool-id <existing-pool-id> \
  --target-dedicated-nodes 0 \
  --target-low-priority-nodes 5 \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com"
```

### Option 2: Azure PowerShell (Alternative automation method)

#### Create pool with Spot instances:
```powershell
New-AzBatchPool `
  -Id "spot-pool-001" `
  -VirtualMachineSize "Standard_D2s_v3" `
  -TargetLowPriorityComputeNodes 5 `
  -VirtualMachineImageId "/subscriptions/{subscription}/resourceGroups/{rg}/providers/Microsoft.Compute/images/{image}" `
  -BatchContext $context
```

#### Validate with PowerShell:
```powershell
$pool = Get-AzBatchPool -Id "spot-pool-001" -BatchContext $context
$pool | Select-Object Id, VmSize, @{Name="SpotNodes";Expression={$_.TargetLowPriorityComputeNodes}}, State
```

### Option 3: Azure portal (UI method)

1. In the Azure portal, select the Batch account and view an existing pool or create a new pool.
1. Under **Scale**, select either **Target dedicated nodes** or **Target Spot/low-priority nodes**.

   :::image type="content" source="media/certificates/low-priority-vms-scale-target-nodes.png" alt-text="Screenshot that shows how to scale target nodes.":::

1. For an existing pool, select the pool, and then select **Scale** to update the number of spot nodes required based on the job scheduled.
1. Select **Save**.

## Validate the Migration

### Check pool configuration after migration:
```azurecli-interactive
az batch pool show \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com" \
  --pool-id <your-pool-id> \
  --query "{PoolID:id, VMSize:vmSize, SpotNodes:scaleSettings.targetLowPriorityNodes, AllocationMode:poolAllocationMode, VMConfig:virtualMachineConfiguration.nodeAgentSkuId}"
```

### Expected successful output:
```json
{
  "AllocationMode": "UserSubscription",
  "PoolID": "spot-pool-001",
  "SpotNodes": 5,
  "VMConfig": "batch.node.ubuntu 20.04",
  "VMSize": "Standard_D2s_v3"
}
```

### Check pool state and node allocation:
```azurecli-interactive
az batch pool show \
  --account-name <your-batch-account-name> \
  --account-endpoint "https://<your-batch-account-name>.<region>.batch.azure.com" \
  --pool-id <your-pool-id> \
  --query "{State:state, CurrentSpotNodes:currentLowPriorityNodes, TargetSpotNodes:scaleSettings.targetLowPriorityNodes, ResizeErrors:resizeErrors}"
```

### Expected output for healthy pool:
```json
{
  "CurrentSpotNodes": 5,
  "ResizeErrors": null,
  "State": "steady",
  "TargetSpotNodes": 5
}
```

### Troubleshooting: What indicates a problem?
- **State**: `"resizing"` (for extended periods) indicates allocation issues
- **ResizeErrors**: Any non-null value indicates capacity or quota issues
- **CurrentSpotNodes** < **TargetSpotNodes**: Pool hasn't reached target capacity

## Configuration Variables for Automation

For teams building automated solutions, these are the key configuration properties and their values:

### REST API Properties
- **Pool allocation mode**: `poolAllocationMode: "UserSubscription"`
- **VM configuration type**: `virtualMachineConfiguration` (required)
- **Target Spot nodes**: `targetLowPriorityNodes: <number>`
- **Eviction policy**: `virtualMachineConfiguration.spotPolicy.evictionPolicy: "delete"` or `"deallocate"`

### ARM Template Variables
```json
{
  "poolAllocationMode": "UserSubscription",
  "scaleSettings": {
    "targetDedicatedNodes": 0,
    "targetLowPriorityNodes": 5
  },
  "virtualMachineConfiguration": {
    "imageReference": {...},
    "nodeAgentSkuId": "batch.node.ubuntu 20.04"
  }
}
```

### Terraform Configuration
```hcl
resource "azurerm_batch_pool" "spot_pool" {
  pool_allocation_mode = "UserSubscription"
  
  scale_settings {
    target_dedicated_nodes     = 0
    target_low_priority_nodes  = 5
  }
  
  virtual_machine_configuration {
    image_reference {...}
    node_agent_sku_id = "batch.node.ubuntu 20.04"
  }
}
```

## FAQs

- How do I create a user subscription pool allocation Batch account?

   See the [quickstart](./batch-account-create-portal.md) to create a new Batch account in user subscription pool allocation mode.

- Are Spot VMs available in Batch managed pool allocation accounts?

  No. Spot VMs are available only in user subscription pool allocation Batch accounts.
  
- Are spot instances available for `CloudServiceConfiguration` Pools?

  No. Spot instances are only available for `VirtualMachineConfiguration` pools. `CloudServiceConfiguration` pools will be [retired](https://azure.microsoft.com/updates/azure-batch-cloudserviceconfiguration-pools-will-be-retired-on-29-february-2024/) before low-priority pools. We recommend that you migrate to `VirtualMachineConfiguration` pools and user subscription pool allocation Batch accounts before then.

- What is the pricing and eviction policy of spot instances? Can I view pricing history and eviction rates?

   Yes. In the Azure portal, you can see historical pricing and eviction rates per size in a region.

   For more information about using spot VMs, see [Spot Virtual Machines](/azure/virtual-machines/spot-vms).

- Can I transfer my quotas between Batch accounts?

  Currently you can't transfer any quotas between Batch accounts.

## Next steps

See the [Batch Spot compute instance guide](batch-spot-vms.md) for details on further details in the difference between offerings, limitations, and deployment examples.
