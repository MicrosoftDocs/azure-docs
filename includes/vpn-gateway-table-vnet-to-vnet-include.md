---
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/28/2024
 ms.author: cherylmc
---
| **Deployment model/method** | **Azure portal** | **PowerShell** | **Azure CLI** |
| --- | --- | --- | --- |
| Resource Manager |[Tutorial+](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-resource-manager-portal.md) |[Tutorial](../articles/vpn-gateway/vpn-gateway-vnet-vnet-rm-ps.md) |[Tutorial](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-cli.md)|
| Classic (legacy deployment model)|[Tutorial*](../articles/vpn-gateway/vpn-gateway-howto-vnet-vnet-portal-classic.md)|Supported | Not Supported|
| Connections between Resource Manager and Classic (legacy) deployment models|[Tutorial*](../articles/vpn-gateway/vpn-gateway-connect-different-deployment-models-portal.md) |[Tutorial](../articles/vpn-gateway/vpn-gateway-connect-different-deployment-models-powershell.md) | Not Supported |

(+) denotes this deployment method is available only for VNets in the same subscription.<br>
(*) denotes that this deployment method also requires PowerShell.
