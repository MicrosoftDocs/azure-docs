---
title: Web Application Firewall on Application Gateway for Containers (Preview)
description: Protect your containerized applications with a Web Application Firewall (WAF) on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 07/22/2025

#CustomerIntent: As a developer, I want to secure my containerized applications so that I can protect them from web vulnerabilities.
---

# What is Web Application Firewall on Application Gateway for Containers (Preview)?

> [!IMPORTANT]
> Web Application Firewall on Application Gateway for Containers is currently in PREVIEW.
> See the [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/) for legal terms that apply to Azure features that are in beta, preview, or otherwise not yet released into general availability.


Web Application Firewall (WAF) on [Azure Application Gateway for Containers](../../application-gateway/for-containers/overview.md) provides comprehensive protection for your Kubernetes workloads against common web vulnerabilities and attacks, including SQL injection, cross-site scripting (XSS), and other OWASP Top 10 threats.

Application Gateway for Containers is an application layer (Layer 7) [load balancing](/azure/architecture/guide/technology-choices/load-balancing-overview) and dynamic traffic management solution designed specifically for workloads running in Kubernetes clusters. It represents the evolution of the [Application Gateway Ingress Controller (AGIC)](../../application-gateway/ingress-controller-overview.md). Azure WAF provides real time protection for these application layer workloads through a set of proprietary managed rulesets and a framework for the creation of user generated custom rules. All of these WAF protections exist as part of a WAF policy that is attached to your Application Gateway for Containers deployment via a Security Policy resource and can be applied at the listener or route path levels.

## Configuration

To use WAF on your Application Gateway for Containers deployment, you need to attach your [WAF policy](create-waf-policy-ag.md) via a Security Policy. The Security Policy is a new Azure Resource Manager child resource that's part of the Application Gateway for Containers integration. It's referenced by your Application Load Balancer (ALB) controller and helps define the scope of how your WAF policy is applied to your application's traffic.

Application Gateway for Containers also introduces a new resource called `WebApplicationFirewallPolicy`. This custom resource defines at which point the WAF policy is applied and can be configured at the listener or route path level. This configuration is done via your Kubernetes resource's YAML file.

Here's an example YAML configuration that shows targeting a specific path called `pathA` on an HTTP Route resource:

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

The following functionality isn't supported on a WAF Policy associated with an Application Gateway for Containers instance:

- **Cross region cross subscription**: Your WAF policy must be in the same subscription and region as your Application Gateway for Containers resource.
- **Core Rule Set (CRS) managed rules**: Application Gateway for Containers WAF only supports Default Rule Set (DRS) managed rulesets.
- **Legacy Bot Manager ruleset**: Bot Manager ruleset 0.1 isn't supported, but all newer Bot Manager ruleset versions are supported.
- **JavaScript Challenge actions on Bot Manager rules**: You can't set the Action on a Bot Manager rule to JavaScript Challenge during the preview.
- **Microsoft Security Copilot**: Isn't supported during the preview.

## Pricing

WAF usage is billed separately from Application Gateway for Containers usage. When you enable WAF on your Application Gateway for Containers resource, two additional WAF-specific meters are added to your bill:

- **Application Gateway for Containers WAF Hour**: A fixed cost charged for the duration that a Security Policy references a WAF policy.
- **Application Gateway for Containers 1 million WAF Requests**: A consumption-based meter that bills per 1 million requests processed by the WAF and charges for each enabled ruleset (for example, if you enable both the Default Ruleset (DRS) and the Bot Manager Ruleset, you're billed for two rulesets).

For more pricing information, see [Application Gateway pricing](https://azure.microsoft.com/pricing/details/application-gateway) and [Web Application Firewall pricing](https://azure.microsoft.com/pricing/details/web-application-firewall).

## Related Content

- [Azure Web Application Firewall](../../web-application-firewall/overview.md)
- [Azure Web Application Firewall on Azure Application Gateway](ag-overview.md)
- [Deploy Application Gateway for Containers ALB Controller](../../application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md)

