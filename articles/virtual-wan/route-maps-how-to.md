---
title: 'Configure Route-maps for virtual hubs'
titleSuffix: Azure Virtual WAN
description: Learn how to configure Route-maps for Virtual WAN virtual hubs.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 05/31/2023
ms.author: cherylmc
ms.custom: references_region

---
# How to configure Route-maps (Preview)

This article helps you create or edit a route map in an Azure Virtual WAN hub using the Azure portal. For more information about Virtual WAN Route-maps, see [About Route-maps](route-maps-about.md).

[!INCLUDE [Preview text](../../includes/virtual-wan-route-maps-preview.md)]

## Prerequisites

Verify that you've met the following criteria before beginning your configuration:

You have virtual WAN with a connection (S2S, P2S, or ExpressRoute) already configured. For steps to create a VWAN with a S2S connection, see [Tutorial - Create a S2S connection with Virtual WAN](virtual-wan-site-to-site-portal.md). For steps to create a virtual WAN with a P2S User VPN connection, see [Tutorial - Create a User VPN P2S connection with Virtual WAN](virtual-wan-point-to-site-portal.md).

## Create a route map

[!INCLUDE [Route-maps email](../../includes/virtual-wan-route-maps-preview-email.md)]

The following steps walk you through how to configure a route map.

1. In the Azure portal, go to your Virtual WAN resource. Select **Hubs** to view the list of hubs.

   :::image type="content" source="./media/route-maps-how-to/hub.png" alt-text="Screenshot shows selecting the hub you want to configure." lightbox="./media/route-maps-how-to/hub.png":::

1. Select the hub that you want to configure to open the **Virtual Hub** page.
1. On the Virtual Hub page, in the Routing section, select **Route-maps** to open the Route-maps page. On the Route-maps page, select **+ Add Route-map** to create a new route map.

   :::image type="content" source="./media/route-maps-how-to/route-maps.png" alt-text="Screenshot shows Add Route-map selected." lightbox="./media/route-maps-how-to/route-maps.png":::

1. On the **Create Route-map** page, provide a Name for the route map.
1. Then, select **+ Add Route-map** to create rules in the route map.

   :::image type="content" source="./media/route-maps-how-to/add.png" alt-text="Screenshot shows add route-map." lightbox="./media/route-maps-how-to/add.png":::

1. On the **Create Route-map rule** page, complete the necessary configuration.

   * Name – Provide a name for the route map rule.
   * Next step – Choose "Continue" if routes matching this rule must be processed by subsequent rules in the route map. Else choose "Terminate".
   * Match conditions – Each Match Condition requires a Property, Criterion and Value. There can be 0 or more match conditions. To add a new match condition, select the empty row in the table. To delete a row, select delete icon at the end of the row. To add multiple values under Value, use comma (,) as the delimiter. Refer to [About Route-maps](route-maps-about.md) for list of supported match conditions.
   * Actions > Action on match routes – Choose "Drop" to deny the matched routes, or "Modify" to permit and modify the matched routes.
   * Actions > Route modifications - Each Action statement requires a Property, Action and Value. There can be 0 or more route modification statements. To add a new statement, select the empty row in the table. To delete a row, select delete icon at the end of the row. To add multiple values under Value, use comma (,) as the delimiter. Refer to [About Route-maps](route-maps-about.md) for list of supported actions.

     :::image type="content" source="./media/route-maps-how-to/rule.png" alt-text="Screenshot shows Create Route-map rule page." lightbox="./media/route-maps-how-to/rule.png":::

1. Select **Add** to complete rule configuration. Clicking "Add" stores the rule temporarily on the Azure portal, but isn't saved to the route map yet. Select "Okay" on the Reminder dialog box to acknowledge that the rule isn't completely saved yet and proceed to the next-step.

1. Repeat steps 6 - 8 to add additional rules as required. On the **Create Route-map** page, after all the rules are added, ensure that the order of the rules is as desired. To adjust the order, follow the instructions in the following screenshot. Then, select **Save** to save all the rules to the route map.

   :::image type="content" source="./media/route-maps-how-to/adjust-order.png" alt-text="Screenshot shows how to adjust the order of rules." lightbox="./media/route-maps-how-to/adjust-order.png":::

1. It takes a few minutes to save the route map and the route map rules. Once saved, the **Provisioning state** shows **Succeeded**.

   :::image type="content" source="./media/route-maps-how-to/provisioning.png" alt-text="Screenshot shows Provisioning state is Succeeded." lightbox="./media/route-maps-how-to/provisioning.png":::

## Apply a route map to connections

Once the route map is saved, you may apply the route map to the desired connections in the virtual hub.

1. On the **Route-maps** page, select **Apply Route-maps to connections**.

   :::image type="content" source="./media/route-maps-how-to/apply-to-connections.png" alt-text="Screenshot shows Apply Route-maps to connections." lightbox="./media/route-maps-how-to/apply-to-connections.png":::

1. On the **Apply Route-maps to connections** page, configure the following settings. When you have finished configuring these settings, select **Save**.

   :::image type="content" source="./media/route-maps-how-to/save.png" alt-text="Screenshot shows configuring and saving settings." lightbox="./media/route-maps-how-to/save.png":::

   * Select the drop-down box under **Inbound Route-map** and select the route map you want to apply in the ingress direction.
   * Select the drop-down box under **Outbound Route-map** and select the route map you want to apply in the egress direction.
   * The table at the bottom lists all the connections to the virtual hub. Select one or more connections you want to apply the route maps to.

1. Verify the changes by opening **Apply Route-maps to connections** again from the Route-maps page.

   :::image type="content" source="./media/route-maps-how-to/verify.png" alt-text="Screenshot shows Apply Route-maps to connections page to verify changes." lightbox="./media/route-maps-how-to/verify.png":::

## Modify or remove existing route map or route map rules

1. To modify or remove an existing Route-map, go to the **Route-maps** page.

1. On the line for the route map that you want to work with, select **… > Edit** or **… > Delete**, respectively.

   :::image type="content" source="./media/route-maps-how-to/edit.png" alt-text="Screenshot shows how to modify or remove a route map or rules." lightbox="./media/route-maps-how-to/edit.png":::

## Modify or remove a route map from a connection

To modify or remove an existing Route-map rule, use the following steps.

1. On the **Route-maps page**, on the line for the route-map that you want to edit, select **… > Edit**.
1. On **Edit Route-map** page, select **… > Edit** to edit the route-map rule.

   :::image type="content" source="./media/route-maps-how-to/edit-delete.png" alt-text="Screenshot shows how to select Edit." lightbox="./media/route-maps-how-to/edit-delete.png":::

1. Modify the rule as required. On the **Edit Route-map rule** page, select **Add**, and on Reminder dialog box, select **Okay** to store the rule changes temporarily and proceed to next step.

   :::image type="content" source="./media/route-maps-how-to/add-okay.png" alt-text="Screenshot shows how to select Add and Okay." lightbox="./media/route-maps-how-to/add-okay.png":::

1. On the **Edit Route-map** page, select **Save**.

   :::image type="content" source="./media/route-maps-how-to/select-save.png" alt-text="Screenshot shows how to select Save." lightbox="./media/route-maps-how-to/select-save.png":::

## Troubleshooting

The following section describes common issues encountered when you configure Route-maps on your Virtual WAN hub.

[!INCLUDE [Route-maps troubleshooting](../../includes/virtual-wan-route-maps-troubleshoot.md)]

## Next steps

* Use the [Route-maps dashboard](route-maps-dashboard.md) to monitor routes, AS Path, and BGP communities.
* To learn more about Route-maps, see [About Route-maps](route-maps-about.md).
