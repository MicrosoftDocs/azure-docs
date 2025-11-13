---
title: 'Azure ExpressRoute: Configure a Scalable Gateway using Azure portal'
description: Learn how to configure a scalable ExpressRoute gateway in Azure using the Azure portal and PowerShell. This guide provides step-by-step instructions to help you set up and manage a scalable gateway for your ExpressRoute connection.
author: mekaylamoore
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 08/19/2025
ms.author: duau
---
# Configure a scalable ExpressRoute gateway using Azure portal and PowerShell

This article walks you through configuring a scalable ExpressRoute gateway in Azure using both the Azure portal and PowerShell. A scalable gateway lets you adjust bandwidth and performance for your ExpressRoute connection as your workload needs change.
## Prerequisites

### Subnet requirement
The scalable gateway must be deployed in a subnet that is /26 or larger. This ensures enough IP address space for gateway scaling and high availability.

### Regional availability
Before deployment, review the About Scalable Gateway (link) to confirm region support. Some regions may not currently support scalable gateway functionality.

## Create the virtual network gateway

1. In the Azure portal, select **Create a resource** from the left menu. Search for "Virtual Network Gateway" and select it from the results. On the **Virtual network gateway** page, choose **Create**.

2. On the **Create virtual network gateway** page, provide the following settings:

    | Setting | Value |
    | ------- | ----- |
    | **Project details** |  |
    | Subscription | Ensure the correct subscription is selected. |
    | Resource Group | The resource group is automatically selected after you choose the virtual network. |
    | **Instance details** |  |
    | Name | Enter a name for your gateway resource. This isn't the same as the gateway subnet name. |
    | Region | Select the region where your virtual network is located. If the region doesn't match your virtual network, it will not appear in the **Virtual network** dropdown.<br>If you want to deploy in an [Azure Extended Zone](../extended-zones/overview.md), select **Deploy to an Azure Extended Zone**. |
    | Gateway type | Choose **ExpressRoute**. |
    | SKU | Select **ErGwScale** from the dropdown. For details, see [ExpressRoute gateway SKUs](expressroute-about-virtual-network-gateways.md#gwsku). |
    | Minimum Scale Units | Enter the minimum number of scale units. For more information, see [ExpressRoute Gateway Scale Units](scalable-gateway.md). |
    | Maximum Scale Units | Enter the maximum number of scale units. For more information, see [ExpressRoute Gateway Scale Units](scalable-gateway.md). |
    | Virtual network | Select *vnet-1*. |
    | **Public IP address** |  |
    | Assignment | By default, ExpressRoute gateways use an [Auto-Assigned Public IP](expressroute-about-virtual-network-gateways.md#auto-assigned-public-ip). |

    > [!IMPORTANT]
    > The ErGwScale SKU does not support IPsec over ExpressRoute or workloads that rely on UDP flow count at this time.

3. Select **Review + Create**, then **Create** to start the deployment. Validation occurs, and the gateway creation process may take up to 45 minutes.

:::image type="content" source="media/expressroute-howto-scalablegw/create-scale.png" alt-text="Screenshot of the create page in Azure portal with Scalable Gateway." :::

## Change the scale units

1. In the Azure portal, go to your ExpressRoute virtual network gateway.
2. Under **Settings**, select **Configuration**.
3. In the **Configuration** pane, adjust the **Minimum Scale Units** and/or **Maximum Scale Units** as needed.

:::image type="content" source="media/expressroute-howto-scalablegw/change-scale.png" alt-text="Screenshot of the configuration blade to change the scale units of your gateway." lightbox="./media/expressroute-howto-scalablegw/zoom-scale.png":::

> [!NOTE]
> To migrate your existing ExpressRoute gateway to a scalable gateway, follow the steps in the [ExpressRoute gateway migration guide](expressroute-howto-gateway-migration-portal.md).

