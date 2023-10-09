---
title: Policy settings for Web Application Firewall in Azure Front Door
description: Learn about policy settings for Azure Web Application Firewall in Azure Front Door.
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 08/21/2019
ms.author: victorh
---

# Policy settings for Web Application Firewall in Azure Front Door

A web application firewall (WAF) policy allows you to control access to your web applications by a set of custom and managed rules. The WAF policy name must be unique. You receive a validation error if you try to use an existing name. Multiple policy-level settings apply to all rules specified for that policy as described in this article.

## WAF state

A WAF policy for Azure Front Door has one of the following two states:

- **Enabled:** When a policy is enabled, WAF actively inspects incoming requests and takes corresponding actions according to rule definitions.
- **Disabled:** When a policy is disabled, WAF inspection is paused. Incoming requests bypass WAF and are sent to back ends based on Azure Front Door routing.

## WAF mode

You can configure a WAF policy to run in the following two modes:

- **Detection mode**: When run in detection mode, the WAF doesn't take any actions other than to monitor and log the request and its matched WAF rule to WAF logs. Turn on logging diagnostics for Azure Front Door when you use the Azure portal. (Go to the **Diagnostics** section in the Azure portal.)
- **Prevention mode**: When a WAF is configured to run in prevention mode, the WAF takes the specified action if a request matches a rule. Any matched requests are also logged in the WAF logs.

## WAF response for blocked requests

By default, when the WAF blocks a request because of a matched rule, it returns a 403 status code with the message "The request is blocked." A reference string is also returned for logging.

You can define a custom response status code and response message when the WAF blocks a request. The following custom status codes are supported:

- 200    OK
- 403    Forbidden
- 405    Method not allowed
- 406    Not acceptable
- 429    Too many requests

A custom response status code with a response message is a policy-level setting. After it's configured, all blocked requests get the same custom response status and response message.

## URI for redirect action

You're required to define a URI to redirect requests to if the `REDIRECT` action is selected for any of the rules contained in a WAF policy. This redirect URI needs to be a valid HTTP(S) site. After it's configured, all requests matching rules with a `REDIRECT` action are redirected to the specified site.

## Next steps

Learn how to define WAF [custom responses](waf-front-door-configure-custom-response-code.md).
