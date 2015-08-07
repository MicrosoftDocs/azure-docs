<properties 
   pageTitle="About VPN Devices for site-to-site Azure Virtual Network connections | Microsoft Azure"
   description="Learn about VPN devices and IPsec parameters for Azure Virtual Network site-to-site VPN Gateway connections."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carolz"
   editor="tysonn" />
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="08/07/2015"
   ms.author="cherylmc" />

# About VPN devices for site-to-site virtual network connections

A VPN device is required in order to configure a site-to-site VPN connection. Site-to-site connections can be used to create a hybrid cloud solution, or whenever you want a secure connection between your on-premises network and your virtual network. This article discusses compatible VPN devices and configuration parameters. 

It's important to know that, in addition to a compatible VPN device, site-to-site connections also require a public-facing IPv4 IP address. Additionally, you'll want to select the gateway type that will support your solution. Not all VPN devices support all gateway types. See [VPN gateways](vpn-gateway-about-vpngateways.md) to verify the type of gateway that you need to create your solution.                                                                                                                                                                                



## VPN devices

We have validated a set of standard site-to-site (S2S) VPN devices in partnership with device vendors. For a list of the VPN devices that are known to be compatible with Virtual Network, see the [Compatible VPN devices](#compatible-vpn-devices) section, below. All devices in the device families contained in this list should work with Azure VPN gateways. To help configure your VPN device, refer to the device configuration sample that corresponds to appropriate device family.

The specifications for High Performance VPN gateway and Dynamic Routing VPN gateway are the same unless otherwise noted. For example, the validated VPN devices that are compatible with Azure Dynamic Routing VPN gateways will also be compatible with the new Azure High Performance VPN gateway.


### Compatible VPN devices

We have worked with VPN device vendors to jointly qualify specific VPN device families. The section below provides a list of all device families known to work with our VPN gateway. All devices that are members of the listed device families are known to work unless exceptions are mentioned. If your device does not appear on the list, see [Devices not on the compatible list](#devices-not-on-the-compatible-list).



For VPN device support, please contact your device manufacturer.



| **Vendor**                      | **Device family**                                        | **Minimum OS version**                             | **Static Routing**                                                                                                                                                                                                             | **Dynamic Routing**                                                                                                                                                                    |
|---------------------------------|----------------------------------------------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Allied Telesis                  | AR Series VPN Routers                                    | 2.9.2                                              | Coming soon                                                                                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |
| Barracuda Networks, Inc.        | Barracuda NG Firewall                 | Barracuda NG Firewall 5.4.3  | [Barracuda NG Firewall](https://techlib.barracuda.com/display/BNGV54/How%20to%20Configure%20an%20IPsec%20Site-to-Site%20VPN%20to%20a%20Windows%20Azure%20VPN%20Gateway)| Not compatible                                                                                                                                                                                               |
| Barracuda Networks, Inc.        |  Barracuda Firewall                 | Barracuda Firewall 6.5 | [Barracuda Firewall](https://techlib.barracuda.com/BFW/ConfigAzureVPNGateway) | Not compatible                                                                                                                                                                                               |
| Brocade                         | Vyatta 5400 vRouter                                      | Virtual Router 6.6R3 GA                            | [Configuration instructions](http://www1.brocade.com/downloads/documents/html_product_manuals/vyatta/vyatta_5400_manual/wwhelp/wwhimpl/js/html/wwhelp.htm#href=VPN_Site-to-Site%20IPsec%20VPN/Preface.1.1.html)                                       | Not compatible                                                                                                                                                                                               |
| Check Point                     | Security Gateway                                         | R75.40, R75.40VS                                     | [Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275)                                         | [Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |
| Cisco                           | ASA                                                      | 8.3                                                | [Cisco ASA samples](https://msdn.microsoft.com/library/azure/dn133793.aspx)                                                                                                                                                                        | Not compatible                                                                                                                                                                                               |
| Cisco                           | ASR                                                      | IOS 15.1 (static),  IOS 15.2 (dynamic)                | [Cisco ASR samples](https://msdn.microsoft.com/library/azure/dn133802.aspx)                                                                                                                                                                        | [Cisco ASR samples](https://msdn.microsoft.com/library/azure/dn133802.aspx)                                                                                                                                 |
| Cisco                           | ISR                                                      | IOS 15.0 (static),  IOS 15.1 (dynamic)               | [Cisco ISR samples](https://msdn.microsoft.com/library/azure/dn133800.aspx)                                                                                                                                                                        | [Cisco ISR samples](https://msdn.microsoft.com/library/azure/dn133800.aspx)                                                                                                                                |
| Citrix                          | CloudBridge MPX appliance, or VPX virtual appliance       | N/A                                                | [Integration instructions](https://www.citrix.com/welcome.html?resource=%2Fdownloads%2Fcloudbridge%2Fbetas-and-tech-previews%2Fcloudbridge-azure-integration)                                                                                                                                                                            | Not compatible                                                                                                                                                                                               |
| Dell SonicWALL                  | TZ Series,  NSA Series,  SuperMassive Series,  E-Class NSA Series | SonicOS 5.8.x, SonicOS 5.9.x, SonicOS 6.x          | [Configuration instructions](https://www.sonicwall.com/app/projects/file_downloader/document_lib.php?t=TN&id=348)                                                                                                                                    | Not compatible                                                                                                                                                                                               |
| F5                              | BIG-IP series                                            | N/A                                                | [Configuration instructions](https://devcentral.f5.com/articles/connecting-to-windows-azure-with-the-big-ip)                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |
| Fortinet                        | FortiGate                                                | FortiOS 5.0.7                                      | [Configuration instructions](http://docs.fortinet.com/fortigate/admin-guides)                                                                                                                                                                          | [Configuration instructions](http://docs.fortinet.com/fortigate/admin-guides)                                                                                                                                  |
| Internet Initiative Japan (IIJ) | SEIL Series                                              | SEIL/X 4.60, SEIL/B1 4.60, SEIL/x86 3.20            | [Configuration instructions](http://www.iij.ad.jp/biz/seil/ConfigAzureSEILVPN.pdf)                                                                                                                                                                   | Not compatible                                                                                                                                                                                               |
| Juniper                         | SRX                                                      | JunOS 10.2 (static),  JunOS 11.4 (dynamic)            | [Juniper SRX samples](https://msdn.microsoft.com/library/azure/dn133794.aspx)                                                                                                                                                                      | [Juniper SRX samples](https://msdn.microsoft.com/library/azure/dn133794.aspx)                                                                                                                              |
| Juniper                         | J-Series                                                 | JunOS 10.4r9 (static),  JunOS 11.4 (dynamic)          | [Juniper J-series samples](https://msdn.microsoft.com/library/azure/dn133799.aspx)                                                                                                                                                                 | [Juniper J-series samples](https://msdn.microsoft.com/library/azure/dn133799.aspx)                                                                                                                         |
| Juniper                         | ISG                                                      | ScreenOS 6.3 (static and dynamic)                  | [Juniper ISG samples](https://msdn.microsoft.com/library/azure/dn133797.aspx)                                                                                                                                                                      | [Juniper ISG samples](https://msdn.microsoft.com/library/azure/dn133797.aspx)                                                                                                                              |
| Juniper                         | SSG                                                      | ScreenOS 6.2 (static and dynamic)                  | [Juniper SSG samples](https://msdn.microsoft.com/library/azure/dn133796.aspx)                                                                                                                                                                      | [Juniper SSG samples](https://msdn.microsoft.com/library/azure/dn133796.aspx)                                                                                                                              |
| Microsoft                       | Routing and Remote Access Service                        | Windows Server 2012                                | Not compatible                                                                                                                                                                                                                                       | [Routing and Remote Access Service (RRAS) samples](https://msdn.microsoft.com/library/azure/dn133801.aspx)                                                                                           |
| Openswan                        | Openswan                                                 | 2.6.32                                             | (Coming soon)                                                                                                                                                                                                                                        | Not compatible                                                                                                                                                                                               |
| Palo Alto Networks              | All devices running PAN-OS 5.0 or greater                | PAN-OS 5x or greater                               | [Palo Alto Networks](https://support.paloaltonetworks.com/)                                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |
| Watchguard                      | All                                                      | Fireware XTM v11.x                                 | [Configuration instructions](http://customers.watchguard.com/articles/Article/Configure-a-VPN-connection-to-a-Windows-Azure-virtual-network/)                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |


### Devices not on the compatible list


If you don’t see your device in the known compatible VPN device list and want to use the device for your VPN connection, you’ll need to verify that it meets the minimum requirements outlined in the [Gateway requirements](vpn-gateway-about-vpngateways.md#gateway-requirements) table. Devices meeting the minimum requirements should also work well with Virtual Network. Please contact your device manufacturer for additional support and configuration instructions.


## Editing device configuration samples

After you download the provided VPN device configuration sample, you’ll need to replace some of the values to reflect the settings for your environment. 

**To edit the sample:**

1. Open the sample using Notepad. 
1. Search and replace all <*text*> strings with the values that pertain to your environment. Be sure to include < and >. When a name is specified, the name you select should be unique. If a command does not work, please consult your device manufacturer documentation.

| **Sample text**                | **Change to**                                                                                                        |
|----------------------------------|----------------------------------------------------------------------------------------------------------------------|
| &lt;RP_OnPremisesNetwork&gt;           | Your chosen name for this object. Example: myOnPremisesNetwork                                                       |
| &lt;RP_AzureNetwork&gt;                | Your chosen name for this object. Example: myAzureNetwork                                                            |
| &lt;RP_AccessList&gt;                  | Your chosen name for this object. Example: myAzureAccessList                                                         |
| &lt;RP_IPSecTransformSet&gt;           | Your chosen name for this object. Example: myIPSecTransformSet                                                       |
| &lt;RP_IPSecCryptoMap&gt;              | Your chosen name for this object. Example: myIPSecCryptoMap                                                          |
| &lt;SP_AzureNetworkIpRange&gt;         | Specify range. Example: 192.168.0.0                                                                                  |
| &lt;SP_AzureNetworkSubnetMask&gt;      | Specify subnet mask. Example: 255.255.0.0                                                                            |
| &lt;SP_OnPremisesNetworkIpRange&gt;    | Specify on-premises range. Example: 10.2.1.0                                                                         |
| &lt;SP_OnPremisesNetworkSubnetMask&gt; | Specify on-premises subnet mask. Example: 255.255.255.0                                                              |
| &lt;SP_AzureGatewayIpAddress&gt;       | This information specific to your virtual network and is located in the Management Portal as **Gateway IP address**. |
| &lt;SP_PresharedKey&gt;                | This information is specific to your virtual network and is located in the Management Portal as Manage Key.          |



## IPsec Parameters

### IKE Phase 1 setup

| **Property**                                       | **Static Routing VPN gateway** | **Dynamic Routing VPN gateway and Standard or HighPerformance VPN gateway** |
|----------------------------------------------------|--------------------------------|------------------------------------------------------------------|
| IKE Version                                        | IKEv1                          | IKEv2                                                            |
| Diffie-Hellman Group                               | Group 2 (1024 bit)             | Group 2 (1024 bit)                                               |
| Authentication Method                              | Pre-Shared Key                 | Pre-Shared Key                                                   |
| Encryption Algorithms                              | AES256 AES128 3DES             | AES256 3DES                                                      |
| Hashing Algorithm                                  | SHA1(SHA128)                   | SHA1(SHA128)                                                     |
| Phase 1 Security Association (SA)  Lifetime (Time) | 28,800 seconds                 | 28,800 seconds                                                   |


### IKE Phase 2 setup

| **Property**                                                             | **Static Routing VPN gateway**                 | **Dynamic Routing VPN gateway and Standard or HighPerformance VPN gateway**   |
|--------------------------------------------------------------------------|------------------------------------------------|--------------------------------------------------------------------|
| IKE Version                                                              | IKEv1                                          | IKEv2                                                              |
| Hashing Algorithm                                                        | SHA1(SHA128)                                   | SHA1(SHA128)                                                       |
| Phase 2 Security Association (SA) Lifetime (Time)                        | 3,600 seconds                                  | -                                                                  |
| Phase 2 Security Association (SA) Lifetime (Throughput)                  | 102,400,000 KB                                 | -                                                                  |
| IPsec SA Encryption & Authentication Offers (in the order of preference) | 1. ESP-AES256 2. ESP-AES128 3. ESP-3DES 4. N/A | See Dynamic Routing Gateway IPsec Security Association (SA) Offers |
| Perfect Forward Secrecy (PFS)                                            | No                                             | Yes (DH Group1)                                                    |
| Dead Peer Detection                                                      | Not supported                                  | Supported                                                          |

### Dynamic Routing Gateway IPsec Security Association (SA) Offers

The table below lists IPsec SA Encryption and Authentication Offers. Offers are listed the order of preference that the offer is presented or accepted.

| **IPsec SA Encryption and Authentication Offers** | **Azure Gateway as initiator**                               | Azure Gateway as responder                                   |
|---------------------------------------------------|--------------------------------------------------------------|--------------------------------------------------------------|
| 1                                                 | ESP AES_256 SHA                                              | ESP AES_128 SHA                                              |
| 2                                                 | ESP AES_128 SHA                                              | ESP 3_DES MD5                                                |
| 3                                                 | ESP 3_DES MD5                                                | ESP 3_DES SHA                                                |
| 4                                                 | ESP 3_DES SHA                                                | AH SHA1 with ESP AES_128 with null HMAC                      |
| 5                                                 | AH SHA1 with ESP AES_256 with null HMAC                      | AH SHA1 with ESP 3_DES with null HMAC                        |
| 6                                                 | AH SHA1 with ESP AES_128 with null HMAC                      | AH MD5  with ESP 3_DES with null HMAC, no lifetimes proposed |
| 7                                                 | AH SHA1 with ESP 3_DES with null HMAC                        | AH SHA1 with ESP 3_DES SHA1, no lifetimes                    |
| 8                                                 | AH MD5  with ESP 3_DES with null HMAC, no lifetimes proposed | AH MD5  with ESP 3_DES MD5, no lifetimes                     |
| 9                                                 | AH SHA1 with ESP 3_DES SHA1, no lifetimes                    | ESP DES MD5                                                  |
| 10                                                | AH MD5  with ESP 3_DES MD5, no lifetimes                     | ESP DES SHA1, no lifetimes                                   |
| 11                                                | ESP DES MD5                                                  | AH SHA1 with ESP DES null HMAC, no lifetimes proposed        |
| 12                                                | ESP DES SHA1, no lifetimes                                   | AH MD5  with ESP DES null HMAC, no lifetimes proposed        |
| 13                                                | AH SHA1 with ESP DES null HMAC, no lifetimes proposed        | AH SHA1 with ESP DES SHA1, no lifetimes                      |
| 14                                                | AH MD5  with ESP DES null HMAC, no lifetimes proposed        | AH MD5  with ESP DES MD5, no lifetimes                       |
| 15                                                | AH SHA1 with ESP DES SHA1, no lifetimes                      | ESP SHA, no lifetimes                                        |
| 16                                                | AH MD5  with ESP DES MD5, no lifetimes                       | ESP MD5, no lifetimes                                        |
| 17                                                | -                                                            | AH SHA, no lifetimes                                         |
| 18                                                | -                                                            | AH MD5, no lifetimes                                         |




- You can specify IPsec ESP NULL encryption with Dynamic Routing and High Performance VPN gateway, intended for VNet-to-VNet connections within Azure networks. 

- For cross-premises connectivity through the Internet, please use the default Azure VPN gateway settings with encryption and hashing algorithms listed in the tables above to ensure security of your critical communication.

## Next Steps


To learn more about VPN gateways, see [About VPN gateways](vpn-gateway-about-vpngateways.md).

To configure a site-to-site VPN, see [Create a virtual network with a site-to-site VPN connection](vpn-gateway-site-to-site-create.md).



