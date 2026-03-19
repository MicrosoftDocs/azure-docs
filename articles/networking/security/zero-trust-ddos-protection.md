---
title: Zero Trust recommendations for Azure DDoS Protection
description: Review Zero Trust security recommendations for Azure DDoS Protection to help secure your public-facing resources.
author: duongau
ms.author: duau
ms.service: azure-ddos-protection
ms.topic: conceptual
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Zero Trust recommendations for Azure DDoS Protection

Azure DDoS Protection safeguards your public-facing resources from distributed denial of service attacks. The following recommendations help you verify that DDoS protection is enabled and properly monitored across your environment.

For a summary of all Azure network security Zero Trust recommendations, see [Azure network security Zero Trust recommendations](zero-trust-network-security.md).

## Recommendations

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [!INCLUDE [DDoS Protection is enabled for all public IP addresses in VNets](includes/25533.md)] | High | Low | Low |
| [!INCLUDE [Metrics are enabled for DDoS-protected public IPs](includes/26885.md)] | Medium | Low | Low |
| [!INCLUDE [Diagnostic logging is enabled for DDoS-protected public IPs](includes/26886.md)] | Medium | Low | Low |

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure DDoS Protection overview](/azure/ddos-protection/ddos-protection-overview)
- [Create and configure Azure DDoS Network Protection](/azure/ddos-protection/manage-ddos-protection)
