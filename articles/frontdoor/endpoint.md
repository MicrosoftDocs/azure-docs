---
title: 'Endpoints in Azure Front Door'
description: Learn about endpoints when using Azure Front Door.
services: frontdoor
author: johndowns
ms.service: frontdoor
ms.topic: article
ms.workload: infrastructure-services
ms.date: 05/18/2022
ms.author: jodowns
---

# Endpoints in Azure Front Door

TODO

What are endpoints and how do they fit into the resource model?

How should I decide how many endpoints to create? When should I use an endpoint versus deploying a whole new profile?

> I suppose it depend on the route and origin groups you are going to bind for the domains.
>   - If all these domains are sharing the same routes or similar route paths, better that we make it into the same endpoint.
>   - Otherwise, multiple endpoint for multiple custom domains would be a better choice.
> Besides, we can enable/disable endpoint to disable/enable all domains, which is more convenient then disable/enable route one by one.

## Endpoint domain names

Endpoint domain names are automatically generated when you create a new endpoint. Front Door generates a unique domain name based on several components, including:

- The endpoint's name.
- A unique hash value, which is determined by Front Door.
- The base domain name for your Front Door environment. This is generally `z01.azurefd.net`.

For example, suppose you have created an endpoint named `myendpoint`. The endpoint domain name might be `myendpoint-TODO.z01.azurefd.net`.

By using unique hash values as part of the domain name, Front Door helps to protect against [subdomain reuse attacks](TODO).

The endpoint domain is accessible when you [associate it with a route](TODO).

### Reuse of an endpoint domain name

TODO should this refer just to the hash?

An endpoint domain can be reused within the same tenant, subscription, or resource group scope level. You can also choose to not allow the reuse of an endpoint domain. The Azure portal default settings allow tenant level reuse of the endpoint domain. You can use command line to configure the scope level of the endpoint domain reuse. The Azure portal will use the scope level you define through the command line once it has been changed.

| Value | Behavior |
|--|--|
| TenantReuse | This is the default value. Object with the same name in the same tenant will receive the same domain label. |
| SubscriptionReuse | Object with the same name in the same subscription will receive the same domain label. |
| ResourceGroupReuse | Object with the same name in the same resource group will receive the same domain label. |
| NoReuse | Object with the same will receive a new domain label for each new instance. |

TODO mention can be configured by using Azure Policy

> [!NOTE]
> When you modify the reuse behavior of your Front Door profile, any existing endpoint domain names are not updated.

## Next steps

* [Configure an origin](origin.md) for Azure Front Door.
