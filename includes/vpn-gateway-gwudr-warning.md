---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/26/2023
 ms.author: cherylmc
 ms.custom: include file
---
- User-defined routes with a 0.0.0.0/0 destination and NSGs on the GatewaySubnet **are not supported**. Gateways with this configuration are blocked from being created. Gateways require access to the management controllers in order to function properly. [BGP route propagation](../articles/virtual-network/virtual-networks-udr-overview.md#border-gateway-protocol) should be set to "Enabled" on the GatewaySubnet to ensure availability of the gateway. If BGP route propagation is set to disabled, the gateway won't function.

- Diagnostics, data path, and control path can be affected if a user-defined route overlaps with the Gateway subnet range or the gateway public IP range.
