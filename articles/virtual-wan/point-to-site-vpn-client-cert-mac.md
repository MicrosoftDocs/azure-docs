---
title: 'Configure P2S User VPN clients -certificate authentication - macOS and iOS'
titleSuffix: Azure Virtual WAN
description: Learn how to configure the VPN client for Virtual WAN User VPN configurations that use certificate authentication and IKEv2 or OpenVPN tunnel. This article applies to macOS and iOS.
author: cherylmc
ms.service: virtual-wan
ms.topic: how-to
ms.date: 04/28/2023
ms.author: cherylmc
---

# Configure User VPN P2S clients - certificate authentication - macOS and iOS

This article helps you connect to Azure Virtual WAN from a macOS or iOS operating system over User VPN P2S for configurations that use Certificate Authentication. To connect from an iOS or macOS operating system over an OpenVPN tunnel, you use an OpenVPN client. To connect from a macOS operating system over an IKEv2 tunnel, you use the VPN client that is natively installed on your Mac.

## Before you begin

* Make sure you've completed the necessary configuration steps in the [Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).

* **Generate VPN client configuration files:** The VPN client configuration files that you generate are specific to the Virtual WAN User VPN profile that you download. Virtual WAN has two different types of configuration profiles: WAN-level (global), and hub-level. If there are any changes to the P2S VPN configuration after you generate the files, or you change to a different profile type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect. See [Generate User VPN client configuration files](about-vpn-profile-download.md).

* **Obtain certificates:** The sections below require certificates. Make sure you have both the client certificate and the root server certificate information. For more information, see [Generate and export certificates](certificates-point-to-site.md) for more information.

## <a name="ikev2-macOS"></a>IKEv2 - native client - macOS steps

[!INCLUDE [IKEv2 Native client Mac](../../includes/virtual-wan-certificates-mac-native-client-include.md)]

##  <a name="openvpn-macOS"></a>OpenVPN Client - macOS steps

The following example uses **TunnelBlick**.

[!INCLUDE [OpenVPN Mac](../../includes/vpn-gateway-vwan-config-openvpn-mac.md)]

##  <a name="OpenVPN-iOS"></a>OpenVPN Client - iOS steps

The following example uses **OpenVPN Connect** from the App store.

[!INCLUDE [OpenVPN iOS](../../includes/vpn-gateway-vwan-config-openvpn-ios.md)]

## Next steps

[Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](virtual-wan-point-to-site-portal.md).
