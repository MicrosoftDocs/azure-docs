---
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/10/2023
 ms.author: cherylmc

---

To add additional address prefixes:

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

Leave out the prefixes that you no longer need. In this example, we no longer need prefix 10.101.2.0/24 (from the previous example), so we'll update the local network gateway and exclude that prefix.

1. Set the variable for the LocalNetworkGateway.

   ```azurepowershell-interactive
   $local = Get-AzLocalNetworkGateway -Name Site1 -ResourceGroupName TestRG1
   ```
1. Set the gateway with the updated prefixes.

   ```azurepowershell-interactive
   Set-AzLocalNetworkGateway -LocalNetworkGateway $local `
   -AddressPrefix @('10.101.0.0/24','10.101.1.0/24')
   ```
