---
author: cherylmc
ms.service: azure-vpn-gateway
ms.topic: include
ms.date: 01/28/2025
ms.author: cherylmc
---

## Prerequisites

This article assumes that you've already performed the following prerequisites:

* You completed the necessary configuration steps in the [Tutorial: Create a P2S User VPN connection using Azure Virtual WAN](../articles/virtual-wan/virtual-wan-point-to-site-portal.md).
* You generated and downloaded the VPN client configuration files. The VPN client configuration files that you generate are specific to the Virtual WAN User VPN profile that you download. Virtual WAN has two different types of configuration profiles: WAN-level (global), and hub-level. For more information, see [Download global and hub VPN profiles](../articles/virtual-wan/global-hub-profile.md). If there are any changes to the P2S VPN configuration after you generate the files, or you change to a different profile type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect.
* You have acquired the necessary certificates. You can either [generate client certificates](../articles/virtual-wan/certificates-point-to-site.md), or acquire the appropriate client certificates necessary for authentication. Make sure you have both the client certificate and the root server certificate information.

### Connection requirements

To connect to Azure using the OpenVPN client using certificate authentication, each connecting client requires the following items:

* The Open VPN Client software must be installed and configured on each client.
* The client must have a client certificate that's installed locally.

### About certificates

For certificate authentication, you must install a client certificate on each client computer that you want to connect to the VPN gateway. The client certificate you want to use must be exported with the private key, and must contain all certificates in the certification path. Additionally, for some configurations, you'll also need to install root certificate information.

The OpenVPN client in this article uses certificates exported with a *.pfx* format. You can export a client certificate easily to this format using the Windows instructions. See [Generate and export certificates for User VPN connections](../articles/virtual-wan/certificates-point-to-site.md). If you don't have a Windows computer, as a workaround, you can use a small Windows VM to export certificates to the needed *.pfx* format.