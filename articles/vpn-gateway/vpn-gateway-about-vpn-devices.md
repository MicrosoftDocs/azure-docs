<properties 
   pageTitle="About VPN Devices for Site-to-Site VPN Gateway connections for Azure Virtual Networks | Microsoft Azure"
   description="Learn about VPN devices and IPsec parameters for S2S VPN Gateway connections. Site-to-Site connections can be used for hybrid configurations. This article contains links to configuration instructions and samples for VPN gateway devices."
   services="vpn-gateway"
   documentationCenter="na"
   authors="cherylmc"
   manager="carmonm"
   editor=""
  tags="azure-resource-manager, azure-service-management"/>
<tags 
   ms.service="vpn-gateway"
   ms.devlang="na"
   ms.topic="get-started-article"
   ms.tgt_pltfrm="na"
   ms.workload="infrastructure-services"
   ms.date="06/29/2016"
   ms.author="cherylmc" />

# About VPN devices for Site-to-Site VPN Gateway connections

A VPN device is required in order to configure a Site-to-Site (S2S) VPN connection. Site-to-Site connections can be used to create a hybrid solution, or whenever you want a secure connection between your on-premises network and your virtual network. This article discusses compatible VPN devices and configuration parameters. Please note that when configuring a Site-to-Site connection, a public-facing IPv4 IP address is required for your VPN device.                                                                                                                                                                                

If your device doesn't appear in the Validated VPN devices table, see the Non-validated VPN devices section of this article. It's possible that your device may still work with Azure. For VPN device support, please contact your device manufacturer.

**Items to note when viewing the tables:**

- There has been a terminology change for static and dynamic routing. You'll likely run into both terms. There is no functionality change, only the names are changing.
	- Static Routing = Policy-based
	- Dynamic Routing = Route-based 
- Specifications for High Performance VPN gateway and route-based VPN gateway are the same unless otherwise noted. For example, the validated VPN devices that are compatible with route-based VPN gateways will also be compatible with the new Azure High Performance VPN gateway. 


## Validated VPN devices 

We have validated a set of standard VPN devices in partnership with device vendors. All of the devices in the device families contained in the list below should work with Azure VPN gateways. See the [VPN gateways](vpn-gateway-about-vpngateways.md) article to verify the type of gateway that you'll need to create for the solution you want to configure. 

To help configure your VPN device, please refer to the links that correspond to appropriate device family. 



| **Vendor**                      | **Device family**                                        | **Minimum OS version**                             | **Policy-based**                                                                                                                                                                                                             | **Route-based**                                                                                                                                                                    |
|---------------------------------|----------------------------------------------------------|----------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Allied Telesis                  | AR Series VPN Routers                                    | 2.9.2                                              | Coming soon                                                                                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |
| Barracuda Networks, Inc.        | Barracuda NextGen Firewall F-series             | Policy-based: 5.4.3, Route-based: 6.2.0  | [Configuration instructions](https://techlib.barracuda.com/NGF/AzurePolicyBasedVPNGW) | [Configuration instructions](https://techlib.barracuda.com/NGF/AzureRouteBasedVPNGW)                                                                                                                                                                                              |
| Barracuda Networks, Inc.        |  Barracuda NextGen Firewall X-series                 | Barracuda Firewall 6.5 | [Barracuda Firewall](https://techlib.barracuda.com/BFW/ConfigAzureVPNGateway) | Not compatible                                                                                                                                                                                               |
| Brocade                         | Vyatta 5400 vRouter                                      | Virtual Router 6.6R3 GA                            | [Configuration instructions](http://www1.brocade.com/downloads/documents/html_product_manuals/vyatta/vyatta_5400_manual/wwhelp/wwhimpl/js/html/wwhelp.htm#href=VPN_Site-to-Site%20IPsec%20VPN/Preface.1.1.html)                                       | Not compatible                                                                                                                                                                                               |
| Check Point                     | Security Gateway                                         | R75.40, R75.40VS                                     | [Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275)                                         | [Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |
| Cisco                           | ASA                                                      | 8.3                                                | [Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASA)                                                                                                                                                                        | Not compatible                                                                                                                                                                                               |
| Cisco                           | ASR                                                      | IOS 15.1 (policy-based),  IOS 15.2 (route-based)                | [Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR)                                                                                                                                                                        | [Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR)                                                                                                                                 |
| Cisco                           | ISR                                                      | IOS 15.0 (policy-based),  IOS 15.1 (route-based*)               | [Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR)                                                                                                                                                                        | [Cisco samples*](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR)                                                                                                                                |
| Citrix                          | CloudBridge MPX appliance, or VPX virtual appliance       | N/A                                                | [Integration instructions](https://www.citrix.com/welcome.html?resource=%2Fdownloads%2Fcloudbridge%2Fbetas-and-tech-previews%2Fcloudbridge-azure-integration)                                                                                                                                                                            | Not compatible                                                                                                                                                                                               |
| Dell SonicWALL                  | TZ Series,  NSA Series,  SuperMassive Series,  E-Class NSA Series | SonicOS 5.8.x, [SonicOS 5.9.x](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide/supported-platforms?ParentProduct=850), [SonicOS 6.x](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide/supported-platforms?ParentProduct=646 )          | [Instructions - SonicOS 6.2](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide?ParentProduct=646) [Instructions - SonicOS 5.9](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide?ParentProduct=850)                                                                                                                                   | [Instructions - SonicOS 6.2](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide?ParentProduct=646) [Instructions - SonicOS 5.9](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide?ParentProduct=850)                                                                                                                                                                                      |
| F5                              | BIG-IP series                                            | N/A                                                | [Configuration instructions](https://devcentral.f5.com/articles/connecting-to-windows-azure-with-the-big-ip)                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |
| Fortinet                        | FortiGate                                                | FortiOS 5.0.7                                      | [Configuration instructions](http://docs.fortinet.com/d/fortigate-configuring-ipsec-vpn-between-a-fortigate-and-microsoft-azure)                                                                                                                                                                          | [Configuration instructions](http://docs.fortinet.com/d/fortigate-configuring-ipsec-vpn-between-a-fortigate-and-microsoft-azure)                                                                                                                                  |
| Internet Initiative Japan (IIJ) | SEIL Series                                              | SEIL/X 4.60, SEIL/B1 4.60, SEIL/x86 3.20            | [Configuration instructions](http://www.iij.ad.jp/biz/seil/ConfigAzureSEILVPN.pdf)                                                                                                                                                                   | Not compatible                                                                                                                                                                                               |
| Juniper                         | SRX                                                      | JunOS 10.2 (policy-based),  JunOS 11.4 (route-based)            | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX)                                                                                                                                                                      | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX)                                                                                                                              |
| Juniper                         | J-Series                                                 | JunOS 10.4r9 (policy-based),  JunOS 11.4 (route-based)          | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries)                                                                                                                                                                 | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries)                                                                                                                         |
| Juniper                         | ISG                                                      | ScreenOS 6.3 (policy-based and route-based)                  | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG)                                                                                                                                                                      | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG)                                                                                                                              |
| Juniper                         | SSG                                                      | ScreenOS 6.2 (policy-based and route-based)                  | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG)                                                                                                                                                                      | [Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG)                                                                                                                              |
| Microsoft                       | Routing and Remote Access Service                        | Windows Server 2012                                | Not compatible                                                                                                                                                                                                                                       | [Microsoft samples](http://go.microsoft.com/fwlink/p/?LinkId=717761)                                                                                           |
| Open Systems AG | Mission Control Security Gateway | N/A | [Installation Guide](https://www.open.ch/_pdf/Azure/AzureVPNSetup_Installation_Guide.pdf) | [Installation Guide](https://www.open.ch/_pdf/Azure/AzureVPNSetup_Installation_Guide.pdf) |
| Openswan                        | Openswan                                                 | 2.6.32                                             | (Coming soon)                                                                                                                                                                                                                                        | Not compatible                                                                                                                                                                                               |
| Palo Alto Networks              | All devices running PAN-OS     | PAN-OS 6.1.5 or later (policy-based), PAN-OS 7.0.5 or later (route-based)       | [Configuration Instructions]( https://live.paloaltonetworks.com/t5/Configuration-Articles/How-to-Configure-VPN-Tunnel-Between-a-Palo-Alto-Networks/ta-p/59065)                                                                                                                                                                                          | [Configuration Instructions](https://live.paloaltonetworks.com/t5/Integration-Articles/Configuring-IKEv2-VPN-for-Microsoft-Azure-Environment/ta-p/60340)                                                                                                                                                                                    |
| Watchguard                      | All                                                      | Fireware XTM v11.x                                 | [Configuration instructions](http://customers.watchguard.com/articles/Article/Configure-a-VPN-connection-to-a-Windows-Azure-virtual-network/)                                                                                                                                                                          | Not compatible                                                                                                                                                                                               |

(*) ISR 7200 Series routers only support policy-based VPNs.

## Non-validated VPN devices

If you don’t see your device listed in the Validated VPN devices table (above), it still may work with a Site-to-Site connection. Verify that your VPN device meets the minimum requirements outlined in the Gateway Requirements section of the [About VPN Gateways](vpn-gateway-about-vpngateways.md#gateway-requirements) article. Devices meeting the minimum requirements should also work well with VPN gateways. Please contact your device manufacturer for additional support and configuration instructions.


## Editing device configuration samples

After you download the provided VPN device configuration sample, you’ll need to replace some of the values to reflect the settings for your environment. 

**To edit a sample:**

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

>[AZURE.NOTE] Although the values listed below are supported by the Azure VPN Gateway, currently there is no way for you to specify or select a specific combination from the Azure VPN Gateway. You must specify any constraints from the on-premises VPN device.

### IKE Phase 1 setup

| **Property**                                       | **Policy-based** | **Route-based and Standard or High Performance VPN gateway** |
|----------------------------------------------------|--------------------------------|------------------------------------------------------------------|
| IKE Version                                        | IKEv1                          | IKEv2                                                            |
| Diffie-Hellman Group                               | Group 2 (1024 bit)             | Group 2 (1024 bit)                                               |
| Authentication Method                              | Pre-Shared Key                 | Pre-Shared Key                                                   |
| Encryption Algorithms                              | AES256 AES128 3DES             | AES256 3DES                                                      |
| Hashing Algorithm                                  | SHA1(SHA128)                   | SHA1(SHA128), SHA2(SHA256)                                                     |
| Phase 1 Security Association (SA)  Lifetime (Time) | 28,800 seconds                 | 10,800 seconds                                                   |


### IKE Phase 2 setup

| **Property**                                                             | **Policy-based**                 | **Route-based and Standard or High Performance VPN gateway**   |
|--------------------------------------------------------------------------|------------------------------------------------|--------------------------------------------------------------------|
| IKE Version                                                              | IKEv1                                          | IKEv2                                                              |
| Hashing Algorithm                                                        | SHA1(SHA128)                                   | SHA1(SHA128)                                                       |
| Phase 2 Security Association (SA) Lifetime (Time)                        | 3,600 seconds                                  | 3,600 seconds                                                                  |
| Phase 2 Security Association (SA) Lifetime (Throughput)                  | 102,400,000 KB                                 | -                                                                  |
| IPsec SA Encryption & Authentication Offers (in the order of preference) | 1. ESP-AES256 2. ESP-AES128 3. ESP-3DES 4. N/A | See *Route-based Gateway IPsec Security Association (SA) Offers* (below) |
| Perfect Forward Secrecy (PFS)                                            | No                                             | Yes (DH Group1, 2, 5, 14, 24)                                                    |
| Dead Peer Detection                                                      | Not supported                                  | Supported                                                          |

### Route-based Gateway IPsec Security Association (SA) Offers

The table below lists IPsec SA Encryption and Authentication Offers. Offers are listed the order of preference that the offer is presented or accepted.

| **IPsec SA Encryption and Authentication Offers** | **Azure Gateway as initiator**                               | **Azure Gateway as responder**                                   |
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


- You can specify IPsec ESP NULL encryption with route-based and High Performance VPN gateways. Null based encryption does not provide protection to data in transit, and should only be used when maximum throughput and minimum latency is required.  Clients may chose to use this in vnet-to-vnet communication scenarios, or when encryption is being applied elsewhere in the solution.

- For cross-premises connectivity through the Internet, please use the default Azure VPN gateway settings with encryption and hashing algorithms listed in the tables above to ensure security of your critical communication.





