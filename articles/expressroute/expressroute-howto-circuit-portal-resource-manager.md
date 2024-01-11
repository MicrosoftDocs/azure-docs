---
title: 'Quickstart: Create and modify a circuit with ExpressRoute - Azure portal'
description: In this quickstart, you learn how to create, provision, verify, update, delete, and deprovision an ExpressRoute circuit by using the Azure portal.
services: expressroute
author: duongau
ms.author: duau
ms.date: 08/31/2023
ms.topic: quickstart
ms.service: expressroute
ms.custom: mode-ui
---

# Quickstart: Create and modify an ExpressRoute circuit

This quickstart shows you how to create an ExpressRoute circuit using the Azure portal and the Azure Resource Manager deployment model. You can also check the status, update, delete, or deprovision a circuit.

:::image type="content" source="media/expressroute-howto-circuit-portal-resource-manager/environment-diagram.png" alt-text="Diagram of ExpressRoute circuit deployment environment using Azure portal.":::

## Prerequisites

* An Azure account with an active subscription. [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).
* Review the [prerequisites](expressroute-prerequisites.md) and [workflows](expressroute-workflows.md) before you begin configuration.

## <a name="create"></a>Create and provision an ExpressRoute circuit

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

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-create-basic.png" alt-text=" Screenshot of how to configure the resource group and region.":::

1. When you're filling in the values on this page, make sure that you specify the correct SKU tier (Local, Standard, or Premium) and data metering billing model (Unlimited or Metered).

    :::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-create-configuration.png" alt-text="Screenshot of how to configure the circuit.":::
    
    | Setting | Description |
    | --- | --- |
    | Port type | Select if you're connecting to a service provider or directly into Microsoft's global network at a peering location. |
    | Create new or import from classic | Select if you're creating a new circuit or if you're migrating a classic circuit to Azure Resource Manager. |
    | Provider | Select the internet service provider who you are requesting your service from. |
    | Peering Location | Select the physical location where you're peering with Microsoft. |
    | SKU | Select the SKU for the ExpressRoute circuit. You can specify **Local** to get the local SKU, **Standard** to get the standard SKU or **Premium** for the premium add-on. You can change between Local, Standard and Premium. |
    | Billing model | Select the billing type for egress data charge. You can specify **Metered** for a metered data plan and **Unlimited** for an unlimited data plan. You can change the billing type from **Metered** to **Unlimited**. |
    | Allow classic operations | Enable this option to allow classic virtual networks to link to the circuit. |

    > [!IMPORTANT]
    > * The Peering Location indicates the [physical location](expressroute-locations.md) where you are peering with Microsoft. This is **not** linked to "Location" property, which refers to the geography where the Azure Network Resource Provider is located. While they're not related, it is a good practice to choose a Network Resource Provider geographically close to the Peering Location of the circuit.
    > * You can't change the SKU from **Standard/Premium** to **Local** in Azure portal. To downgrade the SKU to **Local**, you can use [Azure PowerShell](expressroute-howto-circuit-arm.md) or [Azure CLI](howto-circuit-cli.md).
    > * You can't change the type from **Unlimited** to **Metered**.

1. Select **Review + create** and then select **Create** to deploy the ExpressRoute circuit.

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

## <a name="delete"></a>Deprovisioning an ExpressRoute circuit

If the ExpressRoute circuit service provider provisioning state is **Provisioning** or **Provisioned** you must work with your service provider to deprovision the circuit on their side. We continue to reserve resources and bill you until the service provider completes deprovisioning the circuit and notifies us.

> [!NOTE]
>* You must unlink *all virtual networks* from the ExpressRoute circuit before deprovisioning. If this operation fails, check whether any virtual networks are linked to the circuit.
>* If the service provider has deprovisioned the circuit (the service provider provisioning state is set to **Not provisioned**), you can delete the circuit. This stops billing for the circuit.


## Clean up resources

You can delete your ExpressRoute circuit by selecting the **Delete** icon. Ensure the provider status is *Not provisioned* before proceeding.

:::image type="content" source="./media/expressroute-howto-circuit-portal-resource-manager/expressroute-circuit-delete.png" alt-text="Screenshot of deleting circuit.":::

## Next steps

After you create your circuit, continue with the following next step:

> [!div class="nextstepaction"]
> [Create and modify routing for your ExpressRoute circuit](expressroute-howto-routing-portal-resource-manager.md)
