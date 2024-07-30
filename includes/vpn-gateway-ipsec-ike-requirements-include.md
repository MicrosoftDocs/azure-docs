---
author: cherylmc
ms.author: cherylmc
ms.date: 01/11/2023
ms.service: vpn-gateway
ms.topic: include
---

* Your on-premises VPN device configuration must match or contain the following algorithms and parameters that you specify on the Azure IPsec or IKE policy:

  * IKE encryption algorithm (Main Mode, Phase 1)
  * IKE integrity algorithm (Main Mode, Phase 1)
  * DH group (Main Mode, Phase 1)
  * IPsec encryption algorithm (Quick Mode, Phase 2)
  * IPsec integrity algorithm (Quick Mode, Phase 2)
  * PFS group (Quick Mode, Phase 2)
  * Traffic selector (if you use `UsePolicyBasedTrafficSelectors`)
  * SA lifetimes (local specifications that don't need to match)

* If you use GCMAES for the IPsec encryption algorithm, you must select the same GCMAES algorithm and key length for IPsec integrity. For example, use GCMAES128 for both.

* In the table of algorithms and keys:

  * IKE corresponds to Main Mode or Phase 1.
  * IPsec corresponds to Quick Mode or Phase 2.
  * DH group specifies the Diffie-Hellman group used in Main Mode or Phase 1.
  * PFS group specifies the Diffie-Hellman group used in Quick Mode or Phase 2.

* IKE Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways.

* `UsePolicyBasedTrafficSelectors` is an optional parameter on the connection. If you set `UsePolicyBasedTrafficSelectors` to `$True` on a connection, it configures the VPN gateway to connect to an on-premises policy-based VPN firewall.

  If you enable `UsePolicyBasedTrafficSelectors`, ensure that your VPN device has the matching traffic selectors defined with all combinations of your on-premises network (local network gateway) prefixes to or from the Azure virtual network prefixes, instead of any-to-any. The VPN gateway accepts whatever traffic selector the remote VPN gateway proposes, irrespective of what's configured on the VPN gateway.

  For example, if your on-premises network prefixes are 10.1.0.0/16 and 10.2.0.0/16, and your virtual network prefixes are 192.168.0.0/16 and 172.16.0.0/16, you need to specify the following traffic selectors:

  * 10.1.0.0/16 <====> 192.168.0.0/16
  * 10.1.0.0/16 <====> 172.16.0.0/16
  * 10.2.0.0/16 <====> 192.168.0.0/16
  * 10.2.0.0/16 <====> 172.16.0.0/16

  For more information about policy-based traffic selectors, see [Connect a VPN gateway to multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

* Setting the timeout to shorter periods causes IKE to rekey more aggressively. The connection can then appear to be disconnected in some instances. This situation might not be desirable if your on-premises locations are farther away from the Azure region where the VPN gateway resides, or if the physical link condition could incur packet loss. We generally recommend that you set the timeout to *between 30 and 45* seconds.
