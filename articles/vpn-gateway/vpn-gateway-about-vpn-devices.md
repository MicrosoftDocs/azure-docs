---
title: About VPN devices for cross-premises Azure connections | Microsoft Docs
description: This article discusses VPN devices and IPsec parameters for S2S VPN Gateway cross-premises connections. Links are provided to configuration instructions and samples.
services: vpn-gateway
documentationcenter: na
author: yushwang
manager: rossort
editor: ''
tags: azure-resource-manager, azure-service-management

ms.assetid: ba449333-2716-4b7f-9889-ecc521e4d616
ms.service: vpn-gateway
ms.devlang: na
ms.topic: get-started-article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 12/12/2016
ms.author: yushwang;cherylmc

---
# About VPN devices for Site-to-Site VPN Gateway connections
A VPN device is required to configure a Site-to-Site (S2S) cross-premises VPN connection using a VPN gateway. Site-to-Site connections can be used to create a hybrid solution, or whenever you want a secure connection between your on-premises network and your virtual network. This article discusses compatible VPN devices and configuration parameters.

> [!NOTE]
> When configuring a Site-to-Site connection, a public-facing IPv4 IP address is required for your VPN device.                                                                                                                                                                               
>
>

If your device doesn't appear in the [Validated VPN devices](#devicetable) table, see the [Non-validated VPN devices](#additionaldevices) section of this article. It's possible that your device may still work with Azure. For VPN device support, please contact your device manufacturer.

> [!IMPORTANT]
> Please refer to [Known Device Compatibility Issues](#known) if you are experiencing connectivity issues
> between your on-premises VPN devices and Azure VPN gateways.

**Items to note when viewing the tables:**

* There has been a terminology change for static and dynamic routing. You'll likely run into both terms. There is no functionality change, only the names are changing.
  * Static Routing = PolicyBased
  * Dynamic Routing = RouteBased
* Specifications for High Performance VPN gateway and RouteBased VPN gateway are the same unless otherwise noted. For example, the validated VPN devices that are compatible with RouteBased VPN gateways are also compatible with the Azure High Performance VPN gateway.

## <a name="devicetable"></a>Validated VPN devices
We have validated a set of standard VPN devices in partnership with device vendors. All the devices in the device families contained in the following list should work with Azure VPN gateways. See [About VPN Gateway](vpn-gateway-about-vpngateways.md) to verify the type of gateway that you need to create for the solution you want to configure.

To help configure your VPN device, refer to the links that correspond to appropriate device family. For VPN device support, please contact your device manufacturer.

| **Vendor** | **Device family** | **Minimum OS version** | **PolicyBased** | **RouteBased** |
| --- | --- | --- | --- | --- |
| Allied Telesis |AR Series VPN Routers |2.9.2 |Coming soon |Not compatible |
| Barracuda Networks, Inc. |Barracuda NextGen Firewall F-series |PolicyBased: 5.4.3<br>RouteBased: 6.2.0 |[Configuration instructions](https://techlib.barracuda.com/NGF/AzurePolicyBasedVPNGW) |[Configuration instructions](https://techlib.barracuda.com/NGF/AzureRouteBasedVPNGW) |
| Barracuda Networks, Inc. |Barracuda NextGen Firewall X-series |Barracuda Firewall 6.5 |[Barracuda Firewall](https://techlib.barracuda.com/BFW/ConfigAzureVPNGateway) |Not compatible |
| Brocade |Vyatta 5400 vRouter |Virtual Router 6.6R3 GA |[Configuration instructions](http://www1.brocade.com/downloads/documents/html_product_manuals/vyatta/vyatta_5400_manual/wwhelp/wwhimpl/js/html/wwhelp.htm#href=VPN_Site-to-Site%20IPsec%20VPN/Preface.1.1.html) |Not compatible |
| Check Point |Security Gateway |R77.30 |[Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |[Configuration instructions](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |
| Cisco |ASA |8.3 |[Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASA) |Not compatible |
| Cisco |ASR |PolicyBased: IOS 15.1<br>RouteBased: IOS 15.2 |[Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR) |[Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR) |
| Cisco |ISR |PolicyBased: IOS 15.0<br>RouteBased*: IOS 15.1 |[Cisco samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR) |[Cisco samples*](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR) |
| Citrix |NetScaler MPX, SDX, VPX |10.1 and above |[Integration instructions](https://docs.citrix.com/en-us/netscaler/11-1/system/cloudbridge-connector-introduction/cloudbridge-connector-azure.html) |Not compatible |
| Dell SonicWALL |TZ Series, NSA Series<br>SuperMassive Series<br>E-Class NSA Series |SonicOS 5.8.x<br>[SonicOS 5.9.x](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide/supported-platforms?ParentProduct=850)<br>[SonicOS 6.x](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide/supported-platforms?ParentProduct=646) |[Configuration guide for SonicOS 6.2](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide?ParentProduct=646)<br>[Configuration guide for SonicOS 5.9](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide?ParentProduct=850) |[Configuration guide for SonicOS 6.2](http://documents.software.dell.com/sonicos/6.2/microsoft-azure-configuration-guide?ParentProduct=646)<br>[Configuration guide for SonicOS 5.9](http://documents.software.dell.com/sonicos/5.9/microsoft-azure-configuration-guide?ParentProduct=850) |
| F5 |BIG-IP series |12.0 |[Configuration instructions](https://devcentral.f5.com/articles/connecting-to-windows-azure-with-the-big-ip) |[Configuration instructions](https://devcentral.f5.com/articles/big-ip-to-azure-dynamic-ipsec-tunneling) |
| Fortinet |FortiGate |FortiOS 5.4.2 |[Configuration instructions](http://cookbook.fortinet.com/ipsec-vpn-microsoft-azure-54) |[Configuration instructions](http://cookbook.fortinet.com/ipsec-vpn-microsoft-azure-54) |
| Internet Initiative Japan (IIJ) |SEIL Series |SEIL/X 4.60<br>SEIL/B1 4.60<br>SEIL/x86 3.20 |[Configuration instructions](http://www.iij.ad.jp/biz/seil/ConfigAzureSEILVPN.pdf) |Not compatible |
| Juniper |SRX |PolicyBased: JunOS 10.2<br>Routebased: JunOS 11.4 |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX) |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX) |
| Juniper |J-Series |PolicyBased: JunOS 10.4r9<br>RouteBased: JunOS 11.4 |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries) |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries) |
| Juniper |ISG |ScreenOS 6.3 |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG) |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG) |
| Juniper |SSG |ScreenOS 6.2 |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG) |[Juniper samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG) |
| Microsoft |Routing and Remote Access Service |Windows Server 2012 |Not compatible |[Microsoft samples](http://go.microsoft.com/fwlink/p/?LinkId=717761) |
| Open Systems AG |Mission Control Security Gateway |N/A |[Installation guide](https://www.open.ch/_pdf/Azure/AzureVPNSetup_Installation_Guide.pdf) |[Installation guide](https://www.open.ch/_pdf/Azure/AzureVPNSetup_Installation_Guide.pdf) |
| Openswan |Openswan |2.6.32 |(Coming soon) |Not compatible |
| Palo Alto Networks |All devices running PAN-OS |PAN-OS<br>PolicyBased: 6.1.5 or later<br>RouteBased: 7.1.4 |[Configuration instructions](https://live.paloaltonetworks.com/t5/Configuration-Articles/How-to-Configure-VPN-Tunnel-Between-a-Palo-Alto-Networks/ta-p/59065) |[Configuration instructions](https://live.paloaltonetworks.com/t5/Integration-Articles/Configuring-IKEv2-VPN-for-Microsoft-Azure-Environment/ta-p/60340) |
| WatchGuard |All |Fireware XTM<br> PolicyBased: v11.11.x<br>RouteBased: v11.12.x |[Configuration instructions](http://watchguardsupport.force.com/publicKB?type=KBArticle&SFDCID=kA2F00000000LI7KAM&lang=en_US) |[Configuration instructions](http://watchguardsupport.force.com/publicKB?type=KBArticle&SFDCID=kA22A000000XZogSAG&lang=en_US)|

(*) ISR 7200 Series routers only support PolicyBased VPNs.

## <a name="additionaldevices"></a>Non-validated VPN devices
If you don’t see your device listed in the Validated VPN devices table, it still may work with a Site-to-Site connection. Verify that your VPN device meets the minimum requirements outlined in the Gateway Requirements section of the [About VPN Gateway](vpn-gateway-about-vpngateways.md) article. Devices meeting the minimum requirements should also work well with VPN gateways. Contact your device manufacturer for additional support and configuration instructions.

## Editing device configuration samples
After you download the provided VPN device configuration sample, you’ll need to replace some of the values to reflect the settings for your environment.

**To edit a sample:**

1. Open the sample using Notepad.
2. Search and replace all <*text*> strings with the values that pertain to your environment. Be sure to include < and >. When a name is specified, the name you select should be unique. If a command does not work, consult your device manufacturer documentation.

| **Sample text** | **Change to** |
| --- | --- |
| &lt;RP_OnPremisesNetwork&gt; |Your chosen name for this object. Example: myOnPremisesNetwork |
| &lt;RP_AzureNetwork&gt; |Your chosen name for this object. Example: myAzureNetwork |
| &lt;RP_AccessList&gt; |Your chosen name for this object. Example: myAzureAccessList |
| &lt;RP_IPSecTransformSet&gt; |Your chosen name for this object. Example: myIPSecTransformSet |
| &lt;RP_IPSecCryptoMap&gt; |Your chosen name for this object. Example: myIPSecCryptoMap |
| &lt;SP_AzureNetworkIpRange&gt; |Specify range. Example: 192.168.0.0 |
| &lt;SP_AzureNetworkSubnetMask&gt; |Specify subnet mask. Example: 255.255.0.0 |
| &lt;SP_OnPremisesNetworkIpRange&gt; |Specify on-premises range. Example: 10.2.1.0 |
| &lt;SP_OnPremisesNetworkSubnetMask&gt; |Specify on-premises subnet mask. Example: 255.255.255.0 |
| &lt;SP_AzureGatewayIpAddress&gt; |This information specific to your virtual network and is located in the Management Portal as **Gateway IP address**. |
| &lt;SP_PresharedKey&gt; |This information is specific to your virtual network and is located in the Management Portal as Manage Key. |

## IPsec Parameters
> [!NOTE]
> Although the values listed in the following table are supported by the Azure VPN Gateway, currently there is no way for you to specify or select a specific combination from the Azure VPN Gateway. You must specify any constraints from the on-premises VPN device. In addition, you must clamp MSS at 1350.
>
>

### IKE Phase 1 setup
| **Property** | **PolicyBased** | **RouteBased and Standard or High Performance VPN gateway** |
| --- | --- | --- |
| IKE Version |IKEv1 |IKEv2 |
| Diffie-Hellman Group |Group 2 (1024 bit) |Group 2 (1024 bit) |
| Authentication Method |Pre-Shared Key |Pre-Shared Key |
| Encryption Algorithms |AES256 AES128 3DES |AES256 3DES |
| Hashing Algorithm |SHA1(SHA128) |SHA1(SHA128), SHA2(SHA256) |
| Phase 1 Security Association (SA) Lifetime (Time) |28,800 seconds |10,800 seconds |

### IKE Phase 2 setup
| **Property** | **PolicyBased** | **RouteBased and Standard or High Performance VPN gateway** |
| --- | --- | --- |
| IKE Version |IKEv1 |IKEv2 |
| Hashing Algorithm |SHA1(SHA128), SHA2(SHA256) |SHA1(SHA128), SHA2(SHA256) |
| Phase 2 Security Association (SA) Lifetime (Time) |3,600 seconds |3,600 seconds |
| Phase 2 Security Association (SA) Lifetime (Throughput) |102,400,000 KB |- |
| IPsec SA Encryption & Authentication Offers (in the order of preference) |1. ESP-AES256 2. ESP-AES128 3. ESP-3DES 4. N/A |See *RouteBased Gateway IPsec Security Association (SA) Offers* (below) |
| Perfect Forward Secrecy (PFS) |No |No (*) |
| Dead Peer Detection |Not supported |Supported |

(*) Azure Gateway as IKE responder can accept PFS DH Group 1, 2, 5, 14, 24.

### RouteBased Gateway IPsec Security Association (SA) Offers
The following table lists IPsec SA Encryption and Authentication Offers. Offers are listed the order of preference that the offer is presented or accepted.

| **IPsec SA Encryption and Authentication Offers** | **Azure Gateway as initiator** | **Azure Gateway as responder** |
| --- | --- | --- |
| 1 |ESP AES_256 SHA |ESP AES_128 SHA |
| 2 |ESP AES_128 SHA |ESP 3_DES MD5 |
| 3 |ESP 3_DES MD5 |ESP 3_DES SHA |
| 4 |ESP 3_DES SHA |AH SHA1 with ESP AES_128 with null HMAC |
| 5 |AH SHA1 with ESP AES_256 with null HMAC |AH SHA1 with ESP 3_DES with null HMAC |
| 6 |AH SHA1 with ESP AES_128 with null HMAC |AH MD5 with ESP 3_DES with null HMAC, no lifetimes proposed |
| 7 |AH SHA1 with ESP 3_DES with null HMAC |AH SHA1 with ESP 3_DES SHA1, no lifetimes |
| 8 |AH MD5 with ESP 3_DES with null HMAC, no lifetimes proposed |AH MD5 with ESP 3_DES MD5, no lifetimes |
| 9 |AH SHA1 with ESP 3_DES SHA1, no lifetimes |ESP DES MD5 |
| 10 |AH MD5 with ESP 3_DES MD5, no lifetimes |ESP DES SHA1, no lifetimes |
| 11 |ESP DES MD5 |AH SHA1 with ESP DES null HMAC, no lifetimes proposed |
| 12 |ESP DES SHA1, no lifetimes |AH MD5 with ESP DES null HMAC, no lifetimes proposed |
| 13 |AH SHA1 with ESP DES null HMAC, no lifetimes proposed |AH SHA1 with ESP DES SHA1, no lifetimes |
| 14 |AH MD5 with ESP DES null HMAC, no lifetimes proposed |AH MD5 with ESP DES MD5, no lifetimes |
| 15 |AH SHA1 with ESP DES SHA1, no lifetimes |ESP SHA, no lifetimes |
| 16 |AH MD5 with ESP DES MD5, no lifetimes |ESP MD5, no lifetimes |
| 17 |- |AH SHA, no lifetimes |
| 18 |- |AH MD5, no lifetimes |

* You can specify IPsec ESP NULL encryption with RouteBased and High Performance VPN gateways. Null based encryption does not provide protection to data in transit, and should only be used when maximum throughput and minimum latency is required.  Clients may choose to use this in VNet-to-VNet communication scenarios, or when encryption is being applied elsewhere in the solution.
* For cross-premises connectivity through the Internet, use the default Azure VPN gateway settings with encryption and hashing algorithms listed in the tables above to ensure security of your critical communication.

## <a name="known"></a>Known Device Compatibility Issues

> [!IMPORTANT]
> These are known compatibility issues between third party VPN devices and Azure VPN gateways. The Azure
> team is actively working with the vendors to address the issues listed here. Once the issues are resolved,
> this page will be updated with the most up-to-date information. Please check back periodically.

###Feb. 16, 2017

**Palo Alto Networks devices with version prior to 7.1.4** for Azure route-based VPN: If you are using VPN devices from Palo Alto Networks with PAN-OS version prior to 7.1.4, and are experiencing connectivity issues to Azure route-based VPN gateways, please perform the following steps:

1. Check the firmware version of your Palo Alto Networks device. If your PAN-OS version is older than 7.1.4, please upgrade to 7.1.4
2. On the Palo Alto Networks device, change the Phase 2 SA (or Quick Mode SA) lifetime to 28,800 seconds (8 hours) when connecting to Azure VPN gateway
3. If you are still experiencing connectivity issue, please open a support request from the Azure Portal 
