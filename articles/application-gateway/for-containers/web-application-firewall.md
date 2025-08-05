---
title: Azure Web Application Firewall on Application Gateway for Containers
description: This article provides an overview of Azure Web Application Firewall on Application Gateway for Containers, including setup, limitations, and pricing.
services: application-gateway
author: jackstromberg
ms.service: azure-appgw-for-containers
ms.topic: concept-article
ms.date: 7/22/2025
ms.author: jstrom
---

# Azure Web Application Firewall on Application Gateway for Containers

Azure Web Application Firewall provides centralized protection of your web applications from common exploits and vulnerabilities. All Azure Web Application Firewall functionality exists inside a policy, which can be referenced at listener or path-based routing rules within the Gateway API YAML configuration.

![Diagram that shows an Azure Web Application Firewall rule blocking a request.](./media/how-to-web-application-firewall-gateway-api/web-application-firewall.png)

## Application Gateway for Containers implementation

### Security policy

Application Gateway for Containers introduces a new child resource called `SecurityPolicy` in Azure Resource Manager. The `SecurityPolicy` resource brings scope to which Azure Web Application Firewall policies the ALB Controller can reference.

### Kubernetes custom resource

Application Gateway for Containers introduces a new custom resource called `WebApplicationFirewallPolicy`. The custom resource is responsible for defining which Azure Web Application Firewall policy should be used at which scope.

The resource can define the following scopes:

* `Gateway`
* `HTTPRoute`

In addition, the resource can reference the following sections by name for each of the parent resources:

* `Gateway`: `Listener`
* `HTTPRoute`: `Path`

Here's an example YAML configuration that shows targeting a specific path called `pathA` on an `HTTPRoute` resource:

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

The following functionality is not supported on an Azure Web Application Firewall policy that's associated with Application Gateway for Containers:

* Azure Web Application Firewall integration in Microsoft Security Copilot
* JavaScript challenge actions
* Core Rule Set (CRS) 3.2 and earlier rule sets

## Pricing

Azure Web Application Firewall is incrementally billed in addition to Application Gateway for Containers. Two meters track Azure Web Application Firewall consumption:

* **Application Gateway for Containers WAF Hour**
* **Application Gateway for Containers 1 million WAF Requests**

An **Application Gateway for Containers WAF Hour** rate is incurred for the duration that a security policy references an Azure Web Application Firewall policy.

As Azure Web Application Firewall rules or bot protection processes each request, a consumption rate is billed per 1 million requests.

> [!NOTE]
> The association of Application Gateway for Containers with Azure Web Application Firewall is in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).
