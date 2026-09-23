---
title: ExpressRoute Resiliency Guard (Preview)
titleSuffix: ExpressRoute
description: Learn how to use ExpressRoute Resiliency Guard to configure your ExpressRoute gateway for high availability and optimal resilience.
author: mekaylamoore
ms.service: azure-expressroute
ms.custom: references_regions
ms.topic: concept-article
ms.date: 06/25/2025
ms.author: mekaylamoore
---

# ExpressRoute Resiliency Guard (Preview)

ExpressRoute Resiliency Guard is a guided setup experience that helps you configure an ExpressRoute gateway for the level of availability your network requires. When you create or modify a gateway, use the **Resiliency Model** property to choose between multi-homed and single-homed configurations.

## Choose your resiliency model

### Multi-homed: Maximum resiliency

Choose multi-homed to protect your network from location-wide outages. Connect the gateway to either:

- Two or more circuits in different physical locations.
- One or more ExpressRoute Metro circuits.

Resiliency Guard displays the connectivity status for the configuration. If one location becomes unavailable, connectivity to the affected circuit is unavailable until failover conditions are met and traffic is redirected to a healthy location. Traffic then automatically fails over to the healthy location. Azure Advisor recommends this model for critical workloads that require high availability.

### Single-homed: Standard setup

Choose single-homed when location-level redundancy isn't required. Connectivity becomes available after you connect the gateway to one circuit at one location. This model doesn't protect against location-wide outages, so Azure Advisor recommends upgrading to multi-homed for better protection.

## Before you begin

Resiliency Guard is available in public preview for ExpressRoute virtual network gateways. Virtual WAN gateways aren't currently supported.

To enable Resiliency Guard for your subscription, submit the [public preview form](https://forms.office.com/r/L828eyz8Qj).

## Configure Resiliency Guard

### Create a gateway with Resiliency Guard

1. Navigate to **Create a virtual network gateway**.
1. Enter the basic settings, including the name, region, and gateway type.
1. In the **Resiliency Model** section, select **Multi-homed** or **Single-homed**.

:::image type="content" source="./media/resiliency-model/create-gateway-resiliency-model.png" alt-text="Screenshot of the Create virtual network gateway page with Multi-Homed selected for the resiliency model." lightbox="./media/resiliency-model/create-gateway-resiliency-model.png":::

### Multi-homed gateway configuration

1. Navigate to your ExpressRoute gateway.
1. Select **Connections**.
1. Add connections to two or more circuits at different physical locations or to a Metro circuit.

:::image type="content" source="./media/resiliency-model/add-gateway-connections.png" alt-text="Screenshot of the gateway Connections page with a banner requiring connections to circuits in different peering locations." lightbox="./media/resiliency-model/add-gateway-connections.png":::

The portal displays your connectivity status once you connect all required circuits:

:::image type="content" source="./media/resiliency-model/multi-homed-connectivity-status.png" alt-text="Screenshot showing connectivity status for multi-homed gateway." lightbox="./media/resiliency-model/multi-homed-connectivity-status.png":::

### Create a gateway with PowerShell

When you create an ExpressRoute virtual network gateway with PowerShell, you must include the `-ResiliencyModel` parameter. Set the parameter to `SingleHomed` or `MultiHomed`.

```azurepowershell
$gateway = New-AzVirtualNetworkGateway `
    -Name $gatewayName `
    -ResourceGroupName $resourceGroupName `
    -Location $location `
    -IpConfigurations $ipConfiguration `
    -GatewayType ExpressRoute `
    -GatewaySku $gatewaySku `
    -ResiliencyModel MultiHomed
```

To create a single-homed gateway, set `-ResiliencyModel SingleHomed`.

## Change your resiliency model

You can change your gateway's resiliency model at any time on the **Configuration** tab in the Azure portal.

### Upgrade to multi-homed

To add redundancy to your gateway:

1. Add a second connection to a circuit at a different location or a Metro circuit.
1. Wait for the new connection to be established.
1. Open the **Configuration** tab.
1. Change the resiliency model to **Multi-homed**.
1. Select **Save**.

### Downgrade to single-homed

To simplify your ExpressRoute setup:

1. Open the **Configuration** tab.
1. Change the resiliency model to **Single-homed**.
1. Confirm the change.
   
A confirmation dialog appears to ensure you understand the implications:

:::image type="content" source="./media/resiliency-model/downgrade-single-homed-confirmation.png" alt-text="Screenshot of the gateway Configuration page with Single-Homed selected and the Change Requirement confirmation dialog open." lightbox="./media/resiliency-model/downgrade-single-homed-confirmation.png":::

## Delete your gateway connections

To maintain resilience, you can't delete connections on multi-homed gateways. A multi-homed configuration must always maintain either:

- At least two connections to circuits in different physical locations, or
- At least one connection to an ExpressRoute Metro circuit.
   
If you attempt to delete a connection that's required to maintain one of these minimum resilience configurations, the deletion is blocked and you receive a message explaining why.

To remove these connections, you must first downgrade the gateway from a multi-homed configuration to a single-homed configuration. After the gateway is downgraded, you can delete any or all existing connections.

### Multi-homed and Metro gateways

To prevent accidental deletion, Azure blocks the deletion of Metro and multi-homed gateways. [Downgrade the gateway to single-homed](#downgrade-to-single-homed), wait for the change to finish, and then delete the gateway.

### Single-homed gateways

Single-homed gateways have no special deletion requirements and you can delete them directly.
