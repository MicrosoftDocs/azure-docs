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

### Application Gateway WAF is enabled in prevention mode

[!INCLUDE [Application Gateway WAF is enabled in prevention mode](includes/25541.md)]

### Request body inspection is enabled in Application Gateway WAF

[!INCLUDE [Request body inspection is enabled in Application Gateway WAF](includes/26879.md)]

### Default rule set is enabled in Application Gateway WAF

[!INCLUDE [Default rule set is enabled in Application Gateway WAF](includes/26881.md)]

### Bot protection rule set is enabled and assigned in Application Gateway WAF

[!INCLUDE [Bot protection rule set is enabled and assigned in Application Gateway WAF](includes/26882.md)]

### HTTP DDoS protection rule set is enabled in Application Gateway WAF

[!INCLUDE [HTTP DDoS protection rule set is enabled in Application Gateway WAF](includes/27015.md)]

### Rate limiting is enabled in Application Gateway WAF

[!INCLUDE [Rate limiting is enabled in Application Gateway WAF](includes/27016.md)]

### JavaScript challenge is enabled in Application Gateway WAF

[!INCLUDE [JavaScript challenge is enabled in Application Gateway WAF](includes/27017.md)]

### Diagnostic logging is enabled in Application Gateway WAF

[!INCLUDE [Diagnostic logging is enabled in Application Gateway WAF](includes/26888.md)]

## Related content

- [Azure network security Zero Trust recommendations](zero-trust-network-security.md)
- [Azure Web Application Firewall on Application Gateway overview](/azure/web-application-firewall/ag/ag-overview)
- [Create and manage WAF policies for Application Gateway](/azure/web-application-firewall/ag/create-waf-policy-ag)
