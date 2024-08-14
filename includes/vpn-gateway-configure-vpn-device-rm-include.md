---
 title: Include file
 description: Include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 02/14/2019
 ms.author: cherylmc
 ms.custom: Include file
---

Depending on the VPN device that you have, you might be able to download a VPN device configuration script. For more information, see [Download VPN device configuration scripts](../articles/vpn-gateway/vpn-gateway-download-vpndevicescript.md).

The following links provide more configuration information:

- For information about compatible VPN devices, see [About VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md).

- Before you configure your VPN device, check for any [known device compatibility issues](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#known).

- For links to device configuration settings, see [Validated VPN devices](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#devicetable). We provide the device configuration links on a best-effort basis, but it's always best to check with your device manufacturer for the latest configuration information.

  The list shows the versions that we tested. If the OS version for your VPN device isn't on the list, it still might be compatible. Check with your device manufacturer.

- For basic information about VPN device configuration, see [Overview of partner VPN device configurations](../articles/vpn-gateway/vpn-gateway-3rdparty-device-config-overview.md).

- For information about editing device configuration samples, see [Editing samples](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#editing).

- For cryptographic requirements, see [About cryptographic requirements and Azure VPN gateways](../articles/vpn-gateway/vpn-gateway-about-compliance-crypto.md).

- For information about parameters that you need to complete your configuration, see [Default IPsec/IKE parameters](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#ipsec). The information includes IKE version, Diffie-Hellman (DH) group, authentication method, encryption and hashing algorithms, security association (SA) lifetime, perfect forward secrecy (PFS), and Dead Peer Detection (DPD).

- For IPsec/IKE policy configuration steps, see [Configure custom IPsec/IKE connection policies for S2S VPN and VNet-to-VNet](../articles/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell.md).

- To connect multiple policy-based VPN devices, see [Connect a VPN gateway to multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).
