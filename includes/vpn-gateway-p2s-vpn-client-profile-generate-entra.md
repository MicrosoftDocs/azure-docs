---
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 03/22/2024
 ms.author: cherylmc
---
## <a name="generate"></a>Generate profile configuration files

You can generate VPN client profile configuration files either with PowerShell, or the Azure portal. Either method returns the same zip file.

### Azure portal

[!INCLUDE [Generate profile configuration files - Azure portal](vpn-gateway-generate-profile-portal.md)]

### PowerShell

To generate the VPN client profile configuration files using PowerShell, you can use the following example:

[!INCLUDE [Generate profile configuration files - PowerShell](vpn-gateway-generate-profile-powershell.md)]

## <a name="extract"></a>Extract the zip file

Extract the zip file. The file contains the following folders:

* **AzureVPN**: The AzureVPN folder contains the **Azurevpnconfig.xml** file that is used to configure the Azure VPN Client.
* **Generic**: The generic folder contains the public server certificate and the VpnSettings.xml file. The VpnSettings.xml file contains information needed to configure a generic client

## <a name="get"></a>Retrieve file information

In the **AzureVPN** folder, go to the ***azurevpnconfig.xml*** file and open it with Notepad. Make a note of the text between the following tags. This information is used later when configuring the Azure VPN Client.

```
<audience>          </audience>
<issuer>            </issuer>
<tenant>            </tenant>
<fqdn>              </fqdn>
<serversecret>      </serversecret>
```

## <a name="details"></a>Profile details

When you add a connection, use the information you collected in the previous step for the profile details page. The fields correspond to the following information:

* **Audience:** Identifies the recipient resource the token is intended for.
* **Issuer:** Identifies the Security Token Service (STS) that emitted the token, and the Microsoft Entra tenant.
* **Tenant:** Contains an immutable, unique identifier of the directory tenant that issued the token.
* **FQDN:** The fully qualified domain name (FQDN) on the Azure VPN gateway.
* **ServerSecret:** The VPN gateway preshared key.