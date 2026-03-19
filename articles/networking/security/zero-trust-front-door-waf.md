---
title: Zero Trust recommendations for Azure Front Door WAF
description: Review Zero Trust security recommendations for Azure Web Application Firewall on Front Door to help protect your web applications at the network edge.
author: duongau
ms.author: duau
ms.service: azure-web-application-firewall
ms.topic: conceptual
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Zero Trust recommendations for Azure Front Door WAF

Azure Web Application Firewall on Front Door protects web applications at the network edge from common exploits and vulnerabilities. The following recommendations help you verify that WAF is properly configured and monitored.

For a summary of all Azure network security Zero Trust recommendations, see [Azure network security Zero Trust recommendations](zero-trust-network-security.md).

## Recommendations

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [!INCLUDE [Azure Front Door WAF is enabled in prevention mode](includes/25543.md)] | High | Low | Low |
| [!INCLUDE [Request body inspection is enabled in Azure Front Door WAF](includes/26880.md)] | High | Low | Low |
| [!INCLUDE [Default rule set is assigned in Azure Front Door WAF](includes/26883.md)] | High | Low | Low |
| [!INCLUDE [Bot protection rule set is enabled and assigned in Azure Front Door WAF](includes/26884.md)] | High | Low | Low |
| [!INCLUDE [Rate limiting is enabled in Azure Front Door WAF](includes/27018.md)] | High | Low | Medium |
| [!INCLUDE [JavaScript challenge is enabled in Azure Front Door WAF](includes/27019.md)] | Medium | Low | Low |
| [!INCLUDE [CAPTCHA challenge is enabled in Azure Front Door WAF](includes/27020.md)] | Medium | Low | Low |
| [!INCLUDE [Diagnostic logging is enabled in Azure Front Door WAF](includes/26889.md)] | High | Low | Low |

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure Web Application Firewall on Azure Front Door overview](/azure/web-application-firewall/afds/afds-overview)
- [WAF policy settings for Azure Front Door](/azure/web-application-firewall/afds/waf-front-door-policy-settings)
