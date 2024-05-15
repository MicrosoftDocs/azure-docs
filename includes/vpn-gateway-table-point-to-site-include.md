---
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/28/2024
 ms.author: cherylmc
---


|**Azure native certificate authentication**|**Deployment model/method** | **Azure portal** | **PowerShell** |
|---|---|---|---|
|| Resource Manager | [Tutorial](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) | [Tutorial](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)|
|| Classic (legacy deployment model)| [Tutorial](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal.md) | Supported |


|**Microsoft Entra authentication**|**Deployment model/method** | **Article** |
|---|---|---|
||Resource Manager | [Create tenant](../articles/vpn-gateway/openvpn-azure-ad-tenant.md)|
||Resource Manager |[Configure access- users and groups](../articles/vpn-gateway/openvpn-azure-ad-tenant-multi-app.md)|


|**RADIUS authentication**|**Deployment model/method** | **Azure portal** | **PowerShell** |
|---|---|---|---|
|| Resource Manager | Supported | [Tutorial](../articles/vpn-gateway/point-to-site-how-to-radius-ps.md)|
|| Classic (legacy deployment model)| Not Supported | Not Supported |