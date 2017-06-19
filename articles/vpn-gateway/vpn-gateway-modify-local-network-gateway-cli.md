---
title: 'Modify the local network gateway IP address prefixes and the VPN Gateway IP address| Azure| CLI| Microsoft Docs'
description: This article walks you through changing IP address prefixes for your local network gateway using the Azure CLI.
services: vpn-gateway
documentationcenter: na
author: cherylmc
manager: timlt
editor: ''
tags: azure-resource-manager

ms.assetid: 8c7db48f-d09a-44e7-836f-1fb6930389df
ms.service: vpn-gateway
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 06/19/2017
ms.author: cherylmc

---
# Modify local network gateway settings using the Azure CLI

Sometimes the settings for your local network gateway Address Prefix or Gateway IP Address change. This article shows you how to modify your local network gateway settings. You can also modify these settings in the Azure portal or PowerShell.

> [!div class="op_single_selector"]
> * [Azure portal](vpn-gateway-modify-local-network-gateway-portal.md)
> * [PowerShell](vpn-gateway-modify-local-network-gateway.md)
> * [Azure CLI](vpn-gateway-modify-local-network-gateway-cli.md)
>
>

## Before you begin

Install the latest version of the CLI commands (2.0 or later). For information about installing the CLI commands, see [Install Azure CLI 2.0](https://docs.microsoft.com/cli/azure/install-azure-cli).

[!INCLUDE [CLI-login](../../includes/vpn-gateway-cli-login-include.md)]

## Modify IP address prefixes

[!INCLUDE [modify-prefix](../../includes/vpn-gateway-modify-ip-prefix-cli-include.md)]

## Modify the gateway IP address

[!INCLUDE [modify-gateway-IP](../../includes/vpn-gateway-modify-lng-gateway-ip-cli-include.md)]

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).

