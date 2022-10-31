---
title: 'Configure P2S VPN clients -certificate authentication - Linux'
titleSuffix: Azure VPN Gateway
description: Learn how to configure a Linux VPN client solution for VPN Gateway P2S configurations that use certificate authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 07/29/2022
ms.author: cherylmc
---

# Configure point-to-site VPN clients - certificate authentication - Linux

When you connect to an Azure virtual network (VNet) using point-to-site (P2S) and certificate authentication from a Linux computer, you can use strongSwan (IKEv2 tunnels) or an OpenVPN client. All of the necessary configuration settings for the VPN clients are contained in a VPN client configuration zip file. The settings in the zip file help you easily configure the VPN clients Linux.

The VPN client configuration files that you generate are specific to the P2S VPN gateway configuration for the virtual network. If there are any changes to the P2S VPN configuration after you generate the files, such as changes to the VPN protocol type or authentication type, you need to generate new VPN client configuration files and apply the new configuration to all of the VPN clients that you want to connect. For more information about P2S connections, see [About point-to-site VPN](point-to-site-about.md).

## Before you begin

Before beginning, verify that you are on the correct article. The following table shows the configuration articles available for Azure VPN Gateway P2S VPN clients. Steps differ, depending on the authentication type, tunnel type, and the client OS.

[!INCLUDE [All client articles](../../includes/vpn-gateway-vpn-client-install-articles.md)]

## Generate VPN client configuration files

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

### Generate files using the Azure portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration** to open the Point-to-site configuration page.
1. At the top of the Point-to-site configuration page, select **Download VPN client**. This doesn't download VPN client software, it generates the configuration package used to configure VPN clients. It takes a few minutes for the client configuration package to generate. During this time, you may not see any indications until the packet has generated.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-mac/download-configuration.png" alt-text="Download the VPN client configuration." lightbox="./media/point-to-site-vpn-client-cert-mac/download-configuration.png":::
1. Once the configuration package has been generated, your browser indicates that a client configuration zip file is available. It's named the same name as your gateway.

### Generate files using PowerShell

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file.

### View the folder and files

Unzip the file to view the following folders:

* **WindowsAmd64** and **WindowsX86**, which contain the Windows 32-bit and 64-bit installer packages, respectively. The **WindowsAmd64** installer package is for all supported 64-bit Windows clients, not just Amd.
* **Generic**, which contains general information used to create your own VPN client configuration. The Generic folder is provided if IKEv2 or SSTP+IKEv2 was configured on the gateway. If only SSTP is configured, then the Generic folder isn’t present.

## Select the configuration instructions

The sections below contain instructions to help you configure your VPN client. Select the tunnel type that your P2S configuration uses, then select the method that you want to use to configure.

* [IKEv2 tunnel type steps](#ike) for strongSwan
* [OpenVPN tunnel type steps](#openvpn) for OpenVPN client

## <a name="ike"></a>IKEv2 - strongSwan steps

### Install strongSwan

[!INCLUDE [Install strongSwan](../../includes/vpn-gateway-strongswan-install-include.md)]

### Install certificates

A client certificate is required for authentication when using the Azure certificate authentication type. A client certificate must be installed on each client computer. The exported client certificate must be exported with the private key, and must contain all certificates in the certification path. Make sure that the client computer has the appropriate client certificate installed before proceeding to the next section.

For information about client certificates, see [Generate certificates - Linux](vpn-gateway-certificates-point-to-site-linux.md).

### View VPN client profile files

Go to the downloaded VPN client profile configuration files. You can find all of the information that you need for configuration in the **Generic** folder. Azure doesn’t provide a *mobileconfig* file for this configuration.

If you don't see the Generic folder, check the following items, then generate the zip file again.

* Check the tunnel type for your configuration. It's likely that IKEv2 wasn’t selected as a tunnel type.
* On the VPN gateway, verify that the SKU isn’t Basic. The VPN Gateway Basic SKU doesn’t support IKEv2. Then, select IKEv2 and generate the zip file again to retrieve the Generic folder.

The Generic folder contains the following files:

* **VpnSettings.xml**, which contains important settings like server address and tunnel type.
* **VpnServerRoot.cer**, which contains the root certificate required to validate the Azure VPN gateway during P2S connection setup.

After viewing the files, continue with the steps that you want to use:

* [GUI steps](#gui)
* [CLI steps](#cli)

#### <a name="gui"></a>strongSwan GUI instructions

This section walks you through the configuration using the strongSwan GUI. The following instructions were created on Ubuntu 18.0.4. Ubuntu 16.0.10 doesn’t support strongSwan GUI. If you want to use Ubuntu 16.0.10, you’ll have to use the [command line](#cli). The following examples may not match screens that you see, depending on your version of Linux and strongSwan.

1. Open the **Terminal** to install **strongSwan** and its Network Manager by running the command in the example.

   ```
   sudo apt install network-manager-strongswan
   ```
1. Select **Settings**, then select **Network**. Select the **+** button to create a new connection.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/edit-connections.png" alt-text="Screenshot shows the network connections page." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/edit-connections.png":::

1. Select **IPsec/IKEv2 (strongSwan)** from the  menu, and double-click.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/add-connection.png" alt-text="Screenshot shows the Add VPN page." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/add-connection.png":::

1. On the **Add VPN** page, add a name for your VPN connection.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/choose-type.png" alt-text="Screenshot shows Choose a connection type." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/choose-type.png":::

1. Open the **VpnSettings.xml** file from the **Generic** folder contained in the downloaded VPN client profile configuration files. Find the tag called **VpnServer** and copy the name, beginning with 'azuregateway' and ending with '.cloudapp.net'.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/vpn-server.png" alt-text="Screenshot shows copy data." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/vpn-server.png":::

1. Paste the name in the **Address** field of your new VPN connection in the **Gateway** section. Next, select the folder icon at the end of the **Certificate** field, browse to the **Generic** folder, and select the **VpnServerRoot** file.

1. In the **Client** section of the connection, for **Authentication**, select **Certificate/private key**. For **Certificate** and **Private key**, choose the certificate and the private key that were created earlier. In **Options**, select **Request an inner IP address**. Then, select **Add**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/ip-request.png" alt-text="Screenshot shows Request an inner IP address." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/ip-request.png":::

1. Turn the connection **On**.

   :::image type="content" source="./media/point-to-site-vpn-client-cert-linux/turn-on.png" alt-text="Screenshot shows copy." lightbox="./media/point-to-site-vpn-client-cert-linux/expanded/turn-on.png":::

#### <a name="cli"></a>strongSwan CLI instructions

This section walks you through the configuration using the strongSwan CLI.

1. From the VPN client profile configuration files **Generic** folder, copy or move the **VpnServerRoot.cer** to **/etc/ipsec.d/cacerts**.

1. Copy or move **cp client.p12** to **/etc/ipsec.d/private/**. This file is the client certificate for the VPN gateway.

1. Open the **VpnSettings.xml** file and copy the `<VpnServer>` value. You’ll use this value in the next step.

1. Adjust the values in the following example, then add the example to the **/etc/ipsec.conf** configuration.
  
   ```cli
   conn azure
         keyexchange=ikev2
         type=tunnel
         leftfirewall=yes
         left=%any
         leftauth=eap-tls
         leftid=%client # use the DNS alternative name prefixed with the %
         right= Enter the VPN Server value here# Azure VPN gateway address
         rightid=% # Enter the VPN Server value here# Azure VPN gateway FQDN with %
         rightsubnet=0.0.0.0/0
         leftsourceip=%config
         auto=add
   ```

1. Add the following values to **/etc/ipsec.secrets**.

   ```cli
   : P12 client.p12 'password' # key filename inside /etc/ipsec.d/private directory
   ```

1. Run the following commands:

   ```cli
   # ipsec restart
   # ipsec up azure
   ```

## <a name="openvpn"></a>OpenVPN tunnel type steps

This section helps you configure Linux clients for certificate authentication that uses the OpenVPN tunnel type. To connect to Azure, download the OpenVPN client and configure the connection profile.

[!INCLUDE [Configuration steps for OpenVPN Linux](../../includes/vpn-gateway-config-openvpn-linux.md)]

## Next steps

For additional steps, return to the original point-to-site article that you were working from.

* [P2S Azure portal steps](vpn-gateway-howto-point-to-site-resource-manager-portal.md).
* [P2S PowerShell steps](vpn-gateway-howto-point-to-site-rm-ps.md).
