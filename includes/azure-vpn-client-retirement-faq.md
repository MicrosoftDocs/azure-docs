---
author: flapinski
ms.author: flapinski
ms.date: 05/27/2026
ms.service: azure-vpn-gateway
ms.topic: include
---
### When is the Azure VPN Client for Linux being retired?

The retirement date is August 31, 2026. Microsoft will no longer support the client for VPN gateway P2S connections after this date.

### Why is the Azure VPN Client for Linux being retired?

The Azure VPN Client for Linux remained in public preview without a path to general availability. To align with Microsoft's security and reliability standards, the preview client is being retired.

### What happens if I keep using the Azure VPN Client for Linux after August 31, 2026?

After the retirement date, the client will no longer be supported. While existing installations may continue to function for some period, Microsoft will provide no bug fixes, security patches, or support. The package is also being removed from the Microsoft Linux repository. You shouldn't rely on it for production connectivity.

### Does this retirement affect the Azure VPN Client on Windows or macOS?

No. The [Azure VPN Client for Windows and macOS](../articles/vpn-gateway/azure-vpn-client-versions.md) are generally available and aren't affected by this retirement.

### Does this retirement affect my VPN gateway or site-to-site VPN?

No. Only the Linux preview client application is being retired. Your VPN gateway, P2S gateway configuration, and any S2S connections are unaffected.

### Does Microsoft Entra ID (AAD) authentication work with the alternative Linux clients?

No. The OpenVPN and strongSwan open-source clients don't support Microsoft Entra ID (AAD) with the Azure VPN P2S gateway. Microsoft Entra ID authentication on Linux was only available through the Azure VPN Client for Linux.  

If you require Microsoft Entra ID authentication for Linux users, you'll need to evaluate alternative approaches such as certificate-based authentication or connecting via a Windows/macOS client that supports Microsoft Entra ID.

### Do I need to change my VPN gateway configuration?

It depends on your current tunnel type setting and authentication method. If your gateway is configured for OpenVPN only with certificates, you can switch to the open-source OpenVPN client with no gateway changes.  

If you want to use strongSwan, you need to ensure IKEv2 is enabled on the gateway. You can enable multiple tunnel types (for example, IKEv2 and OpenVPN) on the same gateway simultaneously.

You'll also need to enable [certificate](../articles/vpn-gateway/point-to-site-certificate-gateway.md) or [RADIUS authentication](../articles/vpn-gateway/point-to-site-radius-gateway.md) if your gateway currently supports Microsoft Entra ID (AAD) authentication only.

### Will the Microsoft Azure VPN Client for Linux package continue to be available for download?

The package is in the process of being removed from Microsoft's Linux software repository. Customers should plan to uninstall it and transition to an alternative before August 31, 2026.

### What are my alternatives for connecting from Linux?

Two fully supported options exist:

* OpenVPN client - uses the OpenVPN tunnel type with [certificate authentication](../articles/vpn-gateway/point-to-site-vpn-client-certificate-openvpn-linux.md). Works broadly across Linux distributions.
* strongSwan - uses the IKEv2 tunnel type with [certificate authentication](../articles/vpn-gateway/point-to-site-vpn-client-certificate-ike-linux.md) or [RADIUS authentication](../articles/vpn-gateway/point-to-site-vpn-client-configuration-radius-password.md#linux-vpn-client---strongswan). Works on a wide range of Linux distributions.

Both support more Linux distributions than the preview client did (which was limited to Ubuntu 20.04 and 22.04).