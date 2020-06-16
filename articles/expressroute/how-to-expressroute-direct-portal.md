---
title: 'Azure ExpressRoute: Configure ExpressRoute Direct: portal'
description: This page helps you configure ExpressRoute Direct using the portal.
services: expressroute
author: cherylmc

ms.service: expressroute
ms.topic: how-to
ms.date: 06/12/2020
ms.author: cherylmc

---

# Create ExpressRoute Direct using the Azure portal

This article shows you how to create ExpressRoute Direct using the Azure portal.
ExpressRoute Direct lets you connect directly into Microsoft’s global network at peering locations strategically distributed across the world. For more information, see [About ExpressRoute Direct](expressroute-erdirect-about.md).

## <a name="create-erdir"></a>1. Create ExpressRoute Direct

1. In the [Azure portal](https://portal.azure.com) menu, or from the **Home** page, select **Create a resource**.

1. On the **New** page, in the ***Search the Marketplace*** field, type **ExpressRoute Direct**, then select **Enter** to get to the search results.

1. From the results, select **ExpressRoute Direct**.

1. On the **ExpressRoute Direct** page, select **Create** to open the **Create ExpressRoute Direct** page.

1. Start by completing the fields on the **Basics** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/basics.png" alt-text="Basics page":::

    * **Subscription**: The Azure subscription you want to use to create a new ExpressRoute Direct. The ExpressRoute Direct resource and ExpressRoute circuits must be in the same subscription.
    * **Resource Group**: The Azure resource group in which the new ExpressRoute Direct resource will be created in. If you don't have an existing resource group, you can create a new one.
    * **Region**: The Azure public region that the resource will be created in.
    * **Name**: The name of the new ExpressRoute Direct resource.

1. Next, complete the fields on the **Configuration** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/configuration.png" alt-text="Configuration page":::

    * **Peering Location**: The peering location where you will connect to the ExpressRoute Direct resource. For more information about peering locations, review [ExpressRoute Locations](expressroute-locations-providers.md).
   * **Bandwidth**: The port pair bandwidth that you want to reserve. ExpressRoute Direct supports both 10 Gb and 100 Gb bandwidth options. If your desired bandwidth is not available at the specified peering location, [open a Support Request in the Azure portal](https://aka.ms/azsupt).
   * **Encapsulation**: ExpressRoute Direct supports both QinQ and Dot1Q encapsulation.
     * If QinQ is selected, each ExpressRoute circuit will be dynamically assigned an S-Tag and will be unique throughout the ExpressRoute Direct resource.
     *  Each C-Tag on the circuit must be unique on the circuit, but not across the ExpressRoute Direct.
     * If Dot1Q encapsulation is selected, you must manage uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.
     >[!IMPORTANT]
     >ExpressRoute Direct can only be one encapsulation type. Encapsulation cannot be changed after ExpressRoute Direct creation.
     >

1. Specify any resource tags, then select **Review + create** to validate the ExpressRoute Direct resource settings.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/validate.png" alt-text="Review and create":::

1. Select **Create**. You will see a message letting you know that your deployment is underway. Status will display on this page as the resources are created. 

## <a name="state"></a>2. Change Admin State of links

This process should be used to conduct a Layer 1 test, ensuring that each cross-connection is properly patched into each router for primary and secondary.

1. On the ExpressRoute Direct resource **Overview** page, in the **Links** section, select **link1**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/link.png" alt-text="Link 1" lightbox="./media/how-to-expressroute-direct-portal/link-expand.png":::

1. Toggle the **Admin State** setting to **Enabled**, then select **Save**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/state.png" alt-text="Admin State":::

    >[!IMPORTANT]
    >Billing will begin when admin state is enabled on either link.
    >

1. Repeat the same process for **link2**.

## <a name="circuit"></a>3. Create a circuit

By default, you can create 10 circuits in the subscription where the ExpressRoute Direct resource is. This number can be increased by support. You are responsible for tracking both Provisioned and Utilized Bandwidth. Provisioned bandwidth is the sum of bandwidth of all circuits on the ExpressRoute Direct resource. Utilized bandwidth is the physical usage of the underlying physical interfaces.

* There are additional circuit bandwidths that can be utilized on ExpressRoute Direct only to support the scenarios outlined above. These are: 40 Gbps and 100 Gbps.

* SkuTier can be Local, Standard, or Premium.

* SkuFamily must be MeteredData only. Unlimited is not supported on ExpressRoute Direct.

The following steps help you create an ExpressRoute circuit from the ExpressRoute Direct workflow. If you would rather, you can also create a circuit using the regular circuit workflow, although there is no advantage in using the regular circuit workflow steps for this configuration. See [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md).

1. In the ExpressRoute Direct **Settings** section, select **Circuits**, and then select **+Add**. 

    :::image type="content" source="./media/how-to-expressroute-direct-portal/add.png" alt-text="Add" lightbox="./media/how-to-expressroute-direct-portal/add-expand.png":::

1. Configure the settings in the **Configuration** page.

   :::image type="content" source="./media/how-to-expressroute-direct-portal/configuration2.png" alt-text="Configuration page":::

1. Specify any resource tags, the select **Review + Create** in order to validate the values before creating the resource.

   :::image type="content" source="./media/how-to-expressroute-direct-portal/review.png" alt-text="Review and create":::

1. Select **Create**. You will see a message letting you know that your deployment is underway. Status will display on this page as the resources are created. 

## Next steps

For more information about ExpressRoute Direct, see the [Overview](expressroute-erdirect-about.md).
