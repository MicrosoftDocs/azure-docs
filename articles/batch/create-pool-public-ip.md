---
title: Create a pool with specified public IP addresses
description: Learn how to create a Batch pool that uses your own public IP addresses.
ms.topic: how-to
ms.date: 06/02/2020
---

# Create an Azure Batch pool with specified public IP addresses

When you create an Azure Batch pool, you can [provision the pool in a subnet of Azure virtual network](batch-virtual-network.md) that you specify. Virtual machines in the Batch pool are accessed through public IP addresses that are created by Batch. These public IP addresses can change over the lifetime of the pool, which means that your network settings can become outdated if the IP addresses are not refreshed.

You can create a list of static public IP addresses to use with the virtual machines in your pool. This allows you to control the list of public IP addresses and ensure that they won't change unexpectedly. This can be especially useful if you are working with any external service, such as a database, that restricts access to certain IP addresses.

## Prerequisites

- **Authentication**. To use a public IP address, the Batch client API must use [Azure Active Directory (AD) authentication](batch-aad-auth.md).

- **An Azure VNet**. You must use a [virtual network](batch-virtual-network.md) from the same Azure subscription in which you are creating your pool and your IP addresses. Only Azure Resource Manager-based VNets may be used. Be sure that the VNet meets all of the [general requirements](batch-virtual-network.md#vnet-requirements).

- **At least one Azure public IP address**. To create one or more public IP addresses, you can use the [Azure portal](../virtual-network/virtual-network-public-ip-address.md#create-a-public-ip-address), the [Azure Command-Line Interface (CLI)](https://docs.microsoft.com/cli/azure/network/public-ip?view=azure-cli-latest#az-network-public-ip-create), or [Azure PowerShell](https://docs.microsoft.com/powershell/module/az.network/new-azpublicipaddress). Be sure to follow the requirements listed below.

> [!NOTE]
> Batch automatically allocates additional networking resources in the resource group containing the public IP addresses. For each 80 dedicated nodes, Batch generally allocates one network security group (NSG) and one load balancer. These resources are limited by the subscription's resource quotas. When using larger pools, you may need to [request a quota increase](batch-quota-limit.md#increase-a-quota) for one or more of these resources.

## Public IP address requirements

Keep in mind the following requirements when creating your public IP addresses:

- The public IP addresses must be in the same subscription and region as the Batch account you use to create your pool.
- The **IP address assignment** must be set to **Static**.
- **SKU** must be set to **Standard**.
- A DNS name must be specified.
- The public IP addresses must be used only for the virtual machine configuration pools. No other resources should use these IP addresses, or the pool may experience allocation failures.
- No security policies or resource locks should restrict a user's access to the public IP address.
- The number of public IP addresses specified for the pool must be large enough to accommodate the number of VMs targeted for the pool. This must be at least the sum of the **targetDedicatedNodes** and **targetLowPriorityNodes** properties of the pool. If there are not enough IP addresses, the pool partially allocates the compute nodes, and a resize error will occur. Currently, Batch uses one public IP address for every 80 VMs.
- Always have an additional buffer of public IP addresses. We recommend adding at least one additional public IP address, or approximately 10% of the total public IP addresses that you add to a pool, whichever is greater. This additional buffer will help Batch with its internal optimization when scaling down, as well as allowing quicker scaling up after an unsuccessful scale up or scale down.
- Once the pool is created, you can't add or change the list of public IP addresses used by the Pool. If you need to modify the list, you must delete the pool and then recreate it.

## Create a Batch pool with public IP addresses

The example below shows how to use the [Azure Batch Service REST API](https://docs.microsoft.com/rest/api/batchservice/pool/add) to create a pool that uses public IP addresses.

### Batch Service REST API

REST API URI

```http
POST {batchURL}/pools?api-version=2020-03-01.11.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

Request Body

```json
"pool": {
      "id": "pool2",
      "vmSize": "standard_a1",
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "Canonical",
          "offer": "UbuntuServer",
          "sku": "16.04.0-LTS"
        },
        "nodeAgentSKUId": "batch.node.ubuntu 16.04"
      },
"networkConfiguration": {
          "subnetId": "/subscriptions/subid/resourceGroups/rg1234/providers/Microsoft.Network/virtualNetworks/network1234/subnets/subnet123",
          "publicIPs": [
            "/subscriptions/subid1/resourceGroups/rg13/providers/Microsoft.Network/publicIPAddresses/ip135"
          ]
        },

       "resizeTimeout":"PT15M",
      "targetDedicatedNodes":5,
      "targetLowPriorityNodes":0,
      "maxTasksPerNode":3,
      "taskSchedulingPolicy": {
        "nodeFillType":"spread"
      }, 
      "enableAutoScale":false,
      "enableInterNodeCommunication":true,
      "metadata": [ {
        "name":"myproperty",
        "value":"myvalue"
      } ]
    }
```

## Next steps

- Learn about the [Batch service workflow and primary resources](batch-service-workflow-features.md) such as pools, nodes, jobs, and tasks.
- Learn about [creating a pool in a subnet of an Azure virtual network](batch-virtual-network.md).
