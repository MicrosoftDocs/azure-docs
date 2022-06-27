---
title: Create a simplified node communication pool without public IP addresses (preview)
description: Learn how to create an Azure Batch simplified node communication pool without public IP addresses.
ms.topic: how-to
ms.date: 05/26/2022
ms.custom: references_regions
---

# Create a simplified node communication pool without public IP addresses (preview)

> [!NOTE]
> This replaces the previous preview version of [Azure Batch pool without public IP addresses](batch-pool-no-public-ip-address.md). This new version requires [using simplified compute node communication](simplified-compute-node-communication.md).

> [!IMPORTANT]
> - Support for pools without public IP addresses in Azure Batch is currently in public preview for [selected regions](simplified-compute-node-communication.md#supported-regions).
> - This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> - For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

When you create an Azure Batch pool, you can provision the virtual machine (VM) configuration pool without a public IP address. This article explains how to set up a Batch pool without public IP addresses.

## Why use a pool without public IP addresses?

By default, all the compute nodes in an Azure Batch VM configuration pool are assigned a public IP address. This address is used by the Batch service to support outbound access to the internet, as well inbound access to compute nodes from the internet.

To restrict access to these nodes and reduce the discoverability of these nodes from the internet, you can provision the pool without public IP addresses.

## Prerequisites

> [!IMPORTANT]
> The prerequisites have changed from the previous version of this preview. Make sure to review each item for changes before proceeding.

- Use simplified compute node communication. For more information, see [Use simplified compute node communication](simplified-compute-node-communication.md).

- The Batch client API must use Azure Active Directory (AD) authentication. Azure Batch support for Azure AD is documented in [Authenticate Batch service solutions with Active Directory](batch-aad-auth.md).

- Create your pool in an [Azure virtual network (VNet)](batch-virtual-network.md), follow these  requirements and configurations. To prepare a VNet with one or more subnets in advance, you can use the Azure portal, Azure PowerShell, the Azure Command-Line Interface (Azure CLI), or other methods.

  - The VNet must be in the same subscription and region as the Batch account you use to create your pool.

  - The subnet specified for the pool must have enough unassigned IP addresses to accommodate the number of VMs targeted for the pool; that is, the sum of the `targetDedicatedNodes` and `targetLowPriorityNodes` properties of the pool. If the subnet doesn't have enough unassigned IP addresses, the pool partially allocates the compute nodes, and a resize error occurs.

  - If you plan to use a [private endpoint with Batch accounts](private-connectivity.md), you must disable private endpoint network policies. Run the following Azure CLI command:

    `az network vnet subnet update --vnet-name <vnetname> -n <subnetname> --resource-group <resourcegroup> --disable-private-endpoint-network-policies`

- Enable outbound access for Batch node management. A pool with no public IP addresses doesn't have internet outbound access enabled by default. To allow compute nodes to access the Batch node management service (see [Use simplified compute node communication](simplified-compute-node-communication.md)) either:

  - Use `nodeManagement` [private endpoint with Batch accounts](private-connectivity.md). This is the preferred method.

  - Alternatively, provide your own internet outbound access support (see [Outbound access to the internet](#outbound-access-to-the-internet)).

## Current limitations

1. Pools without public IP addresses must use Virtual Machine Configuration and not Cloud Services Configuration.
1. [Custom endpoint configuration](pool-endpoint-configuration.md) for Batch compute nodes doesn't work with pools without public IP addresses.
1. Because there are no public IP addresses, you can't [use your own specified public IP addresses](create-pool-public-ip.md) with this type of pool.

## Create a pool without public IP addresses in the Azure portal

1. Navigate to your Batch account in the Azure portal.
1. In the **Settings** window on the left, select **Pools**.
1. In the **Pools** window, select **Add**.
1. On the **Add Pool** window, select the option you intend to use from the **Image Type** dropdown.
1. Select the correct **Publisher/Offer/Sku** of your image.
1. Specify the remaining required settings, including the **Node size**, **Target dedicated nodes**, and **Target Spot/low-priority nodes**, as well as any desired optional settings.
1. Select a virtual network and subnet you wish to use. This virtual network must be in the same location as the pool you are creating.
1. In **IP address provisioning type**, select **NoPublicIPAddresses**.

![Screenshot of the Add pool screen with NoPublicIPAddresses selected.](./media/batch-pool-no-public-ip-address/create-pool-without-public-ip-address.png)

## Use the Batch REST API to create a pool without public IP addresses

The example below shows how to use the [Batch Service REST API](/rest/api/batchservice/pool/add) to create a pool that uses public IP addresses.

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
               "sku": "18.04-lts"
          },
          "nodeAgentSKUId": "batch.node.ubuntu 18.04"
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
> There is no extra network resource (load balancer, network security group) created for simplified node communication pools without public IP addresses. Since the compute nodes in the pool are not bound to any load balancer, Azure may provide [Default Outbound Access](../virtual-network/ip-services/default-outbound-access.md). However, Default Outbound Access is not suitable for production workloads, so it is strongly recommended to bring your own Internet outbound access.

## Migration from previous preview version of No Public IP pools

For existing pools that use the [previous preview version of Azure Batch No Public IP pool](batch-pool-no-public-ip-address.md), it's only possible to migrate pools created in a [virtual network](batch-virtual-network.md). To migrate the pool, follow the [opt-in process for simplified node communication](simplified-compute-node-communication.md):

1. Opt in to use simplified node communication.
1. Create a [private endpoint for Batch node management](private-connectivity.md) in the virtual network.
1. Scale down the pool to zero nodes.
1. Scale out the pool again. The pool is then automatically migrated to the new version of the preview.

## Next steps

- Learn how to [use simplified compute node communication](simplified-compute-node-communication.md).
- Learn more about [creating pools in a virtual network](batch-virtual-network.md).
- Learn how to [use private endpoints with Batch accounts](private-connectivity.md).
