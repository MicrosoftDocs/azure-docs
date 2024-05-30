---
title: 'Quickstart: Create and modify ExpressRoute circuits - Azure portal'
description: In this quickstart, you learn how to create, provision, verify, update, delete, and deprovision ExpressRoute circuits by using the Azure portal.
services: expressroute
author: duongau
ms.author: duau
ms.date: 05/14/2024
ms.topic: quickstart
ms.service: expressroute
ms.custom: mode-ui
zone_pivot_groups: expressroute-experience
---

# Quickstart: Create and modify ExpressRoute circuits

This quickstart shows you how to create an ExpressRoute circuit using the Azure portal and the Azure Resource Manager deployment model. You can also check the status, update, delete, or deprovision a circuit.

There are currently two create experience for ExpressRoute circuits in the portal. The new preview create experience is available through this [Preview link](https://aka.ms/expressrouteguidedportal). The current create experience is available through the [Azure portal](https://portal.azure.com). For guidance on how to create an ExpressRoute circuit with the preview create experience select the **Preview** tab at the top of the page. 

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using Azure portal.":::

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

## <a name="create"></a>Create and provision an ExpressRoute circuit

::: zone pivot="expressroute-preview"

### Sign in to the Azure portal

Sign in to the Azure portal with this [Preview link](https://aka.ms/expressrouteguidedportal). This link is required to access the new preview create experience for an ExpressRoute circuit.

### Create a new ExpressRoute circuit (Preview)

> [!IMPORTANT]
> Your ExpressRoute circuit is billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.

1. On the Azure portal menu, select **+ Create a resource**. Search for **ExpressRoute (preview)** and then select **Create**.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/create-expressroute-circuit-new.png" alt-text="Screenshot of preview create experience of ExpressRoute circuit resource.":::

1. Select the **Subscription** and **Resource Group** for the circuit. Then select the type of **Resiliency** for your setup.

    **Maximum Resiliency (Recommended)** - This option provides the highest level of resiliency for your ExpressRoute connectivity. It provides two ExpressRoute circuits with local redundancy in two different ExpressRoute locations.

    > [!NOTE]
    > Maximum Resiliency provides maximum protection against location wide outages and connectivity failures in an ExpressRoute location. This option is strongly recommended for all critical and production workloads.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/maximum-resiliency.png" alt-text="Diagram of maximum resiliency for an ExpressRoute connection.":::

    **Standard Resiliency** - This option provides a single ExpressRoute circuit with local redundancy at a single ExpressRoute location.
    
    > [!NOTE]
    > Standard Resiliency does not provide protection against location wide outages. This option is suitable for non-critical and non-production workloads.
    
    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/standard-resiliency.png" alt-text="Diagram of standard resiliency for an ExpressRoute connection.":::

1. Enter or select the following information for the respective resiliency type.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/new-configuration.png" alt-text="Screenshot of the new ExpressRoute circuit configuration page.":::

    **Maximum Resiliency**

    | Setting | Value |
    | ---     | ---   |
    | Use existing circuit or create new | You can augment resiliency of an existing standard circuit by selecting **Use existing circuit** and selecting an existing circuit for the first location. If you select **Use existing circuit**, you only need to configure the second circuit. If you select **Create new**, enter following information for both the new ExpressRoute circuit. |
    | Region   | Select the region closest to the peering location of the circuit. |
    | Name   | Enter a name for the ExpressRoute circuit. |
    | Port type | Select if you're connecting to a service provider or directly into Microsoft's global network at a peering location. |
    | Peering Location (Provider port type)  | Select the physical location where you're peering with Microsoft. |
    | Provider (Provider port type)| Select the internet service provider who you are requesting your service from. |
    | ExpressRoute Direct resource (Direct port type) | Select the ExpressRoute Direct resource that you want to use. |
    | Bandwidth | Select the bandwidth for the ExpressRoute circuit. |
    | SKU | Select the SKU for the ExpressRoute circuit. You can specify **Local** to get the local SKU, **Standard** to get the standard SKU or **Premium** for the premium add-on. You can change between Local, Standard, and Premium. |
    | Billing model | Select the billing type for egress data charge. You can specify **Metered** for a metered data plan and **Unlimited** for an unlimited data plan. You can change the billing type from **Metered** to **Unlimited**. |

    > [!IMPORTANT]
    > * The Peering Location indicates the [physical location](expressroute-locations.md) where you are peering with Microsoft. This is **not** linked to "Location" property, which refers to the geography where the Azure Network Resource Provider is located. While they're not related, it is a good practice to choose a Network Resource Provider geographically close to the Peering Location of the circuit.
    > * You can't change the SKU from **Standard/Premium** to **Local** in Azure portal. To downgrade the SKU to **Local**, you can use [Azure PowerShell](expressroute-howto-circuit-arm.md) or [Azure CLI](howto-circuit-cli.md).
    > * You can't change the type from **Unlimited** to **Metered**.

    Complete the same information for the second ExpressRoute circuit. When selecting an ExpressRoute location for the second circuit, you're provided with distances information from the first ExpressRoute location. This information can help you select the second ExpressRoute location.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/peering-location-distance.png" alt-text="Screenshot of distance information from first ExpressRoute circuit.":::

    **High Resiliency**

    For high resiliency, select one of the supported ExpressRoute Metro service providers and the corresponding **Peering location**. For example, **Megaport** as the *Provider* and **Amsterdam Metro** as the *Peering location*. For more information, see [ExpressRoute Metro](metro.md).

    **Standard Resiliency**

    For standard resiliency, you only need to enter information for one ExpressRoute circuit.

1. Select **Review + create** and then select **Create** to deploy the ExpressRoute circuit.

::: zone-end

::: zone pivot="expressroute-current"

### Sign in to the Azure portal

From a browser, sign in to the [Azure portal](https://portal.azure.com) and sign in with your Azure account.

### Create a new ExpressRoute circuit

> [!IMPORTANT]
> Your ExpressRoute circuit is billed from the moment a service key is issued. Ensure that you perform this operation when the connectivity provider is ready to provision the circuit.

1. On the Azure portal menu, select **+ Create a resource**. Search for **ExpressRoute** and then select **Create**.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/create-an-expressroute-circuit.png" alt-text=" Screenshot of ExpressRoute circuit resource.":::

1. On the **Create ExpressRoute** page. Provide the **Resource Group**, **Region**, and  **Name** for the circuit. Then select **Next: Configuration >**.

    | Setting | Value |
    | ---     | ---   |
    | Resource group | Select **Create new**. Enter **ExpressRouteResourceGroup** </br>  Select **OK**. |
    | Region   |  West US 2 |
    | Name   |  TestERCircuit |

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-create-basic.png" alt-text="Screenshot of how to configure the resource group and region.":::

1. When you enter in the values on this page, make sure that you specify the correct SKU tier (Local, Standard, or Premium) and data metering billing model (Unlimited or Metered).

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-create-configuration.png" alt-text="Screenshot of how to configure the circuit.":::
    
    | Setting | Description |
    | --- | --- |
    | Port type | Select if you're connecting to a service provider or directly into Microsoft's global network at a peering location. |
    | Create new or import from classic | Select if you're creating a new circuit or if you're migrating a classic circuit to Azure Resource Manager. |
    | Provider | Select the internet service provider who you are requesting your service from. |
    | Peering Location | Select the physical location where you're peering with Microsoft. |
    | SKU | Select the SKU for the ExpressRoute circuit. You can specify **Local** to get the local SKU, **Standard** to get the standard SKU or **Premium** for the premium add-on. You can change between Local, Standard, and Premium. |
    | Billing model | Select the billing type for egress data charge. You can specify **Metered** for a metered data plan and **Unlimited** for an unlimited data plan. You can change the billing type from **Metered** to **Unlimited**. |
    | Allow classic operations | Enable this option to allow classic virtual networks to link to the circuit. |

    > [!IMPORTANT]
    > * The Peering Location indicates the [physical location](expressroute-locations.md) where you are peering with Microsoft. This is **not** linked to "Location" property, which refers to the geography where the Azure Network Resource Provider is located. While they're not related, it is a good practice to choose a Network Resource Provider geographically close to the Peering Location of the circuit.
    > * You can't change the SKU from **Standard/Premium** to **Local** in Azure portal. To downgrade the SKU to **Local**, you can use [Azure PowerShell](expressroute-howto-circuit-arm.md) or [Azure CLI](howto-circuit-cli.md).
    > * You can't change the type from **Unlimited** to **Metered**.

1. Select **Review + create** and then select **Create** to deploy the ExpressRoute circuit.

::: zone-end

### View the circuits and properties

**View all the circuits**

You can view all the circuits that you created by searching for **ExpressRoute circuits** in the search box at the top of the portal.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-menu.png" alt-text="Screenshot of ExpressRoute circuit menu.":::

All Expressroute circuits created in the subscription appear here.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-list.png" alt-text="Screenshot of ExpressRoute circuit list.":::

**View the properties**

You can view the properties of the circuit by selecting it. On the Overview page for your circuit, you find the **Service Key**. Provide the service key to the service provider to complete the provisioning process. The service key is unique to your circuit.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-overview.png" alt-text="Screenshot of ExpressRoute properties.":::

### Send the service key to your connectivity provider for provisioning

On this page, **Provider status** gives you the current state of provisioning on the service-provider side. **Circuit status** provides you with the state on the Microsoft side. For more information about circuit provisioning states, see the [Workflows](expressroute-workflows.md#expressroute-circuit-provisioning-states) article.

When you create a new ExpressRoute circuit, the circuit is in the following state:

Provider status: **Not provisioned**<BR>
Circuit status: **Enabled**

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-overview-provisioning-state.png" alt-text="Screenshot of provisioning process.":::

The circuit changes to the following state when the connectivity provider is currently enabling it for you:

Provider status: **Provisioning**<BR>
Circuit status: **Enabled**

To use the ExpressRoute circuit, it must be in the following state:

Provider status: **Provisioned**<BR>
Circuit status: **Enabled**

### Periodically check the status and the state of the circuit key

You can view the properties of the circuit that you're interested in by selecting it. Check the **Provider status** and ensure that it has moved to **Provisioned** before you continue.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/provisioned.png" alt-text="Screenshot of circuit and provider status.":::

### Create your routing configuration

For step-by-step instructions, refer to the [ExpressRoute circuit routing configuration](expressroute-howto-routing-portal-resource-manager.md) article to create and modify circuit peerings.

> [!IMPORTANT]
> These instructions only apply to circuits that are created with service providers that offer layer 2 connectivity services. If you're using a service provider that offers managed layer 3 services (typically an IP VPN, like MPLS), your connectivity provider configures and manages routing for you.

### Link a virtual network to an ExpressRoute circuit

Next, link a virtual network to your ExpressRoute circuit. Use the [Linking virtual networks to ExpressRoute circuits](expressroute-howto-linkvnet-arm.md) article when you work with the Resource Manager deployment model.

## <a name="status"></a>Getting the status of an ExpressRoute circuit

You can view the status of a circuit by selecting it and viewing the Overview page.

## <a name="modify"></a>Modifying an ExpressRoute circuit

You can modify certain properties of an ExpressRoute circuit without impacting connectivity. You can modify the bandwidth, SKU, billing model and allow classic operations on the **Configuration** page. For information on limits and limitations, see the [ExpressRoute FAQ](expressroute-faqs.md).

You can do the following tasks with no downtime:

* Enable or disable an ExpressRoute Premium add-on for your ExpressRoute circuit.

  > [!IMPORTANT]
  > Changing the SKU from **Standard/Premium** to **Local** is not supported in Azure portal. To downgrade the SKU to **Local**, you can use [Azure PowerShell](expressroute-howto-circuit-arm.md) or [Azure CLI](howto-circuit-cli.md).

* Increase the bandwidth of your ExpressRoute circuit, provided there's capacity available on the port.

  > [!IMPORTANT]
  > * Downgrading the bandwidth of a circuit is not supported.
  > * To determine if there is available capacity for a bandwidth upgrade, submit a support request.

* Change the metering plan from *Metered Data* to *Unlimited Data*.

  > [!IMPORTANT]
  > Changing the metering plan from **Unlimited Data** to **Metered Data** is not supported.

* You can enable and disable *Allow Classic Operations*.
  > [!IMPORTANT]
  > You may have to recreate the ExpressRoute circuit if there is inadequate capacity on the existing port. You cannot upgrade the circuit if there is no additional capacity available at that location.
  >
  > Although you can seamlessly upgrade the bandwidth, you cannot reduce the bandwidth of an ExpressRoute circuit without disruption. Downgrading bandwidth requires you to deprovision the ExpressRoute circuit and then reprovision a new ExpressRoute circuit.
  >
  > Disabling the Premium add-on operation can fail if you're using resources that are greater than what is permitted for the standard circuit.

To modify an ExpressRoute circuit, select **Configuration**.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-configuration.png" alt-text="Screenshot of modifying circuit.":::

## <a name="delete"></a>Deprovisioning and deleting an ExpressRoute circuit 

1. On the Azure portal menu, navigate to the ExpressRoute circuit you wish to deprovision.

1. In the **Overview** page, select **Delete**. If there are any associated resources attached to the circuit, you're asked to view the resources. Select **Yes** to see the associations that need to be removed before starting the deprovisioning process. If there are no associated resources, you can proceed with step 4.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-deprovision.png" alt-text="Screenshot of deprovisioning circuit for ExpressRoute.":::

1. In the **View Associated Resources of Circuit** pane, you can see the resources associated with the circuit. Ensure you delete the resources before proceeding with the deprovisioning of the circuit. 

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-deprovision-associated-resources.png" alt-text="Screenshot of deleting associated resources to ExpressRoute circuit.":::

1. After deleting all associated resources, work with your circuit service provider to deprovision the circuit on their end. The circuit is required to be deprovisioned before it can be deleted. 

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-deprovision-after-deletion.png" alt-text="Screenshot of deprovisioning the ExpressRoute circuit.":::

1. After your circuit service provider has confirmed that they've deprovisioned the circuit, confirm that the *Provider status* changes to **Not provisioned** in the Azure portal. Once the *Provider status* is **Not provisioned**, you'll be able to delete the circuit.

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-deprovisioned.png" alt-text="Screenshot of deprovisioned circuit.":::


> [!NOTE]
>* You must delete all associated [Virtual Network connections](expressroute-howto-linkvnet-portal-resource-manager.md#clean-up-resources), [Authorizations](expressroute-howto-linkvnet-portal-resource-manager.md#circuit-owner-operations), and [Global Reach](expressroute-howto-set-global-reach-portal.md#disable-connectivity) from the ExpressRoute circuit before deprovisioning. If deprovisioning fails, check whether any associated resources are still linked to the circuit.
>* If the circuit service provider has deprovisioned the circuit (The *Provider status* has updated to **Not provisioned**), you can delete the circuit. This stops billing for the circuit.


## Next steps

After you create your circuit, continue with the following next step:

> [!div class="nextstepaction"]
> [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
> [Create a connection to a virtual network gateway (Preview)](expressroute-howto-linkvnet-portal-resource-manager.md?pivots=expressroute-preview)
