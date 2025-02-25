---
title: Azure Web Application Firewall on Azure Front Door Sensitive Data Protection
description: Learn about Azure Web Application Firewall Azure Front Door Sensitive Data Protection.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: concept-article
ms.date: 06/24/2024
---

# What is Azure Web Application Firewall on Azure Front Door Sensitive Data Protection?

The Web Application Firewall's (WAF) Log Scrubbing tool helps you remove sensitive data from your WAF logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that contain sensitive information. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.

> [!NOTE]
> When you enable the log scrubbing feature, Microsoft still retains IP addresses in our internal logs to support critical security features.

## Default log behavior

Normally, when a WAF rule is triggered, the WAF logs the details of the request in clear text. If the portion of the request triggering the WAF rule contains sensitive data (such as customer passwords or IP addresses), that sensitive data is viewable by anyone with access to the WAF logs. To protect customer data, you can set up Log Scrubbing rules targeting this sensitive data for protection.

## Fields

The following fields can be scrubbed from the logs:

-   Request Header Names
-   Request Cookie Names
-   Request Body Post Arg Names
-   Request Body Json Arg Names
-   Query String Arg Names
-   Request URI
-   Request IP Address

## Next steps

- [How to mask sensitive data on Azure Web Application Firewall on Azure Front Door (preview)](waf-sensitive-data-protection-configure-frontdoor.md)
- [A Closer Look at Azure WAF’s Data Masking Capabilities for Azure Front Door](https://techcommunity.microsoft.com/t5/azure-network-security-blog/a-closer-look-at-azure-waf-s-data-masking-capabilities-for-azure/ba-p/4167558)
