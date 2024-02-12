---
 title: include file
 author: cherylmc
 ms.service: vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---
### Is Custom IPsec/IKE policy supported on all Azure VPN Gateway SKUs?

Custom IPsec/IKE policy is supported on all Azure SKUs except the Basic SKU.

### How many policies can I specify on a connection?

You can only specify ***one*** policy combination for a given connection.

### Can I specify a partial policy on a connection? (for example, only IKE algorithms, but not IPsec)

No, you must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification isn't allowed.

### What are the algorithms and key strengths supported in the custom policy?

The following table lists the supported cryptographic algorithms and key strengths that you can configure. You must select one option for every field.

[!INCLUDE [Algorithm and keys table](vpn-gateway-ipsec-ike-algorithm-include.md)]

[!INCLUDE [Important requirements table](vpn-gateway-ipsec-ike-requirements-include.md)]

For more information, see [Connect multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

### <a name ="DH"></a>Which Diffie-Hellman Groups are supported?

The following table lists the corresponding Diffie-Hellman groups supported by the custom policy:

[!INCLUDE [Diffie-Hellman groups](vpn-gateway-ipsec-ike-diffie-hellman-include.md)]

Refer to [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114) for more details.

### Does the custom policy replace the default IPsec/IKE policy sets for Azure VPN gateways?

Yes, once a custom policy is specified on a connection, Azure VPN gateway will only use the policy on the connection, both as IKE initiator and IKE responder.

### If I remove a custom IPsec/IKE policy, does the connection become unprotected?

No, the connection will still be protected by IPsec/IKE. Once you remove the custom policy from a connection, the Azure VPN gateway reverts back to the [default list of IPsec/IKE proposals](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#RouteBasedOffers) and restart the IKE handshake again with your on-premises VPN device.

### Would adding or updating an IPsec/IKE policy disrupt my VPN connection?

Yes, it could cause a small disruption (a few seconds) as the Azure VPN gateway tears down the existing connection and restarts the IKE handshake to re-establish the IPsec tunnel with the new cryptographic algorithms and parameters. Ensure your on-premises VPN device is also configured with the matching algorithms and key strengths to minimize the disruption.

### Can I use different policies on different connections?

Yes. Custom policy is applied on a per-connection basis. You can create and apply different IPsec/IKE policies on different connections. You can also choose to apply custom policies on a subset of connections. The remaining ones use the Azure default IPsec/IKE policy sets.

### Can I use the custom policy on VNet-to-VNet connection as well?

Yes, you can apply custom policy on both IPsec cross-premises connections or VNet-to-VNet connections.

### Do I need to specify the same policy on both VNet-to-VNet connection resources?

Yes. A VNet-to-VNet tunnel consists of two connection resources in Azure, one for each direction. Make sure both connection resources have the same policy, otherwise the VNet-to-VNet connection won't establish.

### What is the default DPD timeout value? Can I specify a different DPD timeout?

The default DPD timeout is 45 seconds. You can specify a different DPD timeout value on each IPsec or VNet-to-VNet connection, from 9 seconds to 3600 seconds.

> [!NOTE]
> The default value is 45 seconds on Azure VPN gateways. Setting the timeout to shorter periods will cause IKE to rekey more aggressively, causing the connection to appear to be disconnected in some instances. This may not be desirable if your on-premises locations are farther away from the Azure region where the VPN gateway resides, or when the physical link condition could incur packet loss. The general recommendation is to set the timeout between **30 and 45** seconds.

### Does custom IPsec/IKE policy work on ExpressRoute connection?

No. IPsec/IKE policy only works on S2S VPN and VNet-to-VNet connections via the Azure VPN gateways.

### How do I create connections with IKEv1 or IKEv2 protocol type?

IKEv1 connections can be created on all RouteBased VPN type SKUs, except the Basic SKU, Standard SKU, and other [legacy SKUs](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#gwsku). You can specify a connection protocol type of IKEv1 or IKEv2 while creating connections. If you don't specify a connection protocol type, IKEv2 is used as default option where applicable. For more information, see the [PowerShell cmdlet](/powershell/module/az.network/new-azvirtualnetworkgatewayconnection) documentation. For SKU types and IKEv1/IKEv2 support, see [Connect gateways to policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

### Is transit between IKEv1 and IKEv2 connections allowed?

Yes. Transit between IKEv1 and IKEv2 connections is supported.

### Can I have IKEv1 site-to-site connections on Basic SKUs of RouteBased VPN type?

No. The Basic SKU doesn't support this.

### Can I change the connection protocol type after the connection is created (IKEv1 to IKEv2 and vice versa)?

No. Once the connection is created, IKEv1/IKEv2 protocols can't be changed. You must delete and recreate a new connection with the desired protocol type.

### Why is my IKEv1 connection frequently reconnecting?
If your static routing or route based IKEv1 connection is disconnecting at routine intervals, it's likely due to VPN gateways not supporting in-place rekeys. When Main mode is getting rekeyed, your IKEv1 tunnels will disconnect and take up to 5 seconds to reconnect. Your Main mode negotiation time out value determines the frequency of rekeys. To prevent these reconnects, you can switch to using IKEv2, which supports in-place rekeys.

If your connection is reconnecting at random times, follow our [troubleshooting guide](../articles/vpn-gateway/vpn-gateway-troubleshoot-site-to-site-disconnected-intermittently.md).

### Where can I find configuration information and steps?

See the following articles for more information and configuration steps.

* [Configure IPsec/IKE policy for S2S or VNet-to-VNet connections - Azure portal](../articles/vpn-gateway/ipsec-ike-policy-howto.md)
* [Configure IPsec/IKE policy for S2S or VNet-to-VNet connections - Azure PowerShell](../articles/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell.md)
