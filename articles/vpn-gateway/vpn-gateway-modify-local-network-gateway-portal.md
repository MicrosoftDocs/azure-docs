---
title: 'Modify gateway IP address settings: Azure portal'
titleSuffix: Azure VPN Gateway
description: Learn how to change IP address prefixes for your local network gateway using the Azure portal.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 10/16/2020
ms.author: cherylmc

---
# Modify local network gateway settings using the Azure portal

Sometimes the settings for your local network gateway AddressPrefix or GatewayIPAddress change. This article shows you how to modify your local network gateway settings. You can also modify these settings using a different method by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-modify-local-network-gateway-portal.md)
> * [PowerShell](vpn-gateway-modify-local-network-gateway.md)
> * [Azure CLI](vpn-gateway-modify-local-network-gateway-cli.md)
>

## <a name="configure-lng"></a>Local network gateway configuration

The screenshot below shows the **Configuration** page of a local network gateway resource using public IP address endpoint:

:::image type="content" source="./media/vpn-gateway-modify-local-network-gateway-portal/settings.png" alt-text="IP address settings" lightbox="./media/vpn-gateway-modify-local-network-gateway-portal/settings-expand.png":::

This is the configuration page with an FQDN endpoint:

:::image type="content" source="./media/vpn-gateway-modify-local-network-gateway-portal/name.png" alt-text="FQDN settings":::

## <a name="ip"></a>To modify the gateway IP address or FQDN

> [!NOTE]
> You cannot change a local network gateway between FQDN endpoint and IP address endpoint. You must delete all connections associated with this local network gateway, create a new one with the new endpoint (IP address or FQDN), then recreate the connections.
>

If the VPN device to which you want to connect has changed its public IP address, modify the local network gateway using the following steps:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. In the **IP address** box, modify the IP address.
3. Select **Save** to save the settings.

If the VPN device to which you want to connect has changed its FQDN (Fully Qualified Domain Name), modify the local network gateway using the following steps:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. In the **FQDN** box, modify the domain name.
3. Select **Save** to save the settings.

## <a name="ipaddprefix"></a>To modify IP address prefixes

To add additional address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. Add the IP address space in the *Add additional address range* box.
3. Select **Save** to save your settings.

To remove address prefixes:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. Select the **'...'** on the line containing the prefix you want to remove.
3. Select **Remove**.
4. Select **Save** to save your settings.

## <a name="bgp"></a>To modify BGP settings

To add or update BGP settings:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. Select **"Configure BGP settings"** to display or update the BGP configurations for this local network gateway
3. Add or update the Autonomous system number or BGP peer IP address in the corresponding fields
4. Select **Save** to save your settings.

To remove BGP settings:

1. On the Local Network Gateway resource, in the **Settings** section, select **Configuration**.
2. Unselect the **"Configure BGP settings"** to remove the existing BGP ASN and BGP peer IP address
3. Select **Save** to save your settings.

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).
