---
 title: Include file
 description: Include file
 services: vpn-gateway
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 09/26/2023
 ms.author: cherylmc
 ms.custom: include file
---
* User-defined routes with a 0.0.0.0/0 destination and network security groups (NSGs) on the gateway subnet *are not supported*. User-defined routes, containing GatewaySubnet address space, with next-hop set to none or with next-hop set to NVA (which has policy to drop the traffic) are not supported. Gateways with this configuration are blocked from being created. Gateways require access to the management controllers in order to function properly. [Border Gateway Protocol (BGP) route propagation](/azure/virtual-network/virtual-networks-udr-overview#border-gateway-protocol) should be enabled on the gateway subnet to ensure availability of the gateway. If BGP route propagation is disabled, the gateway won't function.

* Diagnostics, data path, and control path can be affected if a user-defined route overlaps with the gateway subnet range or the gateway public IP range.
