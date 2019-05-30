---
title: Azure Front Door Service - Application layer security | Microsoft Docs
description: This article helps you understand how Azure Front Door Service enables to protect and secure your application backends
services: frontdoor
documentationcenter: ''
author: sharad4u
ms.service: frontdoor
ms.devlang: na
ms.topic: article
ms.tgt_pltfrm: na
ms.workload: infrastructure-services
ms.date: 09/10/2018
ms.author: sharadag
---

# Application layer security with Front Door
Azure Front Door Service provides web application protection capability to safeguard your web applications from network attacks and common web vulnerabilities exploits like SQL Injection or Cross Site Scripting (XSS). Enabled for http(s) front-ends, Front Door's application layer security is globally distributed and always on, stopping malicious attacks at Azure's network edge, far away from your backends. With added security and performance optimization, Front Door delivers fast and secure web experiences to your end users.

## Application protection
Front Door's application protection is configured on each edge environment around the globe, in line with applications, and automatically blocks non-http(s) traffic from reaching your web applications. Our multi-tenant distributed architecture enables global protection at scale without sacrificing performance. For http(s) workloads, Front Door's web application protection service provides a rich rules engine for custom rules, pre-configured ruleset against common attacks, and detailed logging for all requests that matches a rule. Flexible actions including allow, block, or log only are supported.

## Custom access control rules
- **IP allow list and block list:** You may configure custom rules to control access to your web applications based on list of client IP addresses. Both IP v4 and IP v6 are supported
- **Geographic based access control:** You may configure custom rules to control access to your web applications based on country code a client IP is from
- **HTTP parameters filtering:** You may configure custom access rules based on matching http(s) request parameters including headers, URL, and query strings

## Azure-managed rules
- A preconfigured set of rules against common top OWASP vulnerabilities is enabled by default. At preview, the set of rules includes sqli and xss requests checking. Additional rules will be added. You may choose to start with log only action to validate preconfigured rules work as expected for your applications 

## Rate limiting
- A rate control rule is to limit abnormal high traffic from any client IP.  You may set a threshold on number of web requests allowed by a client IP during a one-minute duration.

## Centralized protection policy
- You may define several protection rules and add them to a Policy in priority order. Custom rules have higher priority than managed ruleset to allow exceptions. A single policy is associated to your web application.  Same web application protection policy is replicated to all edge servers at all locations, ensure consistent security policy in all regions

## Configuration
- During preview, you may use REST APIs, PowerShell, or CLI to create and deploy Front Door's application protection rules and policies. Portal access will be supported before service is generally available. 


## Monitoring
Front Door provides the ability to monitor web applications against attacks using real-time metrics that are integrated with Azure Monitor to track alerts and easily monitor trends.

## Pricing
Front Door's application layer security is free during the preview.


## Next steps

- Learn how to [create a Front Door](quickstart-create-front-door.md).
- Learn [how Front Door works](front-door-routing-architecture.md).
