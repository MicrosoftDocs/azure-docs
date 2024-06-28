---
title: Prepare to connect Azure Communications Gateway to your own virtual network
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway with VNet injection. 
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/26/2024
---

# Prepare to connect Azure Communications Gateway to your own virtual network (preview)

This article describes the steps required to connect an Azure Communications Gateway to your own virtual network using VNet injection for Azure Communications Gateway (preview). This procedure is required to deploy Azure Communications Gateway into a subnet that you control and is used when connecting your on premises network with ExpressRoute Private Peering or through an Azure VPN Gateway. Azure Communications Gateway has two service regions with their own connectivity, which means that you need to provide virtual networks and subnets in each of these regions.

The following diagram shows an overview of Azure Communications Gateway deployed with VNet injection. The network interfaces on Azure Communications Gateway facing your network are deployed into your subnet, while the network interfaces facing backend communications services remain managed by Microsoft.

:::image type="content" source="media/azure-communications-gateway-vnet-injection.svg" alt-text="Network diagram showing Azure Communications Gateway deployed into two Azure regions. The Azure Communications Gateway resource in each region connects to an Operator virtual network with Operator controlled IPs." lightbox="media/azure-communications-gateway-vnet-injection.svg":::

## Prerequisites

- Get your Azure subscription [enabled for Azure Communications Gateway](prepare-to-deploy.md#get-access-to-azure-communications-gateway-for-your-azure-subscription).
- Inform your onboarding team that you intend to use your own virtual networks.
- Create an Azure virtual network in each of the Azure regions to be used as the Azure Communications Gateway [service regions](reliability-communications-gateway.md#service-regions). Learn how to create a [virtual network](/azure/virtual-network/manage-virtual-network).
- Create a subnet in each Azure virtual network for Azure Communications Gateway's exclusive use. These subnets must each have at least 16 IP addresses (a /28 IPv4 range or larger). Nothing else must use this subnet. Learn how to create a [subnet](/azure/virtual-network/virtual-network-manage-subnet).
- Ensure that your Azure account has the Network Contributor role, or a parent of this role, on the virtual networks.
- Deploy your chosen connectivity solution (for example ExpressRoute) into your Azure subscription and ensure it's ready for use.

> [!TIP]
> Lab deployments only have one service region, so you only need to set up a single region during this procedure.

## Delegate the virtual network subnets

To use your virtual network with Azure Communications Gateway, you need to [delegate the subnets](/azure/virtual-network/subnet-delegation-overview) to Azure Communications Gateway. Subnet delegation gives explicit permissions to Azure Communications Gateway to create service-specific resources, such as network interfaces (NICs), in the subnets.

Follow these steps to delegate your subnets for use with your Azure Communications Gateway:

1. Go to your [virtual networks](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks) and select the virtual network to use in the first service region for Azure Communications Gateway.

1. Select  **Subnets**.
1. Select a subnet you wish to delegate to Azure Communications Gateway.

    > [!IMPORTANT]
    > The subnet you use must be dedicated to Azure Communications Gateway.
 
1. In **Delegate subnet to a service**, select *Microsoft.AzureCommunicationsGateway/networkSettings*, and then select **Save**.
1. Verify that *Microsoft.AzureCommunicationsGateway/networkSettings* appears in the **Delegated to** column for your subnet.
1. Repeat the above steps for the virtual network and subnet in the other Azure Communications Gateway service region.

## Configure network security groups

When you connect your Azure Communications Gateway to virtual networks, you need to configure a network security group (NSG) to allow traffic from your network to reach the Azure Communications Gateway. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port.

The rules of an NSG can be changed at any time, and changes are applied to all associated instances. It might take up to 10 minutes for the NSG changes to be effective.

> [!IMPORTANT]
> If you don't configure a network security group, your traffic won't be able to access the Azure Communication Gateway network interfaces.

The network security group configuration consists of two steps, to be carried out in each service region:

1. Create a network security group that allows the desired traffic.
1. Associate the network security group with the virtual network subnets.

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

### Create the relevant network security group

Work with your onboarding team to determine the right network security group configuration for your virtual networks. This configuration depends on your connectivity choice (for example ExpressRoute) and your virtual network topology.

Your network security group configuration must allow traffic to the necessary [port ranges used by Azure Communications Gateway](./connectivity.md#port-ranges-used-by-azure-communications-gateway).

> [!TIP]
> You can use [recommendations for network security groups](/azure/well-architected/security/networking#network-security-groups#network-security-groups) to help ensure your configuration matches best practices for security.

### Associate the subnet with the network security group

1. Go to your network security group, and select **Subnets**.
1. Select **+ Associate** from the top menu bar.
1. For **Virtual network**, select your virtual network.
1. For **Subnet**, select your virtual network subnet.
1. Select **OK** to associate the virtual network subnet with the network security group.
1. Repeat these steps for the other service region.

## Next step

> [!div class="nextstepaction"]
> [Prepare to deploy Azure Communications Gateway](prepare-to-deploy.md)
