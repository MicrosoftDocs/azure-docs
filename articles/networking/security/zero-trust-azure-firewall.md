---
title: Zero Trust recommendations for Azure Firewall
description: Review Zero Trust security recommendations for Azure Firewall to help enforce network security policies across your virtual networks.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: conceptual
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Zero Trust recommendations for Azure Firewall

Azure Firewall provides centralized network security policy enforcement and logging across your virtual networks. The following recommendations help you verify that key protection features are active and properly configured.

For a summary of all Azure network security Zero Trust recommendations, see [Azure network security Zero Trust recommendations](zero-trust-network-security.md).

## Recommendations

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [!INCLUDE [Outbound traffic from VNet-integrated workloads is routed through Azure Firewall](includes/25535.md)] | High | Low | Medium |
| [!INCLUDE [Threat intelligence is enabled in deny mode on Azure Firewall](includes/25537.md)] | High | Low | Low |
| [!INCLUDE [IDPS inspection is enabled in deny mode on Azure Firewall](includes/25539.md)] | High | Low | Low |
| [!INCLUDE [Inspection of outbound TLS traffic is enabled on Azure Firewall](includes/25550.md)] | High | Low | Low |
| [!INCLUDE [Diagnostic logging is enabled in Azure Firewall](includes/26887.md)] | High | Low | Low |

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure Firewall overview](/azure/firewall/overview)
- [Azure Firewall Premium features](/azure/firewall/premium-features)
