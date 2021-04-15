---
title: 'Azure VPN Gateway: About P2S VPN client profiles'
description: Use this article to find the information you need for a VPN client profile.
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: how-to
ms.date: 02/08/2021
ms.author: cherylmc

---
# Working with P2S VPN client profile files

The profile files contain information that is necessary to configure a VPN connection. This article will help you obtain and understand the information necessary for a VPN client profile.

## Generate and download profile

You can generate client configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

### Portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration**.
1. At the top of the Point-to-site configuration page, select **Download VPN client**. It takes a few minutes for the client configuration package to generate.
1. Your browser indicates that a client configuration zip file is available. It is named the same name as your gateway. Unzip the file to view the folders.

### PowerShell

To generate using PowerShell, you can use the following example:

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

[!INCLUDE [client profiles](../../includes/vpn-gateway-vwan-vpn-profile-download.md)]

* The **OpenVPN folder** contains the *ovpn* profile that needs to be modified to include the key and the certificate. For more information, see [Configure OpenVPN clients for Azure VPN Gateway](vpn-gateway-howto-openvpn-clients.md#windows). If Azure AD authentication is selected on the VPN gateway, this folder is not present in the zip file. Instead, navigate to the AzureVPN folder and locate azurevpnconfig.xml.

## Next steps

For more information about point-to-site, see [About point-to-site](point-to-site-about.md).
