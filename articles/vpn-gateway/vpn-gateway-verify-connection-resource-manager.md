<properties
   pageTitle="Verify a gateway connection | Microsoft Azure"
   description="This article shows you how to verify a gateway connection in the Resource Manager deployment model"
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
   ms.date="08/03/2016"
   ms.author="cherylmc"/>

# Verify a gateway connection

You can verify your gateway connection in a few different ways. This article will show you how to verify the status of a Resource Manager gateway connection by using the Azure portal and by using PowerShell.


## Before you begin

If you plan to use PowerShell, you'll need to install the latest version of the Azure Resource Manager PowerShell cmdlets. See [How to install and configure Azure PowerShell](../powershell-install-configure.md) for more information about installing the PowerShell cmdlets. For more information about using Resource Manager cmdlets, see [Using Windows PowerShell with Resource Manager](../powershell-azure-resource-manager.md).

1. Open your PowerShell console and connect to your account.

		Login-AzureRmAccount

2. Check the subscriptions for the account.

		Get-AzureRmSubscription 

3. Specify the subscription that you want to use.

		Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"

## Verifying your connection


[AZURE.INCLUDE [vpn-gateway-verify-connection-rm](../../includes/vpn-gateway-verify-connection-rm-include.md)]


## Next steps

- You can add virtual machines to your virtual networks. See [Create a Virtual Machine](../virtual-machines/virtual-machines-windows-hero-tutorial.md) for steps.

