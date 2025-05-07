---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.topic: include
 ms.date: 04/29/2022
 ms.author: cherylmc
 ms.custom: include file
---

Depending on the VPN device that you have, you might be able to download a VPN device configuration script. For more information, see [Download VPN device configuration scripts](../articles/vpn-gateway/vpn-gateway-download-vpndevicescript.md).

For more configuration information, see the following links:

- For information about compatible VPN devices, see [VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md).
- For links to device configuration settings, see [Validated VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#devicetable). The device configuration links are provided on a best-effort basis. It's always best to check with your device manufacturer for the latest configuration information. The list shows the versions we've tested. If your OS isn't on that list, it's still possible that the version is compatible. Check with your device manufacturer to verify that the OS version for your VPN device is compatible.
- For an overview of VPN device configuration, see [Overview of third-party VPN device configurations](../articles/vpn-gateway/vpn-gateway-3rdparty-device-config-overview.md).
- For information about editing device configuration samples, see [Editing samples](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#editing).
- For cryptographic requirements, see [About cryptographic requirements and Azure VPN gateways](../articles/vpn-gateway/vpn-gateway-about-compliance-crypto.md).
- For information about IPsec/IKE parameters, see [About VPN devices and IPsec/IKE parameters for site-to-site VPN gateway connections](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec). This link shows information about IKE version, Diffie-Hellman Group, authentication method, encryption and hashing algorithms, SA lifetime, PFS, and DPD, in addition to other parameter information that you need to complete your configuration.
- For IPsec/IKE policy configuration steps, see [Configure IPsec/IKE policy for site-to-site VPN or VNet-to-VNet connections](../articles/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell.md).
- To connect multiple policy-based VPN devices, see [Connect Azure VPN gateways to multiple on-premises policy-based VPN devices using PowerShell](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).
