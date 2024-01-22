---
title: Front Door manager
titleSuffix: Azure Front Door
description: This article is about how Front Door manager can help you manage your routing and security policy for an endpoint.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 08/09/2023
ms.author: duau
---

# What is Azure Front Door manager?

The Front Door manager in Azure Front Door Standard and Premium provides an overview of endpoints you've configured for your Azure Front Door profile. With Front Door manager, you can manage your collection of endpoints. You can also configure routings rules along with their domains and origin groups, and security policies you want to apply to protect your web application.

:::image type="content" source="./media/manager/manager.png" alt-text="Screen shot of the Azure Front Door manager page." lightbox="./media/manager/manager-expanded.png":::

## Routes within an endpoint

An [*endpoint*](endpoint.md) is a logical grouping of one or more routes that are associated with domain names. A route contains the origin group configuration and routing rules between domains and origins. An endpoint can have one or more routes. A route can have multiple domains but only one origin group. You need to have at least one configured route in order for traffic to route between your domains and the origin group.

> [!NOTE]
> * You can *enable* or *disable* an endpoint or a route. 
> * Traffic will only flow to origins once both the endpoint and route is **enabled**.
>

Domains configured within a route can either be a custom domain or an endpoint domain. For more information about custom domains, see [create a custom domain](standard-premium/how-to-add-custom-domain.md) with Azure Front Door. Endpoint domains refer to the auto generated domain name when you create a new endpoint. The name is a unique endpoint hostname with a hash value in the format of `endpointname-hash.z01.azurefd.net`. The endpoint domain is accessible if you associate it with a route.

## Security policy in an endpoint

A security policy is an association of one or more domains with a Web Application Firewall (WAF) policy. The WAF policy provides centralized protection for your web applications. If you manage security policies using the Azure portal, you can only associate a security policy with domains that are in the Routes configuration of that endpoint. 

> [!TIP]
> * If you see one of your domains is unhealthy, you can select the domain to take you to the domains page. From there you can take appropriate actions to troubleshoot the unhealthy domain.
> * If you're running a large Azure Front Door profile, review [**Azure Front Door service limits**](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits) and [**Azure Front Door routing limits**](front-door-routing-limits.md) to better manage your Azure Front Door.
>

## Next steps

* Learn about [endpoints](endpoint.md).
* Learn how to [configure endpoints with Front Door manager](how-to-configure-endpoints.md).
* Learn about the Azure Front Door [routing architecture](front-door-routing-architecture.md).
* Learn [how traffic is matched to a route](front-door-routing-architecture.md) in Azure Front Door.
