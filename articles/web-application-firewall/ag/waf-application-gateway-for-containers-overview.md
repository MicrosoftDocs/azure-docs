---
title: Web Application Firewall on Application Gateway for Containers (Preview)
description: Help protect your containerized applications with a web application firewall (WAF) on Azure Application Gateway.
author: halkazwini
ms.author: halkazwini
ms.service: azure-web-application-firewall
ms.topic: overview
ms.date: 07/22/2025

#CustomerIntent: As a developer, I want to secure my containerized applications so that I can protect them from web vulnerabilities.
---

# What is Azure Web Application Firewall on Application Gateway for Containers (preview)?

Azure Web Application Firewall on [Azure Application Gateway for Containers](../../application-gateway/for-containers/overview.md) provides comprehensive protection for your Kubernetes workloads against common web vulnerabilities and attacks. For example, it addresses SQL injection, cross-site scripting (XSS), and other Open Web Application Security Project (OWASP) top 10 threats.

Application Gateway for Containers is an application-layer (Layer 7) solution for [load balancing](/azure/architecture/guide/technology-choices/load-balancing-overview) and dynamic traffic management. It's designed specifically for workloads running in Kubernetes clusters. It represents the evolution of the [Application Gateway Ingress Controller (AGIC)](../../application-gateway/ingress-controller-overview.md).

Azure Web Application Firewall provides real-time protection for these application-layer workloads through a set of proprietary managed rule sets and a framework for the creation of user-generated custom rules. All of these protections exist as part of a web application firewall (WAF) policy that's attached to your Application Gateway for Containers deployment via a `SecurityPolicy` resource. You can apply these protections at the listener or route path level.

> [!IMPORTANT]
> Azure Web Application Firewall on Application Gateway for Containers is currently in preview. For legal terms that apply to Azure features that are in beta, in preview, or otherwise not yet released into general availability, see [Supplemental Terms of Use for Microsoft Azure Previews](https://azure.microsoft.com/support/legal/preview-supplemental-terms/).

## Configuration

To use Azure Web Application Firewall on your Application Gateway for Containers deployment, you need to attach your [WAF policy](create-waf-policy-ag.md) via a `SecurityPolicy` resource. This new Azure Resource Manager child resource is part of the Application Gateway for Containers integration. It's referenced by your Application Load Balancer (ALB) Controller and helps define the scope of how your WAF policy is applied to your application's traffic.

Application Gateway for Containers also introduces a new resource called `WebApplicationFirewallPolicy`. This custom resource defines at which point the WAF policy is applied. You can configure it at the listener or route path level, via your Kubernetes resource's YAML file.

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

The following functionality isn't supported on a WAF policy that's associated with an Application Gateway for Containers instance:

- **Cross-region, cross-subscription policy**: Your WAF policy must be in the same subscription and region as your Application Gateway for Containers resource.
- **Core Rule Set (CRS) managed rules**: An Application Gateway for Containers WAF supports only Default Rule Set (DRS) managed rule sets.
- **Legacy Bot Manager Rule Set**: Bot Manager Rule Set 0.1 isn't supported, but all newer Bot Manager Rule Set versions are supported.
- **JavaScript challenge actions on Bot Manager rules**: You can't set the action on a Bot Manager rule to JavaScript challenge during the preview.
- **Microsoft Security Copilot**: This offering isn't supported during the preview.

## Related content

- [What is Azure Web Application Firewall?](../../web-application-firewall/overview.md)
- [What is Azure Web Application Firewall on Azure Application Gateway?](ag-overview.md)
- [Deploy Application Gateway for Containers ALB Controller](../../application-gateway/for-containers/quickstart-deploy-application-gateway-for-containers-alb-controller.md)
