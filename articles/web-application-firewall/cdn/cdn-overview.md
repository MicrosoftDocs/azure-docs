---
title: What Is Azure Web Application Firewall on Azure Content Delivery Network?
description: Learn how Azure Web Application Firewall on the Azure Content Delivery Network service helps protect your web applications from malicious attacks.
services: web-application-firewall
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 10/16/2023
# Customer intent: As a web application administrator, I want to implement a web application firewall on my content delivery network so that I can protect my web applications from malicious attacks and ensure compliance while maintaining high availability.
---

# Azure Web Application Firewall on Azure Content Delivery Network

An Azure Web Application Firewall deployment on Azure Content Delivery Network provides centralized protection for your web content. Azure Web Application Firewall defends your web services against common exploits and vulnerabilities. It helps keep your service highly available for your users and helps you meet compliance requirements.

> [!IMPORTANT]
> The preview of Azure Web Application Firewall on Azure Content Delivery Network is no longer accepting new customers. We encourage customers to use [Azure Web Application Firewall on Azure Front Door](../afds/afds-overview.md) instead.
>
> We provide existing customers with a preview service-level agreement. Certain features might not be supported or might have constrained capabilities. For details, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

Azure Web Application Firewall on Azure Content Delivery Network is a global and centralized solution. It's deployed on Azure network edge locations around the globe. Azure Web Application Firewall stops malicious attacks close to the attack sources, before they reach your origin. You get global protection at scale without sacrificing performance.

A web application firewall (WAF) policy links to any content delivery network (CDN) endpoint in your subscription. You can deploy new rules within minutes, so you can respond quickly to changing threat patterns.

![Diagram that shows how Azure Web Application Firewall on Azure Content Delivery Network takes action on incoming requests.](../media/cdn-overview/waf-cdn-overview.png)

## WAF policy and rules

You can configure a WAF policy and associate that policy with one or more CDN endpoints for protection. A WAF policy consists of two types of security rules:

- **Custom rules**: Rules that you can create yourself.
- **Managed rule sets**: Azure-managed preconfigured rules that you can enable.

When both are present, the WAF processes custom rules before processing the rules in a managed rule set.

A rule consists of a match condition, a priority, and an action. Supported action types are `ALLOW`, `BLOCK`, `LOG`, and `REDIRECT`. You can create a fully customized policy that meets your specific requirements for application protection by combining managed and custom rules.

The WAF processes rules within a policy in a priority order. Priority is a unique integer that defines the order of rules to process. Smaller numbers are a higher priority, and the WAF evaluates those rules before rules that have a larger value. After the WAF matches a rule with a request, it applies the corresponding action that the rule defines to the request. After the WAF processes such a match, rules that have lower priorities aren't processed further.

A web application hosted on Azure Content Delivery Network can have only one WAF policy associated with it at a time. However, you can have a CDN endpoint without any WAF policies associated with it. If a WAF policy is present, it's replicated to all edge locations to ensure consistent security policies across the world.

### Custom rules

Custom rules can include:

- **Match rules**: You can configure the following custom match rules:

  - **IP allowlist and blocklist**: You can control access to your web applications based on a list of client IP addresses or IP address ranges. Both IPv4 and IPv6 address types are supported.
  
    IP list rules use the `RemoteAddress` IP contained in the `X-Forwarded-For` request header and not the `SocketAddress` value that the WAF uses. You can configure IP lists to either block or allow requests where the `RemoteAddress` IP matches an IP in the list.

    If you have a requirement to block requests on the source IP address that the WAF uses (for example, the proxy server address if the user is behind a proxy), you should use the Azure Front Door Standard or Premium tier. For more information, see [Configure an IP restriction rule with a WAF for Azure Front Door](../afds/waf-front-door-configure-ip-restriction.md).

  - **Geographic-based access control**: You can control access to your web applications based on the country code that's associated with a client's IP address.

  - **HTTP parameters-based access control**: You can base rules on string matches in HTTP or HTTPS request parameters. Examples include query strings, `POST` arguments, request URI, request header, and request body.

  - **Request method-based access control**: You can base rules on the HTTP request method of the request. Examples include `GET`, `PUT`, and `HEAD`.

  - **Size constraint**: You can base rules on the lengths of specific parts of a request, such as query string, URI, or request body.

- **Rate control rules**: These rules limit abnormally high traffic from any client IP address.

  You can configure a threshold on the number of web requests allowed from a client IP address during a one-minute duration. This rule is distinct from an IP list-based custom rule that either allows all or blocks all requests from a client IP address.
  
  Rate limits can be combined with more match conditions, such as HTTP or HTTPS parameter matches, for granular rate control.

### Azure-managed rule sets

Azure-managed rule sets provide a way to deploy protection against a common set of security threats. Because Azure manages these rule sets, the rules are updated as needed to protect against new attack signatures. The Azure-managed Default Rule Set includes rules against the following threat categories:

- Cross-site scripting
- Java attacks
- Local file inclusion
- PHP injection attacks
- Remote command execution
- Remote file inclusion
- Session fixation
- SQL injection protection
- Protocol attackers

The version number of the Default Rule Set increments when new attack signatures are added to the rule set.

The Default Rule Set is enabled by default in *detection* mode in your WAF policies. You can disable or enable individual rules within the Default Rule Set to meet your application requirements. You can also set specific actions (`ALLOW`, `BLOCK`, `LOG`, and `REDIRECT`) per rule. The default action for the managed Default Rule Set is `BLOCK`.

Custom rules are always applied before the WAF evaluates the rules in the Default Rule Set. If a request matches a custom rule, the WAF applies the corresponding rule action. The request is either blocked or passed through to the back end. No other custom rules or rules in the Default Rule Set are processed. You can also remove the Default Rule Set from your WAF policies.

## WAF modes

You can configure a WAF policy to run in the following two modes:

- **Detection mode**: The WAF doesn't take any other actions other than monitoring and logging the request and its matched WAF rule to WAF logs. You can turn on logging diagnostics for Azure Content Delivery Network. When you use the Azure portal, go to the **Diagnostics** section.
- **Prevention mode**: The WAF takes the specified action if a request matches a rule. If it finds a match, it doesn't evaluate any further rules that have a lower priority. Any matched requests are also logged in the WAF logs.

## WAF actions

You can choose one of the following actions when a request matches a rule's conditions:

- `ALLOW`: The request passes through the WAF and is forwarded to the back end. No further lower-priority rules can block this request.
- `BLOCK`: The request is blocked. The WAF sends a response to the client without forwarding the request to the back end.
- `LOG`: The request is logged in the WAF logs. The WAF continues to evaluate lower-priority rules.
- `REDIRECT`: The WAF redirects the request to the specified URI. The specified URI is a policy-level setting. After you configure the setting, all requests that match the `REDIRECT` action are sent to that URI.

## Configuration

You can configure and deploy all WAF rule types by using the Azure portal, REST APIs, Azure Resource Manager templates, and Azure PowerShell.

## Monitoring

Monitoring for Azure Web Application Firewall on Azure Content Delivery Network is integrated with Azure Monitor to help you track alerts and monitor traffic trends.

## Related content

- [Command reference for managing WAF policies](/cli/azure/network/front-door/waf-policy)
