---
title: 'Front Door manager - Azure Front Door'
description: This article explains the concepts of the Front Door manager and how you can use it to configure and manage endpoints in your Azure Front Door profile.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 03/16/2022
ms.author: duau
---

# What is Azure Front Door manager?

The Front Door manager in Azure Front Door Standard and Premium provides an overview of endpoints you've configured for your Azure Front Door profile. With Front Door manager you can manage your collection of endpoints, routings rules along with their domains and origin groups, and security policies you want to apply to protect your web application.

## Routes within an endpoint

An endpoint is a logical grouping of one or more routes with associated domains, origin groups, and routing rules between domains and origin groups. An endpoint can have one or more routes. A route can have multiple domains but only one origin group. You need to have at least one configured route in order for traffic to route between your domains and origin groups.

> [!NOTE]
> * You can *enable* or *disable* an endpoint or a route. 
> * Traffic will only flow to origins once both the endpoint and route is **enabled**.
>

Domains configured within a route can either be a custom domain or an endpoint domain. For more information about custom domains, see [create a custom domain](standard-premium/how-to-add-custom-domain.md) with Azure Front Door. Endpoint domains refer to the auto generated domain name when you create a new endpoint. The name is a unique endpoint hostname with a hash value in the format of `endpointname-hash.z01.azurefd.net`. The endpoint domain will be accessible if you associate it with a route. 

### Reuse of an endpoint domain name

An endpoint domain can be reused within the same tenant, subscription, or resource group scope level. You can also choose to not allow the reuse of an endpoint domain. The Azure portal default settings allow tenant level reuse of the endpoint domain. You can use command line to configure the scope level of the endpoint domain reuse. The Azure portal will use the scope level you define through the command line once it has been changed.

| Value | Behavior |
|--|--|
| TenantReuse | This is the default value. Object with the same name in the same tenant will receive the same domain label. |
| SubscriptionReuse | Object with the same name in the same subscription will receive the same domain label. |
| ResourceGroupReuse | Object with the same name in the same resource group will receive the same domain label. |
| NoReuse | Object with the same will receive a new domain label for each new instance. |

## Security policy in an endpoint

A security policy is an association of one or more domains with a Web Application Firewall (WAF) policy. The WAF policy will provide centralized protection for your web applications. If you manage security policies using the Azure portal, you can only associate a security policy with domains that are in the Routes configuration of that endpoint. 

> [!TIP]
> If you're running a large Azure Front Door profile, review [**Azure Front Door service limits**](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standardpremium-preview-service-limits) and [**Azure Front Door routing limits**](front-door-routing-limits.md) to better manage your Azure Front Door.
>

## Front Door manager (classic)

The Front Door manager is called Front Door designer in Azure Front Door (classic). Azure Front Door (classic) only supports one endpoint for each Azure Front Door profile.



## Next Steps

* Learn how to [configure endpoints with Front Door manager](how-to-configure-endpoints.md).
* Learn about the Azure Front Door [routing architecture](front-door-routing-architecture.md).
* Learn [how traffic is matched to a route](front-door-routing-architecture.md) in Azure Front Door.
