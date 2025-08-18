---
title: Web Application Firewall on Front Door Sensitive Data Protection
description: Learn about sensitive data protection in Azure Web Application Firewall (WAF) for Azure Front Door.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 06/24/2024
# Customer intent: "As a security administrator, I want to implement log scrubbing in the Web Application Firewall, so that I can protect sensitive customer information from being exposed in WAF logs."
---

# What is Azure Web Application Firewall on Azure Front Door sensitive data protection?

The Web Application Firewall's (WAF) log scrubbing tool helps you remove sensitive data from your WAF logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that contain sensitive information. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.

> [!NOTE]
> When you enable the log scrubbing feature, Microsoft still retains IP addresses in our internal logs to support critical security features.

## Default log behavior

Normally, when a WAF rule is triggered, the WAF logs the details of the request in clear text. If the portion of the request triggering the WAF rule contains sensitive data (such as customer passwords or IP addresses), that sensitive data is viewable by anyone with access to the WAF logs. To protect customer data, you can set up Log Scrubbing rules targeting this sensitive data for protection.

## Fields

The following fields can be scrubbed from the logs:

-   Request Header Names
-   Request Cookie Names
-   Request Body Post Arg Names
-   Request Body JSON Arg Names
-   Query String Arg Names
-   Request URI
-   Request IP Address

## Related content

- [How to mask sensitive data on Azure Web Application Firewall for Azure Front Door](waf-sensitive-data-protection-configure-frontdoor.md)
- [Azure Web Application Firewall monitoring and logging](../afds/waf-front-door-monitor.md)
- [A Closer Look at Azure WAF’s Data Masking Capabilities for Azure Front Door](https://techcommunity.microsoft.com/t5/azure-network-security-blog/a-closer-look-at-azure-waf-s-data-masking-capabilities-for-azure/ba-p/4167558)
