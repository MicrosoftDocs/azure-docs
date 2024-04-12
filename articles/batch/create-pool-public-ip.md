---
title: Create a Batch pool with specified public IP addresses
description: Learn how to create an Azure Batch pool that uses your own static public IP addresses.
ms.topic: how-to
ms.custom:
ms.date: 05/26/2023
---

# Create an Azure Batch pool with specified public IP addresses

In Azure Batch, you can [create a Batch pool in a subnet of an Azure virtual network (VNet)](batch-virtual-network.md). Virtual machines (VMs) in the Batch pool are accessible through public IP addresses that Batch creates. These public IP addresses can change over the lifetime of the pool. If the IP addresses aren't refreshed, your network settings might become outdated.

You can create a list of static public IP addresses to use with the VMs in your pool instead. In some cases, you might need to control the list of public IP addresses to make sure they don't change unexpectedly.  For example, you might be working with an external service, such as a database, which restricts access to specific IP addresses.

For information about creating pools without public IP addresses, read [Create an Azure Batch pool without public IP addresses](./simplified-node-communication-pool-no-public-ip.md).

## Prerequisites

- The Batch client API must use [Microsoft Entra authentication](batch-aad-auth.md) to use a public IP address.
- An [Azure VNet](batch-virtual-network.md) from the same subscription where you're creating your pool and IP addresses. You can only use Azure Resource Manager-based VNets. Verify that the VNet meets all of the [general VNet requirements](batch-virtual-network.md#general-virtual-network-requirements).
- At least one existing Azure public IP address. Follow the [public IP address requirements](#public-ip-address-requirements) to create and configure the IP addresses.

> [!NOTE]
> Batch automatically allocates additional networking resources in the resource group containing the public IP addresses. For each 100 dedicated nodes, Batch generally allocates one network security group (NSG) and one load balancer. These resources are limited by the subscription's resource quotas. When using larger pools, you may need to [request a quota increase](batch-quota-limit.md#increase-a-quota) for one or more of these resources.

## Public IP address requirements

Create one or more public IP addresses through one of these methods:
- Use the [Azure portal](../virtual-network/ip-services/virtual-network-public-ip-address.md#create-a-public-ip-address)
- Use the [Azure Command-Line Interface (Azure CLI)](/cli/azure/network/public-ip#az-network-public-ip-create)
- Use [Azure PowerShell](/powershell/module/az.network/new-azpublicipaddress).

Make sure your public IP addresses meet the following requirements:

- Create the public IP addresses in the same subscription and region as the account for the Batch pool.
- Set the **IP address assignment** to **Static**.
- Set the **SKU** to **Standard**.
- Specify a DNS name.
- Make sure no other resources use these public IP addresses, or the pool might experience allocation failures. Only use these public IP addresses for the VM configuration pools.
- Make sure that no security policies or resource locks restrict user access to the public IP address.
- Create enough public IP addresses for the pool to accommodate the number of target VMs.
    - This number must equal at least the sum of the **targetDedicatedNodes** and **targetLowPriorityNodes** properties of the pool.
    - If you don't create enough IP addresses, the pool partially allocates the compute nodes, and a resize error happens.
    - Currently, Batch uses one public IP address for every 100 VMs.
- Also create a buffer of public IP addresses. A buffer helps Batch with internal optimization for scaling down. A buffer also allows quicker scaling up after an unsuccessful scale up or scale down. We recommend adding one of the following amounts of buffer IP addresses; choose whichever number is greater.
    - Add at least one more IP address.
    - Or, add approximately 10% of the number of total public IP addresses in the pool.

> [!IMPORTANT]
> After you create the Batch pool, you can't add or change its list of public IP addresses. If you want to change the list, you have to delete and recreate the pool.

## Create a Batch pool with public IP addresses

The following example shows how to create a pool through the [Azure Batch Service REST API](/rest/api/batchservice/pool/add) that uses public IP addresses.

REST API URI:

```http
POST {batchURL}/pools?api-version=2020-03-01.11.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

Request body:

```json
"pool": {
      "id": "pool2",
      "vmSize": "standard_a1",
      "virtualMachineConfiguration": {
        "imageReference": {
          "publisher": "Canonical",
          "offer": "UbuntuServer",
          "sku": "20.04-LTS"
        },
        "nodeAgentSKUId": "batch.node.ubuntu 20.04"
      },
"networkConfiguration": {
          "subnetId": "/subscriptions/<subId>/resourceGroups/<rgId>/providers/Microsoft.Network/virtualNetworks/<vNetId>/subnets/<subnetId>",
          "publicIPAddressConfiguration": {
            "provision": "usermanaged",
            "ipAddressIds": [
              "/subscriptions/<subId>/resourceGroups/<rgId>/providers/Microsoft.Network/publicIPAddresses/<publicIpId>"
          ]
        },

       "resizeTimeout":"PT15M",
      "targetDedicatedNodes":5,
      "targetLowPriorityNodes":0,
      "taskSlotsPerNode":3,
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

- [Learn about the Batch service workflow and primary resources](batch-service-workflow-features.md).
- [Create a pool in a subnet of an Azure virtual network](batch-virtual-network.md).
