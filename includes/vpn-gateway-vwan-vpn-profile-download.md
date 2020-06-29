---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 05/13/2020
 ms.author: cherylmc
 ms.custom: include file

#intent: this file is used for both virtual wan and vpn gateway articles
---
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
* OpenVPN (If you have enabled the OpenVPN and Azure AD authentication settings on the gateway). For VPN Gateway, see [Create a tenant](../articles/vpn-gateway/openvpn-azure-ad-tenant.md). For Virtual WAN, see [Create a tenant - VWAN](../articles/virtual-wan/openvpn-azure-ad-tenant.md).

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

* The **generic folder** contains the public server certificate and the VpnSettings.xml file. The VpnSettings.xml file contains information needed to configure a generic client.

* The downloaded zip file may also contain **WindowsAmd64** and **WindowsX86** folders. These folders contain the installer for SSTP and IKEv2 for Windows clients. You need admin rights on the client to install them.
