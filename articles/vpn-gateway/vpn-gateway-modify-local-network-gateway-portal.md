---
title: 'Modify gateway IP address settings: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to change IP address prefixes and configure BGP Settings for your local network gateway using the Azure portal.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/28/2023
ms.author: cherylmc

---
# Modify local network gateway settings using the Azure portal

Sometimes the settings for your local network gateway AddressPrefix or GatewayIPAddress change, or you need to configure BGP settings. This article shows you how to modify your local network gateway settings. You can also modify these settings using a different method by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-modify-local-network-gateway-portal.md)
> * [PowerShell](vpn-gateway-modify-local-network-gateway.md)
> * [Azure CLI](vpn-gateway-modify-local-network-gateway-cli.md)
>

>[!NOTE]
> Making changes to a local network gateway that has a connection may cause tunnel disconnects and downtime.
>

## <a name="configure-lng"></a>Local network gateway configuration

The screenshot below shows the **Configuration** page of a local network gateway resource using public IP address endpoint. **BGP Settings** is selected to reveal available settings.

:::image type="content" source="./media/vpn-gateway-modify-local-network-gateway-portal/settings.png" alt-text="Screenshot of the portal page for local network gateway configuration settings." lightbox="./media/vpn-gateway-modify-local-network-gateway-portal/settings.png":::

This is the configuration page with an FQDN endpoint:

:::image type="content" source="./media/vpn-gateway-modify-local-network-gateway-portal/domain-name.png" alt-text="Screenshot of the portal page for local network gateway configuration settings using F Q D N." lightbox="./media/vpn-gateway-modify-local-network-gateway-portal/domain-name.png":::

## <a name="ip"></a>To modify the gateway IP address or FQDN

> [!NOTE]
> You can't change a local network gateway between FQDN endpoint and IP address endpoint. You must delete all connections associated with this local network gateway, create a new one with the new endpoint (IP address or FQDN), then recreate the connections.
>

If the VPN device to which you want to connect has changed its public IP address, modify the local network gateway using the following steps:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. In the **IP address** box, modify the IP address.
1. Select **Save** to save the settings.

If the VPN device to which you want to connect has changed its FQDN (Fully Qualified Domain Name), modify the local network gateway using the following steps:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. In the **FQDN** box, modify the domain name.
1. Select **Save** to save the settings.

## <a name="ipaddprefix"></a>To modify IP address prefixes

To add additional address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. Add the IP address space in the *Add additional address range* box.
1. Select **Save** to save your settings.

To remove address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. Select the **'...'** on the line containing the prefix you want to remove.
1. Select **Remove**.
1. Select **Save** to save your settings.

## <a name="bgp"></a>To modify BGP settings

To add or update BGP settings:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. For **Configure BGP settings**, select **Yes** to display or update the BGP configurations for this local network gateway
1. Add or update the Autonomous system number or BGP peer IP address in the corresponding fields
1. Select **Save** to save your settings.

To remove BGP settings:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
1. For **Configure BGP settings**, select **No** to remove the existing BGP ASN and BGP peer IP address.
1. Select **Save** to save your settings.

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).
