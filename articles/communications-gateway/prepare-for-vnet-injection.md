---
title: Prepare to connect Azure Communications Gateway to your own virtual network
description: Learn how to complete the prerequisite tasks required to deploy Azure Communications Gateway with VNet injection. 
author: rcdun
ms.author: rdunstan
ms.service: communications-gateway
ms.topic: how-to
ms.date: 04/26/2024
---

# Prepare to connect Azure Communications Gateway to your own virtual network (Preview)

This article describes the steps required to connect an Azure Communications Gateway to your own virtual network. This is required to deploy Azure Communications Gateway into a subnet which you control and is used when connecting your on premises network with ExpressRoute Private Peering and Virtual Private Networks (VPNs). Azure Communications Gateway deploys traffic handling elements such as the SBC into two Azure regions, known as service regions, which means that you will need to provide virtual networks (VNets) and subnets in each of these regions as VNets are restricted to a single region.

The following diagram shows an overview of Azure Communications Gateway deployed with VNet injection. The network interfaces on Azure Communications Gateway facing your network are deployed into your subnet, while the network interfaces facing backend communications services remain managed by Microsoft.

> [!TODO]
add diagram in here. 

## Prerequisites
- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
- Your Azure account has the [Network Contributor](/azure/role-based-access-control/built-in-roles#network-contributor) role, or a parent of this role, on the virtual network.
- An Azure virtual network and subnet in each of the Azure regions to be used as the Azure Communications Gateway [service regions](reliability-communications-gateway.md#service-regions). Learn how to create a [virtual network](/azure/virtual-network/manage-virtual-network) and [subnet](/azure/virtual-network/virtual-network-manage-subnet).
- Each subnet has at least 16 free IP addresses which can be used by Azure Communications Gateway. 
- Your subscription has been [enabled for Azure Communications Gateway](prepare-to-deploy.md#get-access-to-azure-communications-gateway-for-your-azure-subscription).
- You have deployed your chosen connectivity solution (for example ExpressRoute) into your Azure subscription. 

## 1. Provide permissions to the Azure Communications Gateway service principal

@@TODO question this. Lab services don't do it and just require the user to have the permissions. 

In order to deploy network interfaces into your subnets, Azure Communications Gateway needs to be able to make changes to your virtual network. To do this 

1. Sign in to the [Azure portal](https://portal.azure.com).
1. Go to your [virtual networks](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks) and select the VNet to use in the first service region for Azure Communications Gateway. 
1. Select **Access control (IAM)**
1. Select **Add role assignment**
1. Search for and select **AzureCommunicationsGateway** in the search bar 
1. Assign the **Network Contributor** role

## 2. Delegate the virtual network subnets 

To use your virtual network with Azure Communications Gateway you need to [delegate the subnets](/azure/virtual-network/subnet-delegation-overview) to Azure Communications Gateway. Subnet delegation gives explicit permissions to Azure Communications Gateway to create service-specific resources, such as network interfaces (NICs), in the subnets.

Follow these steps to delegate your subnet for use with your Azure Communications Gateway:

1. Go to your [virtual networks](https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks) and select the VNet to use in the first service region for Azure Communications Gateway. 

1. Select  **Subnets**.

1. Select a dedicated subnet you wish to delegate to Azure Communications Gateway.

    > [!IMPORTANT]
    > The subnet you use must be dedicated to Azure Communications Gateway. 
 
1. In **Delegate subnet to a service**, select *Microsoft.AzureCommunicationsGateway/networkSettings*, and then select **Save**.

  >[!TODO]
  > insert screenshot 

1. Verify that *Microsoft.AzureCommunicationsGateway/networkSettings* appears in the **Delegated to** column for your subnet.

  >[!TODO]
  > insert screenshot 

1. Repeat the above steps for the virtual network and subnet in the other Azure Communications Gateway service region. 

## 3. Configure network security groups.

When you connect your Azure Communications Gateway to virtual networks you need to configure a network security group (NSG) to allow traffic from your network to reach the Azure Communications Gateway. An NSG contains access control rules that allow or deny traffic based on traffic direction, protocol, source address and port, and destination address and port. 

The rules of an NSG can be changed at any time, and changes are applied to all associated instances. It might take up to 10 minutes for the NSG changes to be effective. 

> [!IMPORTANT]
> If you don't configure a network security group, you won't be able to access the Azure Communication Gateway network interfaces. 

The network security group configuration for advanced networking consists of two steps, to be carried out in each service region:

1. Create a network security group that allows the desired traffic.
1. Associate the network security group with the virtual network subnets.

[!INCLUDE [nsg intro](../../includes/virtual-networks-create-nsg-intro-include.md)]

### Create the relevant network security group

Work with your onboarding team to determine the right network security group configuration for your virtual networks. This will depend on your connectivity choice (for example ExpressRoute) and your virtual network topology. 

ACG requires connectivity from 
@@@TODO add port ranges and protocols. 

### Associate the subnet with the network security group

Go to your network security group, and select **Subnets**.

1. Select **+ Associate** from the top menu bar.

1. For **Virtual network**, select your virtual network.

1. For **Subnet**, select your virtual network subnet.

@@@TODO insert screenshot

1. Select **OK** to associate the virtual network subnet with the network security group.

1. Repeat these steps for the other service region. 

