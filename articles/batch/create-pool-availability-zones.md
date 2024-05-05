---
title: Create a pool across availability zones
description: Learn how to create a Batch pool with zonal policy to help protect against failures.
ms.topic: how-to
ms.date: 05/25/2023
ms.devlang: csharp
ms.custom:
---

# Create an Azure Batch pool across Availability Zones

Azure regions which support [Availability Zones](https://azure.microsoft.com/global-infrastructure/availability-zones/) have a minimum of three separate zones, each with their own independent power source, network, and cooling system. When you create an Azure Batch pool using Virtual Machine Configuration, you can choose to provision your Batch pool across Availability Zones. Creating your pool with this zonal policy helps protect your Batch compute nodes from Azure datacenter-level failures.

For example, you could create your pool with zonal policy in an Azure region which supports three Availability Zones. If an Azure datacenter in one Availability Zone has an infrastructure failure, your Batch pool will still have healthy nodes in the other two Availability Zones, so the pool will remain available for task scheduling.

## Regional support and other requirements

Batch maintains parity with Azure on supporting Availability Zones. To use the zonal option, your pool must be created in a [supported Azure region](../availability-zones/az-region.md).

In order for your Batch pool to be allocated across availability zones, the Azure region in which the pool is created must support the requested VM SKU in more than one zone. You can validate this by calling the [Resource Skus List API](/rest/api/compute/resourceskus/list) and check the **locationInfo** field of [resourceSku](/rest/api/compute/resourceskus/list#resourcesku). Be sure that more than one zone is supported for the requested VM SKU.

For [user subscription mode Batch accounts](accounts.md#batch-accounts), make sure that the subscription in which you're creating your pool doesn't have a zone offer restriction on the requested VM SKU. To confirm this, call the [Resource Skus List API](/rest/api/compute/resourceskus/list) and check the [ResourceSkuRestrictions](/rest/api/compute/resourceskus/list#resourceskurestrictions). If a zone restriction exists, you can submit a [support ticket](/troubleshoot/azure/general/region-access-request-process) to remove the zone restriction.

Also note that you can't create a pool with a zonal policy if it has inter-node communication enabled and uses a [VM SKU that supports InfiniBand](../virtual-machines/extensions/enable-infiniband.md).

## Create a Batch pool across Availability Zones

The following examples show how to create a Batch pool across Availability Zones.

> [!NOTE]
> When creating your pool with a zonal policy, the Batch service will try to allocate your pool across all Availability Zones in the selected region; you can't specify a particular allocation across the zones.

### Batch Management Client .NET SDK

```csharp
pool.DeploymentConfiguration.VirtualMachineConfiguration.NodePlacementConfiguration = new NodePlacementConfiguration()
    {
        Policy = NodePlacementPolicyType.Zonal
    };

```

### Batch REST API

REST API URL

```
POST {batchURL}/pools?api-version=2021-01-01.13.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

Request body

```
"pool": {
    "id": "pool2",
    "vmSize": "standard_a1",
    "virtualMachineConfiguration": {
        "imageReference": {
            "publisher": "Canonical",
            "offer": "UbuntuServer",
            "sku": "20.04-lts"
        },
        "nodePlacementConfiguration": {
            "policy": "Zonal"
        }
        "nodeAgentSKUId": "batch.node.ubuntu 20.04"
    },
    "resizeTimeout": "PT15M",
    "targetDedicatedNodes": 5,
    "targetLowPriorityNodes": 0,
    "maxTasksPerNode": 3,
    "enableAutoScale": false,
    "enableInterNodeCommunication": false
}
```

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [creating a pool in a subnet of an Azure virtual network](batch-virtual-network.md).
- Learn about [creating an Azure Batch pool without public IP addresses](./simplified-node-communication-pool-no-public-ip.md).
