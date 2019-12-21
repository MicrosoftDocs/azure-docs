---
title: 'Azure VPN Gateway: Configure packet captures'
description: Learn about packet capture functionalities that you can use on VPN gateways.
services: vpn-gateway
author: radwiv

ms.service: vpn-gateway
ms.topic: conceptual
ms.date: 10/15/2019
ms.author: radwiv
---

# Configure packet captures for VPN gateways

Connectivity and performance-related issues are often times complex and take significant amount of time and effort just to narrow down the cause of the problem. Ability to packet capture greatly helps reduce time in narrowing down the scope of the problem to certain parts of the network, such as whether the issue is on the customer side of the network, the Azure side of the network, or somewhere in between. Once the issue has been narrowed down, it is much more efficient to debug and take remedial action.

There are some commonly available tools for packet capture. However, getting relevant packet captures using these tools is often times cumbersome especially when working with high volume traffic scenarios. Filtering capabilities provided by a VPN gateway packet capture becomes a major differentiator. You may use a VPN gateway packet capture in addition to commonly available packet capture tools.

## VPN gateway packet capture filtering capabilities

VPN gateway packet captures can be run on the gateway or on a specific connection depending on customer needs. You can also run packet captures on multiple tunnels at the same time. You can capture single or bi-direction traffic, IKE and ESP traffic, and inner packets along with filtering on a VPN gateway.

Using 5 tuples filter (source subnet, destination subnet, source port, destination port, protocol) and TCP flags (SYN, ACK, FIN, URG, PSH, RST) is helpful when isolating issues on a high volume traffic.

You can use only one option per property while running the packet capture.

## Setup packet capture using PowerShell

See the examples below for PowerShell commands to start and stop packet captures. For more information on parameter options (such as how to create filter), see this PowerShell [document](https://docs.microsoft.com/powershell/module/az.network/start-azvirtualnetworkgatewaypacketcapture).

### Start packet capture for a VPN gateway

```azurepowershell-interactive
Start-AzVirtualnetworkGatewayPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayName"
```

Optional parameter **-FilterData** can be used to apply filter.

### Stop packet capture for a VPN gateway

```azurepowershell-interactive
Stop-AzVirtualNetworkGatewayPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayName" -SasUrl "YourSASURL"
```

### Start packet capture for a VPN gateway connection

```azurepowershell-interactive
Start-AzVirtualNetworkGatewayConnectionPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayConnectionName"
```

Optional parameter **-FilterData** can be used to apply filter.

### Stop packet capture on a VPN gateway connection

```azurepowershell-interactive
Stop-AzVirtualNetworkGatewayConnectionPacketCapture -ResourceGroupName "YourResourceGroupName" -Name "YourVPNGatewayConnectionName" -SasUrl "YourSASURL"
```

## Key considerations

- Running packet captures may affect performance. Remember to stop the packet capture when it is not needed.
- Suggested minimum packet capture duration is 600 seconds. Having shorter packet capture duration may not provide complete data due to sync up issues among multiple components on the path.
- Packet capture data files are generated in PCAP format. Use Wireshark or other commonly available applications to open PCAP files.

## Next steps

For more information about VPN Gateway, see [About VPN Gateway](vpn-gateway-about-vpngateways.md)
