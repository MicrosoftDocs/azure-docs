---
 title: include file
 description: include file
 services: vpn-gateway
 author: cherylmc
 ms.service: vpn-gateway
 ms.topic: include
 ms.date: 12/14/2018
 ms.author: cherylmc
 ms.custom: include file
---
### Is Custom IPsec/IKE policy supported on all Azure VPN Gateway SKUs?
Custom IPsec/IKE policy is supported on Azure **VpnGw1, VpnGw2, VpnGw3, Standard**, and **HighPerformance** VPN gateways. The **Basic** SKU is **not** supported.

### How many policies can I specify on a connection?
You can only specify ***one*** policy combination for a given connection.

### Can I specify a partial policy on a connection? (for example, only IKE algorithms, but not IPsec)
No, you must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification is not allowed.

### What are the algorithms and key strengths supported in the custom policy?
The following table lists the supported cryptographic algorithms and key strengths configurable by the customers. You must select one option for every field.

| **IPsec/IKEv2**  | **Options**                                                                   |
| ---              | ---                                                                           |
| IKEv2 Encryption | AES256, AES192, AES128, DES3, DES                                             |
| IKEv2 Integrity  | SHA384, SHA256, SHA1, MD5                                                     |
| DH Group         | DHGroup24, ECP384, ECP256, DHGroup14 (DHGroup2048), DHGroup2, DHGroup1, None |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None      |
| IPsec Integrity  | GCMAES256, GCMAES192, GCMAES128, SHA256, SHA1, MD5                            |
| PFS Group        | PFS24, ECP384, ECP256, PFS2048, PFS2, PFS1, None                              |
| QM SA Lifetime   | Seconds (integer; **min. 300**/default 27000 seconds)<br>KBytes (integer; **min. 1024**/default 102400000 KBytes)           |
| Traffic Selector | UsePolicyBasedTrafficSelectors ($True/$False; default $False)                 |
|                  |                                                                               |

> [!IMPORTANT]
> 1. DHGroup2048 & PFS2048 are the same as Diffie-Hellman Group **14** in IKE and IPsec PFS. See [Diffie-Hellman Groups](#DH) for the complete mappings.
> 2. For GCMAES algorithms, you must specify the same GCMAES algorithm and key length for both IPsec Encryption and Integrity.
> 3. IKEv2 Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways
> 4. QM SA Lifetimes are optional parameters. If none was specified, default values of 27,000 seconds (7.5 hrs) and 102400000 KBytes (102GB) are used.
> 5. UsePolicyBasedTrafficSelector is an option parameter on the connection. See the next FAQ item for "UsePolicyBasedTrafficSelectors"

### Does everything need to match between the Azure VPN gateway policy and my on-premises VPN device configurations?
Your on-premises VPN device configuration must match or contain the following algorithms and parameters that you specify on the Azure IPsec/IKE policy:

* IKE encryption algorithm
* IKE integrity algorithm
* DH Group
* IPsec encryption algorithm
* IPsec integrity algorithm
* PFS Group
* Traffic Selector (*)

The SA lifetimes are local specifications only, do not need to match.

If you enable **UsePolicyBasedTrafficSelectors**, you need to ensure your VPN device has the matching traffic selectors defined with all combinations of your on-premises network (local network gateway) prefixes to/from the Azure virtual network prefixes, instead of any-to-any. For example, if your on-premises network prefixes are 10.1.0.0/16 and 10.2.0.0/16, and your virtual network prefixes are 192.168.0.0/16 and 172.16.0.0/16, you need to specify the following traffic selectors:
* 10.1.0.0/16 <====> 192.168.0.0/16
* 10.1.0.0/16 <====> 172.16.0.0/16
* 10.2.0.0/16 <====> 192.168.0.0/16
* 10.2.0.0/16 <====> 172.16.0.0/16

For more information, see [Connect multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

### <a name ="DH"></a>Which Diffie-Hellman Groups are supported?
The table below lists the supported Diffie-Hellman Groups for IKE (DHGroup) and IPsec (PFSGroup):

| **Diffie-Hellman Group**  | **DHGroup**              | **PFSGroup** | **Key length** |
| ---                       | ---                      | ---          | ---            |
| 1                         | DHGroup1                 | PFS1         | 768-bit MODP   |
| 2                         | DHGroup2                 | PFS2         | 1024-bit MODP  |
| 14                        | DHGroup14<br>DHGroup2048 | PFS2048      | 2048-bit MODP  |
| 19                        | ECP256                   | ECP256       | 256-bit ECP    |
| 20                        | ECP384                   | ECP384       | 384-bit ECP    |
| 24                        | DHGroup24                | PFS24        | 2048-bit MODP  |
|                           |                          |              |                |

For more information, see [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114).

### Does the custom policy replace the default IPsec/IKE policy sets for Azure VPN gateways?
Yes, once a custom policy is specified on a connection, Azure VPN gateway will only use the policy on the connection, both as IKE initiator and IKE responder.

### If I remove a custom IPsec/IKE policy, does the connection become unprotected?
No, the connection will still be protected by IPsec/IKE. Once you remove the custom policy from a connection, the Azure VPN gateway reverts back to the [default list of IPsec/IKE proposals](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md) and restart the IKE handshake again with your on-premises VPN device.

### Would adding or updating an IPsec/IKE policy disrupt my VPN connection?
Yes, it could cause a small disruption (a few seconds) as the Azure VPN gateway tears down the existing connection and restarts the IKE handshake to re-establish the IPsec tunnel with the new cryptographic algorithms and parameters. Ensure your on-premises VPN device is also configured with the matching algorithms and key strengths to minimize the disruption.

### Can I use different policies on different connections?
Yes. Custom policy is applied on a per-connection basis. You can create and apply different IPsec/IKE policies on different connections. You can also choose to apply custom policies on a subset of connections. The remaining ones use the Azure default IPsec/IKE policy sets.

### Can I use the custom policy on VNet-to-VNet connection as well?
Yes, you can apply custom policy on both IPsec cross-premises connections or VNet-to-VNet connections.

### Do I need to specify the same policy on both VNet-to-VNet connection resources?
Yes. A VNet-to-VNet tunnel consists of two connection resources in Azure, one for each direction. Make sure both connection resources have the same policy, otherwise the VNet-to-VNet connection won't establish.

### Does custom IPsec/IKE policy work on ExpressRoute connection?
No. IPsec/IKE policy only works on S2S VPN and VNet-to-VNet connections via the Azure VPN gateways.

### Where can I find more configuration information for IPsec?
See [Configure IPsec/IKE policy for S2S or VNet-to-VNet connections](../articles/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell.md)
