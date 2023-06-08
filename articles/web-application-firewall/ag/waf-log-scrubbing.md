---
title: Azure Web Application Firewall log scrubbing
description: Learn about Azure Web Application Firewall log scrubbing
author: vhorne
ms.author: victorh
ms.service: web-application-firewall
ms.topic: conceptual
ms.date: 06/08/2023
---

# What is Azure Web Application Firewall log scrubbing?

Log scrubbing is a tool that helps you remove sensitive information from your logs. It works by using a rules engine that allows you to build custom rules to identify specific portions of a request that are sensitive. Once identified, the tool scrubs that information from your logs and replaces it with _*******_.


## Default log behavior

Normally, when a WAF rule is triggered, the WAF logs the details of the request in clear text. If the portion of the request triggering the WAF rule contains sensitive data, (such as customer passwords or IP addresses) that sensitive data is viewable by anyone with access to the WAF logs. To protect customer data, you can set up log scrubbing rules targeting this sensitive data.

> [!IMPORTANT]
> Selectors are case insensitive for the RequestHeaderNames match variable only. All other match variables are case sensitive.

## Fields

The following fields can be scrubbed from the logs:

- IP address
- Request header name
- Request cookie name
- Request args name
- Post arg name
- JSON arg name

## Next steps

- [Configure Azure Web Application Firewall log scrubbing]()
