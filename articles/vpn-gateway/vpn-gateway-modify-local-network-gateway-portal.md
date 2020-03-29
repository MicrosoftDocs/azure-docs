---
title: 'VPN Gateway: Modify gateway IP address settings: Azure portal'
description: This article walks you through changing IP address prefixes for your local network gateway using the Azure portal.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 06/19/2017
ms.author: cherylmc

---
# Modify local network gateway settings using the Azure portal

Sometimes the settings for your local network gateway AddressPrefix or GatewayIPAddress change. This article shows you how to modify your local network gateway settings. You can also modify these settings using a different method by selecting a different option from the following list:

Before you delete the connection, you may want to download the configuration for your connecting devices in order to get the defined PSK. That way, you don't need to redefine it on the other side.

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-modify-local-network-gateway-portal.md)
> * [PowerShell](vpn-gateway-modify-local-network-gateway.md)
> * [Azure CLI](vpn-gateway-modify-local-network-gateway-cli.md)
>
>


## <a name="ipaddprefix"></a>Modify IP address prefixes

When you modify IP address prefixes, the steps you follow depend on whether your local network gateway has a connection.

[!INCLUDE [modify prefix](../../includes/vpn-gateway-modify-ip-prefix-portal-include.md)]

## <a name="gwip"></a>Modify the gateway IP address

If the VPN device that you want to connect to has changed its public IP address, you need to modify the local network gateway to reflect that change. When you change the public IP address, the steps you follow depend on whether your local network gateway has a connection.

[!INCLUDE [modify gateway IP](../../includes/vpn-gateway-modify-lng-gateway-ip-portal-include.md)]

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).
