---
title: 'Configure Azure ExpressRoute Direct using the Azure portal'
description: This article helps you configure ExpressRoute Direct using the Azure portal.
services: expressroute
author: duongau
ms.service: azure-expressroute
ms.topic: how-to
ms.date: 01/31/2025
ms.author: duau

---

# Create Azure ExpressRoute Direct using the Azure portal
This article shows you how to create ExpressRoute Direct using the Azure portal. ExpressRoute Direct allows you to connect directly to Microsoft's global network at strategically distributed peering locations worldwide. For more information, see [About ExpressRoute Direct](expressroute-erdirect-about.md).

## Before you begin

Before using ExpressRoute Direct, you must enroll your subscription. To enroll, register the **Allow ExpressRoute Direct** feature to your subscription:

1. Sign in to the Azure portal and select the subscription you wish to enroll.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/subscription.png" alt-text="Screenshot of the subscriptions list in the portal.":::

2. Select **Preview features** under *Settings* in the left side menu. Enter **ExpressRoute** into the search box.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/preview-features.png" alt-text="Screenshot of the preview features setting for a subscription.":::

3. Select the checkbox next to **Allow ExpressRoute Direct**, then select the **+ Register** button at the top of the page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/register-expressroute-direct.png" alt-text="Screenshot of registering allow ExpressRoute Direct feature.":::

4. Confirm *Allow ExpressRoute Direct* shows **Registered** under the *State* column.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/registered.png" alt-text="Screenshot of allow ExpressRoute Direct feature registered.":::

## Create ExpressRoute Direct

1. In the [Azure portal](https://portal.azure.com), select **+ Create a resource**.

2. On the **Create a resource** page, enter **ExpressRoute Direct** into the *Search services and marketplace* box.

3. From the results, select **ExpressRoute Direct**.

4. On the **ExpressRoute Direct** page, select **Create** to open the **Create ExpressRoute Direct** page.

5. Complete the fields on the **Basics** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/basics.png" alt-text="Screenshot of the basics page for create ExpressRoute Direct.":::

    - **Subscription**: The Azure subscription you want to use to create a new ExpressRoute Direct. The ExpressRoute Direct resource and ExpressRoute circuits created in a later step must be in the same subscription.
    - **Resource group**: The Azure resource group in which the new ExpressRoute Direct resource is created. If you don't have an existing resource group, you can create a new one.
    - **Region**: The Azure public region where the resource is created.
    - **ExpressRoute Direct name**: The name of the new ExpressRoute Direct resource.

6. Complete the fields on the **Configuration** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/configuration.png" alt-text="Screenshot that shows the 'Create ExpressRoute Direct' page with the 'Configuration' tab selected.":::

    - **Peering Location**: The peering location where you connect to the ExpressRoute Direct resource. For more information about peering locations, review [ExpressRoute Locations](expressroute-locations-providers.md).
    - **Bandwidth**: The port pair bandwidth that you want to reserve. ExpressRoute Direct supports both 10 Gb and 100-Gb bandwidth options. If your desired bandwidth isn't available at the specified peering location, [open a Support Request in the Azure portal](https://aka.ms/azsupt).
    - **Encapsulation**: ExpressRoute Direct supports both QinQ and Dot1Q encapsulation.
        - If QinQ is selected, each ExpressRoute circuit is dynamically assigned an S-Tag and is unique throughout the ExpressRoute Direct resource.
        - Each C-Tag on the circuit must be unique on the circuit, but not across the ExpressRoute Direct.
        - If Dot1Q encapsulation is selected, you must manage the uniqueness of the C-Tag (VLAN) across the entire ExpressRoute Direct resource.

    > [!IMPORTANT]
    > ExpressRoute Direct can only be one encapsulation type. Encapsulation can't be changed after ExpressRoute Direct creation.

7. Specify any resource tags, then select **Review + create** to validate the ExpressRoute Direct resource settings.

8. Select **Create** once validation passes. You see a message letting you know that your deployment is underway. A status displays on this page when your ExpressRoute Direct resource is created.

## Generate the letter of authorization (LOA)

1. Go to the overview page of the ExpressRoute Direct resource and select **Generate Letter of Authorization**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/overview.png" alt-text="Screenshot of generate letter of authorization button on overview page.":::

2. Enter your company name and select **Download** to generate the letter.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/letter-of-authorization-page.png" alt-text="Screenshot of letter of authorization page.":::

## Change Admin State of links

This process should be used to conduct a Layer 1 test, ensuring that each cross-connection is properly patched into each router for primary and secondary.

1. From the ExpressRoute Direct resource, select **Links** under *Settings* in the left side menu. Toggle the **Admin State** to **Enabled** and select **Save** for *Link 1*.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/link-1.png" alt-text="Screenshot of admin state enabled for Link 1.":::

2. Select the **Link 2** tab. Toggle the **Admin State** to **Enabled** and select **Save** for *Link 2*.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/link-2.png" alt-text="Screenshot of admin state enabled for Link 2.":::

    > [!IMPORTANT]
    > Billing begins when admin state is enabled on either link.

## Create a circuit

By default, you can create 10 circuits in the subscription where the ExpressRoute Direct resource is. You can increase this number by contacting support. You're responsible for tracking both Provisioned and Utilized Bandwidth. Provisioned bandwidth is the sum of bandwidth of all circuits on the ExpressRoute Direct resource. Utilized bandwidth is the physical usage of the underlying physical interfaces.

- There are more circuit bandwidths that can be utilized on ExpressRoute Direct only to support the scenarios outlined. These bandwidths are: 40 Gbps and 100 Gbps.
- `SkuTier` can be Local, Standard, or Premium.
- `SkuFamily` must be MeteredData only. Unlimited isn't supported on ExpressRoute Direct.

The following steps help you create an ExpressRoute circuit from the ExpressRoute Direct workflow. If you prefer, you can also create a circuit using the regular circuit workflow, although there's no advantage in using the regular circuit workflow steps for this configuration. For more information, see [Create and modify an ExpressRoute circuit](expressroute-howto-circuit-portal-resource-manager.md).

1. From the ExpressRoute Direct resource, select **Circuits** under *Settings* in the left side menu, and then select **+ Add**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/add.png" alt-text="Screenshot of add a circuit button to an ExpressRoute Direct resource.":::

2. Complete the fields on the **Basics** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/circuit.png" alt-text="Screenshot of the basics page of the created ExpressRoute circuit.":::

    - **Subscription**: The Azure subscription you want to use to create a new ExpressRoute circuit. The ExpressRoute circuit has to be in the same subscription as the ExpressRoute Direct resource.
    - **Resource group**: The Azure resource group in which the new ExpressRoute circuit resource is created. If you don't have an existing resource group, you can create a new one.
    - **Region**: The Azure public region where the resource is created. The region must be the same as the ExpressRoute Direct resource.
    - **Name**: The name of the new ExpressRoute circuit resource.

3. Complete the fields on the **Configuration** page.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/configuration2.png" alt-text="Screenshot of the configuration page of an ExpressRoute Direct resource.":::

    - **Port type**: Select **Direct** as the port type to create a circuit with ExpressRoute Direct.
    - **ExpressRoute Direct resource**: Select the ExpressRoute Direct resource you created in the previous section.
    - **Circuit bandwidth**: Select the bandwidth for the circuit. Ensure to keep track of the bandwidth utilization for the ExpressRoute Direct port.
    - **SKU**: Select the SKU type for the ExpressRoute circuit that best suits your environment.
    - **Billing model**: Only **Metered** billing model circuits are supported with ExpressRoute Direct at creation.

    > [!NOTE]
    > You can change from **Metered** to **Unlimited** after the creation of the circuit. This change is irreversible once completed. To change the billing model, go to the **configuration** page of the ExpressRoute Direct circuit.

4. Specify any resource tags, then select **Review + Create** to validate the settings before creating the resource.

5. Select **Create** once validation passes. You see a message letting you know that your deployment is underway. A status displays on this page when your ExpressRoute circuit resource is created.

### Enable ExpressRoute Direct and circuits in a different subscription

1. Go to the ExpressRoute Direct resource and select **Authorizations** under *Settings* in the left side menu. Enter a name for a new authorization and select **Save**.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/authorization.png" alt-text="Screenshot of authorizations page.":::

2. Create a new ExpressRoute circuit in a different subscription or Microsoft Entra tenant.

3. Select **Direct** as the port type and check the box for **Redeem authorization**. Enter the resource URI of the ExpressRoute Direct resource and enter the authorization key generated in step 2.

    :::image type="content" source="./media/how-to-expressroute-direct-portal/redeem-authorization.png" alt-text="Screenshot of redeeming authorization when creating a new ExpressRoute circuit.":::

4. Select **Review + Create** to validate the settings before creating the resource. Then select **Create** to deploy the new ExpressRoute circuit.

## Next steps

After you create the ExpressRoute circuit, you can [link virtual networks to your ExpressRoute circuit](expressroute-howto-add-gateway-portal-resource-manager.md).
