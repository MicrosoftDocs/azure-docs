---
 title: include file
 description: include file
 services: virtual-wan
 author: cherylmc
 ms.service: virtual-wan
 ms.topic: include
 ms.date: 10/06/2020
 ms.author: cherylmc
 ms.custom: include file
---

#### Microsoft Windows

##### OpenVPN

1. Download and install the OpenVPN client from the official website.
1. Download the VPN profile for the gateway. This can be done from the User VPN configurations tab in Azure portal, or New-AzureRmVpnClientConfiguration in PowerShell.
1. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in notepad.
1. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can open the .cer file and copy over the base64 key between the certificate headers. For steps, see [How to export a certificate to get the encoded public key.](../articles/virtual-wan/certificates-point-to-site.md)
1. Fill in the private key section with the P2S client certificate private key in base64. For steps, see [How to extract private key.](../articles/virtual-wan/howto-openvpn-clients.md#windows).
1. Do not change any other fields. Use the filled in configuration in client input to connect to the VPN.
1. Copy the vpnconfig.ovpn file to C:\Program Files\OpenVPN\config folder.
1. Right-click the OpenVPN icon in the system tray and select **connect**.

##### IKEv2

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package.
1. Double-click the package to install it. If you see a SmartScreen popup, select **More info**, then **Run anyway**.
1. On the client computer, navigate to **Network Settings** and select **VPN**. The VPN connection shows the name of the virtual network that it connects to.
1. Before you attempt to connect, verify that you have installed a client certificate on the client computer. A client certificate is required for authentication when using the native Azure certificate authentication type. For more information about generating certificates, see [Generate Certificates](../articles/virtual-wan/certificates-point-to-site.md). For information about how to install a client certificate, see [Install a client certificate](../articles/vpn-gateway/point-to-site-how-to-vpn-client-install-azure-cert.md).
