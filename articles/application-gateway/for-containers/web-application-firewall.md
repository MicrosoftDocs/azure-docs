---
title: Web Application Firewall on Application Gateway for Containers
description: This page provides an overview of the Web Application Firewall (WAF) on Application Gateway for Containers, including setup, limitations, known issues, and more.
services: application-gateway
author: greg-lindsay
ms.service: azure-appgw-for-containers
ms.topic: how-to
ms.date: 7/1/2025
ms.author: greglin
---

# Web Application Firewall on Application Gateway for Containers

## Overview

Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities. All WAF functionality exists inside of a WAF policy, which can be referenced at listener or path-based routing rules within Gateway or Ingress yaml configuration.

## Benefits

This section describes the core benefits that WAF on Application Gateway for Containers provides.

### Protection

* Protect your web applications from web vulnerabilities and attacks without modification to back-end code.
* Protect multiple web applications at the same time.
* Create custom WAF policies for different sites behind the same WAF.
* Protect your web applications from malicious bots with the IP Reputation ruleset.

### Monitoring

* Monitor attacks against your web applications by using a WAF log. The log is integrated with Azure Monitor to track WAF alerts and easily monitor trends.
* The Application Gateway for Containers WAF is integrated with Microsoft Defender for Cloud. Defender for Cloud provides a central view of the security state of all your Azure, hybrid, and multicloud resources.

### Customization

* Customize WAF rules and rule groups to suit your application requirements and eliminate false positives.
* Associate a WAF Policy for each site behind your WAF to allow for site-specific configuration
* Create custom rules to suit the needs of your application

## Features

* SQL injection protection.
* Cross-site scripting protection.
* Protection against other common web attacks, such as command injection, HTTP request smuggling, HTTP response splitting, and remote file inclusion.
* Protection against HTTP protocol violations.
* Protection against HTTP protocol anomalies, such as missing host user-agent and accept headers.
* Protection against crawlers and scanners.
* Detection of common application misconfigurations (for example, Apache and IIS).
* Configurable request size limits with lower and upper bounds.
* Exclusion lists let you omit certain request attributes from a WAF evaluation. A common example is Active Directory-inserted tokens that are used for authentication or password fields.
* Create custom rules to suit the specific needs of your applications.
* Geo-filter traffic to allow or block certain countries/regions from gaining access to your applications.
* Protect your applications from bots with the bot mitigation ruleset.
* Inspect JSON and XML in the request body

## Application Gateway for Containers implementation

### Security Policy

Application Gateway for Containers introduces a new child resource in Azure Resource Manager (ARM), called a SecurityPolicy. The SecurityPolicy is what brings scope to which WAF policies may be referenced by the ALB Controller.

### Kubernetes Custom Resource

Application Gateway for Containers introduces a new custom resource called `WebApplicationFirewallPolicy`. The custom resource is responsible for defining which WAF Policy should be used at which scope.

The following scopes may be defined:

* Gateway
* HTTPRoute

In addition, the following sections may be referenced by name for each of the parent resources:

* Gateway - Listener
* HTTPRoute - Path

Here is an example YAML configuration that shows targetting a specific path called `pathA` on an HTTPRoute resource:

```yaml
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: contoso-waf-route
    namespace: test-infra
    sectionNames: ["pathA"]
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
```

## Limitations

The following functionality is not supported on a WAF Policy associated with Application Gateway for Containers:

* **Rate Limiting Custom Rules:** Not supported, but planned.
* **Java Script (JS) Challenge Actions:** Not supported, but planned.
* **CRS 3.2 and lower rulset:** Not supported, not planned.

## Pricing

The WAF component will be billed separately from Application Gateway for Containers.  Two meters are introduced:

* AGC WAF Hour
* AGC 1M WAF Requests

An AGC WAF Hour is incurred for the duration a security policy has a WAF policy referenced.

As each request is processed by WAF rules or Bot Protection, a consumption rate is billed per 1 million requests.

> [!NOTE]
> Application Gateway for Containers + WAF is in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
