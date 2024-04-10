---
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 04/10/2024
 ms.author: cherylmc
---


|**Azure native certificate authentication**|**Deployment model/method** | **Azure portal** | **PowerShell** |
|---|---|---|---|
|| Resource Manager | [Tutorial](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-resource-manager-portal.md) | [How-to](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-rm-ps.md)|
|| Classic (legacy deployment model)| [How-to](../articles/vpn-gateway/vpn-gateway-howto-point-to-site-classic-azure-portal.md) | Supported |

|**Microsoft Entra ID authentication**|**Deployment model/method** | **Article** |
|---|---|---|
|First-party App ID - Linux|Resource Manager | [How-to](../articles/vpn-gateway/openvpn-azure-ad-tenant.md)|
|Third-party App ID - Windows, MacOS| Resource Manager |[How-to](../articles/vpn-gateway/openvpn-azure-ad-tenant.md)|


|**RADIUS authentication**|**Deployment model/method** | **Azure portal** | **PowerShell** |
|---|---|---|---|
|| Resource Manager | Supported | [How-to](../articles/vpn-gateway/point-to-site-how-to-radius-ps.md)|
|| Classic (legacy deployment model)| Not Supported | Not Supported |