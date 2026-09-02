---
author: flapinski
ms.author: flapinski
ms.date: 05/27/2026
ms.service: azure-vpn-gateway
ms.topic: include
---
### When was the Azure VPN Client for Linux retired?

The Azure VPN Client for Linux retired on August 31, 2026. Microsoft no longer supports the client for VPN Gateway Point-to-Site (P2S) connections.

### Why was the Azure VPN Client for Linux retired?

The Azure VPN Client for Linux remained in public preview throughout its lifecycle and didn't have a path to general availability. To align with Microsoft's security and reliability standards, Microsoft retired the preview client.

### What happens if I keep using the Azure VPN Client for Linux after August 31, 2026?

The client is no longer supported. While existing installations might continue to function, Microsoft no longer provides bug fixes, security patches, or technical support. The package is also removed from the Microsoft Linux repository. Don't rely on it for production connectivity.

### Does this retirement affect the Azure VPN Client on Windows or macOS?

No. The [Azure VPN Client for Windows and macOS](../articles/vpn-gateway/azure-vpn-client-versions.md) are generally available and aren't affected by this retirement.

### Does this retirement affect my VPN gateway or site-to-site VPN?

No. Only the Linux preview client application was retired. Your VPN Gateway, P2S gateway configuration, and any Site-to-Site (S2S) VPN connections remain unaffected.

### Does Microsoft Entra ID (AAD) authentication work with the alternative Linux clients?

No. The OpenVPN and strongSwan open-source clients don't support Microsoft Entra ID (AAD) authentication with Azure VPN Gateway P2S connections. Microsoft Entra ID authentication on Linux was only available through the Azure VPN Client for Linux.

If you require Microsoft Entra ID authentication for Linux users, you need to evaluate alternative approaches such as certificate-based authentication or connecting through a Windows or macOS client that supports Microsoft Entra ID authentication.

### Did Azure VPN Client for Linux support User Groups and IP address pools for Point-to-Site configurations?

No. User Groups and IP address pools for Point-to-Site configurations weren't supported on the Linux VPN client.

### Do I need to change my VPN gateway configuration?

It depends on your current tunnel type setting and authentication method. If your gateway is configured for OpenVPN only with certificates, you can migrate to the open-source OpenVPN client without changing the gateway configuration.

If you choose to use strongSwan, ensure that IKEv2 is enabled on the gateway. You can enable multiple tunnel types, such as IKEv2 and OpenVPN, simultaneously on the same gateway.

If your gateway was configured to use Microsoft Entra ID (AAD) authentication only, you need to configure an alternative authentication method, such as [certificate](../articles/vpn-gateway/point-to-site-certificate-gateway.md) or [RADIUS authentication](../articles/vpn-gateway/point-to-site-radius-gateway.md), for Linux clients.

### Is the Microsoft Azure VPN Client for Linux package still available for download?

No. The package has been removed from Microsoft's Linux software repository. Use one of the supported alternatives for Linux connectivity.

### What are the supported alternatives for connecting from Linux?

The following supported options are available:

* OpenVPN client - uses the OpenVPN tunnel type with [certificate authentication](../articles/vpn-gateway/point-to-site-vpn-client-certificate-openvpn-linux.md). Works across a broad range of Linux distributions.
* strongSwan - uses the IKEv2 tunnel type with [certificate authentication](../articles/vpn-gateway/point-to-site-vpn-client-certificate.md?pivots=linux#strongswan) or [RADIUS authentication](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md#linux-vpn-client---strongswan). Works on a wide range of Linux distributions.

Both options support more Linux distributions than the preview client, which was limited to Ubuntu 20.04 and 22.04.
