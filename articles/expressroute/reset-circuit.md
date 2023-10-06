---
title: 'Reset a failed circuit - ExpressRoute | Microsoft Docs'
description: This article helps you reset an ExpressRoute circuit that is in a failed state.
services: expressroute
author: duongau
ms.service: expressroute
ms.custom: devx-track-azurepowershell
ms.topic: how-to
ms.date: 06/30/2023
ms.author: duau
---

# Reset a failed ExpressRoute circuit

When an operation on an ExpressRoute circuit doesn't complete successfully, the circuit may go into a 'failed' state. This article helps you reset a failed Azure ExpressRoute circuit.

## Azure portal

1. Sign in to the [Azure portal](https://portal.azure.com) with your Azure account.

1. Search for **ExpressRoute circuits** in the search box at the top of the portal.

1. Select the ExpressRoute circuit that you want to reset.

1. Select **Refresh** from the top menu.

    :::image type="content" source="./media/reset-circuit/refresh-circuit.png" alt-text="Screenshot of refresh button for an ExpressRoute circuit."::: 

## Azure PowerShell

[!INCLUDE [updated-for-az](../../includes/hybrid-az-ps.md)]

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
