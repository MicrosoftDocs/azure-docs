---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/11/2022
 ms.author: cherylmc
 ms.custom: include file

#Customer intent: this file is used for both virtual wan and vpn gateway articles.
---
> [!IMPORTANT]
> Only iOS 11.0 and above is supported with OpenVPN protocol.
>

1. Install the OpenVPN client (version 2.4 or higher) from the App store.
1. Download the VPN client profile package from the Azure portal, or use the 'New-AzVpnClientConfiguration' cmdlet in PowerShell.
1. Unzip the profile. Open the vpnconfig.ovpn configuration file from the OpenVPN folder in a text editor.
1. Fill in the P2S client certificate section with the P2S client certificate public key in base64. In a PEM formatted certificate, you can open the .cer file and copy over the base64 key between the certificate headers. Use the following article links for information about how to export a certificate to get the encoded public key:

   * [VPN Gateway](../articles/vpn-gateway/vpn-gateway-certificates-point-to-site.md#cer) instructions
   * [Virtual WAN](../articles/virtual-wan/certificates-point-to-site.md#cer) instructions

1. Fill in the private key section with the P2S client certificate private key in base64. See [Export your private key](https://openvpn.net/community-resources/how-to/#pki) on the OpenVPN site for information about how to extract a private key.
1. Don't change any other fields.
1. E-mail the profile file (.ovpn) to your email account that is configured in the mail app on your iPhone.
1. Open the e-mail in the mail app on the iPhone, and tap the attached file.

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/message-ready.png" alt-text="Screenshot shows message ready to be sent." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/message-ready.png":::

1. Tap **More** if you don't see **Copy to OpenVPN** option.

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/more.png" alt-text="Screenshot shows to tap more." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/more.png":::

1. Tap **Copy to OpenVPN**.

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/copy.png" alt-text="Screenshot shows to copy to OpenVPN." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/copy.png":::

1. Tap on **ADD** in the **Import Profile** page

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/import-profile.png" alt-text="Screenshot shows Import profile." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/import-profile.png":::

1. Tap on **ADD** in the **Imported Profile** page

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/imported-profile.png" alt-text="Screenshot shows Imported Profile." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/imported-profile.png":::

1. Launch the OpenVPN app and slide the switch in the **Profile** page right to connect

   :::image type="content" source="./media/vpn-gateway-vwan-config-openvpn-ios/connect.png" alt-text="Screenshot shows slide to connect." lightbox="./media/vpn-gateway-vwan-config-openvpn-ios/connect.png":::

