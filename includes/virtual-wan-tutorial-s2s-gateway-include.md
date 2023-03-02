---
ms.author: cherylmc
author: cherylmc
ms.date: 04/12/2022
ms.service: virtual-wan
ms.topic: include
---

1. On the **Create virtual hub** page, click **Site to site** to open the **Site to site** tab.

   :::image type="content" source="./media/virtual-wan-tutorial-hub-include/hub-site-to-site.png" alt-text="Screenshot shows the Create virtual hub pane with Site to site selected.":::

1. On the **Site to site** tab, complete the following fields:

   * Select **Yes** to create a Site-to-site VPN.
   * **AS Number**: The AS Number field can't be edited.
   * **Gateway scale units**: Select the **Gateway scale units** value from the dropdown. The scale unit lets you pick the aggregate throughput of the VPN gateway being created in the virtual hub to connect sites to.

     If you pick 1 scale unit = 500 Mbps, it implies that two instances for redundancy will be created, each having a maximum throughput of 500 Mbps. For example, if you had five branches, each doing 10 Mbps at the branch, you'll need an aggregate of 50 Mbps at the head end. Planning for aggregate capacity of the Azure VPN gateway should be done after assessing the capacity needed to support the number of branches to the hub.
   * **Routing preference**: Azure routing preference lets you choose how your traffic routes between Azure and the internet. You can choose to route traffic either via the Microsoft network, or via the ISP network (public internet). These options are also referred to as cold potato routing and hot potato routing, respectively. 

     The public IP address in Virtual WAN is assigned by the service, based on the routing option selected. For more information about routing preference via Microsoft network or ISP, see the [Routing preference](../articles/virtual-network/ip-services/routing-preference-overview.md) article.
1. Select **Review + Create** to validate.
1. Select **Create** to create the hub and gateway. This can take up to 30 minutes. After 30 minutes, **Refresh** to view the hub on the **Hubs** page. Select **Go to resource** to navigate to the resource.