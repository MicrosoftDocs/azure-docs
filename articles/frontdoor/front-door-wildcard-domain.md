---
title: Support for wildcard domains - Azure Front Door 
description: This article helps you understand how Azure Front Door supports mapping and managing wildcard domains in the list of custom domains.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/17/2022
ms.author: duau
zone_pivot_groups: front-door-tiers
---

# Wildcard domains

Besides apex domains and subdomains, you can also map a wildcard domain to your front-end hosts or custom domains for your Azure Front Door profile. Having wildcard domains in your Azure Front Door configuration simplifies traffic routing behavior for multiple subdomains for an API, application, or website from the same routing rule. You don't need to modify the configuration to add or specify each subdomain separately. As an example, you can define the routing for `customer1.contoso.com`, `customer2.contoso.com`, and `customerN.contoso.com` by using the same routing rule and adding the wildcard domain `*.contoso.com`.

Key scenarios that are improved with support for wildcard domains include:

- You don't need to onboard each subdomain in your Azure Front Door profile and then enable HTTPS to bind a certificate for each subdomain.
- You're no longer required to change your production Azure Front Door configuration if an application adds a new subdomain. Previously, you had to add the subdomain, bind a certificate to it, attach a web application firewall (WAF) policy, and then add the domain to different routing rules.

> [!NOTE]
> Currently, adding wildcard domains through Azure DNS is only supported via API, PowerShell, and the Azure CLI. Support for adding and managing wildcard domains in the Azure portal isn't available.

::: zone pivot="front-door-standard-premium"

## Add a wildcard domain and certificate binding

You can add a wildcard domain following guidance in [add a custom domain](standard-premium/how-to-add-custom-domain.md) for subdomains.  

> [!NOTE]
> * Azure DNS supports wildcard records.
> * Cache purge for wildcard domain is not supported, you have to specify a subdomain for cache purge. 

You can add as many single-level subdomains of the wildcard as you would like. For example, for the wildcard domain *.contoso.com, you can add subdomains in the form of image.contosto.com, cart.contoso.com, etc. Subdomains like www.image.contoso.com aren't a single-level subdomain of *.contoso.com. This functionality might be required for: 

* Defining a different route for a subdomain than the rest of the domains (from the wildcard domain).  

* Set up a different WAF policy for a specific subdomain.  

For accepting HTTPS traffic on your wildcard domain, you must enable HTTPS on the wildcard domain. The certificate binding for a wildcard domain requires a wildcard certificate. That is, the subject name of the certificate should also have the wildcard domain. 

> [!NOTE]
> * Currently, only using your own custom SSL certificate option is available for enabling HTTPS for wildcard domains. Azure Front Door managed certificates can't be used for wildcard domains. 
> * You can choose to use the same wildcard certificate from Azure Key Vault or from Azure Front Door managed certificates for subdomains. 
> * If you want to add a subdomain of the wildcard domain that’s already validated in the Azure Front Door Standard or Premium profile, the domain validation is automatically approved if it uses the same use your own custom SSL certificate.  
> * If a wildcard domain is validated and already added to one profile, a single-level subdomain can still be added to another profile as long as it is also validated. 

::: zone-end

::: zone pivot="front-door-classic"

## Adding wildcard domains

You can add a wildcard domain under the section for front-end hosts or domains. Similar to subdomains, Azure Front Door (classic) validates that there's CNAME record mapping for your wildcard domain. This DNS mapping can be a direct CNAME record mapping like `*.contoso.com` mapped to `endpoint.azurefd.net`. Or you can use afdverify temporary mapping. For example, `afdverify.contoso.com` mapped to `afdverify.endpoint.azurefd.net` validates the CNAME record map for the wildcard.

> [!NOTE]
> Azure DNS supports wildcard records.

You can add as many single-level subdomains of the wildcard domain in front-end hosts, up to the limit of the front-end hosts. This functionality might be required for:

- Defining a different route for a subdomain than the rest of the domains (from the wildcard domain).

- Having a different WAF policy for a specific subdomain. For example, `*.contoso.com` allows adding `foo.contoso.com` without having to again prove domain ownership. But it doesn't allow `foo.bar.contoso.com` because it isn't a single level subdomain of `*.contoso.com`. To add `foo.bar.contoso.com` without extra domain ownership validation, `*.bar.contosonews.com` needs to be added.

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

## Routing rules

When configuring a routing rule, you can select a wildcard domain as a front-end host. You can also have different route behavior for wildcard domains and subdomains. As described in [How Azure Front Door does route matching](front-door-route-matching.md), the most specific match for the domain across different routing rules is chosen at runtime.

> [!IMPORTANT]
> You must have matching path patterns across your routing rules, or your clients will see failures. For example, you have two routing rules like Route 1 (`*.foo.com/*` mapped to back-end pool A) and Route 2 (`/bar.foo.com/somePath/*` mapped to back-end pool B). Then, a request arrives for `bar.foo.com/anotherPath/*`. Azure Front Door selects Route 2 based on a more specific domain match, only to find no matching path patterns across the routes.

## Next steps

- Learn how to [create an Azure Front Door profile](quickstart-create-front-door.md).
- Learn how to [add a custom domain](front-door-custom-domain.md) to your Azure Front Door.
- Learn how to [enable HTTPS on a custom domain](front-door-custom-domain-https.md).
