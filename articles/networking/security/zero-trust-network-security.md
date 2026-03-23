---
title: Azure network security Zero Trust recommendations
description: Review Zero Trust security recommendations for Azure network security services including Azure DDoS Protection, Azure Firewall, and Azure Web Application Firewall.
author: duongau
ms.author: duau
ms.service: azure-firewall
ms.topic: conceptual
ms.date: 03/17/2026
ms.custom: Network-Secure-Recommendation
---

# Azure network security Zero Trust recommendations

The [Zero Trust model](/security/zero-trust/zero-trust-overview) assumes breach and verifies each request as though it originates from an uncontrolled network. Azure network security services play a critical role in enforcing Zero Trust principles by inspecting, filtering, and logging traffic across your cloud environment.

The following recommendations help you assess and harden your Azure network security posture. Each recommendation links to a detailed guide describing the security check, its risk level, and remediation steps.

> [!TIP]
> Some organizations might take these recommendations exactly as written, while others might choose to make modifications based on their own business needs. We recommend that all of the following controls be implemented where applicable. These patterns and practices help to provide a foundation for a secure Azure network environment. More controls will be added to this document over time.

## Automated assessment

Manually checking this guidance against your environment's configuration can be time-consuming and error-prone. The Zero Trust Assessment transforms this process with automation to test for these security configuration items and more. Learn more in [What is the Zero Trust Assessment?](/security/zero-trust/assessment)

## Azure DDoS Protection

Azure DDoS Protection safeguards your public-facing resources from distributed denial of service attacks. The following recommendations verify that DDoS protection is enabled and properly monitored.

For more information, see [Zero Trust recommendations for Azure DDoS Protection](zero-trust-ddos-protection.md).

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [DDoS Protection is enabled for all public IP addresses in VNets](zero-trust-ddos-protection.md#ddos-protection-is-enabled-for-all-public-ip-addresses-in-vnets) | High | Low | Low |
| [Metrics are enabled for DDoS-protected public IPs](zero-trust-ddos-protection.md#metrics-are-enabled-for-ddos-protected-public-ips) | Medium | Low | Low |
| [Diagnostic logging is enabled for DDoS-protected public IPs](zero-trust-ddos-protection.md#diagnostic-logging-is-enabled-for-ddos-protected-public-ips) | Medium | Low | Low |

## Azure Firewall

Azure Firewall provides centralized network security policy enforcement and logging across your virtual networks. The following recommendations verify that key protection features are active.

For more information, see [Zero Trust recommendations for Azure Firewall](zero-trust-azure-firewall.md).

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [Outbound traffic from VNet-integrated workloads is routed through Azure Firewall](zero-trust-azure-firewall.md#outbound-traffic-from-vnet-integrated-workloads-is-routed-through-azure-firewall) | High | Low | Medium |
| [Threat intelligence is enabled in deny mode on Azure Firewall](zero-trust-azure-firewall.md#threat-intelligence-is-enabled-in-deny-mode-on-azure-firewall) | High | Low | Low |
| [IDPS inspection is enabled in deny mode on Azure Firewall](zero-trust-azure-firewall.md#idps-inspection-is-enabled-in-deny-mode-on-azure-firewall) | High | Low | Low |
| [Inspection of outbound TLS traffic is enabled on Azure Firewall](zero-trust-azure-firewall.md#inspection-of-outbound-tls-traffic-is-enabled-on-azure-firewall) | High | Low | Low |
| [Diagnostic logging is enabled in Azure Firewall](zero-trust-azure-firewall.md#diagnostic-logging-is-enabled-in-azure-firewall) | High | Low | Low |

## Application Gateway WAF

Azure Web Application Firewall on Application Gateway protects web applications from common exploits and vulnerabilities. The following recommendations verify that WAF is properly configured and monitored.

For more information, see [Zero Trust recommendations for Application Gateway WAF](zero-trust-application-gateway-waf.md).

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [Application Gateway WAF is enabled in prevention mode](zero-trust-application-gateway-waf.md#application-gateway-waf-is-enabled-in-prevention-mode) | High | Low | Low |
| [Request body inspection is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#request-body-inspection-is-enabled-in-application-gateway-waf) | High | Low | Low |
| [Default rule set is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#default-rule-set-is-enabled-in-application-gateway-waf) | High | Low | Low |
| [Bot protection rule set is enabled and assigned in Application Gateway WAF](zero-trust-application-gateway-waf.md#bot-protection-rule-set-is-enabled-and-assigned-in-application-gateway-waf) | High | Low | Low |
| [HTTP DDoS protection rule set is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#http-ddos-protection-rule-set-is-enabled-in-application-gateway-waf) | High | Low | Low |
| [Rate limiting is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#rate-limiting-is-enabled-in-application-gateway-waf) | High | Low | Medium |
| [JavaScript challenge is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#javascript-challenge-is-enabled-in-application-gateway-waf) | Medium | Low | Low |
| [Diagnostic logging is enabled in Application Gateway WAF](zero-trust-application-gateway-waf.md#diagnostic-logging-is-enabled-in-application-gateway-waf) | High | Low | Low |

## Azure Front Door WAF

Azure Web Application Firewall on Front Door protects web applications at the network edge. The following recommendations verify that WAF is properly configured and monitored.

For more information, see [Zero Trust recommendations for Azure Front Door WAF](zero-trust-front-door-waf.md).

| Recommendation | Risk level | User impact | Implementation cost |
|---|---|---|---|
| [Azure Front Door WAF is enabled in prevention mode](zero-trust-front-door-waf.md#azure-front-door-waf-is-enabled-in-prevention-mode) | High | Low | Low |
| [Request body inspection is enabled in Azure Front Door WAF](zero-trust-front-door-waf.md#request-body-inspection-is-enabled-in-azure-front-door-waf) | High | Low | Low |
| [Default rule set is assigned in Azure Front Door WAF](zero-trust-front-door-waf.md#default-rule-set-is-assigned-in-azure-front-door-waf) | High | Low | Low |
| [Bot protection rule set is enabled and assigned in Azure Front Door WAF](zero-trust-front-door-waf.md#bot-protection-rule-set-is-enabled-and-assigned-in-azure-front-door-waf) | High | Low | Low |
| [Rate limiting is enabled in Azure Front Door WAF](zero-trust-front-door-waf.md#rate-limiting-is-enabled-in-azure-front-door-waf) | High | Low | Medium |
| [JavaScript challenge is enabled in Azure Front Door WAF](zero-trust-front-door-waf.md#javascript-challenge-is-enabled-in-azure-front-door-waf) | Medium | Low | Low |
| [CAPTCHA challenge is enabled in Azure Front Door WAF](zero-trust-front-door-waf.md#captcha-challenge-is-enabled-in-azure-front-door-waf) | Medium | Low | Low |
| [Diagnostic logging is enabled in Azure Front Door WAF](zero-trust-front-door-waf.md#diagnostic-logging-is-enabled-in-azure-front-door-waf) | High | Low | Low |

## Related content

- [What is Azure network security?](network-security.md)
- [Azure DDoS Protection overview](/azure/ddos-protection/ddos-protection-overview)
- [Azure Firewall overview](/azure/firewall/overview)
- [Azure Web Application Firewall overview](/azure/web-application-firewall/overview)
- [Zero Trust overview](/security/zero-trust/zero-trust-overview)
