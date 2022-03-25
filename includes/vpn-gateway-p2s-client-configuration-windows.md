---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 07/12/2021
 ms.author: cherylmc

---
You can use the same VPN client configuration package on each Windows client computer, as long as the version matches the architecture for the client. For the list of client operating systems that are supported, see the Point-to-Site section of the [VPN Gateway FAQ](../articles/vpn-gateway/vpn-gateway-vpn-faq.md#P2S).

>[!NOTE]
>You must have Administrator rights on the Windows client computer from which you want to connect.
>

### Install the configuration files

1. Select the VPN client configuration files that correspond to the architecture of the Windows computer. For a 64-bit processor architecture, choose the 'VpnClientSetupAmd64' installer package. For a 32-bit processor architecture, choose the 'VpnClientSetupX86' installer package. 
1. Double-click the package to install it. If you see a SmartScreen popup, click **More info**, then **Run anyway**.

### Verify and connect

1. Verify that you have installed a client certificate on the client computer. A client certificate is required for authentication when using the native Azure certificate authentication type. To view the client certificate, open **Manage User Certificates**. The client certificate is installed in **Current User\Personal\Certificates**.
1. To connect, navigate to **Network Settings** and click **VPN**. The VPN connection shows the name of the virtual network that it connects to.

### Use PowerShell to install VPN configuration

>[!NOTE]
>Administrator rights is NOT required. It's very useful when the computer is join the domain.


1. Verify that you have installed a client certificate on the client computer.
1. If you found "Generic" Folder, use notepad to open **VpnSettings.xml** and note the value in **'Auth'** field. If the "Generic" Folder not found, note the Auth of VPN is PPTP.
1. UNZIP 'VpnClientSetupAmd64' installer package or 'VpnClientSetupX86' installer package (you can use decompression software like 7-zip to unzip it), then use notepad to open the file extension name called **cms**, note the value in **'TunnelAddress'** field, it's the Tunnel Address of VPN. If you found 'routes.txt' in the same directory, open it, note the route table and change to CIDR format.
1. open Windows PowerShell (NOT 'Windows PowerShell (Administrator)' ), and run this shell.

```
# Authentication Method is certificate
# If you don't need link to Internet or another VPN, del '-SplitTunneling' parameter 
# If you don't need Remember Credential, del '-parameter' parameter 

Add-VpnConnection \
-Name [the name of VPN] \
-ServerAddress [Tunnel Address of VPN, you noted it in step 3] \
-TunnelType [Auth of VPN, you noted it in step 2] \
-AuthenticationMethod Eap -EapConfigXmlStream (New-EapConfiguration -Tls -VerifyServerIdentity -UserCertificate).EapConfigXmlStream \
-SplitTunneling \
-RememberCredential

# If 'routes.txt' has multiple route table, add it one by one

Add-VpnConnectionRoute \
-ConnectionName [the name of VPN] \
-DestinationPrefix [the route table in CIDR format]
```

1. To connect, navigate to **Network Settings** and click **VPN**. The VPN connection shows the name of the name of VPN that it connects to.
