---
title: Create an Azure Batch pool without public IP addresses (V2 preview)
description: Learn how to create an Azure Batch pool without public IP addresses.
ms.topic: how-to
ms.date: 05/26/2022
ms.custom: references_regions
---

# Create an Azure Batch pool without public IP addresses (V2 preview)

> [!NOTE]
> This is replacement to the current preview version of [Azure Batch pool withoud public IP addresses](batch-pool-no-public-ip-address.md). This new version requires [using simplified compute node communication](simplified-compute-node-communication.md).

> [!IMPORTANT]
> - Support for pools without public IP addresses (V2) in Azure Batch is currently in public preview for selected regions.
> - This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> - For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you create an Azure Batch pool, you can provision the virtual machine configuration pool without a public IP address. This article explains how to set up a Batch pool without public IP addresses.

## Why use a pool without public IP Addresses?

By default, all the compute nodes in an Azure Batch virtual machine configuration pool are assigned a public IP address. This address is used by the Batch service to support outbound access to the internet, as well as customers inbound access to compute nodes from internet.

To restrict access to these nodes and reduce the discoverability of these nodes from the internet, you can provision the pool without public IP addresses.

## Prerequisites

- **You must use simplified compute node communication**. Please follow the guide at [Use simplified compute node communication](simplified-compute-node-communication.md).

- **Authentication**. To use a pool without public IP addresses, the Batch client API must use Azure Active Directory (AD) authentication. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

- **An Azure virtual network**. You must create your pool in a [virtual network](batch-virtual-network.md), follow these  requirements and configurations. To prepare a VNet with one or more subnets in advance, you can use the Azure portal, Azure PowerShell, the Azure CLI, or other methods.

  - The VNet must be in the same subscription and region as the Batch account you use to create your pool.

  - The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool; that is, the sum of the `targetDedicatedNodes` and `targetLowPriorityNodes` properties of the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs.

  - If you plan to use [private endpoint with Batch accounts](private-connectivity.md), you must disable private endpoint network policies. This can be done by using Azure CLI:

    `az network vnet subnet update --vnet-name <vnetname> -n <subnetname> --resource-group <resourcegroup> --disable-private-endpoint-network-policies`

- **Outbound access for Batch node management**. A pool with no public IP addresses doesn't have internet outbound access enabled by default. To allow compute nodes to access the Batch node management service (see [Use simplified compute node communication](simplified-compute-node-communication.md)), you must:

  - (**Recommended**) Use [private endpoint for compute node management](private-connectivity.md).

  - Alternatively, provide your own internet outbound access support (see [Outbound access to the internet](#Outbound-access-to-the-internet)).

## Current limitations

1. Pools without public IP addresses must use Virtual Machine Configuration and not Cloud Services Configuration.
1. [Custom endpoint configuration](https://docs.microsoft.com/en-us/azure/batch/pool-endpoint-configuration) to Batch compute nodes doesn't work with pools without public IP addresses.
1. Because there are no public IP addresses, you can't [use your own specified public IP addresses](https://docs.microsoft.com/en-us/azure/batch/create-pool-public-ip) with this type of pool.

## Create a pool without public IP addresses in the Azure portal

1. Navigate to your Batch account in the Azure portal.
1. In the **Settings** window on the left, select **Pools**.
1. In the **Pools** window, select **Add**.
1. On the **Add Pool** window, select the option you intend to use from the **Image Type** dropdown.
1. Select the correct **Publisher/Offer/Sku** of your image.
1. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Target Spot/low-priority nodes**, as well as any desired optional settings.
1. Select a virtual network and subnet you wish to use. This virtual network must be in the same location as the pool you are creating.
1. In **IP address provisioning type**, select **NoPublicIPAddresses**.

![Screenshot of the Add pool screen with NoPublicIPAddresses selected.](https://docs.microsoft.com/en-us/azure/batch/media/batch-pool-no-public-ip-address/create-pool-without-public-ip-address.png)

## Use the Batch REST API to create a pool without public IP addresses

The example below shows how to use the [Azure Batch REST API](https://docs.microsoft.com/en-us/rest/api/batchservice/pool/add) to create a pool that uses public IP addresses.

### REST API URI

```http
POST {batchURL}/pools?api-version=2020-03-01.11.0
client-request-id: 00000000-0000-0000-0000-000000000000
```

### Request body

```json
"pool": {
     "id": "pool2",
     "vmSize": "standard_a1",
     "virtualMachineConfiguration": {
          "imageReference": {
               "publisher": "Canonical",
               "offer": "UbuntuServer",
               "sku": "16.040-LTS"
          },
     "nodeAgentSKUId": "batch.node.ubuntu 16.04"
     }
     "networkConfiguration": {
          "subnetId": "/subscriptions/<your_subscription_id>/resourceGroups/<your_resource_group>/providers/Microsoft.Network/virtualNetworks/<your_vnet_name>/subnets/<your_subnet_name>",
          "publicIPAddressConfiguration": {
               "provision": "NoPublicIPAddresses"
          }
     },
     "resizeTimeout": "PT15M",
     "targetDedicatedNodes": 5,
     "targetLowPriorityNodes": 0,
     "taskSlotsPerNode": 3,
     "taskSchedulingPolicy": {
          "nodeFillType": "spread"
     },
     "enableAutoScale": false,
     "enableInterNodeCommunication": true,
     "metadata": [
    {
      "name": "myproperty",
      "value": "myvalue"
    }
       ]
}
```

## Outbound access to the internet

In a pool without public IP addresses, your virtual machines won't be able to access the public internet unless you configure your network setup appropriately, such as by using [virtual network NAT](../virtual-network/nat-gateway/nat-overview.md). Note that NAT only allows outbound access to the internet from the virtual machines in the virtual network. Batch-created compute nodes won't be publicly accessible, since they don't have public IP addresses associated.

Another way to provide outbound connectivity is to use a user-defined route (UDR). This lets you route traffic to a proxy machine that has public internet access, for example [Azure Firewall](../firewall/overview.md).

> [!IMPORTANT]
> There is no extra network resource (load balancer, network security group) created for pools without public IP addresses. Since the compute nodes in the pool are not bound to any load balancer, Azure may provide [Default Outbound Access](../virtual-network/ip-services/default-outbound-access.md). However this is not recommended for production workloads, so we strongly suggest to bring your own internet outbound access.

## Migration from No Public IP v1 pools

For existing pools using the previous preview version of [Azure Batch No Public IP pool](batch-pool-no-public-ip-address.md), they can only be migrated if the pool was created in a [virtual network](batch-virtual-network.md). The pool can be migrated following the [opt-in process for simplified node communication](https://docs.microsoft.com/en-us/azure/batch/simplified-compute-node-communication):

- Opt in to use simplified node communication.
- Create [private endpoint for Batch node management](private-connectivity.md) in the virtual network.
- Shrink the pool to empty (zero node).
- Scale up the pool again and it will be automatically migrated to use the latest version of Batch no public IP pool.

## Next steps

- Learn how to [use simplified compute node communication](https://docs.microsoft.com/en-us/azure/batch/simplified-compute-node-communication).
- Learn more about [creating pools in a virtual network](https://docs.microsoft.com/en-us/azure/batch/batch-virtual-network).
- Learn how to [use private endpoints with Batch accounts](/Features/PrivateLink/Guide/Use-private-endpoints-with-Azure-Batch-accounts).
