---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/19/2018
 ms.author: cherylmc
 ms.custom: include file
---
| **Deployment Model/Method** | **Azure Portal** | **PowerShell** | **Azure CLI** |
| --- | --- | --- | --- |
| Classic |[Article*](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-portal-classic.md)|Supported | Not Supported|
| Resource Manager |[Article+](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) |[Article](../articles/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md) |[Article](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-cli.md)
| Connections between different deployment models |[Article*](../articles/vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) |[Article](../articles/vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md) | Not Supported |

(+) denotes this deployment method is available only for VNets in the same subscription.<br>
(*) denotes that this deployment method also requires PowerShell.