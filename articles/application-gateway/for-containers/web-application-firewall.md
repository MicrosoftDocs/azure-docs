---
title: Web Application Firewall on Application Gateway for Containers
description: This page provides an overview of the Web Application Firewall (WAF) on Application Gateway for Containers, including setup, limitations, known issues, and more.
services: application-gateway
author: jackstromberg
ms.service: azure-appgw-for-containers
ms.topic: how-to
ms.date: 7/22/2025
ms.author: jstrom
---

# Web Application Firewall on Application Gateway for Containers

Web Application Firewall (WAF) provides centralized protection of your web applications from common exploits and vulnerabilities. All WAF functionality exists inside of a WAF policy, which can be referenced at listener or path-based routing rules within Gateway API yaml configuration.

![Diagram depicting a request being blocked by a web application firewall rule.](./media/how-to-web-application-firewall-gateway-api/web-application-firewall.png)

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

Here is an example YAML configuration that shows targeting a specific path called `pathA` on an HTTPRoute resource:

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

* WAF Security Copilot
* WAF Security Copilot – Embedded
* JavaScript (JS) Challenge Actions
* CRS 3.2 and lower ruleset

## Pricing

WAF is incrementally billed in addition to Application Gateway for Containers. Two meters track WAF consumption: 

* AGC WAF Hour
* AGC 1M WAF Requests

An AGC WAF Hour is incurred for the duration a security policy has a WAF policy referenced.

As each request is processed by WAF rules or Bot Protection, a consumption rate is billed per 1 million requests.

> [!NOTE]
> Application Gateway for Containers + WAF is in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.
