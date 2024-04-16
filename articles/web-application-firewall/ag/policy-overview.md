---
title: Azure Web Application Firewall (WAF) policy overview
description: This article is an overview of Web Application Firewall (WAF) global, per-site, and per-URI policies.
services: web-application-firewall
ms.topic: article
author: winthrop28
ms.service: web-application-firewall
ms.date: 10/06/2023
ms.author: victorh
---

# Azure Web Application Firewall (WAF) policy overview

Web Application Firewall Policies contain all the WAF settings and configurations. This includes exclusions, custom rules, managed rules, and so on. These policies are then associated to an application gateway (global), a listener (per-site), or a path-based rule (per-URI) for them to take effect.

There's no limit on the number of policies you can create. When you create a policy, it must be associated to an application gateway to take effect. It can be associated with any combination of application gateways, listeners, and path-based rules.

> [!Note]
> Application Gateway has two versions of the WAF sku: Application Gateway WAF_v1 and Application Gateway WAF_v2. WAF policy associations are only supported for the Application Gateway WAF_v2 sku.

## Global WAF policy

When you associate a WAF policy globally, every site behind your Application Gateway WAF is protected with the same managed rules, custom rules, exclusions, and any other configured settings.

If you want a single policy to apply to all sites, you can associate the policy with the application gateway. For more information, see [Create Web Application Firewall policies for Application Gateway](create-waf-policy-ag.md) to create and apply a WAF policy using the Azure portal. 

## Per-site WAF policy

With per-site WAF policies, you can protect multiple sites with differing security needs behind a single WAF by using per-site policies. For example, if there are five sites behind your WAF, you can have five separate WAF policies (one for each listener) to customize the exclusions, custom rules, managed rule sets, and all other WAF settings for each site.

Say your application gateway has a global policy applied to it. Then you apply a different policy to a listener on that application gateway. The listener's policy now takes effect for just that listener. The application gateway’s global policy still applies to all other listeners and path-based rules that don't have a specific policy assigned to them.

## Per-URI policy

For even more customization down to the URI level, you can associate a WAF policy with a path-based rule. If there are certain pages within a single site that require different policies, you can make changes to the WAF policy that only affect a given URI. This might apply to a payment or sign-in page, or any other URIs that need an even more specific WAF policy than the other sites behind your WAF.

As with per-site WAF policies, more specific policies override less specific ones. This means a per-URI policy on a URL path map overrides any per-site or global WAF policy above it.

### Example

Say you have three sites: contoso.com, fabrikam.com, and adatum.com all behind the same application gateway. You want a WAF applied to all three sites, but you need added security with adatum.com because that is where customers visit, browse, and purchase products.

You can apply a global policy to the WAF, with some basic settings, exclusions, or custom rules if necessary to stop some false positives from blocking traffic. In this case, there's no need to have global SQL injection rules running because fabrikam.com and contoso.com are static pages with no SQL backend. So you can disable those rules in the global policy.

This global policy is suitable for contoso.com and fabrikam.com, but you need to be more careful with adatum.com where sign-in information and payments are handled. You can apply a per-site policy to the adatum listener and leave the SQL rules running. Also assume there's a cookie blocking some traffic, so you can create an exclusion for that cookie to stop the false positive. 

The adatum.com/payments URI is where you need to be careful. So apply another policy on that URI and leave all rules enabled, and also remove all exclusions.

In this example, you have a global policy that applies to two sites. You have a per-site policy that applies to one site, and then a per-URI policy that applies to one specific path-based rule. See [Configure per-site WAF policies using Azure PowerShell](per-site-policies.md) for the corresponding PowerShell for this example.

## Existing WAF configurations

All new Web Application Firewall's WAF settings (custom rules, managed rule set configurations, exclusions, and so on.) exist in a WAF policy. If you have an existing WAF, these settings may still exist in your WAF configuration. For more information about moving to the new WAF policy, [Migrate WAF Config to a WAF Policy](./migrate-policy.md). 


## Next steps

- [Create per-site and per-URI policies using Azure PowerShell](per-site-policies.md).
