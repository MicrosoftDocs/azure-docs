---
title: Configure performance traffic routing method using Azure Traffic Manager | Microsoft Docs
description: This article explains how to configure Traffic Manager to route traffic to the endpoint with lowest latency 
services: traffic-manager
manager: twooley
author: greg-lindsay
ms.service: traffic-manager
ms.topic: how-to
ms.workload: infrastructure-services
ms.date: 05/30/2023
ms.author: greglin
ms.custom: template-how-to
---

# Configure the performance traffic routing method

The Performance traffic routing method allows you to direct traffic to the endpoint with the lowest latency from the client's network. Typically, the region with the lowest latency is the closest in geographic distance. This traffic routing method can't account for real-time changes in network configuration or load.

## Prerequisites

* If you don't have an Azure subscription, create a [free account](https://azure.microsoft.com/free/?WT.mc_id=A261C142F) before you begin.

## Create a resource group
Create a resource group for the Traffic Manager profile.
1. Sign in to the [Azure portal](https://portal.azure.com).
1. On the left pane of the Azure portal, select **Resource groups**.
1. In **Resource groups**, on the top of the page, select **Add**.
1. In **Resource group name**, type a name *myResourceGroupTM1*. For **Resource group location**, select **East US**, and then select **OK**.

## Create a Traffic Manager profile with performance routing method

Create a Traffic Manager profile that directs user traffic by sending them to the endpoint with lowest latency from the client's network.

1. On the top left-hand side of the screen, select **Create a resource** > **Networking** > **Traffic Manager profile** > **Create**.
1. In **Create Traffic Manager profile**, enter or select, the following information, accept the defaults for the remaining settings, and then select **Create**:
    
	| Setting                 | Value                                              |
    | ---                     | ---                                                |
    | Name                   | Enter a unique name for your Traffic Manager profile.                      |
    | Routing method          | Select the **Performance** routing method.                                       |
    | Subscription            | Select your subscription.                          |
    | Resource group          | Select **myResourceGroupTM1**. |
    | Location                | This setting refers to the location of the resource group, and has no impact on the Traffic Manager profile that will be deployed globally.                              |



    :::image type="content" source="media/traffic-manager-performance-routing-method/create-traffic-manager-performance-routing-method.png" alt-text="Screenshot of creating a traffic manager profile with performance routing.":::

##  To configure performance routing method on an existing Traffic Manager profile

1. Sign in to the [Azure portal](https://portal.azure.com).
1. In the portal’s search bar, search for the **Traffic Manager profiles** and then select the profile name that you want to configure the routing method for.
1. In the **Traffic Manager profile** overview page, verify that both the cloud services and websites that you want to include in your configuration are present.
1. In the **Settings** section, select **Configuration**, and in the **Configuration** blade, complete as follows:

    | Setting                 | Value        | 
    | ---                     | ---          |
    |**Routing method**       | Performance  |
    | **DNS time to live (TTL)**  |This value controls how often the client’s local caching name server will query the Traffic Manager system for updated DNS entries. In this example we chose the default **60 seconds**.  |
    | **Endpoint monitor settings** |  |
    | **Protocol** | In this example we chose the default **HTTP**. |
    |**Port** | In this example we chose the default port **80**. |
    | **Path** | For **Path** type a forward slash */*. To monitor endpoints, you must specify a path and filename. A forward slash "/" is a valid entry for the relative path and implies that the file is in the root directory (default). |

1. At the top of the page, select **Save**.

   :::image type="content" source="media/traffic-manager-performance-routing-method/traffic-manager-performance-routing-method.png" alt-text="Screenshot of configuring a traffic manager profile with performance routing.":::
## Test the performance routing method

Test the changes in your configuration as follows:

1.	In the portal’s search bar, search for the Traffic Manager profile name and select the Traffic Manager profile in the results that the displayed.
1.	The **Traffic Manager profile** overview displays the DNS name of your newly created Traffic Manager profile. This can be used by any clients (for example, by navigating to it using a web browser) to get routed to the right endpoint as determined by the routing type. In this case all requests are routed to the endpoint with the lowest latency from the client's network.
1. Once your Traffic Manager profile is working, edit the DNS record on your authoritative DNS server to point your company domain name to the Traffic Manager domain name.


## Next steps

- Learn about [weighted traffic routing method](traffic-manager-configure-weighted-routing-method.md).
- Learn about [priority routing method](traffic-manager-configure-priority-routing-method.md).
- Learn about [geographic routing method](traffic-manager-configure-geographic-routing-method.md).
- Learn how to [test Traffic Manager settings](traffic-manager-testing-settings.md).
