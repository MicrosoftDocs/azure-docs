---
title: 'Reset a failed Azure ExpressRoute circuit: PowerShell | Microsoft Docs'
description: This article helps you reset an ExpressRoute circuit that is in a failed state.
documentationcenter: na
services: expressroute
author: anzaman
manager: 
editor: ''
tags: azure-resource-manager

ms.assetid: 
ms.service: expressroute
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 11/28/2017
ms.author: anzaman;cherylmc

---
# Reset a failed ExpressRoute circuit

When an operation on an ExpressRoute circuit does not complete successfully, the circuit may go into a 'failed' state. This article helps you reset a failed Azure ExpressRoute circuit.

## Reset a circuit

1. Install the latest version of the Azure Resource Manager PowerShell cmdlets. For more information, see [Install and configure Azure PowerShell](/powershell/azure/install-azurerm-ps).

2. Open your PowerShell console with elevated privileges, and connect to your account. Use the following example to help you connect:

  ```powershell
  Connect-AzureRmAccount
  ```
3. If you have multiple Azure subscriptions, check the subscriptions for the account.

  ```powershell
  Get-AzureRmSubscription
  ```
4. Specify the subscription that you want to use.

  ```powershell
  Select-AzureRmSubscription -SubscriptionName "Replace_with_your_subscription_name"
  ```
5. Run the following commands to reset a circuit that is in a failed state:

  ```powershell
  $ckt = Get-AzureRmExpressRouteCircuit -Name "ExpressRouteARMCircuit" -ResourceGroupName "ExpressRouteResourceGroup"

  Set-AzureRmExpressRouteCircuit -ExpressRouteCircuit $ckt
  ```

The circuit should now be healthy. Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if the circuit is still in a failed state.

## Next steps

Open a support ticket with [Microsoft support](https://portal.azure.com/?#blade/Microsoft_Azure_Support/HelpAndSupportBlade) if you are still experiencing issues.
