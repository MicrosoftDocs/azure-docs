---
 title: Include file
 author: cherylmc
 ms.service: azure-vpn-gateway
 ms.date: 10/18/2023
 ms.author: cherylmc
---
### Is a custom IPsec/IKE policy supported on all Azure VPN Gateway SKUs?

A custom IPsec/IKE policy is supported on all Azure VPN Gateway SKUs except the Basic SKU.

### How many policies can I specify on a connection?

You can specify only one policy combination for a connection.

### Can I specify a partial policy on a connection (for example, only IKE algorithms but not IPsec)?

No, you must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification isn't allowed.

### What algorithms and key strengths does the custom policy support?

The following table lists the supported cryptographic algorithms and key strengths that you can configure. You must select one option for every field.

[!INCLUDE [Algorithm and keys table](vpn-gateway-ipsec-ike-algorithm-include.md)]

[!INCLUDE [Important requirements table](vpn-gateway-ipsec-ike-requirements-include.md)]

For more information, see [Connect a VPN gateway to multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

### <a name ="DH"></a>Which Diffie-Hellman groups does the custom policy support?

The following table lists the corresponding Diffie-Hellman groups that the custom policy supports:

[!INCLUDE [Diffie-Hellman groups](vpn-gateway-ipsec-ike-diffie-hellman-include.md)]

For more information, refer to [RFC3526](https://tools.ietf.org/html/rfc3526) and [RFC5114](https://tools.ietf.org/html/rfc5114).

### Does the custom policy replace the default IPsec/IKE policy sets for VPN gateways?

Yes. After you specify a custom policy on a connection, Azure VPN Gateway uses only that policy on the connection, both as IKE initiator and IKE responder.

### If I remove a custom IPsec/IKE policy, does the connection become unprotected?

No, IPsec/IKE still helps protect the connection. After you remove the custom policy from a connection, the VPN gateway reverts to the [default list of IPsec/IKE proposals](../articles/vpn-gateway/vpn-gateway-about-vpn-devices.md#RouteBasedOffers) and restarts the IKE handshake with your on-premises VPN device.

### Would adding or updating an IPsec/IKE policy disrupt my VPN connection?

Yes. It could cause a small disruption (a few seconds) as the VPN gateway tears down the existing connection and restarts the IKE handshake to reestablish the IPsec tunnel with the new cryptographic algorithms and parameters. Ensure that your on-premises VPN device is also configured with the matching algorithms and key strengths to minimize the disruption.

### Can I use different policies on different connections?

Yes. A custom policy is applied on a per-connection basis. You can create and apply different IPsec/IKE policies on different connections.

You can also choose to apply custom policies on a subset of connections. The remaining ones use the Azure default IPsec/IKE policy sets.

### Can I use a custom policy on VNet-to-VNet connections?

Yes. You can apply a custom policy on both IPsec cross-premises connections and VNet-to-VNet connections.

### Do I need to specify the same policy on both VNet-to-VNet connection resources?

Yes. A VNet-to-VNet tunnel consists of two connection resources in Azure, one for each direction. Make sure both connection resources have the same policy. Otherwise, the VNet-to-VNet connection won't be established.

### What is the default DPD timeout value? Can I specify a different DPD timeout?

The default DPD timeout is 45 seconds on VPN gateways. You can specify a different DPD timeout value on each IPsec or VNet-to-VNet connection, from 9 seconds to 3,600 seconds.

> [!NOTE]
> Setting the timeout to shorter periods causes IKE to rekey more aggressively. The connection can then appear to be disconnected in some instances. This situation might not be desirable if your on-premises locations are farther away from the Azure region where the VPN gateway resides, or if the physical link condition could incur packet loss. We generally recommend that you set the timeout to *between 30 and 45* seconds.

### Does a custom IPsec/IKE policy work on ExpressRoute connections?

No. An IPsec/IKE policy works only on S2S VPN and VNet-to-VNet connections via the VPN gateways.

### How do I create connections with the IKEv1 or IKEv2 protocol type?

You can create IKEv1 connections on all route-based VPN-type SKUs, except the Basic SKU, Standard SKU, and other [earlier SKUs](../articles/vpn-gateway/vpn-gateway-about-skus-legacy.md#gwsku).

You can specify a connection protocol type of IKEv1 or IKEv2 while creating connections. If you don't specify a connection protocol type, IKEv2 is used as default option where applicable. For more information, see the [Azure PowerShell cmdlet](/powershell/module/az.network/new-azvirtualnetworkgatewayconnection) documentation.

For information about SKU types and support for IKEv1 and IKEv2, see [Connect a VPN gateway to multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

### Is transit between IKEv1 and IKEv2 connections allowed?

Yes.

### Can I have IKEv1 site-to-site connections on the Basic SKU for the route-based VPN type?

No. The Basic SKU doesn't support this configuration.

### Can I change the connection protocol type after the connection is created (IKEv1 to IKEv2 and vice versa)?

No. After you create the connection, you can't change IKEv1 and IKEv2 protocols. You must delete and re-create a new connection with the desired protocol type.

### Why is my IKEv1 connection frequently reconnecting?

If your static routing or route-based IKEv1 connection is disconnecting at routine intervals, it's likely because your VPN gateways don't support in-place rekeys. When Main Mode is being rekeyed, your IKEv1 tunnels disconnect and take up to 5 seconds to reconnect. Your Main Mode negotiation timeout value determines the frequency of rekeys. To prevent these reconnects, you can switch to using IKEv2, which supports in-place rekeys.

If your connection is reconnecting at random times, follow the [troubleshooting guide](../articles/vpn-gateway/vpn-gateway-troubleshoot-site-to-site-disconnected-intermittently.md).

### Where can I find more information and steps for configuration?

See the following articles:

* [Configure custom IPsec/IKE connection policies for S2S VPN and VNet-to-VNet: Azure portal](../articles/vpn-gateway/ipsec-ike-policy-howto.md)
* [Configure custom IPsec/IKE connection policies for S2S VPN and VNet-to-VNet: PowerShell](../articles/vpn-gateway/vpn-gateway-ipsecikepolicy-rm-powershell.md)
