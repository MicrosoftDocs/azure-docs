---
title: Azure Front Door - Application layer security | Microsoft Docs
description: This article helps you understand how Azure Front Door Standard/Premium enables you to protect and secure your application backend.
services: frontdoor
author: duongau
ms.service: frontdoor
ms.topic: conceptual
ms.date: 02/18/2021
ms.author: duau
---

> [!Note]
> This documentation is for Azure Front Door Standard/Premium (Preview). Looking for information on Azure Front Door? View [here](../front-door-overview.md).

> [!IMPORTANT]
> Azure Front Door Standard/Premium (Preview) is currently in public preview.
> This preview version is provided without a service level agreement, and it's not recommended for production workloads. Certain features might not be supported or might have constrained capabilities.
> For more information, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

# Application layer security with Front Door Standard/Premium

Azure Front Door Standard/Premium provides web application protection capabilities to safeguard your web applications from network attacks. Such as common web vulnerabilities exploit like SQL Injection or Cross Site Scripting (XSS). Enabled for HTTP or HTTPS front-ends, Front Door's application layer security gets globally distributed and is always on. Azure Front Door stops malicious attacks at Azure's network edge, which is kept away from your backends. With added security and performance optimization, Front Door Standard/Premium delivers a fast and secure web experiences to your end users.

## Application protection

Front Door's application protection gets configured at each edge environment around the world. The security measure is in line with your applications, and automatically blocks non-HTTP or HTTPS traffic from reaching your web applications. The multi-tenant distributed architecture enables global protection at scale without sacrificing performance. For HTTP and HTTPS workloads, Front Door's web application protection service provides a rich rules engine for custom rules, pre-configured Rule Set against common attacks. The application protection also has detailed logging for all requests that matches a rule. Flexible actions including allow, block, or log only are supported.

## Custom access control rules

* **IP allow list and block list:** You may configure custom rules to control access to your web applications based on list of client IP addresses. Both IP v4 and IP v6 are supported
* **Geographic based access control:** You may configure custom rules to control access to your web applications based on country code a client IP is from
* **HTTP parameters filtering:** You may configure custom access rules based on matching http(s) request parameters including headers, URL, and query strings

## Azure-managed rules

A pre-configured set of rules against common top OWASP vulnerabilities is enabled by default. At preview, the set of rules includes sqli and xss requests checking. Extra rules will be added. You may choose to start with log only action to validate pre-configured rules work as expected for your applications 

## Rate limiting

A rate control rule is to limit abnormal high traffic from any client IP.  You may set a threshold on number of web requests allowed by a client IP during a one-minute duration.

## Centralized protection policy

You may define several protection rules and add them to a Policy in priority order. Custom rules have higher priority than managed Rule Set to allow exceptions. A single policy is associated to your web application.  The same web application protection policy gets replicated to all edge servers at all locations to ensure consistent security policy in all regions.

## Configuration

During preview, you may use REST APIs, PowerShell, or CLI to create and deploy Front Door's application protection rules and policies. Portal access will be supported before service is generally available. 

## Monitoring
Front Door provides monitoring of web applications against attacks using real-time metrics that get integrated with Azure Monitor to track alerts and easily monitor trends.

## Pricing
Front Door's application layer security is free during the preview.

## Next steps

Learn how to [create a Front Door](create-front-door-portal.md).
