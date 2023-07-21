---
title: 'Reset a failed circuit - ExpressRoute: PowerShell: Azure | Microsoft Docs'
description: This article helps you reset an ExpressRoute circuit that is in a failed state.
services: expressroute
author: duongau
ms.service: expressroute
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Reset a failed ExpressRoute circuit

When an operation on an ExpressRoute circuit doesn't complete successfully, the circuit may go into a 'failed' state. This article helps you reset a failed Azure ExpressRoute circuit.

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

## Reset a circuit

1. Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azure-powershell).

1. Open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

   ```azurepowershell-interactive
   Connect-AzAccount
   ```
1. If you have multiple Azure subscriptions, check the subscriptions for the account.

   ```azurepowershell-interactive
   Get-AzSubscription
   ```
1. Specify the subscription that you want to use.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionName "Replace_with_your_subscription_name"
   ```
1. Run the following commands to reset a circuit that is in a failed state:

   ```azurepowershell-interactive
   $ckt = Get-AzExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

   Set-AzExpressRouteCircuit -ExpressRouteCircuit $ckt
   ```

The circuit should now be healthy. Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if the circuit is still in a failed state.

## Next steps

Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you're still experiencing issues.
