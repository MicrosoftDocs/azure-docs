---
title: Deploy and configure Azure VMware Solution
description: In this tutorial, learn how to use the information gathered in the planning stage to deploy and configure the Azure VMware Solution private cloud.
ms.topic: tutorial
ms.custom: "engagement-fy23, devx-track-azurecli"
ms.service: azure-vmware
ms.date: 7/13/2023
---

# Deploy and configure Azure VMware Solution

After you [plan your deployment](plan-private-cloud-deployment.md), deploy and configure your Azure VMware Solution private cloud. 

In this tutorial, you'll:

> [!div class="checklist"]
> * Register the resource provider and create a private cloud
> * Connect to a new or existing ExpressRoute virtual network gateway
> * Validate the network connection

Once you've completed this section, follow the next steps provided at the end of this tutorial.

## Register the Microsoft.AVS resource provider

[!INCLUDE [register-resource-provider-steps](includes/register-resource-provider-steps.md)]

## Create an Azure VMware Solution private cloud

[!INCLUDE [create-private-cloud-azure-portal-steps](includes/create-private-cloud-azure-portal-steps.md)]

## Connect to Azure Virtual Network with ExpressRoute

In the planning phase, you defined whether to use an *existing* or *new* ExpressRoute virtual network gateway.  

>[!IMPORTANT]
>[!INCLUDE [disk-pool-planning-note](includes/disk-pool-planning-note.md)] 

### Use a new ExpressRoute virtual network gateway

>[!IMPORTANT]
>You must have a virtual network with a GatewaySubnet that **does not** already have a virtual network gateway.

| If | Then  |
| --- | --- |
| You don't already have a virtual network...     |  Create the following:<ol><li><a href="tutorial-configure-networking.md#create-a-vnet-manually">Virtual network</a></li><li><a href="../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet">GatewaySubnet</a></li><li><a href="tutorial-configure-networking.md#create-a-virtual-network-gateway">Virtual network gateway</a></li><li><a href="tutorial-configure-networking.md#connect-expressroute-to-the-virtual-network-gateway">Connect ExpressRoute to the gateway</a></li></ol>        |
| You already have a virtual network **without** a GatewaySubnet...   | Create the following: <ol><li><a href="../expressroute/expressroute-howto-add-gateway-portal-resource-manager.md#create-the-gateway-subnet">GatewaySubnet</a></li><li><a href="tutorial-configure-networking.md#create-a-virtual-network-gateway">Virtual network gateway</a></li><li><a href="tutorial-configure-networking.md#connect-expressroute-to-the-virtual-network-gateway">Connect ExpressRoute to the gateway</a></li></ol>          |
| You already have a virtual network **with** a GatewaySubnet... | Create the following: <ol><li><a href="tutorial-configure-networking.md#create-a-virtual-network-gateway">Virtual network gateway</a></li><li><a href="tutorial-configure-networking.md#connect-expressroute-to-the-virtual-network-gateway">Connect ExpressRoute to the gateway</a></li></ol>    |

### Use an existing virtual network gateway

[!INCLUDE [connect-expressroute-to-vnet](includes/connect-expressroute-vnet.md)]


## Validate the connection

Ensure connectivity between the Azure Virtual Network where the ExpressRoute terminates and the Azure VMware Solution private cloud. 

1. Use a [virtual machine](../virtual-machines/windows/quick-create-portal.md#create-virtual-machine) within the Azure Virtual Network where the Azure VMware Solution ExpressRoute terminates. For more information, see [Connect to Azure Virtual Network with ExpressRoute](#connect-to-azure-virtual-network-with-expressroute).  

   1. Log into the Azure [portal](https://portal.azure.com).

   1. Navigate to a running VM, and under **Settings**, select **Networking** and the network interface resource.

      :::image type="content" source="../virtual-network/media/diagnose-network-routing-problem/view-nics.png" alt-text="Screenshot showing virtual network interface settings in Azure portal.":::

   1. On the left, select **Effective routes**. A list of address prefixes that are contained within the `/22` CIDR block you entered during the deployment phase displays.

1. To log into both vCenter Server and NSX-T Manager, open a web browser and log into the same virtual machine used for network route validation.  

   Find the vCenter Server and NSX-T Manager console's IP addresses and credentials in the Azure portal.  Select your private cloud and then **Manage** > **VMware credentials**.

   :::image type="content" source="media/tutorial-access-private-cloud/ss4-display-identity.png" alt-text="Screenshot displaying private cloud vCenter and NSX Manager URLs and credentials in Azure portal.":::


## Next steps

In the next tutorial, you'll connect Azure VMware Solution to your on-premises network through ExpressRoute.

> [!div class="nextstepaction"]
> [Connect to your on-premises environment](tutorial-expressroute-global-reach-private-cloud.md)
