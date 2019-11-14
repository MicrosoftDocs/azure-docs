---
title: 'About point-to-site VPN client profiles: Azure VPN Gateway| Microsoft Docs'
description: This helps you work with the client profile file
services: vpn-gateway
author: cherylmc

ms.service: vpn-gateway
ms.topic: article
ms.date: 11/04/2019
ms.author: cherylmc

---
# About P2S VPN client profiles

The downloaded profile file contains information that is necessary to configure a VPN connection. This article will help you obtain and understand the information necessary for a VPN client profile.

## 1. Download the file

Run the following commands. Copy the result URL to your browser in order to download the profile zip file.

```azurepowershell-interactive
$profile = New-AzVpnClientConfiguration -ResourceGroupName AADAuth -Name AADauthGW -AuthenticationMethod "EapTls"
   
$PROFILE.VpnProfileSASUrl
```

## 2. Extract the zip file

Extract the zip file. The file contains the following folders:

* AzureVPN
* Generic
* OpenVPN

## 3. Retrieve information

In the **AzureVPN** folder, navigate to the ***azurevpnconfig.xml*** file and open it with Notepad. Make a note of the text between the following tags.

```
<audience>          </audience>
<issuer>            </issuer>
<tennant>           </tennant>
<fqdn>              </fqdn>
<serversecret>      </serversecret>
```

## Profile details

When you add a connection, use the information you collected in the previous step for the profile details page. The fields correspond to the following information:

   * **Audience:** Identifies the recipient resource the token is intended for
   * **Issuer:** Identifies the Security Token Service (STS) that emitted the token as well as the Azure AD tenant
   * **Tenant:** Contains an immutable, unique identifier of the directory tenant that issued the token
   * **FQDN:** The fully qualified domain name (FQDN) on the Azure VPN gateway
   * **ServerSecret:** The VPN gateway preshared key

## Folder contents

* The **OpenVPN folder** contains the *ovpn* profile that needs to be modified to include the key and the certificate. For more information, see [Configure OpenVPN clients for Azure VPN Gateway](vpn-gateway-howto-openvpn-clients.md#windows).

* The **generic folder** contains the public server certificate and the VpnSettings.xml file. The VpnSettings.xml file contains information needed to configure a generic client.

* The downloaded zip file may also contain **WindowsAmd64** and **WindowsX86** folders. These folders contain the installer for SSTP and IKEv2 for Windows clients. You need admin rights on the client to install them.

## Next steps

For more information about point-to-site, see [About point-to-site](point-to-site-about.md).