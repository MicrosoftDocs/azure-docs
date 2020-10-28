---
title: Azure Front Door - DDoS protection
description: This page provides information about how Azure Front Door helps to protect against DDoS attacks
services: frontdoor
documentationcenter: ''
author: johndowns
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 10/28/2020
ms.author: jodowns
---

# DDoS protection on Front Door

Azure Front Door has several features and characteristics that can help to prevent distributed denial of service (DDoS) attacks. These features can prevent attackers from reaching your application and affecting your application's availability and performance.

## Integration with Azure DDoS Protection Basic

Front Door's public IP addresses are protected by Azure DDoS Protection. You don't need to enable or configure it - it's enabled automatically. This service provides protection for the Azure platform. For more information, see [Azure DDoS Protection](../security/fundamentals/ddos-best-practices.md).

## Protocol blocking

Front Door only accepts traffic on the HTTP and HTTPS protocols, and will only process valid requests with a known `Host` header. This behavior helps to mitigate volumetric attacks that are spread across a range of protocols and ports, as well as DNS amplification attacks and TCP poisoning attacks.

## Capacity absorption

Front Door is a massively scaled, globally distributed service. We have many customers, including Microsoft's own large-scale cloud products, that receive hundreds of thousands of requests each second. Front Door is located at the edge of Azure's network, which means we can absorb and geographically isolate large volume attacks. This can prevent malicious traffic from going any further than the edge of the Azure network.

## Web Application Firewall (WAF)

[Front Door's Web Application Firewall (WAF)](../web-application-firewall/afds/afds-overview.md) can be used to mitigate a number of different types of attacks. Some of the ways you can achieve this are:

* Using the managed rule set provides protection against a number of common attacks.
* Traffic from outside a defined geographic region, or within a defined region, can be blocked or redirected to a static webpage. For more information, see [Geo-filtering](../web-application-firewall/afds/waf-front-door-geo-filtering.md).
* IP addresses and ranges that you identify as malicious can be blocked.* Rate limiting can be applied to prevent IP addresses from calling your service too frequently.
* You can create [custom WAF rules](../web-application-firewall/afds/waf-front-door-custom-rules.md) to automatically block and rate limit HTTP or HTTPS attacks that have known signatures.

## For further protection

If you require further protection, then you can enable [Azure DDoS Protection Standard](../security/fundamentals/ddos-best-practices.md#ddos-protection-standard) on the VNet where your back-ends are deployed. DDoS Protection Standard customers receive additional benefits including cost protection, SLA guarantee, and access to experts from the DDoS Rapid Response Team for immediate help during an attack.
