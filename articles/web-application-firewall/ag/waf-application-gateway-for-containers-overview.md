---
title: Web Application Firewall on Application Gateway for Containers
description: Help protect your containerized applications with a web application firewall (WAF) on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 08/21/2026

#CustomerIntent: As a developer, I want to secure my containerized applications so that I can protect them from web vulnerabilities.
---

# What is Azure Web Application Firewall on Application Gateway for Containers?

Azure Web Application Firewall on [Azure Application Gateway for Containers](../../application-gateway/for-containers/overview.md) provides comprehensive protection for your Kubernetes workloads against common web vulnerabilities and attacks. For example, it addresses SQL injection, cross-site scripting (XSS), and other Open Web Application Security Project (OWASP) top 10 threats.

Application Gateway for Containers is an application-layer (Layer 7) solution for [load balancing](/azure/architecture/guide/technology-choices/load-balancing-overview) and dynamic traffic management. It's designed specifically for workloads running in Kubernetes clusters. It represents the evolution of the [Application Gateway Ingress Controller (AGIC)](../../application-gateway/ingress-controller-overview.md).

Azure Web Application Firewall provides real-time protection for these application-layer workloads through a set of proprietary managed rule sets and a framework for the creation of user-generated custom rules. All of these protections exist as part of a web application firewall (WAF) policy that's attached to your Application Gateway for Containers deployment via a `SecurityPolicy` resource.

### Required configuration steps

Enabling WAF on Application Gateway for Containers requires two separate configurations. WAF doesn't inspect traffic until you complete both:

1. **Azure configuration**: Create a `SecurityPolicy` child resource that references your WAF policy. You can create this resource by using the Azure portal, Azure CLI, Azure PowerShell, or an infrastructure-as-code tool such as Bicep or Terraform.
1. **Kubernetes configuration**: Apply a `WebApplicationFirewallPolicy` custom resource in your cluster. This resource references the same WAF policy and targets the Kubernetes resource that you want to protect.

> [!IMPORTANT]
> The Azure `SecurityPolicy` resource alone doesn't enable WAF protection. If you create the `SecurityPolicy` resource but don't apply a matching `WebApplicationFirewallPolicy` custom resource, the WAF policy appears as associated in the Azure portal and in Microsoft Defender for Cloud, but Application Gateway for Containers doesn't inspect any traffic. Because WAF never evaluates the traffic, it also doesn't generate any firewall logs. Complete both steps and then confirm that WAF is inspecting traffic before you rely on the policy for protection.

The following table summarizes what each configuration controls.

| Configuration | Where you create it | What it controls |
| --- | --- | --- |
| `SecurityPolicy` resource | Azure | Which WAF policies the ALB Controller can reference. |
| `WebApplicationFirewallPolicy` custom resource | Kubernetes cluster | Which WAF policy is applied, and the scope at which it's enforced. |

### Security policy

Application Gateway for Containers introduces a new child resource called `SecurityPolicy` in Azure Resource Manager. The `SecurityPolicy` resource brings scope to which Azure Web Application Firewall policies the ALB Controller can reference.

### Kubernetes custom resource

Application Gateway for Containers introduces a new custom resource called `WebApplicationFirewallPolicy`. This custom resource defines which Azure Web Application Firewall policy to use and at which scope.

The `WebApplicationFirewallPolicy` resource can target the following Kubernetes resources:

* `Gateway`
* `HTTPRoute`

It can also reference the following sections by name for further granularity:

* `Gateway`: `Listener`

#### Policy scope

The `targetRef` property in the `WebApplicationFirewallPolicy` custom resource determines the scope at which WAF is enforced. The Azure `SecurityPolicy` resource doesn't set this scope.

| `targetRef.kind` | Scope of enforcement |
| --- | --- |
| `Gateway` | All listeners and routes on the targeted `Gateway` resource. |
| `Gateway` with `sectionNames` | Only the named listeners on the targeted `Gateway` resource. |
| `HTTPRoute` | Only the routing rules and paths defined in the targeted `HTTPRoute` resource. |

> [!NOTE]
> Targeting a `Gateway` resource is the broadest scope available. To apply WAF to a single route, set `targetRef.kind` to `HTTPRoute` and name the specific route. If you target a `Gateway` resource when you intended route-level protection, the policy applies to all traffic that the `Gateway` resource handles.

### Example implementations

#### Scope a policy to a Gateway resource

Here's an example YAML configuration that shows targeting a Gateway resource, which applies to all listeners on a given Application Gateway for Containers' frontend resource.

> [!NOTE]
> This example applies the WAF policy to every listener and route on the targeted `Gateway` resource. If you need to protect a single route, use the [Scope policy across all routes and paths](#scope-policy-across-all-routes-and-paths) example instead.

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

Within a `Gateway` resource, you can define different hostnames by using different listeners (for example, contoso.com and fabrikam.com). If contoso.com is a hostname of listenerA and fabrikam.com is a hostname of listenerB, define the `sectionNames` property to select the proper listener (for example, listenerA for contoso.com).

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

To use different WAF policies for different paths of the same `Gateway` or Gateway -> Listener sectionName, define two HTTPRoute resources, each with a unique path, that each references its applicable WAF policy.

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

## Verify that WAF is active

After you complete both configuration steps, confirm that WAF is inspecting traffic before you switch the policy to prevention mode.

1. Review the status of the `WebApplicationFirewallPolicy` custom resource in your cluster:

   ```bash
   kubectl get webapplicationfirewallpolicy -n <namespace> -o yaml
   ```

   Review the status conditions on the resource and confirm that the policy was accepted and that its references resolved successfully. If `targetRef` names a resource or section that doesn't exist, the policy fails to attach and the status reports the reason.

1. Send test traffic to a protected route, and then review the WAF logs. Confirm that log entries appear and that the scope matches what you configured:

   - `policyScopeName` reports the type of scope that the WAF policy is assigned to, such as `Route`.
   - `policyScope` reports the Kubernetes resource reference that the scope applies to.

   For more information about these fields, see [Application Gateway for Containers logs](web-application-firewall-logs.md#AGC).

If no WAF log entries appear at all for traffic that you expect to be inspected, the Kubernetes configuration is likely incomplete. A WAF policy that isn't attached doesn't evaluate traffic, so it produces no log entries. Confirm that you applied the `WebApplicationFirewallPolicy` custom resource and that its `targetRef` names an existing resource.

## Limitations

The following functionality isn't supported on a WAF policy that's associated with an Application Gateway for Containers instance:

- **Cross-region, cross-subscription policy**: Your WAF policy must be in the same subscription and region as your Application Gateway for Containers resource.
- **Core Rule Set (CRS) managed rules**: An Application Gateway for Containers WAF supports only Default Rule Set (DRS) 2.1 managed rule set.
- **Legacy Bot Manager Rule Set**: Bot Manager Ruleset 0.1 isn't supported, but Bot Manager Ruleset versions 1.0 and 1.1 are supported.
- **JavaScript challenge actions on Bot Manager rules**: You can't set the action on a Bot Manager rule to JavaScript challenge.
- **Captcha challenge actions on Bot Manager rules**: You can't set the action on a Bot Manager rule to Captcha.
- **Microsoft Security Copilot**: The Security Copilot isn't supported on Application Gateway for Containers WAF.
- **Custom Block Response**: Setting a custom block response in your WAF policy isn't supported on Application Gateway for Containers WAF.
- **X-Forwarded-For Header (XFF)**: Application Gateway for Containers WAF doesn't support the XFF variable in custom rules.
- **HTTP DDoS Ruleset**: This managed ruleset isn't supported on Application Gateway for Containers.

## Pricing

For pricing details, see [Application Gateway for Containers pricing](../../application-gateway/for-containers/understanding-pricing.md).

## Related content

- [What is Azure Web Application Firewall?](../../web-application-firewall/overview.md)
- [What is Azure Web Application Firewall on Azure Application Gateway?](ag-overview.md)
- [Deploy Application Gateway for Containers ALB Controller](../../application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md)
