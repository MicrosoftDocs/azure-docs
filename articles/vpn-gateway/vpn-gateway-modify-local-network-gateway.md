<properties
   pageTitle="Modify local network gateway IP address prefixes and gateway IP | Microsoft Azure"
   description="This article walks you through changing IP address prefixes for your local network gateway"
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
   tags="azure-resource-manager"/>

<tags
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/08/2016"
   ms.author="cherylmc"/>

# Modify local network gateway settings using PowerShell

Sometimes the settings for your local network gateway AddressPrefix or GatewayIPAddress change. The instructions below will help you modify your local network gateway settings. You can also modify these settings in the Azure portal.

## Before you begin
	
You'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.

## To modify IP address prefixes

[AZURE.INCLUDE [vpn-gateway-modify-ip-prefix-rm](../../includes/vpn-gateway-modify-ip-prefix-rm-include.md)]

## To modify the gateway IP address

[AZURE.INCLUDE [vpn-gateway-modify-lng-gateway-ip-rm](../../includes/vpn-gateway-modify-lng-gateway-ip-rm-include.md)]

## Next steps

You can verify your gateway connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).

