---
title: 'Tutorial: Protect your Route Server with Azure DDoS protection'
description: Learn how to set up a route server and protect it with Azure DDoS protection using the Azure portal.
author: halkazwini
ms.author: halkazwini
ms.service: azure-route-server
ms.topic: tutorial
ms.date: 02/10/2025

#CustomerIntent: As an Azure administrator, I want to deploy Azure Route Server in my environment with DDoS protection so that the Route Server dynamically updates virtual machines (VMs) routing tables with any changes in the topology while it's protected by Azure DDoS protection.
---

# Tutorial: Protect your Azure Route Server with Azure DDoS protection

This article helps you create an Azure Route Server with a DDoS protected virtual network. Azure DDoS protection protects your publicly accessible route server from Distributed Denial of Service attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Network Protection SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DDoS protection plan
> * Create an Azure Route server
> * Enable the DDoS protection and plan
> * Configure the Route Server

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create DDoS protection plan

In this section, you create an Azure DDoS protection plan to associate with the virtual network you create later in the article.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter ***DDoS protection***. Select **DDoS protection plans** from the search results.

3. Select **+ Create**.

4. On the **Basics** tab of **Create a DDoS protection plan**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter ***myResourceGroup***. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter ***myDDoSProtectionPlan***. |
    | Region | Select **East US**. |

5. Select **Review + create**.

6. Select **Create**.

## Create a Route Server

In this section, you create an Azure Route Server. The virtual network and public IP address used for the route server are created during the deployment of the route server.

1. In the search box at the top of the portal, enter ***Route Server***. Select **Route Servers** from the search results.

2. Select **+ Create**.

3. On the **Basics** tab of **Create a Route Server**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter ***myRouteServer***. |
    | Region | Select **East US**. |
    | **Configure virtual networks** |   |
    | Virtual network | Select **Create new**. </br> In **Name**, enter ***myVNet***. </br> Leave the prepopulated **Address space** and **Subnets**. In the example for this article, the address space is **10.1.0.0/16** with a subnet of **10.1.0.0/24**. </br> In **Subnets**, for **Subnet name**, enter ***RouteServerSubnet***. </br> In **Address range**, enter ***10.1.1.0/27***. </br> Select **OK**.  |
    | Subnet | Select **RouteServerSubnet (10.1.1.0/27)**. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**. |
    | Public IP address name | Enter ***myPublicIP***. |

4. Select **Review + create**. 

5. Select **Create**.

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Enable DDoS protection

Azure DDoS Network is enabled at the virtual network where the resource you want to protect reside. 

1. In the search box at the top of the portal, enter ***Virtual network***. Select **Virtual networks** from the search results.

2. Select **myVNet**.

3. Select **DDoS protection** in **Settings**.

4. Select **Enable**.

5. In the pull-down box in DDoS protection plan, select **myDDoSProtectionPlan**.

6. Select **Save**.

## Set up peering with NVA

In this section, you set up the BGP peering with your NVA.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** from the search results.

2. Select **myRouteServer**.

3. In **Settings**, select **Peers**.

4. Select **+ Add**. 

5. Enter or select the following information in **Add Peer**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name for the peering between your Route Server and the NVA. |
    | ASN | Enter the Autonomous Systems Number (ASN) of your NVA. |
    | IPv4 Address | Enter the IP address of the NVA that you want to peer with the Route Server. |

6. Select **Add**.

## Complete the configuration on the NVA

You need the Azure Route Server's peer IPs and ASN to complete the configuration on your NVA to establish a BGP session. You can obtain this information from the overview page your Route Server.

1. In the search box at the top of the portal, enter ***Route Server***. Select **Route Servers** from the search results.

2. Select **myRouteServer**.

3. On the **Overview** page of **myRouteServer**, make note of the **ASN** and **Peer IPs**.

    :::image type="content" source="./media/route-server-overview.png" alt-text="Screenshot of Route Server overview page.":::

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, DDoS protection plan, and Route Server with the following steps:

1. In the search box at the top of the portal, enter ***myResourceGroup***. Select **myResourceGroup** from the search results.

1. Select **Delete resource group**.

1. In **Delete a resource group**, enter ***myResourceGroup***, and then select **Delete**.

1. Select **Delete** to confirm the deletion of the resource group and all its resources.

## Next step

> [!div class="nextstepaction"]
> [Configure and manage Azure Route Server](configure-route-server.md)
