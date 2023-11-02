---
author: cherylmc
ms.author: cherylmc
ms.date: 01/11/2023
ms.service: vpn-gateway
ms.topic: include
---

* Your on-premises VPN device configuration must match or contain the following algorithms and parameters that you specify on the Azure IPsec/IKE policy:

  * IKE encryption algorithm (Main Mode / Phase 1)
  * IKE integrity algorithm (Main Mode / Phase 1)
  * DH Group (Main Mode / Phase 1)
  * IPsec encryption algorithm (Quick Mode / Phase 2)
  * IPsec integrity algorithm (Quick Mode / Phase 2)
  * PFS Group (Quick Mode / Phase 2)
  * Traffic Selector (if UsePolicyBasedTrafficSelectors is used)
  * The SA lifetimes are local specifications only, and don't need to match.

* If GCMAES is used as for IPsec Encryption algorithm, you must select the same GCMAES algorithm and key length for IPsec Integrity; for example, using GCMAES128 for both.

* In the **Algorithms and keys** table:

  * IKE corresponds to Main Mode or Phase 1.
  * IPsec corresponds to Quick Mode or Phase 2.
  * DH Group specifies the Diffie-Hellman Group used in Main Mode or Phase 1.
  * PFS Group specified the Diffie-Hellman Group used in Quick Mode or Phase 2.

* IKE Main Mode SA lifetime is fixed at 28,800 seconds on the Azure VPN gateways.

* 'UsePolicyBasedTrafficSelectors' is an optional parameter on the connection. If you set **UsePolicyBasedTrafficSelectors** to $True on a connection, it will configure the Azure VPN gateway to connect to policy-based VPN firewall on premises. If you enable PolicyBasedTrafficSelectors, you need to ensure your VPN device has the matching traffic selectors defined with all combinations of your on-premises network (local network gateway) prefixes to/from the Azure virtual network prefixes, instead of any-to-any.

  For example, if your on-premises network prefixes are 10.1.0.0/16 and 10.2.0.0/16, and your virtual network prefixes are 192.168.0.0/16 and 172.16.0.0/16, you need to specify the following traffic selectors:

  * 10.1.0.0/16 <====> 192.168.0.0/16
  * 10.1.0.0/16 <====> 172.16.0.0/16
  * 10.2.0.0/16 <====> 192.168.0.0/16
  * 10.2.0.0/16 <====> 172.16.0.0/16

  For more information regarding policy-based traffic selectors, see [Connect multiple on-premises policy-based VPN devices](../articles/vpn-gateway/vpn-gateway-connect-multiple-policybased-rm-ps.md).

* DPD timeout - The default value is 45 seconds on Azure VPN gateways. Setting the timeout to shorter periods will cause IKE to rekey more aggressively, causing the connection to appear to be disconnected in some instances. This may not be desirable if your on-premises locations are farther away from the Azure region where the VPN gateway resides, or the physical link condition could incur packet loss. The general recommendation is to set the timeout between **30 to 45** seconds.
