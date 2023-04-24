---
author: cherylmc
ms.author: cherylmc
ms.date: 01/11/2023
ms.service: vpn-gateway
ms.topic: include
---

IPsec and IKE protocol standard supports a wide range of cryptographic algorithms in various combinations. Refer to [About cryptographic requirements and Azure VPN gateways](../articles/vpn-gateway/vpn-gateway-about-compliance-crypto.md) to see how this can help ensure cross-premises and VNet-to-VNet connectivity to satisfy your compliance or security requirements. Be aware of the following considerations:

* IPsec/IKE policy only works on the following gateway SKUs:
  * ***VpnGw1~5 and VpnGw1AZ~5AZ***
  * ***Standard*** and ***HighPerformance***
* You can only specify ***one*** policy combination for a given connection.
* You must specify all algorithms and parameters for both IKE (Main Mode) and IPsec (Quick Mode). Partial policy specification isn't allowed.
* Consult with your VPN device vendor specifications to ensure the policy is supported on your on-premises VPN devices. S2S or VNet-to-VNet connections can't establish if the policies are incompatible.