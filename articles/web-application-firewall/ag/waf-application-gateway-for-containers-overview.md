---
title: Web Application Firewall on Application Gateway for Containers
description: Help protect your containerized applications with a web application firewall (WAF) on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 11/10/2025

#CustomerIntent: As a developer, I want to secure my containerized applications so that I can protect them from web vulnerabilities.
---

# What is Azure Web Application Firewall on Application Gateway for Containers?

Azure Web Application Firewall on [Azure Application Gateway for Containers](../../application-gateway/for-containers/overview.md) provides comprehensive protection for your Kubernetes workloads against common web vulnerabilities and attacks. For example, it addresses SQL injection, cross-site scripting (XSS), and other Open Web Application Security Project (OWASP) top 10 threats.

Application Gateway for Containers is an application-layer (Layer 7) solution for [load balancing](/azure/architecture/guide/technology-choices/load-balancing-overview) and dynamic traffic management. It's designed specifically for workloads running in Kubernetes clusters. It represents the evolution of the [Application Gateway Ingress Controller (AGIC)](../../application-gateway/ingress-controller-overview.md).

Azure Web Application Firewall provides real-time protection for these application-layer workloads through a set of proprietary managed rule sets and a framework for the creation of user-generated custom rules. All of these protections exist as part of a web application firewall (WAF) policy that's attached to your Application Gateway for Containers deployment via a `SecurityPolicy` resource.

### Security policy

Application Gateway for Containers introduces a new child resource called `SecurityPolicy` in Azure Resource Manager. The `SecurityPolicy` resource brings scope to which Azure Web Application Firewall policies the ALB Controller can reference.

### Kubernetes custom resource

Application Gateway for Containers introduces a new custom resource called `WebApplicationFirewallPolicy`. The custom resource is responsible for defining which Azure Web Application Firewall policy should be used at which scope.

The WebApplicationFirewallPolicy resource can target the following Kubernetes resources:

* `Gateway`
* `HTTPRoute`

The WebApplicationFirewallPolicy resource can also reference the following sections by name for further granularity:

* `Gateway`: `Listener`

### Example implementations

#### Scope a policy to a Gateway resource

Here's an example YAML configuration that shows targeting a Gateway resource, which would apply to all listeners on a given Application Gateway for Containers' frontend resource.

```yaml
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: contoso-waf-route
    namespace: test-infra
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
```

#### Scope policy to a specific listener of a Gateway resource

Within a `Gateway` resource, you may have different hostnames defined by different listeners (e.g. contoso.com and fabrikam.com). If contoso.com is a hostname of listenerA and fabrikam.com is a hostname of listenerB, you can define the `sectionNames` property to select the proper listener (for example, listenerA for contoso.com).

```yaml
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: Gateway
    name: contoso-waf-route
    namespace: test-infra
    sectionNames: ["contoso-listener"]
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
```

#### Scope policy across all routes and paths

This example shows how to target a defined HTTPRoute resource to apply the policy to any routing rules and paths within a given HTTPRoute resource.

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
    name: contoso-pathA
    namespace: test-infra
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
  ```

#### Scope policy to a particular path

To use different WAF policies to different paths of the same `Gateway` or Gateway -> Listener sectionName, you can define two HTTPRoute resources, each with a unique path, that each references its applicable WAF policy.

```yaml
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy-A
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: contoso-pathA
    namespace: test-infra
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-0
---
apiVersion: alb.networking.azure.io/v1
kind: WebApplicationFirewallPolicy
metadata:
  name: sample-waf-policy-B
  namespace: test-infra
spec:
  targetRef:
    group: gateway.networking.k8s.io
    kind: HTTPRoute
    name: contoso-pathB
    namespace: test-infra
  webApplicationFirewall:
    id: /subscriptions/.../Microsoft.Network/applicationGatewayWebApplicationFirewallPolicies/waf-policy-1
```

## Limitations

The following functionality isn't supported on a WAF policy that's associated with an Application Gateway for Containers instance:

- **Cross-region, cross-subscription policy**: Your WAF policy must be in the same subscription and region as your Application Gateway for Containers resource.
- **Core Rule Set (CRS) managed rules**: An Application Gateway for Containers WAF supports only Default Rule Set (DRS) managed rule sets.
- **Legacy Bot Manager Rule Set**: Bot Manager Ruleset 0.1 isn't supported, but Bot Manager Ruleset versions 1.0 and 1.1 are supported.
- **JavaScript challenge actions on Bot Manager rules**: You can't set the action on a Bot Manager rule to JavaScript challenge.
- **Captcha challenge actions on Bot Manager rules**: You can't set the action on a Bot Manager rule to Captcha.
- **Microsoft Security Copilot**: The Security Copilot is not supported on Application Gateway for Containers WAF.
- **Custom Block Response**: Setting a custom block response in your WAF policy is not supported on Application Gateway for Containers WAF.
- **X-Forwarded-For Header (XFF)**: Application Gateway for Containers WAF doesn't support the XFF variable in custom rules.
- **HTTP DDoS Ruleset**: This managed ruleset isn't currenlty supported on Application Gateway for Containers.

## Pricing

For pricing details, see [Application Gateway for Containers pricing](../../application-gateway/for-containers/understanding-pricing.md).

## Related content

- [What is Azure Web Application Firewall?](../../web-application-firewall/overview.md)
- [What is Azure Web Application Firewall on Azure Application Gateway?](ag-overview.md)
- [Deploy Application Gateway for Containers ALB Controller](../../application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md)
