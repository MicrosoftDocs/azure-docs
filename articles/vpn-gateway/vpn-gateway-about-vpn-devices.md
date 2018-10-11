---
title: About VPN devices for cross-premises Azure connections | Microsoft Docs
description: This article discusses VPN devices and IPsec parameters for S2S VPN Gateway cross-premises connections. Links are provided to configuration instructions and samples.
services: vpn-gateway
author: yushwang
manager: rossort

ms.service: vpn-gateway
ms.topic: article
ms.workload: infrastructure-services
ms.date: 10/05/2018
ms.author: yushwang

---
# About VPN devices and IPsec/IKE parameters for Site-to-Site VPN Gateway connections

A VPN device is required to configure a Site-to-Site (S2S) cross-premises VPN connection using a VPN gateway. Site-to-Site connections can be used to create a hybrid solution, or whenever you want secure connections between your on-premises networks and your virtual networks. This article provides a list of validated VPN devices and a list of IPsec/IKE parameters for VPN gateways.

> [!IMPORTANT]
> If you are experiencing connectivity issues between your on-premises VPN devices and VPN gateways, refer to [Known device compatibility issues](#known).
>

### Items to note when viewing the tables:

* There has been a terminology change for Azure VPN gateways. Only the names have changed. There is no functionality change.
  * Static Routing = PolicyBased
  * Dynamic Routing = RouteBased
* Specifications for HighPerformance VPN gateway and RouteBased VPN gateway are the same, unless otherwise noted. For example, the validated VPN devices that are compatible with RouteBased VPN gateways are also compatible with the HighPerformance VPN gateway.

## <a name="devicetable"></a>Validated VPN devices and device configuration guides

> [!NOTE]
> When configuring a Site-to-Site connection, a public-facing IPv4 IP address is required for your VPN device.
>

In partnership with device vendors, we have validated a set of standard VPN devices. All of the devices in the device families in the following list should work with VPN gateways. See [About VPN Gateway Settings](vpn-gateway-about-vpn-gateway-settings.md#vpntype) to understand the VPN type use (PolicyBased or RouteBased) for the VPN Gateway solution you want to configure.

To help configure your VPN device, refer to the links that correspond to appropriate device family. The links to configuration instructions are provided on a best-effort basis. For VPN device support, contact your device manufacturer.

|**Vendor**          |**Device family**     |**Minimum OS version** |**PolicyBased configuration instructions** |**RouteBased configuration instructions** |
| ---                | ---                  | ---                   | ---            | ---           |
| A10 Networks, Inc. |Thunder CFW           |ACOS 4.1.1             |Not compatible  |[Configuration guide](https://www.a10networks.com/resources/deployment-guides/a10-thunder-cfw-ipsec-vpn-interoperability-azure-vpn-gateways)|
| Allied Telesis     |AR Series VPN Routers |2.9.2                  |Coming soon     |Not compatible  |
| Barracuda Networks, Inc. |Barracuda NextGen Firewall F-series |PolicyBased: 5.4.3<br>RouteBased: 6.2.0 |[Configuration guide](https://techlib.barracuda.com/NGF/AzurePolicyBasedVPNGW) |[Configuration guide](https://techlib.barracuda.com/NGF/AzureRouteBasedVPNGW) |
| Barracuda Networks, Inc. |Barracuda NextGen Firewall X-series |Barracuda Firewall 6.5 |[Configuration guide](https://techlib.barracuda.com/BFW/ConfigAzureVPNGateway) |Not compatible |
| Brocade            |Vyatta 5400 vRouter   |Virtual Router 6.6R3 GA|[Configuration guide](http://www1.brocade.com/downloads/documents/html_product_manuals/vyatta/vyatta_5400_manual/wwhelp/wwhimpl/js/html/wwhelp.htm#href=VPN_Site-to-Site%20IPsec%20VPN/Preface.1.1.html) |Not compatible |
| Check Point |Security Gateway |R77.30 |[Configuration guide](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |[Configuration guide](https://supportcenter.checkpoint.com/supportcenter/portal?eventSubmit_doGoviewsolutiondetails=&solutionid=sk101275) |
| Cisco              |ASA       |8.3<br>8.4+ (IKEv2*) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASA) |[Configuration guide*](vpn-gateway-3rdparty-device-config-cisco-asa.md) |
| Cisco |ASR |PolicyBased: IOS 15.1<br>RouteBased: IOS 15.2 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ASR) |
| Cisco |ISR |PolicyBased: IOS 15.0<br>RouteBased*: IOS 15.1 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR) |[Configuration samples\*\*](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Cisco/Current/ISR) |
| Cisco |Meraki |N/A |Not compatible |Not compatible |
| Citrix |NetScaler MPX, SDX, VPX |10.1 and above |[Configuration guide](https://docs.citrix.com/en-us/netscaler/11-1/system/cloudbridge-connector-introduction/cloudbridge-connector-azure.html) |Not compatible |
| F5 |BIG-IP series |12.0 |[Configuration guide](https://devcentral.f5.com/articles/connecting-to-windows-azure-with-the-big-ip) |[Configuration guide](https://devcentral.f5.com/articles/big-ip-to-azure-dynamic-ipsec-tunneling) |
| Fortinet |FortiGate |FortiOS 5.6 |  |[Configuration guide](http://cookbook.fortinet.com/ipsec-vpn-microsoft-azure-56/) |
| Internet Initiative Japan (IIJ) |SEIL Series |SEIL/X 4.60<br>SEIL/B1 4.60<br>SEIL/x86 3.20 |[Configuration guide](http://www.iij.ad.jp/biz/seil/ConfigAzureSEILVPN.pdf) |Not compatible |
| Juniper |SRX |PolicyBased: JunOS 10.2<br>Routebased: JunOS 11.4 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SRX) |
| Juniper |J-Series |PolicyBased: JunOS 10.4r9<br>RouteBased: JunOS 11.4 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/JSeries) |
| Juniper |ISG |ScreenOS 6.3 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/ISG) |
| Juniper |SSG |ScreenOS 6.2 |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG) |[Configuration samples](https://github.com/Azure/Azure-vpn-config-samples/tree/master/Juniper/Current/SSG) |
| Microsoft |Routing and Remote Access Service |Windows Server 2012 |Not compatible |[Configuration samples](http://go.microsoft.com/fwlink/p/?LinkId=717761) |
| Open Systems AG |Mission Control Security Gateway |N/A |[Configuration guide](https://www.open.ch/_pdf/Azure/AzureVPNSetup_Installation_Guide.pdf) |Not compatible |
| Palo Alto Networks |All devices running PAN-OS |PAN-OS<br>PolicyBased: 6.1.5 or later<br>RouteBased: 7.1.4 |[Configuration guide](https://live.paloaltonetworks.com/t5/Configuration-Articles/How-to-Configure-VPN-Tunnel-Between-a-Palo-Alto-Networks/ta-p/59065) |[Configuration guide](https://knowledgebase.paloaltonetworks.com/KCSArticleDetail?id=kA10g000000Cm6WCAS) |
| ShareTech | Next Generation UTM (NU series) | 9.0.1.3 | Not compatible | [Configuration guide](http://www.sharetech.com.tw/images/file/Solution/NU_UTM/S2S_VPN_with_Azure_Route_Based_en.pdf) |
| SonicWall |TZ Series, NSA Series<br>SuperMassive Series<br>E-Class NSA Series |SonicOS 5.8.x<br>SonicOS 5.9.x<br>SonicOS 6.x |Not compatible |[Configuration guide](https://www.sonicwall.com/support/knowledge-base/170505320011694) |
| Sophos | XG Next Gen Firewall | XG v17 | | [Configuration guide](https://community.sophos.com/kb/127546) |
| Ubiquiti | EdgeRouter | EdgeOS v1.10 |  | [BGP over IKEv2/IPsec](https://help.ubnt.com/hc/en-us/articles/115012374708)<br><br>[VTI over IKEv2/IPsec](https://help.ubnt.com/hc/en-us/articles/115012305347)
| WatchGuard |All |Fireware XTM<br> PolicyBased: v11.11.x<br>RouteBased: v11.12.x |[Configuration guide](http://watchguardsupport.force.com/publicKB?type=KBArticle&SFDCID=kA2F00000000LI7KAM&lang=en_US) |[Configuration guide](http://watchguardsupport.force.com/publicKB?type=KBArticle&SFDCID=kA22A000000XZogSAG&lang=en_US)|

> [!NOTE]
>
> (*) Cisco ASA versions 8.4+ add IKEv2 support, can connect to Azure VPN gateway using custom IPsec/IKE policy with "UsePolicyBasedTrafficSelectors" option. Refer to this [how-to article](vpn-gateway-connect-multiple-policybased-rm-ps.md).
>
> (**) ISR 7200 Series routers only support PolicyBased VPNs.

## <a name="configscripts"></a>Download VPN device configuration scripts from Azure

For certain devices, you can download configuration scripts directly from Azure. For more information and download instructions, see [Download VPN device configuration scripts](vpn-gateway-download-vpndevicescript.md).

### Devices with available configuration scripts

[!INCLUDE [scripts](../../includes/vpn-gateway-device-configuration-scripts.md)]

## <a name="additionaldevices"></a>Non-validated VPN devices

If you don’t see your device listed in the Validated VPN devices table, your device still may work with a Site-to-Site connection. Contact your device manufacturer for additional support and configuration instructions.

## <a name="editing"></a>Editing device configuration samples

After you download the provided VPN device configuration sample, you’ll need to replace some of the values to reflect the settings for your environment.

### To edit a sample:

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

## <a name="ipsec"></a>IPsec/IKE parameters

> [!IMPORTANT]
> 1. The tables below contain the combinations of algorithms and parameters Azure VPN gateways use in default configuration. For route-based VPN gateways created using the Azure Resource Management deployment model, you can specify a custom policy on each individual connection. Please refer to [Configure IPsec/IKE policy](vpn-gateway-ipsecikepolicy-rm-powershell.md) for detailed instructions.
>
> 2. In addition, you must clamp TCP **MSS** at **1350**. Or if your VPN devices do not support MSS clamping, you can alternatively set the **MTU** on the tunnel interface to **1400** bytes instead.
>

In the following tables:

* SA = Security Association
* IKE Phase 1 is also called "Main Mode"
* IKE Phase 2 is also called "Quick Mode"

### IKE Phase 1 (Main Mode) parameters

| **Property**          |**PolicyBased**    | **RouteBased**    |
| ---                   | ---               | ---               |
| IKE Version           |IKEv1              |IKEv2              |
| Diffie-Hellman Group  |Group 2 (1024 bit) |Group 2 (1024 bit) |
| Authentication Method |Pre-Shared Key     |Pre-Shared Key     |
| Encryption & Hashing Algorithms |1. AES256, SHA256<br>2. AES256, SHA1<br>3. AES128, SHA1<br>4. 3DES, SHA1 |1. AES256, SHA1<br>2. AES256, SHA256<br>3. AES128, SHA1<br>4. AES128, SHA256<br>5. 3DES, SHA1<br>6. 3DES, SHA256 |
| SA Lifetime           |28,800 seconds     |28,800 seconds     |

### IKE Phase 2 (Quick Mode) parameters

| **Property**                  |**PolicyBased**| **RouteBased**                              |
| ---                           | ---           | ---                                         |
| IKE Version                   |IKEv1          |IKEv2                                        |
| Encryption & Hashing Algorithms |1. AES256, SHA256<br>2. AES256, SHA1<br>3. AES128, SHA1<br>4. 3DES, SHA1 |[RouteBased QM SA Offers](#RouteBasedOffers) |
| SA Lifetime (Time)            |3,600 seconds  |27,000 seconds                                |
| SA Lifetime (Bytes)           |102,400,000 KB | -                                           |
| Perfect Forward Secrecy (PFS) |No             |[RouteBased QM SA Offers](#RouteBasedOffers) |
| Dead Peer Detection (DPD)     |Not supported  |Supported                                    |


### <a name ="RouteBasedOffers"></a>RouteBased VPN IPsec Security Association (IKE Quick Mode SA) Offers

The following table lists IPsec SA (IKE Quick Mode) Offers. Offers are listed the order of preference that the offer is presented or accepted.

#### Azure Gateway as initiator

|-  |**Encryption**|**Authentication**|**PFS Group**|
|---| ---          |---               |---          |
| 1 |GCM AES256    |GCM (AES256)      |None         |
| 2 |AES256        |SHA1              |None         |
| 3 |3DES          |SHA1              |None         |
| 4 |AES256        |SHA256            |None         |
| 5 |AES128        |SHA1              |None         |
| 6 |3DES          |SHA256            |None         |

#### Azure Gateway as responder

|-  |**Encryption**|**Authentication**|**PFS Group**|
|---| ---          | ---              |---          |
| 1 |GCM AES256    |GCM (AES256)      |None         |
| 2 |AES256        |SHA1              |None         |
| 3 |3DES          |SHA1              |None         |
| 4 |AES256        |SHA256            |None         |
| 5 |AES128        |SHA1              |None         |
| 6 |3DES          |SHA256            |None         |
| 7 |DES           |SHA1              |None         |
| 8 |AES256        |SHA1              |1            |
| 9 |AES256        |SHA1              |2            |
| 10|AES256        |SHA1              |14           |
| 11|AES128        |SHA1              |1            |
| 12|AES128        |SHA1              |2            |
| 13|AES128        |SHA1              |14           |
| 14|3DES          |SHA1              |1            |
| 15|3DES          |SHA1              |2            |
| 16|3DES          |SHA256            |2            |
| 17|AES256        |SHA256            |1            |
| 18|AES256        |SHA256            |2            |
| 19|AES256        |SHA256            |14           |
| 20|AES256        |SHA1              |24           |
| 21|AES256        |SHA256            |24           |
| 22|AES128        |SHA256            |None         |
| 23|AES128        |SHA256            |1            |
| 24|AES128        |SHA256            |2            |
| 25|AES128        |SHA256            |14           |
| 26|3DES          |SHA1              |14           |

* You can specify IPsec ESP NULL encryption with RouteBased and HighPerformance VPN gateways. Null based encryption does not provide protection to data in transit, and should only be used when maximum throughput and minimum latency is required. Clients may choose to use this in VNet-to-VNet communication scenarios, or when encryption is being applied elsewhere in the solution.
* For cross-premises connectivity through the Internet, use the default Azure VPN gateway settings with encryption and hashing algorithms listed in the tables above to ensure security of your critical communication.

## <a name="known"></a>Known device compatibility issues

> [!IMPORTANT]
> These are the known compatibility issues between third-party VPN devices and Azure VPN gateways. The Azure team is actively working with the vendors to address the issues listed here. Once the issues are resolved, this page will be updated with the most up-to-date information. Please check back periodically.
>
>

### Feb. 16, 2017

**Palo Alto Networks devices with version prior to 7.1.4** for Azure route-based VPN: If you are using VPN devices from Palo Alto Networks with PAN-OS version prior to 7.1.4 and are experiencing connectivity issues to Azure route-based VPN gateways, perform the following steps:

1. Check the firmware version of your Palo Alto Networks device. If your PAN-OS version is older than 7.1.4, upgrade to 7.1.4.
2. On the Palo Alto Networks device, change the Phase 2 SA (or Quick Mode SA) lifetime to 28,800 seconds (8 hours) when connecting to the Azure VPN gateway.
3. If you are still experiencing connectivity issues, open a support request from the Azure portal.
