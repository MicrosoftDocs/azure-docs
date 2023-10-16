---
title: Support for wildcard domains 
titleSuffix: Azure Front Door
description: This article helps you understand how Azure Front Door supports mapping and managing wildcard domains in the list of custom domains.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.workload: infrastructure-services
ms.date: 02/07/2023
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Wildcard domains in Azure Front Door

Wildcard domains allow Azure Front Door to receive traffic for any subdomain of a top-level domain. An example wildcard domain is `*.contoso.com`.

By using wildcard domains, you can simplify the configuration of your Azure Front Door profile. You don't need to modify the configuration to add or specify each subdomain separately. For example, you can define the routing for `customer1.contoso.com`, `customer2.contoso.com`, and `customerN.contoso.com` by using the same route and adding the wildcard domain `*.contoso.com`.

Wildcard domains give you several advantages, including:

- You don't need to onboard each subdomain in your Azure Front Door profile. For example, suppose you create new subdomains every customer, and route all customers' requests to a single origin group. Whenever you add a new customer, Azure Front Door understands how to route traffic to your origin group even though the subdomain hasn't been explicitly configured.
- You don't need to generate a new TLS certificate, or manage any subdomain-specific HTTPS settings, to bind a certificate for each subdomain.
- You can use a single web application firewall (WAF) policy for all of your subdomains.

Commonly, wildcard domains are used to support software as a service (SaaS) solutions, and other multitenant applications. When you build these application types, you need to give special consideration to how you route traffic to your origin servers. For more information, see [Use Azure Front Door in a multitenant solution](/azure/architecture/guide/multitenant/service/front-door).

> [!NOTE]
> When you use Azure DNS to manage your domain's DNS records, you need to configure wildcard domains by using the Azure Resource Manager API, Bicep, PowerShell, and the Azure CLI. Support for adding and managing Azure DNS wildcard domains in the Azure portal isn't available.

::: zone pivot="front-door-standard-premium"

## Add a wildcard domain and certificate binding

You can add a wildcard domain following similar steps to those for subdomains. For more information about adding a subdomain to Azure Front Door, see [Configure a custom domain on Azure Front Door using the Azure portal](standard-premium/how-to-add-custom-domain.md).

> [!NOTE]
> * Azure DNS supports wildcard records.
> * You can't [purge the Azure Front Door cache](front-door-caching.md#cache-purge) for a wildcard domain. You must specify a subdomain when purging the cache.

For accepting HTTPS traffic on your wildcard domain, you must enable HTTPS on the wildcard domain. The certificate binding for a wildcard domain requires a wildcard certificate. That is, the subject name of the certificate should also have the wildcard domain. 

> [!NOTE]
> * Currently, only using your own custom SSL certificate option is available for enabling HTTPS for wildcard domains. Azure Front Door managed certificates can't be used for wildcard domains. 
> * You can choose to use the same wildcard certificate from Azure Key Vault or from Azure Front Door managed certificates for subdomains. 
> * If you want to add a subdomain of the wildcard domain that’s already validated in the Azure Front Door Standard or Premium profile, the domain validation is automatically approved. 
> * If a wildcard domain is validated and already added to one profile, a single-level subdomain can still be added to another profile as long as it is also validated. 

## Define a subdomain explicitly

You can add as many single-level subdomains of the wildcard as you would like. For example, for the wildcard domain `*.contoso.com`, you can also add subdomains to your Azure Front Door profile for `image.contosto.com`, `cart.contoso.com`, and so forth. The configuration that you explicitly specify for the subdomain takes precedence over the configuration of the wildcard domain.

You might need to explicitly add subdomains in these situations:

* You need to define a different route for a subdomain than the rest of the domains (from the wildcard domain). For example, your customers might use subdomains like `customer1.contoso.com`, `customer2.contoso.com`, and so forth, and these subdomains should all be routed to your main application servers. However, you might also want to route `images.contoso.com` to an Azure Storage blob container.
* You need to use a different WAF policy for a specific subdomain.

Subdomains like `www.image.contoso.com` aren't a single-level subdomain of `*.contoso.com`.

::: zone-end

::: zone pivot="front-door-classic"

## Adding wildcard domains

You can add a wildcard domain under the section for front-end hosts or domains. Similar to subdomains, Azure Front Door (classic) validates that there's CNAME record mapping for your wildcard domain. This DNS mapping can be a direct CNAME record mapping like `*.contoso.com` mapped to `endpoint.azurefd.net`. Or you can use afdverify temporary mapping. For example, `afdverify.contoso.com` mapped to `afdverify.endpoint.azurefd.net` validates the CNAME record map for the wildcard.

> [!NOTE]
> Azure DNS supports wildcard records.

You can add as many single-level subdomains of the wildcard domain in front-end hosts, up to the limit of the front-end hosts. This functionality might be required for:

- Defining a different route for a subdomain than the rest of the domains (from the wildcard domain).

- Having a different WAF policy for a specific subdomain. For example, `*.contoso.com` allows adding `foo.contoso.com` without having to again prove domain ownership. But it doesn't allow `foo.bar.contoso.com` because it isn't a single level subdomain of `*.contoso.com`. To add `foo.bar.contoso.com` without extra domain ownership validation, `*.bar.contoso.com` needs to be added.

You can add wildcard domains and their subdomains with certain limitations:

- If a wildcard domain is added to an Azure Front Door (classic) profile:
  - The wildcard domain can't be added to any other Azure Front Door (classic) profile.
  - First-level subdomains of the wildcard domain can't be added to another Azure Front Door (classic) profile or an Azure Content Delivery Network profile.
- If a subdomain of a wildcard domain is already added to an Azure Front Door (classic) profile or an Azure Content Delivery Network profile, the wildcard domain can't be used for other Azure Front Door (classic) profile.
- If two profiles (Azure Front Door or Azure Content Delivery Network) have various subdomains of a root domain, then wildcard domains can't be added to either of the profiles.

## Certificate binding

For accepting HTTPS traffic on your wildcard domain, you must enable HTTPS on the wildcard domain. The certificate binding for a wildcard domain requires a wildcard certificate. That is, the subject name of the certificate should also have the wildcard domain.

> [!NOTE]
> Currently, only using your own custom SSL certificate option is available for enabling HTTPS for wildcard domains. Azure Front Door managed certificates can't be used for wildcard domains.

You can choose to use the same wildcard certificate from Azure Key Vault or from Azure Front Door managed certificates for subdomains.

If a subdomain is added for a wildcard domain that already has a certificate associated with it, then you can't disable HTTPS for the subdomain. The subdomain uses the certificate binding for the wildcard domain, unless a different Key Vault or Azure Front Door managed certificate overrides it.

::: zone-end

## WAF policies

::: zone pivot="front-door-standard-premium"

WAF policies can be attached to wildcard domains, similar to other domains. A different WAF policy can be applied to a subdomain of a wildcard domain. Subdomains will automatically inherit the WAF policy from the wildcard domain if there is no explicit WAF policy associated to the subdomain. However, if the subdomain is added to a different profile from the wildcard domain profile, the subdomain cannot inherit the WAF policy associated with the wildcard domain.

::: zone-end

::: zone pivot="front-door-classic"

WAF policies can be attached to wildcard domains, similar to other domains. A different WAF policy can be applied to a subdomain of a wildcard domain. For the subdomains, you must specify the WAF policy to be used even if it's the same policy as the wildcard domain. Subdomains *don't* automatically inherit the WAF policy from the wildcard domain.

::: zone-end

If you don't want a WAF policy to run for a subdomain, you can create an empty WAF policy with no managed or custom rulesets.

::: zone pivot="front-door-standard-premium"

## Routes

When configuring a route, you can select a wildcard domain as an origin. You can also have different route behavior for wildcard domains and subdomains. Azure Front Door chooses the most specific match for the domain across different routes. For more information, see [How requests are matched to a routing rule](front-door-route-matching.md).

> [!IMPORTANT]
> You must have matching path patterns across your routes, or your clients will see failures.
> 
> For example, suppose you have two routing rule:
> - Route 1 (`*.foo.com/*` mapped to origin group A)
> - Route 2 (`bar.foo.com/somePath/*` mapped to origin group B)
> If a request arrives for `bar.foo.com/anotherPath/*`, Azure Front Door selects route 2 based on a more specific domain match, only to find no matching path patterns across the routes.

::: zone-end

::: zone pivot="front-door-classic"

## Routing rules

When configuring a routing rule, you can select a wildcard domain as a front-end host. You can also have different route behavior for wildcard domains and subdomains. Azure Front Door chooses the most specific match for the domain across different routes. For more information, see [How requests are matched to a routing rule](front-door-route-matching.md).

> [!IMPORTANT]
> You must have matching path patterns across your routes, or your clients will see failures.
> 
> For example, suppose you have two routing rule:
> - Route 1 (`*.foo.com/*` mapped to backend pool A)
> - Route 2 (`bar.foo.com/somePath/*` mapped to backend pool B)
> If a request arrives for `bar.foo.com/anotherPath/*`, Azure Front Door selects route 2 based on a more specific domain match, only to find no matching path patterns across the routes.

::: zone-end

## Next steps

::: zone pivot="front-door-standard-premium"

- Learn how to [create an Azure Front Door profile](create-front-door-portal.md).
- Learn how to [add a custom domain](standard-premium/how-to-add-custom-domain.md) to your Azure Front Door.
- Learn how to [enable HTTPS on a custom domain](standard-premium/how-to-configure-https-custom-domain.md).

::: zone-end

::: zone pivot="front-door-classic"

- Learn how to [create an Azure Front Door profile](quickstart-create-front-door.md).
- Learn how to [add a custom domain](front-door-custom-domain.md) to your Azure Front Door.
- Learn how to [enable HTTPS on a custom domain](front-door-custom-domain-https.md).

::: zone-end
