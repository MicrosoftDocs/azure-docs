---
title: 'Modify gateway IP address settings: Azure CLI'
titleSuffix: Azure VPN Gateway
description: Learn how to change IP address prefixes for your local network gateway using the Azure CLI.
author: cherylmc
ms.service: vpn-gateway
ms.custom: devx-track-azurecli
ms.topic: how-to
ms.date: 10/28/2021
ms.author: cherylmc
---
# Modify local network gateway settings using the Azure CLI

Sometimes the settings for your local network gateway Address Prefix or Gateway IP Address change. This article shows you how to modify your local network gateway settings. You can also modify these settings using a different method by selecting a different option from the following list:

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-modify-local-network-gateway-portal.md)
> * [PowerShell](vpn-gateway-modify-local-network-gateway.md)
> * [Azure CLI](vpn-gateway-modify-local-network-gateway-cli.md)
>
>

>[!NOTE]
> Making changes to a local network gateway that has a connection may cause tunnel disconnects and downtime.
>

## <a name="before"></a>Before you begin

Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install the Azure CLI](/cli/azure/install-azure-cli).

[!INCLUDE [CLI-login](../../includes/vpn-gateway-cli-login-include.md)]

## <a name="ipaddprefix"></a>Modify IP address prefixes

[!INCLUDE [modify-prefix](../../includes/vpn-gateway-modify-ip-prefix-cli-include.md)]

## <a name="gwip"></a>Modify the gateway IP address

[!INCLUDE [modify-gateway-IP](../../includes/vpn-gateway-modify-lng-gateway-ip-cli-include.md)]

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).
