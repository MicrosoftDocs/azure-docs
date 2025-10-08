---
title: 'Tutorial: Protect your Route Server with Azure DDoS protection'
description: Learn how to set up a route server and protect it with Azure DDoS protection using the Azure portal.
author: duongau
ms.author: duau
ms.service: azure-route-server
ms.topic: tutorial
ms.date: 02/10/2025
ms.custom: sfi-image-nochange

#CustomerIntent: As an Azure administrator, I want to deploy Azure Route Server in my environment with DDoS protection so that the Route Server dynamically updates virtual machines (VMs) routing tables with any changes in the topology while it's protected by Azure DDoS protection.
---

# Tutorial: Protect your Azure Route Server with Azure DDoS protection

This tutorial shows you how to create an Azure Route Server with DDoS protection enabled. Azure DDoS protection safeguards your publicly accessible Route Server from Distributed Denial of Service attacks, ensuring continuous operation of your network routing infrastructure.

By the end of this tutorial, you have a fully functional Route Server deployment protected by Azure DDoS protection, ready for border gateway protocol (BGP) peering with your network virtual appliances.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Network Protection SKU. Overage charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection pricing](https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md)

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DDoS protection plan
> * Create an Azure Route server
> * Enable the DDoS protection and plan
> * Configure the Route Server

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/pricing/purchase-options/azure-account?cid=msft_learn).

## Create DDoS protection plan

In this section, you create an Azure DDoS protection plan that you associate with the virtual network later in this tutorial.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **DDoS protection**. Select **DDoS protection plans** from the search results.

3. Select **+ Create**.

4. On the **Basics** tab of **Create a DDoS protection plan**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**.</br> Enter **myResourceGroup**.</br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select **East US**. |

5. Select **Review + create**.

6. Select **Create**.

## Create a Route Server

In this section, you create an Azure Route Server along with its virtual network and public IP address. The deployment process creates all necessary networking components.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** from the search results.

2. Select **+ Create**.

3. On the **Basics** tab of **Create a Route Server**, enter, or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **myResourceGroup**. |
    | **Instance details** |   |
    | Name | Enter **myRouteServer**. |
    | Region | Select **East US**. |
    | **Configure virtual networks** |   |
    | Virtual network | Select **Create new**.</br> In **Name**, enter **myVNet**.</br> Leave the prepopulated **Address space** and **Subnets**. In the example for this article, the address space is **10.1.0.0/16** with a subnet of **10.1.0.0/24**.</br> In **Subnets**, for **Subnet name**, enter **RouteServerSubnet**.</br> In **Address range**, enter **10.1.1.0/27**.</br> Select **OK**.  |
    | Subnet | Select **RouteServerSubnet (10.1.1.0/27)**. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**. |
    | Public IP address name | Enter **myPublicIP**. |

4. Select **Review + create**. 

5. Select **Create**.

    [!INCLUDE [Deployment note](../../includes/route-server-note-creation-time.md)]

## Enable DDoS protection

Azure DDoS Network Protection is enabled at the virtual network level where the resource you want to protect resides. In this section, you enable DDoS protection for the virtual network hosting your Route Server.

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** from the search results.

2. Select **myVNet**.

3. Select **DDoS protection** under **Settings**.

4. Select **Enable**.

5. In the **DDoS protection plan** dropdown, select **myDDoSProtectionPlan**.

6. Select **Save**.

    > [!NOTE]
    > After you enable DDoS protection, it can take a few minutes for the protection to become fully active.

## Set up peering with NVA

In this section, you configure BGP peering between your Route Server and network virtual appliance (NVA). This step establishes the routing relationship that allows dynamic route exchange.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** from the search results.

2. Select **myRouteServer**.

3. Under **Settings**, select **Peers**.

4. Select **+ Add**. 

5. Enter or select the following information in **Add Peer**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a descriptive name for the peering between your Route Server and the NVA. |
    | ASN | Enter the Autonomous System Number (ASN) of your NVA. |
    | IPv4 Address | Enter the IP address of the NVA that you want to peer with the Route Server. |

6. Select **Add**.

    > [!NOTE]
    > Ensure that your NVA is configured with a different ASN than the Route Server (65515) and supports multi-hop eBGP.

## Complete the configuration on the NVA

To establish a BGP session with your Route Server, you need the Azure Route Server's peer IPs and ASN. This information is required to complete the configuration on your network virtual appliance.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** from the search results.

2. Select **myRouteServer**.

3. On the **Overview** page of **myRouteServer**, note the **ASN** and **Peer IPs** values.

    :::image type="content" source="./media/route-server-overview.png" alt-text="Screenshot of Route Server overview page showing ASN and Peer IP information.":::

4. Use these values to configure BGP peering on your NVA:
   - Configure two BGP sessions (one for each peer IP)
   - Use the Route Server's ASN as the remote ASN
   - Ensure your NVA's ASN is different from 65515

    > [!TIP]
    > For optimal redundancy, establish BGP sessions with both peer IPs provided by the Route Server.

## Clean up resources

If you're not going to continue using these resources, delete the resource group to remove the virtual network, DDoS protection plan, Route Server, and all associated resources to avoid ongoing charges.

1. In the search box at the top of the portal, enter **myResourceGroup**. Select **myResourceGroup** from the search results.

2. Select **Delete resource group**.

3. In **Delete a resource group**, enter **myResourceGroup**, and then select **Delete**.

4. Select **Delete** to confirm the deletion of the resource group and all its resources.

    > [!WARNING]
    > This action permanently deletes all resources in the resource group. Make sure you no longer need these resources before proceeding.

## Next step

Now that you have a DDoS-protected Route Server deployment, learn how to configure and manage it effectively:

> [!div class="nextstepaction"]
> [Configure and manage Azure Route Server](configure-route-server.md)
