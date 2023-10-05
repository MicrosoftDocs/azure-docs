---
title: 'Tutorial: Protect your Route Server with Azure DDoS protection'
description: Learn how to set up a route server and protect it with Azure DDoS protection.
author: halkazwini
ms.author: halkazwini
ms.service: route-server
ms.topic: tutorial
ms.date: 12/21/2022
ms.custom: template-tutorial
---

# Tutorial: Protect your Route Server with Azure DDoS protection

This article helps you create an Azure Route Server with a DDoS protected virtual network. Azure DDoS protection protects your publicly accessible route server from Distributed Denial of Service attacks.

> [!IMPORTANT]
> Azure DDoS Protection incurs a cost when you use the Standard SKU. Overages charges only apply if more than 100 public IPs are protected in the tenant. Ensure you delete the resources in this tutorial if you aren't using the resources in the future. For information about pricing, see [Azure DDoS Protection Pricing]( https://azure.microsoft.com/pricing/details/ddos-protection/). For more information about Azure DDoS protection, see [What is Azure DDoS Protection?](../ddos-protection/ddos-protection-overview.md).

In this tutorial, you learn how to:

> [!div class="checklist"]
> * Create a DDoS protection plan
> * Create an Azure Route server
> * Enable the DDoS protection and plan
> * Configure the Route Server

## Prerequisites

- An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

## Create DDoS protection plan

In this section, you'll create an Azure DDoS protection plan to associate with the virtual network you create later in the article.

1. Sign in to the [Azure portal](https://portal.azure.com).

2. In the search box at the top of the portal, enter **DDoS protection**. Select **DDoS protection plans** in the search results.

3. Select **+ Create**.

4. In the **Basics** tab of **Create a DDoS protection plan**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |   |
    | Subscription | Select your subscription. |
    | Resource group | Select **Create new**. </br> Enter **TutorRouteServer-rg**. </br> Select **OK**. |
    | **Instance details** |   |
    | Name | Enter **myDDoSProtectionPlan**. |
    | Region | Select **West Central US**. |

5. Select **Review + create**.

6. Select **Create**.

## Create a Route Server

In this section, you'll create an Azure Route Server. The virtual network and public IP address used for the route server are created during the deployment of the route server.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** in the search results.

2. Select **+ Create**.

3. In the **Basics** tab of **Create a Route Server**, enter or select the following information:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Select your subscription. |
    | Resource group | Select **TutorRouteServer-rg**. |
    | **Instance details** |   |
    | Name | Enter **myRouteServer**. |
    | Region | Select **West Central US**. |
    | **Configure virtual networks** |   |
    | Virtual network | Select **Create new**. </br> In **Name**, enter **myVNet**. </br> Leave the pre-populated **Address space** and **Subnets**. In the example for this article, the address space is **10.1.0.0/16** with a subnet of **10.1.0.0/24**. </br> In **Subnets**, for **Subnet name**, enter **RouteServerSubnet**. </br> In **Address range**, enter **10.1.1.0/27**. </br> Select **OK**.  |
    | Subnet | Select **RouteServerSubnet (10.1.1.0/27)**. |
    | **Public IP address** |  |
    | Public IP address | Select **Create new**. |
    | Public IP address name | Enter **myPublicIP**. |

    :::image type="content" source="./media/tutorial-protect-route-server/create-virtual-network.png" alt-text="Screenshot of create virtual network and subnets.":::

4. Select **Review + create**. 

5. Select **Create**.

    > [!NOTE]
    > The deployment of the Route Server will take about 20 minutes.

## Enable DDoS protection

Azure DDoS Network is enabled at the virtual network where the resource you want to protect reside. 

1. In the search box at the top of the portal, enter **Virtual network**. Select **Virtual networks** in the search results.

2. Select **myVNet**.

3. Select **DDoS protection** in **Settings**.

4. Select **Enable**.

5. In the pull-down box in DDoS protection plan, select **myDDoSProtectionPlan**.

6. Select **Save**.

## Set up peering with NVA

In this section, you'll set up the BGP peering with your NVA.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** in the search results.

2. Select **myRouteServer**.

3. In **Settings**, select **Peers**.

4. Select **+ Add**. 

5. Enter or select the following information in **Add Peer**:

    | Setting | Value |
    | ------- | ----- |
    | Name | Enter a name for the peering between your Route Server and the NVA. |
    | ASN | Enter the Autonomous Systems Number (ASN) of your NVA. |
    | IPv4 Address | Enter the IP address of the NVA the Route Server will communicate with to establish BGP. |

6. Select **Add**.

## Complete the configuration on the NVA

You'll need the Azure Route Server's peer IPs and ASN to complete the configuration on your NVA to establish a BGP session. You can obtain this information from the overview page your Route Server.

1. In the search box at the top of the portal, enter **Route Server**. Select **Route Servers** in the search results.

2. Select **myRouteServer**.

3. In the **Overview** page of **myRouteServer**, make note of the **ASN** and **Peer IPs**.

    :::image type="content" source="./media/quickstart-configure-route-server-portal/route-server-overview.png" alt-text="Screenshot of Route Server overview page.":::

## Clean up resources

If you're not going to continue to use this application, delete the virtual network, DDoS protection plan, and Route Server with the following steps:

1. In the search box at the top of the portal, enter **Resource group**. Select **Resource groups** in the search results.

2. Select **TutorRouteServer-rg**.

3. In the **Overview** of **TutorRouteServer-rg**, select **Delete resource group**.

4. In **TYPE THE RESOURCE GROUP NAME:**, enter **TutorRouteServer-rg**.

5. Select **Delete**.

## Next steps

Advance to the next article to learn how to:
> [!div class="nextstepaction"]
> [Configure peering between Azure Route Server and network virtual appliance](tutorial-configure-route-server-with-quagga.md)