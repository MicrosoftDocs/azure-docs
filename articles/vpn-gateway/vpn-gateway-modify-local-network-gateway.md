<properties
   pageTitle="Modify IP address prefixes for a local network gateway | Microsoft Azure"
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
   ms.date="08/04/2016"
   ms.author="cherylmc"/>

# Modify the IP address prefixes for your local network gateway using PowerShell

Sometimes your local network gateway prefixes change. If you need to change the prefixes for your Resource Manager local network gateway, use the instructions below. Two sets of instructions are provided. The instructions you choose depends on whether you have already created your VPN gateway connection.

## Before you begin
	
- You'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets.

## To modify IP address prefixes

[AZURE.INCLUDE [vpn-gateway-modify-ip-prefix-rm](../../includes/vpn-gateway-modify-ip-prefix-rm-include.md)]

## Next steps

You can verify your VPN connection. See [Verify a gateway connection](vpn-gateway-verify-connection-resource-manager.md).

