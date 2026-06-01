---
title: 'Quickstart: Create an Azure Route Server using Azure portal'
description: Learn how to create and configure Azure Route Server with BGP peering to network virtual appliances using the Azure portal for dynamic routing in your virtual network.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: quickstart
ms.date: 09/17/2025
ms.custom: mode-ui
---

# Quickstart: Create an Azure Route Server using Azure portal

This quickstart shows you how to create an Azure Route Server and configure BGP peering with a network virtual appliance (NVA) using the Azure portal. Azure Route Server enables dynamic routing between your virtual network and network virtual appliances, automatically exchanging routes through BGP protocols.

By completing this quickstart, you have a functioning Route Server that can facilitate dynamic route exchange with network virtual appliances in your Azure virtual network.

:::image type="content" source="./media/route-server-diagram.png" alt-text="Diagram showing Azure Route Server deployment environment with BGP peering to network virtual appliances using the Azure portal.":::

If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn) before you begin.

[!INCLUDE [route server preview note](../../includes/route-server-note-preview-date.md)]

## Prerequisites

Before you begin, ensure you have the following requirements:

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).
- Familiarity with [Azure Route Server service limits](route-server-faq.md#limitations).

## Create a Route Server

This section walks you through creating Azure Route Server using the Azure portal, including the required virtual network infrastructure.

1. Sign in to the [Azure portal](https://portal.azure.com).

1. In the search box at the top of the portal, enter **route server**, and select **Route Server** from the search results.

    :::image type="content" source="./media/route-server-portal-search.png" alt-text="Screenshot showing how to search for Route Server in the Azure portal." lightbox="./media/route-server-portal-search.png":::

1. On the **Route Servers** page, select **+ Create**.

1. On the **Basics** tab of **Create a Route Server**, enter, or select the following information:

    | Settings | Value |
    |----------|-------|
    | **Project details** |  |
    | Subscription | Select the Azure subscription that you want to use to deploy the Route Server. |
    | Resource group | Select **Create new**. <br>In **Name**, enter **myResourceGroup**. <br>Select **OK**. |
    | **Instance details** |  |
    | Name | Enter **myRouteServer**. |
    | Region | Select **East US** or any region you prefer to create the Route Server in. |
    | Routing Preference | Select **ExpressRoute**. Other available options: **VPN** and **ASPath**. |
    | Route Server capacity | Select from the dropdown. For more information, see [Route Server Capacity](route-server-capacity.md). |
    | **Configure virtual networks** |  |
    | Virtual network | Select **Create new**. <br>In **Name**, enter **myVirtualNetwork**. <br>In **Address range**, enter **10.0.0.0/16**. <br>In **Subnet name** and **Address range**, enter **RouteServerSubnet** and **10.0.1.0/26** respectively. <br>Select **OK**. |
    | Subnet | Once you created the virtual network and subnet, the **RouteServerSubnet** populates. <br>- The subnet must be named **RouteServerSubnet**.<br>- The subnet must be a minimum of /26 or larger. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new** or select an existing Standard public IP resource to assign to the Route Server. A public IP address is required to ensure connectivity to the backend service that manages the Route Server configuration. |
    | Public IP address name | Enter **myVirtualNetwork-ip**. A Standard public IP address is required to ensure connectivity to the backend service that manages the Route Server. |

    :::image type="content" source="./media/create-route-server.png" alt-text="Screenshot showing the Basics tab for creating a Route Server in the Azure portal." lightbox="./media/create-route-server.png":::     

1. Select **Review + create** and then select **Create** after the validation passes.

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Configure BGP peering with network virtual appliance

After creating the Route Server, configure BGP peering with your network virtual appliance to enable dynamic route exchange.

1. Once the deployment is complete, select **Go to resource** to navigate to **myRouteServer**.

1. Under **Settings**, select **Peers**.

1. Select **+ Add** to add a BGP peer.

1. On the **Add Peer** page, enter the following information:

    | Setting | Value |
    | ------- | ----- |
    | Name | A name to identify the BGP peer. This doesn't need to match the actual NVA name. |
    | ASN | The Autonomous System Number (ASN) of the NVA. For more information, see [What Autonomous System Numbers (ASNs) can I use?](route-server-faq.md#what-autonomous-system-numbers-asns-can-i-use) |
    | IPv4 Address | The private IP address of the NVA that **myRouteServer** will communicate with to establish BGP. |

1. Select **Add** to create the BGP peering.

    :::image type="content" source="./media/add-peer.png" alt-text="Screenshot showing how to add a network virtual appliance to the Route Server as a BGP peer." lightbox="./media/add-peer.png":::

## Complete the configuration on the NVA

To complete the BGP peering setup, you must configure the NVA to establish a BGP session with the Route Server using its IP addresses and ASN. You can find the Route Server's IP addresses and ASN on the **Overview** page:

:::image type="content" source="./media/route-server-overview.png" alt-text="Screenshot showing the Overview page of Route Server with BGP configuration details." lightbox="./media/route-server-overview.png":::

Use these values to configure BGP on your NVA:
- **ASN**: The virtualRouterAsn value (typically 65515)  
- **Peer IP addresses**: The virtualRouterIps values shown in the overview

[!INCLUDE [NVA peering note](../../includes/route-server-note-nva-peering.md)]

## Clean up resources

When you no longer need the Route Server and associated resources, delete the resource group:

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter **myResourceGroup**, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next step

Now that you've created a Route Server and established BGP peering, learn more about Route Server capabilities:

> [!div class="nextstepaction"]
> [Tutorial: Configure BGP peering between Route Server and network virtual appliance](peer-route-server-with-virtual-appliance.md)
