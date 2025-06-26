---
title: About custom traffic selectors
description: Learn about custom traffic selectors for VPN Gateway.
titleSuffix: Azure VPN Gateway
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: how-to
ms.date: 06/25/2025
ms.author: cherylmc
---
# Custom traffic selectors for VPN Gateway

There are certain scenarios where you might not want to allow the entire virtual network address space or local network address space to negotiate traffic for a specific VPN Gateway connection. You can use custom traffic selectors to specify the address spaces that are allowed.

Custom traffic selectors are supported for both policy-based and route-based VPN gateways. The custom-configured traffic selectors are proposed only when a VPN gateway initiates the connection. A VPN gateway accepts any traffic selectors proposed by a remote gateway (on-premises VPN device). This behavior is consistent among all connection modes (`Default`, `InitiatorOnly`, and `ResponderOnly`).

## Portal

You can define traffic selectors in the Azure portal. You can either create a new connection with the required settings, or update an existing connection. In the following steps, we update an existing connection with the required settings.

1. In the Azure portal, navigate to **Virtual network gateways** and select the gateway you want to configure.
1. In the **Settings** section, select **Connections**.
1. Select the connection you want to configure.
1. Select **Configuration**.
1. On the Configuration page, Enable **Use policy based traffic selector**.
1. Select the **Connection Mode** you want to use. The options are **Default**, **InitiatorOnly**, and **ResponderOnly**. The default is **Default**.
1. Enable **Use custom traffic selectors**.
1. For **Local address range**, enter the address ranges that you want to use. The address ranges must be in CIDR notation. You can specify multiple address ranges by separating them with commas, or create separate lines for each address range.
1. For **Remote address range**, enter the address ranges that you want to use. The address ranges must be in CIDR notation. You can specify multiple address ranges by separating them with commas, or use multiple lines. The behavior is different depending on whether you use a single line or multiple lines. This behavior is described in the next sections.
1. **Save** the changes.

### Addresses on a single line

In the following example, a single QMSA with 3 TSi to 3 TSr is specified.

:::image type="content" source="./media/custom-traffic-selectors/same-line.png" alt-text="Screenshot showing custom traffic selector addresses using the same line." lightbox ="./media/custom-traffic-selectors/same-line.png":::

When you specify addresses on a single line, the behavior is as follows:

* When the addresses are specified on a single line, the tunnel comes up and creates a QMSA for the local range and remote range pairs.
* The QMSA is created for the entire range of addresses specified.

### Addresses on multiple lines

In the following example, addresses are specified on separate lines. When you specify addresses on separate lines, the behavior is different than when you specify addresses all on the same line.

:::image type="content" source="./media/custom-traffic-selectors/separate-lines.png" alt-text="Screenshot showing custom traffic selector addresses using multiple lines." lightbox ="./media/custom-traffic-selectors/separate-lines.png":::

When you specify addresses on separate lines, the behavior is as follows:

* When the tunnel comes up, it creates a QMSA for only the 1st line.
* The rest of the local range and remote range pairs aren't created until traffic is attempted. When traffic is attempted, it triggers to create a QMSA for that traffic.
* For QMSAs that aren't yet created, when packets are sent, the first few packets are unsuccessful until there's a QMSA for the traffic.

## PowerShell

You can define traffic selectors by using the `trafficSelectorPolicies` attribute on a connection via the [New-AzIpsecTrafficSelectorPolicy](/powershell/module/az.network/new-azipsectrafficselectorpolicy) Azure PowerShell command. For the specified traffic selector to take effect, be sure to [enable policy-based traffic selectors](vpn-gateway-connect-multiple-policybased-rm-ps.md#enablepolicybased).

1. Declare the variables. The following example shows how to declare the variables. You can use the same variables in the next steps.

   ```azurepowershell-interactive
   Select-AzSubscription -SubscriptionId "UPDATE THESUBSCRIPTION ID" 
   $rgname = "UPDATE THE RESOURCE GROUP NAME"
   $location = "UPDATE THE REGION NAME"
   $vnetGateway = Get-AzVirtualNetworkGateway -ResourceGroupName $rgname -Name "UPDATE THE VNET GATEWAY NAME"
   $localnetGateway = Get-AzLocalNetworkGateway -ResourceGroupName $rgname -Name "UPDATE THE VNET GATEWAY NAME"
   $sharedKey = "******"
   $vnetConnectionName = "UPDATE THE CONNECTION NAME"
   ```

1. Create the traffic selector policy. The following example shows how to create a traffic selector policy with a single line. To specify multiple address ranges, separate them with commas.

   ```azurepowershell-interactive
   $trafficSelectorPolicy = New-AzIpsecTrafficSelectorPolicy -LocalAddressRange ("10.30.0.4/32") -RemoteAddressRange ("10.50.0.0/24")
   New-AzVirtualNetworkGatewayConnection -ResourceGroupName $rgname -name $vnetConnectionName -location $location -VirtualNetworkGateway1 $vnetGateway -LocalNetworkGateway2 $localnetGateway -ConnectionType IPsec -RoutingWeight 3 -SharedKey $sharedKey -UsePolicyBasedTrafficSelectors $true -TrafficSelectorPolicy ($trafficSelectorPolicy) 
   ```

1. Once the connection object is created, you can pull the Get-Gateway / refresh ASC and pull the RAW DATA URI (Get-Gateway output) to see the changes.

## Next steps

For more information about VPN Gateway, see the [VPN Gateway FAQ](vpn-gateway-vpn-faq.md).
