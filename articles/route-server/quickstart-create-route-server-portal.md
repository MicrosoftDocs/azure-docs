---
title: 'Quickstart: Create an Azure Route Server - Azure portal'
description: In this quickstart, you learn how to create an Azure Route Server using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 02/25/2025
ms.custom: mode-ui
---

# Quickstart: Create an Azure Route Server using the Azure portal

In this quickstart, you learn how to create an Azure Route Server to peer with a network virtual appliance (NVA) in your virtual network using the Azure portal.

:::image type="content" source="./media/route-server-diagram.png" alt-text="Diagram of Route Server deployment environment using the Azure portal.":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

- Review the [service limits for Azure Route Server](route-server-faq.md#limitations).

## Create a route server

In this section, you create a route server.

1. Sign in to [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter ***route server***, and select **Route Server** from the search results. 

    :::image type="content" source="./media/route-server-portal-search.png" alt-text="Screenshot of searching for Route Server in the Azure portal." lightbox="./media/route-server-portal-search.png":::

1. On the **Route Servers** page, select **+ Create**. 

1. On the **Basics** tab of **Create a Route Server**, enter, or select the following information:

    | Settings | Value |
    |----------|-------|
    | **Project details** |  |
    | Subscription | Select the Azure subscription that you want to use to deploy the route server. |
    | Resource group | Select **Create new**. <br>In **Name**, enter ***myResourceGroup***. <br>Select **OK**. |
    | **Instance details** |  |
    | Name | Enter ***myRouteServer***. |
    | Region | Select **East US** or any region you prefer to create the route server in. |
    | Routing Preference | Select **ExpressRoute**. Other available options: **VPN** and **ASPath**. |
    | **Configure virtual networks** |  |
    | Virtual network | Select **Create new**. <br>In **Name**, enter ***myVirtualNetwork***. <br>In **Address range**, enter ***10.0.0.0/16***. <br>In **Subnet name** and **Address range**, enter ***RouteServerSubnet*** and ***10.0.1.0/26*** respectively. <br>Select **OK**. |
    | Subnet | Once you created the virtual network and subnet, the **RouteServerSubnet** will populate. <br>- The subnet must be named *RouteServerSubnet*.<br>- The subnet must be a minimum of /26 or larger. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**. or select an existing Standard public IP resource to assign to the Route Server. To ensure connectivity to the backend service that manages the Route Server configuration, a public IP address is required. |
    | Public IP address name | Enter ***myVirtualNetwork-ip***. A Standard public IP address is required to ensure connectivity to the backend service that manages the route server. |

    :::image type="content" source="./media/create-route-server.png" alt-text="Screenshot that shows the Basics tab or creating a route server." lightbox="./media/create-route-server.png":::     

1. Select **Review + create** and then select **Create** after the validation passes.

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Set up peering with NVA

In this section, you learn how to configure BGP peering with a network virtual appliance (NVA).

1. Once the deployment is complete, select **Go to resource** to go to the **myRouteServer**.

1. Under **Settings**, select **Peers**. 

1. Select **+ Add** to add a peer.

1. On the **Add Peer** page, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | A name to identify the peer. It doesn't have to be the same name of the NVA. |
    | ASN | The Autonomous System Number (ASN) of the NVA. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use) |
    | IPv4 Address | The private IP address of the NVA that **myRouteServer** will communicate with to establish BGP. |

1. Select **Add** to add the peer.

    :::image type="content" source="./media/add-peer.png" alt-text="Screenshot that shows how to add the NVA to the route server as a peer." lightbox="./media/add-peer.png":::

## Complete the configuration on the NVA

To complete the peering setup, you must configure the NVA to establish a BGP session with the route server using its IP addresses and ASN. You can find the IP addresses and ASN of **myRouteServer** in the **Overview** page:

:::image type="content" source="./media/route-server-overview.png" alt-text="Screenshot that shows the Overview page of Route Server." lightbox="./media/route-server-overview.png":::

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When no longer needed, you can delete all resources created in this quickstart by deleting **myResourceGroup** resource group:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next step

> [!div class="nextstepaction"]
> [Configure peering between a route server and NVA](peer-route-server-with-virtual-appliance.md)
