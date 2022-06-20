---
title: 'P2S VPN client profile config files - Azure AD authentication'
titleSuffix: Azure VPN Gateway
description: Learn how to generate P2S VPN client profile configuration files for Azure AD authentication.
author: cherylmc
ms.service: vpn-gateway
ms.topic: how-to
ms.date: 05/04/2022
ms.author: cherylmc

---
# Generate P2S Azure VPN Client profile config files - Azure AD authentication

After you install the Azure VPN Client, you configure the VPN client profile. Client profile config files contain information that's necessary to configure a VPN connection. This article helps you obtain and understand the information needed to configure an Azure VPN Client profile for Azure VPN Gateway point-to-site configurations that use Azure AD authentication.

## <a name="generate"></a>Generate profile files

You can generate VPN client profile configuration files using PowerShell, or by using the Azure portal. Either method returns the same zip file.

### Portal

1. In the Azure portal, navigate to the virtual network gateway for the virtual network that you want to connect to.
1. On the virtual network gateway page, select **Point-to-site configuration**.
1. At the top of the point-to-site configuration page, select **Download VPN client**. It takes a few minutes for the client configuration package to generate.
1. Your browser indicates that a client configuration zip file is available. It's named the same name as your gateway. Unzip the file to view the folders.

### PowerShell

To generate using PowerShell, you can use the following example:

1. When generating VPN client configuration files, the value for '-AuthenticationMethod' is 'EapTls'. Generate the VPN client configuration files using the following command:

   ```azurepowershell-interactive
   $profile=New-AzVpnClientConfiguration -ResourceGroupName "TestRG" -Name "VNet1GW" -AuthenticationMethod "EapTls"

   $profile.VPNProfileSASUrl
   ```

1. Copy the URL to your browser to download the zip file, then unzip the file to view the folders.

## <a name="extract"></a>Extract the zip file

Extract the zip file. The file contains the following folders:

* **AzureVPN**: The AzureVPN folder contains the **Azurevpnconfig.xml** file.
* **Generic**: The generic folder contains the public server certificate and the VpnSettings.xml file. The VpnSettings.xml file contains information needed to configure a generic client

## <a name="get"></a>Retrieve file information

In the **AzureVPN** folder, navigate to the ***azurevpnconfig.xml*** file and open it with Notepad. Make a note of the text between the following tags. You may need this information later when configuring the Azure VPN Client.

```
<audience>          </audience>
<issuer>            </issuer>
<tennant>           </tennant>
<fqdn>              </fqdn>
<serversecret>      </serversecret>
```

## <a name="details"></a>Profile details

When you add a connection, use the information you collected in the previous step for the profile details page. The fields correspond to the following information:

* **Audience:** Identifies the recipient resource the token is intended for.
* **Issuer:** Identifies the Security Token Service (STS) that emitted the token, as well as the Azure AD tenant.
* **Tenant:** Contains an immutable, unique identifier of the directory tenant that issued the token.
* **FQDN:** The fully qualified domain name (FQDN) on the Azure VPN gateway.
* **ServerSecret:** The VPN gateway preshared key.

## Next steps

For more information about point-to-site, see [About point-to-site](point-to-site-about.md).
