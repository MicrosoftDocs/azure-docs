---
title: Azure Front Door - Support for wildcard domains
description: This article helps you understand how Azure Front Door supports mapping and managing wildcard domains in the list of custom domains
services: frontdoor
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 03/10/2020
ms.author: sharadag
---

# Wildcard domains

Other than apex domains and subdomains, you can also map a wildcard domain name to your list of frontend hosts or custom domains of your Front Door profile. Having wildcard domains in your Front Door config simplifies traffic routing behavior for multiple subdomains for an API, application, or website from the same routing rule without having to modify the configuration to add and/or specify each subdomain separately. As an example, you can define the routing for `customer1.contoso.com`, `customer2.contoso.com`, and `customerN.contoso.com` using the same routing rule by adding a wildcard domain `*.contoso.com`.

Some of the key scenarios that are solved with support for wildcard domains include:

- No longer needed to onboard each subdomain on your Front Door and then enabling HTTPS to bind a certificate for each subdomain.
- If an application adds a new subdomain, then you are no longer required to change your production Front Door configuration. Else, earlier it required adding the subdomain, binding a certificate to it, attaching a web application firewall (WAF) policy, adding the domain to different routing rules.

> [!NOTE]
> Currently, wildcard domains are only supported via the API, PowerShell and CLI. Support for adding managing wildcard domains via Azure portal is not available.

## Adding wildcard domains

You can onboard a wildcard domain under the Frontend Hosts or Domains section. Similar to subdomains, Front Door validates that there is a CNAME mapping for your wildcard domain as well. This DNS mapping can be a direct CNAME mapping like `*.contoso.com` mapped to `contoso.azurefd.net` or via the afdverify temporary mapping like `afdverify.contoso.com` mapped to `afdverify.contoso.azurefd.net` validates CNAME map for wildcard as well (Azure DNS supports wildcard records).

You can also add as many single level subdomains of the wildcard domain in frontend hosts if they are not hitting the max. limit of frontend hosts. This functionality may be required for defining a different route for a subdomain than the rest of the domains (from the wildcard domain) or having a different WAF policy for a specific subdomain. So, `*.contoso.com` will allow adding `foo.contoso.com` without having to again prove domain ownership but not `foo.bar.contoso.com` as that is not a single level subdomain of `*.contoso.com`. To add `foo.bar.contoso.com` without additional domain ownership validation, `*.bar.contosonews.com` will need to be added.

### Limitations

1. If a wildcard domain is added in a given Front Door profile, then the same cannot be added to any other Front Door profile. 
2. If a wildcard domain is added in a given Front Door profile, then any subdomains of that wildcard domain cannot be added to other Front Door or an Azure CDN from Microsoft profile
3. If a subdomain of a wildcard domain is added either in a Front Door profile or an Azure CDN from Microsoft profile, then the wildcard domain cannot be added to any other Front Door profile. 
4. If two profiles (Front Door or Azure CDN from Microsoft) have various subdomains of a root domain, then wildcard domains can't be added on either of the profiles.

## Certificate binding for wildcard domains and its subdomains

For accepting HTTPS traffic on your wildcard domain, you must enable HTTPS on the wildcard domain. The certificate binding for wildcard domain requires a wildcard certificate, that is, the certificate's subject name should also have the wildcard domain.

> [!NOTE]
> Currently, only using your own custom SSL certificate option is available for enabling HTTPS for wildcard domains. Front Door managed certificates cannot be used for wildcard domains. 

You can choose to use the same wildcard certificate from your Key Vault for the subdomains, or, use of Front Door Managed certificates for subdomains is also supported.
If a subdomain is added for a wildcard domain and the wildcard domain already had a certificate associated, then HTTPS for this subdomain cannot be disabled. The subdomain will by default use the wildcard domain's certificate binding, unless overridden by a different Key Vault certificate or Front Door managed certificate.

## Web application firewall for wildcard domains and its subdomains

WAF policies can be attached to a wildcard domain similar to other domains. A different WAF policy can be applied to a subdomain of a wildcard domain. For the subdomains, you must explicitly specify the WAF policy to be used and even if it is the same policy as the wildcard domain. Subdomains will **not** automatically inherit the WAF policy from the wildcard domain.

If you have a scenario where you do not want WAF to run for a subdomain, then you can create a blank WAF policy with no managed or custom rulesets.

## Routing rules for wildcard domains and its subdomains

When configuring a routing rule, you can select a wildcard domain as a frontend host. You can also have different route behavior for wildcard domain vs. subdomains. As described in [how Front Door does route matching](front-door-route-matching.md), the most specific match for the domain across different routing rules will be chosen at runtime.

> [!WARNING]
> If you have two routing rules like **Route 1**: `*.foo.com/*` mapped to Backend Pool A and **Route 2**: `bar.foo.com/somePath/*` mapped to Backend Pool B and if a request arrives for `bar.foo.com/anotherPath/*`, then your clients will see failures as Front Door will not find any match across both the routes. This is because per our [route matching algorithm](front-door-route-matching.md), Front Door will select Route 2 based on more specific domain match, but only to find that there are no matching path patterns. 


## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn how to [add a custom domain on Front Door](front-door-custom-domain.md).
- Learn how to [enable HTTPS on a custom domain](front-door-custom-domain-https.md).
