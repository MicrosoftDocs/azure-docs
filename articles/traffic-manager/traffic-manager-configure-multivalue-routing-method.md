---
title: Configure MultiValue traffic routing - Azure Traffic Manager
description: This article explains how to configure Traffic Manager to route traffic to A/AAAA endpoints. 
services: traffic-manager
author: greg-lindsay
ms.service: traffic-manager
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/07/2023
ms.author: greglin
ms.custom: template-how-to
---

# Configure MultiValue routing method in Traffic Manager

This article describes how to configure the MultiValue traffic-routing method. The **MultiValue** traffic routing method allows you to return multiple healthy endpoints and helps increase the reliability of your application since clients have more options to retry without having to do another DNS lookup. MultiValue routing is enabled only for profiles that have all their endpoints specified using IPv4 or IPv6 addresses. 
When a query is received for this profile, all healthy endpoints are returned based on the configurable maximum return count specified. 

>[!NOTE]
> At this time adding endpoints using IPv4 or IPv6 addresses is supported only for endpoints of type **External** and hence MultiValue routing is also supported only for such endpoints.

## Prerequisites

- If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) now.
- For this guide you will need to create Public IP Addresses. To learn how, see [Create a public IP address](../virtual-network/ip-services/public-ip-addresses.md).

## Create a resource group
Create a resource group for the Traffic Manager profile.
1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left pane of the Azure portal, select **Resource groups**.
1. In **Resource groups**, on the top of the page, select **Add**.
1. In **Resource group name**, type a name *myResourceGroupTM1*. For **Resource group location**, select **East US**, and then select **OK**.

## Create a Traffic Manager profile
Create a Traffic Manager profile that directs user traffic by sending them to the endpoint with lowest latency.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
1. In **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings, and then select **Create**:
    
	| Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | Enter a unique name for your Traffic Manager profile.                                   |
    | Routing method          | Select the **MultiValue** routing method.                                       |
    | Subscription            | Select your subscription.                          |
    | Resource group          | Select *myResourceGroupTM1*. |
    | Location                | This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.                              |
   |        |           | 
  
    :::image type="content" source="./media/traffic-manager-multivalue-routing-method/create-traffic-manager-profile.png" alt-text="Screenshot of creating a Traffic Manager profile.":::

## Add Traffic Manager endpoints

Add two IP addresses as external endpoints to the MultiValue Traffic Manager profile that you created in the preceding step.

1. In the portal's search bar, enter the Traffic Manager profile name that you created in the preceding section.
1. Select the profile from the search results.
1. In **Traffic Manager profile**, in the **Settings** section, select **Endpoints**, and then select **Add**.

    :::image type="content" source="./media/traffic-manager-multivalue-routing-method/traffic-manager-endpoint-menu.png" alt-text="Screenshot of endpoint settings in Traffic Manager profile.":::

1. Enter these settings, then select **Add**.

    | Setting | Value |
    | ------- | ------|
    | Type | Select **Azure endpoint**. |
    | Name | Enter *myEndpoint1*. |
    | Target resource type | Select **Public IP Address**. |
    | Target resource | Select **Public IP address** > your public IP Address. |

    :::image type="content" source="./media/traffic-manager-multivalue-routing-method/add-traffic-manager-endpoint.png" alt-text="Screenshot of where you add an endpoint to your Traffic Manager profile.":::
    

1. Repeat steps 2 and 3 to add another endpoint named **myEndpoint2**. For *Target resource*, enter the public IP address of the second endpoint.


> [!NOTE]
> When you're done adding the two endpoints, they're displayed in **Traffic Manager profile**. Notice that their monitoring status is **Online** now.

## Next steps

- Learn about [weighted traffic routing method](traffic-manager-configure-weighted-routing-method.md).
- Learn about [priority routing method](traffic-manager-configure-priority-routing-method.md).
- Learn more about [performance routing method](traffic-manager-configure-performance-routing-method.md)
- Learn about [geographic routing method](traffic-manager-configure-geographic-routing-method.md).
