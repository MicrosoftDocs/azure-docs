---
title: Resource Manager template samples - Azure Front Door
description: Information about sample Azure Resource Manager templates provided for Azure Front Door.
services: frontdoor
author: johndowns
ms.author: jodowns
ms.service: frontdoor
ms.topic: sample
ms.date: 04/16/2021 
---

# Azure Resource Manager templates for Azure Front Door

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

The following table includes links to Azure Resource Manager templates for Azure Front Door, with reference architectures including other Azure services.

| Sample | Description |
|-|-|
| [Front Door (quick create)](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium/) | Creates a basic Front Door profile including an endpoint, origin group, origin, and route.  |
| [Rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-rule-set/) | Creates a Front Door profile and rule set.  |
| [WAF policy with managed rule set](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-waf-managed/) | Creates a Front Door profile and WAF with managed rule set.  |
| [WAF policy with custom rule](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-waf-custom/) | Creates a Front Door profile and WAF with custom rule.  |
|**App Service origins**| **Description** |
| [App Service](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-app-service-public) | Creates an App Service app with a public endpoint, and a Front Door profile.  |
| [App Service with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-app-service-private-link) | Creates an App Service app with a private endpoint, and a Front Door profile.  |
| [App Service environment with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-app-service-environment-internal-private-link) | Creates an App Service environment, an app with a private endpoint, and a Front Door profile.  |
|**Azure Functions origins**| **Description** |
| [Azure Functions](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-function-public/) | Creates an Azure Functions app with a public endpoint, and a Front Door profile.  |
| [Azure Functions with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-function-private-link) | Creates an Azure Functions app with a private endpoint, and a Front Door profile.  |
|**API Management origins**| **Description** |
| [API Management (external)](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-api-management-external) | Creates an API Management instance with external VNet integration, and a Front Door profile.  |
|**Storage origins**| **Description** |
| [Storage static website](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-storage-static-website) | Creates an Azure Storage account and static website with a public endpoint, and a Front Door profile.  |
| [Storage blobs with Private Link](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-storage-blobs-private-link) | Creates an Azure Storage account and blob container with a private endpoint, and a Front Door profile.  |
|**Application Gateway origins**| **Description** |
| [Application Gateway](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-standard-premium-application-gateway-public) | Creates an Application Gateway, and a Front Door profile. |
|**Virtual machine origins**| **Description** |
| [Virtual machine with Private Link service](https://github.com/Azure/azure-quickstart-templates/tree/master/201-front-door-premium-vm-private-link) | Creates a virtual machine and Private Link service, and a Front Door profile. |
| | |
