---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 09/28/2019
 ms.author: cherylmc
 ms.custom: include file
---
User-defined routes with a 0.0.0.0/0 destination and NSGs on the GatewaySubnet **are not supported**. Gateways created with this configuration will be blocked from creation. Gateways require access to the management controllers in order to function properly. [BGP Route Propagation](https://docs.microsoft.com/azure/virtual-network/virtual-networks-udr-overview#border-gateway-protocol) should be set to "Enabled" on the GatewaySubnet to ensure availability of the gateway. If this is set to disabled, the gateway will not function.
