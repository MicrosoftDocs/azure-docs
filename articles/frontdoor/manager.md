---
title: Front Door manager
titleSuffix: Azure Front Door
description: This article is about how Front Door manager can help you manage your routing and security policy for an endpoint.
services: frontdoor
author: duongau
ms.service: azure-frontdoor
ms.topic: concept-article
ms.date: 11/13/2024
ms.author: duau
---

# What is Azure Front Door Manager?

Azure Front Door Manager in Azure Front Door Standard and Premium provides an overview of the endpoints configured for your Azure Front Door profile. With Front Door Manager, you can manage your collection of endpoints, configure routing rules, domains, origin groups, and apply security policies to protect your web application.

:::image type="content" source="./media/manager/manager.png" alt-text="Screenshot of the Azure Front Door Manager page." lightbox="./media/manager/manager-expanded.png":::

## Routes within an Endpoint

An [*endpoint*](endpoint.md) is a logical grouping of one or more routes associated with domain names. A route contains the origin group configuration and routing rules between domains and origins. An endpoint can have one or more routes, and a route can have multiple domains but only one origin group. You need at least one configured route for traffic to route between your domains and the origin group.

> [!NOTE]
> * You can *enable* or *disable* an endpoint or a route.
> * Traffic will only flow to origins once both the endpoint and route are **enabled**.

Domains within a route can be either a custom domain or an endpoint domain. For more information about custom domains, see [create a custom domain](standard-premium/how-to-add-custom-domain.md) with Azure Front Door. Endpoint domains refer to the auto-generated domain name when you create a new endpoint. The name is a unique endpoint hostname with a hash value in the format of `endpointname-hash.z01.azurefd.net`. The endpoint domain is accessible if associated with a route.

## Security Policy in an Endpoint

A security policy is an association of one or more domains with a Web Application Firewall (WAF) policy. The WAF policy provides centralized protection for your web applications. If you manage security policies using the Azure portal, you can only associate a security policy with domains in the Routes configuration of that endpoint.

> [!TIP]
> * If one of your domains is unhealthy, select the domain to go to the domains page and take appropriate actions to troubleshoot the issue.
> * If you have a large Azure Front Door profile, review [**Azure Front Door service limits**](../azure-resource-manager/management/azure-subscription-service-limits.md#azure-front-door-standard-and-premium-service-limits) and [**Azure Front Door routing limits**](front-door-routing-limits.md) to better manage your Azure Front Door.

## Next steps

* Discover more about [endpoints](endpoint.md).
* Learn to [configure endpoints using Front Door Manager](how-to-configure-endpoints.md).
* Understand the Azure Front Door [routing architecture](front-door-routing-architecture.md).
* Find out [how traffic is matched to a route](front-door-routing-architecture.md) in Azure Front Door.
