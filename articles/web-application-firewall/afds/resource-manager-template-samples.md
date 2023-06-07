---
title: Azure Resource Manager templates for Azure Front Door and Web Application Firewall
description: Azure Resource Manager templates for Azure Front Door Web Application Firewall
services: web-application-firewall
author: johndowns
ms.service: web-application-firewall
ms.custom: devx-track-arm-template
ms.topic: sample
ms.date: 08/16/2022
ms.author: jodowns
zone_pivot_groups: front-door-tiers
---
# Azure Resource Manager templates for Azure Front Door and Web Application Firewall

The following table includes links to Azure Resource Manager templates for Azure Front Door and Web Application Firewall.

::: zone pivot="front-door-standard-premium"

| Template | Description |
| -------- | ----------- |
| [Front Door with Web Application Firewall and managed rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-waf-managed/) | Creates a Front Door profile and WAF with managed rule set.  |
| [Front Door with Web Application Firewall and custom rule](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-waf-custom/) | Creates a Front Door profile and WAF with custom rule.  |
| [Front Door with Web Application Firewall and rate limit](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-rate-limit/) | Creates a Front Door profile and WAF with a custom rule to perform rate limiting.  |
| [Front Door with Web Application Firewall and geo-filtering](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-geo-filtering/) | Creates a Front Door profile and WAF with a custom rule to perform geo-filtering.  |

::: zone-end

::: zone pivot="front-door-classic"

| Template | Description |
| ---| ---|
| [Create Front Door with geo filtering](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-geo-filtering)| Create a Front Door that allows/blocks traffic from certain countries/regions. |
| [Configure Front Door for client IP allowlisting or blocklisting](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-waf-clientip)| Configures a Front Door to restrict traffic certain client IPs using custom  access control using client IPs. |
| [Configure Front Door to take action with specific http parameters](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-waf-http-params)| Configures a Front Door to allow or block certain traffic based on the http parameters in the incoming request by using custom rules for access control using http parameters. |
| [Configure Front Door rate limiting](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.network/front-door-rate-limiting)| Configures a Front Door to rate limit incoming traffic for a given frontend host. |

::: zone-end
