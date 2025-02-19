---
ms.author: cherylmc
author: cherylmc
ms.date: 12/02/2024
ms.service: azure-vpn-gateway
ms.topic: include
---

To add more address prefixes:

1. Set the variable for the LocalNetworkGateway.

   ```azurepowershell-interactive
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
   ```

1. Modify the prefixes. The values you specify overwrite the previous values.

   ```azurepowershell-interactive
   Set-AzLocalNetworkGateway -LocalNetworkGateway $local `
   -AddressPrefix @('10.101.0.0/24','10.101.1.0/24','10.101.2.0/24')
   ```

To remove address prefixes:

Leave out the prefixes that you no longer need. In this example, we no longer need prefix 10.101.2.0/24 (from the previous example), so we update the local network gateway and exclude that prefix.

1. Set the variable for the LocalNetworkGateway.

   ```azurepowershell-interactive
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
   ```

1. Set the gateway with the updated prefixes.

   ```azurepowershell-interactive
   Set-AzLocalNetworkGateway -LocalNetworkGateway $local `
   -AddressPrefix @('10.101.0.0/24','10.101.1.0/24')
   ```
