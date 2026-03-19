---
title: Zero Trust recommendations for Azure Application Gateway WAF
description: Review Zero Trust security recommendations for Azure Web Application Firewall on Application Gateway to help protect your web applications.
author: duongau
ms.author: duau
ms.service: azure-web-application-firewall
ms.topic: conceptual
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Zero Trust recommendations for Application Gateway WAF

Azure Web Application Firewall on Application Gateway protects web applications from common exploits and vulnerabilities. The following recommendations help you verify that WAF is properly configured and monitored.

For a summary of all Azure network security Zero Trust recommendations, see [Azure network security Zero Trust recommendations](zero-trust-network-security.md).

## Recommendations

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [!INCLUDE [Application Gateway WAF is enabled in prevention mode](includes/25541.md)] | High | Low | Low |
| [!INCLUDE [Request body inspection is enabled in Application Gateway WAF](includes/26879.md)] | High | Low | Low |
| [!INCLUDE [Default rule set is enabled in Application Gateway WAF](includes/26881.md)] | High | Low | Low |
| [!INCLUDE [Bot protection rule set is enabled and assigned in Application Gateway WAF](includes/26882.md)] | High | Low | Low |
| [!INCLUDE [HTTP DDoS protection rule set is enabled in Application Gateway WAF](includes/27015.md)] | High | Low | Low |
| [!INCLUDE [Rate limiting is enabled in Application Gateway WAF](includes/27016.md)] | High | Low | Medium |
| [!INCLUDE [JavaScript challenge is enabled in Application Gateway WAF](includes/27017.md)] | Medium | Low | Low |
| [!INCLUDE [Diagnostic logging is enabled in Application Gateway WAF](includes/26888.md)] | High | Low | Low |

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure Web Application Firewall on Application Gateway overview](/azure/web-application-firewall/ag/ag-overview)
- [Create and manage WAF policies for Application Gateway](/azure/web-application-firewall/ag/create-waf-policy-ag)
