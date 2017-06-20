### Is Custom IPsec/IKE policy supported on all Azure VPN Gateway SKUs?
Custom IPsec/IKE policy is supported on Azure **Standard** and **HighPerformance** VPN gateways. **Basic** SKU is NOT supported.

### How many policies can I specify on a connection?
You can only specify ***one*** policy combination for a given connection.

### Can I specify a partial policy on a connection? (E.g., only IKE algorithms but not IPsec)
No, you must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification is not allowed.

### What are the algorithms and key strengths supported in the custom policy?
The table below lists the supported cryptographic algorithms and key strengths configurable by the customers. You must select one option for every field.

| **IPsec/IKEv2**  | **Options**                                                                 |
| ---              | ---                                                                         |
| IKEv2 Encryption | AES256, AES192, AES128, DES3, DES                                           |
| IKEv2 Integrity  | SHA384, SHA256, SHA1, MD5                                                   |
| DH Group         | ECP384, ECP256, DHGroup24, DHGroup14, DHGroup2048, DHGroup2, DHGroup1, None |
| IPsec Encryption | GCMAES256, GCMAES192, GCMAES128, AES256, AES192, AES128, DES3, DES, None    |
| IPsec Integrity  | GCMAES256, GCMAES192, GCMAES128, SHA256, SHA1, MD5                          |
| PFS Group        | ECP384, ECP256, PFS24, PFS2048, PFS14, PFS2, PFS1, None                     |
| QM SA Lifetime*  | Seconds (integer) and KBytes (integer)                                      |
| Traffic Selector | UsePolicyBasedTrafficSelectors** ($True/$False)                             |
|                  |                                                                             |

* (*) IKEv2 Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways
* (**) Please see the next FAQ item for "UsePolicyBasedTrafficSelectors"

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

Refer to [Connect multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md) for more details on how to use this option.

### Does the custom policy replace the default IPsec/IKE policy sets for Azure VPN gateways?
Yes, once a custom policy is specified on a connection, Azure VPN gateway will only use the policy on the connection, both as IKE initiator and IKE responder.

### If I remove a custom IPsec/IKE policy, does the connection become unprotected?
No, the connection will still be protected by IPsec/IKE. Once you remove the custom policy from a connection, the Azure VPN gateway will revert back to the [default list of IPsec/IKE proposals](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md) and re-start the IKE handshake again with your on-premises VPN device.

### Would adding or updating an IPsec/IKE policy disrupt my VPN connection?
Yes, it could cause a small disruption (a few seconds) as the Azure VPN gateway will tear down the existing connection and re-start the IKE handshake to re-establish the IPsec tunnel with the new cryptographic algorithms and parameters. Please ensure your on-premises VPN device is also configured with the matching algorithms and key strengths to minimize the disruption.

### Can I use different policies on different connections?
Yes. Custom policy is applied on a per-connection basis. You can create and apply different IPsec/IKE policies on different connections. You can also choose to apply custom policies on a subset of connections. The remaining ones will use the Azure default IPsec/IKE policy sets.

### Can I use the custom policy on VNet-to-VNet connection as well?
Yes, you can apply custom policy on both IPsec cross-premises connections or VNet-to-VNet connections.

### Do I need to specify the same policy on both VNet-to-VNet connection resources?
Yes. A VNet-to-VNet tunnel consists of two connection resources in Azure, one for each direction. You need to ensure both connection resources have the same policy, othereise the VNet-to-VNet connection will not establish.

### Does custom IPsec/IKE policy work on ExpressRoute connection?
No. IPsec/IKE policy only works on S2S VPN and VNet-to-VNet connections via the Azure VPN gateways.
