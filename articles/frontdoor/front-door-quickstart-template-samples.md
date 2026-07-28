---
title: Azure Resource Manager template samples
titleSuffix: Azure Front Door
description: Explore Bicep and Azure Resource Manager template samples for Azure Front Door, including quick-start templates for profiles, custom domains, WAF policies, rate limiting, and various origin configurations such as App Service, Azure Functions, API Management, Storage, and Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-frontdoor
ms.topic: sample
ms.date: 07/24/2026
ms.custom: devx-track-arm-template, devx-track-bicep
---

# Bicep and Azure Resource Manager deployment model templates for Azure Front Door

**Applies to:** :heavy_check_mark: Front Door Standard :heavy_check_mark: Front Door Premium

The following table includes links to Bicep and Azure Resource Manager deployment model templates for Azure Front Door.

| Sample | Description |
|-|-|
| [Front Door (quick create)](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium/) | Creates a basic Front Door profile including an endpoint, origin group, origin, and route.  |
| [Rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-rule-set/) | Creates a Front Door profile and rule set.  |
|**Custom domains**| **Description** |
| [Custom domain and managed TLS certificate](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-custom-domain/) | Creates a Front Door profile with a custom domain and a Microsoft-managed TLS certificate.  |
| [Custom domain and customer-managed TLS certificate](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-custom-domain-customer-certificate/) | Creates a Front Door profile with a custom domain and use your own TLS certificate by using Key Vault.  |
| [Custom domain and Azure DNS](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-custom-domain-azure-dns/) | Creates a Front Door profile with a custom domain and an Azure DNS zone.  |
|**Web Application Firewall**| **Description** |
| [WAF policy with managed rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-waf-managed/) | Creates a Front Door profile and WAF with managed rule set.  |
| [WAF policy with custom rule](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-waf-custom/) | Creates a Front Door profile and WAF with custom rule.  |
| [WAF policy with rate limit](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-rate-limit/) | Creates a Front Door profile and WAF with a custom rule to perform rate limiting.  |
| [WAF policy with geo-filtering](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-geo-filtering/) | Creates a Front Door profile and WAF with a custom rule to perform geo-filtering.  |
|**App Service origins**| **Description** |
| [App Service](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-app-service-public) | Creates an App Service app with a public endpoint, and a Front Door profile.  |
| [App Service with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-app-service-private-link) | Creates an App Service app with a private endpoint, and a Front Door profile.  |
|**Azure Functions origins**| **Description** |
| [Azure Functions](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-function-public/) | Creates an Azure Functions app with a public endpoint, and a Front Door profile.  |
|**API Management origins**| **Description** |
| [API Management (external)](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-api-management-external) | Creates an API Management instance with external VNet integration, and a Front Door profile.  |
|**Storage origins**| **Description** |
| [Storage static website](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-storage-static-website) | Creates an Azure Storage account and static website with a public endpoint, and a Front Door profile.  |
| [Storage blobs with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-storage-blobs-private-link) | Creates an Azure Storage account and blob container with a private endpoint, and a Front Door profile.  |
|**Application Gateway origins**| **Description** |
| [Application Gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-standard-premium-application-gateway-public) | Creates an Application Gateway, and a Front Door profile. |
|**Virtual machine origins**| **Description** |
| [Virtual machine with Private Link service](https://github.com/Azure/azure-quickstart-templates/tree/master/quickstarts/microsoft.cdn/front-door-premium-vm-private-link) | Creates a virtual machine and Private Link service, and a Front Door profile. |
| | |

## Next step

> [!div class="nextstepaction"]
> [Best practices for Azure Front Door](best-practices.md).

