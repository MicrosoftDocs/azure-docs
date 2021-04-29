---
title: 'Quickstart: Create and configure Route Server using the Azure portal'
description: In this quickstart, you learn how to create and configure a Route Server using the Azure portal.
services: route-server
author: duongau
ms.service: route-server
ms.topic: quickstart
ms.date: 03/03/2021
ms.author: duau
---

# Quickstart: Create and configure Route Server using the Azure portal

This article helps you configure Azure Route Server to peer with a Network Virtual Appliance (NVA) in your virtual network using the Azure portal. Azure Route Server will learn routes from the NVA and program them on the virtual machines in the virtual network. Azure Route Server will also advertise the virtual network routes to the NVA. For more information, read [Azure Route Server](overview.md).

:::image type="content" source="media/quickstart-configure-route-server-portal/environment-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure portal." border="false":::

> [!IMPORTANT]
> Azure Route Server (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

## Create a Route Server

### Sign in to your Azure account and select your subscription.

From a browser, navigate to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

### Create a Route Server

1. Go to https://aka.ms/routeserver.

1. Select **+ Create new route server**.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/route-server-landing-page.png" alt-text="Screenshot of Route Server landing page."::: 

1. On the **Create a Route Server** page, enter, or select the required information.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/create-route-server-page.png" alt-text="Screenshot of create Route Server page.":::     

    | Settings | Value |
    |----------|-------|
    | Subscription | Select the Azure subscription you want to use to deploy the Route Server. |
    | Resource group | Select a resource group to create the Route Server in. If you don't have an existing resource group, you can create a new one. |
    | Name | Enter a name for the Route Server. |
    | Region | Select the region the Route Server will be created in. Select the same region as the virtual network you created previously to see the virtual network in the drop-down. |
    | Virtual Network | Select the virtual network in which the Route Server will be created. You can create a new virtual network or use an existing virtual network. If you're using an existing virtual network, make sure the existing virtual network has enough space for a minimum of a /27 subnet to accommodate the Route Server subnet requirement. If you don't see your virtual network from the dropdown, make sure you've selected the correct Resource Group or region. |
    | Subnet | Once you've created or select a virtual network, the subnet field will appear. This subnet is dedicated to Route Server only. Select **Manage subnet configuration** and create the Azure Route Server subnet. Select **+ Subnet** and create a subnet using the following guidelines:</br><br>- The subnet must be named *RouteServerSubnet*.</br><br>- The subnet must be a minimum of /27 or larger.</br> |

1. Select **Review + create**, review the summary, and then select **Create**. 

    > [!NOTE]
    > The deployment of the Route Server will take about 20 minutes.

## Set up peering with NVA

The section will help you configure BGP peering with your NVA.

1. Go to [Route Server](https://aka.ms/routeserver) in the Azure portal and select the Route Server you want to configure.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/select-route-server.png" alt-text="Screenshot of Route Server list."::: 

1. Select **Peers** under *Settings* in the left navigation panel. Then select **+ Add** to add a new peer.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/peers-landing-page.png" alt-text="Screenshot of peers landing page."::: 

1. Enter the following information about your NVA peer.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/add-peer-page.png" alt-text="Screenshot of add peer page.":::

    | Settings | Value |
    |----------|-------|
    | Name | Give a name for the peering between your Route Server and the NVA. |
    | ASN |  Enter the Autonomous Systems Number (ASN) of your NVA. |
    | IPv4 Address | Enter the IP address of the NVA the Route Server will communicate with to establish BGP. |

1. Select **Add** to add this peer.

## Complete the configuration on the NVA

You'll need the Azure Route Server's peer IPs and ASN to complete the configuration on your NVA to establish a BGP session. You can obtain this information from the overview page your Route Server.

:::image type="content" source="./media/quickstart-configure-route-server-portal/route-server-overview.png" alt-text="Screenshot of Route Server overview page.":::

## Configure route exchange

If you have an ExpressRoute gateway and/or VPN gateway and you want them to exchange routes with the Route Server, you can enable route exchange.

1. Go to [Route Server](https://aka.ms/routeserver) in the Azure portal and select the Route Server you want to configure.

1. Select **Configuration** under *Settings* in the left navigation panel.

1. Select **Enable** for the **Branch-to-Branch** setting and then select **Save**.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/enable-route-exchange.png" alt-text="Screenshot of how to enable route exchange.":::

## Clean up resources

If you no longer need the Azure Route Server, select **Delete** from the overview page to deprovision the Route Server.

:::image type="content" source="./media/quickstart-configure-route-server-portal/delete-route-server.png" alt-text="Screenshot of how to delete Route Server.":::

## Next steps

After you create the Azure Route Server, continue to learn about how Azure Route Server interacts with ExpressRoute and VPN Gateways: 

> [!div class="nextstepaction"]
> [Azure ExpressRoute and Azure VPN support](expressroute-vpn-support.md)
