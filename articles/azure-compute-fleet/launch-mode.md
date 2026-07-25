---
title: What is Launch mode for Azure Compute Fleet? (Preview)
description: Learn how Launch mode for Azure Compute Fleet provisions virtual machines in bulk and then hands off lifecycle control to you or your orchestrator.
author: fitzgeraldsteele
ms.author: fisteele
ms.topic: concept-article
ms.service: azure-compute-fleet
ms.date: 07/20/2026
ms.reviewer: cynthn
# Customer intent: As a platform engineer or orchestrator author, I want to provision many VMs in a single Compute Fleet request and then manage their lifecycle myself, so that I can integrate Azure capacity with my own scheduler.
---

# What is Launch mode for Azure Compute Fleet? (Preview)

> [!IMPORTANT]
> Launch mode for Azure Compute Fleet is currently in preview. Previews are made available to you on the condition that you agree to the [supplemental terms of use](https://azure.microsoft.com/support/legal/preview-supplemental-terms/). Some aspects of this feature may change prior to general availability (GA).

Azure Compute Fleet supports two modes that determine how the fleet manages the virtual machines (VMs) it provisions:

- **Launch mode** (`mode: Launch`) provisions VMs in a single request and then hands off control. The fleet object self-deletes after provisioning completes, while the VMs persist and are managed by you or your orchestrator.
- **Managed mode** (`mode: Managed`, the default) keeps the fleet in place to manage VM capacity over time, including replacing evicted Spot VMs when configured to maintain capacity. For more information, see [Managed mode for Azure Compute Fleet](managed-mode.md).

Launch mode is designed for cloud-native platforms and orchestrators—such as Kubernetes Karpenter, batch schedulers, or custom control planes—that want the bulk-provisioning and capacity-optimization power of Compute Fleet but manage VM lifecycle themselves.

## Launch mode characteristics

- **Single request, large scale.** Provision up to 10,000 VMs in a single fleet request.
- **VM size diversity.** Specify one to 10 VM sizes (SKUs), with automatic allocation based on your chosen allocation strategy. For more information, see [Allocation strategies](allocation-strategies.md).
- **Mixed pricing.** Combine Spot and Standard (on-demand) VMs in the same fleet.
- **Zone-aware provisioning.** Provision across the availability zones you specify.
- **Custom VM naming.** Use `vmNamePrefix` to give provisioned VMs orchestrator-friendly names. VMs are named using the pattern `<prefix>_<identifier>_<index>`.
- **Tag propagation.** Tags you apply to the fleet propagate to every VM it provisions.
- **No extra cost.** There's no charge for Compute Fleet itself - you pay only for the VMs that are provisioned.

## When to use Launch mode

Use Launch mode when:

- You have an external orchestrator (for example, Karpenter, Slurm, or a custom scheduler) that manages VM lifecycle.
- You need fast, bulk provisioning across many VM sizes and pricing models.

Use [Managed mode](managed-mode.md) instead when you want the fleet to maintain Spot capacity over time or to modify a running fleet's capacity and VM sizes.

## How Launch mode works

Launch mode provisions VMs and then steps out of the way:

1. **Submit the request.** You issue a single `PUT` to create the fleet with `mode` set to `Launch`. The fleet accepts the request and begins provisioning VMs across your specified VM sizes, zones, and pricing models.
1. **Provisioning is asynchronous.** Because the underlying Azure Resource Manager (ARM) deployment is asynchronous, the `PUT` returns *before* the VMs are fully provisioned.
1. **Discover and monitor the VMs.** Use the [Fleet List VMs API](#retrieve-and-monitor-vms) to retrieve the resource IDs of the VMs and monitor their provisioning status. Each VM progresses through `Launching` → `Creating` → `Succeeded` (or `Failed`).
1. **Observe and manage the VMs directly.** When a VM reaches `Creating`, you can observe it with standard VM APIs while provisioning continues. After provisioning completes, manage the standalone VM with standard VM APIs, the Azure CLI, Azure PowerShell, or the Azure portal.
1. **The fleet self-deletes.** A Launch mode fleet object automatically deletes itself a few hours (about 5 hours) after the request is accepted. The VMs it created persist and continue running until you delete them.

## Create a Launch mode fleet with REST

Launch mode requires a minimum API version of `2026-04-01-preview`.

The following abbreviated request shows how to create a Launch mode fleet. Supply the complete VM profile required for your workload in `baseVirtualMachineProfile`.

```http
PUT https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.AzureFleet/fleets/{fleetName}?api-version=2026-04-01-preview
Content-Type: application/json

{
  "location": "eastus",
  "zones": ["1", "2", "3"],
  "properties": {
    "mode": "Launch",
    "vmNamePrefix": "myapp",
    "vmSizesProfile": [
      {
        "name": "Standard_D2s_v3"
      }
    ],
    "regularPriorityProfile": {
      "capacity": 10,
      "allocationStrategy": "LowestPrice"
    },
    "computeProfile": {
      "computeApiVersion": "2024-03-01",
      "baseVirtualMachineProfile": {
        "storageProfile": { "...": "..." },
        "osProfile": { "...": "..." },
        "networkProfile": { "...": "..." }
      }
    }
  }
}
```

For a complete VM profile example, see [Create a fleet in Launch mode](quickstart-create-rest-api.md#create-a-fleet-in-launch-mode-preview).

## Retrieve and monitor VMs

When you create a Compute Fleet in Launch mode, the fleet provisions VMs and then hands off control. Because the underlying Azure Resource Manager (ARM) deployment is asynchronous, the fleet `PUT` request returns *before* the VMs are fully provisioned. To discover the resource IDs of the VMs and monitor their provisioning status, use the Fleet List VMs API.

> [!IMPORTANT]
> Use the Fleet List VMs API to discover VM resource IDs and monitor provisioning before the fleet object is deleted. The fleet object automatically deletes itself after a short period (about five hours) while the VMs persist. Capture the VM resource IDs promptly so that you can continue to manage the VMs after the fleet object is gone.

Call the Fleet List VMs API to return every VM associated with a fleet, along with its resource ID and current operation status.

```http
GET https://management.azure.com/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.AzureFleet/fleets/{fleetName}/virtualMachines?api-version=2026-04-01-preview
```

The response lists each VM with its `name`, fully qualified resource `id`, and `operationStatus`:

```json
{
  "value": [
    {
      "name": "myapp_fcb5649d_0",
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myapp_fcb5649d_0",
      "operationStatus": "Succeeded"
    },
    {
      "name": "myapp_fcb5649d_1",
      "id": "/subscriptions/{subscriptionId}/resourceGroups/{resourceGroupName}/providers/Microsoft.Compute/virtualMachines/myapp_fcb5649d_1",
      "operationStatus": "Creating"
    }
  ]
}
```

### Monitor provisioning status

In Launch mode, each VM moves through the following `operationStatus` values:

| Status | Meaning |
|--------|---------|
| `Launching` | The VM is scheduled to be created. You typically see this status only briefly. |
| `Creating` | The VM resource exists and is being provisioned. You can observe it by using standard VM REST APIs. |
| `Succeeded` | The VM was provisioned successfully and is ready to manage with standard VM APIs. |
| `Failed` | The VM couldn't be provisioned. |

Poll the Fleet List VMs API until every VM reaches a terminal status (`Succeeded` or `Failed`).

#### Polling guidance for orchestrators

- **Poll to a terminal state.** Continue polling until all VMs report `Succeeded` or `Failed`. A typical fleet completes provisioning within a couple of minutes, depending on capacity and the number of VMs requested.
- **Use direct VM APIs starting at `Creating`.** When the Fleet List VMs API reports `Creating`, the VM resource is observable through the standard [Virtual Machines REST APIs](/rest/api/compute/virtual-machines). You can use those APIs to monitor the VM while provisioning continues.
- **Capture resource IDs early.** Because the fleet object self-deletes after provisioning completes, persist the VM resource IDs (and any identifying tags or name prefix) as soon as they're available so that you don't lose track of the VMs.

### Manage VMs after hand-off

The VMs that a Launch mode fleet creates are standalone Azure VMs. After provisioning completes, manage them with the standard [Virtual Machines REST APIs](/rest/api/compute/virtual-machines), Azure CLI, Azure PowerShell, or the Azure portal - just as you would any other VM. The persisted VMs continue to consume VM and vCPU quota and incur billing charges until you delete them, independent of the fleet object.

To find the VMs later, you can also list VMs in the resource group with standard VM APIs, or filter by the custom name prefix or tags that you applied when you created the fleet.

## Considerations and limitations

- **Mode is immutable.** You set a fleet's mode at creation and can't change it.
- **Launch mode configuration can't be updated.** After you submit a Launch mode request, you can't change its capacity or VM configuration. Create a new fleet request to use different settings.
- **Quota is validated up front.** Compute Fleet checks that your subscription has sufficient Spot and Standard vCPU quota for the requested capacity before provisioning. If quota is insufficient, the request is rejected. Confirm quota before submitting a request.
- **The `maintain` Spot capacity preference isn't available in Launch mode.** The `spotPriorityProfile.maintain` setting applies only to Managed mode. For more information, see [Spot VM configuration](spot-vm-configuration.md).
- **Some VM profile properties aren't yet supported in Launch mode.** Keep the VM profile to the properties validated for Launch mode during preview.

## Next steps

- [Allocation strategies](allocation-strategies.md)
- [Create a Compute Fleet with an ARM template](quickstart-create-rest-api.md)
