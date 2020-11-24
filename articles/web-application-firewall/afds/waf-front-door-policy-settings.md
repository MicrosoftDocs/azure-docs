---
title: Policy settings for Web Application Firewall with Azure Front Door
description: Learn Web Application Firewall (WAF).
author: vhorne
ms.service: web-application-firewall
ms.topic: article
services: web-application-firewall
ms.date: 08/21/2019
ms.author: victorh
---

# Policy settings for Web Application Firewall on Azure Front Door

A Web Application Firewall (WAF) policy allows you to control access to your web applications by a set of custom and managed rules. The WAF policy name must be unique. You will receive a validation error if you try to use an existing name. There are multiple policy level settings that apply to all rules specified for that policy as described in this article.

## WAF state

A WAF policy for Front Door can be in one of the following two states:
- **Enabled:** When a policy is enabled, WAF is actively inspecting incoming requests and takes corresponding actions according to rule definitions
- **Disabled:** - When a policy is disabled, WAF inspection is paused. Incoming requests will bypass WAF and are sent to back-ends based on Front Door routing.

## WAF mode

WAF policy can be configured to run in the following two modes:

- **Detection mode** When run in detection mode, WAF does not take any actions other than monitor and log the request and its matched WAF rule to WAF logs. Turn on logging diagnostics for Front Door (when using portal, this can be achieved by going to the **Diagnostics** section in the Azure portal).

- **Prevention mode** When configured to run in prevention mode, WAF takes the specified action if a request matches a rule. Any matched requests are also logged in the WAF logs.

## WAF response for blocked requests

By default, when WAF blocks a request because of a matched rule, it returns a 403 status code with - **The request is blocked** message. A reference string is also returned for logging.

You can define a custom response status code and response message when a request is blocked by WAF. The following custom status codes are supported:

- 200    OK
- 403    Forbidden
- 405    Method not allowed
- 406    Not acceptable
- 429    Too many requests

Custom response status code and response message is a policy level setting. Once it is configured, all blocked requests get the same custom response status and response message.

## URI for redirect action

You are required to define a URI to redirect requests to if the **REDIRECT** action is selected for any of the rules contained in a WAF policy. This redirect URI needs to be a valid HTTP(S) site and once configured, all requests matching rules with a “REDIRECT” action will be redirected to the specified site.


## Next steps
- Learn how to define WAF [custom responses](waf-front-door-configure-custom-response-code.md)
