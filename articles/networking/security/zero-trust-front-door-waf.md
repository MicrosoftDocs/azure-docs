---
title: Zero Trust recommendations for Azure Front Door WAF
description: Review Zero Trust security recommendations for Azure Web Application Firewall on Front Door to help protect your web applications at the network edge.
author: duongau
ms.author: duau
ms.service: azure-web-application-firewall
ms.topic: best-practice
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Zero Trust recommendations for Azure Front Door WAF

Azure Web Application Firewall on Front Door protects web applications at the network edge from common exploits and vulnerabilities. The following recommendations help you verify that WAF is properly configured and monitored.

For a summary of all Azure network security Zero Trust recommendations, see [Azure network security Zero Trust recommendations](zero-trust-network-security.md).

## Recommendations

### Azure Front Door WAF is enabled in prevention mode

[!INCLUDE [Azure Front Door WAF is enabled in prevention mode](includes/25543.md)]

### Request body inspection is enabled in Azure Front Door WAF

[!INCLUDE [Request body inspection is enabled in Azure Front Door WAF](includes/26880.md)]

### Default rule set is assigned in Azure Front Door WAF

[!INCLUDE [Default rule set is assigned in Azure Front Door WAF](includes/26883.md)]

### Bot protection rule set is enabled and assigned in Azure Front Door WAF

[!INCLUDE [Bot protection rule set is enabled and assigned in Azure Front Door WAF](includes/26884.md)]

### Rate limiting is enabled in Azure Front Door WAF

[!INCLUDE [Rate limiting is enabled in Azure Front Door WAF](includes/27018.md)]

### JavaScript challenge is enabled in Azure Front Door WAF

[!INCLUDE [JavaScript challenge is enabled in Azure Front Door WAF](includes/27019.md)]

### CAPTCHA challenge is enabled in Azure Front Door WAF

[!INCLUDE [CAPTCHA challenge is enabled in Azure Front Door WAF](includes/27020.md)]

### Diagnostic logging is enabled in Azure Front Door WAF

[!INCLUDE [Diagnostic logging is enabled in Azure Front Door WAF](includes/26889.md)]

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure Web Application Firewall on Azure Front Door overview](/azure/web-application-firewall/afds/afds-overview)
- [WAF policy settings for Azure Front Door](/azure/web-application-firewall/afds/waf-front-door-policy-settings)
